/**
 * OM Governance Portfolio Dashboard — Apps Script Web App
 * Sheet: "OM Portfolio" — columns read by position (A→N)
 *
 * DEPLOY:
 *   Distribuisci > Nuova distribuzione > App web
 *   Esegui come: Me | Chi può accedere: Chiunque
 *   Copia l'URL e incollalo in index.html → const APPS_SCRIPT_URL = "..."
 */

const SHEET_NAME = "OM Portfolio";

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return respond({ error: 'Sheet "' + SHEET_NAME + '" not found' });

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return respond([]);

    const values = sheet.getRange(2, 1, lastRow - 1, 15).getValues();

    const streams = values
      .filter(r => r[0] !== "" && r[1] !== "")
      .map(r => {
        // Col J (index 9) = Effective Date — can be Date object or string
        const raw = r[9];
        let goLive = "";
        if (raw instanceof Date && !isNaN(raw)) {
          goLive = Utilities.formatDate(raw, Session.getScriptTimeZone(), "yyyy-MM-dd");
        } else if (typeof raw === "string" && raw.trim()) {
          goLive = raw.trim();
        }

        const status = String(r[3]).trim();

        return {
          id:           Number(r[0]),
          name:         String(r[1]).trim(),
          init:         r[2] ? String(r[2]).trim() : null,
          status:       status,
          priority:     mapPriority(String(r[4]).trim()),
          prioritized:  String(r[5]).toUpperCase() === "TRUE",
          requester:    String(r[6]).trim(),
          okr:          String(r[7]).trim(),
          functions:    String(r[8]).split(",").map(f => f.trim()).filter(Boolean),
          goLive:       goLive,
          goLiveDisplay:String(r[10]).trim(),
          context:      String(r[11]).trim(),
          need:         String(r[12]).trim(),
          conclusion:   r[13] ? String(r[13]).trim() : "",
          jira:         r[14] ? String(r[14]).trim() : null,
          is2026closed: goLive.startsWith("2026") && status === "Closed",
          year:         goLive ? goLive.substring(0, 4) : "—"
        };
      });

    return respond(streams);

  } catch (err) {
    return respond({ error: err.message });
  }
}

// Map old Priority values (High/Medium/Low) → new (Urgent/Normal)
function mapPriority(p) {
  if (p === "High")   return "Urgent";
  if (p === "Medium") return "Normal";
  if (p === "Low")    return "Normal";
  return p; // already Urgent/Normal
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

// Test: run this in the editor to see output in the Logs
function testDoGet() {
  const out = doGet({});
  Logger.log(out.getContent().substring(0, 800));
}
