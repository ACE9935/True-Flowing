import { AutomateType } from "@/types";

function calculateNextScheduledDate(currentDate: string, every: AutomateType): string {
    const date = new Date(currentDate);
  
    switch (every) {
      case "3-day":
        date.setDate(date.getDate() + 3);
        break;
      case "1-week":
        date.setDate(date.getDate() + 7);
        break;
      case "1-month":
        date.setMonth(date.getMonth() + 1);
        break;
      case "3-month":
        date.setMonth(date.getMonth() + 3);
        break;
      default:
        throw new Error("Invalid AutomateType");
    }
  
    return date.toISOString().split('T')[0]; // Return date in 'YYYY-MM-DD' format
  }