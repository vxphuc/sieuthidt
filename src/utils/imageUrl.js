const LEGACY_UPLOAD_BASE_URL = "https://sieuthidt.io.vn/uploads/";

export const getImageUrl = (image) => {
  if (!image) return "";

  const value = String(image).trim();

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  return `${LEGACY_UPLOAD_BASE_URL}${encodeURI(value)}`;
};
