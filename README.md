# ⚒️ Digital Labour Platform

A modern, high-performance, and visually stunning web application designed to connect skilled workers (electricians, painters, plumbers, constructors) with clients. It focuses on accessibility, premium aesthetics, and smooth user experience with dedicated features like real-time analytics and multilingual localization.

---

## 🌟 Key Features

### 👤 Personalized Dashboards & Analytics
* **Worker & Client Dashboards:** Custom user flows and features depending on the logged-in role.
* **Worker Analytics:** View unique stats like completed tasks, total earnings, average rating, and working hours with beautiful interactive charts.
* **Client Portal:** Easily post jobs, view application statuses, manage hired candidates, and execute secure dummy payments.

### 🌐 Multi-lingual Localization
* Fully translated in multiple languages (English, Hindi, Punjabi, etc.) to support local/vernacular workers who might not be fluent in English.
* Instantly toggle languages anywhere in the header navigation.

### 📸 Photos-based Smart Attendance
* Workers can easily mark their daily attendance by taking/uploading a photo.
* Completely personalized attendance history tracked and visible to both workers and clients.

### ⭐ Dual Review System
* Clients and workers can rate and review each other with 5-star ratings and tag badges.
* Dynamically filters reviews so you see reviews specifically targeted to/from the logged-in profile.

### 🤖 Intelligent Match Score
* Advanced ranking algorithm showing custom compatibility scores based on:
  * **35%** Skills overlap
  * **25%** Years of experience
  * **20%** Average rating
  * **10%** Distance proximity
  * **10%** Instant availability

---

## 🚀 Quick Start (Local Setup)

Follow these simple steps to run the application on your computer:

### Prerequisite
* Make sure you have [Node.js](https://nodejs.org) installed (LTS version recommended).

### Setup and Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ARU-CREATOR-ping/digital-labour-platform.git
   cd digital-labour-platform/labour-platform
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm start
   ```
   * Open your browser and go to `http://localhost:3000`.

---

## 🎨 Technology Stack & Design System

* **Frontend Framework:** React.js (v18+)
* **Routing:** React Router DOM (v6)
* **Styling:** Custom modern Vanilla CSS system with Glassmorphism, smooth gradients, HSL color tokens, and premium animations. (No complex CSS frameworks like Tailwind required).
* **State Management:** React Context API (encapsulated in `AppContext.js` for reactive real-time updates).

### Visual Hierarchy & Palette
* **Primary Theme:** Sleek dark-mode elements with harmonious warm accents.
* **Colors:**
  * `--primary`: `#e85d04` (Orange – energy, construction)
  * `--secondary`: `#1a1a2e` (Deep navy / premium space)
  * `--accent`: `#f5a623` (Amber)
  * `--bg`: `#fdf6ee` (Warm canvas / background)

---

## 🧪 Demo Credentials (OTP Authentication)

To test the application instantly:
1. **Phone Number:** Any 10-digit number (e.g., `9876543210`)
2. **OTP:** Use `1234` (always authorized for demo)
3. Select your role (**Worker** or **Client**) to explore custom experiences!

---

## 📄 License

This project is licensed under the **MIT License**. 

### What does this mean?
The MIT License is one of the most permissive open-source licenses available. It gives you and anyone else the complete freedom to:
* **Commercial Use:** Use this project for commercial or business purposes.
* **Modification:** Modify, edit, and change the source code as you see fit.
* **Distribution:** Share, copy, and distribute the original or modified code.
* **Sublicense:** Include this code as part of a larger, closed-source, or commercial product.

The only simple conditions are:
1. **Attribution:** The original copyright notice and permission notice must be included in all copies or substantial portions of the software.
2. **No Warranty:** The software is provided "as is", without any warranty of any kind. The authors are not liable for any claims or damages.

