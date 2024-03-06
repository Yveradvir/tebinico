import asyncio
import tgbot

from const import (
    dp, storage, bot, admin
)


async def main():
    try:
        await bot.send_message(admin, text="Бот Запущен")            
        await bot.set_my_commands(tgbot.commands)
        await dp.start_polling(
            bot
        )
    finally:
        await dp.storage.close()
        await bot.session.close()

if __name__ == '__main__':
    asyncio.run(main())