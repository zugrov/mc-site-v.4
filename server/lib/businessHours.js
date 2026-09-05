const DEFAULT_WORK_HOURS = {
  timezone: 'Europe/Moscow',
  days: [1, 2, 3, 4, 5],
  startHour: 9,
  startMinute: 0,
  endHour: 19,
  endMinute: 0,
  slaMinutes: 15,
};

function getWorkHoursConfig() {
  const raw = process.env.BITRIX_WORK_HOURS;
  if (!raw) {
    return DEFAULT_WORK_HOURS;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_WORK_HOURS,
      ...parsed,
    };
  } catch (error) {
    return DEFAULT_WORK_HOURS;
  }
}

function getZonedParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const map = {};
  parts.forEach(function (part) {
    if (part.type !== 'literal') {
      map[part.type] = part.value;
    }
  });

  const weekdayMap = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    weekday: weekdayMap[map.weekday],
  };
}

function toMinutes(parts) {
  return parts.hour * 60 + parts.minute;
}

function isWorkingMoment(parts, config) {
  if (!config.days.includes(parts.weekday)) {
    return false;
  }

  const minutes = toMinutes(parts);
  const start = config.startHour * 60 + config.startMinute;
  const end = config.endHour * 60 + config.endMinute;

  return minutes >= start && minutes < end;
}

function makeDateInTimeZone(year, month, day, hour, minute, timeZone) {
  let guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  for (let i = 0; i < 3; i += 1) {
    const parts = getZonedParts(guess, timeZone);
    const targetUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
    const actualUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      0,
    );
    guess = new Date(guess.getTime() + (targetUtc - actualUtc));
  }

  return guess;
}

function getNextWorkStart(fromDate, config) {
  for (let offset = 0; offset < 8; offset += 1) {
    const probe = new Date(fromDate.getTime() + offset * 24 * 60 * 60 * 1000);
    const parts = getZonedParts(probe, config.timezone);

    if (!config.days.includes(parts.weekday)) {
      continue;
    }

    const startDate = makeDateInTimeZone(
      parts.year,
      parts.month,
      parts.day,
      config.startHour,
      config.startMinute,
      config.timezone,
    );

    if (startDate.getTime() > fromDate.getTime()) {
      return startDate;
    }

    if (offset === 0 && toMinutes(parts) < config.startHour * 60 + config.startMinute) {
      return startDate;
    }
  }

  return new Date(fromDate.getTime() + config.slaMinutes * 60 * 1000);
}

function getSlaDeadline(now) {
  const config = getWorkHoursConfig();
  const current = now || new Date();
  const parts = getZonedParts(current, config.timezone);
  const slaMs = config.slaMinutes * 60 * 1000;

  if (isWorkingMoment(parts, config)) {
    return new Date(current.getTime() + slaMs).toISOString();
  }

  const nextStart = getNextWorkStart(current, config);
  return new Date(nextStart.getTime() + slaMs).toISOString();
}

module.exports = {
  getSlaDeadline,
};
