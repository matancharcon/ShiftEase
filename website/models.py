from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(10000))
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150))
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    user_type = db.Column(db.String(50))
    is_admin = db.Column(db.Boolean, default=False)
    availabilities = relationship("Availability", backref="user", lazy="dynamic")

    def has_availability(self):
        return self.availabilities.first() is not None


class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_type = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    day_shift = db.Column(db.Boolean, nullable=False)
    night_shift = db.Column(db.Boolean, nullable=False)
    notes = db.Column(db.Text)

class WeeklyWorkArrangement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    day = db.Column(db.String(20), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    shift_type = db.Column(db.String(20), nullable=False)  # 'day' or 'night'
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    notes = db.Column(db.Text)