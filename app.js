require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TG_API_KEY, { polling: true });
const SocketClient = require('./lib/socketClient')
const logger = require('./lib/logger')
const buildQueryForSymbols = require('./lib/build-query-for-symbols')
const formatMessage = require('./lib/format-message')

let BASE_SYMBOLS = ['TRXUSDT', 'BTCUSDT', 'ETHUSDT']

let showMessageId = 0
let timer = 0
let resData = {}

// Matches "/add"
bot.onText(/\/add (.+)/, (msg, match) => {
  const chatId = msg.chat.id
  const coin = match[1]
  BASE_SYMBOLS.push(coin)
  bot.sendMessage(chatId, `Coin ${coin} successfully added`)
})

// Matches "/show"
bot.onText(/\/show/, (msg) => {
    clearInterval(timer)
    const chatId = msg.chat.id
    const msgId = msg.message_id
    showMessageId = msgId + 1
    bot.sendMessage(chatId, 'Show crypto course')

    timer = setInterval(() => {
        const newMsg = formatMessage(resData, BASE_SYMBOLS)
        try {
            bot.editMessageText(newMsg, {
                chat_id: chatId,
                message_id: showMessageId,
                parse_mode: 'HTML'
            })
        } catch (err) {
            logger.warn(err)
        }
    }, 1500)
})

async function main() {
    try {
        logger.info('Start main ws')
        const socketApi = new SocketClient(`ws${buildQueryForSymbols(BASE_SYMBOLS)}`);
        socketApi.setHandler('trade', (data) => {
          resData[data.s] = data.p
        });
    } catch (err) {
        logger.warn(err)
    }
}

main()
