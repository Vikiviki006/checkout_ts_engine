export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

export type CreateOrderRequest = {
    cartId: string;
    customerName: string;
    customerEmail: string;
    shippingAddress?: string;
};

export type UpdateOrderRequest = {
    status?: OrderStatus;
    shippingAddress?: string;
};

export type OrderFilterQuery = {
    status?: OrderStatus;
    customerEmail?: string;
};

export type OrderIdParams = {
    id: string;
};

export type Product = {
    id: string;
    name: string;
    price: number;
    stock: number;
};

export type Category = {
    id: string;
    name: string;
};

export type ProductWithCategory =
    Product & {
        categories: Category | null;
    };

export type CartStatus =
    | "active"
    | "checked_out"
    | "abandoned";

export type CheckoutCartItem = {
    id: string;
    product_id: string;
    quantity: number;
    products: Product[];
};

export type CheckoutCart = {
    id: string;
    status: CartStatus;
    cart_items: CheckoutCartItem[];
};

export type Order = {
    id: string;
    cart_id: string;
    customer_name: string;
    customer_email: string;
    shipping_address: string | null;
    status: OrderStatus;
    total_amount: number;
    created_at: string;
    updated_at: string;
};

export type OrderItem = {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
};

export type OrderItemWithProduct =
    OrderItem & {
        products: ProductWithCategory | null;
    };

export type CreateOrderItem =
    Omit<
        OrderItem,
        "id" | "order_id"
    >;

export type CreateOrderResult = {
    order: Order;
    items: OrderItem[];
};

export type OrderWithItems =
    Order & {
        order_items: OrderItemWithProduct[];
    };

export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
};


export type PlaceOrderRequest = {
    userId: string;
    shippingAddress: string;
};

export type PlaceOrderResult = {
    order: Order;
};