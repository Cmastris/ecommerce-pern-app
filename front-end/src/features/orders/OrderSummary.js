import { Link } from "react-router-dom";
import { getDateTimeString } from "./utils";

export default function OrderSummary({ orderData, lastItem }) {
  const { order_id, order_placed_time, order_status, total_cost } = orderData;
  const formattedTime = getDateTimeString(order_placed_time);

  return (
    <article>
      <hr />
      <h3><Link to={`/orders/${order_id}`}>Order #{order_id} ({order_status})</Link></h3>
      <p>{formattedTime}</p>
      <p>{total_cost}</p>
      {lastItem ? <hr /> : null}
    </article>
  );
}
