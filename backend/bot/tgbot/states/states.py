from aiogram.fsm.state import State, StatesGroup


class InitStates(StatesGroup):
    waiting_for_apikey = State()

class MakePost(StatesGroup):
    waiting_for_group_id = State()
    waiting_for_title = State()
    waiting_for_description = State()
    waiting_for_confirm = State()