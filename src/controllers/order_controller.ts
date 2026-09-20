import { Request, Response } from "express";

import { CheckoutService } from "../services/checkout_service";
import {OrderFilterQuery} from "../types/order_types"

const checkoutService = new CheckoutService();
export async function createOrder(
    req: Request,
    res: Response
) {
    try {
        console.log("CREATE ORDER BODY:", req.body);
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing"
            });
        }
        const {
            cartId,
            customerName,
            customerEmail,
            shippingAddress
        } = req.body;
        if (!cartId) {
            return res.status(400).json({
                success: false,
                message: "cartId is required"
            });
        }
        if (!customerName) {
            return res.status(400).json({
                success: false,
                message: "customerName is required"
            });
        }
        if (!customerEmail) {
            return res.status(400).json({
                success: false,
                message: "customerEmail is required"
            });
        }
        const order =
            await checkoutService.createOrder({
                cartId,
                customerName,
                customerEmail,
                shippingAddress
            });


        return res.status(201).json({
            success: true,
            data: order
        });

    } catch (error: any) {

        console.error(
            "CREATE ORDER ERROR:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
}
export async function getAllOrders(
    req: Request,
    res: Response
) {
    try {

        const orders =
            await checkoutService.getAllOrders();


        return res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error: any) {

        console.error(
            "GET ALL ORDERS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
export async function getOneOrder(
    req: Request<{ id: string }>,
    res: Response
) {
    try {

        const orderId =
            req.params.id;


        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }


        const order =
            await checkoutService.getOrderById(
                orderId
            );


        return res.status(200).json({
            success: true,
            data: order
        });

    } catch (error: any) {

        console.error(
            "GET ORDER ERROR:",
            error
        );

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
}

export async function updateOrder(
    req: Request<{ id: string }>,
    res: Response
) {
    try {

        const orderId =
            req.params.id;


        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }


        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing"
            });
        }


        const {
            status,
            shippingAddress
        } = req.body;


        if (
            status === undefined &&
            shippingAddress === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one field is required to update"
            });
        }


        const order =
            await checkoutService.updateOrder(
                orderId,
                {
                    status,
                    shippingAddress
                }
            );


        return res.status(200).json({
            success: true,
            data: order
        });

    } catch (error: any) {

        console.error(
            "UPDATE ORDER ERROR:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
}

export async function filterOrders(
    req: Request<
        {},
        {},
        {},
        OrderFilterQuery
    >,
    res: Response
) {
    try {

        const status =
            req.query.status;

        const customerEmail =
            req.query.customerEmail;


        const orders =
            await checkoutService.filterOrders(
                status,
                customerEmail
            );


        return res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error: any) {

        console.error(
            "FILTER ORDERS ERROR:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
}