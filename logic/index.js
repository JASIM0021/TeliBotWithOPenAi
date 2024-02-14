

module.exports = {
    // Response refinement function (replace with your logic)
    refineResponse :async function refineResponse({openai,text,language,tone}) {
        const chatCompletionSentiment = await openai.chat.completions.create({
            messages: [{ role: 'user', content:`translate this to : ${language}     '${text}'  just give me translated response only nother sugission or information ist required please ` }],
            model: 'gpt-3.5-turbo',
          });
    
          return  chatCompletionSentiment.choices[0]?.message.content +  '\n!BY JASIM0021' || '';
  },

  // Sentiment analysis function (using fuzzylogic example)
  analyzeSentiment:async function analyzeSentiment({openai,text}) {
    const chatCompletionSentiment = await openai.chat.completions.create({
        messages: [{ role: 'user', content:`what sentiment actually on this text '${text}' give me ans within one word like nagative positive or nything else` }],
        model: 'gpt-3.5-turbo',
      });

      return  chatCompletionSentiment.choices[0]?.message.content || '';
  }
}