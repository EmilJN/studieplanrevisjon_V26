from app import db
from app.models import User, Log

class UserService:
    def __init__(self, db_session=None):
        self.db = db_session or db

    def get_user_by_id(self, user_id):
        return self.db.session.get(User, user_id)

    def get_user_by_email(self, email):
        return self.db.session.query(User).filter(User.email == email).first()

    def get_user_by_feide_id(self, feide_id):
        return self.db.session.query(User).filter(User.feide_id == feide_id).first()

    def create_user(self, feide_id, email, name, role='user'):
        user = User(feide_id=feide_id, email=email, name=name, role=role)
        log = Log(f"Opprettet ny bruker {user.email}")
        self.db.session.add(log)
        self.db.session.add(user)
        self.db.session.commit()
        return user

    def delete_user(self, user_id):
        user = self.get_user_by_id(user_id)
        self.db.session.delete(user)
        self.db.session.commit()
        return True

    def get_all_users(self):
        users = self.db.session.query(User).all()
        return [user.serialize() for user in users]

    def get_logs(self):
        logs = self.db.session.query(Log).all()
        return [log.serialize() for log in logs]
