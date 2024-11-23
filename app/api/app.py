from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS  # To handle CORS issues

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load your model (make sure it's saved correctly)
model = joblib.load('model.joblib')  # Adjust path as needed

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    # Process your data as required by your model
    features = pd.DataFrame(data, index=[0])
    prediction = model.predict(features)
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
