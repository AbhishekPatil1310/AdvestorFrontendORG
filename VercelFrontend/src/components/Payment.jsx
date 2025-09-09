import React from "react";

export default function PaymentButton() {
  const handlePayment = async () => {
    // 1. Create order
    const res = await fetch(`${import.meta.env.VITE_API_URL}/create-order`, {
      method: "POST",
    });
    const order = await res.json();
    console.log("amount: ",order.amount)

    // 2. Ensure Razorpay script is loaded
    if (typeof window.Razorpay === "undefined") {
      alert("Razorpay SDK not loaded. Please refresh and try again.");
      return;
    }

    // 3. Configure checkout
    const options = {
      key: "rzp_test_RDd6OBqb7UeZF1", // replace with real key
      amount: order.amount,
      currency: order.currency,
      name: "Task Manager Pro",
      description: "Pay for Premium Features",
      order_id: order.id,
      handler: function (response) {
        alert("✅ Payment Success: " + response.razorpay_payment_id);
        // TODO: call backend /verify-payment here
      },
      prefill: {
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "8px",
        background: "#3399cc",
        color: "white",
        border: "none",
        cursor: "pointer",
      }}
    >
      Pay Now
    </button>
  );
}

