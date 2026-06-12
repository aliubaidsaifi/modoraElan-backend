import asyncHandler from "express-async-handler";

const BASE = "https://www.googleapis.com/blogger/v3/blogs";

// GET /api/blog  -> list posts from Blogger
export const getPosts = asyncHandler(async (req, res) => {
  const { BLOGGER_BLOG_ID, BLOGGER_API_KEY } = process.env;
  const url = `${BASE}/${BLOGGER_BLOG_ID}/posts?key=${BLOGGER_API_KEY}&maxResults=20&fetchImages=true`;
  const r = await fetch(url);
  if (!r.ok) {
    res.status(502);
    throw new Error("Failed to fetch from Blogger");
  }
  const data = await r.json();
  const posts = (data.items || []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.url.split("/").pop().replace(".html", ""),
    excerpt: p.content?.replace(/<[^>]+>/g, "").slice(0, 160) + "...",
    image: p.images?.[0]?.url || "",
    publishedAt: p.published,
    url: p.url,
  }));
  res.json({ posts });
});

// GET /api/blog/:id  -> single post by Blogger post id
export const getPost = asyncHandler(async (req, res) => {
  const { BLOGGER_BLOG_ID, BLOGGER_API_KEY } = process.env;
  const url = `${BASE}/${BLOGGER_BLOG_ID}/posts/${req.params.id}?key=${BLOGGER_API_KEY}`;
  const r = await fetch(url);
  if (!r.ok) {
    res.status(404);
    throw new Error("Post not found");
  }
  const p = await r.json();
  res.json({
    post: {
      id: p.id,
      title: p.title,
      content: p.content, // full HTML from Blogger
      publishedAt: p.published,
    },
  });
});
