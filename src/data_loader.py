import pandas as pd
import numpy as np
import re
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DATA_PATH = os.path.join(BASE_DIR, "data", "raw")
PROCESSED_DATA_PATH = os.path.join(BASE_DIR, "data", "processed")
FRAUD_FILE = os.path.join(RAW_DATA_PATH, "fradulent_emails.txt")
HAM_FILE = os.path.join(RAW_DATA_PATH, "spam_ham_dataset.csv")

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'\b(from|to|subject|date|received):.*', '', text)
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_fraud_txt(filepath):
    print(f"Reading Fraud Data from: {filepath}")
    try:
        with open(filepath, 'r', encoding='latin-1') as f:
            data = f.read()
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return pd.DataFrame()
    emails = data.split("From r")
    emails = [e for e in emails if len(e) > 50]
    print(f"   -> Found {len(emails)} fraud emails.")
    df = pd.DataFrame({'text': emails})
    df['label'] = 1
    return df

def parse_ham_csv(filepath):
    print(f"Reading Legitimate Data from: {filepath}")
    try:
        df = pd.read_csv(filepath)
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return pd.DataFrame()
    if 'v1' in df.columns and 'v2' in df.columns:
        df = df.rename(columns={'v1': 'label_name', 'v2': 'text'})
    elif 'label' not in df.columns or 'text' not in df.columns:
        text_col = [c for c in df.columns if df[c].dtype == object][0]
        df = df.rename(columns={text_col: 'text'})
    if 'label' in df.columns or 'label_name' in df.columns:
        col = 'label' if 'label' in df.columns else 'label_name'
        df = df[df[col].astype(str).str.lower() == 'ham']
    print(f"   -> Found {len(df)} legitimate emails.")
    df = df[['text']].copy()
    df['label'] = 0
    return df

def load_and_process_data():
    os.makedirs(PROCESSED_DATA_PATH, exist_ok=True)
    df_fraud = parse_fraud_txt(FRAUD_FILE)
    df_ham = parse_ham_csv(HAM_FILE)
    if df_fraud.empty and df_ham.empty:
        print("Both datasets failed to load. Check file paths.")
        return
    df = pd.concat([df_fraud, df_ham], axis=0).reset_index(drop=True)
    print("Preprocessing text (this may take a moment)...")
    df['clean_text'] = df['text'].apply(clean_text)
    df = df[df['clean_text'].str.len() > 5]
    output_path = os.path.join(PROCESSED_DATA_PATH, "clean_dataset.csv")
    df.to_csv(output_path, index=False)
    print("-" * 30)
    print(f"DATA PROCESSING COMPLETE")
    print(f"Saved to: {output_path}")
    print(f"Total Samples: {len(df)}")
    print(f"   - Fraud (1): {len(df[df['label']==1])}")
    print(f"   - Legit (0): {len(df[df['label']==0])}")
    print("-" * 30)

if __name__ == "__main__":
    load_and_process_data()