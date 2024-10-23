import { AutomateType } from "@/types";

export default function getFrequencyInFrench(automateType: AutomateType): string {
    switch (automateType) {
        case "3-day":
            return "3 days";
        case "1-week":
            return "1 week";
        case "1-month":
            return "1 month";
        case "3-month":
            return "3 months";
        default:
            return "Unknown Frequency";
    }
}