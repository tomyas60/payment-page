const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  beginners:    { name: 'Beginners Plan',    amount: 3300 },
  intermediate: { name: 'Intermediate Plan', amount: 6600 },
  advanced:     { name: 'Advanced Plan',     amount: 9900 },
};

exports.handler = async (event) => {
  try {
    const { plan } = JSON.parse(event.body);
    const selected = PLANS[plan];

    if (!selected) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid plan selected' }) };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: selected.name },
            unit_amount: selected.amount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: 'https://zenstudiopaymentpage.netlify.app/?subscribed=true',
      cancel_url: 'https://zenstudiopaymentpage.netlify.app/?canceled=true',
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
