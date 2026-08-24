# UniStore — Multi-Tenant SaaS E-Commerce Platform

A full-stack **Multi-Tenant SaaS E-Commerce Platform** built with **Laravel, React, TypeScript, Inertia.js, and MySQL**.

UniStore allows multiple independent stores to operate on a shared application while maintaining isolated store contexts, products, customers, orders, inventory, promotions, coupons, and settings.

The platform also provides an advanced **Admin Dashboard**, analytics, store management, role-based access control, token-based invitations, discount management, and Stripe payment integration.

---

## 📋 Overview

**UniStore** is a multi-tenant e-commerce platform designed to allow entrepreneurs and store managers to create and manage independent online stores from a shared application.

Each store operates within its own tenant context identified through its domain.

The platform provides:

- Multi-tenant store management
- Product and catalog management
- Inventory management
- Order management
- Customer management
- Sales analytics
- Promotion management
- Discount engine
- Coupon system
- User invitation system
- Role-based access control
- Store customization
- Stripe payment integration
- Google OAuth authentication
- Real-time and event-driven backend operations

The project was developed as a **Full Stack / Team Project** to practice scalable web application architecture and advanced e-commerce business logic.

---

## ✨ Features

### 🏪 Multi-Tenant Architecture

- Multiple independent stores
- Tenant identification through domains
- Store-specific context
- Store-specific products
- Store-specific customers
- Store-specific orders
- Store-specific settings
- Store-specific roles and permissions
- Tenant-aware database queries
- Store data isolation

The tenant context follows this flow:

```text
Store Domain
     │
     ▼
IdentifyTenant Middleware
     │
     ▼
Find Store
     │
     ▼
store_id
     │
     ▼
Tenant Context
     │
     ▼
Store Data
```

---

## 🛒 E-Commerce Management

The platform provides management functionality for:

- Products
- Product variants
- Categories
- Subcategories
- Attributes
- Tags
- Media
- Collections
- Banners
- Orders
- Customers
- Cart
- Wishlist
- Reviews
- Shipping
- Inventory

---

## 📊 Admin Dashboard & Analytics

The Admin Dashboard provides detailed business analytics.

### Overview

- Total revenue
- Total orders
- Average order value
- Sales trends
- Top-selling products
- Recent orders

### Sales Analytics

- Revenue over time
- Order count
- Average order value
- Delivered order rate
- Payment methods
- Order status
- Top-selling products

### Customer Analytics

- Total customers
- Customer growth
- Repeat customer rate
- New customers
- Registration methods
- Geographical distribution
- Top spenders
- Customer lifetime value

### Inventory Analytics

- Total products
- Stock quantity
- Out-of-stock products
- Low-stock products
- In-stock products
- Stock by category

The analytics system supports different periods:

```text
7d
30d
90d
year
all
```

---

## 🎁 Promotion & Discount Engine

UniStore includes a dedicated **Promotion & Discount Engine**.

The system supports:

- Percentage discounts
- Fixed discounts
- Minimum order values
- Promotion validity periods
- Maximum discount amounts
- Active / inactive promotions
- Promotion milestones
- Reward calculation
- Free shipping rewards

The discount logic is separated into dedicated services such as:

```text
PromotionService
DiscountService
CouponService
```

This separation keeps the business logic independent from the controllers.

---

## 🎟️ Coupon System

The platform provides a complete coupon management system.

### Coupon Management

Administrators can:

- Create coupons
- Edit coupons
- Delete coupons
- Activate / deactivate coupons
- Configure usage limits
- Configure expiration dates
- Define minimum order requirements

### Coupon Validation

The system verifies:

- User authentication
- Maximum uses per user
- Global usage limits
- Validity period
- Minimum order amount
- Minimum number of items
- Coupon eligibility

Example flow:

```text
Coupon Code
     │
     ▼
Find Coupon
     │
     ▼
Check User
     │
     ▼
Check Usage Limit
     │
     ▼
Check Expiration
     │
     ▼
Check Cart Eligibility
     │
     ▼
Apply Coupon
```

---

## 🔗 Token-Based Invitation System

UniStore provides a secure invitation mechanism for store users.

Invitations contain:

- Email
- Role
- Token
- Status
- Expiration date
- Store ID

The invitation flow is:

