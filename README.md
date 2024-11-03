# Voxify

Voxify is a web application that transforms voice memos into structured content using AI. It supports three output formats:
- Task Lists (Free): Converts audio into prioritized tasks with context
- Strategic Roadmaps (Pro): Generates comprehensive project roadmaps
- Process Documentation (Pro): Creates detailed process guides

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/CHARL3X/voicepm.git
cd voicepm
```

2. Set up Python environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Run the development server:
```bash
# IMPORTANT: Always run from the backend directory
cd backend
uvicorn main:app --reload
```

The application will be available at http://localhost:8000

## Render.com Deployment

1. Fork the repository to your GitHub account

2. Create a new Web Service on Render.com:
   - Connect your GitHub repository
   - Select the Python environment
   - The build command and start command are already configured in render.yaml

3. Configure environment variables in Render.com dashboard:
   - OPENAI_API_KEY: Your OpenAI API key
   - OPENROUTER_API_KEY: Your OpenRouter API key
   - CORS_ORIGINS: Configure allowed origins

4. Deploy:
   - Render will automatically deploy when you push to the main branch
   - The deployment typically takes 2-3 minutes

## Environment Variables

- `OPENAI_API_KEY`: Required for Whisper transcription
- `OPENROUTER_API_KEY`: Required for Claude analysis
- `CORS_ORIGINS`: JSON array of allowed origins

### Demo Mode
Set `OPENAI_API_KEY=demo_mode` to run in demo mode, which returns mock data instead of making API calls.

## Project Structure

```
voicepm/
├── backend/
│   ├── models/         # Data models
│   ├── prompts/        # AI system prompts
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic
│   └── utils/          # Helper functions
├── static/
│   ├── css/           # Stylesheets
│   ├── js/            # Frontend scripts
│   └── images/        # Static assets
└── public/            # Wix integration files
```

## API Endpoints

- `GET /health`: Server status and mode
- `POST /process-audio`: Convert to task list
- `POST /process-audio/roadmap`: Generate roadmap
- `POST /process-audio/process`: Create process doc

## Contributing

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "Description of changes"
```

3. Push to GitHub:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub

## License

MIT License - see LICENSE file for details
