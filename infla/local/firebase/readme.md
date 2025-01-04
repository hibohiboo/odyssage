```
./bin/bash.sh
```

上記でコンテナ内に入り、 `firebase login`でログインする。
`firebase init`を行い、エミュレータを選択する。
これで`.firebaserc`と`firebase.json`が作成される。
その後、firebase.jsonのホストに`0.0.0.0`を加える。

`./bin/up`で起動したのち、下記にアクセスでUIを確認できる。

http://127.0.0.1:4000/