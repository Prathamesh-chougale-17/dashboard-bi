export interface Order {
    _id: string;
    "Order ID": string;
    "Order Date": string;
    CustomerName: string;
    State: string;
    City: string;
  }
  
export interface OrderDetails {
    _id: string;
    "Order ID": string;
    Amount: number;
    Profit: number;
    Quantity: number;
    Category: string;
    "Sub-Category": string;
    PaymentMode: string;
}