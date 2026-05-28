from flask import jsonify, request, Blueprint
from services.service_factory import ServiceFactory
from utils.auth.decorators import admin_required

institute_bp = Blueprint('institutes', __name__)


@institute_bp.get("/get_all")
def get_all_institutes():
    institute_service = ServiceFactory.get_institute_service()

    try:
        institutes = institute_service.get_all_institutes()

        return jsonify([
            institute.serialize()
            for institute in institutes
        ]), 200

    except RuntimeError as e:
        return jsonify({
            "error": str(e)
        }), 500


@institute_bp.post("/add")
@admin_required
def add_institute():
    data = request.get_json()

    name = data.get("name")

    if not name:
        return jsonify({
            "error": "Name is required"
        }), 400

    institute_service = ServiceFactory.get_institute_service()

    try:
        new_institute = institute_service.create_institute(name)

        return jsonify(
            new_institute.serialize()
        ), 201

    except RuntimeError as e:
        return jsonify({
            "error": str(e)
        }), 500


@institute_bp.delete("/delete/<string:institute_id>")
@admin_required
def delete_institute(institute_id):
    institute_service = ServiceFactory.get_institute_service()

    try:
        institute_service.delete_institute(institute_id)

        return jsonify({
            "message": "Institute deleted successfully"
        }), 200

    except ValueError as e:
        return jsonify({
            "error": str(e)
        }), 404

    except RuntimeError as e:
        return jsonify({
            "error": str(e)
        }), 500


@institute_bp.put("/update/<string:institute_id>")
@admin_required
def update_institute(institute_id):
    data = request.get_json()

    name = data.get("name")

    if not name:
        return jsonify({
            "error": "Name is required"
        }), 400

    institute_service = ServiceFactory.get_institute_service()

    try:
        updated_institute = institute_service.update_institute(
            institute_id,
            name
        )

        return jsonify(
            updated_institute.serialize()
        ), 200

    except ValueError as e:
        return jsonify({
            "error": str(e)
        }), 404

    except RuntimeError as e:
        return jsonify({
            "error": str(e)
        }), 500