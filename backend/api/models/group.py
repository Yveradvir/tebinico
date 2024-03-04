from . import db, YvesMixin

class Group(db.Model, YvesMixin):
    """
    Represent the group table
    """
    __tablename__ = 'groups'


    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(60), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=False)

    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    author = db.relationship('User', backref='groups')

    def only_id_title(self):
        return {
            'id': self.id,
            'title': self.title
        }

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
