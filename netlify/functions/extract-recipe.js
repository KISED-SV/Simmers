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

  const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(data)
  };
};
