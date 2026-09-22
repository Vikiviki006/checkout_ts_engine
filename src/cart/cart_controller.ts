import { Request, Response } from "express";

import { CartService } from "./cart_service";

import type {
    CreateCartRequest,
    AddCartItemRequest,
    CartIdParams,
    Cart,
    CartItem,
    ApiResponse
} from "./cart_types";


const cartService = new CartService();

export async function createCart(
    req: Request<Record<string, never>, ApiResponse<Cart>, CreateCartRequest>,
    res: Response<ApiResponse<Cart>>
): Promise<void> {

    try {

        const {
            customerEmail
        }: CreateCartRequest = req.body;
        if (!customerEmail) {
            res.status(400).json({
                success: false,
                message: "customerEmail is required"
            });

            return;
        }

        const cart: Cart =
            await cartService.createCart({
                customerEmail
            });


        res.status(201).json({
            success: true,
            data: cart
        });

    } catch (error: unknown) {

        const message: string =
            error instanceof Error
                ? error.message
                : "Failed to create cart";

        res.status(400).json({
            success: false,
            message
        });
    }
}

export async function addCartItem(
    req: Request<
        CartIdParams,
        ApiResponse<CartItem>,
        AddCartItemRequest
    >,
    res: Response<ApiResponse<CartItem>>
): Promise<void> {
    try {
        const {
            cartId
        }: CartIdParams = req.params;
        const {
            productid,
            quantity
        }: AddCartItemRequest = req.body;
        if (!cartId) {

            res.status(400).json({
                success: false,
                message: "Cart ID is required"
            });

            return;
        }
        if (!productid) {

            res.status(400).json({
                success: false,
                message: "productid is required"
            });

            return;
        }
        if (quantity <= 0) {

            res.status(400).json({
                success: false,
                message: "quantity must be greater than 0"
            });

            return;
        }
        const cartItem: CartItem =
            await cartService.addItem(
                cartId,
                {
                    productid,
                    quantity
                }
            );


        res.status(201).json({
            success: true,
            data: cartItem
        });

    } catch (error: unknown) {

        const message: string =
            error instanceof Error
                ? error.message
                : "Failed to add cart item";


        res.status(400).json({
            success: false,
            message
        });
    }
}
export async function getCart(
    req: Request<
        CartIdParams,
        ApiResponse<Cart>,
        Record<string, never>
    >,
    res: Response<ApiResponse<Cart>>
): Promise<void> {

    try {

        const {
            cartId
        }: CartIdParams = req.params;
        if (!cartId) {

            res.status(400).json({
                success: false,
                message: "Cart ID is required"
            });

            return;
        }
        const cart: Cart =
            await cartService.getCart(cartId);


        res.status(200).json({
            success: true,
            data: cart
        });

    } catch (error: unknown) {

        const message: string =
            error instanceof Error
                ? error.message
                : "Cart not found";


        res.status(404).json({
            success: false,
            message
        });
    }
}