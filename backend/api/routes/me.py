from . import Resource, reqparse
from const import *

class Me(Resource):
    @jwt_required()
    def get(self):
        me: dict = current_user.to_dict()
        me.pop('password')
        my_groups = [membership.group.to_dict() for membership in Membership.query.filter_by(user_id=current_user.id).all()]
        my_posts = []

        args = request.args
        g = args.get

        if g("filter"):
            filter_value = g("filter")
        else:
            pass
        return make_response(
            jsonify(
                message="Success",
                about={
                    "me": me,
                    "my_groups": my_groups,
                    "my_posts": my_posts
                }
            ), 200
        )
