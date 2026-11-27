/**
 * Attendance and Calendar Utilities for Vishwakarma Engineer Workshop
 */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

export function generateMonthCalendar(monthKey, attendanceRecords = [], lang = 'en') {
  if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
    const d = new Date();
    monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  const [year, month] = monthKey.split('-').map(Number);
  const totalDays = new Date(year, month, 0).getDate();

  // Map attendance records by YYYY-MM-DD
  const attendanceMap = new Map();
  if (Array.isArray(attendanceRecords)) {
    for (const r of attendanceRecords) {
      if (!r) continue;
      const rawDate = r.workDate;
      const dStr = typeof rawDate === 'string'
        ? rawDate.slice(0, 10)
        : rawDate instanceof Date
        ? rawDate.toISOString().slice(0, 10)
        : '';
      if (dStr) {
        attendanceMap.set(dStr, r);
      }
    }
  }

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const days = [];
  let presentCount = 0;
  let halfDayCount = 0;
  let absentCount = 0;

  for (let d = 1; d <= totalDays; d++) {
    const dayStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(year, month - 1, d);
    const dayIndex = dateObj.getDay();
    const dayName = DAY_NAMES[dayIndex];
    const dayNameHi = DAY_NAMES_HI[dayIndex];
    const isSunday = dayIndex === 0;
    const isFuture = dayStr > todayStr;

    const record = attendanceMap.get(dayStr);
    let status = 'unmarked';
    let workCredit = 0;

    if (record) {
      status = record.status;
      if (status === 'present') {
        presentCount += 1;
        workCredit = 1.0;
      } else if (status === 'half-day') {
        halfDayCount += 1;
        workCredit = 0.5;
      } else if (status === 'absent') {
        absentCount += 1;
        workCredit = 0;
      }
    } else if (isSunday) {
      status = 'sunday';
      workCredit = 0;
    } else if (isFuture) {
      status = 'upcoming';
      workCredit = 0;
    }

    days.push({
      dayNumber: d,
      dateStr: dayStr,
      dateFormatted: new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(dateObj),
      dayName,
      dayNameHi,
      isSunday,
      isFuture,
      status,
      workCredit,
      record: record || null,
    });
  }

  const totalMarkedDays = presentCount + halfDayCount + absentCount;
  const effectivePresent = presentCount + halfDayCount * 0.5;
  const accuracyPercentage = totalMarkedDays > 0
    ? Math.round((effectivePresent / totalMarkedDays) * 1000) / 10
    : 100;

  let accuracyRating = lang === 'hi' ? 'उत्कृष्ट उपस्थिति' : 'Excellent';
  let accuracyColor = '#16a34a'; // Green
  if (accuracyPercentage < 60) {
    accuracyRating = lang === 'hi' ? 'सुधार की आवश्यकता' : 'Needs Attention';
    accuracyColor = '#dc2626'; // Red
  } else if (accuracyPercentage < 75) {
    accuracyRating = lang === 'hi' ? 'सामान्य उपस्थिति' : 'Average';
    accuracyColor = '#ea580c'; // Amber
  } else if (accuracyPercentage < 90) {
    accuracyRating = lang === 'hi' ? 'संतोषजनक उपस्थिति' : 'Good';
    accuracyColor = '#2563eb'; // Blue
  }

  return {
    monthKey,
    totalDays,
    days,
    stats: {
      presentCount,
      halfDayCount,
      absentCount,
      totalMarkedDays,
      effectivePresent,
      accuracyPercentage,
      accuracyRating,
      accuracyColor,
    },
  };
}

export const MONTH_NAMES_IN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_NAMES_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

export function formatMonthDisplay(monthKey, lang = 'en') {
  if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) return '';
  const [year, month] = monthKey.split('-').map(Number);
  const enName = MONTH_NAMES_IN[month - 1];
  const hiName = MONTH_NAMES_HI[month - 1];
  return lang === 'hi' ? `${hiName} ${year}` : `${enName} ${year}`;
}

/**
 * Returns a list of past N months including current month for dropdown selectors
 */
export function getSelectableMonths(count = 12, lang = 'en') {
  const months = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      key,
      label: formatMonthDisplay(key, lang),
    });
  }
  return months;
}
