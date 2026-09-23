import type {
    Request,
    Response
} from "express";

import { CheckoutService } from "./order_service";

import type {
    CreateOrderRequest,
    CreateOrderResult,
    UpdateOrderRequest,
    OrderFilterQuery,
    OrderIdParams,
    Order,
    OrderWithItems,
    ApiResponse,
    PlaceOrderRequest,PlaceOrderResult
} from "./order_types";


const checkoutService: CheckoutService =
    new CheckoutService();


export class OrderController {

    async createOrder(
        req: Request<
            Record<string, never>,
            ApiResponse<CreateOrderResult>,
            CreateOrderRequest
        >,
        res: Response<
            ApiResponse<CreateOrderResult>
        >
    ): Promise<void> {

        try {

            const requestData:
                CreateOrderRequest =
                req.body;

            const result:
                CreateOrderResult =
                await checkoutService.createOrder(
                    requestData
                );

            const response:
                ApiResponse<CreateOrderResult> = {
                    success: true,
                    message: "Order created successfully",
                    data: result
                };

            res.status(201).json(
                response
            );

        } catch (error: unknown) {

            const message: string =
                error instanceof Error
                    ? error.message
                    : "Failed to create order";

            const response:
                ApiResponse<never> = {
                    success: false,
                    message
                };

            res.status(400).json(
                response
            );
        }
    }
    async getAllOrders(
        req: Request<
            Record<string, never>,
            ApiResponse<OrderWithItems[]>,
            Record<string, never>
        >,
        res: Response<
            ApiResponse<OrderWithItems[]>
        >
    ): Promise<void> {

        try {

            const orders:
                OrderWithItems[] =
                await checkoutService.getAllOrders();

            const response:
                ApiResponse<OrderWithItems[]> = {
                    success: true,
                    data: orders
                };

            res.status(200).json(
                response
            );

        } catch (error: unknown) {

            const message: string =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch orders";

            const response:
                ApiResponse<never> = {
                    success: false,
                    message
                };

            res.status(500).json(
                response
            );
        }
    }
    async getOneOrder(
        req: Request<
            OrderIdParams,
            ApiResponse<OrderWithItems>,
            Record<string, never>
        >,
        res: Response<
            ApiResponse<OrderWithItems>
        >
    ): Promise<void> {

        try {

            const { id }: OrderIdParams =
                req.params;

            const order:
                OrderWithItems =
                await checkoutService.getOrderById(
                    id
                );

            const response:
                ApiResponse<OrderWithItems> = {
                    success: true,
                    data: order
                };

            res.status(200).json(
                response
            );

        } catch (error: unknown) {

            const message: string =
                error instanceof Error
                    ? error.message
                    : "Order not found";

            const response:
                ApiResponse<never> = {
                    success: false,
                    message
                };

            res.status(404).json(
                response
            );
        }
    }

    async updateOrder(
        req: Request<
            OrderIdParams,
            ApiResponse<Order>,
            UpdateOrderRequest
        >,
        res: Response<
            ApiResponse<Order>
        >
    ): Promise<void> {

        try {

            const { id }: OrderIdParams =
                req.params;

            const requestData:
                UpdateOrderRequest =
                req.body;

            const updatedOrder:
                Order =
                await checkoutService.updateOrder(
                    id,
                    requestData
                );

            const response:
                ApiResponse<Order> = {
                    success: true,
                    message: "Order updated successfully",
                    data: updatedOrder
                };

            res.status(200).json(
                response
            );

        } catch (error: unknown) {

            const message: string =
                error instanceof Error
                    ? error.message
                    : "Failed to update order";

            const response:
                ApiResponse<never> = {
                    success: false,
                    message
                };

            res.status(400).json(
                response
            );
        }
    }

    async filterOrders(
        req: Request<
            Record<string, never>,
            ApiResponse<OrderWithItems[]>,
            Record<string, never>,
            OrderFilterQuery
        >,
        res: Response<
            ApiResponse<OrderWithItems[]>
        >
    ): Promise<void> {

        try {

            const {
                status,
                customerEmail
            }: OrderFilterQuery =
                req.query;

            const orders:
                OrderWithItems[] =
                await checkoutService.filterOrders(
                    status,
                    customerEmail
                );

            const response:
                ApiResponse<OrderWithItems[]> = {
                    success: true,
                    data: orders
                };

            res.status(200).json(
                response
            );

        } catch (error: unknown) {

            const message: string =
                error instanceof Error
                    ? error.message
                    : "Failed to filter orders";

            const response:
                ApiResponse<never> = {
                    success: false,
                    message
                };

            res.status(400).json(
                response
            );
        }

    }
    placeOrder = async (
        req: Request<
            Record<string, never>,
            ApiResponse<PlaceOrderResult>,
            PlaceOrderRequest
        >,
        res: Response<
            ApiResponse<PlaceOrderResult>
        >
    ): Promise<void> => {

        try {
            const requestData:PlaceOrderRequest = req.body;
            if (
                !requestData.userId
            ) {

                const response:ApiResponse<never> = {
                    success:false,
                    message:"User ID is required"
                };
                res.status(400).json(
                    response
                );
                return;
            }
            if (
                !requestData.shippingAddress
            ) {
                const response:
                    ApiResponse<never> = {
                    success:false,
                    message:"Shipping address is required"
                };
                res.status(400).json(
                    response
                );
                return;
            }

            const result:PlaceOrderResult =
                await checkoutService.placeOrder(
                    requestData
                );

            const response:ApiResponse<PlaceOrderResult> = {

                success:true,
                message:"Order placed successfully",
                data: result
            };
            res.status(201).json(
                response
            );

        } catch (
            error: unknown
        ) {

            const message:string =
                error instanceof Error
                    ? error.message
                    : "Failed to place order";
            const response:ApiResponse<never> = {
                success:false,
                message:message
            };
            res.status(400).json(
                response
            );
        }
    };

}