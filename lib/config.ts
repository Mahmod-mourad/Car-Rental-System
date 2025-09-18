// Configuration for the application
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    isBackendAvailable: () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      return baseUrl && baseUrl !== "http://localhost:3001"
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
