const express = require('express');
const router = express.Router();
const _wit = require('node-wit');
const _line = require('@line/bot-sdk');
const _translate = require('@google-cloud/translate');
const key = require('../webhookkeys');

// Key Cofigure
const wit = new _wit.Wit({ accessToken: key.witai.key, });
const translate = new _translate({ key: key.translate.key, });
const line = new _line.Client({
  channelAccessToken: key.line.channelAccessToken,
  channelSecret: key.line.channelSecret,
});

// Routers
router.get('/', (req, res, next) => {
  res.status(404);
  res.render('error', {});
});

router.post('/linewebhook-dlfkru', (req, res) => {
  // console.log(JSON.stringify(req.body, undefined, 2));
  Promise
    .all(req.body.events.map(handleLineMsgs))
    .then(
      (result) => res.json(result)
    );
})

function handleLineMsgs(e) {
  return new Promise(async (resolve, reject) => {
    console.log(e)
    if (e.type == 'postback') {
      // if (e.postback.data == '') {
      // }
    } else if (e.type == 'message') {
      if (e.message.type == 'sticker') {
        template = [
          'O.o',
          '喵喵',
          '欸疑?',
        ];
        rndmsg({ id: e.source.userId, msg: template, })
      } else if (e.message.type == 'text') {
        let transtext = await translate.translate(e.message.text, 'en');
        let witresp = await wit.message(transtext[0]);

        console.log(JSON.stringify(witresp, undefined, 2));

        if (witresp.entities) {
          let rules = [];

          // Mapping sentense's intents
          for (let intent in witresp.entities) {
            for (let info of witresp.entities[intent]) {
              rules.push(info.value);
            }
          }
          console.log(rules);

          let template = [];
          // Rules for name questions
          if (rules.includes('school')) {
            // Questions about college 
            // (school & university)
            if (rules.includes('university')) {
              template = [
                '你是問之前嗎？我之前讀南台科大電子系',
                '大學讀南台電子系',
                '我大學是讀南台哦! 電子系系統組!',
              ];
              rndmsg({ id: e.source.userId, msg: template, })
              // Questions about now
              // (school)
            } else {
              template = [
                '我目前在彰化讀彰師資工所',
                '現在是彰師資工所的研究生~',
                '我現在在彰師讀資工所哦!',
              ];
              rndmsg({ id: e.source.userId, msg: template, })
            }
            // Rules for experience questions
          } else if (rules.includes('experience') || rules.includes('project')) {
            // Questions about project
            if (rules.includes('do') || rules.includes('project')) {
              let scenelist = [
                ['大學有做了一台畫人臉的 Drawbot', '也有做一些讓自己可以偷懶的小工具', '像是可以幫我計算畢業門檻的工具', '下面是我曾經做過的專案'],
                ['下面是我做過的專案', '會想做這些東西主要是因為想偷懶才做的 😆', '可以點下面的圖片 會有比較詳細的資訊'],
                ['確實有一些作品', '大部分都用 JavaScript 去做的', '點選圖片可以看詳細資訊哦'],
              ]
              let scene = scenelist[Math.floor(Math.random() * scenelist.length)]
              await scenemsg({ id: e.source.userId, scene: scene, })
              line.pushMessage(e.source.userId, {
                "type": "template",
                "altText": "作品列表",
                "template": {
                    "type": "image_carousel",
                    "columns": [
                        {
                          "imageUrl": "https://i.imgur.com/7YSnS5O.png",
                          "action": {
                            "type": "postback",
                            "label": "(不開放查看)",
                            "data": "_"
                          }
                        },
                        {
                          "imageUrl": "https://i.imgur.com/SkLJcN5.png",
                          "action": {
                            "type": "uri",
                            "label": "詳細資訊",
                            "uri": "https://github.com/opjlmi/graduate-helper"
                          }
                        },
                        {
                          "imageUrl": "https://i.imgur.com/tR7U7D5.png",
                          "action": {
                            "type": "uri",
                            "label": "詳細資訊",
                            "uri": "https://github.com/opjlmi/drawbot-frontend"
                          }
                        },
                        {
                          "imageUrl": "https://i.imgur.com/XLk2lvg.png",
                          "action": {
                            "type": "uri",
                            "label": "查看更多",
                            "uri": "https://github.com/opjlmi"
                          }
                        },
                    ]
                }
              })
            // Questions about activities
            } else if (rules.includes('activities')) {
              let scenelist = [
                ['因為我希望對 Linux 掌控度更高', '所以在大學期間去考了一張 RHCE', '大學也因為專題的關係', '有參與產學合作到 MakerFaire 參展', '最近也開了一個部落格', '叫 熊熊好 Code', '有興趣可以到網站上看看', 'http://hellopolarbear.com'],
                ['因為大學的時候開始接觸社群', '基本上很多場大型的研討會(大拜拜)都會出現', '也因為對 Linux 有興趣考了一張 RHCE', '目前也是熊熊好Code的站長', '網站上會發關於程式開發的文章', '有興趣可以去看看', 'http://hellopolarbear.com'],
              ]
              let scene = scenelist[Math.floor(Math.random() * scenelist.length)]
              await scenemsg({ id: e.source.userId, scene: scene, })
            }
          // Questions about motive
          } else if (rules.includes('motive')) {
            let scenelist = [
              ['當初在 FaceBook 看到 Line 的實習資訊', '所以就覺得說不定能來試看看', '一方面是想讓自己學到不同的知識', '二方面也是想認識更多不同領域的人一起交流'],
              ['主要是因為看到實習的訊息 而且現在我也對 Line Pay 很有興趣', '應該是說支付工具都很有興趣', '尤其最近有 Line 將與一卡通合作的新聞', '讓我很想加入 Line 的團隊', '一起與夥伴打造台灣人都喜歡的支付平台！'],
            ]
            let scene = scenelist[Math.floor(Math.random() * scenelist.length)]
            await scenemsg({ id: e.source.userId, scene: scene, })
          // WHO ARE YOU questions
          } else if (rules.includes('name')) {
            template = [
              '我叫做信宏',
              '你可以叫我信宏就好了 😀',
              '你可以叫我 Sean',
            ];
            rndmsg({ id: e.source.userId, msg: template, })
          } else {
            fail(e.source.userId)
          }
        }
      }
    }
    resolve()
  })
}

