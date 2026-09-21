export type CreateCartRequest = {
    customerEmail?: string;
}
export type AddCartItemRequest =  {
    productid: string;
    quantity: number;
}