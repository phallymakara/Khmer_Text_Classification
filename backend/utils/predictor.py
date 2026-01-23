import joblib
import os
import numpy as np

# Set the path to model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "best_model_compressed.joblib")

# 1. Load the dictionary
data = joblib.load(MODEL_PATH)

# 2. Extract the individual components
tfidf = data['tfidf']
chi2  = data['chi2']
svd   = data['svd']
clf   = data['model']

# List of categories for mapping IDs to Names
# Ensure this order matches the one used during training
CATEGORIES = ["Economic", "Entertainment", "Politic", "Life", "Sport", "Technology"]

def classify_text(text: str):
    """
    Returns the top 3 predicted categories with their scores.
    """
    # Step 1: Wrap text in a list
    X = [text]
    
    # Step 2: Transform through the pipeline
    X_tfidf = tfidf.transform(X)
    X_chi2  = chi2.transform(X_tfidf)
    X_svd   = svd.transform(X_chi2)
    
    # Step 3: Get decision scores for all 6 categories
    # scores is an array of 6 values
    scores = clf.decision_function(X_svd)[0]
    
    # Step 4: Get indices of the top 3 scores in descending order
    # argsort returns indices to sort an array; we take the last 3 and reverse them
    top_indices = scores.argsort()[-3:][::-1]
    
    # Step 5: Format the results
    results = []
    for idx in top_indices:
        results.append({
            "category_id": int(idx + 1), # +1 to match your SQL ID (1-6)
            "category_name": CATEGORIES[idx],
            "score": float(scores[idx])
        })
    
    return results