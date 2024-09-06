import { useLoaderData } from "react-router-dom";

import { OrderSummaryData } from "./OrderSummary";
import OrderSummary from "./OrderSummary";


type LoaderData = {
  ordersData: OrderSummaryData[],
  errMsg?: string
}


export async function ordersLoader() {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  let ordersData: OrderSummaryData[] = [];
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/orders`,
      { credentials: "include" }
    );
    if (res.ok) {
      ordersData = await res.json();
      return { ordersData };
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return { ordersData, errMsg: "Sorry, your orders could not be retrieved. Please try again later." };
  }
}


export function OrdersHistory() {
  // https://reactrouter.com/en/main/hooks/use-loader-data
  const { errMsg, ordersData } = useLoaderData() as LoaderData;

  function renderOrderSummaries() {
    if (errMsg) {
      return <p>{errMsg}</p>;
    }

    // Exclude orders with incomplete or failed payments
    const filteredOrders = ordersData.filter(order => order.order_status !== "payment pending");

    if (filteredOrders.length === 0) {
      return <p>There are no orders to display.</p>;
    }

    return filteredOrders.map((order, index) => {
      if (index + 1 === filteredOrders.length) {
        return <OrderSummary key={order.order_id} orderData={order} lastItem={true} />; 
      }
      return <OrderSummary key={order.order_id} orderData={order} />;
    });
  }

  return (
    <div>
      {renderOrderSummaries()}
    </div>
  );
}
