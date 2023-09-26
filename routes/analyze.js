const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const crypto = require("crypto");
const axios = require('axios');
// OpenAI api key
const bearerToken = `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`

// connecting to the mySQL database
const connection = mysql.createConnection({
    host: 'localhost',    
    user: 'root',     
    password: 'MySQL@root123', 
    database: 'optimal' 
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Analyze route: Connected to the MySQL database');
});

router.post('/', async (req, res) => {
    const {apikey, jd, jdID} = req.body;
    if(apikey==null||jd==null||jdID==null){
        res.status(400);
        res.json({ response: "data incomplete" });
        return;
    }
    // check apikey is valid or not
    const results = await userData(apikey, 'users');
    if (results.length != 1){
        res.status(400);
        res.json({ response: "invalid API key"});
        return;
    }
    if(results[0].credits<=0){
        res.status(400);
        res.json({ response: "not enough credits"});
        return;
    }
    // check if jdID is already analyzed or not
    let response = await getResponse(jdID);
    if(response.length==1){
        res.status(200);
        res.json({ response: response[0].response});
        return;
    }
    // if not in db, get response from chatgpt
    response = await getGPT(jd);
    // validate the response
    if(response.data.error!=null){
        res.status(400);
        res.json({ response: "internal error: GPT"});
        return;
    }
    response = response.data.choices[0].message.content
    
    // store response in db
    const dp = await insertJD(jdID, jd, response);
    // send response
    res.status(200);
    res.json({ response: response});
    // update number of credits
    await updateCredits(apikey);
    return;
});


async function getGPT(jd){
    const trainingPrompt = `Analyze the given job description and respond only in json format, nothing else.
    Format:
    response = {
    sponsorship: available/ not available/ not mentioned,
    experience: 0/1/2/3/4/5/6/7/8/9/10,
    technical_skills: [array of top 0-15 technical skills only in the domain of computer science, and related fileds extracted from job description. No soft skills],
    nice_to_have_skills: [array of top 0-5 nice to have knowledge of concepts extracted  from the job description]
    }. 
    For sponsorship, it means whether the company is willing to sponsor for work visa now or in future. If they strictly require the candidates to be having US citizenship or green card or legal asylum etc, that means sponsorship is not available.
    In experience, extract the number which best represents required work experience. If they are open to hire a candidate with lower work experience than their ideal candidate, mention work ex requirement of candidate with lower experience. This should be a number only.
    top skills: In this you are supposed to give out skills in different programming languages, tools and concepts. Be specific.
    The job description is as follows: `;
    const prompt = trainingPrompt + " "+jd;
    //gpt-4, gpt-4-0314, gpt-4-32k, gpt-4-32k-0314, gpt-3.5-turbo, gpt-3.5-turbo-0301
    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}]
    }
    const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        }
    });
    return response;
} 

function userData(apikey, db) {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM `'+db+'` WHERE apikey =\''+apikey+'\'',
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            }
        );
    });
}

function updateCredits(apikey) {
    return new Promise((resolve, reject) => {
        connection.query(
            'UPDATE users SET credits = credits - 1 WHERE apikey = \''+apikey+'\'',
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            }
        );
    });
}
function getResponse(jdID) {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT response FROM `analysis` WHERE jdID =\''+jdID+'\'',
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            }
        );
    });
}

function insertJD(jdID, jd, response) {
    return new Promise((resolve, reject) => {
        connection.query(
        'INSERT INTO `analysis` (jdID, jd, response) VALUES (?, ?, ?)',
        [jdID, "sample jd", JSON.stringify(response)],
        (error, results) => {
            if (error) {
                console.log(error);
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
}


function generateRandomKey() {
    const keyBytes = new Uint8Array(8);
    crypto.getRandomValues(keyBytes);
    const keyHex = Array.from(keyBytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    return keyHex;
}

module.exports = router;

// {
//     "response": "{\n\"sponsorship\": \"available\",\n\"experience\": 5,\n
//     \"technical_skills\": [\"Python\", \"API\", \"data pipelines\", \"data integration\", \"data workflows\",
//      \"enterprise integration\", \"automation patterns\", \"ESB\", \"ETL\", \"ELT\", \"API broker\", \"microservices\",
//       \"Database Programming\", \"Scripting\", \"Data Lake\", \"Cloud Data Warehousing\", \"Snowflake\", \"Redshift\", \"BigQuery\", \"Amazon Web Services\"],\n\"nice_to_have_skills\": [\"Linux\", \"communication skills\"]\n}"
// }