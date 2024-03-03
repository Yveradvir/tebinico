from . import Resource, reqparse
from const import *

class Protected(Resource):
    @jwt_required()
    def get(self):
        jwt = get_jwt()
        print(jwt)

        return make_response(
            jsonify(
                message="Success"
            ), 200
        )