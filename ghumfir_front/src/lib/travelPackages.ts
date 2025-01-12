// Component Interface
export interface TravelPackage {
    destination: string;
    price: number;
    duration: string;
    flight: string;
    hotel: string;
    activities: string[];
    transport: string;
    accommodation: string;
    weather: string;
    matchScore: number;
    Actions: string[];
}

export function adaptTravelPackage(apiPackage: any): TravelPackage {
    // Debug log to see what data we're receiving
    console.log("Received API Package:", JSON.stringify(apiPackage, null, 2));

    // Enhanced validation
    if (!apiPackage || typeof apiPackage !== 'object') {
        console.error("Invalid package data received:", apiPackage);
        throw new Error('Invalid package data');
    }

    // Helper function to safely concatenate type and details
    const formatDetails = (obj: any) => {
        if (!obj) return '';
        const type = obj.type || '';
        const details = obj.details || '';
        return type && details ? `${type} - ${details}` : type || details || '';
    };

    try {
        const adapted: TravelPackage = {
            destination: (() => {
                const dest = apiPackage.Destination || apiPackage.destination;
                if (dest?.name) {
                    return `${dest.name}${dest.country ? `, ${dest.country}` : ''}`;
                }
                return 'Unknown Destination';
            })(),
            
            price: (() => {
                const price = apiPackage.Price || apiPackage.price;
                return typeof price === 'number' ? price : 0;
            })(),

            duration: (() => {
                const duration = apiPackage.Duration || apiPackage.duration;
                return typeof duration === 'number' || typeof duration === 'string' 
                    ? `${duration} days` 
                    : '0 days';
            })(),

            flight: (() => {
                const transport = apiPackage.Transport || apiPackage.transport;
                return formatDetails(transport) || 'No transport information available';
            })(),

            hotel: (() => {
                const accommodation = apiPackage.Accommodation || apiPackage.accommodation;
                return formatDetails(accommodation) || 'No hotel information available';
            })(),

            activities: (() => {
                const activities = apiPackage.Activities || apiPackage.activities;
                return Array.isArray(activities) 
                    ? activities.filter(activity => typeof activity === 'string')
                    : [];
            })(),

            transport: (() => {
                const transport = apiPackage.Transport || apiPackage.transport;
                return formatDetails(transport) || 'No transport information available';
            })(),

            accommodation: (() => {
                const accommodation = apiPackage.Accommodation || apiPackage.accommodation;
                return formatDetails(accommodation) || 'No accommodation information available';
            })(),

            weather: 'Weather information unavailable',

            matchScore: (() => {
                const match = apiPackage.Match || apiPackage.match;
                return typeof match === 'number' ? match : 0;
            })(),

            Actions: (() => {
                const buttons = apiPackage.ActionButtons || apiPackage.actionButtons;
                return Array.isArray(buttons) 
                    ? buttons
                        .filter(btn => btn && typeof btn === 'object')
                        .map(btn => btn.type)
                        .filter(Boolean)
                    : [];
            })()
        };

        // Debug log the adapted package
        console.log("Adapted Package:", JSON.stringify(adapted, null, 2));

        return adapted;
    } catch (error) {
        console.error("Error adapting travel package:", error);
        throw error;
    }
}