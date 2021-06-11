# sutobot

-  友人と使っていたものを一般化したものです

## 機能
- /rmember
  - ランダムなボイスチャンネルのメンバーを表示,半角スペース区切りで人数指定もできる
- /おみくじ
  - おみくじが引けるよ
- おはよう
  - おはよう
- /panel_woman
  - 半角スペース区切りでメッセージを入れるとメッセージ入りの画像が出てくるよ
- /t 
  - 半角スペース区切りでメッセージを入れるとDiscordからツイートできるよ 画像を付けられるよ。/t と画像だけだと送れないからなんかメッセージをつけてね
- Twitterにメンションを送ってdiscord に投稿しよう。フォローしてない鍵垢には反応しないよ。
  - ↑「/tts 」を入れるとttsになるよ。画像も付けられるよ。引用リツイートを送信できるよ

## 使うためには、twitterとdiscordのbotをそれぞれ用意してください

## 以下の環境変数(process.env)を設定してください
- twitterのキー
  - TWITTER_API_KEY
  - TWITTER_API_SECRET
  - TWITTER_TOKEN
  - TWITTER_TOKEN_SECRET
- discordのキー
  - DISCORD_BOT_TOKEN
- Discordチャンネルのid (/getguildidでわかります。一旦これなしでも起動できるので、後から追加してください)
  - DISCORD_CHANNEL_ID
- TwitterBotのアカウントのID
  - TWITTER_ID