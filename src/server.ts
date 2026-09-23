import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {Express} from "express";

import cartRoutes from "./cart/cart_routes";
import orderRoutes from "./order/order_routes";

dotenv.config();

const app:Express = express();

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);
app.get("/", (req, res) => {
    res.json({
        message: "Checkout Engine API is running"
    });
});
app.use(
    "/api/carts",
    cartRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});