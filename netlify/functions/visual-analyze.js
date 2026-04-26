/**
 * visual-analyze — Gemini native video understanding for film breakdown.
 *
 * Used when a YouTube video has no captions/transcript.
 * Gemini 2.5 Flash watches the YouTube video directly and returns
 * structured play-by-play JSON — no transcript, no Whisper needed.
 *
 * POST /api/visual-analyze (or /.netlify/functions/visual-analyze)
 * Body: { youtube_url, video_id, game_title, level?, focus? }
 * Returns: { plays: Play[], source: "gemini-visual" }
 */

const VISUAL_PROMPT = `You are an expert lacrosse film analyst for BTB Lacrosse Club on Long Island, NY.
Watch this lacrosse game video and identify every notable play.

For EACH play, return a JSON object with these EXACT fields (use these exact key names):
  event_sequence: (number, starting at 1)
  source_start_seconds: (number — start time in seconds when the play begins)
  source_end_seconds: (number — end time in seconds when the play ends)
  play_result: (one of: goal, save, turnover, ground_ball, clear_success, clear_fail, faceoff_win, faceoff_loss, shot_on_goal, shot_off_target, caused_turnover, penalty)
  team_focus: (one of: offense, defense)
  phase: (one of: "Offense - Settled 6v6", "Offense - Early Offense / Transition", "Offense - EMO", "Defense - Settled 6v6", "Defense - Recovery", "Defense - Man Down", "Faceoff", "Clear", "Ride")
  category: (one of: "Advantage Created", "Finish", "Shot Quality Win", "Decision Error", "Defensive Stop", "On Ball Win", "Slide Recover Win", "GB Win", "Faceoff Win", "Clear Success", "Ride Stop", "Special Teams Win")
  tags: (array of 2-5 tags from: dodge-downhill, paint-touch, draw-two, one-more, inside-feed, two-man-game, step-down, on-the-run, crease-finish, shot-selection-good, shot-selection-poor, approach-angle-win, top-side-denial, hot-slide, second-slide, recover-out, communication-win, gb-toughness, clamp-win, decision-making-plus, decision-making-minus, compete-plus, iq-off-ball, coachable-error)
  main_teaching_point: (one sentence — the key coaching takeaway from this play)
  event_summary: (one sentence — what happened on the play)
  players: (array of visible jersey numbers e.g. ["#7", "#22"], or [] if not visible)
  period: (string — "1", "2", "3", "4", or "OT" if visible on scoreboard, else "")
  clock: (string — game clock if visible e.g. "8:32", else "")
  score_state: (string — score if visible e.g. "3-2", else "")
  ai_confidence: (number 0-1 — how confident you are in this play identification)

Focus on identifying:
- Dodging sequences and outcomes (split, roll, face, rocker dodges)
- Slide packages (when they arrive, who slides, second slide timing)
- Shot attempts and goalie saves (technique, placement, result)
- Ground ball battles and outcomes
- Faceoff wins and losses
- Clear and ride situations
- Off-ball movement, cutting, and positioning
- Communication breakdowns or wins

Return ONLY a JSON array of play objects. No markdown, no explanation, no wrapper object.
Tag 20-40 plays for a full game, all visible plays for clips.
If jersey numbers are not visible, use [] for players.`;

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'POST only' }) };
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { youtube_url, video_id, game_title, level, focus } = body;
  if (!youtube_url) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'youtube_url is required' }) };
  }

  const videoUrl = youtube_url.startsWith('http')
    ? youtube_url
    : `https://www.youtube.com/watch?v=${video_id}`;

  const contextLines = [
    game_title ? `Game: ${game_title}` : '',
    level      ? `Level: ${level}`     : '',
    focus && focus !== 'all' ? `Focus: ${focus} plays only` : '',
  ].filter(Boolean).join('\n');

  const promptText = VISUAL_PROMPT + (contextLines ? `\n\n--- CONTEXT ---\n${contextLines}` : '');

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [
              // Pass YouTube URL inline as text — Gemini 2.5 Flash reads
              // the URL and processes the video natively. fileData/fileUri
              // requires the File API upload flow; this avoids that entirely.
              { text: `VIDEO URL: ${videoUrl}\n\n${promptText}` },
            ],
          }],
          generationConfig: {
            // No responseMimeType — causes issues with some video prompts
            maxOutputTokens: 16384,
            temperature: 0.2,
          },
        }),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      return {
        statusCode: 502,
        headers: cors,
        body: JSON.stringify({
          error: `Gemini video analysis failed: ${errText.slice(0, 400)}`,
          suggestion: 'Make sure the YouTube URL is public and accessible.',
        }),
      };
    }

    const geminiData = await resp.json();
    // Check for blocked/empty response
    const candidate = geminiData.candidates?.[0];
    if (!candidate) {
      const blockReason = geminiData.promptFeedback?.blockReason;
      return {
        statusCode: 502,
        headers: cors,
        body: JSON.stringify({
          error: blockReason
            ? `Video blocked by Gemini safety filter: ${blockReason}`
            : 'Gemini returned no candidates. The video may be private, age-restricted, or unsupported.',
        }),
      };
    }

    const rawText = candidate.content?.parts?.[0]?.text ?? '';
    if (!rawText) {
      return {
        statusCode: 502,
        headers: cors,
        body: JSON.stringify({ error: 'Gemini returned an empty response for this video.' }),
      };
    }

    // Robust JSON extraction — handles markdown fences, leading text, trailing text
    let plays;
    try {
      // 1. Strip markdown code fences
      let cleaned = rawText
        .replace(/^```(?:json)?\s*/m, '')
        .replace(/\s*```\s*$/m, '')
        .trim();

      // 2. Find the JSON array — skip any leading explanation text
      const arrStart = cleaned.indexOf('[');
      const arrEnd = cleaned.lastIndexOf(']');
      if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
        cleaned = cleaned.slice(arrStart, arrEnd + 1);
      }

      plays = JSON.parse(cleaned);
      if (!Array.isArray(plays)) {
        plays = plays.plays ?? plays.events ?? plays.data ?? [];
      }
    } catch (parseErr) {
      return {
        statusCode: 502,
        headers: cors,
        body: JSON.stringify({
          error: 'Gemini returned text that could not be parsed as JSON. The video may not be supported for visual analysis.',
          hint: 'Try a video with captions enabled, or a shorter clip.',
          raw: rawText.slice(0, 300),
        }),
      };
    }

    // Add YouTube deep links and normalize field names
    const vid = video_id || (youtube_url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? '');
    plays = plays.map((p, i) => ({
      ...p,
      index: i,
      youtube_url: vid && p.start != null
        ? `https://www.youtube.com/watch?v=${vid}&t=${Math.floor(Number(p.start))}s`
        : videoUrl,
      teaching_points: p.teaching_point ? [p.teaching_point] : [],
      source: 'gemini-visual',
    }));

    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ plays, count: plays.length, source: 'gemini-visual' }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: String(err?.message ?? err) }),
    };
  }
};
