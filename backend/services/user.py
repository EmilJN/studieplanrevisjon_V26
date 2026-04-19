from app import db
import os
from app.models import User, Log

class UserService:
    def __init__(self, db_session=None):
        self.db = db_session or db.session

    def get_user_by_id(self, user_id):
        return self.db.get(User, user_id)

    def get_user_by_email(self, email):
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_feide_id(self, feide_id):
        return self.db.query(User).filter(User.feide_id == feide_id).first()

    def create_user(self, feide_id, email, name, role='user'):
        user = User(feide_id=feide_id, email=email, name=name, role=role)
        if email in os.getenv("ADMIN_USERS", "").split(","):
            user.role = 'admin'
        log = Log(f"Opprettet ny bruker {user.email}")
        self.db.add(log)
        self.db.add(user)
        self.db.commit()
        return user

    def delete_user(self, user_id):
        user = self.get_user_by_id(user_id)
        self.db.delete(user)
        self.db.commit()
        return True
    
    def promote_user(self, user_id):
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        user.role = "admin"
        self.db.commit()
        return True

    def get_all_users(self):
        users = self.db.query(User).all()
        return [user.serialize() for user in users]

    def get_logs(self):
        logs = self.db.query(Log).all()
        return [log.serialize() for log in logs]
