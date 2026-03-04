## SpecStory

## Dashboard Design Workflow and Suggestions (2/16/2025, 10:33:33 PM)

_**User**_

we have to design this dashboard, but we wont take any requests or anything from dashboard, this will just have the buttons and info for everything. do you understand? also tell me workflow and suggestions

---

_**Assistant**_

I understand that this is a dashboard design for FoodShare where we need to create a UI layout similar to the image, but without implementing the actual functionality yet. Let me break down the components and suggest a workflow:

**Components Needed:**
1. Sidebar
   - Logo
   - Navigation menu items (Dashboard, Donations, Profile, Settings)
   - User profile section at bottom

2. Main Content Area
   - Welcome header
   - Three main cards:
     - Request Food Pickup (with yellow button)
     - Active Requests (with status button)
     - Donation History (with history button)

**Suggested Workflow:**
1. First create the basic layout structure (sidebar + main content)
2. Build the sidebar components
3. Create reusable card components
4. Implement the main content area
5. Add styling and responsiveness

**Technical Suggestions:**
1. Use a CSS framework like Tailwind CSS or CSS modules for styling
2. Create reusable components for:
   - Navigation items
   - Cards
   - Buttons
3. Use CSS Grid or Flexbox for layout
4. Implement dark mode as shown in the design
5. Use icons from a library like Heroicons or Font Awesome

Here's a basic component structure I would suggest:

```tsx
// components/Dashboard/Layout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

// components/Dashboard/Sidebar.tsx
const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800">
      <div className="p-4">
        <Logo />
        <nav className="mt-8">
          <NavItem icon={HomeIcon} label="Dashboard" active />
          <NavItem icon={GiftIcon} label="Donations" />
          <NavItem icon={UserIcon} label="Profile" />
          <NavItem icon={CogIcon} label="Settings" />
        </nav>
      </div>
      <UserProfile />
    </aside>
  );
};

// components/Dashboard/Card.tsx
interface DashboardCardProps {
  title: string;
  description: string;
  actionLabel: string;
  icon?: string;
  onAction?: () => void;
}

const DashboardCard = ({ title, description, actionLabel }: DashboardCardProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-white text-xl font-semibold">{title}</h3>
      <p className="text-gray-400 mt-2">{description}</p>
      <button className="bg-yellow-500 px-4 py-2 rounded mt-4">
        {actionLabel}
      </button>
    </div>
  );
};
```

**Additional Suggestions:**
1. Implement proper color variables/themes for consistency
2. Add hover states for interactive elements
3. Include loading states for the cards
4. Add proper spacing between elements
5. Make sure the design is accessible (proper contrast, aria labels)
6. Add animations for better user experience
7. Consider mobile responsiveness from the start

Would you like me to provide more detailed code for any specific component or would you like to discuss any particular aspect of the design in more detail?

---

_**User**_

not frontend, tell me about the backend part, what should we do?

---

_**Assistant**_

Ah, for the backend of this FoodShare dashboard, we'll need to set up several components. Here's a comprehensive breakdown:

**1. Database Schema:**
```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    restaurant_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donations Table
CREATE TABLE donations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    status VARCHAR(50), -- (pending, scheduled, completed, cancelled)
    pickup_date TIMESTAMP,
    food_description TEXT,
    quantity INTEGER,
    temperature_requirements VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Pickup Schedules Table
CREATE TABLE pickup_schedules (
    id UUID PRIMARY KEY,
    donation_id UUID REFERENCES donations(id),
    scheduled_time TIMESTAMP,
    pickup_notes TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. API Endpoints Structure:**
```typescript
// API Routes
interface Routes {
  // Authentication
  'POST /api/auth/login'
  'POST /api/auth/logout'
  'POST /api/auth/refresh'

  // User Management
  'GET /api/users/profile'
  'PUT /api/users/profile'
  
  // Donations
  'GET /api/donations' // List all donations with pagination
  'GET /api/donations/:id' // Get specific donation
  'GET /api/donations/active' // Get active donations
  'GET /api/donations/history' // Get donation history
  
