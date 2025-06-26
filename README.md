# PlacementPrep

PlacementPrep is a full-stack web application to help students prepare for campus placements. It features a React frontend and a Python Flask backend, now restructured for seamless deployment on Netlify using serverless functions.

## Features
- **Dashboard**: Track your application progress.
- **Company Insights**: Explore company details, roles, and interview processes.
- **AI Mock Interviewer**: Practice interviews with an AI assistant (Google Gemini API).
- **User Authentication**: Secure sign-up and sign-in.
- **Skill Mapper**: (Future Scope) Analyze your skills against job requirements.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Flask (Python, as a Netlify serverless function)
- **AI Integration**: Google Gemini API
- **Hosting**: Netlify

## Project Structure
```
WEB-Application/Next-Frontend/
├── netlify/
│   └── functions/
│       └── api/
│           ├── api.py              # Flask backend as a serverless function
│           ├── requirements.txt    # Python dependencies for the function
│           ├── users.json          # User data
│           ├── top-paying_roles_first.csv
│           ├── top-paying_roles_first1.csv
│           └── Skill-Matching.csv
├── src/                            # React frontend source code
├── package.json
├── netlify.toml                    # Netlify build and function config
└── ...
```

## Local Development

### 1. Install Frontend Dependencies
```sh
cd WEB-Application/Next-Frontend
npm install
```

### 2. Install Netlify CLI (if not already installed)
```sh
npm install -g netlify-cli
```

### 3. Run Locally (Frontend + Serverless Backend)
```sh
netlify dev
```
This will serve your React app and proxy API requests to the Flask backend function.

## Deployment on Netlify

1. **Push your code to GitHub.**
2. **Go to [Netlify](https://app.netlify.com/) and create a new site from Git.**
3. **Set the build settings:**
    - **Base directory:** `WEB-Application/Next-Frontend`
    - **Build command:** `npm run build`
    - **Publish directory:** `dist`
    - **Functions directory:** `netlify/functions`
4. **Add Environment Variable:**
    - Go to Site settings → Build & deploy → Environment
    - Add `GOOGLE_API_KEY` with your Gemini API key
5. **Deploy!**

## API Endpoints
All API endpoints are available under `/api/` (e.g., `/api/companies`, `/api/signup`, etc.).

## Notes
- The backend runs as a serverless function. File writes (like user registration) are ephemeral and will not persist between deployments or function cold starts.
- For production, consider using a persistent database or Netlify add-ons.

## License
MIT
