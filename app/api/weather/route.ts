import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0; // per-request geo — cache handled via fetch below

type WeatherKind = "rain" | "snow" | "clear" | "cloudy";

type WeatherPayload = {
  available: boolean;
  city?: string;
  tempC?: number;
  condition?: string;
  kind?: WeatherKind;
  isNight?: boolean;
};

// Open-Meteo WMO weather codes → coarse kind + human label.
function classify(code: number): { kind: WeatherKind; condition: string } {
  if (code === 0) return { kind: "clear", condition: "clear sky" };
  if (code <= 2) return { kind: "clear", condition: "mostly clear" };
  if (code === 3) return { kind: "cloudy", condition: "overcast" };
  if (code === 45 || code === 48) return { kind: "cloudy", condition: "fog" };
  if (code >= 51 && code <= 57) return { kind: "rain", condition: "drizzle" };
  if (code >= 61 && code <= 67) return { kind: "rain", condition: "rain" };
  if (code >= 71 && code <= 77) return { kind: "snow", condition: "snow" };
  if (code >= 80 && code <= 82) return { kind: "rain", condition: "rain showers" };
  if (code === 85 || code === 86) return { kind: "snow", condition: "snow showers" };
  if (code >= 95) return { kind: "rain", condition: "thunderstorm" };
  return { kind: "cloudy", condition: "cloudy" };
}

const UNAVAILABLE: WeatherPayload = { available: false };

// Never throws — missing geo headers (localhost) or a failed upstream fetch
// degrade to { available: false } so the intro falls back to time-of-day tint.
export async function GET(request: NextRequest) {
  try {
    let lat = request.headers.get("x-vercel-ip-latitude");
    let lon = request.headers.get("x-vercel-ip-longitude");
    let cityRaw = request.headers.get("x-vercel-ip-city");
    // Local dev never receives Vercel geo headers, which made the weather
    // backdrop untestable with `pnpm dev` — fall back to Bengaluru there.
    if ((!lat || !lon) && process.env.NODE_ENV === "development") {
      lat = "12.97";
      lon = "77.59";
      cityRaw = cityRaw ?? "bengaluru";
    }
    if (!lat || !lon) return NextResponse.json(UNAVAILABLE);

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}&current_weather=true`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return NextResponse.json(UNAVAILABLE);

    const data = await res.json();
    const current = data?.current_weather;
    if (!current || typeof current.weathercode !== "number") {
      return NextResponse.json(UNAVAILABLE);
    }

    const { kind, condition } = classify(current.weathercode);
    const payload: WeatherPayload = {
      available: true,
      city: cityRaw ? decodeURIComponent(cityRaw).toLowerCase() : undefined,
      tempC: typeof current.temperature === "number" ? Math.round(current.temperature) : undefined,
      condition,
      kind,
      isNight: current.is_day === 0,
    };
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(UNAVAILABLE);
  }
}
