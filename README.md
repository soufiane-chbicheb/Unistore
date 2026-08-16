# Unistore - Multi-Tenant SaaS E-commerce Orchestrator

Unistore is a high-performance, multi-tenant SaaS platform designed to empower entrepreneurs to launch and manage fully customizable e-commerce stores. Built with a modern monolithic architecture, it bridges the gap between powerful backend management and seamless, high-speed frontend experiences.

## 🚀 The Core Idea
Unistore operates on a **Multi-Tenancy** model where a single application instance serves multiple independent "stores" (tenants). Each tenant enjoys a private, isolated environment with its own:
- **Custom Domain/Subdomain**: Securely identified via middleware.
- **Store Orchestration**: A specialized "Store Builder" that allows real-time UI/Layout customization.
- **Catalog & Inventory**: Independent product, category, and niche management.
- **Marketing Suite**: Sophisticated promotion and coupon systems with automated discount logic.

## 🛠️ Technical Stack
- **Backend**: PHP 8.2+ | Laravel 11 (The core engine handling multi-tenancy, events, and business logic).
- **Frontend**: TypeScript | React | Inertia.js (Providing a "Single Page App" feel with the security of a server-side framework).
- **Styling**: Tailwind CSS | Radix UI | Framer Motion (For high-end, interactive, and responsive UI).
- **Database**: MySQL (Optimized with Global Scopes for tenant data isolation).
- **Real-time**: Ziggy (Seamless Laravel route synchronization to the frontend).
- **Payments**: Stripe Integration (For global, secure transactions).

## 🏗️ Architecture & Design Patterns
- **Multi-Tenancy Pattern**: Implemented via a custom Identification Middleware and Eloquent Global Scopes, ensuring strict data isolation between stores.
- **Monolith-Inertia Bridge**: Utilizes Inertia.js to eliminate the need for a separate REST/GraphQL API, reducing latency and complexity while maintaining a modern React frontend.
- **Event-Driven Architecture**: Uses Laravel Events and Queued Listeners (e.g., `OrderConfirmed`, `UserInvited`) to handle asynchronous tasks like email delivery and stock management without blocking the main thread.
- **Service-Repository Pattern**: Decouples business logic from controllers, making the codebase highly testable and maintainable.
- **Trait-Based Composition**: Uses PHP Traits (e.g., `BelongsToStore`) for reusable, shared logic across models.

## 🌟 Key Features for CV
- **Store Orchestrator**: Developed a complex "Home Layout Orchestrator" that allows admins to build and preview their storefront layouts dynamically.
- **Scalable Invitation System**: Built a secure, token-based role invitation system with queued email notifications for store managers and admins.
- **Advanced Discount Engine**: Engineered a promotion system supporting percentage/fixed discounts with logic for `max_discount_amount`, minimum order values, and expiration dates.
- **Enterprise-Grade Security**: Implemented multi-layered authentication including Google OAuth and Role-Based Access Control (RBAC).

---
*Unistore represents a deep understanding of full-stack engineering, from database-level isolation to complex frontend state management.*
