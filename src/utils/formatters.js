/**
 * Formats a number or string into a 3-digit invoice string (e.g. 7 -> "007", 42 -> "042").
 */
export const formatInvoiceNo = (num) => {
  if (num === null || num === undefined) return "000";
  return String(num).padStart(3, "0");
};

/**
 * Safely parses any date string (ISO, datetime-local, timestamp) into a valid Date object.
 * Handles missing seconds in datetime-local (e.g. "2026-07-28T13:00" -> "2026-07-28T13:00:00").
 */
export const parseEventDate = (dateInput) => {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? null : dateInput;

  let str = String(dateInput).trim();
  
  // Append :00 seconds if string matches YYYY-MM-DDTHH:mm
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str)) {
    str += ':00';
  }
  // Replace space with T if YYYY-MM-DD HH:mm:ss
  str = str.replace(' ', 'T');

  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  const timestamp = Date.parse(str);
  if (!isNaN(timestamp)) return new Date(timestamp);

  return null;
};

/**
 * Computes exact real-time event status: 'UPCOMING' | 'LIVE' | 'ENDED'
 */
export const getEventRealtimeStatus = (event, nowInput) => {
  const now = nowInput instanceof Date ? nowInput : new Date();
  if (!event) return 'UPCOMING';

  const parsedStart = parseEventDate(event.startDate);
  const parsedEnd = parseEventDate(event.endDate);

  if (parsedStart && now < parsedStart) return 'UPCOMING';
  if (parsedEnd && now > parsedEnd) return 'ENDED';
  if (parsedStart && parsedEnd && now >= parsedStart && now <= parsedEnd) return 'LIVE';

  return 'LIVE';
};

/**
 * Formats an ISO string or Date into a user-friendly Indian locale date time string.
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return "";
  const date = parseEventDate(dateInput);
  if (!date) return "";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};
