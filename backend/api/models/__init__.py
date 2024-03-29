from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

class YvesMixin(object):
    created = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)

    def to_dict(self):
        """Return a dictionary representation of the object."""
        model_dict = {}
        for column in self.__table__.columns:
            model_dict[column.name] = getattr(self, column.name)
        return model_dict

from .user import User
from .tokenBlocklist import TokenBlocklist
from .group import Group
from .membership import Membership

from .rate import Rate
from .post import Post

def define_rating(id):
    _rate = Rate.query.filter_by(post_id=id).all()
    return sum([i.val for i in _rate]) if _rate else 0
