const express = require('express');
const cors = require("cors")
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const app = express();

const port = 3000;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));



app.get('/', async (req, res) => {
    try {
        res.send({ "msg": "Welcome to Backend of Code Editor App" })
    } catch (error) {
        res.send({ "msg": error.message })
    }
})




const configuration = new Configuration({
    apiKey: process.env.key,
  });

const openai = new OpenAIApi(configuration);





app.post('/codeConvert/:language', async (req, res) => {
      
    try {
        const { code } = req.body;
        const language = req.params.language;
    
        // Perform debugging or quality check using OpenAI API
        const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: `Act as a code editor and convert this code to ${language}.` },
            { role: 'user', content: code },
          ]
        });
    
        console.log(response)
        // console.log(response)
        // Extract the  completion text from OpenAI response
        const completion = response.data.choices[0].message.content;
    
        // Return the completion as the response
        res.json({ completion });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
});



app.post('/debugCode', async (req, res) => {
      
    try {
        const { code } = req.body;
    
        // Perform debugging or quality check using OpenAI API
        const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: `You are a code editor and Check this code and find if there is any error in this code and give me point wise detail of error if any` },
            { role: 'user', content: code },
          ]
        });
    
        console.log(response, response.choices)
        // Extract the completion text from OpenAI response
        const completion = response.data.choices[0].message.content;
    
        // Return the completion as the response
        res.json({ completion });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
});


app.post('/quality', async (req, res) => {
      
    try {
        const { code } = req.body;
    
        // Perform debugging or quality check using OpenAI API
        const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: `Check the quality of the following code:-  ${code} \n please provide detailed info and also provide some tips to improve. provide in points` },
          ],
        });
    
        // Extract the completion text from OpenAI response
        const completion = response.data.choices[0].message.content;
    
        // Return the completion as the response
        res.json({ completion });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
});




app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});