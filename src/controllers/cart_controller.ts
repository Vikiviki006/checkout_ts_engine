import { Request, Response } from "express";

import { CartService } from "../services/cart_service";

const cartService = new CartService();


// ========================================
// CREATE CART
// POST /api/carts
// ========================================

export async function createCart(
    req: Request,
    res: Response
) {
    try {

        // Check that body exists
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing"
            });
        }

        const {
            customerEmail
        } = req.body;

        const cart =
            await cartService.createCart({
                customerEmail
            });

        return res.status(201).json({
            success: true,
            data: cart
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
}


// ========================================
// ADD CART ITEM
// POST /api/carts/:cartId/items
// ========================================

export async function addCartItem(
    req: Request<{ cartId: string }>,
    res: Response
) {
    try {

        const cartId =
            req.params.cartId;

        if (!cartId) {
            return res.status(400).json({
                success: false,
                message: "Cart ID is required"
            });
        }


        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing"
            });
        }


        const {
            productId,
            quantity
        } = req.body;


        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "productId is required"
            });
        }


        if (
            !quantity ||
            quantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "quantity must be greater than 0"
            });
        }


        const cartItem =
            await cartService.addItem(
                cartId,
                {
                    productId,
                    quantity
                }
            );


        return res.status(201).json({
            success: true,
            data: cartItem
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
}


// ========================================
// GET CART
// GET /api/carts/:cartId
// ========================================

export async function getCart(
    req: Request<{ cartId: string }>,
    res: Response
) {
    try {

        const cartId =
            req.params.cartId;


        if (!cartId) {
            return res.status(400).json({
                success: false,
                message: "Cart ID is required"
            });
        }


        const cart =
            await cartService.getCart(
                cartId
            );


        return res.json({
            success: true,
            data: cart
        });

    } catch (error: any) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
}