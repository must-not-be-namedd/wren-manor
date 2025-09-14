@echo off
echo 🏰 Deploying Wren Manor to GitHub Pages...

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Not a git repository. Please initialize git first:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    echo    git branch -M main
    echo    git remote add origin https://github.com/YOUR_USERNAME/wren-manor.git
    echo    git push -u origin main
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building project...
npm run build

REM Deploy to GitHub Pages
echo 🚀 Deploying to GitHub Pages...
npm run deploy

echo ✅ Deployment complete!
echo 🌐 Your game should be available at: https://YOUR_USERNAME.github.io/wren-manor
echo.
echo 📝 Don't forget to:
echo    1. Update the homepage URL in package.json with your GitHub username
echo    2. Enable GitHub Pages in your repository settings
echo    3. Set the source to 'gh-pages' branch
pause
