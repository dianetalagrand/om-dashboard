/**
 * OM Governance Portfolio Dashboard — Apps Script Web App
 * Supports both plain JSON and JSONP (callback param) for CORS bypass
 */

const SHEET_NAME = "OM Portfolio";

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return respond(e, { error: 'Sheet "' + SHEET_NAME + '" not found' });

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return respond(e, []);

    const values = sheet.getRange(2, 1, lastRow - 1, 15).getValues();

    const streams = values
      .filter(r => r[0] !== "" && r[1] !== "")
      .map(r => {
        const raw = r[9];
        let goLive = "";
        if (raw instanceof Date && !isNaN(raw)) {
          goLive = Utilities.formatDate(raw, Session.getScriptTimeZone(), "yyyy-MM-dd");
        } else if (typeof raw === "string" && raw.trim()) {
          goLive = raw.trim();
        }
        const status = String(r[3]).trim();
        return {
          id:            Number(r[0]),
          name:          String(r[1]).trim(),
          init:          r[2] ? String(r[2]).trim() : null,
          status:        status,
          priority:      mapPriority(String(r[4]).trim()),
          prioritized:   String(r[5]).toUpperCase() === "TRUE",
          requester:     String(r[6]).trim(),
          okr:           String(r[7]).trim(),
          functions:     String(r[8]).split(",").map(f => f.trim()).filter(Boolean),
          goLive:        goLive,
          goLiveDisplay: String(r[10]).trim(),
          context:       String(r[11]).trim(),
          need:          String(r[12]).trim(),
          conclusion:    r[13] ? String(r[13]).trim() : "",
          jira:          r[14] ? String(r[14]).trim() : null,
          is2026closed:  status === "Closed",
          year:          goLive ? goLive.substring(0, 4) : "—"
        };
      });

    return respond(e, streams);

  } catch (err) {
    return respond(e, { error: err.message });
  }
}

function mapPriority(p) {
  if (p === "High")   return "Urgent";
  if (p === "Medium") return "Normal";
  if (p === "Low")    return "Normal";
  return p || "Normal";
}

// Supports both plain JSON and JSONP (for CORS bypass from browser)
function respond(e, data) {
  const json = JSON.stringify(data);
  const callback = e && e.parameter && e.parameter.callback;
  if (callback) {
    // JSONP response
    return ContentService
      .createTextOutput(callback + "(" + json + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function testDoGet() {
  Logger.log(doGet({parameter:{}}).getContent().substring(0, 800));
}
