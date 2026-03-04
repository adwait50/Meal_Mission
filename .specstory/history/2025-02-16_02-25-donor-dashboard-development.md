## SpecStory

## Donor Dashboard Development (2/16/2025, 2:25:26 AM)

_**User**_

lets make this dashoard for donor now

---

_**Assistant**_

I'll help you create a dashboard for donors. Based on the image, it seems you want to create a similar layout but with donor-specific features. Here's how we could structure the donor dashboard:

```html:src/views/DonorDashboard.vue
<template>
  <div class="dashboard">
    <h1>Welcome back!</h1>
    
    <!-- Available Food Section -->
    <div class="dashboard-card">
      <div class="card-header">
        <span class="icon">🍽️</span>
        <h2>Available Food</h2>
      </div>
      <p>Browse food available for donation in your area</p>
      <button class="primary-button">Browse Food</button>
    </div>

    <!-- My Claims Section -->
    <div class="dashboard-card">
      <div class="card-header">
        <span class="icon">📋</span>
        <h2>My Claims</h2>
      </div>
      <p>Track your current food claims and pickups</p>
      <button class="primary-button">View Claims</button>
    </div>

    <!-- Collection History -->
    <div class="dashboard-card">
      <div class="card-header">
        <span class="icon">📜</span>
        <h2>Collection History</h2>
      </div>
      <p>View your past collections and impact</p>
      <button class="primary-button">View History</button>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
}

.dashboard-card {
  background: #1e2632;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.primary-button {
  background: #ffc107;
  color: #000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.primary-button:hover {
  background: #ffca2c;
}
</style>

<script>
export default {
  name: 'DonorDashboard',
  // Add any necessary logic here
}
</script>
```

This dashboard includes three main sections:

1. **Available Food**: Where donors can browse food items available for collection
2. **My Claims**: Where donors can track their current food claims and scheduled pickups
3. **Collection History**: Where donors can view their past collections and impact

The design maintains the same dark theme and yellow accent colors from your original dashboard, but with features specific to donors. Each section has:
- An icon
- A title
- A description
- A call-to-action button

You'll need to:
1. Add proper routing to this component
2. Implement the actual functionality for each button
3. Connect it to your backend API
4. Add loading states and error handling

Would you like me to help with any of these additional implementations?

---

_**User**_

not the front end

---

_**Assistant**_

Ah, you want to focus on the backend implementation for the donor dashboard. Here's a suggested backend structure using Node.js/Express:

```javascript:src/routes/donor.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get available food listings in donor's area
router.get('/available-food', auth, async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;
    const availableFood = await FoodListing.find({
      status: 'available',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radius || 5000 // Default 5km radius
        }
      }
    }).populate('restaurant', 'name location');

    res.json(availableFood);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available food' });
  }
});

// Get donor's current claims
router.get('/my-claims', auth, async (req, res) => {
  try {
    const claims = await FoodClaim.find({
      donor: req.user.id,
      status: { $in: ['pending', 'accepted', 'ready_for_pickup'] }
    }).populate('foodListing');

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching claims' });
  }
});

// Create new food claim
router.post('/claim', auth, async (req, res) => {
  try {
    const { foodListingId, pickupTime } = req.body;
    
    const foodListing = await FoodListing.findById(foodListingId);
    if (!foodListing || foodListing.status !== 'available') {
      return res.status(400).json({ message: 'Food listing not available' });
    }

    const claim = new FoodClaim({
      donor: req.user.id,
      foodListing: foodListingId,
      pickupTime,
      status: 'pending'
    });

    await claim.save();
    foodListing.status = 'claimed';
    await foodListing.save();

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ message: 'Error creating claim' });
  }
});

// Get collection history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const history = await FoodClaim.find({
      donor: req.user.id,
      status: 'completed'
    })
    .sort({ completedAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('foodListing');

    const total = await FoodClaim.countDocuments({
      donor: req.user.id,
      status: 'completed'
    });

    res.json({
      history,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

module.exports = router;
```

```javascript:src/models/FoodClaim.js
const mongoose = require('mongoose');

const foodClaimSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodListing',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ready_for_pickup', 'completed', 'cancelled'],
    default: 'pending'
  },
  pickupTime: {
    type: Date,
    required: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('FoodClaim', foodClaimSchema);
```

This backend implementation includes:

1. **Available Food Endpoint**: Uses geospatial queries to find nearby available food listings
2. **Claims Management**: 
   - Get current claims
   - Create new claims
   - Handles claim status updates
3. **History Tracking**:
   - Paginated history of completed collections
   - Includes timestamps for tracking

You'll also need to ensure you have the following in place:
1. Authentication middleware
2. Proper database indexes (especially for geospatial queries)
3. Error handling middleware
4. Input validation

Would you like me to elaborate on any of these components or show you how to implement additional features?

---

_**User**_

no this is wrong, i want that from this donor dashboard donor will have three main options, request food pickup, view status, view history

---

_**Assistant**_



Ah, I apologize for the confusion! You want the backend for a donor who wants to donate food (not claim it). Here's the corrected backend implementation:

```javascript:src/routes/donor.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Create food donation request
router.post('/request-pickup', auth, async (req, res) => {
  try {
    const { 
      foodDescription,
      quantity,
      expiryDate,
      pickupTimeWindow,
      location,
      specialInstructions 
    } = req.body;

    const donationRequest = new DonationRequest({
      donor: req.user.id,
      foodDescription,
      quantity,
      expiryDate,
      pickupTimeWindow,
      location,
      specialInstructions,
      status: 'pending'
    });

    await donationRequest.save();
    res.status(201).json(donationRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation request' });
  }
});

// Get active donation requests
router.get('/active-requests', auth, async (req, res) => {
  try {
    const activeRequests = await DonationRequest.find({
      donor: req.user.id,
      status: { $in: ['pending', 'accepted', 'scheduled'] }
    }).sort({ createdAt: -1 });

    res.json(activeRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active requests' });
  }
});

// Get donation history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const history = await DonationRequest.find({
      donor: req.user.id,
      status: 'completed'
    })
    .sort({ completedAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

    const total = await DonationRequest.countDocuments({
      donor: req.user.id,
      status: 'completed'
    });

    res.json({
      history,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

module.exports = router;
```

```javascript:src/models/DonationRequest.js
const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodDescription: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  pickupTimeWindow: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  location: {
    address: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  specialInstructions: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledPickupTime: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, { timestamps: true });

// Index for geospatial queries
donationRequestSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('DonationRequest', donationRequestSchema);
```

This implementation provides three main functionalities:

1. **Request Food Pickup**
   - Creates a new donation request
   - Includes food details, quantity, expiry date, pickup window
   - Captures location and special instructions

2. **View Status (Active Requests)**
   - Shows all pending, accepted, and scheduled donations
   - Sorted by creation date
   - Includes current status and details

3. **View History**
   - Paginated history of completed donations
   - Includes all donation details and completion time
   - Sorted by completion date

The `DonationRequest` model includes:
- Basic food information
- Pickup scheduling details
- Location data (with geospatial support)
- Status tracking
- Assignment tracking
- Timestamps for various events

Would you like me to add any additional features or explain any part in more detail?

---



---

