from const import *

def jwt_setup(app: Flask, jwt: JWTManager):
    """
    Set up the JWTMangater decorators and etc.
    
    Parameters:
    - app (flask.Flask): The Flask application instance to create routes.
    - jwt (flask_jwt_extended.JWTManager): The JWTManager instance to be set up.
    """
    pass

def api_setup(api: Api) -> None:
    """
    Set up the Flask-RESTful API.

    Parameters:
    - api (flask_restful.Api): The Flask-RESTful API instance to be set up.

    Returns:
    - None
    """
    pass

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


def makeapp() -> Flask:
    """
    Create and configure the Flask application.

    Returns:
    - flask.Flask: The configured Flask application instance.
    """
    app = Flask(__name__)
    api = Api(app)

    app_config(app)

    jwt.init_app(app)   

    api_setup(api)
    jwt_setup(app, jwt)
    
    return app
