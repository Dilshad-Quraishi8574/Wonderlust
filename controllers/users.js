const User = require("../models/user.js");

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Render Signup form)
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Submit Form POST(SIGNUP))

module.exports.signup=async(req,res)=>{
 
    try{
        let{ username, email, password}= req.body;
    const newUser = new User({ email, username }); 
    const registerUser= await User.register(newUser,password);
    console.log(registerUser);

    req.login((registerUser),(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to the wonderlust");
        res.redirect("/listings");
    })

  
    }
   catch(error){
    req.flash("error",error.message);
    res.redirect("/signup");
   }
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Login)
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (User login check user register or not )
// Using middleware passport check authenticate or not
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to the Wonderful website");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 
 }

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Logout user)
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Loged you out!");
        res.redirect("/listings");
    })
}