// Configuration for the application
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    isBackendAvailable: () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      // Treat localhost as available for local dev
      return !!baseUrl
    }
  },
  
  // App Configuration
  app: {
    name: "تأجير السيارات",
    description: "Car Rental System",
    version: "1.0.0"
  }
}

export default config
