const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const dbConfig = require('./config/db.config.js');



const app = express();

/* var corsOptions = {
    origin: 'http://localhost:5050'
};

app.use(cors(corsOptions)); */

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to roboto application." });
});

/* app.post("/api/auth/signup", (req, res) => {
  res.json({ message: "Hello , wanna register..." });
});
 */

// Connect to MongoDB Atlas
mongoose.connect(`mongodb+srv://${dbConfig.user}:${dbConfig.password}@cluster0-ga51w.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`, {
  useNewUrlParser: true
})
.then(() =>{
    console.log('Connected to DB');
})
.catch(err => {
    console.log('Error Connecting Database', err);
    process.exit();
});


require('./routes/authentication.routes') (app);
require('./routes/user.routes') (app);


// set port, listen for requests
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

