## SpecStory

## Building NGO Functionality for Food Donation App (2/14/2025, 12:55:14 AM)

_**User**_

we are making a web app which will connect donors of food to the NGOs okay? i have made the donor things till registration and login and now i want to make the NGO side. do you understand this much?

---

_**Assistant**_

Yes, I understand! You're building a web application that serves as a platform to connect:

1. **Food Donors** (who have excess food to donate)
2. **NGOs** (who can collect and distribute this food to those in need)

You've already implemented the donor-side functionality including:
- Donor registration
- Donor login

And now you want to work on the NGO side of the application with similar functionality. This is a great social initiative that can help reduce food waste while helping those in need.

Would you like help with implementing the NGO registration and login functionality? Or do you have specific questions about how to proceed with the NGO side of the application?

---

_**User**_

ill tell you how i want the ngo thing. see the ngo will register with Name, email, pass, address, Valid proof of ngo documentation. now after the otp verifcation the ngo info needs to be manually verified by the admin, which we will build later. so the ngo will see some waiting for approval message till them. do you understand this much and want any other details for this?

---

_**Assistant**_

Yes, I understand the NGO registration flow you want to implement. Let me break it down to ensure I've got all the details correct:

NGO Registration Process:
1. NGO fills out registration form with:
   - Name
   - Email
   - Password
   - Address
   - NGO documentation proof (file upload)

2. Email verification through OTP

3. After OTP verification:
   - NGO account goes into "pending approval" state
   - NGO sees a "waiting for approval" message when trying to login
   - Admin will need to manually verify the NGO documentation
   - Only after admin approval can the NGO access the platform

Additional details that might be helpful to know:
1. What technology stack are you using for the backend and frontend?
2. Do you need help with the database schema for storing NGO information?
3. What type of file formats do you want to allow for the NGO documentation proof?
4. Do you want to implement any specific validation rules for the registration form?

Please let me know if this understanding is correct and which part you'd like to implement first!

---

_**User**_

can you see my codes and figure out the tech stack by yourself?

---

_**Assistant**_



Yes, of course! Could you please share your existing code files (like the donor registration/login implementation)? Once I see your code, I can:

1. Identify the technology stack you're using
2. Understand your current code structure
3. Suggest NGO implementation that matches your existing coding style and patterns
4. Make sure the new NGO features integrate well with your existing code

Please share the relevant code files and I'll help you implement the NGO functionality!

---

_**User**_

this is my code

---

_**Assistant**_



Ah, now I can see your tech stack! You're using:

1. **Backend**:
   - Node.js with Express.js framework
   - MongoDB (I can tell from the model usage pattern)
   - Authentication using JWT (jsonwebtoken)
   - bcryptjs for password hashing
   - Email functionality with a custom sendEmail utility

2. **Key packages**:
   - randomstring for OTP generation
   - Custom auth middleware
   - Express Router

For the NGO implementation, we should create similar files following your existing pattern. First, let's create the NGO routes file. Here's how we can implement it:

```javascript:backend/routes/ngoRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NGO = require("../models/NGO.js");
const sendEmail = require("../utils/sendEmail.js");
const randomstring = require("randomstring");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

const generateOTP = () => randomstring.generate({length: 4, charset: 'numeric'});

// Register NGO (otp sending)
router.post("/register", async(req, res) => {
    const {name, email, password, address, documentProof} = req.body;

    try {
        const existingNGO = await NGO.findOne({ email });
        if (existingNGO) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
        
        const ngo = new NGO({
            name,
            email,
            password: hashedPassword,
            address,
            documentProof,
            otp,
            otpExpires,
            isApproved: false // Added approval status
        });

        await ngo.save();
        await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`);

        res.status(201).json({
            message: "OTP sent to email. Verify to complete registration."
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering NGO" });
    }
});

