const express = require('express');
require('dotenv').config();
require('./models/db');
const cors = require('cors');

const app = express();
const authRouter = require('./routes/authRouter');
const dashRouter = require('./routes/dashRouter');
const userRouter = require('./routes/userRouter');
const friendRoutes = require('./routes/friendRouter');
const postRoutes = require('./routes/postRouter');

const PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://skill-sync-frontend-neon.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
const corsOptions = {
  origin: "https://skill-sync-frontend-neon.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// 👇 VERY IMPORTANT for preflight
app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.get('/', (req, res) => {
  res.send("Express is running Messege from Backend");
});

app.use('/auth', authRouter);
app.use('/dash', dashRouter);
app.use('/user', userRouter);
app.use('/friend', friendRoutes);
app.use('/post', postRoutes);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

