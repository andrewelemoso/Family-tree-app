# Deployment Guide - Family Tree Web App

This guide walks you through deploying the Family Tree app publicly on GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your computer
- The repository already initialized: `Family-tree-app`

## Step 1: Verify Your Repository

Your repository is already created at: `https://github.com/andrewelemoso/Family-tree-app`

Check the current status:
```bash
cd "/Users/drew/Desktop/Family tree app"
git status
```

## Step 2: Add All Files to Git

Stage all project files:
```bash
git add .
```

Check what's staged:
```bash
git status
```

You should see all new files ready to commit:
- `data/family-tree.json`
- `styles/style.css`
- `scripts/tree.js`
- `index.html`
- `README.md`
- `.gitignore`
- `serve.sh`

## Step 3: Commit Your Changes

```bash
git commit -m "Initial commit: Complete interactive family tree application

- Add structured family tree data (JSON)
- Create responsive web application
- Implement search functionality
- Add person details sidebar
- Include comprehensive documentation"
```

## Step 4: Push to GitHub

```bash
git push -u origin main
```

This sends all your files to GitHub's servers.

## Step 5: Enable GitHub Pages

1. Go to: `https://github.com/andrewelemoso/Family-tree-app`
2. Click **Settings** (tab at the top)
3. Scroll to **Pages** (left sidebar)
4. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

GitHub will show you:
```
✓ Your site is ready to be published at https://andrewelemoso.github.io/Family-tree-app
```

**Note**: It may take a few minutes (usually 1-3 minutes) for your site to go live.

## Step 6: Verify Deployment

Wait 2-3 minutes, then visit:
```
https://andrewelemoso.github.io/Family-tree-app
```

You should see the complete family tree with search functionality!

## Testing Locally (Optional)

Before deploying, you can test the app locally:

```bash
cd "/Users/drew/Desktop/Family tree app"
./serve.sh
```

Then open in your browser:
```
http://localhost:8000
```

## Troubleshooting

### App not showing up after GitHub Pages is enabled?

1. **Wait a few more minutes** - GitHub Pages deployment can take 3-5 minutes
2. **Hard refresh** your browser (Cmd+Shift+R on Mac)
3. **Check GitHub Actions**:
   - Go to your repository
   - Click "Actions" tab
   - Look for any deployment errors

### Tree not rendering/data not loading?

1. Verify `data/family-tree.json` exists in repository
2. Check browser console (F12 → Console tab) for errors
3. Ensure all file paths are correct in `index.html`

### Search not working?

- Open browser console (F12)
- Look for any JavaScript errors
- Verify JSON file is properly formatted

## Making Updates

After deployment, if you want to update the app:

1. Make changes locally
2. Test with `./serve.sh`
3. Commit changes:
   ```bash
   git add .
   git commit -m "Update: Brief description of changes"
   git push
   ```
4. GitHub Pages automatically redeploys (usually within 1-2 minutes)

## Sharing with Family

Once deployed, share this link:
```
https://andrewelemoso.github.io/Family-tree-app
```

You can:
- Send in family WhatsApp groups
- Share on Facebook/family forums
- Email to relatives
- Post on family blog/website

## Adding More Family Data

To add missing family members or information:

1. Edit `data/family-tree.json` locally
2. Follow the existing person object structure
3. Test locally with `./serve.sh`
4. Commit and push to GitHub
5. Changes appear on the live site within minutes

Example adding a new person:
```json
{
  "id": "unique_person_id",
  "name": "Full Name",
  "generation": 3,
  "title": "Relationship/Title",
  "spouse": "spouse_id",
  "children": ["child_id_1", "child_id_2"],
  "dataCompleteness": 50,
  "notes": "Additional information"
}
```

## Need Help?

- **GitHub Pages Documentation**: https://pages.github.com
- **Git Help**: https://git-scm.com/doc
- **Check repository Issues**: Create an issue on GitHub for technical problems

---

**Congratulations!** Your family tree is now publicly accessible and ready to surprise your family group chat! 🎉
