from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from huggingface_hub import InferenceClient

# Initialize FastAPI application
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Hugging Face InferenceClient
HF_TOKEN = os.getenv("HF_TOKEN")  # Make sure the Hugging Face token is set in the environment
client = InferenceClient(api_key=HF_TOKEN)

# Define model URLs
IMAGE_MODEL_URL = "openai/clip-vit-base-patch32"
TEXT_MODEL_URL = "sentence-transformers/all-MiniLM-L6-v2"

@app.post("/embed-image/")
async def embed_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()  # Read the uploaded image file
        # Get image embedding from Hugging Face using the InferenceClient
        image_embedding = client.feature_extraction(image_bytes, model=IMAGE_MODEL_URL)
        return {"embedding": image_embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image embedding failed: {e}")

@app.post("/embed-text/")
async def embed_text(request: Request):
    try:
        data = await request.json()
        text = data.get("text", "")
        # Get text embedding from Hugging Face using the InferenceClient
        text_embedding = client.feature_extraction(text, model=TEXT_MODEL_URL)
        return {"embedding": text_embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text embedding failed: {e}")

