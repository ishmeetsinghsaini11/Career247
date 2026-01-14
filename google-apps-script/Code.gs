function doPost(e) {
  try {
    var payload = {};
    var postType = (e && e.postData && e.postData.type) ? String(e.postData.type) : "";

    if (postType.indexOf("application/json") !== -1 && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e && e.parameter ? e.parameter : {};
    }

    var spreadsheetId = "1FIWGblmwJzEBoqUqiKycVZNLPCVIlzyE3jLGbkDS40U";
    var sheetName = "Sheet1";

    if (!spreadsheetId || spreadsheetId === "1FIWGblmwJzEBoqUqiKycVZNLPCVIlzyE3jLGbkDS40U") {
      var active = SpreadsheetApp.getActiveSpreadsheet();
      if (active) {
        spreadsheetId = active.getId();
      } else {
        throw new Error("Missing spreadsheetId. Paste your Google Sheet ID in Code.gs (spreadsheetId).");
      }
    }

    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    var row = [
      new Date(),
      payload.submitted_at || "",
      payload.referrer_name || "",
      payload.referrer_email || "",
      payload.referrer_phone || "",
      payload.referral_name || "",
      payload.referral_email || "",
      payload.referral_phone || "",
      payload.course || "",
      payload.page_url || "",
      payload.user_agent || "",
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  try {
    var spreadsheetId = "PASTE_YOUR_SPREADSHEET_ID_HERE";
    var sheetName = "Sheet1";

    if (!spreadsheetId || spreadsheetId === "PASTE_YOUR_SPREADSHEET_ID_HERE") {
      var active = SpreadsheetApp.getActiveSpreadsheet();
      if (active) {
        spreadsheetId = active.getId();
      } else {
        throw new Error("Missing spreadsheetId. Paste your Google Sheet ID in Code.gs (spreadsheetId).");
      }
    }

    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheet = ss.getSheetByName(sheetName);
    var info = {
      ok: true,
      spreadsheetId: spreadsheetId,
      sheetName: sheetName,
      sheetFound: !!sheet,
    };

    return ContentService
      .createTextOutput(JSON.stringify(info))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
