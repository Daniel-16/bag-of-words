# Advance Fee Fraud (AFF) Detector

A machine learning system that detects **Advance Fee Fraud** in emails, SMS, and job postings. It classifies text as **legitimate** or **fraud/scam** using a Multinomial Naive Bayes model trained on curated AFF datasets (419 scams, lottery/prize schemes, fake job postings, and similar patterns).

---

## Features

- **Strict AFF focus**: Trained only on advance-fee-style fraud (money transfer, lottery, fake jobs, etc.), not generic spam
- **Multiple data sources**: Aggregates classic 419 emails, SMS lottery/prize scams, fake job postings, and legitimate email corpora
- **Robust training**: 5-fold stratified cross-validation; final model and vectorizer saved for inference
- **Interactive classifier**: Type messages at the command line and get fraud/legit + confidence
- **Analysis & visuals**: Confusion matrix, top fraud-indicating keywords, and demo predictions

---

## Requirements

- **Python** ≥ 3.12
- **uv** (recommended) or `pip` for dependency management

---

## Setup

### 1. Clone and install dependencies

```bash
cd baggage
uv sync
# or: pip install -e .
```

### 2. Place raw data in `data/raw/`

The pipeline expects these files (create the directory if it does not exist):

| File | Description | Label |
|------|-------------|-------|
| `fradulent_emails.txt` | Classic Nigeria/419-style emails (plain text, `From r`-separated) | Fraud |
| `spam_ham_dataset.csv` | Ham (legit) emails; column `text` or `v2`, filter by `ham` | Legitimate |
| `sms_spam.csv` | SMS data with `v1` (label) and `v2` (text); spam filtered by AFF keywords | Fraud |
| `fake_job_postings.csv` | Job postings with `fraudulent`; use `fraudulent==1` rows | Fraud |

`data/raw/` is gitignored. You must obtain and place these datasets yourself.

---

## Workflow

Run the modules in this order:

### 1. Load and process raw data

```bash
uv run python src/data_loader.py
```

- Reads from `data/raw/`
- Cleans text (lowercase, strip headers, normalize)
- Writes `data/processed/clean_dataset.csv`

### 2. (Optional) Inspect the dataset

```bash
uv run python src/verify_data.py
```

Shows shape, label distribution, missing values, and sample fraud/legit rows.

### 3. Train the model

```bash
uv run python src/train_model.py
```

- 5-fold cross-validation (accuracy, F1)
- Train/test split for visualization; writes `data/processed/test_predictions.csv`
- Trains final model on full data
- Saves to `models/`:
  - `aff_model.pkl` — MultinomialNB
  - `vectorizer.pkl` — CountVectorizer (5k features, English stop words)

### 4. Run the interactive classifier

```bash
uv run python src/predict.py
```

Type email/SMS text; get `SCAM / FRAUD` or `LEGITIMATE` plus confidence. Type `exit` or `quit` to stop.

### 5. Analyze results and generate plots

```bash
uv run python src/analyze_results.py
```

- **Confusion matrix**: `results/confusion_matrix.png`
- **Top fraud keywords**: `results/top_fraud_words.png`
- **Demo**: Classifies a sample “banker transfer” email and prints prediction + confidence

---

## Project layout

```
baggage/
├── main.py              # Placeholder entrypoint
├── pyproject.toml       # Project config and dependencies
├── uv.lock              # Locked dependencies (uv)
├── .python-version      # 3.12
├── src/
│   ├── data_loader.py   # Ingest raw data → clean_dataset.csv
│   ├── verify_data.py   # Inspect processed dataset
│   ├── train_model.py   # Train, validate, save model + vectorizer
│   ├── predict.py       # Interactive AFF classifier
│   └── analyze_results.py  # Confusion matrix, top words, demo
├── data/
│   ├── raw/             # Input datasets (you provide)
│   └── processed/       # clean_dataset.csv, test_predictions.csv
├── models/              # aff_model.pkl, vectorizer.pkl (after training)
└── results/             # confusion_matrix.png, top_fraud_words.png
```

`data/raw/`, `data/processed/`, `models/*.pkl`, and `results/*.png` are gitignored.

---

## Deployment (e.g. Render)

The API starts even if the model files are missing; `/health` returns `model_loaded: false` and `/predict` returns **503** until the model is available. To serve predictions in production:

**Option A — Commit the trained model (simplest)**  
1. Locally: run `uv run python src/train_model.py` so `models/aff_model.pkl` and `models/vectorizer.pkl` exist.  
2. In `.gitignore`, remove or comment out `models/*.pkl` (or stop ignoring the whole `models/` directory).  
3. Commit and push the two `.pkl` files. Render will deploy with the model and predictions will work.

**Option B — Train at build time**  
1. Add your training data to the repo (e.g. commit `data/processed/clean_dataset.csv` and adjust `.gitignore`), or fetch it in a build script.  
2. In Render, set **Build Command** to run the pipeline and training, e.g.:  
   `uv sync && uv run python src/data_loader.py && uv run python src/train_model.py`  
   (Only works if the build has access to the required raw/processed data.)

Start command for the web service: `uv run uvicorn src.api:app --host 0.0.0.0 --port $PORT`

---

## Model details

- **Classifier**: `sklearn.naive_bayes.MultinomialNB`
- **Features**: `sklearn.feature_extraction.text.CountVectorizer` (max 5000 terms, English stop words)
- **Labels**: `0` = Legitimate, `1` = Fraud/AFF

---

## Dependencies (from `pyproject.toml`)

- `jupyterlab`
- `matplotlib`
- `nltk`
- `numpy`
- `pandas`
- `scikit-learn` (includes `joblib`)
- `seaborn`

---

## License

See repository or project metadata for license information.
