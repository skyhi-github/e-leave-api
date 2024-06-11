const moment = require('moment');

export function calculateWorkDuration(startDate, endDate) {
  const start = moment(startDate || undefined);
  const end = moment(endDate || undefined);

  const years = end.diff(start, 'years');
  const months = end.diff(start.add(years, 'years'), 'months');

  let duration = '';

  if (years === 0 && months === 1) {
    duration = '1 Month';
  } else if (years === 0 && months > 1) {
    duration = `${months} Months`;
  } else if (years === 1 && months === 0) {
    duration = '1 Year';
  } else if (years > 1 && months === 0) {
    duration = `${years} Years`;
  } else if (years === 1 && months === 1) {
    duration = '1 Year, 1 Month';
  } else if (years === 1 && months > 1) {
    duration = '1 Year, ${months} Months';
  } else if (years > 1 && months === 1) {
    duration = `${years} Years, 1 Month`;
  } else if (years > 1 && months > 1) {
    duration = `${years} Years, ${months} Months`;
  }

  return duration;
}