```text
Admin
  │
  ▼
Create Invitation
  │
  ▼
Generate Token
  │
  ▼
Send Invitation
  │
  ▼
User Opens Invitation
  │
  ▼
Validate Token
  │
  ▼
Assign Role
  │
  ▼
Join Store
```

The project also uses Laravel Events such as:

```text
UserInvited
```

for invitation-related processing.

---

## 👥 Authentication & Authorization

The application provides:

- User registration
- Login
- Logout
- Password management
- Email verification
- Google OAuth
- Role-based access control
- Protected routes
- Admin roles
- Store-specific permissions

The project uses:

```text
Laravel Sanctum
Laravel Socialite
Laravel Policies
Roles & Permissions
```

---

## 🏗️ Store Management

Store managers can configure their storefront through:

- Store settings
- Theme configuration
- Home page layout
- Banners
- Collections
- Cards
- Sliders
- Slides
- Media
- Categories
- Product catalog

The project includes a **Home Layout Orchestrator** that allows store administrators to manage and publish storefront layouts.

---

## 💳 Payments & Orders

The platform includes:

- Shopping cart
- Checkout
- Orders
- Order items
- Order addresses
- Order tracking
- Shipping calculation
- Payment processing
- Stripe integration
- Stripe webhooks

Stripe webhook handling is implemented through:

```text
StripeWebhookController
```

---

## 🛠️ Tech Stack

### Backend

| Technology | Usage |
|---|---|
| `PHP 8.2+` | Backend language |
| `Laravel 12` | Backend framework |
| `Eloquent ORM` | Database interaction |
| `Laravel Sanctum` | Authentication |
| `Laravel Socialite` | OAuth authentication |
| `Inertia.js` | Backend / Frontend bridge |
| `Laravel Events` | Event-driven operations |
| `Laravel Queues` | Background processing |

### Frontend

| Technology | Usage |
|---|---|
| `React 18` | Frontend UI |
| `TypeScript` | Type-safe development |
| `Inertia.js` | SPA-like navigation |
| `Vite` | Frontend build tool |
| `Tailwind CSS` | Styling |
| `Material UI` | UI components |
| `Radix UI` | Accessible components |
| `Framer Motion` | Animations |
| `React Hook Form` | Form management |
| `Recharts` | Analytics charts |
| `Axios` | HTTP requests |

### Database

```text
MySQL
```

### Integrations

```text
Stripe
Google OAuth
Google API
Google Sheets
```

### Development Tools

```text
Git
GitHub
Jira
PHPUnit
Laravel Pint
Laravel Sail
Laravel Telescope
```

---

## 🏛️ Architecture

UniStore follows a modern Laravel + React architecture based on **Inertia.js**.

```text
                React + TypeScript
                       │
                       │
                    Inertia
                       │
                       ▼
                 Laravel 12
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
     Controllers    Services    Repositories
          │            │            │
          └────────────┼────────────┘
                       │
                       ▼
                  Eloquent ORM
                       │
                       ▼
                     MySQL
```

The application also exposes dedicated API endpoints and external webhooks where required.

---

## 🧩 Design Patterns

The project implements several software architecture patterns.

### Multi-Tenancy

Tenant isolation is implemented using:

- Tenant identification middleware
- `store_id`
- `BelongsToStore` trait
- Eloquent global scopes
- Store-aware services

### Service Layer

Business logic is separated into services such as:

```text
DashboardService
PromotionService
CouponService
CartService
ShippingService
StoreSettingService
```

### Repository Pattern

Repositories are used to separate data access from business logic.

Examples include:

```text
OrderRepository
ProductRepository
UserRepository
PromotionRepository
CouponRepository
```

### DTO Pattern

The project uses Data Transfer Objects for order processing:

```text
CreateOrderDTO
OrderItemDTO
```

### Event-Driven Architecture

The project uses Laravel Events for operations such as:

```text
NewStoreCreation
OrderConfirmed
UserInvited
UserLogin
```

---

### 📊 Admin Dashboard & Analytics

I contributed to the development of:

- Admin Dashboard
- Sales Analytics
- Customer Analytics
- Inventory Analytics
- KPI cards
- Revenue statistics
- Order statistics
- Average Order Value
- Delivered Order Rate
- Sales trends
- Payment method analytics
- Order status analytics
- Top-selling products
- Customer growth
- Customer retention
- Top spenders
- Inventory statistics
- Stock monitoring
- Stock by category

