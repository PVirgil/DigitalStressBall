# Neural Stress Core

A responsive, high-tech digital stress ball built with Three.js.

## Preview locally

Because JavaScript modules must be served over HTTP, use either:

```bash
npx serve .
```

or:

```bash
python3 -m http.server 8000
```

Then open the URL printed in the terminal.

## Push to GitHub

Create an empty GitHub repository, open a terminal inside this folder, and run:

```bash
git init
git add .
git commit -m "Launch Neural Stress Core"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Deploy through Netlify

1. Sign in to Netlify.
2. Select **Add new project** → **Import an existing project**.
3. Connect GitHub and choose this repository.
4. Netlify reads `netlify.toml` automatically.
5. Leave the build command empty. The publish directory is `.`.
6. Select **Deploy**.

Every future push to `main` triggers a new deployment.

## Optional drag-and-drop deployment

You can also drag the entire project folder into Netlify's manual deployment area. GitHub deployment is preferable because later pushes deploy automatically.

## Controls

- Press and drag the core to compress it.
- Hold to increase pressure.
- Switch between Ion, Void, and Solar themes.
- Toggle generated ambient sound.
- Supported mobile devices vibrate on release.

## Architecture

This version intentionally has no framework or build dependency. Three.js loads as an ES module from jsDelivr, while the site itself is plain HTML, CSS, and JavaScript.
