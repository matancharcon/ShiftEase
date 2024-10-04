from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from os import environ

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Enable CORS for the frontend URL
    CORS(app, resources={r"/*": {"origins": ["http://localhost:8080"]}}, supports_credentials=True)

    # Configuration for Flask, JWT, and SQLAlchemy using environment variables
    app.config['SECRET_KEY'] = environ.get('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DB_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = environ.get('JWT_SECRET_KEY')
    # Initialize extensions
    jwt = JWTManager(app)
    db.init_app(app)
 
    # Register blueprints
    from .views import views
    from .auth import auth
    from .admin import admin
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(admin, url_prefix='/')

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
