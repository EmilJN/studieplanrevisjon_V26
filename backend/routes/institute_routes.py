from flask import Flask, jsonify, request, Blueprint
from app.models import db, Course, Institute
from services.service_factory import ServiceFactory


institute_bp = Blueprint('institutes', __name__)


@institute_bp.get("/get_all")
def get_all_institutes():
    institute_service = ServiceFactory.get_institute_service()
    institutes = institute_service.get_all_institutes()
    return jsonify([institute.serialize() for institute in institutes])


@institute_bp.post("/add")
def add_institute():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"error": "Name is required"}), 400
    institute_service = ServiceFactory.get_institute_service()
    new_institute = institute_service.create_institute(name)
    return jsonify(new_institute.serialize()), 201

@institute_bp.delete("/delete/<string:institute_id>")
def delete_institute(institute_id):
    institute_service = ServiceFactory.get_institute_service()
    try:
        institute_service.delete_institute(institute_id)
        return jsonify({"message": "Institute deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500
    
@institute_bp.put("/update/<string:institute_id>")
def update_institute(institute_id):
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"error": "Name is required"}), 400
    institute_service = ServiceFactory.get_institute_service()
    try:
        institute = institute_service.get_institute_by_id(institute_id)
        if not institute:
            return jsonify({"error": "Institute not found"}), 404
        institute.name = name
        db.session.commit()
        return jsonify(institute.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500