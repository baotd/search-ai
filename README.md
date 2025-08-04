# Search AI Interface

A modern TypeScript + Tailwind CSS search interface with two main states:

## Features

### Initial State

- Blue-purple gradient greeting: "Hello, Le Vo"
- Centered search box with:
  - "Source" tag on the left
  - Image upload button (+) on the right
  - Send button (arrow icon)
  - Placeholder: "Search your data and ask questions"

### Conversation State

- Chat-like interface with speech bubbles
- User messages appear on the right (blue)
- Bot responses appear on the left (white with border)
- Footer input for follow-up questions
- Disclaimer message about AI accuracy

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run development server:**

   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:5173`

## Project Structure

```
search-ai/
├── src/
│   ├── main.ts          # Entry point
│   └── SearchApp.ts     # Main application class
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite build configuration
```

# Đứng từ thư mục frontend (search-ai)
gcloud run deploy search-ai-frontend \
  --source . \
  --region=<YOUR_REGION> \
  --allow-unauthenticated \
  --set-env-vars="VITE_API_BASE_URL=https://search-ai-api-339371990985.us-central1.run.app"
  