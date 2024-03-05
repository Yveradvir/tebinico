from . import Resource, reqparse
from const import *

class TelegramToken(Resource):
    @jwt_required()
    def get(self):
        _jsonify = {
            "message": "Success",
            "token": current_user.token or TelegramTokenMake.generate(current_user.id)
        }

        if not current_user.token:
            current_user.token = _jsonify["token"]
            db.session.commit()
            _jsonify["message"] = f"Success + added new token: {_jsonify['token']}"

        return make_response(jsonify(_jsonify), 200)
