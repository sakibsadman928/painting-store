import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setLoading(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/myOrders",
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      <div className="flex space-x-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !stripe}
          className="flex-1 px-4 py-3 bg-[#bb86fc] text-white rounded-lg hover:bg-[#9b6fe5] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
};

const StripePaymentModal = ({ amount, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const createIntent = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/payment/create-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ amount }),
          },
        );
        const data = await response.json();
        if (data.success) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.message || "Failed to initialize payment");
        }
      } catch (err) {
        setError("Failed to connect to payment service");
      } finally {
        setLoading(false);
      }
    };
    createIntent();
  }, [amount]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-[#6b46c1] mb-2">
          Complete Payment
        </h3>
        <p className="text-gray-600 mb-4">
          Amount:{" "}
          <span className="font-semibold text-[#bb86fc]">${amount}</span>
        </p>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bb86fc]"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-red-500 mb-3">{error}</p>
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}

        {!loading && !error && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default StripePaymentModal;
