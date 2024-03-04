from . import Resource, reqparse
from const import *
from sqlalchemy import func

class Groups(Resource):
    @jwt_required()
    def get(self):
        groups = []
        args = request.args
        g    = args.get

        filter_by = g('filterBy')
        _filter = g('filter')
        print(args)
        if not filter_by and not _filter:
            groups = [_group.to_dict() for _group in Group.query.all()]
        else:
            if filter_by == 'groups_by_name':
                groups = [_group.to_dict() for _group in Group.query.filter(
                    Group.title.ilike(f"%{_filter}%")
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
        parser.add_argument('title', type=str, required=True, help='Title is required')
        parser.add_argument('description', type=str, required=True, help='Description is required')

        args = parser.parse_args()
        g    = args.get

        if not Group.query.filter_by(title=g('title')).first():
            group = Group(
                title=g('title'), description=g('description'),
                author_id=current_user.id
            )

                

            db.session.add(group)
            db.session.commit()
            if len(Membership.query.filter_by(user_id=current_user.id).all()) <= 15:
                membership = Membership(
                    user_id=current_user.id, group_id=group.id
                )
            else:
                return make_response(
                    jsonify(
                        message="You cross the limit of groups(max 15)"
                    ), 400
                )

            db.session.add(membership)
            db.session.commit()

            return make_response(
                jsonify(
                    message="Success",
                    id=group.id
                ), 200
            )
        else:
            return make_response(
                jsonify(
                    message="Group arleady exist"
                ), 409
            )

class MyGroups(Resource):
    @jwt_required()
    def get(self):
        return [
            membership.group.only_id_title() 
            for membership in 
            Membership.query.filter_by(user_id=current_user.id).all()
        ]
        
class SingleGroup(Resource):
    @jwt_required()
    def get(self, id):
        group = Group.query.filter_by(id=id).first()
        if group:
            posts = [] 

            for post in Post.query.filter_by(group_id=id).all():
                post = post.to_dict()
                post['rating'] = define_rating(post['id'])
                posts.append(post)

            return make_response(
                jsonify(
                    message="Success",
                    group=group.to_dict(),
                    posts=posts,
                    am_i_owner=group.author_id == current_user.id
                ), 200
            )
        else: 
            return make_response(
                jsonify(
                    message="Group does'nt exist"
                ), 404
            )
        
    @jwt_required()
    def delete(self, id):
        group = Group.query.filter_by(id=id).first()
        if group:
            if current_user.id == group.author_id:
                Post.query.filter_by(group_id=id).delete()
                Membership.query.filter_by(group_id=id).delete()

                db.session.delete(group)
                db.session.commit()

                return make_response(
                    jsonify(
                        message="Group deleted successfully"
                    ), 200
                )
            else:
                return make_response(
                    jsonify(
                        message="You are not author to delete this group"
                    ), 403
                )
        else:
            return make_response(
                jsonify(
                    message="Group doesn't exist"
                ), 404
            )