  // Statistics
  'GET /api/stats/impact' // Get donation impact statistics
  'GET /api/stats/monthly' // Get monthly donation statistics
}
```

**3. Core Services Structure:**
```typescript
// services/DonationService.ts
interface DonationService {
  async createDonation(data: CreateDonationDTO): Promise<Donation>;
  async getDonationsByUser(userId: string, filters: DonationFilters): Promise<PaginatedResponse<Donation>>;
  async updateDonationStatus(donationId: string, status: DonationStatus): Promise<Donation>;
  async getDonationStatistics(userId: string): Promise<DonationStats>;
}

// services/UserService.ts
interface UserService {
  async getUserProfile(userId: string): Promise<UserProfile>;
  async updateUserProfile(userId: string, data: UpdateProfileDTO): Promise<UserProfile>;
  async getDonationHistory(userId: string): Promise<DonationHistory>;
}

// services/NotificationService.ts
interface NotificationService {
  async sendPickupConfirmation(donationId: string): Promise<void>;
  async sendStatusUpdate(donationId: string, status: DonationStatus): Promise<void>;
}
```

**4. Implementation Suggestions:**

1. **Authentication & Authorization:**
```typescript
// middleware/auth.ts
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedError();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
```

2. **Error Handling:**
```typescript
// utils/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

// middleware/errorHandler.ts
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      code: error.code,
      message: error.message
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};
```

3. **Donation Controller Example:**
```typescript
// controllers/DonationController.ts
export class DonationController {
  constructor(private donationService: DonationService) {}

  async getDonationHistory = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const donations = await this.donationService.getDonationsByUser(
      userId,
      { page, limit, status: 'completed' }
    );

    return res.json({
      status: 'success',
      data: donations
    });
  };

  async getActiveDonations = async (req: Request, res: Response) => {
    const userId = req.user.id;
    
    const activeDonations = await this.donationService.getDonationsByUser(
      userId,
      { status: ['pending', 'scheduled'] }
    );

    return res.json({
      status: 'success',
      data: activeDonations
    });
  };
}
```

**5. Additional Technical Considerations:**

1. **Caching Strategy:**
```typescript
// services/CacheService.ts
import Redis from 'ioredis';

export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async cacheStats(userId: string, stats: DonationStats): Promise<void> {
    await this.redis.setex(
      `stats:${userId}`,
      3600, // 1 hour
      JSON.stringify(stats)
    );
  }
}
```

2. **Background Jobs:**
```typescript
// jobs/NotificationJob.ts
import Bull from 'bull';

const notificationQueue = new Bull('notifications', {
  redis: process.env.REDIS_URL
});

notificationQueue.process(async (job) => {
  const { donationId, type } = job.data;
  // Process notification
});
```

3. **Logging:**
```typescript
// utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

Would you like me to elaborate on any of these components or discuss other aspects of the backend architecture?

---

_**User**_

my tech stack is js mongo express

---

_**Assistant**_



I'll revise the backend structure for a MERN stack (MongoDB, Express, Node.js) application. Here's the breakdown:

**1. MongoDB Schema Models:**

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  restaurantName: { type: String, required: true },
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

