const mongoose = require('mongoose');
const mongo_url="mongodb+srv://sohamlohote:soham_maongodb1@cluster101.hpwvsti.mongodb.net/SkillSync";
mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log("Database connected");
}).catch((error) => {
    console.error("Database connection failed:", error);
});