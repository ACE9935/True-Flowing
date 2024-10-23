export function getPastWeekDays(endDate: Date): string[] {
  const options: Intl.DateTimeFormatOptions = { month: '2-digit', day: '2-digit' };
  const pastWeekDays: string[] = [];

  for (let i = 0; i < 7; i++) {
      const pastDate = new Date(endDate);
      pastDate.setDate(endDate.getDate() - i);
      const formattedDate = pastDate.toLocaleDateString('en-US', options);
      pastWeekDays.push(formattedDate);
  }

  return pastWeekDays.reverse();
}