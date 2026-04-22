from app import db
from app.models import Course, Studyprogram, Studyplan, Institute, Semester, SemesterCourses, Log, Notifications, Coursepackage
import uuid
from services.prerequisite import PrerequisiteService
from sqlalchemy import func, and_, or_, union, literal, text, literal_column
from sqlalchemy.orm import joinedload
from flask import jsonify, request


class CoursePackageService:
    def __init__(self, db_session=None):
        self.db = db_session or db.session
        
    def create_course_package(self, name, studyplan_id, packagetype):
        try: 
            course_package_id = str(uuid.uuid4())
            new_course_package = Coursepackage(id=course_package_id, name=name, studyplan_id=studyplan_id, packagetype=packagetype)
            self.db.add(new_course_package)
            self.db.commit()
            return new_course_package
        except Exception as e:
            self.db.rollback()
            print(f"Error creating course package: {str(e)}")
            raise e
    
    def get_course_package(self, course_package_id):
        try:
            course_package = Coursepackage.query.get(course_package_id)
            if not course_package:
                raise ValueError("Course package not found")
            return course_package
        except Exception as e:
            print(f"Error fetching course package: {str(e)}")
            raise e
    
    def get_courses_in_package(self, course_package_id):
        try:
            course_package = self.get_course_package(course_package_id)
            return course_package.courses
        except Exception as e:
            print(f"Error fetching courses in package: {str(e)}")
            raise e

    def get_course_packages_by_studyplan(self, studyplan_id):
        try:
            course_packages = Coursepackage.query.filter_by(studyplan_id=studyplan_id).all()
            return course_packages
        except Exception as e:
            print(f"Error fetching course packages: {str(e)}")
            raise e
        
    def delete_course_package(self, course_package_id):
        try:
            course_package = Coursepackage.query.get(course_package_id)
            if not course_package:
                raise ValueError("Course package not found")
            self.db.delete(course_package)
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            print(f"Error deleting course package: {str(e)}")
            raise e
        
    def add_course_to_package(self, package_id, course_id):
        try:
            package = Coursepackage.query.get(package_id)
            if not package:
                raise ValueError("Package not found")

            course = Course.query.get(course_id)
            if not course:
                raise ValueError("Course not found")

            packages_in_plan = Coursepackage.query.filter_by(
                studyplan_id=package.studyplan_id
            ).all()

            for cp in packages_in_plan:
                if course in cp.courses:
                    cp.courses.remove(course)

            if course not in package.courses:
                package.courses.append(course)

            db.session.commit()
            return package

        except Exception as e:
            db.session.rollback()
            print("Error:", e)
            raise e
    
    def remove_course_from_package(self, course_package_id, course_id):
        try:
            course_package = self.get_course_package(course_package_id)
            course = Course.query.get(course_id)
            if not course_package or not course:
                raise ValueError("Course package or course not found")
            if course in course_package.courses:
                course_package.courses.remove(course)
                self.db.commit()
        except Exception as e:
            self.db.rollback()
            print(f"Error removing course from package: {str(e)}")
            raise e