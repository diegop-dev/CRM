export const handleLogin = async (username, password, navigation) => {
  try {
    const correctUsername = "admin";
    const correctPassword = "123456";

    if (username === correctUsername && password === correctPassword) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error en el login:", error);
    return false;
  }
};
