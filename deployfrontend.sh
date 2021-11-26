rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "HTML refactor"
git push origin master