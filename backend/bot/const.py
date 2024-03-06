from tgbot import Database
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import Update

from config import bot_token, admin

storage = MemoryStorage()
bot = Bot(token=bot_token, parse_mode='HTML')
dp = Dispatcher(storage=storage)
db = Database()