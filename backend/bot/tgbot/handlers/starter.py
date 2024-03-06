from const import dp

from aiogram.filters import CommandStart
from aiogram.types import Message

@dp.message(CommandStart())
async def start(message: Message):
    await message.answer("Hello, this is Tebinico api reactor. Click on the initialization command and send the correct API key provided to you on the site. Later, you will be able to publish posts without going to the site itself.")