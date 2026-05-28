from flask import Blueprint, jsonify
from services import ServiceFactory
from utils.auth.decorators import admin_required

backup_bp = Blueprint("backups", __name__)

@backup_bp.route('/list', methods=['GET'])
@admin_required
def list_backups():
    backup_service = ServiceFactory.get_backup_service()
    try:
        backups = backup_service.list_backups()
        return jsonify(backups), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@backup_bp.route('/start-backup', methods=['POST'])
@admin_required
def start_backup():
    backup_service = ServiceFactory.get_backup_service()
    try:
        backup_path = backup_service.backup_database()

        return jsonify({
            'message': 'Backup created successfully',
            'backup_path': backup_path
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@backup_bp.route('/restore/<string:filename>', methods=['POST'])
@admin_required
def restore_backup(filename):
    backup_service = ServiceFactory.get_backup_service()
    try:
        backup_service.restore_database(filename)

        return jsonify({
            'message': 'Backup restored successfully'
        }), 200

    except FileNotFoundError:
        return jsonify({
            'error': 'Backup file not found'
        }), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@backup_bp.route('/delete/<string:filename>', methods=['DELETE'])
@admin_required
def delete_backup(filename):
    backup_service = ServiceFactory.get_backup_service()
    try:
        backup_service.delete_backup(filename)
        return jsonify({
            'message': 'Backup deleted successfully'
        }), 200

    except FileNotFoundError:
        return jsonify({
            'error': 'Backup file not found'
        }), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500