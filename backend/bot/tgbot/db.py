import asyncpg
from config import *

class Database:
    def __init__(self):
        self.conn: asyncpg.Connection = None

    async def __aenter__(self):
        self.conn = await asyncpg.connect(
            database=dbname, user=pguser,
            password=pasw, host=ip, port=port
        )
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        await self.conn.close()

    async def isRegistered(self, user_id, token):
        query = 'SELECT COUNT(*) FROM users WHERE id = $1 AND token = $2'
        result = await self.conn.fetchval(query, int(user_id), token)
        return result > 0

    async def getUser(self, id):
        query = 'SELECT * FROM users WHERE id=$1'
        return await self.conn.fetchrow(query, int(id))