// Verify OTP
router.post("/verify-otp", async(req, res) => {
    const {email, otp} = req.body;

    try {
        const ngo = await NGO.findOne({ email });
        
        if(!ngo) return res.status(400).json({ message: "Invalid Email" });
        if(ngo.isVerified) return res.status(400).json({ message: "Email already verified" });
        if(ngo.otp !== otp || ngo.otpExpires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        ngo.isVerified = true;
        ngo.otp = null;
        ngo.otpExpires = null;
        await ngo.save();

        res.json({ 
            message: "Email verified successfully. Please wait for admin approval."
        });
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP" });
    }
});

// NGO Login
router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    try {
        const ngo = await NGO.findOne({ email });
    
        if (!ngo) return res.status(400).json({ message: "Invalid email or password" });
        if (!ngo.isVerified) return res.status(400).json({ message: "Email not verified" });
        if (!ngo.isApproved) return res.status(400).json({ message: "Account pending admin approval" });

        const isMatch = await bcrypt.compare(password, ngo.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({
            id: ngo._id,
            type: 'ngo' // Added to distinguish between donor and NGO
        }, process.env.JWT_SECRET);
        
        res.status(200).json({ token });
    } catch(error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const ngo = await NGO.findById(req.user.id).select("-password");
        if (!ngo) {
            return res.status(404).json({ message: "NGO not found" });
        }
        res.json(ngo);
    } catch (error) {
        res.status(500).json({ message: "Error fetching NGO profile" });
    }
});

router.post("/logout", authMiddleware, async (req, res) => {
    res.json({message: "Logged out successfully"});
});

module.exports = router;
```

The main differences from your donor routes are:
1. Added `isApproved` flag for admin verification
2. Modified login to check for admin approval
3. Added document proof handling in registration
4. Updated messages to reflect NGO-specific flows

Would you also like me to provide the NGO model schema? Also, we'll need to create admin routes for handling the NGO approval process. Let me know what you'd like to work on next!

---

_**User**_

lets make schema now 

---

_**Assistant**_



Based on your donor implementation and the NGO requirements you mentioned, here's the NGO schema:

```javascript:backend/models/NGO.js
const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    documentProof: {
        type: String,  // This will store the file path or URL of the uploaded document
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

const NGO = mongoose.model("NGO", ngoSchema);
module.exports = NGO;
```

Key differences from a typical donor schema:
1. Added `documentProof` field for NGO verification documents
2. Added `isApproved` field for admin approval status
3. Added `registrationDate` to track when the NGO registered

For handling file uploads (documentProof), you might want to:
1. Use multer middleware for file uploads
2. Store files in cloud storage (like AWS S3 or Cloudinary)
3. Store the file URL/path in the documentProof field

Would you like me to help you set up the file upload functionality next? Or would you prefer to work on something else?

---

_**User**_

i want the ngo to upload image in id proof

---

_**Assistant**_



I'll help you set up image upload functionality for NGO ID proof. We'll use multer for handling file uploads. First, let's make the necessary changes:

1. First, install multer:
```bash
npm install multer
```

2. Create a multer configuration file:

```javascript:backend/utils/multerConfig.js
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/ngo-documents/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, 'NGO-' + Date.now() + path.extname(file.originalname))
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});

module.exports = upload;
```

3. Update the NGO routes to handle image upload:

```javascript:backend/routes/ngoRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NGO = require("../models/NGO.js");
const sendEmail = require("../utils/sendEmail.js");
const randomstring = require("randomstring");
const authMiddleware = require("../middlewares/authMiddleware.js");
const upload = require("../utils/multerConfig.js");

const router = express.Router();

// ... existing code ...

