from backend import create_app, db
from backend.models import User
from werkzeug.security import generate_password_hash


app = create_app()


with app.app_context():
    db.create_all()

   
    admin_user = User.query.filter_by(email='admin@example.com').first()

    if not admin_user:
     
        hashed_password = generate_password_hash('your_password', method='pbkdf2:sha256')
        admin_user = User(
            email='admin@example.com',
            first_name='Admin',
            password=hashed_password,
            is_admin=True
        )
        db.session.add(admin_user)
        db.session.commit()
        print("Admin user created successfully.")
    else:
        print("Admin user already exists.")


app.app_context().pop()
