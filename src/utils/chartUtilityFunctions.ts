import { UserQRCode } from "@/types";

export function parseDate(dateString: string): Date {
    return new Date(dateString);
}

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function getScansPerMonthOfYear(qrCode: UserQRCode, year: Date): number[] {
    const scansPerMonth: number[] = [];
    for (let month = 0; month < 12; month++) {
        const endDate = new Date(year.getFullYear(), month + 1, 0);
        const scans = getScansPerDayOfMonth(qrCode, endDate).reduce((acc, val) => acc + val, 0);
        scansPerMonth.push(scans);
    }
    return scansPerMonth;
}

export function getWinnersPerMonthOfYear(qrCode: UserQRCode, year: Date): number[] {
    const winnersPerMonth: number[] = [];
    for (let month = 0; month < 12; month++) {
        const endDate = new Date(year.getFullYear(), month + 1, 0);
        const winners = getWinnersPerDayOfMonth(qrCode, endDate).reduce((acc, val) => acc + val, 0);
        winnersPerMonth.push(winners);
    }
    return winnersPerMonth;
}

export function getDaysInMonth(date:Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
}

export function getScansPerDayOfMonth(qrCode: UserQRCode, desiredMonth: Date): number[] {
    // Extract year and month from the desiredMonth date
    const year = desiredMonth.getFullYear();
    const month = desiredMonth.getMonth();

    // Initialize an array to hold the number of scans for each day of the month
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const scansPerDay = new Array(daysInMonth).fill(0); // Array size based on days in the desired month

    // Get today's date in YYYY-MM-DD format in UTC
    const today = new Date().toISOString().split('T')[0];

    // Create a map for quick lookup of scans by date
    const scansMap = new Map<string, number>();
    qrCode.scansForDate.forEach(entry => {
        scansMap.set(entry.date, entry.scans);
    });

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
        if (date === today) {
            scansPerDay[day - 1] = qrCode.scansPerDay;
        } else {
            scansPerDay[day - 1] = scansMap.get(date) || 0;
        }
    }
    return scansPerDay;
}

export function getWinnersPerDayOfMonth(qrCode: UserQRCode, desiredMonth: Date): number[] {
    // Extract year and month from the desiredMonth date
    const year = desiredMonth.getFullYear();
    const month = desiredMonth.getMonth();

    // Initialize an array to hold the number of winners for each day of the month
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const winnersPerDay = new Array(daysInMonth).fill(0); // Array size based on days in the desired month

    // Get today's date in YYYY-MM-DD format in UTC
    const today = new Date().toISOString().split('T')[0];

    // Create a map for quick lookup of winners by date
    const winnersMap = new Map<string, number>();
    qrCode.winnersForDate.forEach(entry => {
        winnersMap.set(entry.date, entry.winners);
    });

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
        if (date === today) {
            winnersPerDay[day - 1] = qrCode.winnersPerDay;
        } else {
            winnersPerDay[day - 1] = winnersMap.get(date) || 0;
        }
    }
    return winnersPerDay;
}

export function getWeekWinnersData(qrCode: UserQRCode, endDate: Date) {
    const { start, end } = getWeekRange(endDate);
    const weekDates = getDatesForWeek(start, end);
    const today = new Date().toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
  
    const finalData = weekDates.map(date => {
      const entry = qrCode.winnersForDate.find(winner => winner.date === date);
      if (date === today) {
        return qrCode.winnersPerDay; // Today's winners from qrCode object
      }
      return entry ? entry.winners : 0;
    });
  
    return finalData;
}

export function getWeekWinnersDataForProgress(qrCode: UserQRCode, endDate: Date) {
    const { start, end } = getWeekRange(endDate);
    const weekDates = getDatesForWeek(start, end);
  
    const finalData = weekDates.map(date => {
        const entry = qrCode.winnersForDate.find(winner => winner.date === date);
        return { date, winners: entry ? entry.winners : 0 };
    });

    return finalData;
}

export function compareWeeklyWinnersProgress(qrCode: UserQRCode, currentDate: Date): number {
    // Calculate the current week range
    const currentWeekRange = getWeekRange(currentDate);
    const { start: currentWeekStartDate, end: currentWeekEndDate } = currentWeekRange;

    // Get winners data for the current week including today's winners
    const currentWeekWinners = [...getWeekWinnersData(qrCode, currentWeekEndDate)];

    // Calculate the previous week range
    const previousWeekEndDate = getLastWeekDate(currentWeekStartDate);
    const previousWeekStartDate = getLastWeekDate(previousWeekEndDate);

    // Get winners data for the previous week
    const previousWeekWinners = getWeekWinnersData(qrCode, previousWeekEndDate);

    // Calculate the difference between current week and previous week winners
    const currentWeekTotal = currentWeekWinners.reduce((acc, val) => acc + val, 0);
    const previousWeekTotal = previousWeekWinners.reduce((acc, val) => acc + val, 0);
    const difference = currentWeekTotal - previousWeekTotal;

    return difference;
}
  
export function getWeekRange(endDate: Date): { start: Date, end: Date } {
    const end = new Date(endDate);
    const start = new Date(end);
    start.setDate(end.getDate() - 6); // Subtract 5 days to get the start of the week

    return { start, end };
}

export function getDatesForWeek(start: Date, end: Date): string[] {
    const dates = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
        dates.push(currentDate.toISOString().split('T')[0]); // Convert to YYYY-MM-DD format
        currentDate.setDate(currentDate.getDate() + 1); // Increment currentDate
    }
    return dates;
}

export function getWeekScansData(qrCode: UserQRCode, endDate: Date) {
    const { start, end } = getWeekRange(endDate);
    const weekDates = getDatesForWeek(start, end);
    const today = new Date().toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
  
    const finalData = weekDates.map(date => {
      const entry = qrCode.scansForDate.find(scan => scan.date === date);
      if (date === today) {
        return qrCode.scansPerDay; // Today's scans from qrCode object
      }
      return entry ? entry.scans : 0;
    });
  
    return finalData;
  }

export function getWeekScansDataForProgress(qrCode: UserQRCode, endDate: Date) {
    const { start, end } = getWeekRange(endDate);
    const weekDates = getDatesForWeek(start, end);
  
    const finalData=weekDates.map(date => {
        const entry = qrCode.scansForDate.find(scan => scan.date === date);
        return {date,scans:entry ? entry.scans : 0,}
    });

    return finalData
}

const getLastWeekDate = (date: Date) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 7);
    return newDate;
};

export function compareWeeklyScanProgress(qrCode: UserQRCode, currentDate: Date): number {
    // Calculate the current week range
    const currentWeekRange = getWeekRange(currentDate);
    const { start: currentWeekStartDate, end: currentWeekEndDate } = currentWeekRange;

    // Get scans data for the current week including today's scans
    const currentWeekScans = [...getWeekScansData(qrCode, currentWeekEndDate)];

    // Calculate the previous week range
    const previousWeekEndDate = getLastWeekDate(currentWeekStartDate);
    const previousWeekStartDate = getLastWeekDate(previousWeekEndDate);

    // Get scans data for the previous week
    const previousWeekScans = getWeekScansData(qrCode, previousWeekEndDate);

    // Calculate the difference between current week and previous week scans
    const currentWeekTotal = currentWeekScans.reduce((acc, val) => acc + val, 0);
    const previousWeekTotal = previousWeekScans.reduce((acc, val) => acc + val, 0);
    const difference = currentWeekTotal - previousWeekTotal;

    return difference;
}
 
  
  
  