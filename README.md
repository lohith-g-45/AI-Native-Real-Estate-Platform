# AI-Native Real Estate Platform

Welcome to the AI-Native Real Estate Platform, a cutting-edge web application designed to streamline property discovery and management. 

## Project Overview

This repository contains the complete end-to-end integration for our Real Estate Platform. We have successfully delivered a secure, responsive, and data-driven ecosystem consisting of a NestJS backend architecture and a modular vanilla JavaScript frontend.

### Features Implemented
- **Secure Authentication System:** Fully operational local email/password registration and Google OAuth integrations.
- **Verification Workflows:** Embedded OTP-based email verification and streamlined inline password reset functionality.
- **Identity & Access Management:** JWT-based session handling, protected API endpoints, and client-side route guards.
- **Comprehensive Dashboards:** 
  - **Main Dashboard:** Dynamic property discovery with responsive horizontal sliders.
  - **Buyer Hub:** Centralized hub featuring Saved Properties, AI Suggestions, Market Alerts, and a Pre-Approval Calculator.
  - **Seller Hub:** Management interface for Active/Pending listings, Performance Analytics, and AI Home Valuations.
- **User Profile Management:** Secure rendering of privacy consent toggles and system-level audit logs for robust observability.

---

## Environment Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v16+ recommended)
- `npm` (comes with Node.js) or `pnpm`
- A local database instance (PostgreSQL, or SQLite as fallback)

### 2. Backend Initialization (API)
The backend service powers our authentication and database management.

```bash
# Navigate to the project root directory
cd AI-Native-Real-Estate-Platform

# Install server dependencies
npm install

# Environment Configuration
# Copy the `.env.example` file to `.env` and configure your database and SMTP credentials.
cp .env.example .env

# Launch the NestJS backend
npm run start:dev
```
> The API server will successfully launch and listen on `http://localhost:3000`.

### 3. Frontend Initialization (Client)
The frontend consists of static HTML, CSS, and JS assets.

```bash
# From the project root, launch a local HTTP server targeting the Frontend folder.
# You can use npx serve on port 8080:
npx serve Frontend -p 8080
```
> Navigate your browser to `http://localhost:8080` to access the platform.

---

## Troubleshooting Guide

### Issue: "Failed to fetch" Error on Login or Registration
If you encounter a `Failed to fetch` error when attempting to authenticate, this indicates that the frontend client cannot establish a connection with the backend API. 

**Root Causes & Solutions:**
1. **Local Database Connection Error:** Your PostgreSQL/SQLite database might not be running or the credentials in the `.env` file are incorrect. Verify that your database service is active and the `DB_*` variables precisely match your configuration.
2. **Backend Server is Offline:** Ensure that the NestJS server is actively running in a terminal instance (`npm run start:dev`). If the server crashed or was terminated, restart it and verify it reports `🚀 Server running on http://localhost:3000` before attempting to log in again.
3. **CORS Restrictions:** Confirm that you are accessing the frontend via the local HTTP server (`http://localhost:8080`) and not opening the HTML files directly from the file explorer (`file://...`), as strict CORS policies are enforced.

---

*This architecture adheres to modern web standards, prioritizing high cohesion, security, and an optimal user experience.*