// models/Donation.js
const donationSchema = new mongoose.Schema({
  

---

_**User**_

now lets code the Request pickup thing where the user will have to give name address phone Food quantity, type, preferred pickup time, alt phone number

---

_**Assistant**_

I'll help you create the backend structure for the food donation request pickup form. Let's break this down into the model, route, and controller.

**1. MongoDB Model:**

```javascript
// models/Donation.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // Restaurant Info
  restaurantName: { 
    type: String, 
    required: true 
  },
  contactPerson: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  altPhone: { 
    type: String 
  },
  address: { 
    type: String, 
    required: true 
  },

  // Donation Details
  foodItems: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  pickupDate: { 
    type: Date, 
    required: true 
  },
  additionalNotes: { 
    type: String 
  },

  // Metadata
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Donation', donationSchema);
```

**2. Controller:**

```javascript
// controllers/donationController.js
const Donation = require('../models/Donation');

const donationController = {
  // Create new donation request
  createDonation: async (req, res) => {
    try {
      const {
        restaurantName,
        contactPerson,
        phone,
        altPhone,
        address,
        foodItems,
        quantity,
        pickupDate,
        additionalNotes
      } = req.body;

      // Validate required fields
      if (!restaurantName || !contactPerson || !phone || !foodItems || !quantity || !pickupDate) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Create new donation
      const newDonation = new Donation({
        restaurantName,
        contactPerson,
        phone,
        altPhone,
        address,
        foodItems,
        quantity,
        pickupDate: new Date(pickupDate),
        additionalNotes,
        userId: req.user._id // Assuming you have user info from auth middleware
      });

      await newDonation.save();

      res.status(201).json({
        success: true,
        message: 'Donation request created successfully',
        data: newDonation
      });

    } catch (error) {
      console.error('Error in createDonation:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get all donations for a user
  getUserDonations: async (req, res) => {
    try {
      const donations = await Donation.find({ userId: req.user._id })
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: donations
      });

    } catch (error) {
      console.error('Error in getUserDonations:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get single donation by ID
  getDonationById: async (req, res) => {
    try {
      const donation = await Donation.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!donation) {
        return res.status(404).json({
          success: false,
          message: 'Donation not found'
        });
      }

      res.status(200).json({
        success: true,
        data: donation
      });

    } catch (error) {
      console.error('Error in getDonationById:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = donationController;
```

**3. Routes:**

```javascript
// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../middleware/auth');

// All routes are protected with auth middleware
router.use(auth);

// Create new donation request
router.post('/create', donationController.createDonation);

// Get all donations for logged in user
router.get('/my-donations', donationController.getUserDonations);

// Get specific donation by ID
router.get('/:id', donationController.getDonationById);

module.exports = router;
```

**4. Basic Auth Middleware:**

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};
```

**5. Server Setup:**

```javascript
// app.js
const express = require('express');
const mongoose = require('mongoose');
const donationRoutes = require('./routes/donationRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/donations', donationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

To use this API:

1. Create a new donation:
```javascript
POST /api/donations/create
{
  "restaurantName": "Restaurant Name",
  "contactPerson": "John Doe",
  "phone": "1234567890",
  "altPhone": "0987654321",
  "address": "123 Main St",
  "foodItems": "Rice, Curry, Bread",
  "quantity": 10,
  "pickupDate": "2024-02-20T15:00:00Z",
  "additionalNotes": "Please bring containers"
}
```

2. Get all donations:
```javascript
GET /api/donations/my-donations
```

3. Get specific donation:
```javascript
GET /api/donations/:id
```

Make sure to:
1. Add proper input validation
2. Implement rate limiting
3. Add logging
4. Add error handling for edge cases
5. Implement proper security measures
6. Add documentation for the API endpoints

Would you like me to elaborate on any of these aspects or add additional functionality?

---

_**User**_

Add input validation, and whats rate limiting?

---

_**Assistant**_



I'll add input validation using `express-validator` and explain rate limiting with `express-rate-limit`. Here's how to implement both:

**1. Input Validation:**
First, install the required package:
```bash
npm install express-validator
```

```javascript
// middleware/validateDonation.js
const { body, validationResult } = require('express-validator');

const donationValidationRules = [
  // Restaurant Name
  body('restaurantName')
    .trim()
    .notEmpty().withMessage('Restaurant name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Restaurant name must be between 2 and 100 characters'),

  // Contact Person
  body('contactPerson')
    .trim()
    .notEmpty().withMessage('Contact person name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Contact person name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Contact person name can only contain letters and spaces'),

  // Phone
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[\d\s-]{10,}$/).withMessage('Please enter a valid phone number'),

  // Alt Phone (optional)
  body('altPhone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s-]{10,}$/).withMessage('Please enter a valid phone number'),

  // Address
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),

  // Food Items
  body('foodItems')
    .trim()
    .notEmpty().withMessage('Food items description is required')
    .isLength({ min: 3, max: 500 }).withMessage('Food items description must be between 3 and 500 characters'),

  // Quantity
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isFloat({ min: 0.1, max: 1000 }).withMessage('Quantity must be between 0.1 and 1000 kg'),

  // Pickup Date
  body('pickupDate')
    .notEmpty().withMessage('Pickup date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      const pickupDate = new Date(value);
      const now = new Date();
      if (pickupDate < now) {
        throw new Error('Pickup date cannot be in the past');
      }
      // Ensure pickup date is not more than 7 days in the future
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 7);
      if (pickupDate > maxDate) {
        throw new Error('Pickup date cannot be more than 7 days in the future');
      }
      return true;
    }),

  // Additional Notes (optional)
  body('additionalNotes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Additional notes cannot exceed 500 characters')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  donationValidationRules,
  validate
};
```

**2. Rate Limiting:**
Rate limiting helps protect your API from abuse by limiting how many requests a user can make within a specific time period.

Install the package:
```bash
npm install express-rate-limit
```

```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false
});

// Specific limiter for donation creation
const donationCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 donation requests per hour
  message: {
    success: false,
    message: 'Too many donation requests. Please try again in an hour.'
  }
});

module.exports = {
  globalLimiter,
  donationCreateLimiter
};
```

**3. Updated Routes with Validation and Rate Limiting:**

```javascript
// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../middleware/auth');
const { donationValidationRules, validate } = require('../middleware/validateDonation');
const { globalLimiter, donationCreateLimiter } = require('../middleware/rateLimiter');

// Apply global rate limiter to all routes
router.use(globalLimiter);

// Apply auth middleware to all routes
router.use(auth);

// Create new donation request with validation and specific rate limiting
router.post('/create', 
  donationCreateLimiter,
  donationValidationRules,
  validate,
  donationController.createDonation
);

// Other routes...
router.get('/my-donations', donationController.getUserDonations);
router.get('/:id', donationController.getDonationById);

module.exports = router;
```

**4. Updated Controller with Validation Response:**

```javascript
// controllers/donationController.js
const createDonation = async (req, res) => {
  try {
    // Request is already validated by middleware
    const {
      restaurantName,
      contactPerson,
      phone,
      altPhone,
      address,
      foodItems,
      quantity,
      pickupDate,
      additionalNotes
    } = req.body;

    const newDonation = new Donation({
      restaurantName,
      contactPerson,
      phone,
      altPhone,
      address,
      foodItems,
      quantity,
      pickupDate: new Date(pickupDate),
      additionalNotes,
      userId: req.user._id
    });

    await newDonation.save();

    res.status(201).json({
      success: true,
      message: 'Donation request created successfully',
      data: newDonation
    });

  } catch (error) {
    console.error('Error in createDonation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
```

Now your API has:
1. Proper input validation with meaningful error messages
2. Protection against spam/abuse through rate limiting
3. Different rate limits for different endpoints
4. Validation for:
   - Required fields
   - String lengths
   - Phone number formats
   - Date validity
   - Numeric ranges
   - Character restrictions

The rate limiter will help prevent:
- Brute force attacks
- DOS attacks
- API abuse
- Server overload

Would you like me to explain any part in more detail or add additional validations?

---

_**User**_

can you simplify the code and remove any optional stuff? also i dont have any seperate controller files

---

_**Assistant**_



I'll simplify the code and combine everything into a single file for easier understanding. Here's a simplified version:

```javascript
// index.js or app.js
const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

// Basic rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per window
});

app.use(limiter);

// MongoDB Connection
mongoose.connect('your_mongodb_uri')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Donation Model
const donationSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  foodItems: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickupDate: { type: Date, required: true },
  additionalNotes: String,
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);

// Validation Rules
const donationValidation = [
  body('restaurantName').notEmpty().trim(),
  body('contactPerson').notEmpty().trim(),
  body('phone').notEmpty().trim(),
  body('address').notEmpty().trim(),
  body('foodItems').notEmpty().trim(),
  body('quantity').isFloat({ min: 0.1 }),
  body('pickupDate').notEmpty().isISO8601(),
];

// Routes
app.post('/api/donations', donationValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const donation = new Donation({
      restaurantName: req.body.restaurantName,
      contactPerson: req.body.contactPerson,
      phone: req.body.phone,
      address: req.body.address,
      foodItems: req.body.foodItems,
      quantity: req.body.quantity,
      pickupDate: req.body.pickupDate,
      additionalNotes: req.body.additionalNotes
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Donation request created successfully',
      data: donation
    });

  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating donation'
    });
  }
});

// Get all donations
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donations'
    });
  }
});

// Get single donation
app.get('/api/donations/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }
    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donation'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

To use this API:

1. Create a new donation:
```javascript
POST /api/donations
{
  "restaurantName": "Restaurant Name",
  "contactPerson": "John Doe",
  "phone": "1234567890",
  "address": "123 Main St",
  "foodItems": "Rice, Curry",
  "quantity": 10,
  "pickupDate": "2024-02-20T15:00:00Z",
  "additionalNotes": "Please bring containers"
}
```

2. Get all donations:
```javascript
GET /api/donations
```

3. Get specific donation:
```javascript
GET /api/donations/:id
```

This simplified version includes:
- Basic model structure
- Essential validation
- Basic rate limiting
- Core CRUD operations
- Error handling

You'll need to install these packages:
```bash
npm install express mongoose express-validator express-rate-limit
```

Would you like me to explain any part in more detail?

---

_**User**_

seperate these codes but i dont want any controllers file okay?

---

_**Assistant**_



I'll separate the code into different files for better organization, without using controllers. Here's the structure:

```
project/
├── models/
│   └── Donation.js
├── routes/
│   └── donationRoutes.js
├── middleware/
│   └── validation.js
└── app.js
```

**1. models/Donation.js:**
```javascript
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  foodItems: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickupDate: { type: Date, required: true },
  additionalNotes: String,
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
```

**2. middleware/validation.js:**
```javascript
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per window
});

