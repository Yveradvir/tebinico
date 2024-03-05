from flask import Flask, request, make_response, jsonify
from flask_restful import Api 
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import (JWTManager, current_user, create_access_token, 
                                create_refresh_token, jwt_required, get_jwt, 
                                decode_token, get_jwt_identity)
from flask_mail import Mail, Message
from telegramToken import TelegramTokenMake

from dotenv import load_dotenv
from models import *


import os, datetime

load_dotenv(
    os.path.join(
        os.path.dirname(__file__),
        '..', '.env'
    )
)

genv = os.getenv
user, pasw, host, dbname = genv('user'), genv('pasw'), genv('host'), genv('dbname')

jwt = JWTManager()

refresh_expires, access_expires = datetime.timedelta(hours=2), datetime.timedelta(minutes=20)

from routes import *