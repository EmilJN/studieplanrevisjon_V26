from flask import Flask, jsonify, request, Blueprint
from app.models import db, Course
from services.prerequisite import PrerequisiteService
from flask_migrate import Migrate

prerequisites_bp = Blueprint('prerequisites', __name__)


# Legg til prerequisite
@prerequisites_bp.route("/add/<int:parent_id>", methods=["POST"])
def add_prerequisites(parent_id):
    prereqiered_course_list = request.get_json()
    try:
        result = PrerequisiteService.add_prerequisites(parent_id, prereqiered_course_list)
        return jsonify({
            "message": "courses added successfully",
            **result
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@prerequisites_bp.route("/remove/<int:id>/<int:preid>", methods=["DELETE"])
def remove_prerequisite(id, preid):
    try:
        result = PrerequisiteService.remove_prerequisite(id, preid)
        return jsonify({"message": "Removed", **result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
