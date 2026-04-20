from flask import Flask, jsonify, request, Blueprint
from app.models import db, Course
from flask_migrate import Migrate

prerequisites_bp = Blueprint('prerequisites', __name__)


# Legg til prerequisite
@prerequisites_bp.route("/add/<int:parent_id>", methods=["POST"])
def add_prerequisites(parent_id):
    prereqiered_course_list = request.get_json()
    parent_course = Course.query.get(parent_id)
    for prereqiered_course in prereqiered_course_list:
        course = Course.query.get(prereqiered_course['id'])
        parent_course.prerequisites.append(course)
    db.session.commit()
    # Returner parent course og alle prereqs etter oppdatering
    prereqs = [
        {"id": c.id, "name": c.name, "courseCode": c.courseCode}
        for c in parent_course.prerequisites
    ]
    return jsonify({
        "message": "courses added successfully",
        "parent_course": {"id": parent_course.id, "name": parent_course.name, "courseCode": parent_course.courseCode},
        "prerequisites": prereqs
    }), 201

@prerequisites_bp.route("/remove/<int:id>/<int:preid>", methods=["DELETE"])
def remove_prerequisite(id,preid):
    course = Course.query.get(id)
    for i in course.prerequisites:
        if i.id == preid:
            course.prerequisites.remove(i)

    db.session.commit()
    return(jsonify({"message":"Removed"}))