from const import dp, db

from aiogram import F
from aiogram.filters import Command
from aiogram.types import Message

from aiogram.fsm.context import FSMContext

@dp.message(Command(commands=['profile']))
async def profile(message: Message, state: FSMContext):
    data = (await state.get_data())
    if data:
        await message.answer(
            "\n".join(
                (
                f"username: {data['username']}",
                f"email: {data['email']}",
                f"joined to us: {data['created']}",
                f"token: {data['token']}"
                )
            )
        )
    else:
        await message.answer("Sorry, but you are not registered, please do /init")