// Central app configuration.
// Every module reads the API base URL from here so there is exactly one place to change it.

const DEFAULT_API_URL = "http://localhost:3001"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL

export const config = {
  api: {
    baseUrl: API_BASE_URL,

    // When NEXT_PUBLIC_DEMO_MODE is on, the app serves bundled sample data instead of
    // calling the API. Used for the hosted demo, which has no backend behind it.
    isBackendAvailable: () => process.env.NEXT_PUBLIC_DEMO_MODE !== "true",
  },

  app: {
    name: "تأجير السيارات",
    description: "Car Rental System",
    version: "1.0.0",
  },
}

export default config