// Register NGO with image upload
router.post("/register", upload.single('documentProof'), async(req, res) => {
    const {name, email, password, address} = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload ID proof document" });
        }

        const existingNGO = await NGO.findOne({ email });
        if (existingNGO) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        
        const ngo = new NGO({
            name,
            email,
            password: hashedPassword,
            address,
            documentProof: req.file.path, // Save the file path
            otp,
            otpExpires,
            isApproved: false
        });

        await ngo.save();
        await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`);

        res.status(201).json({
            message: "OTP sent to email. Verify to complete registration."
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering NGO" });
    }
});

// ... rest of your routes ...
```

4. Create the uploads directory in your project:
```bash
mkdir -p uploads/ngo-documents
```

5. Add static file serving to your main Express app file:

```javascript:backend/app.js
// ... other imports ...
const path = require('path');

// ... other middleware ...

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

6. Update your .gitignore to exclude uploaded files:
```text:.gitignore
uploads/
```

To test this, you'll need to send a multipart form-data request with these fields:
- name
- email
- password
- address
- documentProof (file)

Example frontend form HTML:
```html
<form enctype="multipart/form-data" method="POST">
    <input type="text" name="name" placeholder="NGO Name">
    <input type="email" name="email" placeholder="Email">
    <input type="password" name="password" placeholder="Password">
    <textarea name="address" placeholder="Address"></textarea>
    <input type="file" name="documentProof" accept="image/*">
    <button type="submit">Register</button>
</form>
```

Key features of this implementation:
1. Only images are allowed
2. File size limit of 5MB
3. Files are renamed to avoid conflicts
4. Files are stored in uploads/ngo-documents/
5. File paths are stored in the database

Would you like me to explain any part in more detail or help with something else?

---

_**User**_

do i have to add this register route too? or just put this and remove the earlier one?

---

_**Assistant**_



You should remove the earlier register route and replace it with this new one that includes image upload functionality. The new route handles everything the old route did, plus the image upload.

So in your `ngoRoutes.js`, just replace the old register route:

```javascript:backend/routes/ngoRoutes.js
// Remove/replace the old register route with this one
router.post("/register", upload.single('documentProof'), async(req, res) => {
    const {name, email, password, address} = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload ID proof document" });
        }

        const existingNGO = await NGO.findOne({ email });
        if (existingNGO) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        
        const ngo = new NGO({
            name,
            email,
            password: hashedPassword,
            address,
            documentProof: req.file.path, // Save the file path
            otp,
            otpExpires,
            isApproved: false
        });

        await ngo.save();
        await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`);

        res.status(201).json({
            message: "OTP sent to email. Verify to complete registration."
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering NGO" });
    }
});
```

All other routes (verify-otp, login, dashboard, logout) remain the same as before. Just make sure you've:
1. Created the multerConfig.js file
2. Created the uploads directory
3. Updated your app.js to serve static files
4. Added the multer import at the top of ngoRoutes.js

---

_**User**_

btw ive added -ngo to all the routes to distinguish

---

_**Assistant**_



That's a good practice! Yes, adding "-ngo" to the routes helps distinguish between donor and NGO endpoints. Here's how your routes should look with the "-ngo" suffix:

```javascript:backend/routes/ngoRoutes.js
// ... imports remain same ...

// Register route with -ngo suffix
router.post("/register-ngo", upload.single('documentProof'), async(req, res) => {
    // ... registration logic remains same ...
});

// Verify OTP route
router.post("/verify-otp-ngo", async(req, res) => {
    // ... otp verification logic remains same ...
});

// Login route
router.post("/login-ngo", async(req, res) => {
    // ... login logic remains same ...
});

// Dashboard route
router.get("/dashboard-ngo", authMiddleware, async (req, res) => {
    // ... dashboard logic remains same ...
});

// Logout route
router.post("/logout-ngo", authMiddleware, async (req, res) => {
    // ... logout logic remains same ...
});
```

This makes the API endpoints clearer and prevents any potential conflicts with donor routes. Good thinking! Would you like to work on anything else?

---

_**User**_

i dont understand the static file thing,

---

_**Assistant**_



Let me explain the static file serving concept in Express!

When you upload files (like NGO document images), they are saved to your server's filesystem (in the `uploads` folder). However, these files aren't automatically accessible via URLs. To make them accessible, you need to tell Express to "serve" these files statically.

Here's a simple example:

1. Let's say an NGO uploads an image and it's saved as: 
   ```
   uploads/ngo-documents/NGO-1234567890.jpg
   ```

2. Without static file serving, this image isn't accessible via browser/frontend.

3. When you add this line to your app.js:
```javascript:backend/app.js
const express = require('express');
const path = require('path');
const app = express();

// ... other middleware ...

// This line makes the uploads folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

4. Now the image becomes accessible via URL:
   ```
   http://yourdomain.com/uploads/ngo-documents/NGO-1234567890.jpg
   ```

Real-world example:
```javascript:backend/app.js
const express = require('express');
const path = require('path');
const app = express();

// Your existing middleware
app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Your routes
app.use("/api", donorRoutes);
app.use("/api", ngoRoutes);

// ... rest of your code
```

Now when an NGO uploads their document:
1. File gets saved to: `uploads/ngo-documents/NGO-1234567890.jpg`
2. In database, we store this path: `ngo-documents/NGO-1234567890.jpg`
3. Frontend can display the image using: `<img src="/uploads/ngo-documents/NGO-1234567890.jpg">`

Without this static serving, you'd get a 404 error when trying to access the image URL. Think of it like making a specific folder on your server publicly accessible, similar to how public folders work in web hosting!

---

_**User**_

ohh i guess its server.js for me

---

_**Assistant**_





Yes, exactly! If your main server file is `server.js` instead of `app.js`, you'll add the static file serving there. Here's how to add it to your server.js:

```javascript:backend/server.js
const express = require('express');
const path = require('path');
// ... your other imports ...

const app = express();

// Your existing middleware
app.use(express.json());
app.use(cors());
// ... other middleware ...

// Add this line to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Your routes
app.use("/api", donorRoutes);
app.use("/api", ngoRoutes);

// ... rest of your server code ...
```

The concept remains exactly the same - we're just adding it to server.js instead of app.js. After adding this, your uploaded NGO documents will be accessible via URLs like:
```
http://localhost:5000/uploads/ngo-documents/NGO-1234567890.jpg
```
(assuming your server runs on port 5000)

---

_**User**_

i removed the -ngo because i mounted api in server.js

---

_**Assistant**_



Ah yes, if you're mounting your routes with a prefix in server.js like this:

```javascript:backend/server.js
// Your routes with prefixes
app.use("/api/donor", donorRoutes);
app.use("/api/ngo", ngoRoutes);
```

Then you're right! You don't need the "-ngo" suffix because the routes are already distinguished by their base path. Your NGO routes would look like this:

```javascript:backend/routes/ngoRoutes.js
// Register route
router.post("/register", upload.single('documentProof'), async(req, res) => {
    // ... registration logic ...
});

// Verify OTP route
router.post("/verify-otp", async(req, res) => {
    // ... otp verification logic ...
});

// Login route
router.post("/login", async(req, res) => {
    // ... login logic ...
});

// Dashboard route
router.get("/dashboard", authMiddleware, async (req, res) => {
    // ... dashboard logic ...
});

// Logout route
router.post("/logout", authMiddleware, async (req, res) => {
    // ... logout logic ...
});
```

Now your API endpoints will be:
- `api/ngo/register`
- `api/ngo/verify-otp`
- `api/ngo/login`
- `api/ngo/dashboard`
- `api/ngo/logout`

This is actually a cleaner way to organize your routes! Good catch!

---

_**User**_

yea

---

_**Assistant**_



Great! So now you have:

1. NGO Model with image upload capability
2. NGO Routes mounted at `/api/ngo`
3. Static file serving for uploaded images
4. Complete registration flow with OTP verification and pending admin approval

Would you like to:
1. Test the NGO registration with image upload?
2. Work on the admin approval system?
3. Add any additional NGO features?

Let me know what you'd like to tackle next!

---

_**User**_

lets test ngo registeration

---

_**Assistant**_





To test NGO registration with image upload, you'll need to send a multipart form-data request. Here are a few ways to test it:

1. **Using Postman**:
   - Create a new POST request to `http://localhost:5000/api/ngo/register`
   - Select "Body" → "form-data"
   - Add these key-value pairs:
     ```
     name: Test NGO
     email: testngo@example.com
     password: yourpassword
     address: Test Address, City
     documentProof: [Select File] (select an image file)
     ```

2. **Using Thunder Client (VS Code Extension)**:
   - Create a new POST request to `http://localhost:5000/api/ngo/register`
   - Select "Body" → "Form"
   - Add the same fields as above

3. **Using cURL command**:
```bash
curl -X POST http://localhost:5000/api/ngo/register \
  -F "name=Test NGO" \
  -F "email=testngo@example.com" \
  -F "password=yourpassword" \
  -F "address=Test Address, City" \
  -F "documentProof=@/path/to/your/image.jpg"
```

Expected successful response:
```json
{
    "message": "OTP sent to email. Verify to complete registration."
}
```

Then you can:
1. Check your email for the OTP
2. Verify the OTP using `/api/ngo/verify-otp`
3. Check the `uploads/ngo-documents` folder to see if the image was saved
4. Try logging in (it should show pending approval message)

Would you like me to show you how to test any specific part of this flow?

---

_**User**_

fix this

---

_**Assistant**_



You need to import the `path` module at the top of your server.js file. Add this line with your other imports:

```javascript:backend/server.js
const express = require('express');
const path = require('path');  // Add this line
// ... other imports ...

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ... rest of your code
```

The `path` module is a built-in Node.js module that helps with file and directory paths. You just need to require it before using it. After adding this import, the error should be resolved!

---

_**User**_

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot POST /api/ngo/register</pre>
</body>
</html>


---

_**Assistant**_



This error usually means either:

1. The route isn't properly registered, or
2. The route path doesn't match exactly

Let's verify your setup:

1. First, check your `server.js`:
```javascript:backend/server.js
const express = require('express');
const path = require('path');
const ngoRoutes = require('./routes/ngoRoutes');  // Make sure this path is correct

// ... other code ...

// Make sure this line exists
app.use("/api/ngo", ngoRoutes);
```

2. And in your `ngoRoutes.js`, make sure you have:
```javascript:backend/routes/ngoRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig.js");  // Make sure this path is correct

// Make sure the route is defined exactly like this
router.post("/register", upload.single('documentProof'), async(req, res) => {
    // ... your registration code ...
});

module.exports = router;  // Make sure you're exporting the router
```

3. Also, make sure the `uploads` directory exists:
```bash
mkdir -p uploads/ngo-documents
```

Could you confirm:
1. Are all these files in the correct locations?
2. Have you imported and registered the ngoRoutes in your server.js?
3. Are you getting any console errors in your terminal?

---

_**User**_

its done, but its asking for pleas u

---

_**Assistant**_





Ah, you're getting the "Please upload ID proof document" error because we added this validation in the registration route. This means the route is working, but the image isn't being sent correctly.

When testing with Postman:

1. Make sure you're selecting the correct field name:
   - The key should be exactly `documentProof` (case sensitive)
   - Select "File" as the type (not Text)
   - Choose an image file

Here's how it should look in Postman:
```
Key: documentProof (Type: File)
Key: name (Type: Text)
Key: email (Type: Text)
Key: password (Type: Text)
Key: address (Type: Text)
```

If you're still getting the error, let's check the route handler. Here's the relevant part:

```javascript:backend/routes/ngoRoutes.js
router.post("/register", upload.single('documentProof'), async(req, res) => {
    const {name, email, password, address} = req.body;

    try {
        // This is the check that's triggering
        if (!req.file) {
            return res.status(400).json({ message: "Please upload ID proof document" });
        }
        
        // ... rest of the code ...
    } catch (error) {
        res.status(500).json({ message: "Error registering NGO" });
    }
});
```

Can you show me how you're making the request in Postman? That will help me identify the exact issue.

---

_**User**_

{
    "message": "Error registering NGO"
}

---

_**Assistant**_





This means we're hitting the catch block in our route. Let's add better error logging to see what's going wrong:

```javascript:backend/routes/ngoRoutes.js
router.post("/register", upload.single('documentProof'), async(req, res) => {
    const {name, email, password, address} = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload ID proof document" });
        }

        const existingNGO = await NGO.findOne({ email });
        if (existingNGO) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        
        const ngo = new NGO({
            name,
            email,
            password: hashedPassword,
            address,
            documentProof: req.file.path,
            otp,
            otpExpires,
            isApproved: false
        });

        await ngo.save();
        await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`);

        res.status(201).json({
            message: "OTP sent to email. Verify to complete registration."
        });
    } catch (error) {
        console.error("NGO Registration Error:", error); // Add this line
        res.status(500).json({ 
            message: "Error registering NGO",
            error: error.message  // Add this line to see the specific error
        });
    }
});
```

This will show us the actual error in both:
1. Your server console logs
2. The API response

Could you try the registration again and share what error message you get? This will help us pinpoint the exact issue.

Also, make sure:
1. The `uploads` and `uploads/ngo-documents` directories exist
2. These directories have write permissions
3. MongoDB is running and connected

---

_**User**_

{
    "message": "Error registering NGO",
    "error": "NGO is not defined"

---

_**Assistant**_





Ah! The error is clear - we forgot to import the NGO model! Add this import at the top of your ngoRoutes.js file:

```javascript:backend/routes/ngoRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NGO = require("../models/NGO.js");  // Add this line
const sendEmail = require("../utils/sendEmail.js");
const randomstring = require("randomstring");
const authMiddleware = require("../middlewares/authMiddleware.js");
const upload = require("../utils/multerConfig.js");

