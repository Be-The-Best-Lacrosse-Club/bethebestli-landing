const https = require("https");

const CLIENT_ID = process.env.TEAMSNAP_CLIENT_ID;
const CLIENT_SECRET = process.env.TEAMSNAP_CLIENT_SECRET;
const REDIRECT_URI =
  process.env.TEAMSNAP_REDIRECT_URI ||
  "https://www.bethebestli.com/.netlify/functions/teamsnap-callback";

function httpsRequest({ hostname, path, method, headers, body }) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname, path, method, headers }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
    if (body) req.write(body);
    req.end();
  });
}

function page(inner) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>BTB TeamSnap Setup</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  body { font-family: 'Montserrat', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 40px 20px; line-height: 1.6; }
  .wrap { max-width: 720px; margin: 0 auto; }
  h1 { font-family: 'Bebas Neue', sans-serif; font-size: 44px; letter-spacing: 2px; color: #fff; margin-bottom: 8px; }
  h1 span { color: #D22630; }
  .sub { color: rgba(255,255,255,0.6); font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px; }
  .box { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.08); border-left: 4px solid #D22630; border-radius: 8px; padding: 22px; margin: 16px 0; }
  .label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #D22630; font-weight: 700; margin-bottom: 6px; }
  code { background: #000; padding: 10px 14px; border-radius: 6px; display: block; word-break: break-all; font-family: 'Courier New', monospace; font-size: 13px; border: 1px solid rgba(255,255,255,0.1); color: #4ade80; margin-top: 8px; }
  ol li { margin-bottom: 8px; }
  .warn { color: #fbbf24; }
  .err { color: #D22630; }
  a { color: #D22630; font-weight: 700; }
</style></head><body><div class="wrap">${inner}</div></body></html>`;
}

exports.handler = async function (event) {
  const headers = { "Content-Type": "text/html" };

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return {
      statusCode: 500,
      headers,
      body: page(`<h1>BTB <span>TeamSnap Setup</span></h1>
        <p class="err"><strong>Missing environment variables.</strong></p>
        <p>Set these in Netlify → Site settings → Environment variables, then redeploy:</p>
        <ul><li><code>TEAMSNAP_CLIENT_ID</code></li><li><code>TEAMSNAP_CLIENT_SECRET</code></li></ul>`),
    };
  }

  const code = event.queryStringParameters?.code;
  const error = event.queryStringParameters?.error;

  if (error) {
    return {
      statusCode: 400,
      headers,
      body: page(`<h1>BTB <span>TeamSnap Setup</span></h1>
        <p class="err"><strong>Authorization failed:</strong> ${error}</p>
        <p><a href="/teamsnap-setup.html">Try again</a></p>`),
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      headers,
      body: page(`<h1>BTB <span>TeamSnap Setup</span></h1>
        <p class="err">No authorization code received. Start from <a href="/teamsnap-setup.html">the setup page</a>.</p>`),
    };
  }

  try {
    const body =
      `grant_type=authorization_code` +
      `&code=${encodeURIComponent(code)}` +
      `&client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&client_secret=${encodeURIComponent(CLIENT_SECRET)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

    const res = await httpsRequest({
      hostname: "auth.teamsnap.com",
      path: "/oauth/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
        Accept: "application/json",
      },
      body,
    });

    if (res.statusCode >= 400) {
      return {
        statusCode: 502,
        headers,
        body: page(`<h1>BTB <span>TeamSnap Setup</span></h1>
          <p class="err"><strong>Token exchange failed (${res.statusCode}):</strong></p>
          <code>${res.body.replace(/</g, "&lt;")}</code>
          <p><a href="/teamsnap-setup.html">Try again</a></p>`),
      };
    }

    const tokens = JSON.parse(res.body);

    let nextSteps = "";
    if (tokens.refresh_token) {
      nextSteps = `
        <div class="box">
          <div class="label">Step 1 — Copy this Refresh Token</div>
          <code>${tokens.refresh_token}</code>
        </div>
        <div class="box">
          <div class="label">Step 2 — Add to Netlify</div>
          <p>Go to <strong>Netlify → Site settings → Environment variables</strong> and add:</p>
          <ol>
            <li>Key: <code>TEAMSNAP_REFRESH_TOKEN</code><br>Value: the token above</li>
          </ol>
          <p>Then: <strong>Deploys → Trigger deploy → Deploy site</strong></p>
        </div>
        <div class="box">
          <div class="label">Step 3 — Verify</div>
          <p>Visit <a href="/tournament-schedule.html">tournament-schedule.html</a> and enter password <code style="display:inline;padding:2px 8px;">#BTBPARENT26</code>. You should see your TeamSnap games.</p>
        </div>`;
    } else {
      nextSteps = `
        <div class="box">
          <div class="label warn">Only an Access Token was returned (no refresh token)</div>
          <p>This token expires in ${tokens.expires_in || "unknown"} seconds.</p>
          <code>${tokens.access_token}</code>
          <p style="margin-top:12px;">Add it to Netlify as <code style="display:inline;padding:2px 8px;">TEAMSNAP_ACCESS_TOKEN</code> and redeploy. You'll need to re-authorize when it expires.</p>
        </div>`;
    }

    return {
      statusCode: 200,
      headers,
      body: page(`<h1>BTB <span>TeamSnap Setup</span></h1>
        <p class="sub">Authorization Successful</p>
        ${nextSteps}`),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: page(`<h1>BTB <span>TeamSnap Setup</span></h1>
        <p class="err"><strong>Unexpected error:</strong> ${err.message}</p>`),
    };
  }
};
