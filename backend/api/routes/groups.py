from . import Resource, reqparse
from const import *
from sqlalchemy import func

class Groups(Resource):
    @jwt_required()
    def get(self):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument('filter_type', type=str, required=False)
        parser.add_argument('filter', type=str, required=False)

        args = parser.parse_args()
        g    = args.get

        if not g('filter_type'):
            groups = [_group.to_dict() for _group in Group.query.all()]
        else:
            if g('filter_type') == 'title':
                groups = [_group.to_dict() for _group in Group.query.filter(
                    Group.title.ilike(f"%{g('filter')}%")
                ).all()]


        return make_response(
            jsonify(
                message="Success",
                groups=groups
            ), 200
        )
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument('title', type=str, required=False)
        parser.add_argument('description', type=str, required=False)

        return make_response(
            jsonify(
                message="Success"
            ), 200
        )