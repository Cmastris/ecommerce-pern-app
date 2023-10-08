import { useLoaderData } from "react-router-dom";
import OrderSummary from "./OrderSummary";


export async function ordersLoader() {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/orders`,
      { credentials: "include" }
    );
    if (res.ok) {
      const ordersData = await res.json();
      return { ordersData };
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return { error: "Sorry, your orders could not be retrieved. Please try again later." };
  }
}


export function OrdersHistory() {
  // https://reactrouter.com/en/main/hooks/use-loader-data
  const { error, ordersData } = useLoaderData();

  function renderOrderSummaries() {
    if (error) {
      return <p>{error}</p>;
    } else if (ordersData.length === 0) {
      return <p>There are no orders to display.</p>;
    }
    ordersData.sort((a, b) => b.order_id - a.order_id);  // Render latest orders first
    return ordersData.map(order => <OrderSummary key={order.order_id} orderData={order} />);
  }

  return (
    <div>
      {renderOrderSummaries()}
    </div>
  );
}