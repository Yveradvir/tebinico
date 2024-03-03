from . import db, YvesMixin

class Membership(db.Model, YvesMixin):
    """
    Represent the membership table
    """
    __tablename__ = 'memberships'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref='memberships')

    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    group = db.relationship('Group', backref='memberships')

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
