# FinSight 💼 — Personal Finance Dashboard

Full-stack personal finance dashboard — **React + Vite** frontend, **Express + Node.js** backend, **MongoDB** database (local via Compass).

---

## Prerequisites

1. **Node.js** v18+ → https://nodejs.org
2. **MongoDB Community Server** → https://www.mongodb.com/try/download/community
3. **MongoDB Compass** (GUI) → https://www.mongodb.com/products/compass

---

## Setup & Run

### Step 1 — Extract & Open in VS Code

Extract the ZIP, open the `finsight-mongodb` folder in VS Code.

---

### Step 2 — Start MongoDB Server

Open a new terminal (Command Prompt or PowerShell) and run:

```
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
```

> Keep this terminal open while using the app. MongoDB must be running before you start the project.

---

### Step 3 — Configure Environment

Inside the `server/` folder, create a file called `.env` and paste:

```
MONGODB_URI=mongodb://localhost:27017/finsight
PORT=5000
```

---

### Step 4 — Install Dependencies

Open a new VS Code terminal and run these one by one:

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

---

### Step 5 — Start the App

```bash
npm run dev
```

This starts both backend (port **5000**) and frontend (port **5173**) together.

---

### Step 6 — Open in Browser

→ **http://localhost:5173**

---

## CSV Format

Your CSV file must have these columns in this exact order:

```
Date,Description,Category,Amount,Type
2024-01-03,Monthly Salary,Income,5000,income
2024-01-05,Rent Payment,Housing,1200,expense
```

| Column | Description |
|--------|-------------|
| Date | Any date format (e.g. 2024-01-01) |
| Description | Transaction label |
| Category | Food, Housing, Transport, etc. |
| Amount | Positive number |
| Type | `income` or `expense` |

> Use the **Download Sample CSV** button on the Upload page to get a ready-made test file.

---

## MongoDB Compass

After uploading a CSV, open Compass → connect to `mongodb://localhost:27017` → open the `finsight` database → `transactions` collection to view your data.

---

## Project Structure

```
finsight-mongodb/
├── server/
│   ├── index.js
│   ├── models/
│   │   └── Transaction.js
│   └── routes/
│       ├── transactions.js
│       ├── analytics.js
│       └── chat.js
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Chatbot.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Upload.jsx
│   │       └── Dashboard.jsx
│   └── vite.config.js
├── .env.example
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Charts | Recharts |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| File Upload | Multer |
| CSV Parsing | csv-parse |

---

## Developer

**Yoga Sree S**
