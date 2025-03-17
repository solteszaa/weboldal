from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from auth.auth_handler import AuthHandler

# Környezeti változók betöltése
load_dotenv()

app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')
            
# Session titkosítás beállítása
app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_change_in_production')

CORS(app)

# Auth handler példányosítása
auth_handler = AuthHandler()

# Ügynökök URL-jei környezeti változókból
CEO_AGENT_URL = os.environ.get('CEO_AGENT_URL', 'http://localhost:5000/api/message')
CONTENT_AGENT_URL = os.environ.get('CONTENT_AGENT_URL', 'http://localhost:5001/api/message')
MEDIA_AGENT_URL = os.environ.get('MEDIA_AGENT_URL', 'http://localhost:5002/api/message')

@app.route('/')
def index():
    """Főoldal megjelenítése"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Bejelentkezési oldal"""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        success, user = auth_handler.authenticate(username, password)
        if success:
            session['logged_in'] = True
            session['user'] = user
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error='Hibás felhasználónév vagy jelszó')
            
    return render_template('login.html')

@app.route('/logout')
def logout():
    """Kijelentkezés"""
    session.clear()
    return redirect(url_for('login'))

@app.route('/api/message', methods=['POST'])
@auth_handler.login_required
def handle_message():
    """
    Üzenet kezelése és továbbítása a megfelelő ügynöknek
    """
    data = request.json
    if not data or 'message' not in data:
        return jsonify({'error': 'Hiányzó üzenet'}), 400

    # Továbbítás a CEO ügynöknek
    try:
        response = requests.post(CEO_AGENT_URL, json=data)
        return response.json()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Ellenőrzi, hogy minden ügynök működik-e
    """
    status = {
        'coordinator': 'ok',
        'agents': {}
    }
    
    # CEO ügynök ellenőrzése
    try:
        ceo_response = requests.get(CEO_AGENT_URL.replace('/api/message', '/api/health'))
        status['agents']['ceo'] = 'ok' if ceo_response.status_code == 200 else 'error'
    except:
        status['agents']['ceo'] = 'offline'
    
    # Content ügynök ellenőrzése
    try:
        content_response = requests.get(CONTENT_AGENT_URL.replace('/api/message', '/api/health'))
        status['agents']['content'] = 'ok' if content_response.status_code == 200 else 'error'
    except:
        status['agents']['content'] = 'offline'
    
    # Media ügynök ellenőrzése
    try:
        media_response = requests.get(MEDIA_AGENT_URL.replace('/api/message', '/api/health'))
        status['agents']['media'] = 'ok' if media_response.status_code == 200 else 'error'
    except:
        status['agents']['media'] = 'offline'
    
    return jsonify(status)

# Futtatás
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 