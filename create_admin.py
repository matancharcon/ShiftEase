from website import create_app, db
from website.models import User
from werkzeug.security import generate_password_hash

# Create the Flask app context
app = create_app()

# Create all database tables
with app.app_context():
    db.create_all()

    # Check if an admin user already exists
    admin_user = User.query.filter_by(email='admin@example.com').first()

    if not admin_user:
        # Create a new admin user with a hashed password
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

# Close the app context when done
app.app_context().pop()
