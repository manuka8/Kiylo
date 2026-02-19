# Kiylo Admin Portal

A professional, feature-rich admin dashboard for managing the Kiylo e-commerce system.

## Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Routing**: React Router DOM (v7)
- **Forms**: React Hook Form + Zod
- **Networking**: Axios
- **Charts**: Recharts

## Features
- ✅ **Super Admin & Admin Roles**: Role-based access control.
- ✅ **Authentication**: JWT-based login with refresh token support.
- ✅ **Dashboard**: KPI cards and visual analytics (Sales, Orders, Categories).
- ✅ **Product Management**: Feature-rich variant builder, images, and inventory tracking.
- ✅ **Modern UI**: Dark/Light mode, animations, and responsive design.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Backend server running (Kiylo-backend)

### 2. Installation
```bash
cd Kiylo-admin
npm install
```

### 3. Configuration
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## Project Structure
```
src/
 ├── components/      # Reusable UI components
 ├── layouts/         # Page layouts (Auth, Dashboard)
 ├── pages/           # Application pages
 ├── routes/          # Routing & Guards
 ├── services/        # API services (Axios)
 ├── store/           # Global state (Zustand)
 ├── styles/          # Base styles & Tailwind
 └── utils/           # Helper utilities
```

## Security
- Protected routes via `ProtectedRoute`.
- Role-based visibility via `RoleGuard`.
- Secure token handling in `token.js`.
- Axios interceptors for automatic auth headers and token refresh.
