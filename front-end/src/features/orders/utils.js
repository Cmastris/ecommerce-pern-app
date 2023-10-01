import { OrderItem } from "./OrderItem";

export function getDateTimeString(rawString) {
  return new Date(rawString).toLocaleString("en-GB");
}

export function renderCartItems(cartData, editable=true) {
  if (cartData.length === 0) {
    return <p>Your cart is empty.</p>;
  }
  const cartItems = cartData.map(
    item => <OrderItem key={item.product_id} productData={item} editable={editable} />
  );
  return <div>{cartItems}</div>;
}