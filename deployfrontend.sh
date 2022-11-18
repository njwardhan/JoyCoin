rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "frontend update"
git push origin master