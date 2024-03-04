from const import *

def jwt_setup(app: Flask, jwt: JWTManager):
    """
    Set up the JWTMangater decorators and etc.
    
    Parameters:
    - app (flask.Flask): The Flask application instance to create routes.
    - jwt (flask_jwt_extended.JWTManager): The JWTManager instance to be set up.
    """
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
        token = db.session.query(TokenBlocklist.id).filter_by(jti=jwt_payload["jti"]).scalar()

        return token is not None
    
    @jwt.user_identity_loader
    def user_identity_lookup(user) -> int:
        return user.id

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        return User.query.filter_by(id=identity).one_or_none()

def api_setup(api: Api) -> None:
    """
    Set up the Flask-RESTful API.

    Parameters:
    - api (flask_restful.Api): The Flask-RESTful API instance to be set up.

    Returns:
    - None
    """
    api.add_resource(SignUp, '/auth/signup')
    api.add_resource(LogIn, '/auth/login')
    api.add_resource(LogOut, '/auth/logout')
    api.add_resource(Refresh, '/auth/refresh')

    api.add_resource(Protected, '/protected')
    api.add_resource(Me, '/me')

    api.add_resource(Groups, '/groups')
    api.add_resource(MyGroups, '/my_groups')
    api.add_resource(SingleGroup, '/group/<int:id>')

    api.add_resource(ApiPost, '/post')

def app_config(app: Flask) -> None:
    """
    Set up the Flask application configurations.

    Parameters:
    - app (flask.Flask): The Flask application instance to be configured.

    Returns:
    - None
    """
    app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{user}:{pasw}@{host}/{dbname}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["SECRET_KEY"] = genv("secret_key")

    app.config["JWT_SECRET_KEY"] = genv("secret_key")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"]  = access_expires
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = refresh_expires


def makeapp() -> Flask:
    """
    Create and configure the Flask application.

    Returns:
    - flask.Flask: The configured Flask application instance.
    """
    app = Flask(__name__)
    api = Api(app)

    app_config(app)

    CORS(app, origins=["http://localhost:3000"])   
    db.init_app(app)
    jwt.init_app(app)   
    Migrate(app, db)

    with app.app_context():
        try:
            # db.reflect()
            # db.drop_all()
            db.create_all()
        except Exception as e:
            print(f"An error occurred while creating tables: {e}")

    api_setup(api)
    jwt_setup(app, jwt)
    
    return app
