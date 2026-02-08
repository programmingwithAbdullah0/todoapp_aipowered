from dotenv import load_dotenv
import os
from openai import AsyncOpenAI

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set.")

client = AsyncOpenAI(
    api_key=GEMINI_API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)


async def get_chat_completion(messages, model="gemini-2.5-flash"):
    """
    Get chat completion from Gemini model using OpenAI-compatible endpoint
    """
    response = await client.chat.completions.create(
        model=model,
        messages=messages
    )
    return response.choices[0].message.content


# Example usage function
async def chat_with_gemini(prompt):
    messages = [
        {"role": "user", "content": prompt}
    ]
    return await get_chat_completion(messages)
