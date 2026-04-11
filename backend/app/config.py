import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    
    _db_host = os.environ.get("DB_HOST")
    _db_name = os.environ.get("DB_NAME")
    _db_user = os.environ.get("DB_USER")
    _db_pass = os.environ.get("DB_PASSWORD")
    if _db_host and _db_name and _db_user and _db_pass:
        SQLALCHEMY_DATABASE_URI = f"postgresql://{_db_user}:{_db_pass}@{_db_host}/{_db_name}"
    else:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(os.path.abspath(os.path.dirname(__file__)), '../instance/app.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BACKUP_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), '../instance/backups')

    SESSION_COOKIE_SAMESITE = None
    SESSION_COOKIE_SECURE = False  # True in production with HTTPS
    SESSION_COOKIE_HTTPONLY = True

    # Flask Mail configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER ='trulsovrebo@gmail.com'
    
    #FEIDE OAuth
    FEIDE_CLIENT_ID = os.environ.get("FEIDE_CLIENT_ID")
    FEIDE_CLIENT_SECRET = os.environ.get("FEIDE_CLIENT_SECRET")


