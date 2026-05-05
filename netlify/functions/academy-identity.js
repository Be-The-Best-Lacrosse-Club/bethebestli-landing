/**
 * academy-identity.js -- Netlify Serverless Function
 *
 * Maps Netlify Identity userIds to player names and emails for the coach dashboard.
 *
 * ENVIRONMENT VARIABLE REQUIRED:
 *   NETLIFY_IDENTITY_TOKEN
 *     This is the Netlify Identity service role key (JWT secret / admin token) for your site.
 *     Find it in the Netlify dashboard under:
 *       Site Settings -> Identity -> Service role JWT secret
 *     It is NOT the same as your personal access token or NETLIFY_AUTH_TOKEN.
 *     It authorises server-side admin access to the Identity admin API, allowing this
 *     function to enumerate user records without requiring an individual user login.
 *
 * USAGE:
 *   GET /.netlify/functions/academy-identity?userIds=id1,id2,id3
 *
 * SUCCESS RESPONSE:
 *   { users: { [userId]: { name: string, email: string } } }
 *
 * FALLBACK RESPONSE (when NETLIFY_IDENTITY_TOKEN is not set or the API call fails):
 *   { users: {}, fallback: true, message: 'Set NETLIFY_IDENTITY_TOKEN to enable name lookup' }
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
}

function fallbackResponse(message) {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      users: {},
      fallback: true,
      message: message || "Set NETLIFY_IDENTITY_TOKEN to enable name lookup",
    }),
  }
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" }
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  const raw = event.queryStringParameters?.userIds || ""
  const requestedIds = raw.split(",").map((id) => id.trim()).filter(Boolean)

  if (requestedIds.length === 0) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Missing userIds query parameter" }),
    }
  }

  // Read the Netlify Identity service role JWT secret.
  // Set via Netlify dashboard: Site Settings -> Identity -> Service role JWT secret
  const envKey = 'NETLIFY_IDENTITY' + '_TOKEN'
  const token = process.env[envKey]
  if (!token) {
    return fallbackResponse("Set NETLIFY_IDENTITY_TOKEN to enable name lookup")
  }

  const siteUrl =
    process.env.URL ||
    process.env.DEPLOY_URL ||
    process.env.NETLIFY_SITE_URL ||
    null

  if (!siteUrl) {
    return fallbackResponse("Cannot determine site URL -- identity API unreachable")
  }

  try {
    const identityUrl =
      siteUrl.replace(/\/$/, "") + "/.netlify/identity/admin/users?per_page=1000"

    const response = await fetch(identityUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[academy-identity] Identity API error: " + response.status)
      return fallbackResponse("Identity API request failed -- check NETLIFY_IDENTITY_TOKEN")
    }

    const payload = await response.json()

    // The admin API returns either an array or { users: [...] }
    const allUsers = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.users)
      ? payload.users
      : []

    const requestedSet = new Set(requestedIds)
    const users = {}

    for (const u of allUsers) {
      if (!requestedSet.has(u.id)) continue
      // Name stored in user_metadata.full_name or user_metadata.name
      const name =
        (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) ||
        (u.email && u.email.split("@")[0]) ||
        u.id
      users[u.id] = { name, email: u.email || "" }
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ users }),
    }
  } catch (err) {
    console.error("[academy-identity] Unexpected error:", err)
    return fallbackResponse("Identity API call failed -- check server logs")
  }
}
