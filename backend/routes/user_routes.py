import os
from flask import Flask, jsonify, request, Blueprint, session, url_for, redirect
from app.models import  User
from app import oauth
from services import ServiceFactory

user_bp = Blueprint('user', __name__)


@user_bp.route("/login")
def feide_login():
    redirect_uri = f"{os.environ.get('BACKEND_URL', 'http://localhost:5000')}/user/callback"
    return oauth.feide.authorize_redirect(redirect_uri)

@user_bp.route("/callback")
def feide_callback():
    token = oauth.feide.authorize_access_token()
    userinfo = token["userinfo"]

    feide_id = userinfo["sub"]
    email = userinfo.get("email", "")
    name = userinfo.get("name", "")

    userservice = ServiceFactory.get_user_service()
    user = userservice.get_user_by_feide_id(feide_id)
    if not user:
        user = userservice.create_user(feide_id=feide_id, email=email, name=name)

    session["user_id"] = user.feide_id
    session["user_email"] = user.email
    session["user_name"] = user.name
    session["user_role"] = user.role

    return redirect(os.environ.get('FRONTEND_URL', 'http://localhost:3000'))

@user_bp.route('/logout')
def logout():
    session.clear()
    return redirect(f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/login")

@user_bp.route("/delete/<string:user_id>", methods=["DELETE"])
def delete_user(user_id):
    try: 
        userservice = ServiceFactory.get_user_service()
        userservice.delete_user(user_id)
        return jsonify({"message" : "User has been deleted"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.get("/get_user")
def get_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"message": "Not logged in"}), 401
    userservice = ServiceFactory.get_user_service()
    user = userservice.get_user_by_id(user_id)
    if user is None:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.serialize())

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


# Promote user to admin
@user_bp.route("/promote_user/<string:user_id>", methods=["PUT"])
def promote_user(user_id):
    userservice = ServiceFactory.get_user_service()
    success = userservice.promote_user(user_id)
    if success:
        return jsonify({"message": "User promoted to admin"}), 200
    else:
        return jsonify({"error": "User not found"}), 404
