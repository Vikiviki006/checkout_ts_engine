import { Router } from "express";

import { OrderController } from "./order_contoller";


const router: Router = Router();

const orderController:
    OrderController =
    new OrderController();

router.post(
    "/",
    orderController.createOrder.bind(
        orderController
    )
);

router.get(
    "/",
    orderController.getAllOrders.bind(
        orderController
    )
);

router.get(
    "/filter",
    orderController.filterOrders.bind(
        orderController
    )
);

router.get(
    "/:id",
    orderController.getOneOrder.bind(
        orderController
    )
);

router.patch(
    "/:id",
    orderController.updateOrder.bind(
        orderController
    )
);
export default router;