function fail(id) {
  let template = [
    '我不太懂你的意思耶',
    '蛤 這句的意思是...?',
    '欸疑?',
    '什麼意思',
  ]
  rndmsg({ id: id, msg: template, })
}

/**
 * Random Message Sender
 * @param {object} _r
 * { id, msg: [array], }
 */
function rndmsg(_r) {
  let returnsentence = _r.msg[Math.floor(Math.random() * _r.msg.length)]
  pushmsg({ id: _r.id, msg: returnsentence, })
}

/**
 * For Scene's message
 * @param {any} _s 
 * { id, msg: [array], }
 */
function scenemsg(_s) {
  return new Promise(async (r_solve) => {
    for (let i = 0; i < _s.scene.length; i++) {
      pushmsg({ id: _s.id, msg: _s.scene[i], })
      await Promise.all([
        new Promise((resolve) => {
          setTimeout(() => { resolve() }, Math.floor(Math.random() * 1000 * (_s.scene[i+1]?_s.scene[i+1].length/5:1) + 200))
        }),
      ])
    }
    r_solve()
  })
}

/**
 * Push message to user
 * @param {any} _i 
 * { id, msg: [string|array], }
 */
function pushmsg(_i) {
  return new Promise((resolve, reject) => {
    line.pushMessage(_i.id, { type: 'text', text: _i.msg.toString(), })
    resolve()
  })
}

module.exports = router;