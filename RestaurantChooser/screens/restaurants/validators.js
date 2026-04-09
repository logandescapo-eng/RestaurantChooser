export const validateName = (name) => {
  if (!name.trim()) return "Restaurant name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z0-9\s,'"-]*$/.test(name)) return "Name contains invalid characters";
  return null;
};

export const validatePhone = (phone) => {
  if (!phone.trim()) return "Phone number is required";
  if (!/^[0-9\s\-+().]{7,20}$/.test(phone)) return "Please enter a valid phone number";
  return null;
};

export const validateAddress = (address) => {
  if (!address.trim()) return "Address is required";
  if (!/\d/.test(address)) return "Address must include a street number";
  if (address.trim().length < 5) return "Please enter a full address";
  return null;
};

export const validateWebsite = (website) => {
  if (!website.trim()) return "Website is required";
  if (!/^https?:\/\/.+\..+/.test(website)) return "Website must start with http:// or https://";
  return null;
};