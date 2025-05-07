from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from sentence_transformers import SentenceTransformer
from PIL import Image
import io
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
try:
    print("Loading image model (CLIP)...")
    image_model = SentenceTransformer("sentence-transformers/clip-ViT-B-32")
    print("Image model loaded successfully!")

    print("Loading text model (MiniLM)...")
    text_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    print("Text model loaded successfully!")
except Exception as e:
    print(f"Model loading failed: {e}")
    image_model = None
    text_model = None

@app.post("/embed-image/")
async def embed_image(file: UploadFile = File(...)):
    if image_model is None:
        raise HTTPException(status_code=500, detail="Image model not loaded correctly!")

    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = image.resize((224, 224))
        
        vector = image_model.encode(image).tolist()
        return {"embedding": vector}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {e}")

@app.post("/embed-text/")
async def embed_text(request: Request):
    if text_model is None:
        raise HTTPException(status_code=500, detail="Text model not loaded correctly!")

    try:
        data = await request.json()
        text = data.get("text", "")
        print("search:", text)
        vector = text_model.encode(text).tolist()
        return {"embedding": vector}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing text: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
