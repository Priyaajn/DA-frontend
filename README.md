# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh




# 🔧 Prescripto — All Bugs Fixed

## ❌ Bugs Found & Fixed

### 1. 🔴 Admin header mismatch (CRITICAL — caused dashboard to stay loading)
**Files:** `AdminContext.jsx`, `AddDoctors.jsx`, `Allappointments.jsx`

Your backend middleware reads:  `req.headers['atoken']`  (lowercase)
But your code was sending:     `{ Authorization: dtoken }` or `{ atoken: aToken }` inconsistently

**Fix:** All admin API calls now use `{ headers: { atoken: aToken } }` (lowercase t)

---

### 2. 🔴 Doctor header mismatch (CRITICAL — doctor login/data wouldn't load)
**Files:** `DoctorContext.jsx`, `DoctorProfile.jsx`

Your backend middleware reads: `req.headers['dtoken']` (lowercase)
But code was sending:          `{ authorization: dToken }` or `{ dToken: dToken }` 

**Fix:** All doctor API calls now use `{ headers: { dtoken: dToken } }` (lowercase t)

---

### 3. 🔴 `getAllAppointments` & `cancelAppointment` missing from AdminContext
The `Allappointments.jsx` and `AdminDashboard` pages called these but they didn't exist.

**Fix:** Added both functions to `AdminContext.jsx`

---

### 4. 🔴 `getDoctorsData` not exported from AppContext
`Appointment.jsx` calls `getDoctorsData()` after booking to refresh slots, but it wasn't in the context value.

**Fix:** Added `getDoctorsData` to AppContext value object.

---

### 5. 🟡 Currency was `$` instead of `₹`
Razorpay charges in INR but UI showed `$`.

**Fix:** Changed `currency = '₹'` in AppContext.

---

### 6. 🟡 LocalStorage key inconsistency for doctor token
`DoctorContext` reads `localStorage.getItem('dToken')` but login was saving with different casing.

**Fix:** Logins.jsx now consistently uses `localStorage.setItem('dToken', ...)` and `localStorage.setItem('aToken', ...)`

---

### 7. 🟡 AdminDashboard stuck on "Loading" with no error message
When dashboard API failed silently, the loading spinner showed forever.

**Fix:** Added helpful error message: "If this persists, check your backend connection and admin token."

---

## 📁 Files to Replace

| File | Location in your project |
|------|--------------------------|
| `AdminContext.jsx` | `src/context/AdminContext.jsx` |
| `AppContext.jsx` | `src/context/AppContext.jsx` |
| `DoctorContext.jsx` | `src/context/DoctorContext.jsx` |
| `AddDoctors.jsx` | `src/pages/Admin/AddDoctors.jsx` |
| `Daashboards.jsx` | `src/pages/Admin/Daashboards.jsx` |
| `Allappointments.jsx` | `src/pages/Admin/Allappointments.jsx` |
| `DoctorProfile.jsx` | `src/pages/Doctor/DoctorProfile.jsx` |
| `Logins.jsx` | `src/pages/Logins.jsx` |

---

## 🩺 Add Test Doctors (seed.js)

Place `seed.js` in your **backend root** and run:
```bash
node seed.js
```

### Doctor Login Credentials (after seeding):

| Doctor | Email | Password | Speciality |
|--------|-------|----------|------------|
| Dr. Arjun Sharma   | arjun@prescripto.com  | doctor123 | General physician |
| Dr. Priya Nair     | priya@prescripto.com  | doctor123 | Gynecologist |
| Dr. Rohan Mehta    | rohan@prescripto.com  | doctor123 | Dermatologist |
| Dr. Sneha Pillai   | sneha@prescripto.com  | doctor123 | Pediatricians |
| Dr. Vikram Rao     | vikram@prescripto.com | doctor123 | Neurologist |
| Dr. Ananya Das     | ananya@prescripto.com | doctor123 | Gastroenterologist |

---

## ⚙️ Backend .env Required Variables

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_XXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXX
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password        # Gmail App Password (not your real password)
ADMIN_EMAIL=admin@prescripto.com
ADMIN_PASSWORD=admin123
```

## ⚙️ Frontend .env Required Variables

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=rzp_test_XXXX
```

---

## 📋 Gmail App Password Setup (for email notifications)

1. Go to your Google Account → Security → 2-Step Verification (must be ON)
2. Go to Security → App passwords
3. Select "Mail" → "Other" → name it "Prescripto"
4. Copy the 16-character password → use it as `EMAIL_PASS`

---

## ✅ Test Checklist After Applying Fixes

- [ ] Admin login with your admin credentials
- [ ] Admin dashboard shows stats (not stuck loading)
- [ ] Add a doctor via Admin → Add Doctor
- [ ] Doctor list shows added doctors
- [ ] Patient login / signup
- [ ] Browse doctors → select one → pick slot → Book
- [ ] Pay with Razorpay (use test card: 4111 1111 1111 1111)
- [ ] My Appointments shows booking with "Pay Now" for unpaid
- [ ] Doctor login → Dashboard → sees appointments
- [ ] AI chat widget (💬) appears on patient pages