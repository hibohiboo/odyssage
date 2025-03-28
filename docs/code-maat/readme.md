ルートフォルダで

```
docker run --rm -v .:/tmp aldanial/cloc --unix --by-file --csv --quiet --timeout 20 --vcs=git --exclude-dir=docs,.vscode,.github --not-match-f=\.json --report-file=./complexity.csv
```


このフォルダで
```
docker run -v .:/data -it code-maat-app -l /data/logfile.log -c git2 -a revisions > ./data/revisions.csv
git log --all --numstat --date=short --pretty=format:'--%h--%ad--%aN' --no-renames --after=2024-01-01 > ./data/logfile.log
python csv_as_enclosure_json.py --structure ./data/complexity.csv --weights ./data/revisions.csv > ./data/hotspots.json
```
