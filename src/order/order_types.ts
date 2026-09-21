// ========================================
// Order Status
// ========================================

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";


// ========================================
// Create Order Request
// ========================================

export type CreateOrderRequest = {
    cartId: string;
    customerName: string;
    customerEmail: string;
    shippingAddress?: string;
};


// ========================================
// Update Order Request
// ========================================

export type UpdateOrderRequest = {
    status?: OrderStatus;
    shippingAddress?: string;
};


// ========================================
// Order Filter Query
// ========================================

export type OrderFilterQuery = {
    status?: OrderStatus;
    customerEmail?: string;
};


// ========================================
// Order Route Parameters
// ========================================

export type OrderIdParams = {
    id: string;
};


// ========================================
// Product
// ========================================

export type Product = {
    id: string;
    name: string;
    price: number;
    stock: number;
};


// ========================================
// Category
// ========================================

export type Category = {
    id: string;
    name: string;
};


// ========================================
// Product + Category
// Intersection Type
// ========================================

export type ProductWithCategory =
    Product & {
        categories: Category | null;
    };


// ========================================
// Cart Status
// ========================================

export type CartStatus =
    | "active"
    | "checked_out"
    | "abandoned";


// ========================================
// Cart Item During Checkout
// ========================================

export type CheckoutCartItem = {
    id: string;
    product_id: string;
    quantity: number;
    products: Product | null;
};


// ========================================
// Cart During Checkout
// ========================================

export type CheckoutCart = {
    id: string;
    status: CartStatus;
    cart_items: CheckoutCartItem[];
};


// ========================================
// Order
// ========================================

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


// ========================================
// Order Item
// ========================================

export type OrderItem = {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
};


// ========================================
// Order Item + Product
// Intersection Type
// ========================================

export type OrderItemWithProduct =
    OrderItem & {
        products: ProductWithCategory | null;
    };


// ========================================
// Create Order Item
// Used before DB generates id/order_id
// ========================================

export type CreateOrderItem =
    Omit<
        OrderItem,
        "id" | "order_id"
    >;


// ========================================
// Create Order Result
// ========================================

export type CreateOrderResult = {
    order: Order;
    items: OrderItem[];
};


// ========================================
// Order With Items
// ========================================

export type OrderWithItems =
    Order & {
        order_items: OrderItemWithProduct[];
    };


// ========================================
// Generic API Response
// ========================================

export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
};