// Validation rules
const donationValidation = [
  body('restaurantName').notEmpty().trim(),
  body('contactPerson').notEmpty().trim(),
  body('phone').notEmpty().trim(),
  body('address').notEmpty().trim(),
  body('foodItems').notEmpty().trim(),
  body('quantity').isFloat({ min: 0.1 }),
  body('pickupDate').notEmpty().isISO8601(),
];

// Validation check middleware
const validateDonation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  limiter,
  donationValidation,
  validateDonation
};
```

**3. routes/donationRoutes.js:**
```javascript
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { donationValidation, validateDonation } = require('../middleware/validation');

// Create donation
router.post('/', donationValidation, validateDonation, async (req, res) => {
  try {
    const donation = new Donation({
      restaurantName: req.body.restaurantName,
      contactPerson: req.body.contactPerson,
      phone: req.body.phone,
      address: req.body.address,
      foodItems: req.body.foodItems,
      quantity: req.body.quantity,
      pickupDate: req.body.pickupDate,
      additionalNotes: req.body.additionalNotes
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Donation request created successfully',
      data: donation
    });

  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating donation'
    });
  }
});

// Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donations'
    });
  }
});

// Get single donation
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }
    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donation'
    });
  }
});

module.exports = router;
```

**4. app.js:**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const donationRoutes = require('./routes/donationRoutes');
const { limiter } = require('./middleware/validation');

const app = express();

// Middleware
app.use(express.json());
app.use(limiter);

// MongoDB Connection
mongoose.connect('your_mongodb_uri')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/donations', donationRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

To use this API:
1. Install dependencies:
```bash
npm install express mongoose express-validator express-rate-limit
```

2. Create a `.env` file with your MongoDB URI:
```
MONGODB_URI=your_mongodb_connection_string
```

3. The API endpoints remain the same:
- POST `/api/donations` - Create donation
- GET `/api/donations` - Get all donations
- GET `/api/donations/:id` - Get specific donation

Would you like me to explain any part in more detail?

---

_**User**_

i want proof of food too in this where user has to attach a photo proof

---

_**Assistant**_



I'll modify the code to include image upload functionality using `multer` for handling file uploads. We'll store the images in the server and save the file path in MongoDB.

First, install multer:
```bash
npm install multer
```

Here's the updated code:

**1. models/Donation.js:**
```javascript
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  foodItems: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickupDate: { type: Date, required: true },
  foodImage: { type: String, required: true }, // Path to stored image
  additionalNotes: String,
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
```

**2. middleware/upload.js:**
```javascript
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

