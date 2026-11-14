# Contest Proctoring: participant guide

Static guide (`public/`) plus a Pages Function (`functions/api/chat.js`) that proxies the Groq API.

## Run locally
    cp .dev.vars.example .dev.vars   # put your Groq key in .dev.vars
    npx wrangler pages dev

## Deploy
    npx wrangler pages project create contest-proctoring-guide --production-branch main
    npx wrangler pages deploy
    npx wrangler pages secret put GROQ_API_KEY --project-name contest-proctoring-guide

Redeploy once after setting the secret if the assistant says it is not configured.

## Edit the assistant
Change `SYSTEM_PROMPT` in `functions/api/chat.js`.
