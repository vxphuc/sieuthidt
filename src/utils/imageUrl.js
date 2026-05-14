const apiBaseUrl = process.env.REACT_APP_SIEU_THI_API || "https://besieuthidt.io.vn";
const UPLOAD_BASE_URL = `${apiBaseUrl.replace(/\/$/, "")}/uploads/`;

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

  return `${UPLOAD_BASE_URL}${encodeURI(value)}`;
};
