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
  var unixTimestamp = date.getTime() / 1000;
  // console.log("Date in Unix: ", unixTimestamp);
  return unixTimestamp;
}

function unix24HourStartTime(unixTopOfHour) {
  unixTopOfHour -= 3600 * 24 * 1000;
  return unixTopOfHour;
}

function unix23HoursStartTime(unixTopOfHour) {
  unixTopOfHour -= 3600 * 23 * 1000;
  return unixTopOfHour;
}

function unixToSubtractToFindTopOfHour(date) {
  let unixToSubtract = 0;
  let minute = date.getMinutes();
  if (minute > 0) {
    unixToSubtract = minute * 60 * 1000;
  }
  return unixToSubtract;
}

export function unixStartAndEndTimes23And24(coin, date) {
  const startAndEndTimes = {
    coin: coin,
    startTime: null,
    endTime: null,
    multiplier: 1,
    timespan: "hour",
    limit: null,
  };
  let unixTopOfHour;
  startAndEndTimes.endTime = convertDateToUnix(date);
  let unixToSubtract = unixToSubtractToFindTopOfHour(date);
  if (unixToSubtract === 0) {
    // 24 hour
    unixTopOfHour = startAndEndTimes.endTime;
    startAndEndTimes.startTime = unix24HourStartTime(unixTopOfHour);
    startAndEndTimes.limit = 1440;
  } else {
    // 23 hour
    unixTopOfHour = startAndEndTimes.endTime - unixToSubtract;
    startAndEndTimes.startTime = unix23HoursStartTime(unixTopOfHour);
    startAndEndTimes.limit = 1380;
  }
  // console.log("Start Time: ", startAndEndTimes.startTime);
  // console.log("End Time: ", startAndEndTimes.endTime);
  // console.log("Start Date: ", convertUnixToDate(startAndEndTimes.startTime));
  // console.log("End Time: ", convertUnixToDate(startAndEndTimes.endTime));
  return startAndEndTimes;
}
