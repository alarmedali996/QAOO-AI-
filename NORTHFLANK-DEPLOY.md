# QAOO AI — Northflank deployment

This repository is a Docker-based LibreChat deployment branded as QAOO AI.

## Create the resources

1. Create a Northflank project using the Developer Sandbox plan if available.
2. Add one managed MongoDB database/add-on to the project.
3. Create one service from this GitHub repository:
   - Repository: `alarmedali996/QAOO-AI-`
   - Branch: `main`
   - Build type: Dockerfile
   - Dockerfile path: `/Dockerfile`
   - Exposed/public port: `3080`
   - Application listen host: `0.0.0.0`

## Service environment variables

Set these in the service's secret/environment settings (not in Git):

- `HOST=0.0.0.0`
- `PORT=3080`
- `APP_TITLE=QAOO AI`
- `MONGO_URI`: use the private/internal MongoDB connection string supplied by the MongoDB add-on. Do not use a public database endpoint if a private one is available.
- `DOMAIN_CLIENT`: set to the final public HTTPS URL assigned to this service.
- `DOMAIN_SERVER`: set to the same final public HTTPS URL.
- `ALLOW_REGISTRATION=true`: only if you want public self-registration. Otherwise set it to `false`.

Do not commit database credentials, API keys, JWT secrets, or other private values to GitHub. Add them only through Northflank's secret/environment variable interface.

## AI provider

The web app and database can start without an AI provider key, but chat generation will not work until a supported provider is configured. Add the provider key as a secret environment variable (for example, `OPENAI_API_KEY`) only if you have a valid key and permission to use that provider. Provider usage may cost money.

## Important notes

- Keep the MongoDB add-on and app service in the same project so the app can use the private connection string.
- This project uses a Docker build that compiles a large frontend. A small free build/runtime quota may be insufficient; if the build fails for memory or resource limits, do not select a paid plan without reviewing the cost with a parent/guardian.
- The free Sandbox is intended for testing and exploration, not production. Check current Northflank limits and billing before creating resources.
- After the first deployment, confirm the service health/logs and test registration and chat before sharing the URL.
