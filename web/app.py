import os
import importlib
import json
import logging
import base64
import sys
from datetime import datetime
from flask import Flask, request, jsonify, render_template, send_from_directory, abort, redirect, url_for, session, flash
from flask_cors import CORS
from dotenv import load_dotenv

# Környezeti változók betöltése
load_dotenv()

# Flask alkalmazás létrehozása
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Titkos kulcs beállítása a session kezeléséhez
app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_change_in_production')

# Alapvető konfigurációk
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max feltöltési méret
app.config['UPLOAD_FOLDER'] = 'uploads'

# Feltöltési mappa létrehozása, ha nem létezik
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'clients'), exist_ok=True)

# Kliens könyvtár létrehozása, ha nem létezik
base_dir = os.path.dirname(os.path.dirname(__file__))
clients_dir = os.path.join(base_dir, 'clients')
os.makedirs(clients_dir, exist_ok=True)

# Python elérési utak beállítása
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)
    print(f"Base directory added to Python path: {base_dir}")

# Logging beállítása
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Egyszerű felhasználói adatok fejlesztési célokra
# Figyelem: Éles környezetben ne így tárold a jelszavakat!
users = {
    'admin': 'admin123',
    'demo': 'demo123'
}

# Ügyfél ügynökségek tárolása
client_agencies = {}

# Elérhető ügyfelek listája
def get_available_clients():
    try:
        return [d for d in os.listdir(clients_dir) 
                if os.path.isdir(os.path.join(clients_dir, d)) and 
                os.path.exists(os.path.join(clients_dir, d, 'agency.py'))]
    except Exception as e:
        logger.error(f"Hiba az elérhető ügyfelek lekérdezésekor: {str(e)}")
        return []

# Ügynökség dinamikus betöltése
def load_agency(client_id):
    if client_id in client_agencies:
        return client_agencies[client_id]
    
    try:
        # Ellenőrizzük, hogy létezik-e a kliens mappa
        client_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'clients', client_id)
        if not os.path.exists(client_path):
            logger.error(f"Kliens mappa nem található: {client_path}")
            return None
        
        # Ügynökség modul importálása
        sys_path_modified = False
        if client_path not in sys.path:
            sys.path.append(client_path)
            sys_path_modified = True
            
        try:
            # Próbáljuk importálni az agency modult
            spec = importlib.util.spec_from_file_location("agency", 
                                                        os.path.join(client_path, "agency.py"))
            agency_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(agency_module)
            
            # Ügynökség példány lekérése
            client_agencies[client_id] = agency_module.agency
            return client_agencies[client_id]
        except Exception as e:
            logger.error(f"Hiba történt az ügynökség betöltése során: {str(e)}")
            return None
        finally:
            # Eltávolítjuk a hozzáadott elérési utat
            if sys_path_modified:
                sys.path.remove(client_path)
    except Exception as e:
        logger.error(f"Váratlan hiba az ügynökség betöltése során: {str(e)}")
        return None

# Főoldal - ügyfelek listája
@app.route('/')
def index():
    # Ellenőrizzük, hogy be van-e jelentkezve a felhasználó
    show_clients = 'logged_in' in session and session['logged_in']
    clients = get_available_clients() if show_clients else []
    return render_template('index.html', clients=clients, show_clients=show_clients)

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    if username in users and users[username] == password:
        session['logged_in'] = True
        session['username'] = username
        return redirect(url_for('index'))
    else:
        flash('Hibás felhasználónév vagy jelszó!', 'danger')
        return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    return redirect(url_for('index'))

# Ügyfél kezdőlapja
@app.route('/client/<client_id>')
def client_index(client_id):
    # Ellenőrizzük, hogy be van-e jelentkezve a felhasználó
    if 'logged_in' not in session or not session['logged_in']:
        return redirect(url_for('index'))
    
    # Ellenőrizzük, hogy létezik-e az ügyfél
    clients = get_available_clients()
    if client_id not in clients:
        return redirect(url_for('index'))
    
    # Ügyfél-specifikus upload mappa létrehozása
    client_upload_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'clients', client_id)
    os.makedirs(client_upload_folder, exist_ok=True)
    
    return render_template('client.html', client_id=client_id)

# API végpont az AI ügynökséggel való kommunikációra
@app.route('/api/<client_id>/chat', methods=['POST'])
def chat(client_id):
    try:
        # Ügynökség betöltése
        agency = load_agency(client_id)
        if not agency:
            return jsonify({'error': f'Ügyfél nem található: {client_id}'}), 404
        
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
        logger.error(f"Hiba történt a chat során: {str(e)}")
        return jsonify({'error': f'Szerver hiba: {str(e)}'}), 500

# Képfeltöltés API végpont
@app.route('/api/<client_id>/upload-image', methods=['POST'])
def upload_image(client_id):
    # Ügyfél-specifikus upload mappa
    client_upload_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'clients', client_id)
    os.makedirs(client_upload_folder, exist_ok=True)
    
    if 'image' not in request.files:
        return jsonify({'error': 'Nincs kép csatolva'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'Nincs kiválasztott fájl'}), 400
    
    try:
        # Kép mentése ügyfél-specifikus mappába
        file_path = os.path.join(client_upload_folder, file.filename)
        file.save(file_path)
        
        # Kép feltöltése ImgBB-re
        with open(file_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
        imgbb_api_key = os.getenv("IMGBB_API_KEY")
        if not imgbb_api_key:
            return jsonify({'error': 'ImgBB API kulcs nincs beállítva'}), 500
        
        import requests
        payload = {
            'key': imgbb_api_key,
            'image': encoded_string,
            'name': file.filename
        }
        
        response = requests.post('https://api.imgbb.com/1/upload', payload)
        response_data = response.json()
        
        if not response_data.get('success', False):
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
@app.route('/api/<client_id>/send-webhook', methods=['POST'])
def send_webhook(client_id):
    try:
        data = request.json
        post_content = data.get('post_content', '')
        image_urls = data.get('image_urls', [])
        
        webhook_url = os.getenv("WEBHOOK_URL")
        if not webhook_url:
            return jsonify({'error': 'Webhook URL nincs beállítva'}), 500
        
        payload = {
            'client_id': client_id,
            'post_content': post_content,
            'image_urls': image_urls,
            'timestamp': datetime.now().isoformat()
        }
        
        import requests
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

# Statikus fájlok kiszolgálása
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

# Futtatás
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 