"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
// Get the base URL - in production this will be your deployed URL
const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:3000"; // For local development
    }
    return "https://your-app-name.vercel.app"; // Replace with your actual Vercel URL
};
const BASE_URL = getBaseUrl();
class ApiClient {
    baseUrl;
    userId = null;
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    setUserId(userId) {
        this.userId = userId;
    }
    getUserId() {
        return this.userId;
    }
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}/api${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            ...(this.userId && { "x-user-id": this.userId }),
            ...options.headers,
        };
        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || "An error occurred",
                };
            }
            return data;
        }
        catch (error) {
            console.error("API request failed:", error);
            return {
                success: false,
                error: "Network error occurred",
            };
        }
    }
    // User endpoints
    async registerUser(userData) {
        const response = await this.makeRequest("/users/register", {
            method: "POST",
            body: JSON.stringify(userData),
        });
        // If registration successful, store the user ID
        if (response.success && response.data) {
            this.setUserId(response.data.id);
        }
        return response;
    }
    async getUserProfile() {
        if (!this.userId) {
            return {
                success: false,
                error: "No user ID available",
            };
        }
        return this.makeRequest("/users/profile");
    }
    // Clue endpoints
    async getUserClues() {
        return this.makeRequest("/clues");
    }
    async getClue(clueId) {
        return this.makeRequest(`/clues/${clueId}`);
    }
    async unlockClue(clueId, password) {
        if (!this.userId) {
            return {
                success: false,
                error: "No user ID available",
            };
        }
        return this.makeRequest(`/clues/${clueId}/unlock`, {
            method: "POST",
            body: JSON.stringify({
                userId: this.userId,
                password,
            }),
        });
    }
    // Health check
    async healthCheck() {
        return this.makeRequest("/health");
    }
}
// Create and export a singleton instance
exports.apiClient = new ApiClient(BASE_URL);
