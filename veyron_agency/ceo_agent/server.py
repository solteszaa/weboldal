from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from ceo_agent import CEOAgent

# Környezeti változók betöltése
load_dotenv()

app = Flask(__name__)
CORS(app)  # CORS engedélyezése a kereszthivatkozások miatt

# CEO ügynök példányosítása
ceo_agent = CEOAgent()

@app.route('/api/message', methods=['POST'])
def receive_message():
    """
    Üzenet fogadása más ügynököktől vagy felhasználótól
    """
    data = request.json
    
    if not data or 'message' not in data:
        return jsonify({'error': 'Hiányzó üzenet'}), 400
    
    # Honnan jött az üzenet (felhasználó vagy egy másik ügynök)
    sender = data.get('sender', 'user')
    message = data.get('message')
    
    # Az üzenet feldolgozása az ügynök által
    try:
        response = ceo_agent.process_message(message, sender)
        return jsonify({'response': response, 'agent': 'CEOAgent'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Ellenőrzi, hogy az ügynök működik-e
    """
    return jsonify({'status': 'ok', 'agent': 'CEOAgent'})

# Új metódus hozzáadása a CEOAgent osztályhoz
def process_message(self, message, sender='user'):
    """
    Üzenet feldolgozása és válasz generálása
    """
    # Itt integrálnánk a valódi ügynök logikát
    # Egyszerűsített példa demonstrációhoz:
    if sender == 'user':
        # Ha a felhasználótól jött, közvetlenül válaszolunk
        return f"CEO válasza a felhasználónak: {message}"
    else:
        # Ha másik ügynöktől jött, másképp dolgozzuk fel
        return f"CEO válasza a {sender} ügynöknek: {message}"

# A metódus hozzáadása az osztályhoz
CEOAgent.process_message = process_message

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 