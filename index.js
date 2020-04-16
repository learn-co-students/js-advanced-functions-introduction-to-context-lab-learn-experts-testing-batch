function createEmployeeRecord(employeeData){
    const [ firstName, familyName, title, payPerHour ] = employeeData;
    return {
        firstName,
        familyName,
        title,
        payPerHour,
        timeInEvents: [],
        timeOutEvents: []
    }
}

function createEmployeeRecords(employeeRecords){
    return employeeRecords.map(createEmployeeRecord)
}

// function createTimeInEvent(employeeRecord, dateStamp){
//     return createTimeEvent(employeeRecord, dateStamp, "timeIn")
// }

const [createTimeInEvent, createTimeOutEvent] = [createTimeEvent("timeIn"), createTimeEvent("timeOut")]

// function createTimeOutEvent(employeeRecord, dateStamp){
//     return createTimeEvent(employeeRecord, dateStamp, "timeOut")
// }

function createTimeEvent(type){
    return function(employeeRecord, dateStamp){
        const [ date, hour ] = dateStamp.split(" ");
        employeeRecord[`${type}Events`].push({
            type: type.replace("t", "T"),
            hour: parseInt(hour),
            date
        });
        return employeeRecord;
    }
}

const [timeInFinder, timeOutFinder] = [createTimeFinder("timeIn"), createTimeFinder("timeOut")];

function hoursWorkedOnDate(employeeRecord, dateStamp){
    return (timeOutFinder(employeeRecord, dateStamp) - timeInFinder(employeeRecord, dateStamp))/100;
}

function createTimeFinder(type){ // given time event type, returns a function which returns time of time event for certain employee and date
    return function(employeeRecord, dateStamp){
        return employeeRecord[`${type}Events`].find(function(timeRecord){
            return timeRecord.date === dateStamp;
        }).hour;
    }
}

function wagesEarnedOnDate(employeeRecord, dateStamp){
    return hoursWorkedOnDate(employeeRecord, dateStamp) * employeeRecord.payPerHour;
}

function allWagesFor(employeeRecord){
    return employeeRecord.timeInEvents.reduce(function(accumulator, currentValue){
        return accumulator + wagesEarnedOnDate(employeeRecord, currentValue.date);
    }, 0)
}

function calculatePayroll(employeeRecords){
    return employeeRecords.reduce(function(accumulator, currentValue){
        return accumulator + allWagesFor(currentValue);
    }, 0)
}

function findEmployeeByFirstName(employeeRecords, firstName){
    return employeeRecords.find(function(record){
        return record.firstName === firstName;
    })
}