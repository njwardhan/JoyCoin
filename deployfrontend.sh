rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "type animation"
git push origin master