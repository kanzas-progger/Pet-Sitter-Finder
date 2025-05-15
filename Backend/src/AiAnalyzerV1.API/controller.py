from analyze import analyze_reviews
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://localhost:5173"}})


@app.route('/api/reviews/ai', methods=['POST'])
def analyze():
    request_data = request.get_json()
    
    reviews_data = request_data.get('reviews_data', [])

    print(reviews_data)

    response = analyze_reviews(reviews_data)
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True, port=5101)

