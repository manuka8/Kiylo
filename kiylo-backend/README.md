# 📦 Kiylo-backend

COMPLETE, PRODUCTION-READY e-commerce backend built with Node.js, Express, and MySQL.

## 🚀 Features
- **Strict RBAC**: Roles for `super_admin`, `admin`, and `user`.
- **High Security**: JWT with refresh tokens, Bcrypt (salt 12), Helmet, Rate limiting.
- **E-commerce Core**:
  - Products with Variants (Color, Size, SKU, Stock, RTC).
  - Multi-image support (Main + Gallery).
  - Categories & Brands.
  - Cart (User & Guest) & Wishlist.
  - Orders & Inventory Management.
  - Coupons & Reviews.
- **Admin Dashboard**: Real-time stats and low-stock alerts.
- **Audit Logging**: Comprehensive tracking of system actions.

## 🛠 Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MySQL (using `mysql2/promise`)
- **Security**: JWT, Bcrypt, Helmet, CORS, Rate-limit
- **Validation**: Zod
- **File Uploads**: Multer

## 📋 Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file based on `.env.example`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kiylo_db
JWT_SECRET=your_secret
...
```

### 4. Database Setup
The system automatically creates all tables on first run via `src/utils/dbUtils.js`. Ensure the database defined in `DB_NAME` exists.

### 5. Start Server
```bash
# Development mode
node src/server.js
```

## 🛤 API Endpoints (v1)

### Authentication
- `POST /api/v1/auth/register` - Create new user
- `POST /api/v1/auth/login` - Get access & refresh tokens

### Products & Catalog
- `GET /api/v1/products` - List products
- `POST /api/v1/products` - Create product (Admin)
- `GET /api/v1/categories` - List categories
- `GET /api/v1/brands` - List brands

### Shopping
- `GET /api/v1/cart` - Get current cart
- `POST /api/v1/cart/add` - Add item to cart
- `POST /api/v1/orders/checkout` - Place an order (Auth required)

### Admin
- `GET /api/v1/admin/stats` - Dashboard analytics

## 🔒 Security Best Practices
- Salt rounds set to 12.
- Pre-prepared SQL statements to prevent injection.
- Centralized error handling for clean failures.
- Secure Multer configuration for image uploads.
