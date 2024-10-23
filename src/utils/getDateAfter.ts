import { AutomateType } from "@/types";


export default function getScheduledDate(after: AutomateType): string {
  const currentDate = new Date();
  let scheduledDate = new Date(currentDate);

  switch (after) {
    case "3-day":
      scheduledDate.setDate(currentDate.getDate() + 3);
      break;
    case "1-week":
      scheduledDate.setDate(currentDate.getDate() + 7);
      break;
    case "1-month":
      scheduledDate.setMonth(currentDate.getMonth() + 1);
      break;
    case "3-month":
      scheduledDate.setMonth(currentDate.getMonth() + 3);
      break;
    default:
      throw new Error("Invalid AutomateType");
  }

  const year = scheduledDate.getFullYear();
  const month = String(scheduledDate.getMonth() + 1).padStart(2, '0');
  const day = String(scheduledDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

