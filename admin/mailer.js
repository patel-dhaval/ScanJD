const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const delayBetweenEmails = 5000; // 2 seconds in milliseconds
const maxRetries = 3; // Maximum number of email sending retries

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

// Establish a connection to the database
connection.connect();

// Fetch the top 100 users whose emails have not been sent
const selectQuery = `
	SELECT email
	FROM waitlist
	WHERE emailSent = 0
	LIMIT 1;
`;

connection.query(selectQuery, (err, results) => {
  if (err) {
		console.error('Error fetching data from the database:', err);
		connection.end();
		return;
  }

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // e.g., 'smtp.example.com'
    port: 587, // SMTP port (587 for TLS, 465 for SSL, 25 for unencrypted)
    secure: false, // true for 465, false for other ports
    auth: {
		user: 'scanjdapp@gmail.com', // your SMTP email address
		pass: 'GrKLZRQYSyFcm6h9'
    }
});

  function sendEmail(index, retries) {
    if (index >= results.length || retries >= maxRetries) {
		connection.end();
		return;
    }

    const row = results[index];
    const mailOptions = {
		from: 'scanjdapp@gmail.com',
		to: row.email,
		subject: 'ScanJD - You are off waitlist now!',
		text: 'Congratulations! Now you are off the waitlist and can use this tool!'
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error sending email:', error);

			// Implement a retry mechanism
			setTimeout(() => sendEmail(index, retries + 1), delayBetweenEmails);
		} else {
			console.log('Email sent:', info.response);

			// Update the emailsent field to true in the database within a transaction
			connection.beginTransaction((transactionError) => {
			if (transactionError) {
				console.error('Error starting a database transaction:', transactionError);
				connection.end();
				return;
			}
        // Create emailDateTime in 'YYYY-MM-DD HH:MM:SS' format
        const emailDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        const updateQuery = `
            UPDATE waitlist
            SET emailSent = 1,  emailSentTime = ?
            WHERE email = ?;
          `;

          connection.query(updateQuery, [emailDateTime, row.email], (updateError) => {
            if (updateError) {
              console.error('Error updating emailsent field:', updateError);

              // Roll back the transaction on error
              connection.rollback(() => {
                connection.end();
              });
            } else {
              // Commit the transaction on success
              connection.commit((commitError) => {
                if (commitError) {
                  console.error('Error committing the transaction:', commitError);
                }

                // Send the next email after a 2-second delay
                setTimeout(() => sendEmail(index + 1, 0), delayBetweenEmails);
              });
            }
          });
        });
      }
    });
  }

  // Start sending emails
  sendEmail(0, 0);
});
