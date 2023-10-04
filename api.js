const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const analyzeRouter = require('./routes/analyze');
const subscribeRouter = require('./routes/subscribe');
const validateRouter = require('./routes/validate');

app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/analyze', analyzeRouter);
app.use('/subscribe', subscribeRouter);
app.use('/validate', validateRouter);


app.use(express.static('views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  console.log(req.ip);
  next(); // Pass control to the next middleware or route handler
});
app.get('/', (req, res) => {
    // Send the HTML file using res.sendFile()
    res.render("LandingPage/landingpage");
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
});