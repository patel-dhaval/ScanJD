const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const crypto = require("crypto");

// connecting to the mySQL database
const connection = mysql.createConnection({
    host: 'optima.ceiqumtvx3ak.us-east-1.rds.amazonaws.com',    
    user: 'admin',     
    password: 'admin1234', 
    database: 'optimal_rds' 
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Validate route: Connected to the AWS RDS MySQL database');
});

// Route for logging in
router.post('/', async (req, res) => {
    // get email from the request
    const {apikey} = req.body;
    
    // check if email is not null
    if(apikey==null){
        res.status(400);
        res.json({ response: "No api key found" });
    }

    // check if email is in the db or not
    const results = await userData(apikey, 'users');

    // if -> email is not in the system 
    if (results.length != 1){
        res.status(400);
        res.json({  response: "Invalid api key"});
        return;
    }
    res.status(200);
    res.json({credits: results[0].credits});
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

module.exports = router;