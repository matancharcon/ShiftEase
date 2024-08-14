from flask import Blueprint,request
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from . import db   
from flask_login import login_user, login_required, logout_user
from flask import jsonify, request
from flask_jwt_extended import create_access_token

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=email)
    print(user.is_admin)
    
    response = {
        'access_token': access_token,
        'is_admin': user.is_admin  
    }
    return jsonify(response)



@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})


@auth.route('/sign-up', methods=['POST'])
def sign_up():
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    user_type = data.get('user_type')
    password1 = data.get('password1')
    password2 = data.get('password2')
    is_admin = data.get('is_admin', False)

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'error': 'Email already exists.'}), 400
    elif len(email) < 4:
        return jsonify({'error': 'Email must be greater than 3 characters.'}), 400
    elif len(full_name) < 2:
        return jsonify({'error': 'Full name must be greater than 1 character.'}), 400
    elif user_type not in ['waiter', 'bartender', 'shift_manager']:  # Adjust valid user types as needed
        return jsonify({'error': 'Invalid user type.'}), 400
    elif password1 != password2:
        return jsonify({'error': 'Passwords don\'t match.'}), 400
    elif len(password1) < 7:
        return jsonify({'error': 'Password must be at least 7 characters.'}), 400


    hashed_password = generate_password_hash(password1, method='pbkdf2:sha256')
    new_user = User(email=email, full_name=full_name, user_type=user_type, password=hashed_password, is_admin=is_admin)
    db.session.add(new_user)
    db.session.commit()
    login_user(new_user, remember=True)
    return jsonify({'message': 'Account created successfully.'},201)