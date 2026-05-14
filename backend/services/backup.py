import os
from datetime import datetime


class BackupService:
    def __init__(self):
        self.backup_dir = os.getenv(
            "BACKUP_DIR",
            "./instance/backups"
        )

        self.db_name = os.getenv("DB_NAME")
        self.db_user = os.getenv("DB_USER")
        self.db_host = os.getenv("DB_HOST")
        self.db_port = os.getenv("DB_PORT")
        self.db_password = os.getenv("DB_PASSWORD")

    def list_backups(self):
        os.makedirs(self.backup_dir, exist_ok=True)

        return sorted(
            [
                f for f in os.listdir(self.backup_dir)
                if f.endswith(".sql")
            ],
            reverse=True
        )

    def backup_database(self):
        os.makedirs(self.backup_dir, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")

        backup_file = os.path.join(
            self.backup_dir,
            f"backup_{timestamp}.sql"
        )

        command = (
            f'PGPASSWORD="{self.db_password}" '
            f'pg_dump -h {self.db_host} '
            f'-U {self.db_user} '
            f'-p {self.db_port} '
            f'{self.db_name} > "{backup_file}"'
        )

        os.system(command)

        return backup_file

    def restore_database(self, filename):
        backup_path = os.path.join(
            self.backup_dir,
            filename
        )

        if not os.path.exists(backup_path):
            raise FileNotFoundError(
                "Backup file not found"
            )

        command = (
            f'PGPASSWORD="{self.db_password}" '
            f'psql -h {self.db_host} '
            f'-U {self.db_user} '
            f'-p {self.db_port} '
            f'{self.db_name} < "{backup_path}"'
        )

        os.system(command)
        
    def delete_backup(self, filename):
        backup_path = os.path.join(
            self.backup_dir,
            filename
        )

        if not os.path.exists(backup_path):
            raise FileNotFoundError(
                "Backup file not found"
            )

        os.remove(backup_path)