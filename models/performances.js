const performances = {
    "match1": {
        matchName: "Overpass 12.11.2023 m1",
        statistics: [
            { name: "Kills", value: 25 },
            { name: "Deaths", value: 15 },
            { name: "Assists", value: 5 },
        ],
    },
};

export function getPerformanceSummaries() {
  return Object.entries(performances).map(([id, Performance]) => {
    return { id, name: Performance.matchName };
  });
}
export function hasPerformance(performanceID) {
  return performances.hasOwnProperty(performanceID);
}

export function getPerformance(performanceID) {
  if (hasPerformance(performanceID))
    return { id: performanceID, ...performances[performanceID] };
  return null;
}

export function addPerformance(performanceID, stats) {
  if (hasPerformance(performanceID)) {
    for (let stat of stats) {
      for (let existingStat of performances[performanceID].statistics) {
         if (existingStat.name == stat.name) {
           existingStat.value += parseInt(stat.value);
         }
      }
    }
  }
}

export function validatePerformanceData(perf) {
  var errors = [];
  var fields = ["kills", "deaths", "assists"];
  for (let field of fields) {
    if (!perf.hasOwnProperty(field)) errors.push(`Missing field '${field}'`);
    else {
      if (typeof perf[field] != "string")
        errors.push(`'${field}' expected to be string`);
      else {
        if (perf[field].length < 1 || perf[field].length > 500)
          errors.push(`'${field}' expected length: 1-500`);
      }
    }
  }
  return errors;
}
export function addMatch(id, matchData) {
    performances[id] = matchData;
}

export default {
  getPerformanceSummaries,
  hasPerformance,
  getPerformance,
  addPerformance,
  validatePerformanceData,
  addMatch,
};