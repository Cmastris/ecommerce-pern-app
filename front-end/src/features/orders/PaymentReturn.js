import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";


// https://stripe.com/docs/checkout/embedded/quickstart?client=react&lang=node
// https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=embedded-checkout#return-page
export default function PaymentReturn() {

  const { orderId } = useParams();
  const [status, setStatus] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    // Fetch payment status (completed or failed/cancelled)
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    const basePath = `${process.env.REACT_APP_API_BASE_URL}/checkout/payment-session-status`;

    fetch(`${basePath}?order_id=${orderId}&session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
      });
  }, [orderId]);

  useEffect(() => {
    // Update database upon successful payment
    if (status === "complete" && !orderConfirmed) {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");
      const basePath = `${process.env.REACT_APP_API_BASE_URL}/checkout/confirm-paid-order`;

      fetch(`${basePath}?order_id=${orderId}&session_id=${sessionId}`, { method: "PUT" })
        .then(() => {
          setOrderConfirmed(true);
        });
    }
  }, [status, orderConfirmed, orderId]);

  if (status === "open") {
    // Payment failed or cancelled; redirect to payment page to try again
    return <Navigate to={`/checkout/${orderId}/payment`} />;
  }

  if (status === "complete" && orderConfirmed) {
    // Payment succeeded
    return <Navigate to={`/checkout/${orderId}/success`} />;
  }

  return null;
}
