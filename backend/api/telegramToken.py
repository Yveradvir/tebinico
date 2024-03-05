from secrets import token_urlsafe, SystemRandom

class TelegramTokenMake:
    @staticmethod
    def generate(id):
        token = f"$[{id}]:::{token_urlsafe(16)}"

        return token