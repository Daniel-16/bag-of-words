import joblib
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from data_loader import clean_text

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "aff_model.pkl")
VEC_PATH = os.path.join(BASE_DIR, "models", "vectorizer.pkl")

def load_system():
    print("Loading AI Brain...")
    try:
        model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VEC_PATH)
        return model, vectorizer
    except FileNotFoundError:
        print("Error: Model files not found. Did you run train_model.py?")
        exit()

def predict_message(model, vectorizer, text):
    cleaned = clean_text(text)
    vec_text = vectorizer.transform([cleaned])
    prediction = model.predict(vec_text)[0]
    proba = model.predict_proba(vec_text)[0]
    label = "SCAM / FRAUD" if prediction == 1 else "LEGITIMATE"
    confidence = proba[prediction]
    return label, confidence

def main():
    model, vectorizer = load_system()
    print("\n" + "="*50)
    print("   ADVANCE FEE FRAUD DETECTOR (v1.0)   ")
    print("   Type a message and press Enter.     ")
    print("   Type 'exit' to quit.                ")
    print("="*50 + "\n")
    while True:
        user_input = input("Enter email text: ")
        if user_input.lower() in ['exit', 'quit']:
            print("Goodbye!")
            break
        if len(user_input.strip()) == 0:
            continue
        label, confidence = predict_message(model, vectorizer, user_input)
        print(f"\nResult: {label}")
        print(f"Confidence: {confidence:.2%}")
        print("-" * 30 + "\n")

if __name__ == "__main__":
    main()