from flask import request, abort
import os
from app.models import db
from routes.backup_routes import backup_bp
from routes.course_routes import courses_bp
from routes.studyprogram_routes import studyprogram_bp
from routes.prerequisites_routes import prerequisites_bp
from app import create_app, db
from routes.studyplan_routes import studyplan_bp
from routes.exporttodocx_routes import exportdocx_bp
from routes.user_routes import user_bp
from routes.notifications_routes import notification_bp
from routes.institute_routes import institute_bp
from routes.semestercourses_routes import semestercourses_bp
import logging



app = create_app()

# Register the blueprints
app.register_blueprint(backup_bp, url_prefix='/backend/db')
app.register_blueprint(courses_bp, url_prefix='/backend/courses/')
app.register_blueprint(prerequisites_bp, url_prefix='/backend/prerequisites' )
app.register_blueprint(studyprogram_bp, url_prefix='/backend/studyprograms/')
app.register_blueprint(studyplan_bp, url_prefix='/backend/studyplans/')
app.register_blueprint(exportdocx_bp, url_prefix='/backend/exportdocx/')
app.register_blueprint(user_bp, url_prefix='/backend/user/')
app.register_blueprint(notification_bp, url_prefix='/backend/notifications/')
app.register_blueprint(institute_bp, url_prefix='/backend/institutes')
app.register_blueprint(semestercourses_bp, url_prefix='/backend/semestercourses/')

logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                   filename='database_operations.log')
logger = logging.getLogger(__name__)


if not os.path.exists(app.config['BACKUP_DIR']):
    os.makedirs(app.config['BACKUP_DIR'])



# Run the app
if __name__ == "__main__":
    with app.app_context():
        # Ensure tables are created
        db.create_all()
        # Seed database if empty
        from app.models import Course
        if Course.query.count() == 0:
            print("Database is empty, running seed scripts...")
            import subprocess, sys
            base = os.path.dirname(__file__)
            subprocess.run([sys.executable, "scripts/seed.py"], check=True, cwd=base)
            subprocess.run([sys.executable, "scripts/seed_semesters.py"], check=True, cwd=base)
            print("Seeding complete.")
    app.run(debug=True)