from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_mail import Mail
from app.config import Config
from authlib.integrations.flask_client import OAuth

from os import environ

db = SQLAlchemy()
migrate = Migrate()
oauth = OAuth()
mail = Mail()

def create_app():
    app = Flask(__name__)

    CORS(app, origins=["http://127.0.0.1:3000", "http://spr.ux.uis.no"], supports_credentials=True)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    oauth.init_app(app)
    mail.init_app(app)

    oauth.register(
        name='feide',
        client_id=app.config.get('FEIDE_CLIENT_ID'),
        client_secret=app.config.get('FEIDE_CLIENT_SECRET'),
        server_metadata_url='https://auth.dataporten.no/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email userinfo-name'}
    )

    return app


