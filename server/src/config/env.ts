export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  stripeSecret: process.env.STRIPE_SECRET || '',
};




