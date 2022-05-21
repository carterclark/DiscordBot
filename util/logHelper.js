function logTime(startTime, totalTime, callCounter) {
  let endTime = Date.now() - startTime;
  totalTime += endTime;
  console.log(
    `Rolling complete after: ${endTime} seconds\tAverage: ${
      totalTime / ++callCounter
    } seconds`
  );
}

module.exports = { logTime };
