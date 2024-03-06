import os
from dotenv import load_dotenv

load_dotenv(
    os.path.join(
        os.path.dirname(__file__),
        '..', '.env'
    )
)

genv = os.getenv
dbname, pasw, pguser, ip, port = genv('dbname'), genv('pasw'), genv('user'), genv('host'), genv('port')
bot_token = genv('bot_token')
admin = genv('admin')