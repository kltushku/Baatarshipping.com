# Baatarshipping.com

A full-stack website for Baatar Shipping with a marketing front end and a lightweight quote API.

## Getting started

```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

## Deploy on Render (recommended)

You can publish the site for free (with sleep after inactivity) using Render. This keeps the API working.

### 1) Create accounts

- Create a free GitHub account: <https://github.com>
- Create a free Render account: <https://render.com>

### 2) Upload this project to GitHub

1. Create a new GitHub repository.
2. Upload the files in this project to that repository (GitHub lets you drag-and-drop files in the web UI).

### 3) Create a Render web service

1. In Render, click **New** → **Web Service**.
2. Connect your GitHub repository.
3. When asked for the **Environment**, choose **Docker**.
4. Leave **Build Command** empty.
5. Set **Start Command** to `node server.js`.
6. Click **Create Web Service**.

Render will deploy your site and give you a URL like:

```
https://baatarshipping.onrender.com
```

### 4) Connect your domain (optional)

If you own `baatarshipping.com`, you can connect it in Render:

1. Open your Render service.
2. Go to **Settings** → **Custom Domains**.
3. Add `baatarshipping.com` (and `www.baatarshipping.com` if desired).
4. Render will show the DNS records to add at your domain registrar.

After DNS updates finish, your site will load at your domain.

## Docker

Build and run with Docker:

```bash
docker build -t baatarshipping .
docker run -p 3000:3000 baatarshipping
```

Or use Docker Compose:

```bash
docker compose up --build
```

## API

- `GET /api/status` returns the service status.
- `POST /api/quote` accepts JSON payloads for `origin`, `destination`, `weight`, and `mode`.

Example request:

```bash
curl -X POST http://localhost:3000/api/quote \
  -H "Content-Type: application/json" \
  -d '{"origin":"UB","destination":"Rotterdam","weight":1200,"mode":"sea"}'
```
