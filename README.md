

75%
Library
Search
Apps
Documents
Files
FinSight 💼 — Personal Finance Dashboard
Full-stack personal finance dashboard — React + Vite frontend, Express + Node.js backend, MongoDB database (local via Compass).

Prerequisites
Node.js v18+ → https://nodejs.org
MongoDB Community Server → https://www.mongodb.com/try/download/community
MongoDB Compass (GUI) → https://www.mongodb.com/products/compass (optional but recommended)
Setup & Run
Step 1 — Extract the ZIP and open in VS Code
cd finsight-mongodb
code .
Step 2 — Start MongoDB Server
Open a new terminal (Command Prompt or PowerShell) and run this command to start MongoDB:

"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
Keep this terminal open while using the app. MongoDB must be running before you start the project.

Step 3 — Configure Environment
Inside the server/ folder, create a file called .env:

MONGODB_URI=mongodb://localhost:27017/finsight
PORT=5000
Open MongoDB Compass and connect to mongodb://localhost:27017 to see your data visually.

Step 4 — Install dependencies
Open a new VS Code terminal:

# Root
npm install
# Server
cd server && npm install && cd ..
# Client
cd client && npm install && cd ..
Step 5 — Start the app
npm run dev
This runs both backend (port 5000) and frontend (port 5173) together.

Step 6 — Open in browser
→ http://localhost:5173

CSV Format
Date,Description,Category,Amount,Type
2024-01-03,Monthly Salary,Income,5000,income
2024-01-05,Rent Payment,Housing,1200,expense
Column	Values
Type	income or expense
Use the Download Sample CSV button on the Upload page to get a test file.

MongoDB Compass
After uploading a CSV, open Compass → connect to mongodb://localhost:27017 → browse the finsight database → transactions collection to see your data.

Project Structure
finsight-mongodb/
├── server/
│   ├── index.js
│   ├── models/Transaction.js
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
Developer
Yoga Sree S