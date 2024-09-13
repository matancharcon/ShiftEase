from flask import Blueprint, jsonify, request
from .models import User, Availability, WeeklyWorkArrangement
from . import db   
from flask_login import login_required, current_user
from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity

admin = Blueprint('admin', __name__)

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        current_user_email = get_jwt_identity()
        current_user = User.query.filter_by(email=current_user_email).first()
        if not current_user or not current_user.is_admin:
            return jsonify({"msg": "Admins only!"}), 403
        return fn(*args, **kwargs)
    return wrapper

@admin.route('/admin/get_availability/<type>', methods=['GET'])
@jwt_required()
@admin_required
def get_availability(type):
    users = User.query.filter_by(user_type=type).all()
    users_availability = {}
    for user in users:
       
        user_availability = Availability.query.filter_by(user_id=user.id).all()
        
        users_availability[user.full_name] = [{
            'date': availability.date,
            'day_shift': availability.day_shift,
            'night_shift': availability.night_shift,
            'notes': availability.notes
        } for availability in user_availability]
    

    return jsonify({'users_availability': users_availability})


@admin.route('/admin/users', methods=['GET'])
@jwt_required()
@admin_required
def admin_users():
    users = User.query.all()
    users_data = [{
        'id': user.id,
        'full_name': user.full_name,
        'email': user.email,
        'user_type': user.user_type,
        'is_admin': user.is_admin
    } for user in users]

    return jsonify({'users': users_data})

@admin.route('/admin/delete_availability/<type>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_availability(type):
    try:
        user_availability = Availability.query.join(User).filter(User.user_type == type).all()
        for availability in user_availability:
            db.session.delete(availability)
        db.session.commit()
        return jsonify({"message": f"All availability records for {type} deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@admin.route('/admin/users/edit/<int:user_id>', methods=['POST'])
@jwt_required()
@admin_required
def edit_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.full_name = data['full_name']
    user.email = data['email']
    user.user_type = data['user_type']
    user.is_admin = data['is_admin']
    db.session.commit()
    return jsonify({'success': True})

@admin.route('/admin/users/delete/<int:user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(user_id): 
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'success': True})

@admin.route('/admin/weekly-work-arrangement', methods=['POST'])
@jwt_required()
@admin_required
def create_weekly_work_arrangement():
    data = request.get_json()
    if not data or 'arrangements' not in data:
        return jsonify({"error": "Invalid payload"}), 400

    arrangements = data['arrangements']
    dates = data.get('dates', '') 
    notes = data.get('notes', '') 

    new_arrangement = WeeklyWorkArrangement(arrangements=arrangements, dates=dates, notes=notes)
    try:
        db.session.add(new_arrangement)
        db.session.commit()
        return jsonify({"message": "Weekly work arrangement created successfully", "id": new_arrangement.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@admin.route('/admin/weekly-work-arrangement/delete', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_weekly_work_arrangement():
    try:
        dates = request.args.get('dates')
        # Query to get all arrangements with the specified dates
        arrangements = WeeklyWorkArrangement.query.filter_by(dates=dates).all()

        if not arrangements:
            return jsonify({"error": f"No arrangements found with dates {dates}."}), 404

        for arrangement in arrangements:
            db.session.delete(arrangement)
        
        db.session.commit()
        return jsonify({"message": f"All weekly work arrangements with dates {dates} deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500