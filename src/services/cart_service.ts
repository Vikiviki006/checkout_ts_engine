import { supabase } from "../config/supabase";

import {
    CreateCartRequest,
    AddCartItemRequest
} from "../types/cart_types";


export class CartService {

    // ========================================
    // CREATE CART
    // ========================================

    async createCart(data: CreateCartRequest) {

        const { data: cart, error } =
            await supabase
                .from("carts")
                .insert({
                    customer_email: data.customerEmail,
                    status: "active"
                })
                .select()
                .single();

        if (error) {
            throw new Error(error.message);
        }

        return cart;
    }


    // ========================================
    // ADD ITEM TO CART
    // ========================================

    async addItem(
        cartId: string,
        data: AddCartItemRequest
    ) {

        // ------------------------------------
        // Check product
        // ------------------------------------

        const { data: product, error: productError } =
            await supabase
                .from("products")
                .select("*")
                .eq("id", data.productId)
                .single();

        if (productError || !product) {
            throw new Error("Product not found");
        }


        // ------------------------------------
        // Check stock
        // ------------------------------------

        if (product.stock < data.quantity) {

            throw new Error(
                `Only ${product.stock} units available`
            );

        }


        // ------------------------------------
        // Check existing cart item
        // ------------------------------------

        const { data: existingItem } =
            await supabase
                .from("cart_items")
                .select("*")
                .eq("cart_id", cartId)
                .eq("product_id", data.productId)
                .maybeSingle();


        if (existingItem) {

            const newQuantity =
                existingItem.quantity + data.quantity;


            if (newQuantity > product.stock) {

                throw new Error(
                    "Requested quantity exceeds stock"
                );

            }


            const { data: updatedItem, error } =
                await supabase
                    .from("cart_items")
                    .update({
                        quantity: newQuantity
                    })
                    .eq("id", existingItem.id)
                    .select()
                    .single();


            if (error) {
                throw new Error(error.message);
            }


            return updatedItem;
        }


        // ------------------------------------
        // Create new cart item
        // ------------------------------------

        const { data: cartItem, error } =
            await supabase
                .from("cart_items")
                .insert({
                    cart_id: cartId,
                    product_id: data.productId,
                    quantity: data.quantity
                })
                .select()
                .single();


        if (error) {
            throw new Error(error.message);
        }


        return cartItem;
    }


    // ========================================
    // GET CART
    // ========================================

    async getCart(cartId: string) {

        const { data, error } =
            await supabase
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
            throw new Error("Cart not found");
        }


        return data;
    }
}