module.exports = upload;
```

**3. middleware/validation.js:**
```javascript
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

const donationValidation = [
  body('restaurantName').notEmpty().trim(),
  body('contactPerson').notEmpty().trim(),
  body('phone').notEmpty().trim(),
  body('address').notEmpty().trim(),
  body('foodItems').notEmpty().trim(),
  body('quantity').isFloat({ min: 0.1 }),
  body('pickupDate').notEmpty().isISO8601()
];

const validateDonation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  limiter,
  donationValidation,
  validateDonation
};
```

**4. routes/donationRoutes.js:**
```javascript
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const upload = require('../middleware/upload');
const { donationValidation, validateDonation } = require('../middleware/validation');

// Create donation with image upload
router.post('/', 
  upload.single('foodImage'), // 'foodImage' is the field name for the image file
  donationValidation, 
  validateDonation, 
  async (req, res) => {
    try {
      // Check if image was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Food image is required'
        });
      }

      const donation = new Donation({
        restaurantName: req.body.restaurantName,
        contactPerson: req.body.contactPerson,
        phone: req.body.phone,
        address: req.body.address,
        foodItems: req.body.foodItems,
        quantity: req.body.quantity,
        pickupDate: req.body.pickupDate,
        foodImage: req.file.path, // Save the file path
        additionalNotes: req.body.additionalNotes
      });

      await donation.save();

      res.status(201).json({
        success: true,
        message: 'Donation request created successfully',
        data: donation
      });

    } catch (error) {
      console.error('Error creating donation:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating donation'
      });
    }
});

