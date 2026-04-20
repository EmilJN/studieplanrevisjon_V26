
from app.models import db, Course

class PrerequisiteService:
    @staticmethod
    def add_prerequisites(parent_id, prereqiered_course_list):
        parent_course = Course.query.get(parent_id)
        if not parent_course:
            raise ValueError(f"Course with ID {parent_id} not found")
        for prereqiered_course in prereqiered_course_list:
            course = Course.query.get(prereqiered_course['id'])
            if course and course not in parent_course.prerequisites:
                parent_course.prerequisites.append(course)
        db.session.commit()
        prereqs = [
            {"id": c.id, "name": c.name, "courseCode": c.courseCode}
            for c in parent_course.prerequisites
        ]
        return {
            "parent_course": {"id": parent_course.id, "name": parent_course.name, "courseCode": parent_course.courseCode},
            "prerequisites": prereqs
        }
    @staticmethod
    def remove_prerequisite(course_id, prereq_id):
        course = Course.query.get(course_id)
        if not course:
            raise ValueError(f"Course with ID {course_id} not found")
        removed = False
        for i in course.prerequisites:
            if i.id == prereq_id:
                course.prerequisites.remove(i)
                removed = True
                break
        db.session.commit()
        return {"removed": removed}

    @staticmethod
    def transfer_prerequisites(course_id, new_course_id):
        course = Course.query.get(course_id)
        new_course = Course.query.get(new_course_id)
        if not course:
            raise ValueError(f"Course with ID {course_id} not found")
        if not new_course:
            raise ValueError(f"Course with ID {new_course_id} not found")
        
        for prereq in course.prerequisites:
            if prereq not in new_course.prerequisites:
                new_course.prerequisites.append(prereq)
        db.session.commit()