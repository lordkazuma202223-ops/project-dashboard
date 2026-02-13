---
name: fullstack-web-builder
description: End-to-end web builder that creates production-level websites from a simple description. Orchestrates project scaffolding with professional file structure, creates distinctive production-grade code with bold aesthetics using frontend-design principles, initializes git version control, optionally creates GitHub repositories, and deploys to Vercel. Use when user asks to "create a website about X", "build me a production-level website for Y", "make a production website", or any request to build and deploy a complete website.
---

# Fullstack Web Builder

Orchestrates complete workflow from idea to deployed website.

## When to Use

Use this skill when user says things like:
- "Create a website about X"
- "Build me a production-level website for Y"
- "I want to deploy a website about Z"
- "Make a full website and put it online"

## Prerequisites

Before starting, verify these are available:

```bash
node --version        # Node.js (required)
git --version         # Git (required)
```

**Optional but recommended:**
- `bun` - Faster than npm: `winget install Oven-Sh.Bun`
- `gh` - GitHub CLI for repo creation: `winget install GitHub.cli`

## Workflow

### 1. Understand Requirements

Ask for clarification if needed:
- What is the website about?
- Key features needed?
- Any specific design preferences?
- Deployment target (default: Vercel)?
- Do you want a GitHub repository?

### 2. Validate Project Name

Before scaffolding, validate the project name:

**Naming rules:**
- Lowercase only
- Hyphens only (no spaces, underscores, or special chars)
- Start with a letter
- Length: 3-30 characters

**Examples:**
- ✅ `space-explorer`, `my-portfolio`, `tech-blog`
- ❌ `My Project`, `test_app`, `cool-site!`

**Validate with user:** "Project name should be lowercase with hyphens only. For example: 'space-explorer'. What name do you want?"

### 3. Scaffold Next.js Project

Use `create-next-app` with non-interactive flags:

```bash
cd $OPENCLAW_WORKSPACE
npx create-next-app@latest [project-name] --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
```

**Flags explained:**
- `--typescript` - Use TypeScript
- `--tailwind` - Include Tailwind CSS
- `--eslint` - Include ESLint
- `--app` - Use App Router (not Pages Router)
- `--src-dir` - Use src/ directory
- `--import-alias "@/*"` - Clean imports
- `--yes` - Skip all prompts (CRITICAL)

**Alternative frameworks:**
- React SPA (Vite): `npm create vite@latest [name] -- --template react-ts`
- Vue (Vite): `npm create vite@latest [name] -- --template vue-ts`
- Plain HTML: Skip scaffolding, create files manually

**Note:** `create-next-app` uses npm by default. Bun is used for subsequent steps.

### 4. Install Dependencies

Navigate to project and install:

```bash
cd [project-name]
bun install
```

**If bun is not installed:**
```bash
npm install
```

This is CRITICAL - build will fail without installed dependencies.

### 5. Create Production-Level Code

Use frontend-design skill to build the actual website:

- Read frontend-design/SKILL.md and follow its guidelines
- Choose a bold, distinctive aesthetic direction
- Implement working, production-grade code
- Focus on typography, color, motion, and layout

**Key principles:**
- Be distinctive, not generic
- Use creative font choices (avoid Inter, Roboto, Arial)
- Commit to a cohesive theme
- Add animations and micro-interactions
- Make it memorable

**File locations:**
- Pages: `src/app/page.tsx` (home), `src/app/[slug]/page.tsx` (dynamic routes)
- Components: `src/components/`
- Styles: `src/app/globals.css` (Tailwind globals), `src/app/layout.tsx` (font imports)
- Static assets: `public/`

### 6. Local Testing

Test before deploying:

```bash
bun run dev
# OR
npm run dev
```

The dev server starts at http://localhost:3000

**To stop the dev server:** Press `Ctrl+C` in terminal

**Verify:**
- All pages load without errors
- Links work correctly
- Responsive design works on mobile (resize browser)
- No console errors (check browser DevTools → Console tab)
- Images and assets load
- Navigation works as expected

**If errors are found:**
- Fix them before proceeding
- Common issues: missing imports, typos in paths, undefined variables
- Use `console.log()` for debugging if needed

### 7. Build for Production

Create an optimized production build:

```bash
bun run build
# OR
npm run build
```

This validates code and creates an optimized bundle.

**If build fails:**
- Read error messages carefully
- Common issues: TypeScript errors, missing dependencies, incorrect imports
- Fix type errors or add proper types
- Avoid `// @ts-ignore` in production

**To enable strict TypeScript mode (recommended):**
In `tsconfig.json`, change `"strict": false` to `"strict": true`

