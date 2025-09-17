# TravelMate — Destination Explorer

Description
A lightweight web app to search countries or cities and view live destination data: basic place details, current weather, and related images. No database — all data fetched live. Backend acts as a secure proxy for external API keys.

Features
- Search by country or city name
- Show place details: name, region, population
- Current weather via OpenWeather
- Related images via Pixabay
- Node.js proxy server to hide API keys (no DB)

Stack
- Frontend: Vue 3 (Vue CLI v5), TailwindCSS v4 (utilities only), Babel
- Backend: Node.js (Express) proxy server, dotenv, node-fetch
- APIs: OpenWeather, Pixabay