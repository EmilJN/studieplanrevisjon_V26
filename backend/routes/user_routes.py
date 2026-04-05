from flask import Flask, jsonify, request, Blueprint
from app.models import  User
from services import ServiceFactory

user_bp = Blueprint('user', __name__)

@user_bp.route("/delete/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    try: 
        userservice = ServiceFactory.get_user_service()
        userservice.delete_user(user_id)
        return jsonify({"message" : "User has been deleted"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#TODO CHANGE FOR FEIDE
@user_bp.get("/get_user")
def protected():
    return current_user.serialize()


@user_bp.get("/get_all_users")
def get_all_users():
    userservice = ServiceFactory.get_user_service()
    users = userservice.get_all_users()
    return jsonify(users)

@user_bp.get("/get_logs")
def get_logs():
    userservice = ServiceFactory.get_user_service()
    logs = userservice.get_logs()
    return jsonify(logs)
