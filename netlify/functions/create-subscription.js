const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  beginners:    'price_1TpvNRPaFIhI2tKrHdMop3KH',
  intermediate: 'price_1TpvTFPaFIhI2tKrGi3GIUJF',
  advanced:     'price_1TpvTTPaFIhI2tKrFukhEsL5',
};

exports.handler = async (event) => {
  try {
    const { plan } = JSON.parse(event.body);
    const priceId = PLANS[plan];

    if (!priceId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid plan selected' }) };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
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
