from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from media_agent import MediaAgent

# Környezeti változók betöltése
load_dotenv()

app = Flask(__name__)
CORS(app)  # CORS engedélyezése a kereszthivatkozások miatt

# Media ügynök példányosítása
media_agent = MediaAgent()

@app.route('/api/message', methods=['POST'])
def receive_message():
    """
    Üzenet fogadása más ügynököktől vagy felhasználótól
    """
    data = request.json
    
    if not data or 'message' not in data:
        return jsonify({'error': 'Hiányzó üzenet'}), 400
    
    # Honnan jött az üzenet
    sender = data.get('sender', 'user')
    message = data.get('message')
    
    # Az üzenet feldolgozása az ügynök által
    try:
        response = media_agent.process_message(message, sender)
        return jsonify({'response': response, 'agent': 'MediaAgent'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Ellenőrzi, hogy az ügynök működik-e
    """
    return jsonify({'status': 'ok', 'agent': 'MediaAgent'})

# Új metódus hozzáadása a MediaAgent osztályhoz
def process_message(self, message, sender='user'):
    """
    Üzenet feldolgozása és válasz generálása
    """
    # Itt integrálnánk a valódi ügynök logikát
    # Egyszerűsített példa demonstrációhoz:
    if sender == 'CEOAgent':
        # Ha a CEO-tól jött az üzenet
        return f"Media ügynök válasza a CEO kérésére: {message}"
    elif sender == 'ContentAgent':
        # Ha a Content ügynöktől jött az üzenet
        return f"Media ügynök feldolgozta a tartalmat: {message}"
    else:
        # Más esetekben
        return f"Media ügynök válasza a {sender} számára: {message}"

# A metódus hozzáadása az osztályhoz
MediaAgent.process_message = process_message

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True) 