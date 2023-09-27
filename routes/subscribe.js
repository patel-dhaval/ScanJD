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
    console.log('Subscribe route: Connected to the AWS RDS MySQL database');
});



router.post('/', async (req, res) => {
    const {email} = req.body;
    const currentTime = new Date(); // Create a Date object to capture the current time

    // Create a new object with the captured values and the current time
    const waitlistUser = {
    email,
    currentTime: currentTime.toISOString().slice(0, 19).replace('T', ' ') // Convert the time to ISO format (or another format you prefer)
    };
    // check if phoneHash is not null
    if(waitlistUser.email ==null){
        res.status(400);
        res.json({ response: "Incomplete Details" });
        return;
    }
    const addDB = await addWaitlistedUser(waitlistUser.email, waitlistUser.currentTime);
    if(addDB==false){
        res.status(400);
        res.json({ response: "Internal error" });
        return;
    }
    // send response
    res.status(200);
    console.log("User Waitlisted");
    res.json({ response: "You are currently waitlisted. We are working on scaling up our systems." });
    return;
});


function addWaitlistedUser( email, currentTime) {
    return new Promise((resolve, reject) => {
        connection.query(
        'INSERT INTO `waitlist` (email, dateTime, emailSent) VALUES ( ?, ?, 0) ON DUPLICATE KEY UPDATE dateTime=\''+currentTime+'\', email=\''+email+'\'',
        [email, currentTime],
        (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
}


module.exports = router;
