const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const crypto = require("crypto");

// DO NOT CHANGE THIS KEY
const jwtSecretKey = `$2b$05$uzFGQTRhuymHkNDiB1xNDO10zjfSCKyiOqUU6s/pnJCCcB2XD538W`;
// //////////////////////////////////////
// DB schema
/////////////////////////////////////////
// analysis      //
//////////////////////
// jobId            //
// jobDescription   //
// response         //
// lastUpdated      //
//////////////////////
// users
// //////////////
// phoneHash
// apiKey
// credits




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
    console.log('Login route: Connected to the AWS RDS MySQL database');
});

// Route for logging in
router.post('/', async (req, res) => {
    // get email from the request
    const {email, phone} = req.body;
    
    // check if email is not null
    if(email==null){
        res.status(400);
        res.json({ response: "email not found" });
    }

    // check if email is in the db or not
    const results = await userData(phone, 'users');

    // if -> email is not in the system 
    if (results.length != 1){
        res.status(400);
        res.json({ response: "user not found"});
        return;
    }
    if(results[0].phone!=phone||results[0].email!=email){
        res.status(400);
        res.json({ response: "invalid credentials"});
        return;
    }
    res.status(200);
    res.json({ apikey: results[0].apikey, credits: results[0].credits});
    return;
});

function userData(phone, db) {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM `'+db+'` WHERE phone =\''+phone+'\'',
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

// 16 character apikey
function generateRandomKey() {
    const keyBytes = new Uint8Array(8);
    crypto.getRandomValues(keyBytes);
    const keyHex = Array.from(keyBytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    return keyHex;
}

module.exports = router;