import { Router } from "express";

import {
    createCart,
    addCartItem,
    getCart
} from "../controllers/cart_controller";


const router = Router();


router.post(
    "/",
    createCart
);


router.post(
    "/:cartId/items",
    addCartItem
);


router.get(
    "/:cartId",
    getCart
);


export default router;