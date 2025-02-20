from fastapi import FastAPI
from pydantic import BaseModel

import main

class RecipeRequest(BaseModel):
    image_url: str
    user_restrictions: str | None = None  # Необов’язковий параметр


app = FastAPI()

@app.post("/get_recipe")
async def get_recipe_by_url(request: RecipeRequest):
    return main.get_recipe_by_url(request.image_url, request.user_restrictions)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8123, server_header=False)