const router = express.Router();
// ... rest of your code ...
```

The error occurred because we were trying to use the `NGO` model (`await NGO.findOne({ email })`) without importing it first. After adding this import, the registration should work properly. Try the registration request again!

---

_**User**_

{
    "message": "Error registering NGO",
    "error": "Cannot access 'ngo' before initialization"
}

---

_**Assistant**_





Ah, we need to move the `generateOTP` function definition before we use it. Let's reorganize the code in `ngoRoutes.js`:

```javascript:backend/routes/ngoRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NGO = require("../models/NGO.js");
const sendEmail = require("../utils/sendEmail.js");
const randomstring = require("randomstring");
const authMiddleware = require("../middlewares/authMiddleware.js");
const upload = require("../utils/multerConfig.js");

const router = express.Router();

// Move this function definition to the top
const generateOTP = () => randomstring.generate({length: 4, charset: 'numeric'});

router.post("/register", upload.single('documentProof'), async(req, res) => {
    const {name, email, password, address} = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload ID proof document" });
        }

        const existingNGO = await NGO.findOne({ email });
        if (existingNGO) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        
        const ngo = new NGO({
            name,
            email,
            password: hashedPassword,
            address,
            documentProof: req.file.path,
            otp,
            otpExpires,
            isApproved: false
        });

        await ngo.save();
        await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`);

        res.status(201).json({
            message: "OTP sent to email. Verify to complete registration."
        });
    } catch (error) {
        console.error("NGO Registration Error:", error);
        res.status(500).json({ 
            message: "Error registering NGO",
            error: error.message
        });
    }
});

// ... rest of your routes ...

module.exports = router;
```

The error occurred because we were trying to use the `generateOTP` function before it was defined. Moving it to the top of the file should fix this error. Try the registration again!

---

_**User**_

{
    "message": "Error registering NGO",
    "error": "Cannot access 'NGO' before initialization"
}

---

_**Assistant**_







This error suggests we need to fix the order of our imports and model definition. Let's check both files:

1. First, make sure your `NGO.js` model file looks like this:

```javascript:backend/models/NGO.js
const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    documentProof: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("NGO", ngoSchema);
```

2. Then update your `ngoRoutes.js`:

```javascript:backend/routes/ngoRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const NGO = require("../models/NGO");
const sendEmail = require("../utils/sendEmail.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const upload = require("../utils/multerConfig.js");

const generateOTP = () => randomstring.generate({length: 4, charset: 'numeric'});

// ... rest of your routes ...
```

The key changes are:
1. In the NGO model file, we're using `module.exports = mongoose.model("NGO", ngoSchema);` instead of creating a separate constant
2. In the routes file, we're importing the model directly

Try the registration again after making these changes!

---

_**User**_

same error agaib

---

_**Assistant**_





Let's try a different approach. The issue might be with circular dependencies. Let's modify both files:

1. First, rename your model file to `ngoModel.js`:

```javascript:backend/models/ngoModel.js
const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    documentProof: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

const NGOModel = mongoose.model("NGO", ngoSchema);
module.exports = NGOModel;
```

2. Then update your routes file:

```javascript:backend/routes/ngoRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const NGOModel = require("../models/ngoModel");  // Updated import
const sendEmail = require("../utils/sendEmail.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const upload = require("../utils/multerConfig.js");

const generateOTP = () => randomstring.generate({length: 4, charset: 'numeric'});

router.post("/register", upload.single('documentProof'), async(req, res) => {
    const {name, email, password, address} = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload ID proof document" });
        }

        const existingNGO = await NGOModel.findOne({ email });  // Updated
        if (existingNGO) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        
        const ngo = new NGOModel({  // Updated
            name,
            email,
            password: hashedPassword,
            address,
            documentProof: req.file.path,
            otp,
            otpExpires,
            isApproved: false
        });

        await ngo.save();
        await sendEmail(email, "Your OTP code", `Your OTP is: ${otp}`);

        res.status(201).json({
            message: "OTP sent to email. Verify to complete registration."
        });
    } catch (error) {
        console.error("NGO Registration Error:", error);
        res.status(500).json({ 
            message: "Error registering NGO",
            error: error.message
        });
    }
});

// ... rest of your routes ...

module.exports = router;
```

Key changes:
1. Renamed model file to `ngoModel.js`
2. Created and exported the model as `NGOModel`
3. Updated all references in the routes file to use `NGOModel`

Try the registration again after making these changes. Also, make sure MongoDB is running and properly connected in your server.js file.

---

_**User**_

similarly i want to rename donor to donorModel, tell me what changes should i do

---

_**Assistant**_





Here are the changes needed to rename the Donor model:

1. First, rename your `Donor.js` to `donorModel.js`:

```javascript:backend/models/donorModel.js
const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
    // ... your existing schema ...
});

const DonorModel = mongoose.model("Donor", donorSchema);
module.exports = DonorModel;
```

2. Then update your `donorRoutes.js`:

```javascript:backend/routes/donorRoutes.js
const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const DonorModel = require("../models/donorModel.js");  // Updated import
const sendEmail = require("../utils/sendEmail.js");
const randomstring = require("randomstring");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

const generateOTP = () => randomstring.generate({length: 4, charset: 'numeric'});

// Update all Donor references to DonorModel in your routes
router.post("/register", async(req, res) =>{
    // ... existing code ...
    const existingUser = await DonorModel.findOne({ email });
    // ... existing code ...
    const donor = new DonorModel({
        // ... existing code ...
    });
    // ... rest of the code ...
});

router.post("/verify-otp", async(req, res) => {
    // ... existing code ...
    const donor = await DonorModel.findOne({ email });
    // ... rest of the code ...
});

router.post("/login", async(req, res) => {
    // ... existing code ...
    const donor = await DonorModel.findOne({ email });
    // ... rest of the code ...
});

router.get("/Dashboard", authMiddleware, async (req, res) => {
    try {
        const donor = await DonorModel.findById(req.user.id).select("-password");
        // ... rest of the code ...
    } catch (error) {
        // ... error handling ...
    }
});

// ... rest of your routes ...

module.exports = router;
```

3. If you're using the Donor model in any other files (like authMiddleware.js), update those imports too:

```javascript:backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const DonorModel = require("../models/donorModel.js");  // Update this line if it exists
```

The main changes are:
1. Rename the file from `Donor.js` to `donorModel.js`
2. Update the model export to use `DonorModel`
3. Update all imports to use the new file name
4. Update all references from `Donor` to `DonorModel` in your routes

This will make your naming convention consistent across both donor and NGO related files!

---

_**User**_

okay so it says otp sent now

---

_**Assistant**_



Great! The NGO registration is working now. Let's test the complete flow:

1. You've already completed registration and received the OTP
2. Now you should verify the OTP using the `/api/ngo/verify-otp` endpoint

In Postman:
- POST request to `http://localhost:5000/api/ngo/verify-otp`
- Body (JSON):
```json
{
    "email": "your-test-email@example.com",
    "otp": "1234"  // the OTP you received in your email
}
```

After successful OTP verification, you should:
1. Get a success message about waiting for admin approval
2. Try logging in (which should show a pending approval message)
3. Check your database to confirm the NGO was saved
4. Check the `uploads/ngo-documents` folder to confirm the image was saved

Would you like to try any of these steps?

---

_**User**_

{
    "message": "Email verified successfully. Please wait for admin approval."
}

---

_**Assistant**_





Perfect! The OTP verification worked successfully. Now let's test the login to confirm the admin approval flow is working.

Try logging in with the NGO credentials:

In Postman:
- POST request to `http://localhost:5000/api/ngo/login`
- Body (JSON):
```json
{
    "email": "your-test-email@example.com",
    "password": "your-password"
}
```


You should get a response saying the account is pending admin approval. This means:
1. ✅ NGO Registration worked
2. ✅ OTP Verification worked
3. ✅ Document upload worked
4. ✅ Pending approval status is set

Would you like to:
1. Test the login to confirm the approval message?
2. Start working on the admin panel for approving NGOs?
3. Check anything else in the current implementation?

---

_**User**_

{
    "message": "Account pending admin approval"
}

---

_**Assistant**_





Perfect! Everything is working as intended:

1. ✅ NGO Registration with document upload
2. ✅ OTP Verification
3. ✅ Login with pending approval message

Now we need to create the admin functionality to:
1. View pending NGO applications
2. Review uploaded documents
3. Approve/reject NGO registrations

Would you like to start working on the admin panel next? We'll need to:
1. Create admin model/routes
2. Create endpoints to list pending NGOs
3. Add approve/reject functionality
4. Secure these routes with admin-only access

Which part would you like to tackle first?

---

_**User**_

i committed my files now how can i push?

---

_**Assistant**_





Here's how to push your committed files to GitHub:

1. First, if you haven't connected your local repository to GitHub yet, you need to add the remote:
```bash
git remote add origin <your-github-repo-url>
```

2. Then push your commits:
```bash
git push -u origin main
```
(or `master` instead of `main` depending on your branch name)

If this is your first time pushing, you might need to:
1. Set up your GitHub credentials
2. Create a Personal Access Token on GitHub if you're using HTTPS

Would you like me to explain any of these steps in more detail?

Also, before pushing, you might want to:
1. Check if you have a `.gitignore` file to exclude the `uploads` folder and any sensitive information
2. Check your current branch name with `git branch`
3. Check what files are being pushed with `git status`

---

_**User**_

fix

---

_**Assistant**_





You need to add the remote repository first. Here's how:

1. First, go to your GitHub repository and copy the repository URL. It will look something like:
```
https://github.com/yourusername/meal-mission.git
```

2. Then, in your terminal, add the remote:
```bash
git remote add origin https://github.com/yourusername/meal-mission.git
```

3. Now try pushing again:
```bash
git push -u origin adwait
```

If you're not sure about your repository URL:
1. Go to your GitHub repository in browser
2. Click the green "Code" button
3. Copy the HTTPS URL

Let me know if you need the exact repository URL or if you get any other errors!

---



---

