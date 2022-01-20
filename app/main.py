from io import BytesIO

import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from starlette.middleware.cors import CORSMiddleware
from app.service import get_human_number

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_image_into_numpy_array(data):
    return np.array(Image.open(BytesIO(data)))


@app.post("/")
async def root(file: UploadFile = File(...)):
    image = load_image_into_numpy_array(await file.read())
    i = int(get_human_number(image))
    return {"number": i}
