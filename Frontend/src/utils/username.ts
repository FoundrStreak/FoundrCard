export const generateRandomUsername = (base: string): string => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${base}${randomSuffix}`;
  };
  
  export const validateUsernameFormat = (username: string): string | null => {
    if (!username.trim()) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Only letters, numbers, and underscores allowed";
    }
    return null;
  };