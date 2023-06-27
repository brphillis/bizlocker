export const isValidEmail = (email: string): boolean => {
  // Defining the email regex pattern
  const regexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Testing the provided email against the pattern
  return regexPattern.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least one uppercase letter (A-Z)
  // At least one lowercase letter (a-z)
  // At least one digit (0-9)
  // At least one special character (!@#$%^&*)
  // At least 8 characters long, but no more than 32
  const regexPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

  // Testing the provided email against the pattern
  return regexPattern.test(password);
};
