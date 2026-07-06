/**
 * OM Governance Portfolio Dashboard — Apps Script Web App
 * 
 * HOW TO DEPLOY:
 * 1. In your Google Sheet: Extensions > Apps Script
 * 2. Paste this entire file into Code.gs
 * 3. Deploy > New deployment > Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL
 * 5. In the dashboard HTML, replace the fetch URL with your Web App URL
 *
 * SHEET COLUMN ORDER (do not change):
 * A: ID | B: Stream Name | C: INIT | D: Status | E: Priority | F: Prioritized
 * G: Requester | H: Strategic Pillar (OKR) | I: Functions
 * J: Effective Date | K: Go-Live Display | L: Context | M: Need | N: Jira URL
 */

const SHEET_NAME = "OM Portfolio";

// ── CORS headers for cross-origin fetch from the dashboard ──
function setCORSHeaders(output) {
  return output
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ── Main entry point: GET request returns JSON array of streams ──
function doGet(e) {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return setCORSHeaders(
        ContentService.createTextOutput(
          JSON.stringify({ error: `Sheet "${SHEET_NAME}" not found` })
        )
      );
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return setCORSHeaders(
        ContentService.createTextOutput(JSON.stringify([]))
      );
    }

    // Read all data rows (skip header row 1)
    const range  = sheet.getRange(2, 1, lastRow - 1, 14);
    const values = range.getValues();

    const streams = values
      .filter(row => row[0] !== "" && row[1] !== "")  // skip empty rows
      .map(row => {
        const goLiveRaw = row[9];
        // Handle both Date objects and strings
        let goLiveStr = "";
        if (goLiveRaw instanceof Date) {
          goLiveStr = Utilities.formatDate(goLiveRaw, Session.getScriptTimeZone(), "yyyy-MM-dd");
        } else if (typeof goLiveRaw === "string" && goLiveRaw.trim()) {
          goLiveStr = goLiveRaw.trim();
        }

        return {
          id:             Number(row[0]),
          name:           String(row[1]).trim(),
          init:           row[2] ? String(row[2]).trim() : null,
          status:         String(row[3]).trim(),
          priority:       String(row[4]).trim(),
          prioritized:    String(row[5]).toUpperCase() === "TRUE",
          requester:      String(row[6]).trim(),
          okr:            String(row[7]).trim(),
          functions:      String(row[8]).split(",").map(f => f.trim()).filter(Boolean),
          goLive:         goLiveStr,
          goLiveDisplay:  String(row[10]).trim(),
          context:        String(row[11]).trim(),
          need:           String(row[12]).trim(),
          jira:           row[13] ? String(row[13]).trim() : null,
          // computed fields
          is2026closed:   goLiveStr.startsWith("2026") && String(row[3]).trim() === "Closed",
          year:           goLiveStr ? goLiveStr.substring(0, 4) : "—"
        };
      });

    return setCORSHeaders(
      ContentService.createTextOutput(JSON.stringify(streams))
    );

  } catch (err) {
    return setCORSHeaders(
      ContentService.createTextOutput(
        JSON.stringify({ error: err.message, stack: err.stack })
      )
    );
  }
}

// ── Optional: test function — run this in the editor to preview output ──
function testDoGet() {
  const result = doGet({});
  Logger.log(result.getContent().substring(0, 500));
}
