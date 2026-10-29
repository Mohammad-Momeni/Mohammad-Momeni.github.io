# Matin’s Workspace

A desktop-style personal portfolio for Mohammad Matin Momeni Ravandi, built for
GitHub Pages with Jekyll, plain CSS, and browser JavaScript. No npm installation
or JavaScript build step is needed.

## Local preview

With Python installed:

```sh
python scripts/preview.py
```

Open http://127.0.0.1:4173. This lightweight preview renders the profile layout;
it does not emulate Jekyll’s redirect or sitemap plugins.

For a production-equivalent build with Ruby and Bundler:

```sh
bundle install
bundle exec jekyll build
bundle exec jekyll serve
```

## Where to edit

- `_pages/about.md`: homepage content and app sections.
- `_pages/cv.md`: HTML CV; `files/cv.pdf`: original downloadable CV.
- `_pages/mapping.md`: split-and-merge mapping case study.
- `_layouts/profile.html`: shared document, metadata, navigation, and icon symbols.
- `assets/css/profile.css`: section layouts and illustrative visuals.
- `assets/css/desktop.css`: desktop windows, dock, and Off Duty gallery.
- `assets/css/fonts.css` and `assets/fonts/`: self-hosted fonts and OFL licenses.
- `assets/js/profile.js`: rover, filters, and signal diagrams.
- `assets/js/desktop.js`: windows, terminal commands, and easter eggs.
- `assets/js/off-duty.js`: media selection and clues.
- `assets/images/`: optimized site images and artwork.
- `images/social-profile.jpg`: social link preview.

The homepage uses a desktop interface. App windows reuse the page’s underlying
HTML sections. The terminal accepts predefined commands, with no system execution.
Without JavaScript, the underlying content remains readable. Animation honors
reduced-motion preferences. No analytics or contact-form service is configured.

## Artwork and licenses

See `ARTWORK.md` for image provenance and verified quote sources. Keep the font
license files in `assets/fonts/` and the repository’s `LICENSE` notice.

The stock Academic Pages demo pages, sample documents, theme assets, and legacy
build tools have been removed. Git history is preserved.
