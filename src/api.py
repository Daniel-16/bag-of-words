from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .predict import load_system, predict_message


class PredictRequest(BaseModel):
    text: str = Field(..., description="Raw email/SMS/job text to classify")


class PredictResponse(BaseModel):
    label: str
    confidence: float


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Load the AFF model and vectorizer once for the application lifespan.
    Stored on the app.state object for reuse across requests.
    """
    model, vectorizer = load_system()
    app.state.model = model
    app.state.vectorizer = vectorizer
    yield


app = FastAPI(
    title="Advance Fee Fraud (AFF) Detector API",
    description=(
        "HTTP API wrapper around the AFF model. "
        "Loads the model once at startup and serves predictions."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["system"])
def health_check():
    """
    Lightweight health endpoint for readiness / liveness checks.
    """
    model_loaded = hasattr(app.state, "model") and hasattr(app.state, "vectorizer")
    return {"status": "ok", "model_loaded": model_loaded}


@app.post("/predict", response_model=PredictResponse, tags=["prediction"])
def predict(request: PredictRequest):
    """
    Classify a single piece of text as SCAM/FRAUD or LEGITIMATE.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text must not be empty.")

    if app.state.model is None or app.state.vectorizer is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Model not loaded. Run train_model.py and commit models/aff_model.pkl "
                "and models/vectorizer.pkl, or run training in the deploy build step."
            ),
        )

    try:
        label, confidence = predict_message(app.state.model, app.state.vectorizer, request.text)
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return PredictResponse(label=label, confidence=float(confidence))


def get_app() -> FastAPI:
    """
    Convenience accessor for ASGI servers (e.g. uvicorn).
    """
    return app

