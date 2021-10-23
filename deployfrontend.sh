rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "github hosting"
git push origin master