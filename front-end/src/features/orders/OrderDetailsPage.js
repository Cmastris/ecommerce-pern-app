export async function orderDetailsLoader({ params }) {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/orders/${params.id}`,
      { credentials: 'include' }
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
    return { error: "Sorry, this order could not be loaded." };
  }
}


export function OrderDetailsPage({ checkoutSuccess }) {
  return (
    <div>
      <h1>Order details</h1>
    </div>
  );
}
