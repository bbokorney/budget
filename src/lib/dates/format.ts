export default function formatDate(time?: number) {
  if (!time) {
    return "";
  }
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric", month: "short", day: "numeric",
  };
  return (new Date(time)).toLocaleString("en-US", options);
}
