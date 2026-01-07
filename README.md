# CredFlow 🚀  
### AI-Powered Invoice Financing & Risk Assessment Platform (FinTech SaaS)

**CredFlow** is a full-stack FinTech application that automates **invoice financing decisions for small and medium businesses (SMEs)** using AI-powered document processing, deterministic credit scoring, and real-world fraud detection workflows.

This project is built to **mirror how production FinTech systems actually work**, focusing on **risk containment, auditability, and reliability** — not just UI or CRUD APIs.

> ⚠️ This is **not a tutorial project**. It demonstrates real financial decision logic used in B2B lending platforms.

---

## 🌟 Why Recruiters Care About This Project

✔ End-to-end FinTech workflow (Invoice → Risk → Credit → Financing)  
✔ AI integration with real document intelligence (OCR)  
✔ Explainable, rule-based financial logic (no black-box ML)  
✔ Industry-grade backend testing & validation  
✔ Clean, modern dashboard with analytics  

This project reflects **how I think as a backend / full-stack engineer**, especially in **regulated, money-sensitive systems**.

---

## 🧾 Real-World Problem Statement

SMEs often wait **30–90 days** to receive payments after issuing invoices.  
This creates a **liquidity gap** that affects daily operations.

**CredFlow solves this by:**
- Verifying invoice authenticity instantly
- Evaluating business risk automatically
- Offering instant short-term financing (up to **85%** of invoice value)
- Logging every decision for compliance & audits

---

## 🚀 Core Features

### 1️⃣ Intelligent Invoice Processing
- **AI-Powered OCR:** Uses **Google Cloud Document AI** to extract:
  - Invoice number
  - Buyer & seller details
  - GSTINs
  - Invoice totals and tax values
- **Automated Validation:** Cross-verifies extracted data with business profiles to detect inconsistencies.

---

### 2️⃣ Risk, Credit & Fraud Engine (Core Logic)
- **Multi-Factor Credit Scoring**
  - Business age
  - Annual revenue
  - Outstanding invoice exposure
  - Invoice amount vs revenue ratio
- **Fraud Detection Rules**
  - Duplicate invoice numbers
  - Abnormal amount spikes (>40%)
  - Suspicious high-frequency uploads
- **Risk Classification**
  - Low / Medium / High
  - Credit Grades: **A → D**
- **Automated Financing Logic**
  - Financing up to **85%**
  - Risk-based caps
  - Platform fee calculations

> 💡 Every financing decision is **deterministic, explainable, and auditable**.

---

### 3️⃣ Professional FinTech Dashboard
- Credit score gauges & risk trend charts
- Financing analytics & exposure tracking
- System-wide **audit logs**
- Responsive UI with smooth motion effects

---

## 🖼️ Project Screenshots


### Dashboard Overview
![Dashboard](screenshots/credflow-4)

### Invoice Upload & OCR Extraction
![Invoice Upload](screenshots/credflow-6)

### Risk & Credit Assessment
![Risk Engine](screenshots/credflow-7)

### Financing Decision Flow
![Financing](screenshots/credflow-8)

---

## 🧠 System Architecture

```

Frontend (React)
↓
Invoice Upload
↓
OCR (Document AI)
↓
Fraud Engine → Credit Engine
↓
Financing Decision
↓
Audit Logs + Dashboard

````

### Workflow Breakdown
1. Invoice uploaded via frontend
2. OCR extracts structured invoice data
3. Fraud & credit engines evaluate risk
4. Financing service determines approval & limits
5. Every step is logged for compliance

---

## 🛠️ Tech Stack

### Frontend
- React 19 (Vite)
- Tailwind CSS
- Framer Motion
- Recharts
- Context API (Auth, Theme, Notifications)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Google Cloud Document AI
- JWT Authentication
- Cloudinary (secure file storage)
- Helmet.js & Bcrypt

---

## 🧪 Testing & Reliability

Built with a **financial correctness-first** approach.

- Integration tests for:
  - Credit scoring accuracy
  - Financing calculations
  - Invoice lifecycle flows
- External services mocked for isolation

```bash
cd Backend
npm test
````

---

## 🔧 Installation & Setup

### Prerequisites

* Node.js (v18+)
* MongoDB Atlas
* Google Cloud Project with Document AI enabled

### Clone Repository

```bash
git clone https://github.com/your-username/credflow.git
cd credflow
```

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GCP_PROJECT_ID=your_project_id
GCP_LOCATION=us
DOCUMENT_AI_PROCESSOR_ID=your_processor_id
GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account.json
CLOUDINARY_URL=your_cloudinary_url
GEMINI_API_KEY=your_gemini_api_key
```

Run backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
```

---

## 👨‍💻 Developer Insight

CredFlow was built to demonstrate **how real FinTech platforms reason about money**.

The emphasis is on:

* Risk containment
* Explainable decisions
* Audit-ready systems
* Production-grade backend architecture

This project reflects my approach to **engineering reliable systems in financial domains**.

---

## 📫 Contact

If you're a recruiter, engineer, or FinTech enthusiast,
feel free to connect — I’d be happy to discuss system design, trade-offs, and scaling strategies.

---

⭐ If you find this project valuable, consider starring the repository!

```
