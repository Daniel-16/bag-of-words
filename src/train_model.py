import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "clean_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
TEST_PREDS_PATH = os.path.join(BASE_DIR, "data", "processed", "test_predictions.csv")

def train_robust():
    os.makedirs(MODEL_DIR, exist_ok=True)
    print("Loading comprehensive dataset...")
    df = pd.read_csv(DATA_PATH).dropna()
    df['clean_text'] = df['clean_text'].astype(str)
    X = df['clean_text']
    y = df['label']
    print("Vectorizing text...")
    vectorizer = CountVectorizer(stop_words='english', max_features=5000)
    X_vec = vectorizer.fit_transform(X)

    print("\n--- PHASE 1: 5-Fold Cross-Validation (Robustness Check) ---")
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    metrics = {'acc': [], 'prec': [], 'rec': [], 'f1': []}
    fold = 1
    for train_idx, test_idx in skf.split(X_vec, y):
        X_tr, X_te = X_vec[train_idx], X_vec[test_idx]
        y_tr, y_te = y.iloc[train_idx], y.iloc[test_idx]
        clf = MultinomialNB()
        clf.fit(X_tr, y_tr)
        preds = clf.predict(X_te)
        metrics['acc'].append(accuracy_score(y_te, preds))
        metrics['prec'].append(precision_score(y_te, preds))
        metrics['rec'].append(recall_score(y_te, preds))
        metrics['f1'].append(f1_score(y_te, preds))
        print(f"   Fold {fold}: Accuracy = {metrics['acc'][-1]:.2%}")
        fold += 1

    print("\n   [Average CV Results]")
    print(f"   Accuracy:  {np.mean(metrics['acc']):.2%}")
    print(f"   F1-Score:  {np.mean(metrics['f1']):.2%}")

    print("\n--- PHASE 2: Generating Test Data for Visualization ---")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    X_train_vec = vectorizer.transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    viz_model = MultinomialNB()
    viz_model.fit(X_train_vec, y_train)
    viz_preds = viz_model.predict(X_test_vec)
    test_df = pd.DataFrame({'text': X_test, 'label': y_test, 'prediction': viz_preds})
    test_df.to_csv(TEST_PREDS_PATH, index=False)
    print(f"   -> Saved test predictions to {TEST_PREDS_PATH}")

    print("\n--- PHASE 3: Training Final System Brain ---")
    final_model = MultinomialNB()
    final_model.fit(X_vec, y)
    joblib.dump(final_model, os.path.join(MODEL_DIR, "aff_model.pkl"))
    joblib.dump(vectorizer, os.path.join(MODEL_DIR, "vectorizer.pkl"))
    print("System fully trained and saved.")

if __name__ == "__main__":
    train_robust()