// Other routes remain the same...
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donations'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }
    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donation'
    });
  }
});

module.exports = router;
```

**5. app.js:**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const donationRoutes = require('./routes/donationRoutes');
const { limiter } = require('./middleware/validation');

const app = express();

// Middleware
app.use(express.json());
app.use(limiter);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('your_mongodb_uri')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/donations', donationRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

To use this updated API:

1. Create an `uploads` folder in your project root:
```bash
mkdir uploads
```

2. Send a donation request using form-data:
```
POST /api/donations
Content-Type: multipart/form-data

restaurantName: "Restaurant Name"
contactPerson: "John Doe"
phone: "1234567890"
address: "123 Main St"
foodItems: "Rice, Curry"
quantity: 10
pickupDate: "2024-02-20T15:00:00Z"
foodImage: [file upload]
additionalNotes: "Please bring containers"
```

The image will be stored in the `uploads` folder and can be accessed via `/uploads/filename.jpg`.

Would you like me to explain any part in more detail?

---

_**User**_

i wanna create a new file for requestpickup in routes, and i dont want to fetch the donation list now, just that a msg will be show that request submitted and will show request id

---

_**Assistant**_



I'll create a simplified version focusing only on the request pickup functionality.

**1. models/Donation.js:**
```javascript:backend/models/Donotion.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  foodItems: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickupDate: { type: Date, required: true },
  foodImage: { type: String, required: true },
  additionalNotes: String,
  requestId: { type: String, unique: true }, // For tracking
  status: { 
    type: String, 
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
```

**2. middleware/upload.js:**
```javascript
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
```

**3. routes/requestPickup.js:**
```javascript:backend/routes/requestPickup.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const upload = require('../middleware/upload');

// Generate unique request ID
const generateRequestId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `REQ-${timestamp.slice(-6)}-${random.toUpperCase()}`;
};

