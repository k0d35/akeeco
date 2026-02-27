export const environment = {
  apiBaseUrl: 'http://localhost:8081',
  googlePlaces: {
    // Keep this false by default. Turn on in code when ready.
    enabled: true,
    pickupEnabled: true,
    dropoffEnabled: true,
    apiKey: 'TBD',
    minQueryLength: 3,
    maxSuggestions: 4,
    regionCodes: ['jm'],
  },
};
