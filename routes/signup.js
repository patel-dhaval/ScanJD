const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const textflow = require("textflow.js");
const crypto = require("crypto");
const twilio = require('twilio');
textflow.useKey("tb956cfIG2FogX75HCZ4qvKN4KM8ZV4lHqOtY7R4SuMgnAb6NjW2RYZThigbOHfL");
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
// 


const accountSid = 'AC3f2bb18de3d3fda5326abd0e4b3566ce';
const authToken = '0559ba919e0e0eeb6c21936460ec1a89';
const twilioClient = twilio(accountSid, authToken);
const from = '+18667162394';
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
    console.log('SignUp route: Connected to the AWS RDS MySQL database');
});
let users = 1;
// Route for signing up
router.post('/', async (req, res) => {
    // circuitbreaker
    if(users>1000){
        res.status(400);
        console.log("okayy");
        res.json({ response: "You are currently waitlisted. We are working on scaling up our systems." });
        // To DO: Add the email to a waitlist table, need to create new table
        // Table schema: name, email, phone, datetime
        return;
    }
    // get phone number from the request
    const {email, phone, name} = req.body;

    // check if phoneHash is not null
    if(phone==null || email ==null || name == null){
        res.status(400);
        res.json({ response: "incomplete details" });
        return;
    }
    // check if phone number is valid or not:
    const phoneNumberPattern = /^\+1\d{10}$/;
    if(phoneNumberPattern.test(phone)==false){
        res.status(400);
        res.json({ response: "not a valid phone number" });
        return;
    }
    // check if email is in the db or not
    const results = await userData(phone, 'users');
    // if -> phonehash is in the system then return apikey and credits as response
    if (results.length != 0){
        res.status(200);
        res.json({ apikey: results[0].apikey, credits: results[0].credits});
        return;
    }
    // else -> generate otp, send otp to WA api, insert otp and number in 
    // TODO: Make OTP only digits
    const otp = generateOTP(6);
    // send otp to user 
    const message = "Hey there! \n Welcome to ScanJD. Here is your Signup OTP: "+otp
    twilioClient.messages
    .create({
      body: message,
      from: from,
      to: phone,
    })
    // insert otp in unverifiedUsers db
    const addDB = await addUnverifiedUser(phone, email, otp, name);
    if(addDB==false){
        res.status(400);
        res.json({ response: "internal error" });
        return;
    }
    // send response
    res.status(200);
    res.json({ response: "success"});
    return;
});

router.post('/verify', async (req, res) => {
    const {phone, userOTP} = req.body;
    if(phone==null || userOTP ==null){
        res.status(400);
        res.json({ response: "incomplete details" });
        return;
    }
    const results = await userData(phone, 'unverified');
    if (results.length != 1){
        res.status(400);
        res.json({ response: "user not found"});
        return;
    }
    if(results[0].otp!=userOTP){
        res.status(400);
        res.json({ response: "invalid otp"});
        return;
    }
    const apikey = generateRandomKey(16);
    addDB = await addUser(phone, results[0].email, results[0].name, apikey);
    if(addDB==false){
        res.status(400);
        res.json({ response: "internal error" });
        return;
    }
    // remove unverified user from db
    const deleteDB = await removeUser(phone);
    if(deleteDB==false){
        res.status(400);
        res.json({ response: "internal error" });
        return;
    }
    // update number of users
    users = users+1;
    res.status(200);
    res.json({ apikey: apikey, credits: 200});
    return;
});

function userData(phone, db) {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM `'+db+'` WHERE phone =?',
            [phone],
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

function addUnverifiedUser(phone, email, otp, name) {
    return new Promise((resolve, reject) => {
        connection.query(
        'INSERT INTO `unverified` (phone, email, otp, name) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE otp=\''+otp+'\', email=\''+email+'\', name=\''+name+'\'',
        [phone, email, otp, name],
        (error, results) => {
            if (error) {
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
}

function addUser(phone, email, name, apikey) {
    return new Promise((resolve, reject) => {
        connection.query(
        'INSERT INTO `users` (phone, email, name, apikey, credits) VALUES (?, ?, ?, ?, ?)',
        [phone, email, name, apikey, 200],
        (error, results) => {
            if (error) {
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
}

function removeUser(phone) {
    return new Promise((resolve, reject) => {
        connection.query(
        'DELETE FROM `unverified` where phone = \''+phone+'\'',
        (error, results) => {
            if (error) {
                reject(false);
                return;
            }
            resolve(true);
        });
    });
}

// 16 character apikey
function generateRandomKey(len) {
    const keyBytes = new Uint8Array(len/2);
    crypto.getRandomValues(keyBytes);
    const keyHex = Array.from(keyBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    return keyHex;
}

function generateOTP(len) {
    let result = '';
    for (let i = 0; i < len; i++) {
        const randomDigit = Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
        result += randomDigit.toString(); // Append the digit to the result
    }
    return result;
}

function userCount(){
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT COUNT(*) as count FROM users',
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results[0].count);
            }
        );
    });
}

module.exports = router;

// map(byte => Math.floor(byte / 16).toString())