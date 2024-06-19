from flask import Blueprint, render_template, request, flash, redirect, url_for,abort,jsonify
from .models import User,Availability,WeeklyWorkArrangement
from werkzeug.security import generate_password_hash, check_password_hash
from . import db   ##means from __init__.py import db
from flask_login import login_user, login_required, logout_user, current_user
from .views import get_dates_for_week
from functools import wraps
from datetime import datetime

admin = Blueprint('admin', __name__)

def admin_required(view):
    @wraps(view)
    def decorated_view(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            abort(403)  # Forbidden
        return view(*args, **kwargs)
    return decorated_view

@admin.route('/admin/waiters')
@admin_required
@login_required
def waiters():
    # Retrieve all users
    waiters = User.query.filter_by(user_type='waiter').all()
    
    # Create a dictionary to store availability data for each waiter
    waiters_availability = {}
    for waiter in waiters:
         # Query availability for the current waiter
        waiter_availability = Availability.query.filter_by(user_id=waiter.id).all()
        # Use the waiter's full name as the key
        waiters_availability[waiter] = waiter_availability
    # Render the template and pass the availability data to it
    dates=get_dates_for_week()
    return render_template('admin/waiters_availability.html', waiters_availability=waiters_availability,user=current_user,dates=dates)

@admin.route('/admin/users',methods=['GET', 'POST'])
@admin_required
@login_required
def admin_users():
    users = User.query.all()
    return render_template('admin/admin_users.html', users=users,user=current_user)

@admin.route('/admin/show_selected_availability', methods=['GET', 'POST'])
def show_selected_availability():
    if request.method == 'POST':
        selected_day_shift_waiters = {}
        selected_night_shift_waiters = {}
        arrangements = {}
        dates=get_dates_for_week()
        # Iterate over all possible days
        for day,date in dates.items():
            # Retrieve selected day shift waiters for the current day
            selected_day_shift_waiters[day] = request.form.getlist(f'day_shift_waiters_{day}')
            
            # Retrieve selected night shift waiters for the current day
            selected_night_shift_waiters[day] = request.form.getlist(f'night_shift_waiters_{day}')
            print(date)
            arrangements[day] = {
                'date': date,
                'day_shift': selected_day_shift_waiters[day],
                'night_shift': selected_night_shift_waiters[day]
            }


            # Create new WeeklyWorkArrangement instance
        new_arrangement = WeeklyWorkArrangement(
            arrangements=arrangements,
            notes=request.form.get('text_field')
        )
        db.session.add(new_arrangement)
        db.session.commit()   

    shift_counts = {}
    for date in selected_day_shift_waiters:
        for waiter_id in selected_day_shift_waiters[date]:
            shift_counts[waiter_id] = shift_counts.get(waiter_id, 0) + 1
    for date in selected_night_shift_waiters:
        for waiter_id in selected_night_shift_waiters[date]:
            shift_counts[waiter_id] = shift_counts.get(waiter_id, 0) + 1
    print(shift_counts)
    return render_template('admin/selected_availability_waiters.html',user=current_user, selected_day_shift_waiters=selected_day_shift_waiters,selected_night_shift_waiters=selected_night_shift_waiters, shift_counts=shift_counts,dates=dates)


@admin.route('/admin/users/edit/<int:user_id>', methods=['POST'])
@admin_required
@login_required
def edit_user(user_id):
    print("edit")
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.full_name = data['full_name']
    print(user.full_name)
    user.email = data['email']
    user.user_type = data['user_type']
    user.is_admin = data['is_admin']
    print(user.full_name)
    db.session.commit()
    return jsonify({'success': True})

@admin.route('/admin/users/delete/<int:user_id>', methods=['POST'])
@admin_required
@login_required
def delete_user(user_id): 
    user = User.query.get_or_404(user_id)
    print(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'success': True})
