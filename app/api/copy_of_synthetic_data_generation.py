# Install necessary packages
# Uncomment the lines below to install if needed
# !pip install -U langchain langchain_experimental openai
# !pip install -qU langchain-google-genai
# !pip install joblib  # To save the trained model

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import FewShotPromptTemplate, PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.pydantic_v1 import BaseModel
from langchain_experimental.tabular_synthetic_data.base import SyntheticDataGenerator
from langchain_experimental.tabular_synthetic_data.openai import create_openai_data_generator, OPENAI_TEMPLATE
from langchain_experimental.tabular_synthetic_data.prompts import SYNTHETIC_FEW_SHOT_SUFFIX, SYNTHETIC_FEW_SHOT_PREFIX

# Initialize the language model
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=1,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    api_key="AIzaSyC-gf1lYHe9OH3axLep5pi61h22HIKBDfg"
)

import pandas as pd
import json
from pydantic import BaseModel, Field
from typing import List, Optional
import random
import datetime
from joblib import dump  # Importing joblib for saving the model

# Define the MenstrualCycleData class
class MenstrualCycleData(BaseModel):
    age: int = Field(..., ge=19, le=40, description="Age of the person")
    symptoms: List[str] = Field(..., description="List of symptoms experienced (cramps, headache, bloating, nausea, body pain, mood swings, fatigue)")
    duration: int = Field(..., ge=21, le=40, description="Duration of the menstrual cycle in days")
    early_late: str = Field(..., description="Whether the cycle is early, on time, or late")
    hormonal_imbalance: bool = Field(..., description="Presence of hormonal imbalance")
    pain: int = Field(..., ge=1, le=5, description="Pain level on a scale of 1-5")
    pcod_pcos: Optional[str] = Field(None, description="PCOD/PCOS diagnosis if applicable")
    medications: Optional[List[str]] = Field(None, description="List of common medications")
    affecting_medicine: bool = Field(..., description="Whether medicine affects the cycle")
    last_menstrual_date: str = Field(..., description="Last menstrual date in YYYY-MM-DD format")

# Function to generate random data
def generate_random_data(batch_size):
    symptoms_list = ["cramps", "bloating", "headache", "nausea", "body pain", "mood swings", "fatigue"]
    medications_list = ["ibuprofen", "naproxen", "acetaminophen", "birth control pills"]

    data = []
    for _ in range(batch_size):
        age = random.randint(19, 40)
        symptoms = random.sample(symptoms_list, random.randint(1, 3))
        duration = random.randint(21, 40)
        early_late = random.choice(["early", "on time", "late"])
        hormonal_imbalance = random.choice([True, False])
        pain = random.randint(1, 5)
        pcod_pcos = random.choice([None, "PCOD", "PCOS"]) if hormonal_imbalance else None
        medications = random.sample(medications_list, random.randint(1, 2)) if hormonal_imbalance else None
        affecting_medicine = random.choice([True, False])
        last_menstrual_date = (datetime.datetime.now() - datetime.timedelta(days=random.randint(21, 40))).strftime("%Y-%m-%d")

        entry = MenstrualCycleData(
            age=age,
            symptoms=symptoms,
            duration=duration,
            early_late=early_late,
            hormonal_imbalance=hormonal_imbalance,
            pain=pain,
            pcod_pcos=pcod_pcos,
            medications=medications,
            affecting_medicine=affecting_medicine,
            last_menstrual_date=last_menstrual_date
        )
        data.append(entry)

    return data

# Generate new dataset
new_dataset_size = 2000
new_data = generate_random_data(new_dataset_size)

# Convert the new entries to a list of dictionaries
new_data_dicts = [data.dict(by_alias=True) for data in new_data]

# Save the new dataset to JSON in app/data
with open("../data/new_menstrual_cycle_dataset.json", "w") as f:
    json.dump(new_data_dicts, f, indent=2)
print(f"New JSON dataset saved to app/data/new_menstrual_cycle_dataset.json")

# Convert the new entries to a DataFrame
new_entries_df = pd.DataFrame(new_data_dicts)

# Save the new dataset to CSV in app/data
new_entries_df.to_csv('../data/new_menstrual_cycle_dataset.csv', index=False)
print(f"New CSV dataset saved to app/data/new_menstrual_cycle_dataset.csv")

# Preprocess the data
# Load the data
data = pd.read_csv('../data/new_menstrual_cycle_dataset.csv')

# Check for missing values
print("Missing values before imputation:")
print(data.isnull().sum())

# Impute missing values
data['age'].fillna(data['age'].mean(), inplace=True)  # Mean imputation for age
data['duration'].fillna(data['duration'].median(), inplace=True)  # Median imputation for duration
data['early_late'].fillna(data['early_late'].mode()[0], inplace=True)  # Mode imputation for early_late
data['pcod_pcos'].fillna("None", inplace=True)  # Fill missing PCOD/PCOS with 'None'
data['medications'].fillna("None", inplace=True)  # Fill missing medications with 'None'

# Convert 'last_menstrual_date' to datetime
# Assuming 'data' is your DataFrame
data['last_menstrual_date'] = pd.to_datetime(data['last_menstrual_date'], format="%Y%m%d",errors='coerce')


# Calculate the next period date
data['last_menstrual_date_num'] = data['last_menstrual_date'].apply(lambda x: (x - pd.Timestamp("1970-01-01")) // pd.Timedelta('1s') if pd.notnull(x) else None)

# Print the missing values after imputation
print("Missing values after imputation:")
print(data.isnull().sum())

# Save the processed data to a new CSV file in app/data
data.to_csv('../data/processed_menstrual_cycle_dataset.csv', index=False)
print(f"Processed dataset saved to app/data/processed_menstrual_cycle_dataset.csv")

# Model training logic
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error  # Ensure this line is included
import joblib

# Load preprocessed dataset
data = pd.read_csv("../data/processed_menstrual_cycle_dataset.csv")

# Convert 'last_menstrual_date' to a numerical format (timestamp)
data['last_menstrual_date_num'] = data['last_menstrual_date'].apply(lambda x: (x - pd.Timestamp("1970-01-01")) // pd.Timedelta('1s'))

# Prepare feature and target variables
X = data[['last_menstrual_date_num', 'duration']]
y = (data['next_period_date'] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1s')

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)
mse = mean_squared_error(y_test, predictions)

print(f"Mean Squared Error: {mse:.2f}")

# Save the trained model to api/model.joblib
joblib.dump(model, 'model.joblib')
print("Trained model saved to app/api/model.joblib")

# Function to predict the next period date
def predict_next_period(last_menstrual_date: str, duration: int) -> str:
    last_date = pd.to_datetime(last_menstrual_date)
    last_date_num = (last_date - pd.Timestamp("1970-01-01")) // pd.Timedelta('1s')

    # Prepare the input data for prediction
    input_data = pd.DataFrame([[last_date_num, duration]], columns=['last_menstrual_date_num', 'duration'])

    # Predict the next period date
    next_period_num = model.predict(input_data)[0]
    next_period_date = pd.Timestamp("1970-01-01") + pd.Timedelta(seconds=next_period_num)

    return next_period_date.strftime("%Y-%m-%d")
