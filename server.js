let express = require("express")
let responseTime = require("response-time")
let errorhandler = require("errorhandler")
let morgan = require("morgan")
let mongoose = require("mongoose")
let session = require("express-session")
let bodyParser = require("body-parser")

let app = module.exports.app = exports.app = express()

// Where to find the view files
app.set("views", "./views")
app.engine("html", require("ejs").renderFile)

app.use(morgan("dev"))
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use(express.static("./app"))
app.use(express.static("./build"))
app.use(express.static("./node_modules"))
app.use(express.static("./bower_components"))
app.use(responseTime())
app.use(session({resave: true, saveUninitialized: true, secret: "SOMERANDOMSECRETHERE", cookie: { maxAge: 60000 }}))
app.use(errorhandler())

let models  = require("./server_app/models")
let routes  = require("./server_app/routes")(app)

let port = Number(process.env.PORT || 3000)

let mongoport = process.env.PROD_MONGODB || "mongodb://localhost:27017/brmodeloDB"
// https://mlab.com/

mongoose.set("debug", true)
mongoose.connect(mongoport, function (err) {
 if (err) throw err
  app.listen(port, function () {
    console.log("Mongo running on: " + mongoport)
    console.log("now listening on: " + port)
  })
})
