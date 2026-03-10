# AI Medical Report Analyzer

Full-stack web application that lets users upload medical reports (PDF or image), run OCR, analyze key values with AI-like logic, and visualize results in an interactive dashboard.

## Tech Stack

- **Frontend**: React (functional components, hooks), Webpack, Bootstrap CDN, Chart.js
- **Backend**: Node.js, Express.js, Tesseract OCR, pdf-parse
- **Firebase**: Authentication, Realtime Database, Storage

## Project Structure

- `backend/` – Express API (upload, OCR, AI analysis)
- `frontend/` – React single-page app dashboard
- `firebase/` – Example environment template for Firebase configuration

## Prerequisites

- Node.js (18+ recommended)
- A Firebase project with:
  - Email/password authentication enabled
  - Realtime Database in test mode (or proper security rules)
  - Storage enabled

## Backend Setup

1. Open a terminal in `backend/` and install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/` (or copy `.env.example`):

   ```bash
   PORT=5000
   NODE_ENV=development
   ```

3. Start the backend server:

   ```bash
   npm run dev
   ```

   The API will run at `http://localhost:5000`.

## Firebase Configuration

1. In the Firebase console, create a web app and copy the config values.
2. Use `firebase/.env.example` as a reference. For local development with this setup:

   - In **PowerShell** on Windows:

     ```powershell
     setx FIREBASE_API_KEY "your_api_key_here"
     setx FIREBASE_AUTH_DOMAIN "your_project_id.firebaseapp.com"
     setx FIREBASE_DATABASE_URL "https://your_project_id.firebaseio.com"
     setx FIREBASE_PROJECT_ID "your_project_id"
     setx FIREBASE_STORAGE_BUCKET "your_project_id.appspot.com"
     setx FIREBASE_MESSAGING_SENDER_ID "your_sender_id"
     setx FIREBASE_APP_ID "your_app_id"
     ```

   - Then restart your terminal so the frontend build can see these environment variables.

> In a production-ready app you would typically use a `.env` file and a bundler that exposes selected variables (e.g. `REACT_APP_` prefix). For simplicity this project reads Firebase config directly from `process.env`.

## Frontend Setup

1. Open a terminal in `frontend/` and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the React development server:

   ```bash
   npm start
   ```

   - The app will run at `http://localhost:3000`.
   - All requests to `/api/*` are proxied to `http://localhost:5000` (the backend).

## Core Flows

- **Authentication** (Firebase):
  - Email/password signup and login.
  - User profile stored under `users/{uid}/profile` in Realtime Database.
- **Report Upload**:
  - Upload PDF or image to Firebase Storage with progress indicator.
  - After upload completes, the same file is posted to the backend `/api/reports/analyze` endpoint.
- **OCR & Analysis**:
  - Backend extracts text from the file.
  - Simple rules-based analysis detects values like hemoglobin, cholesterol, triglycerides, fasting glucose, etc., and classifies them as normal/warning/high risk.
- **Dashboard**:
  - Shows recent reports from Realtime Database.
  - For the selected report, displays:
    - Simplified AI summary
    - Abnormal value detection with colored badges
    - Health risk score (0–100) and gauge chart
    - Bar chart of key lab values
    - Diet & lifestyle suggestions
    - Doctor recommendation
- **AI Chat About Report**:
  - Ask questions like “Is my cholesterol dangerous?”
  - Frontend sends the question and the current analysis context to `/api/reports/chat`.
- **Voice Explanation**:
  - Browser `speechSynthesis` reads the AI summary aloud.
- **Downloadable Summary PDF**:
  - Client-side PDF generation of the AI summary and key metrics.

## Running Locally – Quick Start

1. **Backend**:
   - `cd backend`
   - `npm install`
   - `npm run dev`
2. **Frontend** (in a separate terminal):
   - `cd frontend`
   - Ensure Firebase environment variables are set
   - `npm install`
   - `npm start`
3. Open `http://localhost:3000` in your browser.

## Notes & Security

- Do not commit real Firebase API keys or secrets to a public repository.
- Configure proper Firebase Realtime Database and Storage rules before deploying.
- The “AI” analysis here is rules-based and for educational/demo purposes only; it is **not** medical advice.

