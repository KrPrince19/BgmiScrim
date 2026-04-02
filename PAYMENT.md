# 💳 Payment System — BGMI Scrim

## Overview

This app uses a **Manual UPI Verification** payment system.  
No payment gateway is needed — players pay directly via UPI and submit their Transaction ID. The admin manually verifies and approves.

---

## 🔄 Complete Payment Flow

### 1. Player Joins a Scrim
- Player logs in and visits the **Dashboard**
- Finds an available scrim and clicks **"Join Match"**

### 2. Payment Page
- Player sees:
  - **QR Code** to scan and pay
  - **UPI ID** to manually enter in their payment app
  - **Entry Fee** amount
- Player pays via **PhonePe / Google Pay / Paytm / any UPI app**

### 3. Enter Transaction ID
- After payment, the player's UPI app shows a **12-digit UTR number** (e.g. `427319284756`)
- Player enters this UTR in the **Transaction ID box** and clicks **"Submit Request"**
- The app saves: `{ playerID, scrimID, transactionID, status: "pending" }`

### 4. Waiting for Approval
- Player is redirected to the **Status Page** (`/status/:scrimId`)
- The page **auto-refreshes every 30 seconds**
- Status shows: ⏳ **Pending — Under Verification**

### 5. Admin Verification
- Admin opens the **Admin Panel** → **Payments** tab
- Sees a table with:
  - Player username + phone
  - Match name + entry fee
  - Submitted Transaction ID (UTR)
- Admin **manually checks** their PhonePe/GPay app to confirm the payment

### 6. Admin Approves or Rejects

| Action | What Happens |
|---|---|
| ✅ **Approve** | Payment status → `approved`, scrim slot count +1 |
| ❌ **Reject** | Payment status → `rejected`, player can retry |

### 7. Player Gets Room Access
- Once **Approved**, the Status Page shows a green **"Get Room Access"** button
- Player clicks it → sees **Room ID** and **Room Password**
- Player joins the BGMI match using these credentials

---

## 🗄️ Database Schema

```
Payment {
  user          → ref to User
  scrim         → ref to Scrim
  transactionID → 12-digit UTR string
  status        → "pending" | "approved" | "rejected"
  approvalDate  → set when approved
  createdAt     → auto timestamp
}
```

---

## 🔐 Security Rules

- Only **logged-in players** can submit a payment request
- A player can **only join each scrim once** (duplicate prevention)
- Room ID/Password is **only revealed** to approved players
- All admin approval routes are **role-protected** on the backend

---

## ⚙️ Configuration

Add your UPI details in `client/app/payment/[id]/page.tsx`:

```typescript
const UPI_ID = "yourname@ybl";          // Your UPI Virtual Payment Address
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Your WhatsApp number (with country code)
```

---

## 📊 Payment Status Summary

| Status | Player Sees | Dashboard Button |
|---|---|---|
| `pending` | ⏳ Under Verification | Yellow — "Under Verification" |
| `approved` | ✅ Access Granted | Green — "View Room ID" |
| `rejected` | ❌ Payment Failed | Red — "Payment Failed" (retry link) |

---

## 💡 Tips for Admins

- Approve payments within **10–15 minutes** of submission
- Always cross-check the **UTR number** in your UPI app before approving
- If a player submits the wrong UTR → **Reject** so they can retry
- Use the **Players tab** in the admin panel to remove players if needed
