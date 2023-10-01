import { OrderItem } from "./OrderItem";

export function getDateTimeString(rawString) {
  return new Date(rawString).toLocaleString("en-GB");
}

export function renderOrderItems(orderItemsData, editable=true) {
  // Cart items (i.e. pending order items) or completed order items
  if (orderItemsData.length === 0) {
    return <p>Your cart is empty.</p>;
  }
  const orderItems = orderItemsData.map(
    item => <OrderItem key={item.product_id} productData={item} editable={editable} />
  );
  return <div>{orderItems}</div>;
}