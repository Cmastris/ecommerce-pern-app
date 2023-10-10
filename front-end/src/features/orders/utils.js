import { OrderItem } from "./OrderItem";
import utilStyles from "../../App/utilStyles.module.css";


export function getDateTimeString(rawString) {
  const n = "numeric";
  const options = { year: n, month: n, day: n, hour: n, minute: n };
  return new Date(rawString).toLocaleString("en-GB", options);
}


export function renderOrderItems(orderItemsData, editable=true) {
  // Cart items (i.e. pending order items) or completed order items
  const itemsCount = orderItemsData.length;
  if (itemsCount === 0) {
    return <p className={utilStyles.emptyFeedMessage}>Your cart is empty.</p>;
  }
  const orderItems = orderItemsData.map((item, index) => {
    if (index + 1 === itemsCount) {
      return <OrderItem key={item.product_id} productData={item} editable={editable} lastItem={true} />;
    }
    return <OrderItem key={item.product_id} productData={item} editable={editable} />;
  }
  );
  return <div>{orderItems}</div>;
}