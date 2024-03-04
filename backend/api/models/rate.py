from . import db, YvesMixin

class Rate(db.Model, YvesMixin):
    """
    Represent the rate table
    """
    __tablename__ = 'rates'

    id = db.Column(db.Integer, primary_key=True)

    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    author = db.relationship('User', backref='rates')

    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    post = db.relationship('Post', backref='rates')

    val = db.Column(db.Integer, nullable=False)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
