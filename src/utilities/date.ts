export function formatDate(
  date: string | number | Date,
  dateStyle: "full" | "long" | "medium" | "short"
) {
  const formatOptions: Intl.DateTimeFormatOptions = { dateStyle };
  const dateFormatter = new Intl.DateTimeFormat("en-US", formatOptions);

  return dateFormatter.format(new Date(date));
}
