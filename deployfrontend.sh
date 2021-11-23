rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "responsive logo"
git push origin master