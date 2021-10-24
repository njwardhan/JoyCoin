rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "first cp more"
git push origin master