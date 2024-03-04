from . import Resource, reqparse
from const import *


class ApiPost(Resource):
    @jwt_required()
    def get(self):
        args = request.args
        g = args.get

        if g('id'):
            post = Post.query.filter_by(id=g('id')).first()

            if post:
                post = post.to_dict()
                post['rating'] = define_rating(post['id'])

                return make_response(
                    jsonify(
                        message="Success",
                        post=post,
                        am_i_owner=current_user.id == post['author_id']
                    ), 200
                )
            else:
                return make_response(
                    jsonify(
                        message="Post not found",
                    ), 404
                )
        else:
            return make_response(
                jsonify(
                    message="Invalid request. Provide 'id' parameter",
                ), 400
            )

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

    @jwt_required()
    def delete(self):
        args = request.args
        g = args.get

        if g('id'):
            post = Post.query.filter_by(id=g('id'))
            if post.first():
                if post.first().author_id == current_user.id:
                    Rate.query.filter_by(post_id=g('id')).delete()
                    post.delete()
                    db.session.commit()

                    return make_response(
                        jsonify(
                            message="Success"
                        ), 200
                    )
                else:
                    return make_response(
                        jsonify(
                            message="You are not the author of this post."
                        ), 403
                    )
            else:
                return make_response(
                    jsonify(
                        message="Post not found."
                    ), 404
                )
        else:
            return make_response(
                jsonify(
                    message="Invalid request. Missing 'id' parameter."
                ), 400
            )