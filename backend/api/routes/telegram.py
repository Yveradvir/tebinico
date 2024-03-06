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

class GetGroupsId(Resource):
    def get(self, token):
        id = int(token.split(']')[0][2:])
        if User.query.filter_by(id=id).first().token == token:
            membership = [i.group.only_id_title() for i in Membership().query.filter_by(user_id=id).all()]
            return make_response(
                jsonify(
                    message="success",
                    groups=membership
                )
            )
        else:
            return make_response(
                jsonify(
                    message="Incorect token, unauthorizied."
                ), 401
            )

class MakePost(Resource):
    def post(self, token):
        id = int(token.split(']')[0][2:])
        if User.query.filter_by(id=id).first().token == token:    
            print(request.form)
            g    = request.form.get

            group_id = int(g('group_id'))
            if not Group.query.get(group_id):
                return make_response(
                    jsonify(message=f"Group with id {group_id} does not exist"),
                    404
                )
            
            post = Post(
                title=g('title'),
                description=g('description'),
                group_id=group_id,
                author_id=id
            )

            db.session.add(post)
            db.session.commit()

            return make_response(
                jsonify(
                    message=f"Success, your post id: {post.id}"  
                ),
                200
            )
        else:
            return make_response(
                jsonify(
                    message="Incorect token, unauthorizied."
                ), 401
            )
