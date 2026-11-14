# Contest Proctoring: participant guide

Static guide in `public/` plus a Vercel Function (`api/chat.js`) that proxies the Groq API.

Set `GROQ_API_KEY` in the Vercel project's environment variables. Edit the assistant by changing `SYSTEM_PROMPT` in `api/chat.js`.
