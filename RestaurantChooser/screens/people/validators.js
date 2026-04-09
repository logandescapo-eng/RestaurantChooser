export const validateFirstName = (name) => {
  if (!name.trim()) return "First name is required";
  if (name.trim().length < 2) return "First name must be at least 2 characters";
  return null;
};

export const validateLastName = (name) => {
  if (!name.trim()) return "Last name is required";
  if (name.trim().length < 2) return "Last name must be at least 2 characters";
  return null;
};