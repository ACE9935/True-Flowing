# True Flowing 🚀

[Live Demo](https://true-flowing.vercel.app/) • [GitHub Repo](https://github.com/ACE9935/True-Flowing)

**True Flowing** is a dynamic customer engagement platform built with **Next.js** and **React**, hosted on **Vercel**. It allows businesses to generate dynamic QR codes, track scan data in real-time, and engage customers with interactive features like prize roulette and reviews.

---

## 🌟 Features

### 🔐 Authentication (Firebase)
- Users can authenticate via **Google** or **Email/Password**.
- Authentication is handled by **Firebase**.
- Upon successful authentication, users can access all features of the app.
- User data is stored securely in **Firebase Firestore**.

### 🎨 QR Code Generation
- **Customizable QR Codes** with options for color and pattern selection.
- **Two Types of QR Codes**:
  - **Basic QR Codes**: Link to a URL (e.g., Instagram page), track scans, and store data for analytics.
  - **Premium QR Codes**: Redirect users to a custom landing page, collect information (name, email, phone number), request reviews (Google/Facebook), and provide access to a **prize roulette**. Winners receive an SMS with a prize code to redeem their reward.

### 📊 Data Visualization
- Track and visualize **daily scans** of QR codes using **Google Cloud services**.
- User dashboards display insightful **charts** to monitor performance (scans, reviews, winners).
  
### 📧 Email/SMS Campaigns
- **Client Data Export**: Export customer information collected through scanned **Premium QR Codes** to an Excel file.
- **Campaign Management**: Use client data for targeted **email** or **SMS** campaigns, as well as **promotions** or **automated campaigns**.

---

## 🧑‍💻 Tech Stack

- **Frontend**: React, Next.js, MUI React, Tailwind
- **App State Management**: Redux Toolkit
- **Backend**: API routes (Serverless functions)
- **Authentication**: Firebase Authentication (Google and Email/Password)
- **Database**: Firebase Firestore
- **QR Generation**: Custom logic for dynamic QR codes
- **Data Visualization**: Google Cloud services for tracking and reporting
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🛠 Getting Started

To run the project locally:

```bash
git clone https://github.com/ACE9935/True-Flowing.git
cd True-Flowing
npm install
npm run dev
