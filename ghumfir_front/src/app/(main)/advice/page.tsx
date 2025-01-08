import { Metadata } from "next";
import TripAdvisor from "./advice"; // Import the TripAdvisor component

// Define metadata for the page
export const metadata: Metadata = {
    title: "Trip Advisor",
    description: "Find your perfect travel destination with Ghumfir",
};

// Define the AdvisorPage component
export default async function AdvisorPage() {
    return <TripAdvisor />;
}