import { Router } from "express";

import { OrderController } from "./order_contoller";


const router: Router = Router();

const orderController:
    OrderController =
    new OrderController();


// ========================================
// Create Order
// POST /orders
// ========================================

router.post(
    "/",
    orderController.createOrder.bind(
        orderController
    )
);


// ========================================
// Get All Orders
// GET /orders
// ========================================

router.get(
    "/",
    orderController.getAllOrders.bind(
        orderController
    )
);


// ========================================
// Filter Orders
// GET /orders/filter
// ========================================

router.get(
    "/filter",
    orderController.filterOrders.bind(
        orderController
    )
);


// ========================================
// Get Order By ID
// GET /orders/:id
// ========================================

router.get(
    "/:id",
    orderController.getOneOrder.bind(
        orderController
    )
);


// ========================================
// Update Order
// PATCH /orders/:id
// ========================================

router.patch(
    "/:id",
    orderController.updateOrder.bind(
        orderController
    )
);


export default router;