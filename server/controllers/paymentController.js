import stripe from "../configs/stripe.js";

const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { createPaymentIntent };