### 🎁 Promotion & Discount Engine

I contributed to the implementation of:

- Promotion management
- Discount calculation
- Percentage discounts
- Fixed discounts
- Minimum order conditions
- Maximum discount rules
- Promotion validity periods
- Promotion milestones
- Reward calculation
- Free shipping rewards

### 🎟️ Coupon System

I contributed to:

- Coupon management
- Coupon creation
- Coupon editing
- Coupon deletion
- Coupon validation
- Usage limits
- Per-user usage limits
- Expiration validation
- Minimum order validation
- Cart eligibility validation
- Coupon application during checkout

### 🔗 Token-Based Invitation System

I contributed to the invitation system including:

- User invitations
- Token generation
- Invitation expiration
- Invitation status
- Role assignment
- Store-specific invitations
- Invitation events
- Invitation validation

---

## 📸 Screenshots

Add application screenshots to the repository and reference them here.

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Store HomePage

![Store HomePage](screenshots/Store HomePage.png)

### Register

![Register](screenshots/register.png)

### Plans & Pricing

![Plans & Pricing](screenshots/Plans & Pricing.png)

### Create Store

![Create Store](screenshots/create-store.png)

### coupons

![coupons](screenshots/coupons.png)

### add coupon

![add coupon](screenshots/add-coupon.png)

### payment

![payment](screenshots/payment.png)




---

## 📁 Project Structure

```text
UniStore/
│
├── a-UNISTORE-codeSource/
        ├── app/
        │   ├── Actions/
        │   ├── Context/
        │   ├── DTOs/
        │   ├── Events/
        │   ├── Exceptions/
        │   ├── Http/
        │   │   ├── Controllers/
        │   │   ├── Middleware/
        │   │   ├── Requests/
        │   │   └── Resources/
        │   ├── Jobs/
        │   ├── Listeners/
        │   ├── Mail/
        │   ├── Models/
        │   ├── Policies/
        │   ├── Providers/
        │   ├── Repositories/
        │   ├── Services/
        │   └── Traits/
        │
        ├── database/
        │   ├── factories/
        │   ├── migrations/
        │   └── seeders/
        │
        ├── resources/
        │   ├── js/
        │   │   ├── Components/
        │   │   ├── Layouts/
        │   │   ├── Pages/
        │   │   ├── hooks/
        │   │   ├── services/
        │   │   └── types/
        │   └── views/
        │
        ├── routes/
        │   ├── web.php
        │   ├── api.php
        │   └── console.php
        │
        ├── public/
        ├── storage/
        ├── tests/
        ├── package.json
        ├── composer.json
        ├── vite.config.ts
        └── README.md
├── Product Requirements Document|| cahier des charges /         
├── screenshots/        
├── diagrammes UML/        
├── mochups figma/        
├── jira team work/        
```

---

## 🔄 Main Application Flow

### Multi-Tenant Flow

```text
Store Domain
      │
      ▼
IdentifyTenant Middleware
      │
      ▼
Find Store
      │
      ▼
Set store_id
      │
      ▼
Load Tenant Context
      │
      ▼
Access Store Data
```

### Admin Analytics Flow

```text
Admin Dashboard
       │
       ▼
DashboardController
       │
       ▼
DashboardService
       │
       ├── OrderRepository
       ├── ProductRepository
       └── UserRepository
                │
                ▼
              MySQL
                │
                ▼
          Analytics Data
                │
                ▼
          React Dashboard
```

### Promotion Flow

```text
Admin
  │
  ▼
Create Promotion
  │
  ▼
PromotionService
  │
  ▼
PromotionRepository
  │
  ▼
MySQL
  │
  ▼
Promotion Available
  │
  ▼
Cart / Checkout
  │
  ▼
Discount Calculation
```

---

## ⚙️ Requirements

Before running the project, make sure you have:

- PHP `8.2+`
- Composer
- Node.js
- npm
- MySQL `8+`
- Git

Recommended:

- VS Code
- Modern web browser
- GitHub account

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/soufiane-chbicheb/unistore.git
```

Navigate into the project:

```bash
cd unistore
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Configure environment

