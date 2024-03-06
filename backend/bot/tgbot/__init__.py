from aiogram.types import BotCommand

from .db import Database
from . import handlers

commands = [
    BotCommand(command='start', description='the start command'),
    BotCommand(command='init', description='command for initialization'),
    BotCommand(command='profile', description='command for profile'),
    BotCommand(command='post', description='command to make post')
]
