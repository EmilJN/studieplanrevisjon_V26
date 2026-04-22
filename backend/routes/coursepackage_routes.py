from flask import Flask, jsonify, request, Blueprint
from app.models import Course, Studyprogram, Institute, Studyplan
from app import db
from services import ServiceFactory


coursepackage_bp = Blueprint('coursepackage', __name__)

@coursepackage_bp.route("/CreateCoursePackage/<int:studyplan_id>", methods=["POST"])
def create_coursepackage(studyplan_id):
    try:
        coursepackage_service = ServiceFactory.get_coursepackage_service()
        data = request.get_json()
        name = data.get("name")
        packagetype = data.get("packagetype")
        coursepackage = coursepackage_service.create_course_package(name, studyplan_id, packagetype)
        return jsonify(coursepackage.serialize()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@coursepackage_bp.route("/GetCoursePackages/<int:studyplan_id>", methods=["GET"])
def get_coursepackages_by_plan(studyplan_id):
    try:
        coursepackage_service = ServiceFactory.get_coursepackage_service()
        coursepackages = coursepackage_service.get_course_packages_by_studyplan(studyplan_id)
        return jsonify([cp.serialize() for cp in coursepackages]), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@coursepackage_bp.route("/DeleteCoursePackage/<string:coursepackage_id>", methods=["DELETE"])
def delete_coursepackage(coursepackage_id):
    try:
        coursepackage_service = ServiceFactory.get_coursepackage_service()
        coursepackage_service.delete_course_package(coursepackage_id)
        return jsonify({"message": "Course package deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@coursepackage_bp.route("/GetCoursesInPackage/<string:coursepackage_id>", methods=["GET"])
def get_courses_in_package(coursepackage_id):
    try:
        coursepackage_service = ServiceFactory.get_coursepackage_service()
        courses = coursepackage_service.get_courses_in_package(coursepackage_id)
        return jsonify([course.serialize() for course in courses]), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@coursepackage_bp.route("/GetCoursePackage/<string:coursepackage_id>", methods=["GET"])
def get_course_package(coursepackage_id):
    try:
        coursepackage_service = ServiceFactory.get_coursepackage_service()
        coursepackage = coursepackage_service.get_course_package(coursepackage_id)
        return jsonify(coursepackage.serialize()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@coursepackage_bp.route("/AddCourseToPackage/<string:coursepackage_id>", methods=["PUT"])
def add_course_to_package(coursepackage_id):
    try:
        coursepackage_service = ServiceFactory.get_coursepackage_service()
        data = request.get_json()
        course_id = data.get("course_id")
        coursepackage_service.add_course_to_package(coursepackage_id, course_id)
        return jsonify({"message": "Course added to package successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@coursepackage_bp.route("/RemoveCourseFromPackage/<string:coursepackage_id>", methods=["POST"])
def remove_course_from_package(coursepackage_id):
    try:
        coursepackage_service = ServiceFactory.get_coursepackage_service()
        data = request.get_json()
        course_id = data.get("course_id")
        coursepackage_service.remove_course_from_package(coursepackage_id, course_id)
        return jsonify({"message": "Course removed from package successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500