const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai');
const dotenv = require('dotenv').config()


const { analyzeSentiment, refineResponse } = require('./logic');

// Set up Telegram bot
const telegramToken = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(telegramToken, { polling: true });

console.log('telegramToken', telegramToken)
// Set up OpenAI
const OPEN_AI_KY = process.env.OPEN_AI_KEY
var openai = new OpenAI({
    apiKey: OPEN_AI_KY, // This is the default and can be omitted
  });
  const menuOptions = {
    reply_markup: JSON.stringify({
        keyboard: [
            ['GirlFriends',"BoyFriends"],
            ['বাংলা','English'],
            ['Education', 'Fun'],
            ['Technological', 'Creative']
        ]
    })
};
//   // Handle /start command to display interactive menu
// bot.onText(/\/start/, (msg) => {
// });
// Handle incoming messages
let chatMode = 'Educational';

let language = 'English'

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

// for wonner purpose 

if(msg.text?.toLowerCase().includes('what is your name')){
    return bot.sendMessage(chatId,'I am an Ai assistant , you can call me JASIM')
}
if(msg.text?.toLowerCase().includes('jasim')){
    return bot.sendMessage(chatId,'Yes I am here to help! just ask me anything but dont repeat my name :)')
}





console.log('msg', msg)
    if (msg.text == '/start'){
        return  bot.sendMessage(msg.chat.id, 'Welcome! Please choose an option:', menuOptions);

    }

if(['Talk as a GirlFriends',"Talk as a BoyFriends"].includes(msg.text)){
    chatMode = msg.text 

    return bot.sendMessage(chatId,"from now you are my "+msg.text.substring(10,msg.text.length))
}

    if(  ['বাংলা','English'].includes(msg.text)){
        
        language = msg.text

       return  bot.sendMessage(chatId,`Selected ${msg.text}`)
    }
   
    if(['Education', 'Fun','Technological', 'Creative'].includes(msg.text)){
        chatMode = msg.text;
       return bot.sendMessage(chatId,`Bot Configure as ${msg.text} Mode`,{
        reply_markup:{
            remove_keyboard:true
        }
       })
    }

    bot.sendMessage(chatId,"Loading...")

   
    
    const sentiment =await analyzeSentiment({
        openai,
        text:msg.text
    })
    
   
        console.log('sentiment', sentiment)
    try {
        // Send message to OpenAI for generating response
        const prompt = `Emagine your my  ${chatMode} person in life and now i want to ask u    ${messageText}`;
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content:prompt }],
            model: 'gpt-3.5-turbo',
          });
             // Refine and personalize response
    let response = chatCompletion.choices[0]?.message.content || '';
    response =await refineResponse({
        openai:openai,
        text:response,
        language:language,
       
    }); // Implement your refinement logic

    // Add follow-up prompt (optional)
    // if (Math.random() < 0.3) { // 30% chance of follow-up question
    //   response += '\nWould you like to know more about that?';
    // }

    // Send final response
    bot.sendMessage(chatId, response);
        // Send response back to user
       
        // bot.sendMessage(chatId,  chatCompletion.choices[0]?.message.content||'');
    } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, 'Sorry, an error occurred.');
    }
});
