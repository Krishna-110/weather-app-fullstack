# ☁️ Atmospheric Sync | Full-Stack Weather Dashboard

A premium, high-end weather visualization platform built with **Java Spring Boot** and **React**. This application features real-time satellite data synchronization, browser-based geolocating, and a modern "Sky Blue" glassmorphic interface.

![Sky Blue Vibe](https://img.shields.io/badge/UI-Sky%20Blue%20Vibe-0ea5e9?style=for-the-badge)
![Full Stack](https://img.shields.io/badge/Stack-Java%20%2B%20React-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

*   **📍 Auto-Geolocation:** Automatically detects user location via browser GPS coordinates.
*   **🔍 Global Search:** Manual search functionality for any city worldwide.
*   **☁️ Immersive UI:** Dynamic parallax cloud layers and atmospheric rain effects based on real-time data.
*   **💎 Glassmorphism 2.0:** Ultra-modern frosted glass interface with 3D interactive tilt effects (Framer Motion).
*   **🛡️ Secure Proxy:** Java backend acts as a secure bridge to protect API keys from the frontend.
*   **🕒 Live Sync:** Real-time digital clock and satellite uplink status indicators.

## 🚀 Tech Stack

### Backend (The Brain)
*   **Java 17** with **Spring Boot**
*   **Maven** for dependency management
*   **RestTemplate** for external API consumption
*   **Docker** for containerized deployment

### Frontend (The Dashboard)
*   **React 18** (Vite)
*   **Tailwind CSS** (Styling & Glassmorphism)
*   **Framer Motion** (3D Tilt & Fade Animations)
*   **Lucide React** (Minimalist Iconography)

## 📂 Project Structure

```text
weather-app-fullstack/
├── src/main/java/      # Spring Boot Backend Logic
├── frontend/           # React/Vite Frontend
│   ├── src/App.jsx     # Main Dashboard Component
│   └── src/index.css   # Dynamic Cloud & Rain Animations
├── Dockerfile          # Deployment Configuration
└── pom.xml             # Java Dependencies
🛠️ Local Setup
1. Prerequisites

JDK 17 or higher

Node.js (v18+)

OpenWeatherMap API Key (Free)

2. Backend Setup

Create src/main/resources/application.properties:

code
Properties
download
content_copy
expand_less
weather.api.key=YOUR_API_KEY
weather.api.url=https://api.openweathermap.org/data/2.5/weather

Run the backend:

code
Bash
download
content_copy
expand_less
./mvnw spring-boot:run
3. Frontend Setup
code
Bash
download
content_copy
expand_less
cd frontend
npm install
npm run dev
🌐 Deployment

This project is optimized for cloud deployment:

Backend: Hosted on Render via Docker.

Frontend: Hosted on Vercel with continuous integration.

Note: The backend uses a "Cold Start" mechanism on the free tier. Please allow 30-60 seconds for the Java server to wake up on the initial request.

🤝 Acknowledgments

OpenWeatherMap API for the meteorological data.

The "Sky Blue" design inspiration for the immersive user experience.


