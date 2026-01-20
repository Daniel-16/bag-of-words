import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_FILE = os.path.join(BASE_DIR, "data", "processed", "clean_dataset.csv")

def inspect_data():
    if not os.path.exists(PROCESSED_FILE):
        print(f"Error: File not found at {PROCESSED_FILE}")
        return

    print("Loading dataset...")
    df = pd.read_csv(PROCESSED_FILE)

    print("\n--- Dataset Shape ---")
    print(f"Rows: {df.shape[0]}")
    print(f"Columns: {df.shape[1]}")
    print(f"Column Names: {list(df.columns)}")

    print("\n--- Label Distribution ---")
    print(df['label'].value_counts())
    print("(1 = Fraud/AFF, 0 = Legitimate)")

    print("\n--- Missing Values ---")
    print(df.isnull().sum())

    print("\n--- Random Samples ---")
    fraud_sample = df[df['label'] == 1].sample(1)
    print("\nSample Fraud (label 1):")
    print(f"Raw: {fraud_sample['text'].values[0][:200]}...")
    print(f"Clean: {fraud_sample['clean_text'].values[0][:200]}...")

    legit_sample = df[df['label'] == 0].sample(1)
    print("\nSample Legit (label 0):")
    print(f"Raw: {legit_sample['text'].values[0][:200]}...")
    print(f"Clean: {legit_sample['clean_text'].values[0][:200]}...")

    print("\n--- Text Length Check ---")
    empty_clean = df[df['clean_text'].str.len() < 2]
    if len(empty_clean) > 0:
        print(f"Warning: {len(empty_clean)} rows have empty 'clean_text'.")
        print(empty_clean.head())
    else:
        print("All rows contain valid text data.")

if __name__ == "__main__":
    inspect_data()