from functools import wraps
from flask import session, abort
from services.service_factory import ServiceFactory

def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user_service = ServiceFactory.get_user_service()
        feide_id = session.get("user_id")
        
        if not feide_id or not user_service.is_admin(feide_id):
            abort(403)

        return f(*args, **kwargs)

    return wrapper