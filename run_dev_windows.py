"""
Fejlesztői szerver indítása Windows környezetben
Használat: python run_dev_windows.py
"""

import os
from waitress import serve
from web.app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Szerver indítása a http://localhost:{port} címen...")
    serve(app, host="0.0.0.0", port=port) 