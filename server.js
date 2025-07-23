const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: userMessage })
    });

    const data = await response.json();

if (data.error) {
  console.error("Erreur HF:", data.error);
  return res.json({ reply: "Le modèle est en cours de chargement. Réessayez dans quelques instants." });
}

const aiResponse = Array.isArray(data) && data[0]?.generated_text
  ? data[0].generated_text
  : "Je n'ai pas reçu de réponse claire.";

res.json({ reply: aiResponse });

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("Erreur HuggingFace:", error);
    res.status(500).json({ reply: "Erreur serveur HuggingFace." });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
