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
  return (
    <div>
      <p>Orders</p>
    </div>
  );
}
