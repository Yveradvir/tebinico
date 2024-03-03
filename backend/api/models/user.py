from . import db, YvesMixin

class User(db.Model, YvesMixin):
    """
    Represent the user table
    """

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60), nullable=False)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)

    isAdmin = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)