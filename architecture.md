# Architecture Documentation

## Overview
This project is a static site generated using **Astro**, styled with **Tailwind CSS**, and uses **Markdown/MDX** for content management. It is designed to be a fast, SEO-friendly blog and informational site for DataLakehouseHub.

## Tech Stack
- **Framework:** [Astro](https://astro.build/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Content:** Markdown / MDX (via Astro Content Collections)
- **Templating:** Astro Components (`.astro`)
- **Package Manager:** npm

## Project Structure

### `src/`
- **`pages/`**: Defines the routes of the application.
    - `index.astro`: The homepage.
    - `blog/`: Contains blog-related routes.
        - `index.astro`: The main blog gallery/listing page.
        - `[single].astro`: Dynamic route for individual blog posts.
- **`layouts/`**: Reusable layout components.
    - `Base.astro`: The main HTML shell (head, body, header, footer).
    - `PostSingle.astro`: Layout for a single blog post.
    - `partials/`: Smaller layout fragments (Header, Footer, Post card).
- **`components/`**: Reusable UI components (e.g., `TwSizeIndicator`, `Social`).
- **`content/`**: Source of truth for content (blog posts, homepage data).
    - Configured via `src/content/config.ts`.
- **`config/`**: Configuration files.
    - `config.json`: Site-wide settings (title, base URL, etc.).
    - `theme.json`: Design tokens (colors, fonts) used by Tailwind.
- **`lib/`**: Utility functions.
    - `utils/`: Helper functions for text processing, sorting, etc.
    - `contentParser.astro`: Helpers to fetch and process content.
- **`styles/`**: Global styles (SCSS).

## Key Design Patterns
- **Content Collections:** Data is structured in `src/content` and accessed via `astro:content` APIs (`getEntryBySlug`, `getCollection`).
- **Component-Based Architecture:** UI is broken down into small, reusable components (e.g., `Post.astro` for a blog card).
- **Configuration-Driven:** Much of the site's behavior and look is controlled by `src/config/config.json` and `src/config/theme.json`.
- **Tailwind Configuration:** Tailwind is configured to use values from `theme.json`, allowing for easy theming updates.

## Styling
- **Global Styles:** `src/styles/main.scss` imports Tailwind directives and custom base styles.
- **Utility Classes:** Most styling is done via Tailwind utility classes directly in components.
- **Typography:** Controlled via `tailwind.config.js` which maps theme settings to Tailwind utilities.

## Data Flow
1.  **Build Time:** Astro fetches data from `src/content` during the build process.
2.  **Static Generation:** Pages are generated as static HTML files.
3.  **Client-Side:** Minimal JavaScript is shipped to the client (mostly for interactive elements like the mobile menu or search).
