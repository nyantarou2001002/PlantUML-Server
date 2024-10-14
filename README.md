# PlantUML Editor
ユーザーが PlantUML Server プログラムを使って、簡易的なテキストから図へ変換することで、ソフトウェアのモデリングと設計図を作成できるサービスです。
このサービスは、ユーザーが PlantUML の構文を記述するためのテキストエディタを提供し、図を返します。これらの図表は SVG、PNG、または ASCII で表示することができます。また練習問題で練習することもできます。

## URL


## Demo
### トップページ

https://github.com/user-attachments/assets/f34e12ac-47c1-43ad-b31f-3c58d0330163



## 概要
トップページではPlantUMLを入力するエディターとプレビューを提供しています。PlantUMLの構文に沿ったテキストをエディターに入力すると、プレビュー画面にリアルタイムで図が表示されます。画面上部にあるPNG、SVG、ASCIIのボタンをクリックすると、プレビューの拡張子を変更できます。また、Downloadボタンを押すと現在のプレビュー図をダウンロードできます。

トップページの下部にはPlantUMLの構文を確認できるチートシートも提供されています。

また「練習問題を表示する」ボタンを押すと練習問題の問題文と正解が表示されるので練習することができます。

## 作成の経緯
ソフトウェアエンジニアはユースケース図、クラス図、アクティビティ図など、ソフトウェア設計の際にさまざまな図を使用します。そのため、オンラインで手軽に図を作成およびダウンロードできるアプリケーションの提供が便利だと考え、PlantUML Editorを開発しました。
## 使用技術
- フロントエンド
  - 使用言語： HTML, CSS, Javascript
  - コードエディタ: Monaco Editor

- バックエンド
  - 使用言語： PHP
  - PlantUML変換: [PlantUML Server](https://plantuml.com/server)



## こだわった点
### 非同期プログラミングの活用
入力されたテキストはFetch APIを使用して非同期にサーバーに送信され、他の操作をブロックせずにリアルタイムでプレビューを表示できるようにしました。同期の速度が作業に支障のない速度まで上げるためにコードを下記のように工夫しました。
- 入力が変更されるたびにすぐにリクエストを送信するのではなく、遅延処理を加える（デバウンス）。例えば、入力が停止してから一定時間（500msなど）が経過した時点で図を生成するようにしました。これにより、毎回のキー入力に対してすぐにリクエストが送られないようにし、サーバーへのリクエスト回数を減らします。
- エディタ内の無駄なリクエストを防ぐ。もしユーザーが短時間で多くの文字を入力した場合に、余計なリクエストが発生しないようにします。




