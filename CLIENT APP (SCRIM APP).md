# **PART 1 — CLIENT APP (SCRIM APP)**

---

# **🧠 1\. OVERVIEW**

This is the **player-facing app** where users:

* View scrims  
* Join matches  
* Pay via QR  
* Send proof via WhatsApp  
* Get approval  
* Access room details

---

# **🏗️ 2\. CLIENT ARCHITECTURE**

Next.js (Frontend)  
     ↓  
API Calls (Axios / Fetch)  
     ↓  
Node.js Backend (Shared)  
     ↓  
MongoDB  
---

# **📁 3\. FOLDER STRUCTURE**

/app  
 /login  
 /dashboard  
 /scrims  
 /payment  
 /room  
/components  
 Navbar.jsx  
 ScrimCard.jsx  
 PaymentBox.jsx  
/lib  
 api.js  
/utils  
 auth.js  
---

# **🔑 4\. MAIN FEATURES**

---

## **🔐 Authentication**

* Login / Signup  
* Store JWT token

---

## **🎮 Scrim Listing**

* Fetch all scrims  
* Show:  
  * Match name  
  * Time  
  * Entry fee  
  * Slots

---

## **🧾 Join Scrim Flow**

Click Join → Payment Page → WhatsApp → Pending → Approved → Room Access  
---

## **💳 Payment Page**

### **Show:**

* QR Code  
* UPI ID  
* Entry Fee

### **Button:**

👉 “Send Payment Proof”

---

## **📲 WhatsApp Integration**

Use:

https://wa.me/91XXXXXXXXXX?text=message  
---

## **⏳ Payment Status UI**

* Pending ⏳  
* Approved ✅  
* Rejected ❌

---

## **🔐 Room Access (IMPORTANT)**

if (payment.status \!== "approved") {  
 return "Access Denied";  
}  
---

# **📅 CLIENT DAY-BY-DAY PLAN**

---

## **🟢 DAY 1 — Setup**

* Create Next.js app  
* Setup Tailwind  
* Create basic layout

---

## **🟢 DAY 2 — Auth**

* Login UI  
* JWT handling  
* Store user data

---

## **🟢 DAY 3 — Scrim Listing**

* API integration  
* Show scrim cards

---

## **🟢 DAY 4 — Join Flow**

* Join button  
* Redirect to payment page

---

## **🟢 DAY 5 — Payment UI**

* QR \+ UPI display  
* WhatsApp button

---

## **🟢 DAY 6 — Payment API**

* Create payment (pending)  
* Save transaction ID

---

## **🟢 DAY 7 — Status Page**

* Show pending / approved  
* Auto refresh

---

## **🟢 DAY 8 — Room Page**

* Fetch room data  
* Show only if approved

---

## **🟢 DAY 9 — Error Handling**

* Duplicate join prevention  
* API errors

---

## **🟢 DAY 10 — UI Polish**

* Loaders  
* Toast messages  
* Clean UI

---

# **⚠️ CLIENT SIDE RULES**

❌ Don’t trust frontend  
 ✔️ Always validate backend

❌ Don’t show room early  
 ✔️ Check approval

---

---

# **🧑‍💻 PART 2 — ADMIN PANEL (SEPARATE APP)**

---

# **🧠 1\. OVERVIEW**

Admin panel is used by YOU to:

* Create matches  
* View payments  
* Approve / reject users  
* Add room ID & password

---

# **🏗️ 2\. ADMIN ARCHITECTURE**

Next.js Admin App  
      ↓  
Protected Routes  
      ↓  
Backend APIs  
      ↓  
MongoDB  
---

# **📁 3\. FOLDER STRUCTURE**

/app  
 /login  
 /dashboard  
 /scrims  
 /payments  
 /room  
/components  
 Sidebar.jsx  
 Table.jsx  
/lib  
 api.js  
/middleware  
 adminAuth.js  
---

# **🔑 4\. ADMIN FEATURES**

---

## **🔐 Admin Login**

* Only admin access  
* Role check

---

## **🎮 Scrim Management**

* Create match  
* Edit match  
* Delete match

---

## **💳 Payment Management**

* View all payments  
* Filter by:  
  * Pending  
  * Approved  
  * Rejected

---

## **✅ Approve / Reject**

PATCH /api/payment/:id  
---

## **🏠 Room Management**

* Add Room ID  
* Add Password

---

## **👥 Player Control**

* Add user to match  
* Remove user

---

# **📅 ADMIN DAY-BY-DAY PLAN**

---

## **🟢 DAY 1 — Setup**

* Create Next.js app  
* Admin layout

---

## **🟢 DAY 2 — Auth**

* Admin login  
* Protect routes

---

## **🟢 DAY 3 — Dashboard**

* Stats:  
  * Total matches  
  * Total users  
  * Pending payments

---

## **🟢 DAY 4 — Scrim CRUD**

* Create  
* Edit  
* Delete

---

## **🟢 DAY 5 — Payment Table**

* Show all payments  
* Add filters

---

## **🟢 DAY 6 — Approve/Reject**

* Button actions  
* Update DB

---

## **🟢 DAY 7 — Room System**

* Add room ID  
* Save to DB

---

## **🟢 DAY 8 — Player Management**

* Add/remove players

---

## **🟢 DAY 9 — Security**

* Admin middleware  
* Role validation

---

## **🟢 DAY 10 — UI Polish**

* Tables  
* Buttons  
* Alerts

---

# **🔐 ADMIN SECURITY RULES**

if (user.role \!== "admin") {  
 return res.status(403).json({ error: "Unauthorized" });  
}  
---

# **🔥 FINAL SYSTEM FLOW**

CLIENT APP → Join → Payment → WhatsApp   
          ↓  
     Backend (pending)

ADMIN PANEL → Approve   
          ↓  
     Backend (approved)

CLIENT → Access Room ✅  
