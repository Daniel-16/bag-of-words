import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "clean_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

def train():
    os.makedirs(MODEL_DIR, exist_ok=True)
    print("Loading data...")
    df = pd.read_csv(DATA_PATH)
    df['clean_text'] = df['clean_text'].astype(str)

    print("Splitting data into Training and Testing sets...")
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        df['clean_text'],
        df['label'],
        test_size=0.2,
        random_state=42,
        stratify=df['label']
    )

    print(f"   Training Samples: {len(X_train_raw)}")
    print(f"   Testing Samples:  {len(X_test_raw)}")

    print("Vectorizing text (Bag-of-Words)...")
    vectorizer = CountVectorizer(
        stop_words='english',
        max_features=5000
    )

    X_train_bow = vectorizer.fit_transform(X_train_raw)
    X_test_bow = vectorizer.transform(X_test_raw)

    print(f"   Vocabulary size: {len(vectorizer.get_feature_names_out())} words")

    print("Training Naive Bayes Classifier...")
    model = MultinomialNB()
    model.fit(X_train_bow, y_train)

    print("Evaluating model...")
    predictions = model.predict(X_test_bow)

    accuracy = accuracy_score(y_test, predictions)
    print(f"\nModel Accuracy: {accuracy:.2%}")
    print("\nClassification Report:")
    print(classification_report(y_test, predictions, target_names=['Legitimate', 'Fraud']))

    print(f"Saving model to {MODEL_DIR}...")
    joblib.dump(model, os.path.join(MODEL_DIR, "aff_model.pkl"))
    joblib.dump(vectorizer, os.path.join(MODEL_DIR, "vectorizer.pkl"))

    test_df = pd.DataFrame({'text': X_test_raw, 'label': y_test, 'prediction': predictions})
    test_df.to_csv(os.path.join(BASE_DIR, "data", "processed", "test_predictions.csv"), index=False)
    print("Done.")

if __name__ == "__main__":
    train()