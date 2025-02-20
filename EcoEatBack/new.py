from groq import Groq


client = Groq(
    api_key="YOUR-API-KEY",
)

objectDetector = client.chat.completions.create(
    model="llama-3.2-11b-vision-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Create a list of products from photo"
                },
                {
                    "type": "image_url",
                    "image_url":{
                        "url": "https://www.allrecipes.com/thmb/CVDJa_JNexHs6-m3kDj2N9GmWnw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Ingredients-Stored-Incorrectly-In-Fridge-2x1-1-9c84891a47694b049e26debb550a8977.png"
                    }
                }
            ]
        }
    ],
    temperature = 1,
    max_completion_tokens = 1024,
    top_p = 1,
    stream = False,
    stop = None,
)

listAnalyse = client.chat.completions.create(
    model="deepseek-r1-distill-llama-70b",
    messages = [
        {
            "role": "system",
            "content": "You are chef, that knows all the recipies and how to create delicious dish, from any ingridients"
        },
        {
            "role": "user",
            "content": f"Create recipe of dish from my ingridients {objectDetector.choices[0].message.content}"
        },
    ],

)
print(listAnalyse.choices[0].message.content)