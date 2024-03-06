from const import dp, db

from ..states import InitStates

from aiogram import F
from aiogram.filters import Command
from aiogram.types import Message

from aiogram.fsm.context import FSMContext

@dp.message(Command(commands=['init']))
async def init(message: Message, state: FSMContext):
    await message.answer("Please, send the api token to us, and we init you.")
    await state.set_state(InitStates.waiting_for_apikey)

@dp.message(F.text.regexp(r'\$\[\d+\]:::[a-zA-Z0-9_-]+'), InitStates.waiting_for_apikey)
async def waiting_for_apikey(message: Message, state: FSMContext):
    id = message.text.split(']')[0][2:]
    async with db as slot:
        isRegistered = await slot.isRegistered(id, message.text)
        if isRegistered:
            user = {**(await slot.getUser(id))}
            user.pop('password')
            await message.answer(f"Alright, {user['username']}")
            await state.set_data(user)
        else:
            await message.answer("Sorry, but somewhere was a mistake")
        await state.set_state(None)