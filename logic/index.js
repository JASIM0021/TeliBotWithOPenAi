

module.exports = {
    // Response refinement function (replace with your logic)
    refineResponse :async function refineResponse({openai,text}) {
        const chatCompletionSentiment = await openai.chat.completions.create({
            messages: [{ role: 'user', content:`Refine this response  with an sweet and funny  tone and the end of this response add a small line ' BY JASIM0021' response is   '${text}'` }],
            model: 'gpt-3.5-turbo',
          });
    
          return  chatCompletionSentiment.choices[0]?.message.content || '';
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