// Request Pickup Route
router.post('/request-pickup', upload.single('foodImage'), async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Food image is required'
      });
    }

    // Validate required fields
    const requiredFields = ['restaurantName', 'contactPerson', 'phone', 'address', 'foodItems', 'quantity', 'pickupDate'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Create new donation request
    const requestId = generateRequestId();
    const donation = new Donation({
      restaurantName: req.body.restaurantName,
      contactPerson: req.body.contactPerson,
      phone: req.body.phone,
      address: req.body.address,
      foodItems: req.body.foodItems,
      quantity: req.body.quantity,
      pickupDate: new Date(req.body.pickupDate),
      foodImage: req.file.path,
      additionalNotes: req.body.additionalNotes,
      requestId: requestId
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Pickup request submitted successfully',
      requestId: requestId
    });

  } catch (error) {
    console.error('Error submitting pickup request:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting pickup request'
    });
  }
});

module.exports = router;
```

**4. app.js:**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const requestPickupRoutes = require('./routes/requestPickup');

const app = express();

// Middleware
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('your_mongodb_uri')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', requestPickupRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

To use this API:

1. Make sure to create an `uploads` folder:
```bash
mkdir uploads
```

2. Send a request:
```
POST /api/request-pickup
Content-Type: multipart/form-data

restaurantName: "Restaurant Name"
contactPerson: "John Doe"
phone: "1234567890"
address: "123 Main St"
foodItems: "Rice, Curry"
quantity: 10
pickupDate: "2024-02-20T15:00:00Z"
foodImage: [file upload]
additionalNotes: "Please bring containers"
```

3. You'll receive a response like:
```json
{
  "success": true,
  "message": "Pickup request submitted successfully",
  "requestId": "REQ-123456-ABC123"
}
```

This simplified version:
- Focuses only on request pickup functionality
- Generates a unique request ID for tracking
- Validates required fields
- Handles image upload
- Returns just the success message and request ID

Would you like me to explain any part in more detail?

---

_**User**_

i want this to be renamed as foodUploads and put it in utils folder

---

_**Assistant**_

I'll help you move and rename the file to the utils folder.

```javascript:backend/utils/foodUploads.js
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const foodUploads = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

module.exports = foodUploads;
```

The changes made:
1. Moved file to `backend/utils/` directory
2. Renamed file to `foodUploads.js`
3. Renamed the exported variable from `upload` to `foodUploads`

Now you can import it in your routes like:
```javascript:backend/routes/requestPickup.js
const foodUploads = require('../utils/foodUploads');
```

---

_**User**_

i have a server.js file and ill attach the code of it, what changes should i add

---

_**Assistant**_

I'll help you integrate the new request pickup functionality into your existing server.js. Here are the changes you should make:

```javascript:backend/server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.js");
const donorRoutes = require("./routes/donorRoutes.js");
const ngoRoutes = require("./routes/ngoRoutes.js");
const requestPickupRoutes = require("./routes/requestPickup.js"); // Add this line
const authMiddleware = require("./middlewares/authMiddleware.js");
const path = require("path");
const cors = require("cors");

const app = express();
connectDB();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Existing routes
app.use("/api/donors", donorRoutes);
app.use("/api/ngo", ngoRoutes);
// Add new route for request pickup
app.use("/api/pickup", requestPickupRoutes); // Add this line

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

Key changes made:
1. Added import for requestPickupRoutes
2. Added new route mounting for pickup requests at `/api/pickup`

Now your request pickup endpoint will be available at:
`POST /api/pickup/request-pickup`

The rest of your server configuration (cors, middleware, etc.) remains the same as it already handles everything we need for the new functionality.

---

_**User**_

i want to test this out now

---

_**Assistant**_



You can test the request pickup endpoint using Postman or any API testing tool. Here's how to test it:

1. First, make sure your server is running
2. Open Postman and create a new request:

```
POST http://localhost:5000/api/pickup/request-pickup
```

