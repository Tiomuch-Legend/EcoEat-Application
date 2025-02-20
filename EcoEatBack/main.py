from openai import OpenAI
from pydantic import BaseModel

import json

from config import API_KEY


class Recipe(BaseModel):
    recipe_name: str
    guess_calories: int
    guess_vitamins: str
    food_restrictions: str
    list_ingredients: list[str]
    list_steps: list[str]


client = OpenAI(api_key=API_KEY)

def format_steps(steps, f):
    return f.join(steps)



def get_recipe_by_url(image_url, user_restrictions=None):
    prompt = f"""
Твоя задача - проаналізувати зображення та на основі інгредієнтів з нього та обмежень користувача, створити рецепт. Відповідь надіслати Англійською мовою у форматі JSON;
Обмеження користувача: {user_restrictions};
Кількість вітамінів до 2(найпоширеніші у страві). Записати через кому За допомогою символів (Не треба писати слово "Вітаміни");
"""

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url,
                        }
                    },
                ],
            }
        ],
        response_format=Recipe
    )
    res = json.loads(response.choices[0].message.content)

    res["list_ingredients"] = format_steps(res["list_ingredients"], "\n")
    res["list_steps"] = format_steps(res["list_steps"], "\n\n")

    return res

# print(json.dumps(get_recipe_by_url(
#     image_url="https://prod.domesticgeneral.magnolia-platform.io/dam/jcr:a0d49b4b-b624-49ba-887c-dfb32fb35ac4/organised-fridge.jpg"),
#     indent=4,
#     ensure_ascii=False)
# )
