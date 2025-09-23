const express = require('express');
require('dotenv').config();
require('./models/db');
const cors = require('cors');

const app = express();
const authRouter = require('./routes/authRouter');

const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send("Express is running Messege from Backend");
});

app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

