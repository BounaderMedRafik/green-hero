export const sendEcoChatMessage = async (
  message: string,
  baseUrl = "https://ae74a3507191.ngrok-free.app/api"
) => {
  try {
    // 1. Detailed log to see if the URL is correct in Metro bundler
    console.log(`[Expo Go] Requesting: ${baseUrl}/chat`);

    const response = await fetch(`${baseUrl}/chat`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Crucial for ngrok: this bypasses the HTML warning page
        "ngrok-skip-browser-warning": "true",
        // Helps avoid CORS issues in some Expo environments
        "User-Agent": "ExpoGo-App",
      },
      body: JSON.stringify({ message }), // Key must be 'message'
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.error || `Status: ${response.status}`);
    }

    return data.response; // AI output
  } catch (error: any) {
    // If you see "TypeError: Network request failed" here, check the checklist below
    console.error("[Expo Go Network Error]:", error);
    throw error;
  }
};
