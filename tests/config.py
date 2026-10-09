import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")
    
    TEST_MEMBER_EMAIL = os.getenv("TEST_MEMBER_EMAIL", "athlete@omnifit.com")
    TEST_MEMBER_PASSWORD = os.getenv("TEST_MEMBER_PASSWORD", "AthletePass123!")
    
    TEST_TRAINER_EMAIL = os.getenv("TEST_TRAINER_EMAIL", "trainer@omnifit.com")
    TEST_TRAINER_PASSWORD = os.getenv("TEST_TRAINER_PASSWORD", "TrainerPass123!")
    
    TEST_ADMIN_EMAIL = os.getenv("TEST_ADMIN_EMAIL", "admin@omnifit.com")
    TEST_ADMIN_PASSWORD = os.getenv("TEST_ADMIN_PASSWORD", "AdminPass123!")
