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

  const GEMINI_KEY = process.env.GEMINI_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      })
    }
  );

  const data = await response.json();
  console.log('Gemini raw response:', JSON.stringify(data));

  // Gemini 응답을 Anthropic 형식으로 변환 (프론트엔드 코드 변경 없이)
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log('Extracted text:', text);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      content: [{ text }]
    })
  };
};
