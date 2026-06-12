# Modora Backend (REST API)

Express + MongoDB + Cloudinary API. Serves both the web frontend (Next.js)
and your future React Native app from one place.

## Endpoints
| Method | Route                  | Auth   | Purpose                    |
|--------|------------------------|--------|----------------------------|
| GET    | /api/health            | -      | uptime check               |
| GET    | /api/products          | -      | list (filters: category, featured, search) |
| GET    | /api/products/:slug    | -      | single product             |
| POST   | /api/products          | admin  | create                     |
| PATCH  | /api/products/:id      | admin  | update                     |
| DELETE | /api/products/:id      | admin  | delete                     |
| GET    | /api/categories        | -      | list                       |
| POST   | /api/categories        | admin  | create (supports `parent`) |
| POST   | /api/auth/register     | -      | register                   |
| POST   | /api/auth/login        | -      | login -> JWT               |
| GET    | /api/auth/me           | user   | current user               |
| POST   | /api/upload            | admin  | upload image -> Cloudinary |
| GET    | /api/blog              | -      | posts from Blogger         |
| GET    | /api/blog/:id          | -      | single Blogger post        |

## Setup
```bash
npm install
cp .env.example .env        # fill in all values
npm run seed                # creates Women>Abayas + admin + sample products
npm run dev                 # http://localhost:5000
npm test                    # run tests
```

## Blog (Blogger as free CMS)
1. Create a blog on blogger.com
2. Blog ID is in the dashboard URL (blogID=XXXXXXXX)
3. Google Cloud Console -> enable "Blogger API v3" -> create an API key
4. Put BLOGGER_BLOG_ID + BLOGGER_API_KEY in .env
You write posts in Blogger; the frontend shows them. No blog DB needed.

## Deploy (Render — free, commercial OK)
- New Web Service -> connect this repo
- Build: `npm install`  | Start: `npm start`
- Add all .env vars in Render dashboard
- Free tier sleeps after 15 min idle -> add a cron-job.org ping to /api/health every 10 min
