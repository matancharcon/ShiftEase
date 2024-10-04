from . import db
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150))
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    user_type = db.Column(db.String(50))
    is_admin = db.Column(db.Boolean, default=False)
    
class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    day = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    day_shift = db.Column(db.Boolean, nullable=False)
    night_shift = db.Column(db.Boolean, nullable=False)
    notes = db.Column(db.Text)

class WeeklyWorkArrangement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    arrangements = db.Column(JSON, nullable=False)
    dates = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    notes = db.Column(db.String, nullable=False)