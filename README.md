# Attendance App

A modern and scalable attendance management mobile application built with React Native, Expo, and TypeScript.
This project is designed to help businesses manage employee attendance, work shifts, leaves, overtime, and location-based check-ins.

---

## 🚀 Features

* 🔐 Authentication & Secure Storage
* 📍 GPS-based Attendance Validation
* 🕒 Shift Management
* 📅 Attendance & Work Calendar
* 📊 Reports & Charts
* 🧾 Leave & Overtime Requests
* 🔔 Push Notifications
* 🌙 Modern UI/UX with Animations
* 📱 Cross-platform (Android, iOS, Web)
* 🇮🇷 Jalali (Persian) Calendar Support
* ⚡ Optimized Performance with Reanimated & Moti

---

## 🛠️ Tech Stack

### Core

* React Native
* Expo SDK 53
* TypeScript
* Expo Router

### State & Forms

* Formik
* Yup

### UI & Animations

* NativeWind (TailwindCSS)
* React Native Paper
* Moti
* Reanimated
* Lottie

### Navigation

* React Navigation
* Expo Router

### Utilities

* Axios
* Day.js
* Moment & Moment-Jalaali
* Jalaali-JS
* Geolib

### Native Features

* Expo Location
* Expo Notifications
* Expo Image Picker
* Expo Secure Store
* Expo File System
* React Native Maps

### Charts & Data Visualization

* Victory Native
* React Native Chart Kit

---

# 📦 Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd attendance
```

---

## 2. Install dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

---

## 3. Start the development server

```bash
npm run start
```

---

## 4. Run on Android

```bash
npm run android
```

---

## 5. Run on iOS

```bash
npm run ios
```

---

## 6. Run on Web

```bash
npm run web
```

---

# 📁 Project Structure

```bash
attendance/
│
├── app/                 # Expo Router screens
├── components/          # Reusable UI components
├── services/            # API services
├── hooks/               # Custom hooks
├── utils/               # Helper functions
├── constants/           # App constants
├── assets/              # Images, fonts, animations
├── store/               # State management
├── types/               # TypeScript types
└── scripts/             # Utility scripts
```

---

# 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://your-api-url.com
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

# 🧪 Testing

Run tests using:

```bash
npm run test
```

---

# 🧹 Linting

```bash
npm run lint
```

---

# 📱 Build Production App

## Android

```bash
eas build --platform android
```

## iOS

```bash
eas build --platform ios
```

---

# 🌍 Supported Platforms

* Android
* iOS
* Web

---

# ✨ Main Libraries Used

* expo-router
* react-native-reanimated
* nativewind
* react-native-paper
* react-native-maps
* expo-location
* expo-notifications
* react-native-chart-kit
* victory-native

---

# 👨‍💻 Developer

Developed with ❤️ using React Native & Expo.

---

# 📄 License

This project is licensed under the MIT License.
