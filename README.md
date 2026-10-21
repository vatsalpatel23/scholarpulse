<div align="center">

# 🎓 ScholarPulse AI
### Next-Gen AI Scholarship Recommendation & Academic Grant Discovery Ecosystem

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.6-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Author](https://img.shields.io/badge/Author-Vatsal%20Patel-indigo?style=for-the-badge&logo=github)](https://github.com/vatsalpatel23)

<p align="center">
  <b>A full-stack, AI-powered scholarship recommendation platform powered by Scikit-Learn Cosine Similarity ranking, dynamic database criteria pruning, dual-engine storage (Zero-Config SQLite + Production MySQL), and an interactive administrative analytics console.</b>
</p>

[Quick Demo](#-demo-credentials) • [Features](#-key-features) • [ML Architecture](#-recommendation-engine--mathematical-model) • [Setup Guide](#-local-installation--setup) • [GitHub Push Guide](#-pushing-to-your-github)

---

</div>

## 🌟 Overview

**ScholarPulse AI** bridges the gap between ambitious students and life-changing academic funding. While millions of rupees in government, non-profit, and corporate scholarships go unawarded annually due to discovery friction and convoluted eligibility criteria, ScholarPulse simplifies this with an intelligent multi-stage vector matching pipeline.

Students submit their profile once and receive high-affinity scholarship recommendations ranked by an AI similarity score (65% – 99%), along with real-time deadline counters and direct application links.

---

## ⚡ Key Features

### 👨‍🎓 For Students
* **Multi-Dimensional AI Matching**: Evaluates students across 5 key dimensions: Financial Need, Academic Merit, Category Affinity, Gender Reservations, and Education Tier.
* **Smart Eligibility Filtering**: Instantly discards ineligible scholarships using database constraints before ranking.
* **Live Deadline Tracking**: Real-time badge indicators for remaining application windows (`Expiring Soon`, `30 days left`, `Application Closed`).
* **Interactive Vector Breakdown**: Students can inspect exactly why a scholarship was recommended, with visual dimension score bars.
* **Official Apply Links**: One-click direct redirection to government portals (NSP, MahaDBT) and foundation portals.

### 🛡️ For Administrators
* **Interactive Telemetry Dashboard**: Built with Recharts, displaying applicant caste distribution, gender representation, and scholarship lifecycle states.
* **Complete Catalog Lifecycle (CRUD)**: Create, edit, archive, and draft scholarships with customized percentage thresholds and income limits.
* **Student Inquiries Audit**: Real-time log of student questionnaire submissions and academic demographics.
* **User Identity Management**: Audit and manage student and administrator accounts.

### ⚙️ Engineering & Architecture
* **Dual-Engine Database Layer**: Runs seamlessly on **zero-configuration SQLite out-of-the-box** for effortless cloning and testing, while providing full native compatibility with **MySQL 8.0+** for production deployments.
* **JWT Access & Refresh Token Rotation**: Secure authentication with automated token refreshing via Axios interceptors.
* **Modern UI/UX**: Built with React 19, Tailwind CSS v4, Lucide Icons, and glassmorphic micro-interactions.
* **Zero Bloat Repository**: Follows strict git hygiene with clean dependency manifests and zero committed binaries/virtual environments.

---

## 🧠 Recommendation Engine & Mathematical Model

The recommendation engine employs an intelligent 2-stage discovery pipeline:

```
                      Student Profile Submission
             [Marks %, Family Income, Caste, Gender, Education]
                                   │
                                   ▼
                   Stage 1: Hard Constraint Pruning
       ┌────────────────────────────────────────────────────────┐
       │  • Scholarship Min Marks <= Student Marks              │
       │  • Scholarship Max Income Cap >= Student Family Income │
       │  • Education Tier Match or Open                        │
       │  • Category & Gender Eligibility Verification           │
       └────────────────────────────────────────────────────────┘
                                   │
                                   ▼ Eligible Candidates
                   Stage 2: Multi-Dimensional Vectorization
       ┌────────────────────────────────────────────────────────┐
       │ Dimension 1: Financial Need Ratio                      │
       │ Dimension 2: Academic Performance Normalization        │
       │ Dimension 3: Category Affirmative Action Weight        │
       │ Dimension 4: Gender Reservation Weight                  │
       │ Dimension 5: Qualification Alignment                   │
       └────────────────────────────────────────────────────────┘
                                   │
                                   ▼
             Cosine Similarity Computation (Scikit-Learn)
                   Sim(S, P) = (v_S · v_P) / (||v_S|| ||v_P||)
                                   │
                                   ▼
            Ranked Recommendations (Top Match to Lowest)
```

### Mathematical Formula:
Given student feature vector $\mathbf{v}_S$ and scholarship vector $\mathbf{v}_P$:

$$\text{Score}(\mathbf{v}_S, \mathbf{v}_P) = \frac{\sum_{i=1}^{5} v_{S,i} \cdot v_{P,i}}{\sqrt{\sum_{i=1}^{5} v_{S,i}^2} \cdot \sqrt{\sum_{i=1}^{5} v_{P,i}^2}}$$

---

## 🗂️ Project Structure

```text
scholarpulse/
│
├── backend/
│   ├── app.py                     # Flask application entrypoint & API routes
│   ├── auth.py                    # JWT authentication & password management
│   ├── database.py                # Dual-engine DB layer (SQLite default + MySQL)
│   ├── decoder.py                 # Admin authorization role decorators
│   ├── scholarship.py             # Admin scholarship CRUD & analytics statistics
│   ├── scholarshipFilter.py       # ML vectorization & Cosine Similarity engine
│   ├── student.py                 # Student profile & applicant auditing endpoints
│   ├── test_backend.py            # Automated backend unit test suite
│   ├── requirements.txt           # Python dependencies
│   └── .env.example               # Backend environment template
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── AppRoutes.jsx      # React Router DOM v7 route definitions
│   │   ├── features/
│   │   │   ├── admin/             # Analytics dashboard, CRUD forms, audit tables
│   │   │   ├── auth/              # Login with 1-click demo buttons & signup
│   │   │   └── scholarship/       # Profile questionnaire & recommendation cards
│   │   ├── shared/
│   │   │   ├── api/axiosClient.js # Axios client with JWT refresh interceptor
│   │   │   ├── components/        # Navbar, Footer, Route Guards
│   │   │   └── pages/             # Landing page & 404 page
│   │   ├── App.jsx                # Main layout component
│   │   ├── index.css              # Tailwind CSS styles
│   │   └── main.jsx               # React entrypoint
│   ├── package.json               # Node.js dependencies
│   ├── vite.config.js             # Vite configuration
│   └── .env.example               # Frontend environment template
│
├── database/
│   └── schema.sql                 # Complete MySQL 8.0 schema & seed data dump
│
├── .gitignore                     # Production-grade git ignore configuration
├── LICENSE                        # MIT License
└── README.md                      # Documentation
```

---

## 🔑 Demo Credentials

For quick evaluation without manual registration, use the 1-click demo buttons on the Login page or the credentials below:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Student** | `vatsal@scholarpulse.com` | `student123` | Eligibility Matcher, Personalized Recommendations |
| **Admin** | `admin@scholarpulse.com` | `admin123` | Telemetry Dashboard, Scholarship CRUD, User Audits |

---

## 🚀 Local Installation & Setup

### Prerequisites
* **Node.js**: v18.0 or newer
* **Python**: v3.10 or newer
* **Git**: Installed on your system

---

### Step 1 — Clone or Navigate to the Repository

```bash
git clone https://github.com/vatsalpatel23/scholarpulse.git
cd scholarpulse
```

---

### Step 2 — Backend Setup (Python / Flask)

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   # Windows:
   python -m venv venv
   venv\Scripts\activate

   # macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create your `.env` file (SQLite is enabled by default):
   ```bash
   # Windows:
   copy .env.example .env

   # macOS / Linux:
   cp .env.example .env
   ```

5. Run automated backend test suite:
   ```bash
   python test_backend.py
   ```

6. Start the Flask backend server:
   ```bash
   python app.py
   ```
   *Backend will run at: `http://127.0.0.1:5000`*

---

### Step 3 — Frontend Setup (React / Vite)

In a new terminal window:

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *Frontend will run at: `http://localhost:5173`*

---

## 🛢️ Optional: Using MySQL Instead of SQLite

If you prefer running against a dedicated MySQL server:

1. Open MySQL and import the provided database script:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
2. In `backend/.env`, set:
   ```env
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=scholarship_portal
   ```
3. Restart the backend: `python app.py`.

---

## 📤 Pushing to Your GitHub

To publish this project to your GitHub account ([@vatsalpatel23](https://github.com/vatsalpatel23)):

### 1. Create a New Repository on GitHub
* Go to [github.com/new](https://github.com/new)
* Repository name: `scholarpulse` (or `scholarship-portal-ai`)
* Set visibility to **Public**
* **Do NOT** initialize with README, .gitignore, or license (already created locally)
* Click **Create repository**

### 2. Push from your local project terminal

From the root project directory (`c:\project1`):

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "feat: initial commit of ScholarPulse AI scholarship portal"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub remote
git remote add origin https://github.com/vatsalpatel23/scholarpulse.git

# 6. Push to GitHub
git push -u origin main
```

---

## 👨‍💻 Author & Acknowledgements

* **Author & Lead Developer**: [Vatsal Patel](https://github.com/vatsalpatel23)
* **Inspired By**: Modern full-stack educational equity platforms & algorithmic recommender systems.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
