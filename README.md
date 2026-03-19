# Expense Tracker App

A full-stack personal finance management application built with React, Node.js, and MongoDB. Track your income, expenses, and get insights into your spending patterns with beautiful charts and analytics.

## Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Income Management**: Add, view, and delete income entries
- **Expense Tracking**: Categorize and monitor your expenses
- **Dashboard Analytics**: Visual charts showing spending trends and financial overview
- **Transaction History**: Complete record of all financial activities
- **Data Export**: Download income and expense data as Excel files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 19**
- **Tailwind CSS**
- **Recharts**

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Token authentication

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker-app.git
   cd expense-tracker-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment file
   cp env.example .env
   
   # Edit .env with your configuration
   # MONGO_URI=your-mongodb-connection-string
   # JWT_SECRET=your-secret-key
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend/expense-tracker
   npm install
   
   # Copy environment file (optional, for custom API URL)
   cp env.example .env
   
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Configuration

### Environment Variables

#### Backend Configuration
Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
CLIENT_URL=http://localhost:5173
```

#### Frontend Configuration (Optional)
Create a `.env` file in the `frontend/expense-tracker` directory for custom API URLs:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Database Setup

1. **Local MongoDB**: Install and start MongoDB locally
2. **MongoDB Atlas**: Create a free cluster and get your connection string

## Project Structure

```
expense-tracker-app/
├── backend/                 # Node.js/Express server
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Authentication & upload middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   └── uploads/          # User uploaded files
├── frontend/              # React application
│   └── expense-tracker/
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── pages/       # Application pages
│       │   ├── context/     # React context providers
│       │   └── utils/       # Helper functions & API config
│       └── public/          # Static assets
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/get-user` - Get user info
- `PUT /api/v1/auth/update-profile` - Update profile

### Income
- `POST /api/v1/income/add` - Add income
- `GET /api/v1/income/get-all` - Get all income
- `DELETE /api/v1/income/delete/:id` - Delete income
- `GET /api/v1/income/download-excel` - Export to Excel

### Expenses
- `POST /api/v1/expense/add` - Add expense
- `GET /api/v1/expense/get-all` - Get all expenses
- `DELETE /api/v1/expense/delete/:id` - Delete expense
- `GET /api/v1/expense/download-excel` - Export to Excel

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard data
- `GET /api/v1/dashboard/transactions` - Get all transactions

## Key Components

- **FinanceOverview**: Main dashboard with financial summary
- **CustomCharts**: Beautiful visualizations using Recharts
- **Transaction Management**: Add/edit/delete income and expenses
- **Profile Management**: Update user information and photos
- **Responsive Layout**: Mobile-friendly navigation and design
