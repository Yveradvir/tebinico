from . import Resource, reqparse
from const import *


class Reaction(Resource):
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument('val', type=str, required=True, help='Val is required')
        parser.add_argument('post_id', type=str, required=True, help='Post id is required')

        args = parser.parse_args()
        g    = args.get

        _post = Post.query.filter_by(id=g('post_id')).first()
        if _post:
            if Membership.query.filter_by(group_id=_post.group.id, user_id=current_user.id).first():
                _rate = Rate.query.filter_by(
                    post_id=g('post_id'), author_id=current_user.id
                ).first()

                if _rate:
                    _rate.val = g('val')
                else:
                    rate = Rate(
                        post_id=g('post_id'), author_id=current_user.id,
                        val=g('val')
                    )

                    db.session.add(rate)
                db.session.commit()
                
                return make_response(
                    jsonify(
                        message="Success"
                    ), 200
                )
            else:
                return make_response(
                    jsonify(
                        message="You are not member of the group"
                    ), 409
                )
        else: 
            return make_response(
                jsonify(
                    message="Post does not exist",
                ), 404
            )

class ApiMembership(Resource):
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument('group_id', type=str, required=True, help='Group id is required')

        args = parser.parse_args()
        g = args.get

        group = Group.query.filter_by(id=g('group_id')).first()
        if not group:
            return make_response(
                jsonify(
                    message="Group not found"
                ), 404
            )

        membership = Membership.query.filter_by(
            user_id=current_user.id, group_id=g('group_id')
        ).first()

        if not membership:
            new_membership = Membership(
                user_id=current_user.id, group_id=g('group_id')
            )

            db.session.add(new_membership)
            db.session.commit()

            return make_response(
                jsonify(
                    message="Membership success"
                ), 200
            )
        else:
            return make_response(
                jsonify(
                    message="User is already a member of the group"
                ), 409
            )
    
    @jwt_required()
    def delete(self):
        args = request.args
        g = args.get

        group = Group.query.filter_by(id=g('group_id')).first()
        if not group:
            return make_response(
                jsonify(
                    message="Group not found"
                ), 404
            ) 
        
        membership = Membership.query.filter_by(
            user_id=current_user.id, group_id=g('group_id')
        )

        if not membership.first():
            return make_response(
                jsonify(
                    message="User is not a member of the group"
                ), 404
            )
        else:
            membership.delete()
            db.session.commit()

            return make_response(
                jsonify(
                    message="Membership is successful deleted"
                ), 200
            )