# 🍽️ RestrauBuddy

![RestrauBuddy Banner](assets/banner.png)

**RestrauBuddy** is an end-to-end, AI-powered restaurant management ecosystem. It combines a high-performance React dashboard with a Python-based machine learning backend to help restaurant owners predict demand, minimize waste, and streamline daily operations.

---

## 🏗️ Project Structure

The project is divided into three main components:

- **[Frontend](./frontend)**: A premium React 19 dashboard built with TypeScript, Vite, and Tailwind CSS. It features real-time demand visualization and multilingual support.
- **[Backend](./backend)**: A Flask-based Python API that serves machine learning predictions to the frontend.
- **[Machine Learning](./machine_learning)**: The core intelligence layer containing data generation scripts, model training pipelines (Random Forest), and saved model binaries.

---

## 🌟 Key Features

- **Demand Forecasting**: Predict exact quantities for top dishes based on historical trends, festivals, and customer footfall.
- **Unified Dashboard**: A sleek, dark-themed interface providing at-a-glance analytics for revenue and inventory.
- **Inventory Optimization**: Automated insights to help maintain the perfect balance of stock.
- **Real-time Synchronization**: Frontend integrates seamlessly with Supabase for data persistence and the Flask API for AI insights.

---

## 🚀 Quick Start

To get the entire system running locally:

### 1. Backend & ML Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate # venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```
*The backend runs on `http://localhost:5001`.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The dashboard will be available at `http://localhost:5173`.*

---

## 📖 Component Documentation

For detailed technical specs and setup instructions for each layer, please refer to their respective READMEs:

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Machine Learning Documentation](./machine_learning/README.md)
- [Database Schema](./supabase_schema.sql)
