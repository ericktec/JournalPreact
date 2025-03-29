
export const emailRegex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

export const passwordRegex = new RegExp("^(?=.*[!@#$%^&*()_+\\\,/]).{8,20}$");

export const usernameRegex = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,20}$");