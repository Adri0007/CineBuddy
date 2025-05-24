const connect = require("./connect")
const express = require("express")
const cors = require("cors")
const filme = require("./filmRoutes")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(filme)

app.get('/', (req, res) => {
  res.send('Hallo von CineBuddy-Backend!');
});


app.listen(PORT, () => {
  connect.connectToServer()
  console.log("Server listening to port:", PORT)
})
