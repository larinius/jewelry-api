const chrono = require("chrono-node");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

function parseDate(dateString) {
    const chronoResults = chrono.parse(dateString);
    if (chronoResults.length > 0) {
        const parsedDate = chronoResults[0].start.date();

        if (parsedDate) {
            const dateWithoutTime = dayjs(parsedDate).startOf("day").toDate();
            console.log(dateWithoutTime);
            return dateWithoutTime;
        }
    }

    return null;
}

function getDateOnly(date) {
    if (date instanceof Date) {
        const day = dayjs(date).utc().startOf("day").format("YYYY-MM-DD");
        return day;
    }

    return null;
}

function getNextDay(date) {
    if (date instanceof Date) {
        const nextDay = dayjs(date).utc().add(1, "day").startOf("day").format("YYYY-MM-DD");
        return nextDay;
    }

    return null;
}

module.exports = { parseDate, getDateOnly, getNextDay };
