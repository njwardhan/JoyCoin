rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "scrollbars fixed"
git push origin master