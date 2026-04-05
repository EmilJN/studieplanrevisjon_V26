from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from app.config import Config


from os import environ

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    CORS(app,origins=["http://localhost:3000", "http://127.0.0.1:3000"],supports_credentials=True,)
    app.config.from_object(Config)
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    return app


