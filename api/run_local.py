#!/usr/bin/env python3
"""
Script to run the ULIMI AI Advisor API locally for development
"""

import os
import sys
import subprocess

def install_dependencies():
    """Install required Python dependencies"""
    print("Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Dependencies installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error installing dependencies: {e}")
        sys.exit(1)

def run_api():
    """Run the FastAPI application"""
    print("Starting ULIMI AI Advisor API...")
    print("API will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    
    try:
        # Use uvicorn to run the app
        subprocess.check_call([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--reload"
        ])
    except subprocess.CalledProcessError as e:
        print(f"Error running API: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nAPI server stopped.")

def main():
    """Main function"""
    print("ULIMI AI Advisor - Local Development Server")
    print("=" * 45)
    
    # Check if we're in the right directory
    if not os.path.exists("main.py"):
        print("Error: main.py not found. Please run this script from the api directory.")
        sys.exit(1)
    
    # Install dependencies if needed
    if not os.path.exists("venv") and "--no-install" not in sys.argv:
        install_dependencies()
    
    # Run the API
    run_api()

if __name__ == "__main__":
    main()