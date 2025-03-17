import json
import os
from functools import wraps
from flask import request, jsonify, session

class AuthHandler:
    def __init__(self):
        self.users_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'users.json')
        self._load_users()

    def _load_users(self):
        """Betölti a felhasználókat a JSON fájlból"""
        try:
            with open(self.users_file, 'r', encoding='utf-8') as f:
                self.users = json.load(f)['users']
        except FileNotFoundError:
            self.users = []

    def authenticate(self, username, password):
        """Felhasználó hitelesítése"""
        for user in self.users:
            if user['username'] == username and user['password'] == password:
                return True, user
        return False, None

    def login_required(self, f):
        """Dekorátor a védett útvonalakhoz"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not session.get('logged_in'):
                return jsonify({'error': 'Bejelentkezés szükséges'}), 401
            return f(*args, **kwargs)
        return decorated_function

    def add_user(self, username, password, role='client', company=None):
        """Új felhasználó hozzáadása"""
        from datetime import datetime
        new_user = {
            'username': username,
            'password': password,
            'role': role,
            'company': company,
            'created_at': datetime.now().strftime('%Y-%m-%d')
        }
        
        self.users.append(new_user)
        self._save_users()
        return True

    def _save_users(self):
        """Felhasználók mentése a JSON fájlba"""
        os.makedirs(os.path.dirname(self.users_file), exist_ok=True)
        with open(self.users_file, 'w', encoding='utf-8') as f:
            json.dump({'users': self.users}, f, indent=2, ensure_ascii=False)

# Példa használatra:
# auth_handler = AuthHandler()
# success, user = auth_handler.authenticate('veyron hungary', 'veyron123') 