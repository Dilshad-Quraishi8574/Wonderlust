// if(process.env.NODE_ENV != "production"){
//   require('dotenv').config()
// }
// console.log(process.env.SECRET) // remove this after you've confirmed it is working


const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Database used link in Mongodb Atlas access in .env)
const  dbUrl = process.env.ATLASDB_URL;

const port = 8080;
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
// for boiler plate or template
const ejsMate = require("ejs-mate");
var methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
// requires the model with Passport-Local Mongoose plugged in
const User = require("./models/user");
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Routes Listing are import)
const listingRouter = require("./routes/listing.js")
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Review route are import)
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log(" Connected to db");
  })
  .catch((err) => {
    console.log("Error message " + err);
  });
async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect( dbUrl);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Connect-mongo)

const store=MongoStore.create({ 
  mongoUrl:  dbUrl ,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("Error on the sessong mongo url",err);
})

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Session used)
const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
}
app.use(session(sessionOptions));





// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (flash used)
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (midddlewere used in success and error)
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Random database are create)

// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"dilshadali.8574@gmail.com",
//     username:"Dilshad Quraishi",
//   });

//   let registerUser = await User.register(fakeUser,"helloWorld");
//   res.send(registerUser);
// })

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Routes Listing are used here )
app.use("/listings",listingRouter);
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Route review are used in here)
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// Custume Error handling:
// *********If Search Route but not found******
app.all("*", (req, res, next) => {
  next(new ExpressError(404,"Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong" } = err;
  // res.status(statusCode).send(message);
  res.render("error.ejs",{message,statusCode})
});

// Check server
app.listen(port, () => {
  console.log(`Listen port on ${port}`);
});
