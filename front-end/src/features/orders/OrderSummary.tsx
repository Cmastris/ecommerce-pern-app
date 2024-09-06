import { Link } from "react-router-dom";

import { getDateTimeString } from "./utils";
import styles from "./OrderSummary.module.css";
import utilStyles from "../../App/utilStyles.module.css";


type OrderSummaryProps = {
  orderData: OrderSummaryData,
  /** Whether the order summary is the final one in a list, which renders an additional separator line */
  lastItem?: boolean
}

export type OrderSummaryData = {
  order_id: number,
  order_placed_time: string,
  order_status: string,
  total_cost: string
}


export default function OrderSummary({ orderData, lastItem }: OrderSummaryProps) {
  const { order_id, order_placed_time, order_status, total_cost } = orderData;
  const formattedTime = getDateTimeString(order_placed_time);
  const orderDetailsPath = `/orders/${order_id}`;

  return (
    <div className={styles.orderSummary}>
      <hr className={utilStyles.separator} />
      <article className={styles.flexContainer}>
        <div className={styles.contentContainer}>
          <strong>
            <Link to={orderDetailsPath} className={`${utilStyles.largeText} ${utilStyles.link}`}>#{order_id}, {order_status}</Link>
          </strong>
          <div className={`${utilStyles.mt1rem} ${utilStyles.smallText} ${utilStyles.bold}`}>{formattedTime}</div>
          <div className={utilStyles.mt1rem}>{total_cost}</div>
        </div>
        <div>
          <Link to={orderDetailsPath} className={`${utilStyles.button} ${styles.button}`}>View details</Link>
        </div>
      </article>
      {lastItem ? <hr className={utilStyles.separator} /> : null}
    </div>
  );
}
