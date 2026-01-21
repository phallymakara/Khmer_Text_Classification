# Use a slim version of Python for smaller image size
FROM python:3.11-slim

# Install system dependencies for PostgreSQL and ML tools
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your project
COPY . .

# Command to run your app (adjust if using FastAPI or Flask)
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]