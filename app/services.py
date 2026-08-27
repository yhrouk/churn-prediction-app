import os
import joblib
import pandas as pd

# Load saved model and expected feature columns
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../churn_model.pkl")
COLUMNS_PATH = os.path.join(os.path.dirname(__file__), "../model_columns.pkl")

model = joblib.load(MODEL_PATH)
model_columns = joblib.load(COLUMNS_PATH)

def predict_churn(data_dict, threshold=0.35):
    """
    Accepts raw feature dictionary, applies one-hot encoding, 
    aligns with training columns, and evaluates prediction at threshold.
    """
    # 1. Convert input JSON to DataFrame
    df = pd.DataFrame([data_dict])
    
    # 2. Process numeric columns matching training
    if 'Total Charges' in df.columns:
        df['Total Charges'] = pd.to_numeric(df['Total Charges'], errors='coerce').fillna(0)

    # 3. One-hot encode incoming data
    df_encoded = pd.get_dummies(df)

    # 4. Reindex to align with model's expected features (fill missing with 0)
    df_aligned = df_encoded.reindex(columns=model_columns, fill_value=0)

    # 5. Predict probabilities
    churn_probability = float(model.predict_proba(df_aligned)[0][1])
    churn_prediction = int(churn_probability >= threshold)

    return {
        "churn_prediction": churn_prediction,
        "churn_probability": round(churn_probability, 4),
        "threshold_used": threshold
    }