### 8. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: [project description]"
```

**Create .gitignore:**

On Windows (PowerShell):
```powershell
@"
node_modules
.next
.env*.local
dist
coverage
"@ | Out-File -Encoding utf8 .gitignore
```

On Mac/Linux:
```bash
cat > .gitignore <<EOF
node_modules
.next
.env*.local
dist
coverage
EOF
```

Add and commit:
```bash
git add .gitignore
git commit -m "Add .gitignore"
```

**Verify git is clean:**
```bash
git status
# Should show: "nothing to commit, working tree clean"
```

### 9. Create GitHub Repository (Optional)

Ask user if they want to push to GitHub. If yes:

**Feature branch workflow (recommended for development):**

```bash
# Create and checkout feature branch
git checkout -b feature/main-site

# Make changes and commit
git add .
git commit -m "Add main site functionality"

# Create repo on GitHub (from main branch)
gh repo create [project-name] --public --source=. --remote=origin

# Push all branches
git push -u origin main
git push -u origin feature/main-site

# Merge feature to main (if ready)
git checkout main
git merge feature/main-site
git push origin main
```

**Simple workflow (for initial deployment):**

```bash
# Create repo and push
gh repo create [project-name] --public --source=. --remote=origin
git push -u origin main
```

**Troubleshooting:**
- "not authenticated": Run `gh auth login` in your terminal
- "repo already exists": Use `--private` or change name: `gh repo create [name]-2 --public ...`

### 10. Deploy to Vercel

**Windows Compatibility Note:**
The vercel-deploy skill script may have path issues on Windows. Use Vercel CLI directly instead:

```bash
cd [project-name]
npx vercel --yes
```

The deployment will:
- Package project (excludes node_modules, .git)
- Auto-detect framework (Next.js)
- Deploy to Vercel
- Return Preview URL and Claim URL

**Alternative: Direct Vercel CLI**
```bash
cd [project-name]
npx vercel --yes
```

This is the recommended approach for Windows systems.

### 11. Present Results

Report back to the user with:

```
✓ Website created and deployed!

Project: [name]
Location: [workspace]/[project-name]

Preview URL: https://[project-hash].vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...

Notes:
- Preview URL works immediately
- Claim URL transfers ownership to your Vercel account
- Without claiming, preview may expire after a few days

[Optional] GitHub: https://github.com/[username]/[project-name]
```

## Iteration Workflow

After deployment, user may want changes:

### Make Changes

1. Edit code in project
2. Test locally: `bun run dev`
3. Verify changes work
4. Stop dev server: `Ctrl+C`

### Redeploy

```bash
# Rebuild
bun run build

# Commit changes
git add .
git commit -m "Update: [description of changes]"

# Push to GitHub (if applicable)
git push

# Redeploy to Vercel
cd [project-name]
npx vercel --yes
```

**If you claimed the deployment to Vercel:**
After pushing to GitHub, Vercel will auto-deploy on every commit. No manual redeploy needed.

### Rollback Strategy

If a deployed version has issues:

```bash
# View commit history
git log --oneline

# Revert to previous commit
git revert HEAD

# Push to trigger rollback deploy
git push
```

Or manually select a previous deployment in the Vercel dashboard (after claiming).

## Environment Variables

If your website needs API keys or secrets:

### Client-side variables (exposed to browser)

1. Rename to `NEXT_PUBLIC_`:
```
NEXT_PUBLIC_API_KEY=your_key_here
```

2. Use in code:
```typescript
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

### Server-side variables (secret)

1. Add to `.env.local`:
```
DATABASE_URL=your_database_url
API_SECRET=your_secret_key
```

2. Use in server components or API routes:
```typescript
const dbUrl = process.env.DATABASE_URL;
```

### Add to Vercel (after claiming)

1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Add the same variables
4. For client-side vars, prefix with `NEXT_PUBLIC_`

**NEVER commit `.env.local`** - it's already in `.gitignore`

## Static Assets

### Adding images

1. Place images in `public/` directory:
```
public/
├── images/
│   ├── hero.jpg
│   └── logo.png
```

2. Use in code with Next.js Image component:
```typescript
import Image from 'next/image';

<Image
  src="/images/hero.jpg"
  alt="Hero section"
  width={1920}
  height={1080}
  priority  // For above-the-fold images
/>
```

### Adding custom fonts

1. Use Next.js font optimization:
```typescript
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '700'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

## README Template

Create `README.md` in the project root:

```markdown
# [Project Name]

[One-line description of what the website does]

## Features

- Feature 1
- Feature 2
- Feature 3

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- [Add other technologies]

## Getting Started

### Prerequisites

- Node.js 18+
- Bun or npm

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

Open http://localhost:3000

### Build

```bash
bun run build
```

## Deployment

Deployed at: https://[your-project].vercel.app

## License

[MIT or other]
```

## CI/CD with GitHub Actions (Optional)

After creating a GitHub repo, add automated testing:

1. Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: bun install
      - run: bun run lint
      - run: bun run build
```

2. Commit and push:
```bash
git add .github/workflows/ci.yml
git commit -m "Add CI workflow"
git push
```

