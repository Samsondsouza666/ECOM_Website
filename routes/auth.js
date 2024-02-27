const User = require('../models/User')

const router = require('express').Router()
const cryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

router.post("/register", async (req, res) => {
const newUser =new User({
    username: req.body.username,
    email : req.body.email,
    password:  cryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString(),
})
console.log(req)
try{
    const savedUser = await newUser.save()
    res.status(200).json(savedUser);
}
catch(err) {
    res.status(500).json(err)
    
}

})

router.post("/login", async (req, res) => {
    try{
        const user =await  User.findOne({
            username:req.body.username
        })


        if(!user)
        {
            res.status(401).json("wrong username")
        }

        const hashedPassword = cryptoJS.AES.decrypt(user.password,process.env.PASS_SEC)

        const OriginalPassword = hashedPassword.toString(cryptoJS.enc.Utf8);

        if(OriginalPassword!==req.body.password)
        {
            res.status(401).json("wrong password")
        }
        else
        {
            const accessToken =jwt.sign({
                id:user._id,
                isAdmin:user.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn:"3d"},
            );

            const {password,...others} = user._doc
          res.status(200).json({...others,accessToken});
        }

        }
    catch(err) {
        res.status(500).json(err);
    }
})


router.post("/logout",(req,res)=>{
    const token =req.header('token');
    // console.log(req.cookies);
    if(!token)
      return res.status(401).json("unauthorized")

      try{
          const trimmedToken = token.split(" ")[2]
        const decodedToken = jwt.decode(trimmedToken,process.env.JWT_SEC);
        // console.log(decodedToken);
        if(!decodedToken || !decodedToken.id)  res.status(403).json("invalid token");
        res.cookie('token',"",{httpOnly:true,expires:new Date(0)}) 
      }
      catch(err) {
        res.status(500).json(err);
      }

    res.status(200).json("logged out");
})

module.exports = router
