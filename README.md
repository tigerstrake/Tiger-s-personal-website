# Tiger Strake — personal website

Next.js portfolio exported as a static site. Project content lives in `src/data/projects.ts`; Build Log content lives in `src/data/buildLog.ts`.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To test the same static files used in production:

```bash
npm run build
node serve.mjs
```

The production build is written to the tracked `out/` directory.

## Deployment

Cloudflare Pages does not build from this repository directly. The deployment has two GitHub remotes:

- `origin` — `tigerstrake/v2personal-website`, the primary repository
- `old` — `tigerstrake/Tiger-s-personal-website`, the legacy repository watched by Cloudflare Pages

Cloudflare serves the checked-in `out/` directory from the legacy repository and has no build command configured. A source-only push therefore does not update the live site.

After verifying a revision:

```bash
npm run build
git add <changed source files> out/
git commit -m "Describe the revision"
git push origin main
git push old main --force
```

The final force-push is intentional: it makes the Cloudflare-connected legacy repository match the verified `main` branch. Run it only after the primary push succeeds, and confirm both remotes point at the same commit afterward:

```bash
git ls-remote origin refs/heads/main
git ls-remote old refs/heads/main
```

Then check [tigerstrake.com](https://tigerstrake.com) after Cloudflare finishes the deployment.
