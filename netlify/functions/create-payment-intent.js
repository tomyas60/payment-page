const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ALLOWED_CURRENCIES = ['usd', 'gbp'];

exports.handler = async (event) => {
  try {
    const { amount, currency } = JSON.parse(event.body);
    const cur = ALLOWED_CURRENCIES.includes(currency) ? currency : 'usd';

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: cur,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
