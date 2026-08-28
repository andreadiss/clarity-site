# Clarity website

Static bilingual website for Clarity, published at [claritylab.cloud](https://claritylab.cloud/).

## Structure

- `en/` and `it/`: public pages by language
- `css/`: shared and vertical-specific styles
- `js/`: shared interactions and animations
- `images/`: visual assets
- `favicon/`: browser and device icons

## Local preview

Run a static server from the repository root, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Publishing checklist

1. Run `node scripts/validate-site.mjs`.
2. Check keyboard navigation and the mobile menu.
3. Verify both language versions.
4. Confirm that hero videos have poster images and remain muted.
5. Update `sitemap.xml` when routes change.

Historical files under `old/` are retained for reference but excluded from search-engine crawling in `robots.txt`.
