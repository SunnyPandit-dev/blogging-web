# TechScribe — CS, AI/ML & Software Engineering Blog

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A clean, professional, fully static blogging website focused on **Computer Science, AI/ML, and Software Engineering** — built with zero frameworks, zero dependencies, and zero build tools. Just HTML, CSS, and vanilla JavaScript.

---

## 🖼 Screenshots

> _Add screenshots here after opening the site in your browser._
>
> Suggested screenshots:
> - Homepage (dark mode) showing the hero + card grid
> - Homepage with "AI/ML" filter active
> - A single post page
> - About page
> - Mobile view of the hamburger menu open

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 (Custom Properties, Grid, Flexbox) |
| Scripting | Vanilla JavaScript ES6+ |
| Fonts | Google Fonts — Inter + Fira Code |
| Icons | Inline SVG |
| Data | JS array in `posts-data.js` (simulates a CMS) |

**No frameworks. No npm. No build step.** Open `index.html` and it works.

---

## 📁 Folder Structure

```
BLOGGING-WEB/
│
├── index.html          ← Homepage: hero + blog grid + newsletter
├── about.html          ← About page: mission, author bios, contact
├── post.html           ← Single post page (dynamic via ?id= param)
│
├── css/
│   ├── style.css       ← Design system: tokens, all component styles
│   └── responsive.css  ← Responsive overrides (tablet 768px, mobile 480px)
│
├── js/
│   ├── posts-data.js   ← Blog post data array (our "database")
│   ├── render-posts.js ← Card rendering + category filter logic
│   └── main.js         ← Theme toggle, mobile nav, form validation,
│                          post page rendering
│
├── assets/
│   └── images/         ← Reserved for future image assets
│
├── .gitignore          ← Git ignore rules
└── README.md           ← This file
```

### Why This Structure?

- **Separation of concerns**: CSS in `css/`, JS in `js/`, data separate from rendering logic.
- **Load order in HTML**: `posts-data.js` → `render-posts.js` → `main.js`. Each script can rely on the previous one having already run.
- **Two CSS files**: `style.css` defines everything; `responsive.css` is purely override rules at breakpoints. Easier to read and debug.

---

## 🏃 How to Run Locally

### Option 1: VS Code Live Server (Recommended)

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code.
2. Right-click `index.html` → **"Open with Live Server"**.
3. The site opens at `http://127.0.0.1:5500` with auto-reload on save.

### Option 2: Python HTTP Server (no install required)

```bash
# Python 3 (built-in)
python -m http.server 5500

# Then open: http://localhost:5500
```

### Option 3: Node.js (if you have it installed)

```bash
npx serve .
# Then follow the URL it prints
```

### Option 4: Just open the file

Double-click `index.html`. Basic pages work fine. **Note:** The single post page (`post.html`) uses URL query parameters (`?id=1`), which requires a local server to work correctly in some browsers (Chrome works, Firefox may not for `file://` URLs).

---

## ✨ Features

- **6 full blog posts** on Neural Networks, Big-O Notation, Git, REST APIs, CSS Grid vs Flexbox, and ML Bias — each with formatted HTML content, code blocks, and tables.
- **Category filter** — client-side filtering with animated card re-renders (no page reload).
- **Dark / Light theme toggle** — preference saved to `localStorage`.
- **Mobile-first responsive** — CSS Grid `auto-fit/minmax` for the blog grid; hamburger nav for mobile.
- **Single post routing** — `post.html?id=N` reads the ID from `URLSearchParams` and renders the correct post.
- **Related posts** — 3 randomly selected posts shown at the bottom of each article.
- **Newsletter form** — client-side email validation with success/error UX feedback.
- **Skeleton loader** — shown briefly on post.html while JS renders the content.
- **Accessible** — semantic HTML5, ARIA attributes, `aria-live` regions, focus styles, reduced-motion support.
- **No external images** — all thumbnails use CSS gradients generated inline.

---

## 🎨 Design System

The design lives in CSS Custom Properties (`--variable-name`) defined in `:root` inside `style.css`. To retheme the entire site, change these values:

```css
:root {
  --clr-accent:       #6c63ff;  /* Primary brand/accent colour */
  --clr-bg-primary:   #0d0f17;  /* Page background (dark) */
  --clr-text-primary: #eef0f8;  /* Main text */
  /* ... and so on */
}
```

---

## 📦 Git Setup (for contributors)

The `.gitignore` file is already configured. To start version-controlling this project:

```bash
git init
git add .
git commit -m "Initial commit: TechScribe blog"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/techscribe.git
git branch -M main
git push -u origin main
```

---

## 🔮 Future Improvements

These are planned or suggested next steps — great practice projects for learning!

| Feature | Description | Skill Level |
|---------|-------------|-------------|
| **Markdown support** | Parse `.md` files as post content using [marked.js](https://marked.js.org/) | Intermediate |
| **localStorage comments** | Let users leave comments stored locally per post | Beginner |
| **Search bar** | Filter posts by keyword across title + content | Beginner |
| **Reading progress bar** | Show a % progress indicator as user scrolls a post | Beginner |
| **Pagination** | Show N posts per page, navigate between pages | Intermediate |
| **Tag system** | Multiple tags per post with tag-specific filtered views | Intermediate |
| **PWA / Offline support** | Service worker to cache posts for offline reading | Advanced |
| **CMS integration** | Connect to a headless CMS (Contentful, Sanity) via fetch | Advanced |
| **RSS feed** | Auto-generate an RSS XML from the posts data | Intermediate |
| **Print stylesheet** | Clean `@media print` CSS for printing articles | Beginner |

---

## 🤝 Contributing

1. Fork the repo.
2. Create a branch: `git checkout -b feature/your-idea`
3. Commit: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-idea`
5. Open a Pull Request.

---

## 📄 License

MIT — free to use, modify, and distribute. Attribution appreciated but not required.

---

> Built as a learning project demonstrating that you don't need a framework to build something professional. HTML, CSS, and JavaScript are incredibly powerful on their own.
