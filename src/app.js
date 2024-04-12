const express = require('express')
const cookieparser = require('cookie-parser')
const errorMiddleware = require("./middleware/Error")
const port = process.env.PORT || 3000
const app = express()


app.use(express.json())
app.use(cookieparser()) 

const userRoute = require("./routers/userRoute")
app.use("/user", userRoute)

const foodRoute = require("./routers/foodItemsRoute")
app.use("/food", foodRoute)

const orderRoute = require("./routers/ordersRoute")
app.use("/order", orderRoute)

// Port Listen
app.listen(port, () => {
    console.log(`Connection is live on port number ${port}`)
})

app.use(errorMiddleware)