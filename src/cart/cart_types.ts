export type CartStatus =
    | "active"
    | "checked_out"
    | "abandoned";

export type CreateCartRequest = {
    customerEmail?: string;
};


export type AddCartItemRequest = {
    productid: string;
    quantity: number;
};

export type CartIdParams = {
    cartId: string;
};

export type Cart = {
    id: string;
    customer_email: string;
    status: CartStatus;
    created_at: string;
    updated_at: string;
};

export type Product = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
};

export type CartItem = {
    id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    created_at?: string;
};

export type Category = {
    id: string;
    name: string;
};

export type CartProduct = Product & {
    categories: Category | null;
};

export type CartItemWithProduct = {
    id: string;
    quantity: number;
    product_id: string;
    products: CartProduct | null;
};

export type CartWithItems = Cart & {
    cart_items: CartItemWithProduct[];
};

export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
};