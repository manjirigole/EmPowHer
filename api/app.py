from datetime import datetime
from flask import Flask, jsonify

app = Flask(__name__)

def timeNow():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S').split(" ")[1]

@app.route('/time')  # http://127.0.0.1:5000/time
def serve():
    return jsonify({"time": timeNow()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Make sure to use 0.0.0.0 to allow external access