Vercel will still deploy, but now changes are tested automatically.

## Quality Checklist

Before deploying, verify ALL of these:

- [ ] Code runs locally: `bun run dev` loads at http://localhost:3000
- [ ] Build succeeds: `bun run build` completes without errors
- [ ] All pages load without 404s or runtime errors
- [ ] Responsive design works: resize browser to mobile size
- [ ] No console errors: check browser DevTools → Console tab
- [ ] Git is clean: `git status` shows no uncommitted changes
- [ ] README.md documents the project
- [ ] Images are optimized (use Next.js Image component)
- [ ] Environment variables are set (if needed)
- [ ] Deployment preview loads successfully

## Troubleshooting

### Scaffold fails

**"npx not found"**:
- Install Node.js from nodejs.org
- Restart terminal and try again

**"create-next-app failed"**:
- Check internet connection
- Try: `npx --yes create-next-app@latest [name] --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes`
- Verify project name follows naming rules

### Build fails

**"TypeScript errors"**:
```bash
bun run lint
```
- Read error messages
- Fix type errors or add proper types
- Avoid `// @ts-ignore` in production

**"Module not found"**:
```bash
bun install
```
- Check `package.json` dependencies
- Verify import paths are correct

**"Build failed: ERESOLVE unable to resolve dependency tree"**:
- Delete `node_modules` and `bun.lockb`
- Run `bun install` again

### Deployment fails

**"Network error"**:
- Check internet connection
- Try: `npx vercel --yes`

**"Framework not detected"**:
- Ensure `package.json` exists in project root
- Check that "next" is in dependencies
- Try: `npx vercel --yes --framework nextjs`

**"Build failed"**:
- Run `bun run build` locally first
- Fix build errors
- Try deployment again

**"vercel-deploy skill not found"**:
- Use Vercel CLI directly: `npx vercel --yes`
- Or install vercel-deploy skill

### GitHub push fails

**"not authenticated"**:
- Run `gh auth login` in your terminal
- Follow the prompts

**"repo already exists"**:
- Use `--private` flag instead
- Or choose a different project name

### Local dev server issues

**"Port 3000 is already in use"**:
- Stop the other server (Ctrl+C)
- Or use a different port: `bun run dev --port 3001`

**"Error: Failed to compile"**:
- Check the error message for details
- Common issues: missing imports, syntax errors, wrong paths
- Fix and save - the dev server will reload automatically

### Alternative Deployment Platforms

If Vercel doesn't work for you:

**Netlify:**
```bash
bun run build
netlify deploy --prod --dir=.next
```

**Cloudflare Pages:**
```bash
bun run build
wrangler pages deploy .next
```

**Self-hosting:**
1. Build: `bun run build`
2. Serve `.next` directory with Node.js or nginx
3. Or export static HTML: `bun run build` with `output: 'export'` in `next.config.ts`

## File Structure (After Scaffolding)

```
project-name/
├── .github/                 # GitHub Actions (optional)
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with fonts
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   └── components/         # Your components
├── public/                 # Static assets
│   └── images/
├── .gitignore              # Git exclusions
├── .env.local             # Environment variables (not in git)
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── next.config.ts        # Next.js config
├── tailwind.config.ts    # Tailwind config
└── README.md             # Project documentation
```

## Notes

- This skill orchestrates, doesn't implement directly
- Leverages frontend-design for creative work
- Default framework is Next.js with TypeScript and Tailwind
- Vercel is the default deployment target
- All paths use environment variables for cross-platform compatibility

## Lessons Learned

### Tailwind v4 Custom Classes
- Custom classes like `.btn-primary`, `.btn-secondary`, `.card-hover` require proper Tailwind v4 configuration
- Use `@theme` directive or `@layer components` in globals.css
- Or define colors in `tailwind.config.ts` using `theme.extend`
- Standard Tailwind utilities (`bg-red-600`, `hover:shadow-xl`) are more reliable

### Windows Path Compatibility
- Bash script paths like `~/.openclaw/skills/` may not resolve correctly on Windows
- Use environment variable `$OPENCLAW_WORKSPACE` for cross-platform compatibility
- Or use PowerShell paths with `$env:OPENCLAW_WORKSPACE`

### Swarm-Agents Debugging
- For complex styling issues across multiple components, swarm-agents is highly effective
- Spawns multiple specialized agents that each check different aspects
- Parallel analysis dramatically speeds up debugging and fixes
- Use when: multiple files need systematic investigation

### Vercel Deployment
- For Windows users, `npx vercel --yes` is more reliable than bash scripts
- Direct CLI usage avoids path resolution issues
- Vercel CLI auto-detects framework and handles dependencies

### Project Scaffolding
- `create-next-app` with `--yes` flag works reliably for automation
- Avoid interactive prompts by always including `--yes`
- All flags are documented in Next.js CLI documentation
