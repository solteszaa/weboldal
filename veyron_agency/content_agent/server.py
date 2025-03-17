from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from content_agent import ContentAgent
import requests

# Környezeti változók betöltése
load_dotenv()

app = Flask(__name__)
CORS(app)  # CORS engedélyezése a kereszthivatkozások miatt

# Content ügynök példányosítása
content_agent = ContentAgent()

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
        response = content_agent.process_message(message, sender)
        return jsonify({'response': response, 'agent': 'ContentAgent'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Ellenőrzi, hogy az ügynök működik-e
    """
    return jsonify({'status': 'ok', 'agent': 'ContentAgent'})

# Media ügynök elérésének URL-je (környezeti változóból)
MEDIA_AGENT_URL = os.environ.get('MEDIA_AGENT_URL', 'http://localhost:5002/api/message')

# Új metódus hozzáadása a ContentAgent osztályhoz
def process_message(self, message, sender='user'):
    """
    Üzenet feldolgozása és válasz generálása
    """
    # Itt integrálnánk a valódi ügynök logikát
    # Egyszerűsített példa demonstrációhoz:
    if sender == 'CEOAgent':
        # Ha a CEO-tól jött az üzenet, feldolgozzuk
        response = f"Content ügynök feldolgozta a CEO kérését: {message}"
        
        # Ha szükséges, továbbítjuk a Media ügynöknek
        if "media" in message.lower():
            try:
                media_response = requests.post(
                    MEDIA_AGENT_URL,
                    json={'message': f"Content ügynök kérése: {message}", 'sender': 'ContentAgent'}
                )
                if media_response.status_code == 200:
                    media_data = media_response.json()
                    response += f"\n\nMedia ügynök válasza: {media_data.get('response')}"
            except Exception as e:
                response += f"\n\nHiba a Media ügynökkel való kommunikációban: {str(e)}"
        
        return response
    else:
        # Más esetekben alapértelmezett válasz
        return f"Content ügynök válasza a {sender} számára: {message}"

# A metódus hozzáadása az osztályhoz
ContentAgent.process_message = process_message

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True) 