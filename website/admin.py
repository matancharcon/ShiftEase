from flask import Blueprint, render_template, request, flash, redirect, url_for,abort
from .models import User,Availability,WeeklyWorkArrangement
from werkzeug.security import generate_password_hash, check_password_hash
from . import db   ##means from __init__.py import db
from flask_login import login_user, login_required, logout_user, current_user
from .views import get_dates_for_week
from functools import wraps

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
        dates=get_dates_for_week()
        # Iterate over all possible days
        for date in dates:
            # Retrieve selected day shift waiters for the current day
            selected_day_shift_waiters[date] = request.form.getlist(f'day_shift_waiters_{date}')
            
            # Retrieve selected night shift waiters for the current day
            selected_night_shift_waiters[date] = request.form.getlist(f'night_shift_waiters_{date}')
        
        # Retrieve the text field value
        text_value = request.form.get('text_field')

        print("Selected day shift waiters:", selected_day_shift_waiters)
        print("Selected night shift waiters:", selected_night_shift_waiters)
        print(text_value)

    shift_counts = {}
    for date in selected_day_shift_waiters:
        for waiter_id in selected_day_shift_waiters[date]:
            shift_counts[waiter_id] = shift_counts.get(waiter_id, 0) + 1
    for date in selected_night_shift_waiters:
        for waiter_id in selected_night_shift_waiters[date]:
            shift_counts[waiter_id] = shift_counts.get(waiter_id, 0) + 1
    print(shift_counts)
    return render_template('admin/selected_availability_waiters.html',user=current_user, selected_day_shift_waiters=selected_day_shift_waiters,selected_night_shift_waiters=selected_night_shift_waiters, shift_counts=shift_counts,dates=dates)


# @admin.route('/admin/finalize_availability', methods=['POST'])
# @admin_required
# @login_required
# def finalize_availability():
#     if request.method == 'POST':
#         selected_day_shift_waiters = {}
#         selected_night_shift_waiters = {}
#         dates=get_dates_for_week()
#         # Iterate over all possible days
#         for date in [dates]:
#             # Retrieve selected day shift waiters for the current day
#             selected_day_shift_waiters[date] = request.form.getlist(f'day_shift_waiters_{date}')
            
#             # Retrieve selected night shift waiters for the current day
#             selected_night_shift_waiters[date] = request.form.getlist(f'night_shift_waiters_{date}')
        
#         # Retrieve the text field value
#         text_value = request.form.get('text_field')

#         print("Selected day shift waiters:", selected_day_shift_waiters)
#         print("Selected night shift waiters:", selected_night_shift_waiters)
#         print(text_value)

#         dates=get_dates_for_week()
#         for date in dates:
#             for waiter_name in selected_day_shift_waiters[date]:
#                 user = User.query.filter_by(full_name=waiter_name).first()
#                 if user:
#                     new_arrangement = WeeklyWorkArrangement(
#                         user_id=user.id,
#                         date=date,
#                         date=dates[day],
#                         shift_type='day'
#                     )
#                     db.session.add(new_arrangement)
                    
#             for waiter_name in selected_night_shift_waiters[day]:
#                 user = User.query.filter_by(full_name=waiter_name).first()
#                 if user:
#                     new_arrangement = WeeklyWorkArrangement(
#                         user_id=user.id,
#                         day=day,
#                         date=dates[day],
#                         shift_type='night'
#                     )
#                     db.session.add(new_arrangement)

#     db.session.commit()
#     flash('Work arrangements finalized and saved!', 'success')
#     return redirect(url_for('admin.html'))