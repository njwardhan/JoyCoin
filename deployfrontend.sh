rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "update README.md"
git push origin master