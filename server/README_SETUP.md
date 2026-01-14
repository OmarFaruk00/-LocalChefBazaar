# Backend Setup Guide

## 1. Environment Variables (.env file)

`server` folder এ একটি `.env` file তৈরি করুন এবং নিচের variables গুলো add করুন:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/localchefbazaar
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters
STRIPE_SECRET=sk_test_your_stripe_secret_key_here
```

### Environment Variables ব্যাখ্যা:

- **PORT**: Backend server কোন port এ run হবে (default: 5000)
- **MONGO_URI**: MongoDB connection string
  - Local MongoDB: `mongodb://localhost:27017/localchefbazaar`
  - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/localchefbazaar`
- **CLIENT_URL**: Frontend এর URL (development: `http://localhost:5173`, production: আপনার deployed URL)
- **JWT_SECRET**: JWT token sign করার জন্য secret key (কমপক্ষে 32 characters)
- **STRIPE_SECRET**: Stripe payment এর জন্য secret key (Stripe dashboard থেকে পাওয়া যাবে)

## 2. MongoDB Setup

### Option A: Local MongoDB
1. MongoDB install করুন: https://www.mongodb.com/try/download/community
2. MongoDB service start করুন
3. `.env` file এ `MONGO_URI=mongodb://localhost:27017/localchefbazaar` set করুন

### Option B: MongoDB Atlas (Cloud)
1. https://www.mongodb.com/cloud/atlas এ account তৈরি করুন
2. Free cluster create করুন
3. Database user create করুন
4. Network Access এ আপনার IP add করুন (বা `0.0.0.0/0` সব IP allow করতে)
5. Connection string copy করুন
6. `.env` file এ `MONGO_URI` set করুন

## 3. Stripe Setup (Payment)

1. https://stripe.com এ account তৈরি করুন
2. Dashboard → Developers → API keys
3. Secret key copy করুন (test mode: `sk_test_...`)
4. `.env` file এ `STRIPE_SECRET` set করুন

## 4. Dependencies Install

```bash
cd server
npm install
```

## 5. Build TypeScript

```bash
npm run build
```

## 6. Run Server

### Development Mode:
```bash
npm run dev
```

### Production Mode:
```bash
npm run build
npm start
```

## 7. Verify Server Running

Browser বা Postman এ check করুন:
```
GET http://localhost:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T..."
}
```

## 8. Production Deployment

### Important Notes:
- `.env` file production environment এ properly set করুন
- `CLIENT_URL` আপনার deployed frontend URL set করুন
- MongoDB Atlas use করলে connection string update করুন
- CORS settings check করুন
- Environment variables secure রাখুন (never commit `.env` file)

## Troubleshooting

### MongoDB Connection Error:
- MongoDB service running আছে কিনা check করুন
- Connection string সঠিক কিনা verify করুন
- Network access (Atlas) properly configured আছে কিনা check করুন

### Port Already in Use:
- Port 5000 অন্য service use করছে কিনা check করুন
- `.env` এ অন্য port set করুন

### JWT Secret Error:
- `JWT_SECRET` কমপক্ষে 32 characters হতে হবে
- Strong random string use করুন

