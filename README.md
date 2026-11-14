# Contest Proctoring: participant guide

Static guide in `public/` plus a Vercel Edge Function (`api/chat.js`) that proxies the Groq API.

## Run locally
    echo "GROQ_API_KEY=your-key" > .env.local
    npx vercel dev

## Deploy
Import the repo in Vercel (framework preset: Other), then add `GROQ_API_KEY` under Settings > Environment Variables and redeploy.

## Edit the assistant
Change `SYSTEM_PROMPT` in `api/chat.js`.
