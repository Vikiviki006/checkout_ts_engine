import { Router } from "express";

import { OrderController } from "./order_contoller";


const router: Router = Router();

const orderController:
    OrderController =
    new OrderController();

router.post(
    "/",
    orderController.createOrder
);

router.get(
    "/",
    orderController.getAllOrders
);

router.get(
    "/filter",
    orderController.filterOrders
);

router.get(
    "/:id",
    orderController.getOneOrder 
);

router.patch(
    "/:id",
    orderController.updateOrder
);

router.post(
    "/placeOrder",
    orderController.placeOrder
);


export default router;