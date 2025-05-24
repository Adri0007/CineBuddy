const express = require("express")
const database = require("./connect")
const ObjectID = require("mongodb").ObjectId

let filmRoutes = express.Router()

//Retrieve All
//http://localhost:3000/filme
filmRoutes.route("/filme").get(async (req, res) => {
    let db = database.getDB()
    let data = await db.collection("Filmliste").find({}).toArray()
    if (data.length > 0) {
        res.json(data)
    } else {
        throw new Error("Data was not found!")
    }
})

module.exports = filmRoutes
