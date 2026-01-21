import os
import time
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from dotenv import load_dotenv, find_dotenv

# 1. Automatically find the .env file in the current or parent directories
load_dotenv(find_dotenv())

# 2. Get the URL. In production (like Heroku or AWS), 
# the system environment variable will override the .env file.
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found. Ensure .env is set up or environment variables are provided.")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def wait_for_db():
    """Waits for the database to become available."""
    retries = 10
    while retries > 0:
        try:
            with engine.connect() as connection:
                print("Database is ready!")
                return
        except OperationalError:
            retries -= 1
            print(f"Waiting for database... {retries} retries left.")
            time.sleep(2)
    exit(1)