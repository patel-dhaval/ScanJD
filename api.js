const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const analyzeRouter = require('./routes/analyze');

app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/analyze', analyzeRouter);

app.get('/', (req, res) => {
    // Send the HTML file using res.sendFile()
    res.send("OPTimal.jobs is onnnn!!!!")
  });

app.listen(3001, () => {
    console.log('Server started on port 3010');
});