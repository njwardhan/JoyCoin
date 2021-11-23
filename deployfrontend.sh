rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "flexbox trial"
git push origin master