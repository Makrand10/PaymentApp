A backend implementation of a **Paytm-like payment app**, built with **Node.js, Express, MongoDB, and JWT authentication**. This project simulates core Paytm functionalities like **user signup/signin, account balance management, and money transfers**.  

---

## 🚀 Features  
- 🔑 User authentication with **JWT**  
- 👤 Signup & Signin with password hashing  
- 💳 Create and manage accounts with balance tracking  
- 💸 Transfer money securely between accounts  
- 🛡️ Middleware-protected routes for authenticated users  
- 📡 RESTful API architecture  

---

## 🛠️ Tech Stack  
- **Node.js** – Backend runtime  
- **Express.js** – Web framework  
- **MongoDB + Mongoose** – Database and ORM  
- **JWT (JSON Web Token)** – Authentication  
- **bcrypt** – Password hashing  

---

## 📂 Project Structure  
├── index.js # Entry point
├── config.js # JWT secret and environment configs
├── db.js # MongoDB connection & models (User, Account)
├── middleware.js # Auth middleware for JWT verification
├── routes/ # API routes (account.js, user.js, etc.)
└── package.json



2. Install dependencies
npm install


Create a .env file in the root with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000

4. Start the server
npm start


API Endpoints
Auth

POST /signup → Register new user

POST /signin → Login user

Account

GET /account/balance → Get balance of logged-in user

POST /account/transfer → Transfer money to another account
