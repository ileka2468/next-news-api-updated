import { NextRequest, NextResponse } from "next/server";
import LRUCache, { LRUCache as LRU } from "lru-cache";
import { getClientIp } from "./lib/utils";

// Extend NextRequest for geo typing
interface GeoLocation {
  country?: string;
}

declare module "next/server" {
  interface NextRequest {
    geo?: GeoLocation;
  }
}

// Define rate-limiting options
const rateLimitOptions = {
  max: 300, // Maximum requests
  ttl: 60 * 1000, // Timeframe in milliseconds
};

// LRU cache for rate limiting fuckers and spammers
const rateLimitCache = new LRU<string, { count: number; expiry: number }>({
  max: 5000, // Maximum number of ips before i run out of memory and server dies
  ttl: rateLimitOptions.ttl,
});

const isStaticPath = (path: string) => {
  return path.startsWith("/_next") || path.startsWith("/favicon.ico");
};

export async function middleware(request: NextRequest) {
  const requestPath = request.nextUrl.pathname;
  const clientIp = getClientIp(request);

  if (!clientIp) {
    return NextResponse.json(
      { error: "Unable to determine client IP." },
      { status: 400 }
    );
  }

  const country = request.geo?.country ?? "Unknown";

  if (isStaticPath(requestPath)) {
    return NextResponse.next();
  }

  if (requestPath.startsWith("/api")) {
    // Rate-limiting logic
    const now = Date.now();
    const rateLimitKey = `rate-limit:${clientIp}`;
    const entry = rateLimitCache.get(rateLimitKey);

    if (entry && now >= entry.expiry) {
      // Expire old entry
      rateLimitCache.delete(rateLimitKey);
    }

    if (entry) {
      const updatedCount = entry.count + 1;
      if (updatedCount > rateLimitOptions.max && now < entry.expiry) {
        console.log(`[${new Date().toISOString()}] Rate limited: ${clientIp}`);
        return NextResponse.json(
          {
            error: "Too many requests, please try again later.",
          },
          { status: 429 }
        );
      }
      rateLimitCache.set(rateLimitKey, {
        count: updatedCount,
        expiry: entry.expiry,
      });
    } else {
      rateLimitCache.set(rateLimitKey, {
        count: 1,
        expiry: now + rateLimitOptions.ttl,
      });
    }
  }

  console.log(
    `[${new Date().toISOString()}] ${
      request.method
    } ${clientIp} (${country}) -> ${requestPath}`
  );

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/:path*"],
};
