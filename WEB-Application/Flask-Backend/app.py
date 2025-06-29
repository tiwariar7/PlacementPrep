from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import csv
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API from environment variables
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    raise ValueError("No GOOGLE_API_KEY set in environment variables")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GOOGLE_API_KEY}"

# --- File Paths --- (now from environment variables)
USERS_FILE = os.getenv('USERS_FILE', 'data/users.json')
TOP_PAYING_ROLES_FILE = os.getenv('TOP_PAYING_ROLES_FILE', 'data/top-paying_roles_first1.csv')
COMPANIES_FILE = os.getenv('COMPANIES_FILE', 'data/companies.json')
SKILLS_FILE = os.getenv('SKILLS_FILE', 'data/skills.json')

def load_companies_and_skills():
    try:
        with open(COMPANIES_FILE, encoding='utf-8') as f:
            companies = json.load(f)

        with open(SKILLS_FILE, encoding='utf-8') as f:
            skills = json.load(f)

        return companies, skills
    except FileNotFoundError as e:
        print(f"Error loading data files: {e}")
        return [], []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON files: {e}")
        return [], []

companies_cache, skills_cache = load_companies_and_skills()

@app.route('/api/companies', methods=['GET'])
def get_companies():
    return jsonify(companies_cache)

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
    
    try:
        # Load users
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, 'r', encoding='utf-8') as f:
                users = json.load(f)
        else:
            users = []
        
        # Check for duplicate email
        if any(u['email'] == data['email'] for u in users):
            return jsonify({'error': 'Email already registered'}), 409
        
        users.append(data)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
        
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=2)
            
        return jsonify({'message': 'Account created successfully!'}), 201
    except Exception as e:
        print(f"Error in signup: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400
    
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    try:
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, 'r', encoding='utf-8') as f:
                users = json.load(f)
        else:
            users = []
            
        user = next((u for u in users if u['email'] == email and u['password'] == password), None)
        if user:
            # Don't return password
            user_info = {k: v for k, v in user.items() if k != 'password'}
            return jsonify({'message': 'Sign in successful', 'user': user_info}), 200
        return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        print(f"Error in signin: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/top-paying-roles', methods=['GET'])
def get_top_paying_roles():
    try:
        roles = []
        if os.path.exists(TOP_PAYING_ROLES_FILE):
            with open(TOP_PAYING_ROLES_FILE, encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    roles.append(row)
        return jsonify(roles)
    except Exception as e:
        print(f"Error loading top paying roles: {e}")
        return jsonify({'error': 'Failed to load data'}), 500

def get_ai_response(company=None, role=None, round_type="Technical", num_questions=5):
    try:
        prompt = f"""
You are an expert interview question generator for campus placements.

Context:
- Company: {company or 'Any'}
- Role: {role or 'Any'}
- Interview Round: {round_type}
- Number of Questions: {num_questions}

Task:
Generate {num_questions} high-quality, relevant interview questions for the {round_type} round. The questions should be tailored to the company and/or role if provided. Return the questions as a numbered list.Present one question at a time. Provide the next question only after the previous one is answered. After all questions have been answered, display the final result showing how many answers were correct.
"""
        data = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        headers = {'Content-Type': 'application/json'}
        response = requests.post(GEMINI_API_URL, headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                if 'content' in result['candidates'][0]:
                    parts = result['candidates'][0]['content'].get('parts', [])
                    if parts:
                        return parts[0].get('text', 'No response generated')
            return "I apologize, but I couldn't generate a response. Please try rephrasing your question."
        else:
            print(f"Error from Gemini API: {response.status_code} - {response.text}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again later."
    except Exception as e:
        print(f"Error in get_ai_response: {str(e)}")
        return "I encountered an error while processing your request. Please try again."

@app.route('/ask_assistant', methods=['POST'])
def ask_assistant():
    try:
        data = request.get_json()
        company = data.get('company')
        role = data.get('role')
        round_type = data.get('round_type', 'Technical')
        num_questions = int(data.get('num_questions', 5))
        
        response = get_ai_response(company, role, round_type, num_questions)
        return jsonify({
            "response": response,
            "status": "success"
        })
    except Exception as e:
        print(f"Error in ask_assistant: {str(e)}")
        return jsonify({
            "error": "An error occurred while processing your request",
            "status": "error"
        }), 500

@app.route('/mock_interview', methods=['POST'])
def mock_interview():
    try:
        data = request.get_json()
        company = data.get('company')
        role = data.get('role')
        round_type = data.get('round_type', 'Technical')
        num_questions = int(data.get('num_questions', 5))
        previous_answers = data.get('previous_answers', [])

        # Build the prompt
        qa_history = ""
        for idx, qa in enumerate(previous_answers):
            qa_history += f"Q{idx+1}: {qa['question']}\nA{idx+1}: {qa['answer']}\n"
            
        if len(previous_answers) < num_questions:
            prompt = f"""
You are an expert interview question generator for campus placements.

Context:
- Company: {company or 'Any'}
- Role: {role or 'Any'}
- Interview Round: {round_type}
- Number of Questions: {num_questions}

Task:
Present one question at a time. Provide the next question only after the previous one is answered. After all questions have been answered, display the final result showing how many answers were correct.

Here is the interview so far:
{qa_history}

Please provide the next question only. If all questions are answered, provide the final result as a JSON object: {{"finished": true, "correct": <number_correct>, "total": <total_questions>}}."
"""
        else:
            prompt = f"""
You are an expert interview evaluator for campus placements.

Context:
- Company: {company or 'Any'}
- Role: {role or 'Any'}
- Interview Round: {round_type}
- Number of Questions: {num_questions}

Task:
All questions have been answered. Here is the interview:
{qa_history}

Count how many answers are correct. Return a JSON object: {{"finished": true, "correct": <number_correct>, "total": <total_questions>}}."
"""
        data_gemini = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        headers = {'Content-Type': 'application/json'}
        response = requests.post(GEMINI_API_URL, headers=headers, json=data_gemini)
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                if 'content' in result['candidates'][0]:
                    parts = result['candidates'][0]['content'].get('parts', [])
                    if parts:
                        text = parts[0].get('text', '')
                        import json as pyjson
                        # Try to parse result JSON if finished
                        if 'finished' in text:
                            try:
                                json_start = text.find('{')
                                json_end = text.rfind('}')+1
                                result_json = pyjson.loads(text[json_start:json_end])
                                return jsonify(result_json)
                            except Exception:
                                return jsonify({'finished': True, 'result_raw': text})
                        # Otherwise, return the next question
                        return jsonify({'question': text, 'finished': False})
            return jsonify({'error': "Couldn't generate a response."}), 500
        else:
            print(f"Error from Gemini API: {response.status_code} - {response.text}")
            return jsonify({'error': 'AI service error'}), 500
    except Exception as e:
        print(f"Error in mock_interview: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development')