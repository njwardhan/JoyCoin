rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "missing space"
git push origin master