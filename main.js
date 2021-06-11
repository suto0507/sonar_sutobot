
/*
- twitterのキー
  - TWITTER_API_KEY
  - TWITTER_API_SECRET
  - TWITTER_TOKEN
  - TWITTER_TOKEN_SECRET
- discordのキー
  - DISCORD_BOT_TOKEN
- Discordチャンネルのid /getguildidでわかります
  - DISCORD_CHANNEL_ID
- TwitterBotのアカウントのID
  - TWITTER_ID
*/

// Twitter
const twitter = require('twitter');
const bot = new twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token_key: process.env.TWITTER_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

// Discord bot implements
const discord = require('discord.js');
const client = new discord.Client();


const request = require('request');

var Canvas = require('canvas');


const fs = require('fs');

Canvas.registerFont('./font/mplus-1p-heavy.ttf', { family: 'PoP' });



client.on('ready', message => {
  client.user.setPresence({ activity: { name: '/sutohelp 機能一覧' } });
  console.log('bot is ready!');
});

client.on('message', message => {
  if (message.mentions.has(client.user) && message.author != client.user) {

    message.reply('beautiful sutobot');

  } else {
    let channel = message.channel;
    if (message.content == '/おみくじ') {
      var index = Math.floor(Math.random() * 5);
      if (index == 0) {
        message.channel.send('大吉');
      } else if (index == 1) {
        message.channel.send('中吉');
      } else if (index == 2) {
        message.channel.send('吉');
      } else if (index == 3) {
        message.channel.send('凶');
      } else {
        message.channel.send('大凶');
      }
    } else if (message.content == '/おはよう') {
      message.channel.send('おはようございます', { tts: true });
    } else if (message.content.startsWith('/rmember')) {
      var num = 1;
      var mes = message.content.replace('/rmember', '');
      if (mes == '') {
        num = 1;
      } else {
        mes.replace(' ', '');
        num = Number(mes);
      }

      message.member.voice.channel.members.random(num).forEach(member => {
        message.channel.send(member.user.username);
      });

    } else if (message.content == '/sutohelp') {
      message.channel.send('・/rmember:ランダムなボイスチャンネルのメンバーを表示,半角スペース区切りで人数指定もできる');
      message.channel.send('・/おみくじ:おみくじが引けるよ');
      message.channel.send('・/おはよう:おはよう');
      message.channel.send('・/panel_woman:半角スペース区切りでメッセージを入れるとメッセージ入りの画像が出てくるよ');
      message.channel.send('・/t ツイート 画像を付けられるよ。/t と画像だけだと送れないからなんかメッセージをつけてね');
      message.channel.send('・Twitterにメンションを送ってdiscord に投稿しよう。フォローしてない鍵垢には反応しないよ。');
      message.channel.send('・↑「/tts 」を入れるとttsになるよ。画像も付けられるよ。引用リツイートを送信できるよ');
    } else if (message.content.startsWith('/t')) {
      var mes = message.cleanContent.replace('/t ', '').replace('/t', '').replace('＠', '@');

      var nagasa = 0;
      for (i = 0; i < mes.length; i++) {
        if (mes[i].match(/[ -~]/)) {
          nagasa += 0.5;
        } else {
          nagasa += 1;
        }
      }
      if (mes == "") {
        mes = " ";
      }
      if (nagasa <= 140) {
        if (message.attachments.some(att => true)) {
          message.attachments.each(attach => {
            request.get(attach.proxyURL, { encoding: null }, async function (error, response, body) {
              var buffer = new Buffer.from(body);
              var media = await bot.post('media/upload', { media: buffer });
              var params = { status: mes, media_ids: media.media_id_string };
              bot.post("statuses/update", params);
            });
          });

        } else {
          bot.post('statuses/update', { status: mes }, function (error, tweet, response) {
            if (!error) {
              console.log(tweet);
            } else {
              console.log(error.toString());
              message.channel.send('エラー');
            }
          });
        }
      } else {
        message.channel.send('たぶん文字数オーバーだよ');
      }

    } else if (message.content == '/getguildid') { 
      message.channel.send(message.channel.id);
    } else if (message.content.startsWith('/panel_woman')) {

      var canvas = Canvas.createCanvas(1024, 1024);
      var ctx = canvas.getContext('2d');

      var mes = message.content.replace('/panel_woman', '');
      if (mes == '') {
        mes = "メッセージを入れてね"
      } else {
        mes.replace(' ', '');
      }
      const image = new Canvas.Image();
      image.src = './image/tv_panel_quiz_woman.png';  
      
      ctx.drawImage(image, 0, 0, 1024, 1024);

      var mesarray = mes.split(`\n`);
      var maxlen = 0;
      for (var i = 0; i < mesarray.length; i++) {
        if (mesarray[i].length > maxlen) {
          maxlen = mesarray[i].length;
        }
      }

      var font_size = 500 / maxlen;

      ctx.font = font_size + 'px "PoP"';

      ctx.fillText(mes, 275, 580 + 50 / mesarray.length);
      console.log('text plus');

      var string = canvas.toDataURL().split(',')[1];
      var buffer = new Buffer(string, 'base64');

      var fsd = require('fs');
      fsd.writeFile('message.png', buffer, (error) => { });

      message.channel.send({ files: ['message.png'] });

    }
    var emoji = message.guild.emojis.cache.find(emoji => message.content.includes(emoji));
    if (emoji) {
      message.react(emoji.id);
    }

  }
});



