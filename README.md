# 🇰🇭 Khmer Text Classification System

**An End-to-End Machine Learning Platform for Khmer Linguistic Analysis**

![Python](https://img.shields.io/badge/Python-3.11-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Framework-green.svg)
![React](https://img.shields.io/badge/React-Vite-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue.svg)

## 📖 Overview

This project is a machine learning classification engine designed to categorize Khmer text into six distinct sectors: **Economic, Entertainment, Politic, Life, Sport, and Technology**.

As a Data Science student, I built this to solve the challenge of automated news categorization in the Khmer language, using a robust NLP pipeline and a modern full-stack architecture.

---

## Key Features

- **Modern UI:** user interface built with **React** and **Tailwind CSS**.
- **AI Inference:** Real-time text classification using a Linear SVC model.
- **Deep Insights:** Detailed confidence scores for the Top 3 predicted categories.
- **Audit Trail:** Automatic logging of all classifications into a PostgreSQL database.
- **History Drawer:** Sliding interface to review past analysis records directly from the database.

---

## Technical Architecture

The system follows a modular, containerized architecture for high portability and scalability.

### **Machine Learning Pipeline**

1. **Preprocessing:** Specialized tokenization for Khmer script.
2. **Vectorization:** TF-IDF (Term Frequency-Inverse Document Frequency).
3. **Feature Selection:** Chi-Square ($\chi^2$) for identifying the most predictive terms.
4. **Dimensionality Reduction:** SVD (Singular Value Decomposition) to optimize performance.
5. **Inference:** Linear SVC (Support Vector Classification).

---

## Tech Stack

| Layer        | Technologies                                      |
| :----------- | :------------------------------------------------ |
| **Frontend** | React.js, Vite, Tailwind CSS, Lucide Icons, Axios |
| **Backend**  | Python, FastAPI, Scikit-Learn, SQLAlchemy         |
| **Database** | PostgreSQL                                        |
| **DevOps**   | Docker, Docker Compose                            |

---

## Installation & Setup

To run this project on your own computer, ensure you have **Docker Desktop** installed.

### 1. Clone the repository

```bash
git clone [https://github.com/phallymakara/Khmer_Text_Classification.git](https://github.com/phallymakara/Khmer_Text_Classification.git)
cd Khmer_Text_Classification
```

### 2.Configure Environment Variables

- Create a .env file in the root and frontend/ folders:
  - Root **.env**

  ```bash
  DB_USER=user
  DB_PASSWORD=password
  DB_NAME=khmer_classification
  DB_HOST=db
  DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}
  ```

  - Frontend **.env**
    ```bash
    VITE_API_URL=http://localhost:8000
    ```

### 3. Launch with Docker

```bash
docker-compose up --build
```

#### the docker will show you

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Database

### 4. to test API

```bash
API Docs (Swagger): http://localhost:8000/docs
```

---

## Model Management

To keep the repository lightweight and comply with GitHub file size limitations, the trained machine learning model is not included in this repository.

### How to Get the Model

To obtain the trained model, please contact the author via Telegram:

https://t.me/phallymakara

### Model Setup

To run the prediction engine, follow these steps:

1. Obtain the model file named:
   `best_model_compressed.joblib`

2. Place the model file in the following directory:
   `backend/ml/`

3. Ensure the file name matches exactly:
   `best_model_compressed.joblib`

Once the model file is placed in the correct directory, the prediction engine will function correctly.
