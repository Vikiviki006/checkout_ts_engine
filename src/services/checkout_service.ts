import { supabase } from "../config/supabase";

import {
    CreateOrderRequest,
    UpdateOrderRequest
} from "../types/order_types";
export class CheckoutService {
    async createOrder(
        data: CreateOrderRequest
    ) {
        const { data: cart, error: cartError } =
            await supabase
                .from("carts")
                .select(`
                    *,
                    cart_items (id,product_id,quantity,
                        products (id,name,price,stock))
                `)
                .eq("id", data.cartId)
                .single();
        if (cartError || !cart) {
            throw new Error(
                "Cart not found"
            );
        }
        if (cart.status !== "active") {
            throw new Error(
                "Cart is no longer active"
            );
        }
        if (
            !cart.cart_items ||
            cart.cart_items.length === 0
        ) {

            throw new Error(
                "Cart is empty"
            );

        }
        let totalAmount = 0;
        const orderItems =
            cart.cart_items.map(
                (item: any) => {
                    const product =
                        item.products;
                    if (!product) {
                        throw new Error(
                            "Product not found"
                        );
                    }
                    if (
                        product.stock <
                        item.quantity
                    ) {
                        throw new Error(
                            `Not enough stock for ${product.name}`
                        );

                    }
                    const unitPrice =
                        Number(product.price);
                    const subtotal =
                        unitPrice *
                        item.quantity;
                    totalAmount += subtotal;
                    return {
                        product_id:product.id,
                        quantity:item.quantity,
                        unit_price:unitPrice,
                        subtotal
                    };
                }
            );
        const { data: order, error: orderError } =
            await supabase
                .from("orders")
                .insert({
                    cart_id:
                        data.cartId,
                    customer_name:
                        data.customerName,
                    customer_email:
                        data.customerEmail,
                    shipping_address:
                        data.shippingAddress,
                    status:
                        "pending",
                    total_amount:
                        totalAmount
                })
                .select()
                .single();
        if (orderError) {
            throw new Error(
                orderError.message
            );
        }
        const itemsToInsert =
            orderItems.map(
                (item: any) => ({
                    ...item,
                    order_id:
                        order.id
                })
            );
        const {
            data: createdItems,
            error: itemsError
        } = await supabase
            .from("order_items")
            .insert(itemsToInsert)
            .select();
        if (itemsError) {
            throw new Error(
                itemsError.message
            );
        }
        for (
            const item of cart.cart_items
        ) {
            const product =
                item.products;
            const newStock =
                product.stock -
                item.quantity;
            await supabase
                .from("products")
                .update({
                    stock: newStock
                })
                .eq(
                    "id",
                    product.id
                );
        }
        await supabase
            .from("carts")
            .update({
                status:
                    "checked_out",
                updated_at:
                    new Date().toISOString()
            })
            .eq(
                "id",
                data.cartId
            );

        return {
            order,
            items:createdItems

        };

    }

    async getAllOrders() {


        const {
            data,
            error
        } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    *,
                    products (
                        *,
                        categories (*)
                    )
                )
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );
        if (error) {
            throw new Error(
                error.message
            );
        }
        return data;
    }
    async getOrderById(
        id: string
    ) {
        const {
            data,
            error
        } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    *,
                    products (
                        *,
                        categories (*)
                    )
                )
            `)
            .eq(
                "id",
                id
            )
            .single();
        if (error || !data) {

            throw new Error(
                "Order not found"
            );

        }
        return data;
    }
    async updateOrder(
        id: string,
        data: UpdateOrderRequest
    ) {
        const {
            data: updatedOrder,
            error
        } = await supabase
            .from("orders")
            .update({

                ...data,

                updated_at:
                    new Date().toISOString()

            })
            .eq(
                "id",
                id
            )
            .select()
            .single();
        if (error || !updatedOrder) {
            throw new Error(
                "Order not found"
            );
        }
        return updatedOrder;
    }
    async filterOrders(
        status?: string,
        customerEmail?: string
    ) {


        let query =
            supabase
                .from("orders")
                .select(`
                    *,
                    order_items (
                        *,
                        products (
                            *,
                            categories (*)
                        )
                    )
                `);


        if (status) {

            query =
                query.eq(
                    "status",
                    status
                );

        }
        if (customerEmail) {
            query =
                query.eq(
                    "customer_email",
                    customerEmail
                );
        }
        const {
            data,
            error
        } = await query
            .order(
                "created_at",
                {
                    ascending: false
                }
            );
        if (error) {
            throw new Error(
                error.message
            );
        }
        return data;
    }
}