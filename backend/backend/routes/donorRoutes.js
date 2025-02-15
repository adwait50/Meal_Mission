const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Donor = require("../models/Donor.js");
const sendEmail = require("../utils/sendEmail.js");
const randomstring = require("randomstring");

const router = express.Router();

const generateOTP = () => randomstring.generate({length: 4, charset: 'numeric'});


//registering the donor(otp sending)
router.post("/register", async(req, res) =>{

    const {name, email, password, phone, address} = req.body;

    try{
    const existingUser = await Donor.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    //otp
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000) // 5 min expiry
    
    //creating and saving new donor
    const donor = new Donor({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        otp,
        otpExpires
    });

    await donor.save();

    await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`)

    res.status(201).json({
        message: "OTP sent to email. Verify to complete registration."
    });
}

    catch (error) {
        res.status(500).json({ message: "Error registering donor" });
      }
});


//verifying otp

router.post("/verify-otp", async(req, res) => {
    const {email, otp} = req.body;

    try{
        const donor = await Donor.findOne({ email });
        
        if(!donor) 
            return res.json(400).json({
            message: "Invalid Email"
        })

        if(donor.isVerified)
             return res.status(400).json({
            message: "Email already verified"
        })
        
        if(donor.otp!==otp || donor.otpExpires < new Date()){
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

    donor.isVerified = true;
    donor.otp = null;
    donor.otpExpires = null;
    await donor.save();

    res.json({ 
        message: "Email verified successfully. You can now log in."
    });
    }
    
    catch (error) {
        res.status(500).json({ message: "Error verifying OTP" });
      }
})


//login of donor

router.post("/login", async(req, res) => {
    const{ email, password } = req.body;

    //wapas se checking ki donor is verified or not
    try {
        const donor = await Donor.findOne({ email });
    
        if (!donor) 
            return res.status(400).json({ 
        message: "Invalid email or password" 
    });

        if (!donor.isVerified) 
            return res.status(400).json({ 
        message: "Email not verified" 
    });

    //comparing pass
    const isMatch = await bcrypt.compare(password, donor.password);

    if (!isMatch)
        return res.status(400).json({
            message: "Invalid email or password"
        });

    //jwt token generate
    const token = jwt.sign({
        id: donor._id
    },process.env.JWT_SECRET);
    
    //responding with token
    res.status(200).json({
            token: token,
    })
}
    catch(error){
        res.status(500).json({
            message: "Error logging in"
        });
    }
});

module.exports = router;
