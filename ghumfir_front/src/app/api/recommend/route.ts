// // app/api/travel/route.ts
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// interface TravelPackage {
//   destination: string;
//   duration: string;
//   match: string;
//   transport: string;
//   stay: string;
//   activities: string[];
//   price: string;
//   actions: string[];
// }

// interface APIResponse {
//   success: boolean;
//   data?: TravelPackage[];
//   error?: string;
// }

// function cleanAndParseResponse(response: string): TravelPackage[] {
//   try {
//     let cleaned = response.trim().replace(/^```json\s*/, "").replace(/\s*```$/, "");
//     const parsed = JSON.parse(cleaned);

//     if (!Array.isArray(parsed)) {
//       throw new Error("Parsed response is not an array");
//     }

//     return parsed;
//   } catch (error) {
//     console.error("Error parsing response:", error);
//     throw error;
//   }
// }

// export async function GET(request: Request) {
//   try {
//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       throw new Error("GEMINI_API_KEY is not set");
//     }

//     const { searchParams } = new URL(request.url);
//     // console.log("Search Params:", searchParams.toString()); 
//     const priceRange = searchParams.get("priceRange") || "500-1000";
//     const preferredCurrency = searchParams.get("currency") || "USD";
//     const preferredActivities = searchParams.get("activities")?.split(",") || [];
//     const duration = searchParams.get("duration") || "3-7 days";

//     // const keywords = extractSearchKeywords(searchParams);


//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
//       Generate travel packages in JSON format. Each package includes:
//       - Destination (name, country)
//       - Duration (${duration})
//       - Match (%)
//       - Transport details
//       - Accommodation
//       - Activities: ${preferredActivities.join(", ")}
//       - Price in ${preferredCurrency} within ${priceRange}
//       - Action buttons (e.g., Share, View Details)
//       Ensure output is a JSON array.
//     `;

//     console.log("Prompt:", prompt);
//     const result = await model.generateContent(prompt);
//     const response = await result.response.text();
//     console.log("Response:", response);

//     const packages = cleanAndParseResponse(response);

//     return NextResponse.json({ success: true, data: packages } as APIResponse);
//   } catch (error :any) {
//     console.error("Error:", error.message);

//     return NextResponse.json(
//       { success: false, error: error.message || "Internal Server Error" } as APIResponse,
//       { status: 500 }
//     );
//   }
// }


// function extractSearchKeywords(searchParams: URLSearchParams) {
//   const keywords = {
//     budget: searchParams.get("budget") || "3500",
//     location: searchParams.get("searchQuery")?.toLowerCase() || "",
//     additional: searchParams.get("additional")?.split(",").map(k => k.trim()) || [],
//     duration: searchParams.get("duration") || "3-7",
//     currency: "USD"
//   };
  
//   return keywords;
// }


// app/api/recommend/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

interface TravelPackage {
  destination: {
    name: string;
    country: string;
  };
  duration: string;
  match: number;
  transport: string;
  accommodation: string;
  activities: string[];
  price: number;
  actionButtons: Array<{ type: string }>;
}

interface APIResponse {
  success: boolean;
  data?: TravelPackage[];
  error?: string;
}

function cleanAndParseResponse(response: string): TravelPackage[] {
  try {
    let cleaned = response.trim().replace(/^```json\s*/, "").replace(/\s*```$/, "");
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      throw new Error("Parsed response is not an array");
    }

    return parsed.map((item: any) => ({
      destination: {
        name: item.destination?.name || item.destination || "Unknown",
        country: item.destination?.country || ""
      },
      duration: item.duration || "7 days",
      match: typeof item.match === 'number' ? item.match : parseInt(item.match) || 85,
      transport: item.transport || "Flight",
      accommodation: item.accommodation || item.stay || "Hotel",
      activities: Array.isArray(item.activities) ? item.activities : [],
      price: typeof item.price === 'number' ? item.price : parseInt(item.price) || 0,
      actionButtons: [
        { type: "Share" },
        { type: "View Details" }
      ]
    }));
  } catch (error) {
    console.error("Error parsing response:", error);
    throw error;
  }
}

function buildPrompt(params: {
  budget: string;
  searchQuery: string;
  additional?: string;
}) {
  const location = params.searchQuery ? `focused on ${params.searchQuery}` : '';
  const additionalPrefs = params.additional 
    ? `including activities like ${params.additional.replace(/,/g, ', ')}` 
    : '';
  const number_of_results = 5;
  return `
    Generate ${number_of_results} detailed travel packages in JSON format ${location} ${additionalPrefs}.
    Maximum budget is ${params.budget} USD.

    Each package must include:
    {
      "destination": {
        "name": "City/Location Name",
        "country": "Country Name"
      },
      "duration": "X days",
      "match": number between 75-98,
      "transport": "detailed transport info",
      "accommodation": "detailed accommodation info",
      "activities": ["at least 3-4 specific activities"],
      "price": number under ${params.budget}
    }

    Ensure:
    - Prices are realistic and under specified budget
    - Activities are specific to location
    - Transport and accommodation details are practical
    - Match percentage reflects how well it fits requirements
    Return as a JSON array only.
  `;
}

export async function GET(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const { searchParams } = new URL(request.url);
    const params = {
      budget: searchParams.get("budget") || "3500",
      searchQuery: searchParams.get("searchQuery") || "",
      additional: searchParams.get("additional") || ""
    };

    // console.log("Search Params:", searchParams.toString());

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = buildPrompt(params);
    console.log("Generated Prompt:", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    // console.log("Raw API Response:", response);

    const packages = cleanAndParseResponse(response);
    console.log("Processed Packages:", packages);

    return NextResponse.json({ 
      success: true, 
      data: packages 
    } as APIResponse);
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal Server Error" 
      } as APIResponse,
      { status: 500 }
    );
  }
}