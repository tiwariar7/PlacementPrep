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

## Live Demo
Experience the application: [https://placementpreprcoem.netlify.app/](https://placementpreprcoem.netlify.app/)

> Note: The user authorization backend is currently non-functional due to technical constraints. Other features remain accessible.



## API Endpoints
All API endpoints are available under `/api/` (e.g., `/api/companies`, `/api/signup`, etc.).

## Notes
- The backend runs as a serverless function. File writes (like user registration) are ephemeral and will not persist between deployments or function cold starts.
- For production, consider using a persistent database or Netlify add-ons.
- User authentication features are currently non-functional due to technical limitations.

## License
MIT
