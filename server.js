const express = require('express');
const bodyParser = require('body-parser');
const { CohereClient } = require('cohere-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type'
}));

const cohere = new CohereClient({
    token: process.env.COHERE_API_TOKEN,
});

app.post('/chat', async (req, res) => {
    const { preamble, message, conversation_id, temperature, presencePenalty } = req.body;
    console.log('the server is runnnnninnnnnnn!');

    try {
        const response = await cohere.chat({
            preamble: preamble,
            message: message,
            conversation_id: conversation_id,
            temperature: temperature,
            presencePenalty: presencePenalty,
        });

        res.json({ response: response });
    } catch (error) {
        res.status(500).send('Error calling Cohere API');
    }
});

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});
