"""
Comprehensive metrics extraction and display script.
Prints all relevant data from dataset, training, and analysis files.
"""
import pandas as pd
import numpy as np
import os
import joblib
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_FILE = os.path.join(BASE_DIR, "data", "processed", "clean_dataset.csv")
TEST_PREDS_PATH = os.path.join(BASE_DIR, "data", "processed", "test_predictions.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "aff_model.pkl")
VEC_PATH = os.path.join(BASE_DIR, "models", "vectorizer.pkl")

def print_dataset_stats():
    """Print dataset statistics from clean_dataset.csv"""
    print("=" * 70)
    print("DATASET STATISTICS")
    print("=" * 70)
    
    if not os.path.exists(PROCESSED_FILE):
        print(f"Dataset file not found: {PROCESSED_FILE}")
        print("   Run: python src/data_loader.py first\n")
        return False
    
    df = pd.read_csv(PROCESSED_FILE)
    
    print(f"\n Dataset Shape:")
    print(f"   Total Samples: {df.shape[0]:,}")
    print(f"   Columns: {df.shape[1]}")
    print(f"   Column Names: {', '.join(df.columns)}")
    
    print(f"\n Label Distribution:")
    label_counts = df['label'].value_counts().sort_index()
    total = len(df)
    for label, count in label_counts.items():
        label_name = "Fraud/AFF" if label == 1 else "Legitimate"
        pct = (count / total) * 100
        print(f"   {label_name} ({label}): {count:,} ({pct:.1f}%)")
    
    print(f"\n Data Quality:")
    missing = df.isnull().sum()
    if missing.sum() > 0:
        print("   Missing Values:")
        for col, count in missing.items():
            if count > 0:
                print(f"      {col}: {count}")
    else:
        print("   ✓ No missing values")
    
    # Text length statistics
    df['text_length'] = df['clean_text'].str.len()
    print(f"\n Text Length Statistics:")
    print(f"   Mean: {df['text_length'].mean():.1f} characters")
    print(f"   Median: {df['text_length'].median():.1f} characters")
    print(f"   Min: {df['text_length'].min()} characters")
    print(f"   Max: {df['text_length'].max():,} characters")
    
    empty = len(df[df['clean_text'].str.len() < 2])
    if empty > 0:
        print(f"     Warning: {empty} rows have empty clean_text")
    else:
        print("   All rows contain valid text")
    
    print()
    return True

def print_model_metrics():
    """Print model performance metrics from test predictions"""
    print("=" * 70)
    print("MODEL PERFORMANCE METRICS")
    print("=" * 70)
    
    if not os.path.exists(TEST_PREDS_PATH):
        print(f" Test predictions file not found: {TEST_PREDS_PATH}")
        print("   Run: python src/train_model.py first\n")
        return False
    
    df = pd.read_csv(TEST_PREDS_PATH)
    
    y_true = df['label']
    y_pred = df['prediction']
    
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred)
    rec = recall_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)
    cm = confusion_matrix(y_true, y_pred)
    
    print(f"\n Test Set Performance (20% holdout):")
    print(f"   Accuracy:  {acc:.2%}")
    print(f"   Precision: {prec:.2%}")
    print(f"   Recall:    {rec:.2%}")
    print(f"   F1-Score:  {f1:.2%}")
    
    print(f"\n Confusion Matrix:")
    print(f"                    Predicted")
    print(f"                  Legit  Fraud")
    print(f"   Actual Legit    {cm[0][0]:5d}  {cm[0][1]:5d}")
    print(f"          Fraud    {cm[1][0]:5d}  {cm[1][1]:5d}")
    
    # Calculate additional metrics
    tn, fp, fn, tp = cm.ravel()
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    print(f"\n Additional Metrics:")
    print(f"   True Positives (TP):  {tp}")
    print(f"   True Negatives (TN):  {tn}")
    print(f"   False Positives (FP): {fp}")
    print(f"   False Negatives (FN): {fn}")
    print(f"   Specificity:          {specificity:.2%}")
    
    print()
    return True

def print_top_keywords():
    """Print top fraud-indicating keywords from the trained model"""
    print("=" * 70)
    print("TOP FRAUD-INDICATING KEYWORDS")
    print("=" * 70)
    
    if not os.path.exists(MODEL_PATH) or not os.path.exists(VEC_PATH):
        print(f" Model files not found:")
        if not os.path.exists(MODEL_PATH):
            print(f"   Missing: {MODEL_PATH}")
        if not os.path.exists(VEC_PATH):
            print(f"   Missing: {VEC_PATH}")
        print("   Run: python src/train_model.py first\n")
        return False
    
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VEC_PATH)
    
    feature_names = vectorizer.get_feature_names_out()
    fraud_prob_sorted_indices = model.feature_log_prob_[1].argsort()[::-1]
    top_n = 20
    top_words = [feature_names[i] for i in fraud_prob_sorted_indices[:top_n]]
    top_scores = [model.feature_log_prob_[1][i] for i in fraud_prob_sorted_indices[:top_n]]
    
    print(f"\n Top {top_n} Keywords (by log probability for fraud class):")
    print("   Rank | Keyword          | Log Probability")
    print("   " + "-" * 45)
    for idx, (word, score) in enumerate(zip(top_words, top_scores), 1):
        print(f"   {idx:2d}  | {word:15s} | {score:8.4f}")
    
    print()
    return True

def print_model_info():
    """Print model architecture and configuration"""
    print("=" * 70)
    print("MODEL CONFIGURATION")
    print("=" * 70)
    
    if not os.path.exists(MODEL_PATH) or not os.path.exists(VEC_PATH):
        print(f" Model files not found. Run: python src/train_model.py first\n")
        return False
    
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VEC_PATH)
    
    print(f"\n Classifier:")
    print(f"   Type: {type(model).__name__}")
    print(f"   Module: {type(model).__module__}")
    
    print(f"\n Vectorizer:")
    print(f"   Type: {type(vectorizer).__name__}")
    print(f"   Max Features: {vectorizer.max_features}")
    print(f"   Stop Words: {vectorizer.stop_words}")
    print(f"   Vocabulary Size: {len(vectorizer.vocabulary_)}")
    
    print()
    return True

def main():
    """Print all relevant metrics and data"""
    print("\n" + "=" * 70)
    print("ADVANCE FEE FRAUD DETECTOR - COMPREHENSIVE METRICS REPORT")
    print("=" * 70 + "\n")
    
    print_dataset_stats()
    print_model_info()
    print_model_metrics()
    print_top_keywords()
    
    print("=" * 70)
    print("END OF REPORT")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    main()
