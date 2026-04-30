import firebase_admin
from firebase_admin import credentials
from app.core.config import settings
import logging
from firebase_admin import firestore

logger = logging.getLogger(__name__)

def initialize_firebase():
    """Khởi tạo Firebase Admin SDK."""
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(settings.firebase_service_account_path)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully.")
        else:
            logger.info("Firebase Admin SDK already initialized.")
    except Exception as e:
        logger.error(f"Error initializing Firebase Admin SDK: {e}")

def get_db():
    return firestore.client()