# 📊 TrendWiseBackEnd

This is the backend for **TrendWise**, a full-stack MERN application that scrapes trending topics, generates SEO content, and supports features like Google OAuth authentication, likes/comments on articles, and content caching.

---

## 📁 Project Structure

```
TrendWiseBackEnd/
│
├── config/               # Database config, passport config
├── controllers/          # Route controllers for Admin, Article, Auth, Comment
├── middlewares/          # Custom middleware (e.g., auth.js)
├── models/               # Mongoose models: User, Article, Comment
├── routes/               # Express routes for APIs
├── services/             # Scraper and content generator services
├── utils/                # Logger, JWT helper, error handler
│
├── .env                  # Environment variables
├── app.js                # Entry point for the Express app
├── server.js             # Starts the server
├── package.json          # Project dependencies and scripts
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/eppakayalanaresh08/TrendWiseBackEnd
cd TrendWiseBackEnd
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env` file in the root folder:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Start the server

```bash
node server.js
```

---

## ⚙️ Features

- 🔒 Google OAuth 2.0 authentication (Passport.js)
- 📈 Scrape trending topics using Axios
- 🧠 SEO content generation with AI (if integrated)
- 📝 JWT-based user authentication
- 💬 Likes and comments (for logged-in users)
- 📦 MongoDB + Mongoose
- 🚀 Express.js backend API

---

## 🧪 Sample API Endpoints

| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| GET    | `/api/articles`           | Fetch all articles        |
| POST   | `/api/admin/articles`     | Create a new article      |
| GET    | `/api/admin/generate       `    | Get trending topics       |
| POST   | `/api/comments/:id`       | Add comment to article    |
| GET    | `/auth/google`            | Login with Google         |

---

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Passport.js
- Axios
- JWT
- dotenv

---

## 📄 License

This project is licensed under the MIT License.