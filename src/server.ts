import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cartRoutes from "./routes/cart_routes";
import orderRoutes from "./routes/order_routes";

dotenv.config();

const app = express();


// ========================================
// Middleware
// ========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ========================================
// Health Check
// ========================================

app.get("/", (req, res) => {

    res.json({
        message: "Checkout Engine API is running"
    });

});


// ========================================
// Routes
// ========================================

app.use(
    "/api/carts",
    cartRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);


// ========================================
// Server
// ========================================

const PORT =
    process.env.PORT || 3000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);