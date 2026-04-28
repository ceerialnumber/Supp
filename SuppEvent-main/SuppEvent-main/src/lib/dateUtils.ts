export const MONTH_ABBR_MAP: Record<string, number> = {
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
  'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11,
  'January': 0, 'February': 1, 'March': 2, 'April': 3, 'June': 5,
  'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
};

export const getEventDate = (dateStr: string, timeStr?: string) => {
  const parts = dateStr.split(' ');
  if (parts.length < 3) return new Date(0);
  const [d, mStr, y] = parts;
  const month = MONTH_ABBR_MAP[mStr];
  const day = parseInt(d);
  const year = parseInt(y);
  if (month === undefined || isNaN(day) || isNaN(year)) return new Date(0);
  
  const date = new Date(year, month, day);
  
  if (timeStr) {
    // Handle formats like "17:00" or "17:00 - 20:00"
    const startTime = timeStr.split('-')[0].trim();
    const [hours, minutes] = startTime.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      date.setHours(hours, minutes, 0, 0);
    }
  }

  return date;
};

export const isFutureEvent = (dateStr: string, timeStr?: string) => {
  const eventDate = getEventDate(dateStr, timeStr);
  const now = new Date();
  return eventDate > now;
};

export const isOngoingToday = (dateStr: string, timeStr?: string) => {
  const eventDate = getEventDate(dateStr, timeStr);
  const now = new Date();
  
  // If time is provided, we check if it's currently happening (loosely, or just today)
  // For the purpose of the UI "Upcoming" logic, we might still want "Today" to count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDay = new Date(eventDate);
  eventDay.setHours(0, 0, 0, 0);
  
  return eventDay.getTime() === today.getTime();
};

export const isPastEvent = (dateStr: string, timeStr?: string) => {
  const eventDate = getEventDate(dateStr, timeStr);
  const now = new Date();
  return eventDate < now;
};

export const isUpcoming = (dateStr: string, timeStr?: string) => {
  const eventDate = getEventDate(dateStr, timeStr);
  const now = new Date();
  return eventDate > now;
};
