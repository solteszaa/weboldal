import os
from flask import Flask, request, jsonify, render_template, send_from_directory
import logging
from dotenv import load_dotenv
import openai
import requests
import json
import base64
from datetime import datetime
from agency_swarm import Agency
from ceo_agent.ceo_agent import CEOAgent
from content_agent.content_agent import ContentAgent
from media_agent.media_agent import MediaAgent

# Környezeti változók betöltése
load_dotenv()

# Flask alkalmazás létrehozása
app = Flask(__name__, static_folder='static', template_folder='templates')

# Alapvető konfigurációk
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max feltöltési méret
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Logging beállítása
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ügynökök létrehozása
ceo = CEOAgent()
content = ContentAgent()
media = MediaAgent()

# Ügynökség létrehozása
agency = Agency(
    [
        ceo,
        [ceo, content],
        [ceo, media],
        [content, media]
    ],
    shared_instructions="agency_manifesto.md",
    temperature=0.5,
    max_prompt_tokens=25000
)

# API kulcsok és webhook ellenőrzése
openai_api_key = os.getenv("OPENAI_API_KEY")
imgbb_api_key = os.getenv("IMGBB_API_KEY")
webhook_url = os.getenv("WEBHOOK_URL")

if not openai_api_key or not imgbb_api_key or not webhook_url:
    logger.warning("Hiányzó környezeti változók! Ellenőrizd, hogy az OPENAI_API_KEY, IMGBB_API_KEY és WEBHOOK_URL be vannak állítva.")

# Templates mappa létrehozása, ha még nem létezik
os.makedirs('templates', exist_ok=True)

# Static mappa létrehozása, ha még nem létezik
os.makedirs('static', exist_ok=True)

# Index HTML létrehozása a templates mappában
@app.route('/')
def index():
    return render_template('index.html')

# Statikus fájlok kiszolgálása
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

# API végpont az AI ügynökséggel való kommunikációra
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Üzenet nem található'}), 400
        
        # Az ügynökségnek küldjük az üzenetet és visszaadjuk a választ
        response = agency.process_message(user_message)
        
        return jsonify({
            'response': response
        })
    
    except Exception as e:
        logger.error(f"Hiba történt: {str(e)}")
        return jsonify({'error': f'Szerver hiba: {str(e)}'}), 500

# Képfeltöltés API végpont
@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'Nincs kép csatolva'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'Nincs kiválasztott fájl'}), 400
    
    try:
        # Kép mentése
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        
        # Kép feltöltése ImgBB-re
        with open(file_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
        imgbb_api_key = os.getenv("IMGBB_API_KEY")
        if not imgbb_api_key:
            return jsonify({'error': 'ImgBB API kulcs nincs beállítva'}), 500
        
        payload = {
            'key': imgbb_api_key,
            'image': encoded_string,
            'name': file.filename
        }
        
        response = requests.post('https://api.imgbb.com/1/upload', payload)
        response_data = response.json()
        
        if not response_data['success']:
            return jsonify({'error': 'Képfeltöltési hiba az ImgBB-re'}), 500
        
        image_url = response_data['data']['url']
        
        return jsonify({
            'success': True,
            'image_url': image_url,
            'file_path': file_path
        })
        
    except Exception as e:
        logger.error(f"Képfeltöltési hiba: {str(e)}")
        return jsonify({'error': f'Képfeltöltési hiba: {str(e)}'}), 500

# Webhook küldés API végpont
@app.route('/api/send-webhook', methods=['POST'])
def send_webhook():
    try:
        data = request.json
        post_content = data.get('post_content', '')
        image_urls = data.get('image_urls', [])
        
        webhook_url = os.getenv("WEBHOOK_URL")
        if not webhook_url:
            return jsonify({'error': 'Webhook URL nincs beállítva'}), 500
        
        payload = {
            'post_content': post_content,
            'image_urls': image_urls,
            'timestamp': datetime.now().isoformat()
        }
        
        headers = {'Content-Type': 'application/json'}
        response = requests.post(webhook_url, data=json.dumps(payload), headers=headers)
        
        if response.status_code >= 200 and response.status_code < 300:
            return jsonify({
                'success': True,
                'status_code': response.status_code,
                'message': 'Webhook sikeresen elküldve'
            })
        else:
            return jsonify({
                'success': False,
                'status_code': response.status_code,
                'message': f'Webhook küldési hiba: {response.text}'
            }), 500
            
    except Exception as e:
        logger.error(f"Webhook küldési hiba: {str(e)}")
        return jsonify({'error': f'Webhook küldési hiba: {str(e)}'}), 500

# Futtatás
if __name__ == '__main__':
    # A PORT környezeti változót a Render automatikusan beállítja
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 