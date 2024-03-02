from flask import Flask, request, make_response
from flask_restful import Api 
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from dotenv import load_dotenv

import os

load_dotenv(
    os.path.join(
        os.path.dirname(__file__),
        '..', '.env'
    )
)

genv = os.getenv
user, pasw, host, dbname = genv('user'), genv('pasw'), genv('host'), genv('dbname')

jwt = JWTManager()