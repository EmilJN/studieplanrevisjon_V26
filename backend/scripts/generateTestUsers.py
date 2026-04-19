from services.user import UserService


test_users = [
    ("feide_1", "admin@test.no", "Admin Bruker", "admin"),
    ("feide_2", "user1@test.no", "Ola Nordmann", "user"),
    ("feide_3", "user2@test.no", "Kari Nordmann", "user"),
]

def generateUsers(users):
    user_service = UserService()
    for user_data in users:
        user_service.create_user(*user_data)
    return True

if __name__ == "__main__":
    from app import create_app
    app = create_app()
    with app.app_context():
        generateUsers(test_users)

