import { supabase } from "../config/supabase";

import type {
    CreateOrderRequest,
    UpdateOrderRequest,
    OrderFilterQuery,
    Order,
    OrderItem,
    OrderWithItems,
    CreateOrderResult,
    CheckoutCart,
    CheckoutCartItem,
    Product,
    CreateOrderItem
} from "./order_types";


export class CheckoutService {

    async createOrder(
        data: CreateOrderRequest
    ): Promise<CreateOrderResult> {

        const {
            data: cart,
            error: cartError
        } = await supabase
            .from("carts")
            .select(`
                *,
                cart_items (
                    id,
                    product_id,
                    quantity,
                    products (
                        id,
                        name,
                        price,
                        stock
                    )
                )
            `)
            .eq(
                "id",
                data.cartId
            )
            .single();


        if (cartError || !cart) {
            throw new Error(
                "Cart not found"
            );
        }


        const checkoutCart: CheckoutCart =
            cart as CheckoutCart;

        if (
            checkoutCart.status !==
            "active"
        ) {
            throw new Error(
                "Cart is no longer active"
            );
        }

        if (
            !checkoutCart.cart_items ||
            checkoutCart.cart_items.length === 0
        ) {
            throw new Error(
                "Cart is empty"
            );
        }

        let totalAmount: number = 0;


        const orderItems: CreateOrderItem[] =
            checkoutCart.cart_items.map(
                (
                    item: CheckoutCartItem
                ): CreateOrderItem => {

                    const product:
                        Product | null =
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

                    const unitPrice: number =
                        Number(product.price);


                    const subtotal: number =
                        unitPrice *
                        item.quantity;


                    totalAmount += subtotal;


                    return {
                        product_id: product.id,
                        quantity: item.quantity,
                        unit_price: unitPrice,
                        subtotal
                    };
                }
            );

        const {
            data: order,
            error: orderError
        } = await supabase
            .from("orders")
            .insert({
                cart_id: data.cartId,
                customer_name:
                    data.customerName,
                customer_email:
                    data.customerEmail,
                shipping_address:
                    data.shippingAddress,
                status: "pending",
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


        if (!order) {
            throw new Error(
                "Failed to create order"
            );
        }


        const createdOrder: Order =
            order as Order;

        const itemsToInsert =
            orderItems.map(
                (
                    item: CreateOrderItem
                ) => ({
                    ...item,
                    order_id:
                        createdOrder.id
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


        if (!createdItems) {
            throw new Error(
                "Failed to create order items"
            );
        }


        const typedCreatedItems:
            OrderItem[] =
            createdItems as OrderItem[];

        for (
            const item
            of checkoutCart.cart_items
        ) {

            const product:
                Product | null =
                item.products;
            if (!product) {
                throw new Error(
                    "Product not found"
                );
            }

            const newStock: number =
                product.stock -
                item.quantity;
            const {
                error: stockError
            } = await supabase
                .from("products")
                .update({
                    stock: newStock
                })
                .eq(
                    "id",
                    product.id
                );
            if (stockError) {
                throw new Error(
                    `Failed to update stock: ${stockError.message}`
                );
            }
        }
        const {
            error: cartUpdateError
        } = await supabase
            .from("carts")
            .update({
                status: "checked_out",
                updated_at:
                    new Date().toISOString()
            })
            .eq(
                "id",
                data.cartId
            );


        if (cartUpdateError) {
            throw new Error(
                `Failed to update cart: ${cartUpdateError.message}`
            );
        }

        const result: CreateOrderResult = {
            order: createdOrder,
            items: typedCreatedItems
        };


        return result;
    }

    async getAllOrders(): Promise<OrderWithItems[]> {

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


        if (!data) {
            return [];
        }


        return data as OrderWithItems[];
    }

    async getOrderById(
        id: string
    ): Promise<OrderWithItems> {

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


        return data as OrderWithItems;
    }

    async updateOrder(
        id: string,
        data: UpdateOrderRequest
    ): Promise<Order> {

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


        return updatedOrder as Order;
    }

    async filterOrders(
        status?: OrderFilterQuery["status"],
        customerEmail?: string
    ): Promise<OrderWithItems[]> {

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

            query = query.eq(
                "status",
                status
            );
        }

        if (customerEmail) {

            query = query.eq(
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

        if (!data) {
            return [];
        }
        return data as OrderWithItems[];
    }
}