import { supabase } from "../config/supabase";

import {
    CreateCartRequest,
    AddCartItemRequest
} from "../types/cart_types";
export class CartService {
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

    async addItem(
        cartId: string,
        data: AddCartItemRequest
    ) {

        const { data: product, error: productError } =
            await supabase
                .from("products")
                .select("*")
                .eq("id", data.productid)
                .single();

        if (productError || !product) {
            throw new Error("Product not found");
        }

        if (product.stock < data.quantity) {

            throw new Error(
                `Only ${product.stock} units available`
            );

        }


        const { data: existingItem } =
            await supabase
                .from("cart_items")
                .select("*")
                .eq("cart_id", cartId)
                .eq("product_id", data.productid)
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


        const { data: cartItem, error } =
            await supabase
                .from("cart_items")
                .insert({
                    cart_id: cartId,
                    product_id: data.productid,
                    quantity: data.quantity
                })
                .select()
                .single();


        if (error) {
            throw new Error(error.message);
        }


        return cartItem;
    }


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