exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { prompt, mock } = JSON.parse(event.body);

  if (mock) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        content: [{
          text: JSON.stringify({
            name: "Mock Garlic Butter Pasta",
            time: "15 min",
            difficulty: "Easy",
            servings: "2 servings",
            ingredients: [
              "200g spaghetti",
              "3 tbsp butter",
              "4 garlic cloves",
              "2 tbsp parmesan",
              "Salt & pepper to taste"
            ],
            steps: [
              "Boil pasta in salted water for 8 minutes.",
              "Melt butter in a pan, add minced garlic and cook 2 min.",
              "Toss drained pasta with garlic butter. Season well.",
              "Top with parmesan and serve immediately."
            ]
          })
        }]
      })
    };
  }

  const GROQ_KEY = process.env.GROQ_KEY;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    })
  });

  const data = await response.json();
  console.log('Groq raw response:', JSON.stringify(data));

  const text = data?.choices?.[0]?.message?.content || '';
  console.log('Extracted text:', text);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      content: [{ text }]
    })
  };
};
