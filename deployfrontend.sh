rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "media queries"
git push origin master