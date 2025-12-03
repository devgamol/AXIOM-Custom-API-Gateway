# AXIOM – Custom API Management Platform

## Introduction

Axiom is a powerful and developer-friendly API management system designed to help teams create, secure, and monitor custom APIs with ease.  
Whether you’re generating API keys, managing usage, or integrating controlled endpoints into your applications, Axiom provides a simple and scalable interface to handle everything in one place.

Built with a clean **React frontend** and a robust **Node.js + Express backend**, Axiom ensures high performance, strong security, and an intuitive workflow for both developers and organizations.

________________________________________________________________________________________________________

## Project Overview

![gateway](https://github.com/user-attachments/assets/7073014b-c193-4e5c-a51d-17d5fc43156d)

Website Link: https://gateway.hitesh06.online/

Project UI: https://drive.google.com/drive/folders/1meE2pYXLF4QOaQndDNhge8EaNGPBRiUQ?usp=sharing

Website Workflow: https://drive.google.com/drive/folders/1LDeb1ipJh4EcjrqY9fgSoCKmw_4bkj0O?usp=sharing

---

## ⚠️ Important Note

- The first login may take **7–8 seconds** due to server warm-up.
- Use the following test credentials to explore the platform:

**Email:** testing@gmail.com  
**Password:** 123456  



________________________________________________________________________________________________________

## Features

### - API Key Generation & Management
Create, view, revoke, and manage multiple API keys securely with masked key views.

### - Secure Proxy-Based Routing
Axiom prevents direct backend exposure by routing all API requests through secure proxy endpoints.

### - Role-Based Access & Key Limits
One user can manage multiple keys with usage limits, expiration handling, and full activity visibility.

###  -Real-Time Usage Monitoring
Track how and when API keys are used, enabling performance insights and misuse detection.

### - Simplified Developer Dashboard
A clean and responsive UI built with React that allows users to manage everything in one place.

### - Backend Safety Enhancements
Your original backend URL never gets exposed — Axiom acts as the API gateway.

### - Fast, Lightweight & Scalable
Designed with Express, optimized middleware, and a modular structure for easy scaling.

________________________________________________________________________________________________________
## Requirements

Before installing Axiom, ensure your system has the following:

- **npm or yarn**
- **MongoDB / MongoDB Atlas**
- **Git**
- **React development environment**

## Installation

**Follow these steps to get AXIOM up and running:**

  **Backend Setup:**
1. **Clone the repository:**
    ```bash
    git clone https://github.com/devgamol/AXIOM-Custom-API-Gateway.git
    cd GATEWAY
    cd backend
    cd monolith

     ```

3. **Install dependencies:**
    ```bash
    npm install
		
    ```

4. **Set up environment variables:**
    - Create a .env file inside the backend folder:
     ```bash
    MONGO_URI=your_mongo_connection_string
    PORT=5000
    JWT_SECRET=your_jwt_secret
    NODE_ENV=production
     ```

5. **Initialize the database:**
    - Run migration scripts or use provided setup commands to prepare your database.

6. **Start the development server:**
    ```bash
    npm start
    
    ```

  **Frontend Setup**

1. **Install frontend dependencies**
```bash
   cd GATEWAY
   cd frontend
   npm install
 ```

3. **Configure environment**
   - Create a .env file inside the frontend:
```bash
VITE_API_BASE_URL=http://localhost:5000
```

4. **Start frontend**
```bash
npm run dev
```
5. Access the frontend at:
```bash
http://localhost:5173
```
________________________________________________________________________________________________________

## Contributing

We welcome contributions! To get started:

- Fork the repository on GitHub.
- Create a new branch for your feature or bugfix.
- Commit your changes with clear messages.
- Submit a pull request describing your changes.
