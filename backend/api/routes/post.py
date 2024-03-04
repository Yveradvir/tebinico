from . import Resource, reqparse
from const import *


class ApiPost(Resource):
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument('title', type=str, required=True, help='Title is required')
        parser.add_argument('description', type=str, required=True, help='Description is required')
        parser.add_argument('group_id', type=str, required=True, help='Group id is required')

        args = parser.parse_args()
        g    = args.get

        group_id = g('group_id')
        if not Group.query.get(group_id):
            return make_response(
                jsonify(message=f"Group with id {group_id} does not exist"),
                404
            )

        post = Post(
            title=g('title'),
            description=g('description'),
            group_id=group_id,
            author_id=current_user.id
        )

        db.session.add(post)
        db.session.commit()

        return make_response(
            jsonify(
                message="Success",
                post_id=post.id  
            ),
            200
        )
