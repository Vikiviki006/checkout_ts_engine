import { Router } from "express";

import {
    createOrder,
    getAllOrders,
    getOneOrder,
    updateOrder,
    filterOrders
} from "../controllers/order_controller";
const router = Router();
router.post(
    "/",
    createOrder
);
router.get(
    "/",
    getAllOrders
);
router.get(
    "/filter",
    filterOrders
);
router.get(
    "/:id",
    getOneOrder
);
router.patch(
    "/:id",
    updateOrder
);
export default router;