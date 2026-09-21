import { supabase } from "../config/supabase";

import type {
    CreateCartRequest,
    AddCartItemRequest,
    Cart,
    CartItem,
    Product,
    CartWithItems
} from "./cart_types";


export class CartService {

    async createCart(
        data: CreateCartRequest
    ): Promise<Cart> {

        const {
            data: cart,
            error
        } = await supabase
            .from("carts")
            .insert({
                customer_email: data.customerEmail,
                status: "active"
            })
            .select()
            .single();


        if (error) {
            throw new Error(
                `Failed to create cart: ${error.message}`
            );
        }
        if (!cart) {
            throw new Error(
                "Failed to create cart"
            );
        }

        const result: Cart = cart as Cart;

        return result;
    }
    async addItem(
        cartId: string,
        data: AddCartItemRequest
    ): Promise<CartItem> {

        const {
            data: product,
            error: productError
        } = await supabase
            .from("products")
            .select("*")
            .eq("id", data.productid)
            .single();


        if (productError || !product) {
            throw new Error(
                "Product not found"
            );
        }


        const typedProduct: Product =
            product as Product;

        const requestedQuantity: number =
            data.quantity;

        const availableStock: number =
            typedProduct.stock;


        if (requestedQuantity <= 0) {
            throw new Error(
                "Quantity must be greater than 0"
            );
        }


        if (requestedQuantity > availableStock) {
            throw new Error(
                `Only ${availableStock} units available`
            );
        }

        const {
            data: existingItem,
            error: existingItemError
        } = await supabase
            .from("cart_items")
            .select("*")
            .eq("cart_id", cartId)
            .eq("product_id", data.productid)
            .maybeSingle();


        if (existingItemError) {
            throw new Error(
                `Failed to check cart item: ${existingItemError.message}`
            );
        }

        if (existingItem) {

            const typedExistingItem: CartItem =
                existingItem as CartItem;


            const currentQuantity: number =
                typedExistingItem.quantity;


            const newQuantity: number =
                currentQuantity +
                requestedQuantity;

            if (newQuantity > availableStock) {
                throw new Error(
                    `Requested quantity exceeds available stock. ` +
                    `Only ${availableStock} units available`
                );
            }
            const {
                data: updatedItem,
                error: updateError
            } = await supabase
                .from("cart_items")
                .update({
                    quantity: newQuantity
                })
                .eq("id", typedExistingItem.id)
                .select()
                .single();


            if (updateError) {
                throw new Error(
                    `Failed to update cart item: ${updateError.message}`
                );
            }

            if (!updatedItem) {
                throw new Error(
                    "Failed to update cart item"
                );
            }


            const result: CartItem =
                updatedItem as CartItem;


            return result;
        }

        const {
            data: cartItem,
            error: cartItemError
        } = await supabase
            .from("cart_items")
            .insert({
                cart_id: cartId,
                product_id: data.productid,
                quantity: requestedQuantity
            })
            .select()
            .single();


        if (cartItemError) {
            throw new Error(
                `Failed to create cart item: ${cartItemError.message}`
            );
        }


        if (!cartItem) {
            throw new Error(
                "Failed to create cart item"
            );
        }


        const result: CartItem =
            cartItem as CartItem;


        return result;
    }

    async getCart(
        cartId: string
    ): Promise<CartWithItems> {

        const {
            data,
            error
        } = await supabase
            .from("carts")
            .select(`
                *,
                cart_items (
                    id,
                    quantity,
                    product_id,
                    products (
                        id,
                        name,
                        description,
                        price,
                        stock,
                        categories (
                            id,
                            name
                        )
                    )
                )
            `)
            .eq("id", cartId)
            .single();


        if (error) {
            throw new Error(
                `Failed to fetch cart: ${error.message}`
            );
        }


        if (!data) {
            throw new Error(
                "Cart not found"
            );
        }

        const result: CartWithItems =
            data as CartWithItems;
        return result;
    }
}