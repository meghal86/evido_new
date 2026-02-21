const Stripe = require('stripe');
// Load env vars if not present (simple hack or rely on user running with env)
// We'll rely on the user running this with `node -r dotenv/config scripts/setup-stripe.js`
// or just hardcoding the key for this one-off execution if needed, but better to load from .env

require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // Use a recent version or the one in lib
});

const products = [
    {
        name: 'Evido Basic',
        amount: 9900, // $99.00
        currency: 'usd',
        features: ['10-Criteria Analysis', 'AI Evidence Text', 'Citation Tracker'],
        metadata: { planType: 'Basic' }
    },
    {
        name: 'Evido Premium',
        amount: 29900, // $299.00
        currency: 'usd',
        features: ['Everything in Basic', 'Attorney-Ready Letters', 'Expert Review', 'GitHub Sync'],
        metadata: { planType: 'Premium' }
    },
    {
        name: 'Evido Enterprise',
        amount: 49900, // $499.00
        currency: 'usd',
        features: ['Everything in Premium', 'Team Management', 'White-label'],
        metadata: { planType: 'Enterprise' }
    }
];

async function setup() {
    console.log('Starting Stripe Setup...');

    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('Error: STRIPE_SECRET_KEY is missing in .env');
        process.exit(1);
    }

    const prices = {};

    for (const p of products) {
        console.log(`Checking product: ${p.name}...`);
        // Check if product exists (simple check by name search)
        const existing = await stripe.products.search({
            query: `name:'${p.name}'`,
        });

        let product;
        if (existing.data.length > 0) {
            console.log(`  Found existing product: ${existing.data[0].id}`);
            product = existing.data[0];
        } else {
            console.log(`  Creating new product: ${p.name}`);
            product = await stripe.products.create({
                name: p.name,
                metadata: p.metadata,
            });
        }

        // Check for price
        const existingPrices = await stripe.prices.list({
            product: product.id,
            active: true,
            limit: 1,
        });

        let price;
        if (existingPrices.data.length > 0) {
            console.log(`  Found existing price: ${existingPrices.data[0].id}`);
            price = existingPrices.data[0];
        } else {
            console.log(`  Creating price for ${p.name}: $${p.amount / 100}`);
            price = await stripe.prices.create({
                product: product.id,
                unit_amount: p.amount,
                currency: p.currency,
            });
        }

        prices[p.metadata.planType.toUpperCase()] = price.id;
    }

    console.log('\n--- SETUP COMPLETE ---');
    console.log('Add these to your .env file:');
    console.log(`STRIPE_PRICE_ID_BASIC="${prices.BASIC}"`);
    console.log(`STRIPE_PRICE_ID_PREMIUM="${prices.PREMIUM}"`);
    console.log(`STRIPE_PRICE_ID_ENTERPRISE="${prices.ENTERPRISE}"`);
}

setup().catch(console.error);
