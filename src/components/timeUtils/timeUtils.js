// new Date format: "Sat Dec 04 2021 00:00:00"

// export function convertUnixToDate(unixTime) {
//   const date = new Date(unixTime);
//   // console.log("Date: ", date);
//   return date;
// }

// export function convertDateToUnix(date) {
//   var unixTimestamp = date.getTime() / 1000;
//   // console.log("Date in Unix: ", unixTimestamp);
//   return unixTimestamp;
// }

// function unix24HourStartTime(unixTopOfHour) {
//   unixTopOfHour -= 3600 * 24;
//   return unixTopOfHour;
// }

// function unix23HoursStartTime(unixTopOfHour) {
//   unixTopOfHour -= 3600 * 23;
//   return unixTopOfHour;
// }

// function unixToSubtractToFindTopOfHour(date) {
//   let unixToSubtract = 0;
//   let minute = date.getMinutes();
//   if (minute > 0) {
//     unixToSubtract = minute * 60;
//   }
//   return unixToSubtract;
// }

// export function unixStartAndEndTimes23And24CG(coin, date) {
//   const startAndEndTimes = { coin: coin, startTime: null, endTime: null };
//   let unixTopOfHour;
//   startAndEndTimes.endTime = convertDateToUnix(date);
//   let unixToSubtract = unixToSubtractToFindTopOfHour(date);
//   if (unixToSubtract === 0) {
//     // 24 hour
//     unixTopOfHour = startAndEndTimes.endTime;
//     startAndEndTimes.startTime = unix24HourStartTime(unixTopOfHour);
//   } else {
//     // 23 hour
//     unixTopOfHour = startAndEndTimes.endTime - unixToSubtract;
//     startAndEndTimes.startTime = unix23HoursStartTime(unixTopOfHour);
//   }
//   // console.log("Start Time: ", startAndEndTimes.startTime);
//   // console.log("End Time: ", startAndEndTimes.endTime);
//   // console.log("Start Date: ", convertUnixToDate(startAndEndTimes.startTime));
//   // console.log("End Time: ", convertUnixToDate(startAndEndTimes.endTime));
//   return startAndEndTimes;
// }

export function convertUnixToDate(unixTime) {
  const date = new Date(unixTime * 1000);
  // console.log("Date: ", date);
  return date;
}

export function convertDateToUnix(date) {
  var unixTimestamp = Math.floor(date / 1000);
  //unixTimestamp = Math.floor(;
  // unixTimestamp.toFixed(0);
  // console.log("Date in Unix: ", unixTimestamp);
  return unixTimestamp;
}

function unix24HourStartTime(unixTopOfHour) {
  unixTopOfHour -= 3600 * 24;
  return unixTopOfHour;
}

function unix23HoursStartTime(unixTopOfHour) {
  unixTopOfHour -= 3600 * 23;
  return unixTopOfHour;
}

function unixToSubtractToFindTopOfHour(date) {
  let unixToSubtract = 0;
  let minute = date.getMinutes();
  if (minute > 0) {
    unixToSubtract = minute * 60;
  }
  return unixToSubtract;
}

export function unixStartAndEndTimes23And24(date) {
  const startAndEndTimes = {
    // coin: coin,
    startTime: null,
    endTime: null,
    hours: null,
    // period: 3600,
  };
  let unixTopOfHour;
  startAndEndTimes.endTime = convertDateToUnix(date);
  let unixToSubtract = unixToSubtractToFindTopOfHour(date);
  if (unixToSubtract === 0) {
    // 24 hour
    unixTopOfHour = startAndEndTimes.endTime;
    startAndEndTimes.startTime = unix24HourStartTime(unixTopOfHour);
    startAndEndTimes.hours = 24;
  } else {
    // 23 hour
    unixTopOfHour = startAndEndTimes.endTime - unixToSubtract;
    startAndEndTimes.endTime = unixTopOfHour;
    startAndEndTimes.startTime = unix23HoursStartTime(unixTopOfHour);
    startAndEndTimes.hours = 23;
  }
  return startAndEndTimes;
}

export function unixStartAndEndTimesLastCandle(date) {
  const startAndEndTimes = {
    // coin: coin,
    startTime: null,
    endTime: null,
    // period: 3600,
  };
  startAndEndTimes.endTime = convertDateToUnix(date);
  let unixToSubtract = unixToSubtractToFindTopOfHour(date);
  startAndEndTimes.startTime = startAndEndTimes.endTime - unixToSubtract - 60;
  startAndEndTimes.endTime = convertDateToUnix(date);
  return startAndEndTimes;
}
