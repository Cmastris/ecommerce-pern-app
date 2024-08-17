import { OrderItemData } from "./orderItemData";
import { OrderItem } from "./OrderItem";
import utilStyles from "../../App/utilStyles.module.css";


/**
 * Returns a user-friendly version of the provided back-end API datetime string.
 * 
 * @privateremarks
 * Uses `Date.toLocaleString()` as described in
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString} and
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat}
 * 
 * @example
 * `getDateTimeString("2023-11-20T20:35:03.846Z")` returns `"20/11/2023, 20:35"`.
 * 
 * @param rawString - The back-end API datetime string to convert
 * @returns A formatted, user-friendly representation of `rawString`
 */
export function getDateTimeString(rawString: string) {
  const n: "numeric" = "numeric";
  const options = { year: n, month: n, day: n, hour: n, minute: n };
  return new Date(rawString).toLocaleString("en-GB", options);
}


/**
 * Returns JSX for a list of order items (cart items or completed order items).
 * 
 * @param orderItemsData - An array of cart (pending order) items or completed order items
 * @param editable - Whether it should be possible for the user to remove cart items
 * @returns JSX that displays a list of `<OrderItem>`s
 */
export function renderOrderItems(orderItemsData: OrderItemData[], editable: boolean) {
  const itemsCount = orderItemsData.length;
  if (itemsCount === 0) {
    return <p className={utilStyles.emptyFeedMessage}>Your cart is empty.</p>;
  }
  const orderItems = orderItemsData.map((item, index) => {
    if (index + 1 === itemsCount) {
      return <OrderItem key={item.product_id} orderItemData={item} editable={editable} lastItem={true} />;
    }
    return <OrderItem key={item.product_id} orderItemData={item} editable={editable} />;
  }
  );
  return <div>{orderItems}</div>;
}
