// utils/appStorage.js
// Clear ONLY app data, NOT authentication data
export function clearAllAppData() {
  try {
    // Preserve auth data
    const authUsers = localStorage.getItem("auth_users");
    const authSession = localStorage.getItem("auth_session");
    
    // Get all keys
    const keys = Object.keys(localStorage);
    
    // Remove all app-specific keys
    keys.forEach(key => {
      if (!key.startsWith("auth_")) {
        localStorage.removeItem(key);
      }
    });
    
    // Restore auth data if they were somehow affected
    if (authUsers) localStorage.setItem("auth_users", authUsers);
    if (authSession) localStorage.setItem("auth_session", authSession);
    
    console.log("[clearAllAppData] Cleared app data, preserved auth");
  } catch (error) {
    console.error("[clearAllAppData] Error:", error);
  }
}

export function getUserAppData(userId, key) {
  try {
    const data = localStorage.getItem(`${key}_${userId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setUserAppData(userId, key, value) {
  try {
    localStorage.setItem(`${key}_${userId}`, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}