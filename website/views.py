from os import abort

from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from datetime import datetime, timedelta
from .models import Note,Availability
from . import db
import json

views = Blueprint('views', __name__)


@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    if request.method == 'POST':
        note = request.form.get('note')#Gets the note from the HTML

        if len(note) < 1:
            flash('Note is too short!', category='error')
        else:
            new_note = Note(data=note, user_id=current_user.id)  #providing the schema for the note
            db.session.add(new_note) #adding the note to the database
            db.session.commit()
            flash('Note added!', category='success')

    return render_template("home.html", user=current_user)

def get_dates_for_week():
    today = datetime.today()
    start_of_week = today - timedelta(days=today.weekday())  # Get the first day of the week
    dates = {
        'Sunday': (start_of_week + timedelta(days=0)).strftime('%B %d, %Y'),
        'Monday': (start_of_week + timedelta(days=1)).strftime('%B %d, %Y'),
        'Tuesday': (start_of_week + timedelta(days=2)).strftime('%B %d, %Y'),
        'Wednesday': (start_of_week + timedelta(days=3)).strftime('%B %d, %Y'),
        'Thursday': (start_of_week + timedelta(days=4)).strftime('%B %d, %Y'),
        'Friday': (start_of_week + timedelta(days=5)).strftime('%B %d, %Y'),
        'Saturday': (start_of_week + timedelta(days=6)).strftime('%B %d, %Y'),

    }
    return dates

@views.route('/availability_form', methods=['GET', 'POST'])
@login_required
def availability_form():
    if request.method == 'POST':
        # Handle form submission
        availability_data = {}
        dates=get_dates_for_week()
        for date in dates:
            day_shift = date + '_day' in request.form
            night_shift = date + '_night' in request.form
            notes = request.form.get(date + '_notes', '')
            availability_data[date] = {
                'day_shift': day_shift,
                'night_shift': night_shift,
                'notes': notes
            }
            # Save or update availability in the database
            existing_availability = Availability.query.filter_by(user_id=current_user.id, date=date).first()
            if existing_availability:
                existing_availability.day_shift = day_shift
                existing_availability.night_shift = night_shift
                existing_availability.notes = notes
            else:
                new_availability = Availability(
                    user_id=current_user.id,
                    user_type=current_user.user_type,
                    date=date,  
                    day_shift=day_shift,
                    night_shift=night_shift,
                    notes=notes
                )
                db.session.add(new_availability)
        db.session.commit()
        flash('Availability updated successfully!', category='success')
        return redirect(url_for('views.show_availability'))

    dates = get_dates_for_week()
    previous_availability = {availability.date: availability for availability in Availability.query.filter_by(user_id=current_user.id).all()}
    return render_template("availability_form.html", user=current_user, dates=dates,previous_availability=previous_availability)

@views.route('/show_availability')
@login_required
def show_availability():
    # Retrieve user's weekly availability
    weekly_availability = Availability.query.filter_by(user_id=current_user.id).all()

    return render_template("show_availability.html", user=current_user, weekly_availability=weekly_availability)


# @views.route('/week_availability')
# @login_required
# def week_availability():

