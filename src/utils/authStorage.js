// utils/authStorage.js
export function getUsers() {
  try {
    const users = localStorage.getItem("auth_users");
    const parsed = users ? JSON.parse(users) : {};
    return parsed;
  } catch (error) {
    console.error("[getUsers] Error:", error);
    return {};
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem("auth_users", JSON.stringify(users));
    
    // Verify save worked
    const verify = localStorage.getItem("auth_users");
    if (!verify) throw new Error("Save failed");
    return true;
  } catch (error) {
    console.error("[saveUsers] Error:", error);
    return false;
  }
}

export function getUserByEmail(email) {
  const users = getUsers();
  return users[email.toLowerCase()] || null;
}

export function createUser(userData) {
  const users = getUsers();
  const emailKey = userData.email.toLowerCase();
  
  if (users[emailKey]) {
    return { success: false, error: "User already exists" };
  }
  
  users[emailKey] = {
    userId: `user_${Date.now()}`,
    joinedDate: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    ...userData,
    email: emailKey,
  };
  
  const saved = saveUsers(users);
  return saved ? { success: true, user: users[emailKey] } : { success: false, error: "Failed to save user" };
}