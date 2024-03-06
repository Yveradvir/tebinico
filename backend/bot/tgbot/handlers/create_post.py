from const import dp, db

from ..states import MakePost

from aiogram import F
from aiogram.filters import Command
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton

from aiogram.fsm.context import FSMContext

import aiohttp

markup_text = ["Confirm", "Contradict"]
def markup() -> ReplyKeyboardMarkup:
    _markup = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text=text) for text in markup_text]
        ],
        resize_keyboard=True, one_time_keyboard=True
    )

    return _markup
    

@dp.message(Command(commands=['post']))
async def post(message: Message, state: FSMContext):
    data = (await state.get_data())
    if data:
        data['groups'] = {}
        data['post'] = {
            'author_id': int(data['token'].split(']')[0][2:])
        }
        async with aiohttp.ClientSession() as session:
            async with session.get(f"http://localhost:8000/get_groups_id/{data['token']}") as response:
                json = (await response.json())
                if len(json['groups']) > 0:
                    for number, group in enumerate(json['groups'], 1):
                        data['groups'][number] = group
                    await state.update_data(data)
                    print(data)
                    await message.answer("Choise one of it's groups (enter the number): ")
                    _ = []
                    for number, group in data['groups'].items():
                        _.append(f"{number}. - {group['title']}")
                    await message.answer('\n'.join(_))

                    await state.set_state(MakePost.waiting_for_group_id)
                else:
                    await message.answer("You are not in groups or group. ")
    else:
        await message.answer("Sorry, but you are not registered, please do /init")        

@dp.message(MakePost.waiting_for_group_id)
async def waiting_for_group_id(message: Message, state: FSMContext):
    data = (await state.get_data())
    if message.text.isdigit():
        if int(message.text) in data['groups'].keys():
            data['post']['group_id'] = data['groups'][int(message.text)]['id']
            await state.update_data(data)
            await state.set_state(MakePost.waiting_for_title)
            await message.answer("Good! Now send the title of the post. No more than 40 letters and no less than 4.")
        else:
            await message.answer("Sorry, but your answer is not correct. Select a number which have represented above.")
    else:
        await message.answer("Sorry, but only digits answer")

@dp.message(MakePost.waiting_for_title)
async def waiting_for_title(message: Message, state: FSMContext):
    data = (await state.get_data())
    if len(message.text) < 40 and len(message.text) >= 4:
        data['post']['title'] = message.text
        await state.update_data(data)
        await state.set_state(MakePost.waiting_for_description)
        await message.answer("Good! Now send the description of the post. No more than 1400 letters and no less than 4.")
    else:
        await message.answer("Sorry, but no more than 40 letters and no less than 4.")

@dp.message(MakePost.waiting_for_description)
async def waiting_for_description(message: Message, state: FSMContext):
    data = (await state.get_data())
    if len(message.text) < 1400 and len(message.text) >= 4:
        data['post']['description'] = message.text
        await state.update_data(data)
        await state.set_state(MakePost.waiting_for_confirm)
        await message.answer("Good! Confirm?", reply_markup=markup())
    else:
        await message.answer("Sorry, but no more than 1400 letters and no less than 4.")

@dp.message(MakePost.waiting_for_confirm)
async def waiting_for_confirm(message: Message, state: FSMContext):
    data = (await state.get_data())
    if message.text in markup_text:
        if message.text == markup_text[0]:
            async with aiohttp.ClientSession() as session:
                async with session.post(f"http://localhost:8000/make_post/{data['token']}", data=data['post']) as response:
                    print(response)
                    await message.answer("Good")
                    data.pop('post')
                    await state.clear()
                    await state.set_data(data)
        else:
            await message.answer("Contradict, OK.")
    else: 
        await message.answer("Select the correct version.")