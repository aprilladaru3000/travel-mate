# travel-mate

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Run frontend + backend in development
Start the backend server then the Vue dev server in separate terminals:
```
node server/index.js
npm run serve
```

Or run both with `concurrently` (install first):
```
npm install -D concurrently
npm run serve:all
```

### Environment
Copy `server/.env.example` to `server/.env` and fill your API keys. The backend reads `VUE_APP_OPENWEATHER_API_KEY` and `VUE_APP_PIXABAY_API_KEY` and proxies requests under `/api`.

### Install backend dependencies
From the project root run:
```
npm install express cors dotenv node-fetch@2
```

### API endpoints (proxied)
- `GET /api/country?q=NAME` — REST Countries search
- `GET /api/weather?q=PLACE` — OpenWeather current weather
- `GET /api/images?q=TERM` — Pixabay images

No database is used; the app fetches live data from the external APIs.

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
