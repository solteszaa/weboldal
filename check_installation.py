import sys
import pkg_resources
import os
import importlib

def check_python_version():
    print(f"Python verzió: {sys.version}")
    if sys.version_info.major < 3 or (sys.version_info.major == 3 and sys.version_info.minor < 8):
        print("FIGYELMEZTETÉS: Az agency-swarm Python 3.8 vagy újabb verziót igényel!")
    else:
        print("Python verzió megfelelő.")

def check_packages():
    required_packages = [
        "agency-swarm",
        "flask",
        "flask-cors",
        "gunicorn",
        "openai",
        "python-dotenv",
        "pydantic",
        "requests"
    ]
    
    print("\nCsomagok ellenőrzése:")
    all_ok = True
    
    for package in required_packages:
        try:
            installed = pkg_resources.get_distribution(package)
            print(f"✓ {package} - {installed.version}")
            
            # Speciális ellenőrzés az agency-swarm-hoz
            if package == "agency-swarm":
                try:
                    importlib.import_module("agency_swarm")
                    print("  ✓ Az 'agency_swarm' modul importálható.")
                except ImportError as e:
                    print(f"  ✗ HIBA: Az 'agency_swarm' modul nem importálható: {e}")
                    all_ok = False
        except pkg_resources.DistributionNotFound:
            print(f"✗ {package} nincs telepítve!")
            all_ok = False
    
    return all_ok

def check_file_paths():
    print("\nKönyvtárstruktúra ellenőrzése:")
    paths_to_check = [
        "clients/veyron_hungary/agency.py",
        "clients/veyron_hungary/agency_manifesto.md",
        "clients/veyron_hungary/ceo_agent/ceo_agent.py",
        "clients/veyron_hungary/content_agent/content_agent.py",
        "clients/veyron_hungary/media_agent/media_agent.py",
        "web/app.py",
        "Procfile",
        "render.yaml",
        "requirements.txt"
    ]
    
    all_exist = True
    for path in paths_to_check:
        exists = os.path.exists(path)
        if exists:
            print(f"✓ {path} - megtalálható")
        else:
            print(f"✗ {path} - HIÁNYZIK!")
            all_exist = False
    
    return all_exist

if __name__ == "__main__":
    print("=== Veyron Hungary AI Agent Telepítés Ellenőrzése ===\n")
    
    check_python_version()
    packages_ok = check_packages()
    files_ok = check_file_paths()
    
    print("\n=== Összesítés ===")
    if packages_ok and files_ok:
        print("✓ Minden rendben! A telepítés megfelelőnek tűnik.")
    else:
        print("✗ Problémák találhatók a telepítésben. Kérlek javítsd a fenti hibákat!")
        
    print("\nHa agency_swarm importálási hibát látsz, telepítsd újra a csomagot:")
    print("pip install --force-reinstall agency-swarm==0.1.1") 