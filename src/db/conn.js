const { default: mongoose } = require("mongoose");
const DB_URL = "mongodb+srv://tannakrishi1109:tannakrishi1109@cluster0.hcwl9lh.mongodb.net/test2"

const connectDatabase = () => {
mongoose
    .connect(DB_URL)
    .then((data) => {
        console.log("Connection Successful...!!")
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((e) => {
        console.log(e)
    })
}

module.exports = connectDatabase;