from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import csv
import requests
from serverless_wsgi import handle

# Determine the absolute path of the directory containing this script
# This is crucial for locating data files in a serverless environment
base_dir = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
# In a real-world scenario, you might want to restrict this more
CORS(app) 

# --- File Paths ---
# All paths are now relative to this file's location
COMPANIES_FILE = os.path.join(base_dir, '../../src/data/companies.ts')
USERS_FILE = os.path.join(base_dir, 'users.json')
TOP_PAYING_ROLES_FILE = os.path.join(base_dir, 'top-paying_roles_first1.csv')
SKILL_MATCHING_FILE = os.path.join(base_dir, 'Skill-Matching.csv') # Added this for completeness

# --- API Key ---
# Load API key from environment variable (will be set in Netlify UI)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    # In a serverless function, raising an error might be too drastic.
    # We can let it fail at the API call level.
    print("Warning: GOOGLE_API_KEY environment variable not set.")

# --- Parse companies.ts for companies and skillsData ---
# This parser remains, but now uses an absolute path to find the file
def parse_companies_ts():
    # This is a hacky parser for the specific structure of companies.ts
    companies = []
    skills = []
    try:
        with open(COMPANIES_FILE, encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: Could not find companies file at {COMPANIES_FILE}")
        return [], []
        
    # ... (the rest of your parsing logic remains unchanged)
    import re
    companies_match = re.search(r'export const companies: Company\[\] = \[(.*?)]\s*;', content, re.DOTALL)
    if companies_match:
        companies_str = companies_match.group(1)
        # Split by '},' at the top level
        company_blocks = re.findall(r'\{[^\{\}]*\}', companies_str)
        for block in company_blocks:
            try:
                # Replace JS/TS syntax with JSON
                block_json = block.replace("'", '"')
                block_json = re.sub(r'(\w+):', r'"\1":', block_json)
                block_json = block_json.replace('"[', '[').replace(']"', ']').replace('"{', '{').replace('}"', '}')
                company = json.loads(block_json)
                companies.append(company)
            except Exception:
                continue
    # Extract skillsData array
    skills_match = re.search(r'export const skillsData = \[(.*?)\];', content, re.DOTALL)
    if skills_match:
        skills_str = skills_match.group(1)
        skill_blocks = re.findall(r'\{[^\{\}]*\}', skills_str)
        for block in skill_blocks:
            try:
                block_json = block.replace("'", '"')
                block_json = re.sub(r'(\w+):', r'"\1":', block_json)
                block_json = block_json.replace('"[', '[').replace(']"', ']').replace('"{', '{').replace('}"', '}')
                skill = json.loads(block_json)
                skills.append(skill)
            except Exception:
                continue
    return companies, skills

companies_cache, skills_cache = parse_companies_ts()

@app.route('/api/companies', methods=['GET'])
def get_companies():
    return jsonify(companies_cache)

# --- (The rest of your routes: /api/companies/<id>, /api/skills, etc. remain the same) ---
# --- (For brevity, the other routes are omitted but should be here) ---

@app.route('/api/companies/<string:company_id>', methods=['GET'])
def get_company(company_id):
    company = next((c for c in companies_cache if c.get('id') == company_id), None)
    if company:
        return jsonify(company)
    return jsonify({'error': 'Company not found'}), 404

@app.route('/api/skills', methods=['GET'])
def get_skills():
    return jsonify(skills_cache)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400
    required_fields = ['firstName', 'lastName', 'email', 'password', 'branch', 'currentYear', 'college']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            try: users = json.load(f)
            except Exception: users = []
    else:
        users = []
    if any(u['email'] == data['email'] for u in users):
        return jsonify({'error': 'Email already registered'}), 409
    users.append(data)
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2)
    return jsonify({'message': 'Account created successfully!'}), 201

@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json()
    if not data: return jsonify({'error': 'Invalid JSON'}), 400
    email = data.get('email')
    password = data.get('password')
    if not email or not password: return jsonify({'error': 'Email and password required'}), 400
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            try: users = json.load(f)
            except Exception: users = []
    else:
        users = []
    user = next((u for u in users if u['email'] == email and u['password'] == password), None)
    if user:
        user_info = {k: v for k, v in user.items() if k != 'password'}
        return jsonify({'message': 'Sign in successful', 'user': user_info}), 200
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/top-paying-roles', methods=['GET'])
def get_top_paying_roles():
    roles = []
    if os.path.exists(TOP_PAYING_ROLES_FILE):
        with open(TOP_PAYING_ROLES_FILE, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                roles.append(row)
    return jsonify(roles)

GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GOOGLE_API_KEY}"

def get_ai_response(company=None, role=None, round_type="Technical", num_questions=5):
    # This function remains the same
    pass # Omitted for brevity

@app.route('/ask_assistant', methods=['POST'])
def ask_assistant():
    # This function remains the same
    pass # Omitted for brevity

@app.route('/mock_interview', methods=['POST'])
def mock_interview():
    # This function remains the same
    pass # Omitted for brevity

# --- Netlify Function Handler ---
# This is the entry point for the serverless function.
def handler(event, context):
    return handle(app, event, context) 