from . import db, YvesMixin, Rate

class Post(db.Model, YvesMixin):
    """
    Represent the post table
    """
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)

    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    author = db.relationship('User', backref='posts')

    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    group = db.relationship('Group', backref='posts')

    title = db.Column(db.String(40), nullable=False)
    description = db.Column(db.Text, nullable=False) # max: 1400

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
