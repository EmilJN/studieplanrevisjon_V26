from app import db
from app.models import Course, Studyprogram, Studyplan, Institute, Notifications, Semester, SemesterCourses
from sqlalchemy import func, and_, or_, literal_column
from sqlalchemy.orm import joinedload



class InstituteService:
    def __init__(self, db_session=None):
        self.db = db_session or db.session


    def create_institute(self, name):
        try:
            new_institute = Institute(name=name)
            self.db.add(new_institute)
            self.db.commit()
            return new_institute
        except Exception as e:
            self.db.rollback()
            raise RuntimeError(f"Failed to create institute: {str(e)}")

    def get_all_institutes(self):
        try:
            institutes = self.db.query(Institute).all()
            return institutes
        except Exception as e:
            raise RuntimeError(f"Failed to fetch institutes: {str(e)}")

    def get_institute_by_id(self, institute_id):
        institute = self.db.query(Institute).filter(Institute.id == institute_id).first()
        return institute

    def delete_institute(self, institute_id):
        try:
            institute = self.db.query(Institute).get(institute_id)
            if not institute:
                raise ValueError(f"Institute with id {institute_id} does not exist.")
            self.db.delete(institute)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise RuntimeError(f"Failed to delete institute {institute_id}: {str(e)}")