Create your environment file:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

### 5. Configure MySQL

Update `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Run migrations

```bash
php artisan migrate
```

### 7. Start the development server

```bash
php artisan serve
```

In another terminal:

```bash
npm run dev
```

---

## 🔧 Configuration

The application uses environment variables for configuration.

Important configuration areas include:

```text
Application
Database
Session
Mail
Queue
Stripe
Google OAuth
Filesystem
Frontend
```

Never commit sensitive credentials to GitHub.

The following should remain private:

```text
.env
API keys
Stripe secret keys
OAuth secrets
Database passwords
Application secrets
```

---

## 🔌 API & Webhooks

The application contains dedicated API endpoints for features such as:

```text
Product suggestions
Tag suggestions
Shipping calculation
Promotion retrieval
Coupon retrieval
```

It also handles external payment events through:

```text
Stripe Webhook
```

Example endpoint:

```text
/api/webhook/stripe
```

---

## 🛡️ Security

The project implements several security mechanisms:

- Laravel authentication
- Laravel Sanctum
- Role-based access control
- Authorization policies
- Tenant isolation
- Form request validation
- Password hashing
- Protected routes
- Token-based invitations
- Expiring invitations
- Secure payment webhook handling

Recommended production improvements include:

- Enforce HTTPS.
- Protect all sensitive environment variables.
- Configure secure cookies.
- Add rate limiting to authentication endpoints.
- Validate Stripe webhook signatures.
- Audit tenant authorization on all privileged operations.
- Avoid exposing sensitive application errors.
- Disable `APP_DEBUG` in production.

---

## 🧪 Testing

The project uses:

```text
PHPUnit
Laravel Testing
```

Run the test suite with:

```bash
php artisan test
```

---

## 🌿 Git Workflow

Since this project was developed as a team project, a feature-based Git workflow is recommended.

```text
Feature Branch
      │
      ▼
Development
      │
      ▼
Testing
      │
      ▼
Pull Request
      │
      ▼
Code Review
      │
      ▼
Merge
      │
      ▼
main
```

Example:

```bash
git checkout -b feature/promotion-engine
```

Then:

```bash
git add .
git commit -m "feat: implement promotion engine"
git push origin feature/promotion-engine
```

Open a **Pull Request** and merge after review.

---

## 🤝 Team Project

**UniStore** was developed as a **team project**.

The project involved collaborative development using:

```text
Git
GitHub
Jira
```

Team collaboration included:

- Feature development
- Git branching
- Pull Requests
- Code reviews
- Issue tracking
- Task management
- Integration of different modules

---

## 🎓 Project Type

**Full Stack Team Project — Multi-Tenant SaaS E-Commerce Platform**

This project provided practical experience with:

- Full Stack Development
- Laravel
- React
- TypeScript
- Inertia.js
- MySQL
- Multi-Tenant Architecture
- E-Commerce
- Analytics
- Business Logic
- Discount Systems
- Authentication
- Authorization
- Git & GitHub
- Agile Team Collaboration

---

## 📚 Learning Objectives

This project provided practical experience with:

- Designing a multi-tenant architecture.
- Developing a full-stack e-commerce platform.
- Building complex admin dashboards.
- Implementing analytics and KPIs.
- Designing reusable business services.
- Implementing promotion and discount rules.
- Building coupon validation systems.
- Implementing token-based invitation workflows.
- Managing roles and permissions.
- Working with Laravel Events and Services.
- Integrating third-party services.
- Working collaboratively with Git, GitHub, and Jira.

---

## 👤 Author

**Soufiane Chbicheb**

Junior Full Stack Web Developer

- GitHub: [@soufiane-chbicheb](https://github.com/soufiane-chbicheb)
- LinkedIn: [Soufiane Chbicheb](https://www.linkedin.com/in/soufiane-chbicheb-344815429/)

---


## 📄 License

This project is an academic team project and is provided for portfolio and demonstration purposes only.

All rights reserved.

The source code may not be copied, modified, distributed, or reused without explicit permission from the authors.

---

## 👨‍💻 My Contribution

This project was developed as a team project.

My main contributions were:

- Development of the **Promotion & Discount Engine**
- Development of the **Coupon Management System**
- Implementation of the **Token-Based User Invitation System**