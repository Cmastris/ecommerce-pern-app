import { Link, useLoaderData, useRouteLoaderData } from "react-router-dom";

import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import { getDateTimeString, renderOrderItems } from "./utils";
import utilStyles from "../../App/utilStyles.module.css";
import styles from "./OrderDetailsPage.module.css";


export async function orderDetailsLoader({ params }) {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/orders/${params.id}`,
      { credentials: "include" }
      );
    if (res.ok) {
      const orderData = await res.json();
      return { orderData };
    } else if (res.status === 404) {
      // https://reactrouter.com/en/main/route/error-element#throwing-manually
      throw new Response("Not Found", { status: 404 });
    } else if (res.status === 401) {
      // https://reactrouter.com/en/main/route/error-element#throwing-manually
      return { error: "You must be logged in as the correct user to view this order." };
    }
    throw new Error("Unsuccessful order fetch.");

  } catch (error) {
    if (error.status === 404) {
      throw error;  // Serve 404 error page
    }
    return { error: "Sorry, this order could not be loaded. Please try again later." };
  }
}


export function OrderDetailsPage({ checkoutSuccess }) {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  const { orderData, error } = useLoaderData();

  if (!authData.logged_in) {
    return <InlineErrorPage pageName="Order details" type="login_required" loginRedirect="/orders" />;
  } else if (error) {
    return <InlineErrorPage pageName="Order details" message={error} />;
  }

  const { address, order_id, order_items, order_placed_time, order_status, postcode, total_cost } = orderData;
  const formattedTime = getDateTimeString(order_placed_time);

  return (
    <div className={utilStyles.pagePadding}>
      <h1 className={utilStyles.mb3rem}>Order details</h1>
      {checkoutSuccess ? <p>Your order was placed successfully.</p> : null}
      <section className={utilStyles.mb3rem}>
        <h2>Key details</h2>
        <div className={styles.detailsContainer}>
          <p><span className={utilStyles.bold}>Order ID:</span> {order_id}</p>
          <p><span className={utilStyles.bold}>Status:</span> {order_status}</p>
          <p><span className={utilStyles.bold}>Placed:</span> {formattedTime}</p>
          <p><span className={utilStyles.bold}>Total cost:</span> {total_cost}</p>
        </div>
      </section>
      <section className={utilStyles.mb3rem}>
        <h2>Items</h2>
        {renderOrderItems(order_items, false)}
      </section>
      <section className={utilStyles.mb3rem}>
        <h2 className={utilStyles.mb2rem}>Delivery address</h2>
        <p>{address}</p>
        <p>{postcode}</p>
      </section>
      <Link to="/" className={utilStyles.button}>Continue shopping</Link>
    </div>
  );
}
