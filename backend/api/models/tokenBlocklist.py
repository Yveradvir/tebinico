from . import db, YvesMixin


class TokenBlocklist(db.Model, YvesMixin):
    """
    Represent the TokenBlocklist model for jwt tokens
    """
    __tablename__ = 'tokenbloclists'


    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    type = db.Column(db.String(36), nullable=False)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)