Set up the request body:
1. Select "form-data" (not JSON!)
2. Add these fields:
```
restaurantName: "Test Restaurant"
contactPerson: "John Test"
phone: "1234567890"
address: "123 Test Street"
foodItems: "Rice, Curry, Bread"
quantity: "5"
pickupDate: "2024-02-20T15:00:00Z"
foodImage: [Select a JPG/PNG file]
additionalNotes: "Test donation"
```

For the `foodImage` field:
- Click on the dropdown next to the key name
- Select "File" instead of "Text"
- Click "Select Files" and choose any JPG/PNG image

Expected Response:
```json
{
    "success": true,
    "message": "Pickup request submitted successfully",
    "requestId": "REQ-123456-ABC123"
}
```

Let me know if you need help with the testing or if you run into any issues!

---

_**User**_

its not restaurant name, i want it renamed to DonorsName everywhere

---

_**Assistant**_



I'll help you update all the references from "restaurantName" to "donorName".

**1. models/Donation.js:**
```javascript:backend/models/Donation.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },  // Changed from restaurantName
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  foodItems: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickupDate: { type: Date, required: true },
  foodImage: { type: String, required: true },
  additionalNotes: String,
  requestId: { type: String, unique: true },
  status: { 
    type: String, 
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
```

**2. routes/requestPickup.js:**
```javascript:backend/routes/requestPickup.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const foodUploads = require('../utils/foodUploads');

const generateRequestId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `REQ-${timestamp.slice(-6)}-${random.toUpperCase()}`;
};

router.post('/request-pickup', foodUploads.single('foodImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Food image is required'
      });
    }

    // Updated required fields
    const requiredFields = ['donorName', 'contactPerson', 'phone', 'address', 'foodItems', 'quantity', 'pickupDate'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    const requestId = generateRequestId();
    const donation = new Donation({
      donorName: req.body.donorName,  // Changed from restaurantName
      contactPerson: req.body.contactPerson,
      phone: req.body.phone,
      address: req.body.address,
      foodItems: req.body.foodItems,
      quantity: req.body.quantity,
      pickupDate: new Date(req.body.pickupDate),
      foodImage: req.file.path,
      additionalNotes: req.body.additionalNotes,
      requestId: requestId
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Pickup request submitted successfully',
      requestId: requestId
    });

  } catch (error) {
    console.error('Error submitting pickup request:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting pickup request'
    });
  }
});

module.exports = router;
```

To test in Postman, use these updated fields:
```
POST http://localhost:5000/api/pickup/request-pickup

Form-data:
donorName: "Test Donor"
contactPerson: "John Test"
phone: "1234567890"
address: "123 Test Street"
foodItems: "Rice, Curry, Bread"
quantity: "5"
pickupDate: "2024-02-20T15:00:00Z"
foodImage: [Select a JPG/PNG file]
additionalNotes: "Test donation"
```

The response format remains the same:
```json
{
    "success": true,
    "message": "Pickup request submitted successfully",
    "requestId": "REQ-123456-ABC123"
}
```

---

_**User**_

i want to make seperated folder for food proof images inside the uploads folder

---

_**Assistant**_



I'll help you modify the `foodUploads.js` to store images in a dedicated "food-proof" folder inside uploads.

```javascript:backend/utils/foodUploads.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create food-proof directory if it doesn't exist
const uploadDir = 'uploads/food-proof';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir); // Changed from 'uploads/' to 'uploads/food-proof/'
  },
  filename: function(req, file, cb) {
    // Add file extension to the saved file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'food-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const foodUploads = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

module.exports = foodUploads;
```

Key changes made:
1. Added path and fs modules
2. Created a dedicated "food-proof" folder inside uploads
3. Changed the destination path for uploads
4. Added better file naming with 'food-' prefix

Now all food proof images will be stored in `uploads/food-proof/` directory with names like:
`food-1708456789123-123456789.jpg`

The folder structure will be:
```
backend/
  ├── uploads/
  │   └── food-proof/
  │       └── food-[timestamp]-[random].jpg
  └── ...
```

---



---

