<template>
  <div class="p-6 container">
    <h1 class="text-3xl font-semibold mb-4">TravelMate — Destination Explorer</h1>

    <div class="flex gap-2 mb-4">
      <input v-model="query" @keyup.enter="search" placeholder="Search city or country" class="flex-1 p-2 border rounded" />
      <button @click="search" class="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
    </div>

    <div v-if="loading" class="text-gray-600">Loading…</div>

    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div v-if="country" class="mb-6">
      <h2 class="text-2xl font-medium">{{ country.name.common }}</h2>
      <p class="text-sm text-gray-600">Region: {{ country.region }} • Population: {{ country.population.toLocaleString() }}</p>
    </div>

    <div v-if="weather" class="mb-6 p-4 border rounded">
      <h3 class="text-xl">Weather in {{ weather.name }}</h3>
      <p>{{ weather.weather[0].description }} — {{ weather.main.temp }}°C</p>
      <p>Humidity: {{ weather.main.humidity }}% • Wind: {{ weather.wind.speed }} m/s</p>
    </div>

    <div v-if="images && images.length" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div v-for="img in images" :key="img.id" class="rounded overflow-hidden">
        <img :src="img.webformatURL" :alt="img.tags" class="w-full h-40 object-cover" />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'DestinationExplorer',
  data() {
    return {
      query: '',
      loading: false,
      error: null,
      country: null,
      weather: null,
      images: []
    }
  },
  methods: {
    async search() {
      if (!this.query) return
      this.loading = true
      this.error = null
      this.country = null
      this.weather = null
      this.images = []
      try {
        // country info
        const cRes = await fetch(`/api/country?q=${encodeURIComponent(this.query)}`)
        const cData = await cRes.json()
        if (Array.isArray(cData) && cData.length) {
          this.country = cData[0]
        }

        // weather
        const wRes = await fetch(`/api/weather?q=${encodeURIComponent(this.query)}`)
        const wData = await wRes.json()
        if (wData && !wData.cod) {
          this.weather = wData
        }

        // images
        const iRes = await fetch(`/api/images?q=${encodeURIComponent(this.query)}`)
        const iData = await iRes.json()
        if (iData && iData.hits) this.images = iData.hits

      } catch (err) {
        this.error = err.message || 'Error during search'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.container { max-width: 960px; }
</style>
