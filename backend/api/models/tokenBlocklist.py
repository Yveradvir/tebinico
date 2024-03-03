from . import db, YvesMixin


class TokenBlocklist(db.Model, YvesMixin):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    type = db.Column(db.String(36), nullable=False)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)