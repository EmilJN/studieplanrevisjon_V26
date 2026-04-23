import datetime
import subprocess
import os
from flask import Blueprint, jsonify, request
import logging
from app import db

logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                   filename='database_operations.log')
logger = logging.getLogger(__name__)


backup_bp = Blueprint('backup', __name__)


def backup_db():
    try:
        backup_dir = os.getenv("BACKUP_DIR", "./instance/backups")
        os.makedirs(backup_dir, exist_ok=True)

        filename = f"backup_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
        filepath = os.path.join(backup_dir, filename)

        env = os.environ.copy()
        env["PGPASSWORD"] = os.getenv("DB_PASSWORD")

        with open(filepath, "w") as f:
            result = subprocess.run(
                [
                    "pg_dump",
                    "--clean",
                    "--if-exists",
                    "-h", os.getenv("DB_HOST"),
                    "-U", os.getenv("DB_USER"),
                    "-d", os.getenv("DB_NAME"),
                    "-p", os.getenv("DB_PORT", "5432"),
                ],
                stdout=f,
                text=True,
                env=env,
                check=True
            )

        return filename

    except Exception as e:
        raise Exception(f"Error during backup: {str(e)}")
    

def find_all_backups():
    backup_dir = os.getenv("BACKUP_DIR", "./instance/backups")
    if not os.path.exists(backup_dir):
        return []
    return [f for f in os.listdir(backup_dir) if f.endswith('.sql')]


@backup_bp.route('/backups/start-backup', methods=['POST'])
def backup():
    try:
        backup_file = backup_db()
        return jsonify({
        "message": "Backup successful",
        "file": backup_file,
    }),200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@backup_bp.route('/backups/delete/<string:filename>', methods=['DELETE'])
def delete_backup(filename):
    backup_dir = os.getenv("BACKUP_DIR", "./instance/backups")
    filepath = os.path.join(backup_dir, filename)

    if not os.path.exists(filepath):
        return jsonify({'error': 'Backup file not found'}), 404

    try:
        os.remove(filepath)
        
        return jsonify({'message': 'Backup deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@backup_bp.route('/backups/restore/<string:filename>', methods=['POST'])
def restore_backup(filename):
    backup_dir = os.getenv("BACKUP_DIR", "./instance/backups")
    filepath = os.path.join(backup_dir, filename)

    if not os.path.exists(filepath):
        return jsonify({'error': 'Backup file not found'}), 404

    env = os.environ.copy()
    env["PGPASSWORD"] = os.getenv("DB_PASSWORD")

    try:
        with open(filepath, "r") as f:
            subprocess.run(
                [
                    "psql",
                    "-h", os.getenv("DB_HOST"),
                    "-U", os.getenv("DB_USER"),
                    "-d", os.getenv("DB_NAME"),
                    "-p", os.getenv("DB_PORT", "5432"),
                ],
                stdin=f,
                text=True,
                env=env,
                check=True
            )
        return jsonify({'message': 'Restore successful'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@backup_bp.route('/backups/list', methods=['GET'])
def list_backups():
    try:
        backups = find_all_backups()
        return jsonify(sorted(backups, reverse=True))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
