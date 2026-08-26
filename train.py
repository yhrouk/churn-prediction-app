import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    precision_score, 
    recall_score,
    f1_score,
    confusion_matrix
)
import joblib

file_path = "./data/customer_churn.xlsx"
df = pd.read_excel(file_path,engine="openpyxl")
print("Dataset Shape:", df.head())


# Convert 'Total Charges' from text to numeric numbers
df['Total Charges'] = pd.to_numeric(df['Total Charges'], errors='coerce').fillna(0)

# 3. Drop Data Leakage & Identifier Columns
columns_to_drop = [
    'Count', 'Zip Code', 'Churn Label', 'Churn Reason', 
    'Churn Score', 'Churn Value', 'CLTV', 'CLTV_final'
]
# Only drop columns that exist in the DataFrame
existing_drop_cols = [col for col in columns_to_drop if col in df.columns]

X = df.drop(columns=existing_drop_cols)
y = df['Churn Label'].map({'No': 0, 'Yes': 1})
print("Features shape (X):", X.shape) 
print("Target shape (y):", y.shape)   


# 1. Encode Categorical Features in X
X_encoded = pd.get_dummies(X, drop_first=True)
print(f"Cleaned Feature Matrix Shape: {X_encoded.shape}")


# 2. Split Data into Train and Test Sets (80% Train, 20% Test)
X_train, X_test, y_train, y_test = train_test_split(
    X_encoded, y, test_size=0.2, random_state=42, stratify=y
)

print(f"X_train shape: {X_train.shape}")
print(f"X_test shape:  {X_test.shape}")

# 3. Train Baseline Model (Random Forest)
model = RandomForestClassifier(
    n_estimators=300,
    class_weight="balanced",
    random_state=42
)

model.fit(X_train, y_train)
y_proba = model.predict_proba(X_test)[:, 1]
thresholds = [0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50]

for threshold in thresholds:
    y_pred_threshold = (y_proba >= threshold).astype(int)

    precision = precision_score(y_test, y_pred_threshold)
    recall = recall_score(y_test, y_pred_threshold)
    f1 = f1_score(y_test, y_pred_threshold)

    print(
        f"Threshold={threshold:.2f} | "
        f"Precision={precision:.3f} | "
        f"Recall={recall:.3f} | "
        f"F1={f1:.3f}"
    )

joblib.dump(model, "churn_model.pkl")
joblib.dump(X_encoded.columns.tolist(), "model_columns.pkl")