from werkzeug.security import check_password_hash, generate_password_hash

from . import Resource, reqparse
from const import *

class SignUp(Resource):
    def post(self):
        parser = reqparse.RequestParser(bundle_errors=True)

        parser.add_argument('username', type=str, required=True, help='Username is required')
        parser.add_argument('email', type=str, required=True, help='Email is required')
        parser.add_argument('password', type=str, required=True, help='Password is required')

        args = parser.parse_args()
        g    = args.get

        validate_user = User.query.filter_by(email=g('email')).first()

        if validate_user:
            return make_response(
                jsonify(
                    message="User arleady exist"
                ), 409
            )
        else:
            password = generate_password_hash(g('password'))
            isAdmin = True if g('email').split('@')[1] == 'yves.com' else False

            user = User(
                username=g('username'), password=password,
                email=g('email'), isAdmin=isAdmin
            )

            db.session.add(user)
            db.session.commit()

            refresh = create_refresh_token(user)
            access  = create_access_token(user) 

            return make_response(
                jsonify(
                    message="Sign Up was successful", 
                    refresh=refresh, access=access
                ), 201
            )


class LogIn(Resource):
    def post(self):
        parser = reqparse.RequestParser(bundle_errors=True)

        parser.add_argument('email', type=str, required=True, help='Email is required')
        parser.add_argument('password', type=str, required=True, help='Password is required')

        args = parser.parse_args()
        g = args.get

        user = User.query.filter_by(email=g('email')).first()

        if user:
            if check_password_hash(user.password, g('password')):
                refresh = create_refresh_token(user)
                access = create_access_token(user)

                return make_response(
                    jsonify(
                        message="Login successful",
                        refresh=refresh, access=access
                    ), 200
                )
            else:
                return make_response(
                    jsonify(
                        message="Incorrect password. Please try again."
                    ), 400
                )
        else:
            return make_response(
                jsonify(
                    message="User does not exist. Please sign up first."
                ), 409
            )
            
            
class LogOut(Resource):
    @jwt_required(verify_type=False)
    def delete(self):
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument('password', type=str, required=True, help='Password is required')

        password = parser.parse_args().get("password")

        access_token, refresh_token = get_jwt(), decode_token(request.headers.get('X-Refresh-Token'))

        if access_token and refresh_token:
            if check_password_hash(current_user.password, password):
                db.session.add(
                    TokenBlocklist(jti=access_token['jti'], type=access_token['type'])
                )
                db.session.add(
                    TokenBlocklist(jti=refresh_token['jti'], type=refresh_token['type'])
                )
                db.session.commit()

                return make_response(
                    jsonify(
                        message="Successfully logged out. Tokens revoked."
                    ), 200
                )
            else:
                return make_response(
                    jsonify(
                        message="Invalid password provided."
                    ), 400
                )
        else:
            return make_response(
                jsonify(
                    message="Unauthorized. Invalid tokens provided."
                ), 401
            )

class Refresh(Resource):
    @jwt_required(refresh=True)
    def get(self):
        current_user_id = get_jwt_identity()

        new_access_token = create_access_token(identity=User.query.filter_by(id=current_user_id).first())

        return make_response(
            jsonify(
                access=new_access_token
            ), 200
        )