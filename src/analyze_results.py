import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os
from sklearn.metrics import confusion_matrix

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "aff_model.pkl")
VEC_PATH = os.path.join(BASE_DIR, "models", "vectorizer.pkl")
TEST_DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "test_predictions.csv")
RESULTS_DIR = os.path.join(BASE_DIR, "results")

def analyze():
    os.makedirs(RESULTS_DIR, exist_ok=True)
    print("Loading test results and models...")
    df = pd.read_csv(TEST_DATA_PATH)
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VEC_PATH)

    print("Generating Confusion Matrix...")
    cm = confusion_matrix(df['label'], df['prediction'])
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['Legitimate', 'Fraud'], 
                yticklabels=['Legitimate', 'Fraud'])
    plt.xlabel('Predicted Label')
    plt.ylabel('Actual Label')
    plt.title('Confusion Matrix: AFF Detection Model')
    save_path_cm = os.path.join(RESULTS_DIR, "confusion_matrix.png")
    plt.savefig(save_path_cm)
    plt.close()
    print(f"   -> Saved to {save_path_cm}")

    print("Extracting Top Fraud Keywords...")
    feature_names = vectorizer.get_feature_names_out()
    fraud_prob_sorted_indices = model.feature_log_prob_[1].argsort()[::-1]
    top_n = 20
    top_words = [feature_names[i] for i in fraud_prob_sorted_indices[:top_n]]
    top_scores = [model.feature_log_prob_[1][i] for i in fraud_prob_sorted_indices[:top_n]]
    plt.figure(figsize=(10, 8))
    sns.barplot(x=top_scores, y=top_words, palette='Reds_r')
    plt.xlabel('Log Probability (Higher = Stronger Indicator)')
    plt.title(f'Top {top_n} Words Indicating Advance Fee Fraud')
    save_path_feat = os.path.join(RESULTS_DIR, "top_fraud_words.png")
    plt.savefig(save_path_feat)
    plt.close()
    print(f"   -> Saved to {save_path_feat}")

    print("\n--- TEST: SIMULATING A NEW EMAIL ---")
    custom_email = [
        "Dear Friend, I am a banker. I need your help to transfer $15 million USD. This is urgent."
    ]
    custom_vec = vectorizer.transform(custom_email)
    prediction = model.predict(custom_vec)[0]
    prob = model.predict_proba(custom_vec)[0]
    result = "FRAUD" if prediction == 1 else "LEGITIMATE"
    confidence = prob[prediction]
    print(f"Input Text: {custom_email[0]}")
    print(f"Prediction: {result}")
    print(f"Confidence: {confidence:.2%}")

if __name__ == "__main__":
    analyze()