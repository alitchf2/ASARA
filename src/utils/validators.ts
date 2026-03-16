export const validatePasswordStrength = (password: string) => {
    const hasLength = password.length >= 8;
    const hasUpperLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9\s]/.test(password);
    
    return {
        hasLength,
        hasUpperLower,
        hasNumber,
        hasSpecial,
        isValid: hasLength && hasUpperLower && hasNumber && hasSpecial
    };
};
