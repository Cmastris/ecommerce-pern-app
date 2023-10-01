import { OrderItem } from "./OrderItem";

export function getDateTimeString(rawString) {
  const n = "numeric";
  const options = { year: n, month: n, day: n, hour: n, minute: n };
  return new Date(rawString).toLocaleString("en-GB", options);
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