from flask import Flask, jsonify, request, Blueprint
from app.models import db, Course, Institute


institute_bp = Blueprint('institutes', __name__)


@institute_bp.get("/get_all")
def get_all_institutes():
    institutes = db.session.query(Institute).all()
    return [institute.serialize() for institute in institutes]