if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log('please set ENV: DISCORD_BOT_TOKEN');
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);

//CRCテスト
const express = require("express");
//const router = express.Router();
router = express();
const crypto = require('crypto');
const bodyParser = require('body-parser');

router.set('port', (process.env.PORT || 5000));
router.use(express.static(__dirname + '/public'));

router.get('/callback', (req, res, next) => {
  let crc_token = req.query.crc_token;
  if (!crc_token) {
    return next();
  }
  const signature = crypto.createHmac('sha256', process.env.TWITTER_API_SECRET)
    .update(crc_token).digest('base64');
  res.json({ response_token: `sha256=${signature}` });
});

router.post('/callback', bodyParser.text({ type: '*/*' }), (req, res, next) => {
  var body;
  var channel = process.env.DISCORD_CHANNEL_ID;
  body = JSON.parse(req.body);
  if (!body) {
    client.channels.cache.get(channel).send('Body is empty');
  }
  if (body.tweet_create_events && (body.user_has_blocked === false)) {
    body.tweet_create_events.map(
      tweet => {
        var message = tweet.text.replace('@' + process.env.TWITTER_ID + ' ', '').replace('@' + process.env.TWITTER_ID, '')

        console.log(tweet);
        if (tweet.quoted_status_permalink && tweet.quoted_status_permalink.expanded) {
          client.channels.cache.get(channel).send('', { content: tweet.quoted_status_permalink.expanded });
        }

        if (tweet.in_reply_to_status_id_str) {//リプ

          bot.get('statuses/show/' + tweet.in_reply_to_status_id_str + '.json', { id: tweet.in_reply_to_status_id_str }, function (error, twe, res) {
            console.log("resは" + twe.text);
            replymessage = twe.text + ' by ' + twe.user.name;
            message = message.replace("@" + twe.user.screen_name + " ", "").replace("@" + twe.user.screen_name, "");
            tweetSendDiscord(twe, replymessage, channel);
            tweetSendDiscord(tweet, message, channel);
            console.log(twe.user.screen_name);
          });

          console.log(tweet.entities.user_mentions);
        } else {
          tweetSendDiscord(tweet, message, channel);
        }
      }
    );
  } else {
    console.log("not mention")
  }
  res.send('OK!')
});

function tweetSendDiscord(tweet, message, channel) { //
  if (tweet.extended_entities) {//画像の処理
    console.log(tweet.extended_entities);
    tweet.extended_entities.media.map(
      media => {
        client.channels.cache.get(channel).send({ files: [media.media_url] });
        message = message.replace('' + media.url, '').replace(media.url, '');
      }
    );
  }
  if (message == '') {
    //message=' ';
  } else if (tweet.text.includes('/tts')) {
    client.channels.cache.get(channel).send(message.replace('/tts ', '').replace('/tts', ''), { tts: true });
  } else {
    client.channels.cache.get(channel).send(message);
  }
}

router.get('/', function (req, res) {
  res.send('Hello!')
});


const server = router.listen(process.env.PORT || 5000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Example app listening at http://${host}:${port}`);
});


