const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const crypto = require("crypto");
// OpenAI api key
// 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

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
    // update number of credits
    await updateCredits(apikey);
    // check if jdID is already analyzed or not
    let response = await getResponse(jdID);
    if(response.length==1){
        res.status(200);
        res.json({ response: response[0].response});
        return;
    }
    // if not in db, get response from chatgpt
    
    // store response in db
    // send response
    res.status(200);
    res.json({ response: "waddup"});
    return;
});

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
// UPDATE products SET qty = qty - 1 WHERE productID = ?


function generateRandomKey() {
    const keyBytes = new Uint8Array(8);
    crypto.getRandomValues(keyBytes);
    const keyHex = Array.from(keyBytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    return keyHex;
}

module.exports = router;