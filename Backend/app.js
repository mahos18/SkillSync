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
app.use(
  cors({
    origin: "https://skill-sync-frontend-neon.vercel.app/"
  })
);
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

