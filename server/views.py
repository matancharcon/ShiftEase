from os import abort

from flask import Blueprint
from datetime import datetime, timedelta
from .models import Availability,WeeklyWorkArrangement,User
from sqlalchemy import and_
from . import db
from flask import jsonify, request
from flask_jwt_extended import jwt_required,get_jwt_identity

views = Blueprint('views', __name__)

import logging
logging.basicConfig(level=logging.DEBUG)


def get_dates_for_week():
    today = datetime.today()
    start_of_next_week = today + timedelta(days=(6 - today.weekday()))  
    dates = {
        'Sunday': (start_of_next_week + timedelta(days=0)).strftime('%B %d, %Y'),
        'Monday': (start_of_next_week + timedelta(days=1)).strftime('%B %d, %Y'),
        'Tuesday': (start_of_next_week + timedelta(days=2)).strftime('%B %d, %Y'),
        'Wednesday': (start_of_next_week + timedelta(days=3)).strftime('%B %d, %Y'),
        'Thursday': (start_of_next_week + timedelta(days=4)).strftime('%B %d, %Y'),
        'Friday': (start_of_next_week + timedelta(days=5)).strftime('%B %d, %Y'),
        'Saturday': (start_of_next_week + timedelta(days=6)).strftime('%B %d, %Y'),
    }
    return dates


@views.route('/availability_form', methods=['GET', 'POST'])
@jwt_required()
def availability():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()
    
    if request.method == 'POST':
        data = request.get_json()
        availability_data = data.get('availability_data', {})
        for day, details in availability_data.items():
            date = details.get('date')
            day_shift = details.get('day_shift', False)
            night_shift = details.get('night_shift', False)
            notes = details.get('notes', '')

            existing_availability = Availability.query.filter(
                and_(
                    Availability.user_id == current_user.id,
                    Availability.date == date
                )
            ).first()

            if existing_availability:
                existing_availability.day_shift = day_shift
                existing_availability.night_shift = night_shift
                existing_availability.notes = notes
            else:
                new_availability = Availability(
                    user_id=current_user.id,
                    day=day,
                    date=date,
                    day_shift=day_shift,
                    night_shift=night_shift,
                    notes=notes
                )
                db.session.add(new_availability)

        db.session.commit()
        return jsonify({'message': 'Availability updated successfully'})

    elif request.method == 'GET':
        previous_availability = {
            availability.day: {
                'date': availability.date,
                'day_shift': availability.day_shift,
                'night_shift': availability.night_shift,
                'notes': availability.notes
            } for availability in Availability.query.filter_by(user_id=current_user.id).all()
        }
        
        return jsonify({'previous_availability': previous_availability})
        


@views.route('/show_availability', methods=['GET'])
@jwt_required()
def show_availability():
   
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404

    availability_list = Availability.query.filter_by(user_id=current_user.id).all()
    

    availability_data = {
        availability.date: {
            'day_shift': availability.day_shift,
            'night_shift': availability.night_shift,
            'notes': availability.notes
        } for availability in availability_list
    }
    return jsonify({'availability': availability_data})



@views.route('/weekly-work-arrangements', methods=['GET'])
@jwt_required()
def get_weekly_work_arrangements():
    arrangements = WeeklyWorkArrangement.query.all()
    result = [
        {
            "id": arrangement.id,
            "arrangements": arrangement.arrangements,
            "dates": arrangement.dates,
            "created_at": arrangement.created_at,
            "notes": arrangement.notes
        }
        for arrangement in arrangements
    ]
    return jsonify(result), 200