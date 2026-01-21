import pandas as pd
import numpy as np
import re
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DATA_PATH = os.path.join(BASE_DIR, "data", "raw")
PROCESSED_DATA_PATH = os.path.join(BASE_DIR, "data", "processed")

FRAUD_FILE = os.path.join(RAW_DATA_PATH, "fradulent_emails.txt")
HAM_FILE = os.path.join(RAW_DATA_PATH, "spam_ham_dataset.csv")
SMS_FILE = os.path.join(RAW_DATA_PATH, "sms_spam.csv")
JOB_FILE = os.path.join(RAW_DATA_PATH, "fake_job_postings.csv")

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'\b(from|to|subject|date|received):.*', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s$]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_fraud_txt(filepath):
    print(f"   -> Loading Classic AFF (Nigeria/419)...")
    try:
        with open(filepath, 'r', encoding='latin-1') as f:
            data = f.read()
        emails = data.split("From r")
        df = pd.DataFrame({'text': [e for e in emails if len(e) > 50]})
        df['label'] = 1
        return df
    except FileNotFoundError:
        print(f"      File not found: {filepath}")
        return pd.DataFrame()

def parse_ham_csv(filepath):
    print(f"   -> Loading Legitimate Emails...")
    try:
        df = pd.read_csv(filepath)
        text_col = 'text' if 'text' in df.columns else 'v2'
        label_col = 'label' if 'label' in df.columns else 'v1'
        if label_col in df.columns and 'ham' in df[label_col].values:
            df = df[df[label_col] == 'ham']
        df = df.rename(columns={text_col: 'text'})
        df = df[['text']].copy()
        df['label'] = 0
        return df
    except FileNotFoundError:
        print(f"      File not found: {filepath}")
        return pd.DataFrame()

def parse_sms_csv(filepath):
    print(f"   -> Loading Modern SMS AFF (Lottery/Prize Scams)...")
    try:
        df = pd.read_csv(filepath, encoding='latin-1')
        df = df.rename(columns={'v1': 'label', 'v2': 'text'})
        spam_df = df[df['label'] == 'spam'].copy()
        aff_keywords = ['won', 'prize', 'cash', 'claim', 'urgent', 'award', 'contact', 'call', 'money']
        pattern = '|'.join(aff_keywords)
        aff_sms = spam_df[spam_df['text'].str.lower().str.contains(pattern)]
        print(f"      (Filtered {len(spam_df)} spam msgs down to {len(aff_sms)} STRICT AFF msgs)")
        aff_sms['label'] = 1
        return aff_sms[['text', 'label']]
    except FileNotFoundError:
        print(f"      File not found: {filepath}")
        return pd.DataFrame()

def parse_job_csv(filepath):
    print(f"   -> Loading Employment AFF Scams...")
    try:
        df = pd.read_csv(filepath)
        df = df[df['fraudulent'] == 1]
        df['text'] = df['title'] + " " + df['description']
        df['label'] = 1
        return df[['text', 'label']]
    except FileNotFoundError:
        print(f"      File not found: {filepath}")
        return pd.DataFrame()

def load_and_process_data():
    os.makedirs(PROCESSED_DATA_PATH, exist_ok=True)
    print("--- STARTING STRICT AFF DATA INGESTION ---")
    df_old_fraud = parse_fraud_txt(FRAUD_FILE)
    df_ham = parse_ham_csv(HAM_FILE)
    df_sms_aff = parse_sms_csv(SMS_FILE)
    df_jobs_aff = parse_job_csv(JOB_FILE)
    df = pd.concat([df_old_fraud, df_ham, df_sms_aff, df_jobs_aff], axis=0).reset_index(drop=True)
    print(f"\nProcessing {len(df)} total raw samples...")
    df['clean_text'] = df['text'].apply(clean_text)
    df = df[df['clean_text'].str.len() > 10]
    output_path = os.path.join(PROCESSED_DATA_PATH, "clean_dataset.csv")
    df.to_csv(output_path, index=False)
    print("\n" + "="*40)
    print(f"DATASET COMPILED (STRICTLY AFF)")
    print(f"Total Samples: {len(df)}")
    print(f"   - Fraud (1): {len(df[df['label']==1])}")
    print(f"     (Includes: Classic 419, Fake Jobs, Lottery SMS)")
    print(f"   - Legit (0): {len(df[df['label']==0])}")
    print("="*40)

if __name__ == "__main__":
    load_and_process_data()