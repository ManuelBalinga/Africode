/**
 * Africode free-website promo: intake backend.
 *
 * Paste this whole file into a Google Apps Script project that is bound to the
 * Google Sheet you want the responses in (Sheet > Extensions > Apps Script),
 * then deploy it as a Web app: Execute as "Me", access "Anyone".
 * Full steps are in SETUP.md.
 *
 * What it does
 *   GET  ?action=status  -> how many spots are used and which niches are taken
 *   POST action=submit   -> adds a row (rejects a taken niche or a full promo)
 *   POST action=photo    -> saves one photo into that business's Drive folder
 *
 * To free a spot (e.g. someone drops out), change the row's Status cell to
 * "Cancelled". Its niche and slot are released straight away.
 */

var TOTAL_SLOTS = 10;
var SHEET_NAME = 'Submissions';
var FOLDER_NAME = 'Africode Promo Photos';
var MAX_PHOTOS_PER_BUSINESS = 12;
var MAX_PHOTO_BYTES = 6 * 1024 * 1024;

var HEADERS = [
  'Timestamp', 'ID', 'Status', 'Niche', 'Business name', 'Contact name', 'WhatsApp',
  'Email', 'City', 'About', 'Offerings and prices', 'What makes them different',
  'Hours', 'Address', 'Social link', 'Goal', 'Feel', 'Colours',
  'Photo count', 'Has logo', 'Drive folder', 'Folder ID', 'AI BRIEF'
];

var NICHE_LABELS = {
  salon: 'Hair / salon / barber', cosmetics: 'Cosmetics / skincare', perfume: 'Perfume / fragrance',
  fashion: 'Fashion / tailoring', food: 'Food / catering', photography: 'Photography / videography',
  events: 'Events / decor', jewellery: 'Jewellery / accessories', auto: 'Car wash / detailing / mechanic',
  cleaning: 'Cleaning / laundry', fitness: 'Fitness / coach / wellness', kids: 'Baby and kids products',
  music: 'Music / DJ / entertainment', artists: 'Artist / craftsperson', furniture: 'Furniture / interior design',
  electronics: 'Electronics / phone accessories', farm: 'Agriculture / farm produce',
  tutoring: 'Tutoring / education', printing: 'Printing / branding / design studio', church: 'Church / ministry'
};

var TEMPLATES = {
  salon: 'gallery', cosmetics: 'catalogue', perfume: 'catalogue', fashion: 'gallery', food: 'menu',
  photography: 'gallery', events: 'gallery', jewellery: 'catalogue', auto: 'services', cleaning: 'services',
  fitness: 'services', kids: 'catalogue', music: 'gallery', artists: 'gallery', furniture: 'catalogue',
  electronics: 'catalogue', farm: 'catalogue', tutoring: 'services', printing: 'services', church: 'services'
};

var GOAL_LABELS = {
  'whatsapp-orders': 'Get orders on WhatsApp', bookings: 'Get bookings / appointments',
  calls: 'Get phone calls', showcase: 'Show off their work'
};
var FEEL_LABELS = {
  luxury: 'Luxury and elegant', bold: 'Bold and colourful', minimal: 'Clean and minimal', warm: 'Warm and friendly'
};

/* ---------- web app entry points ---------- */

function doGet(e) {
  return respond_(status_());
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action === 'submit') return respond_(submit_(body));
    if (body.action === 'photo') return respond_(photo_(body));
    return respond_({ ok: false, error: 'bad-action' });
  } catch (err) {
    return respond_({ ok: false, error: 'server', detail: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- actions ---------- */

function status_() {
  var rows = activeRows_();
  return {
    ok: true,
    total: TOTAL_SLOTS,
    used: rows.length,
    taken: rows.map(function (r) { return r[3]; })
  };
}

function submit_(b) {
  if (b.website) return { ok: false, error: 'spam' }; // honeypot field was filled in
  var s = status_();
  if (s.used >= TOTAL_SLOTS) return { ok: false, error: 'full' };
  if (!NICHE_LABELS[b.niche]) return { ok: false, error: 'bad-niche' };
  if (s.taken.indexOf(b.niche) !== -1) return { ok: false, error: 'niche-taken' };
  if (!clean_(b.businessName) || !clean_(b.whatsapp) || !clean_(b.contactName)) return { ok: false, error: 'missing' };

  var sheet = sheet_();
  var id = 'AFC-' + Utilities.formatString('%04d', sheet.getLastRow()); // header row = 1, so first entry is 0001
  var folder = rootFolder_().createFolder(clean_(b.businessName) + ' - ' + id);

  var row = {
    ts: new Date(), id: id, status: 'New', niche: b.niche,
    business: clean_(b.businessName), contact: clean_(b.contactName), whatsapp: clean_(b.whatsapp),
    email: clean_(b.email), city: clean_(b.city), about: clean_(b.about), offerings: clean_(b.offerings),
    different: clean_(b.different), hours: clean_(b.hours), address: clean_(b.address), social: clean_(b.social),
    goal: b.goal, feel: b.feel, colours: clean_(b.colours),
    photoCount: Number(b.photoCount) || 0, hasLogo: b.hasLogo ? 'Yes' : 'No',
    folderUrl: folder.getUrl(), folderId: folder.getId()
  };

  var g = guard_;
  sheet.appendRow([
    row.ts, row.id, row.status, row.niche, g(row.business), g(row.contact), g(row.whatsapp),
    g(row.email), g(row.city), g(row.about), g(row.offerings), g(row.different),
    g(row.hours), g(row.address), g(row.social), row.goal, row.feel, g(row.colours),
    row.photoCount, row.hasLogo, row.folderUrl, row.folderId, brief_(row)
  ]);
  return { ok: true, id: id };
}

function photo_(b) {
  var sheet = sheet_();
  var rowIndex = findRow_(sheet, b.id);
  if (!rowIndex) return { ok: false, error: 'unknown-id' };
  var folderId = sheet.getRange(rowIndex, HEADERS.indexOf('Folder ID') + 1).getValue();
  var folder = DriveApp.getFolderById(folderId);

  var count = 0, files = folder.getFiles();
  while (files.hasNext()) { files.next(); count++; }
  if (count >= MAX_PHOTOS_PER_BUSINESS) return { ok: false, error: 'too-many' };

  var bytes = Utilities.base64Decode(b.data);
  if (bytes.length > MAX_PHOTO_BYTES) return { ok: false, error: 'too-big' };

  var prefix = b.kind === 'logo' ? 'LOGO_' : 'photo_' + (count + 1) + '_';
  var safe = clean_(b.name).replace(/[^\w.\-]+/g, '_').slice(0, 60) || 'image.jpg';
  folder.createFile(Utilities.newBlob(bytes, b.mime || 'image/jpeg', prefix + safe));
  return { ok: true };
}

/* ---------- helpers ---------- */

// The AI BRIEF column: one block of text you can paste straight into Claude or
// ChatGPT together with MASTER-PROMPT.md.
function brief_(r) {
  var colours = r.colours ? r.colours : 'no preference (choose to suit the feel)';
  return [
    'BUSINESS: ' + r.business + ' (' + NICHE_LABELS[r.niche] + ')',
    'TEMPLATE TO USE: ' + TEMPLATES[r.niche],
    'LOCATION: ' + r.city,
    'WHAT THEY SELL / DO: ' + r.about,
    r.different ? 'WHAT MAKES THEM DIFFERENT: ' + r.different : '',
    '',
    'PRODUCTS / SERVICES AND PRICES:',
    r.offerings,
    '',
    'MAIN GOAL OF THE SITE: ' + (GOAL_LABELS[r.goal] || r.goal),
    'FEEL: ' + (FEEL_LABELS[r.feel] || r.feel),
    'COLOURS: ' + colours,
    '',
    'CONTACT: WhatsApp ' + r.whatsapp + (r.email ? ', email ' + r.email : ''),
    r.hours ? 'HOURS: ' + r.hours : '',
    r.address ? 'ADDRESS: ' + r.address : '',
    r.social ? 'SOCIAL: ' + r.social : '',
    '',
    'ASSETS: ' + r.photoCount + ' photos' + (r.hasLogo === 'Yes' ? ' plus a logo (file named LOGO_...)' : ', no logo (create a simple text logo)') + ' in Drive folder: ' + r.folderUrl
  ].filter(function (line, i, arr) {
    return line !== '' || (arr[i - 1] !== '' && i > 0); // drop doubled blank lines left by empty optional fields
  }).join('\n');
}

function activeRows_() {
  var sheet = sheet_();
  var last = sheet.getLastRow();
  if (last < 2) return [];
  return sheet.getRange(2, 1, last - 1, HEADERS.length).getValues().filter(function (r) {
    return r[1] && String(r[2]).toLowerCase() !== 'cancelled';
  });
}

function findRow_(sheet, id) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var ids = sheet.getRange(2, 2, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (ids[i][0] === id) return i + 2;
  return 0;
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function rootFolder_() {
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

// Trim and cap length.
function clean_(v) {
  return String(v == null ? '' : v).trim().slice(0, 4000);
}

// Used only when writing a cell: a leading = + - @ would run as a sheet formula
// (or turn "+233..." into a number), so a leading apostrophe forces plain text.
function guard_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function respond_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run this once from the Apps Script editor (select it, press Run) so Google
// asks for Sheet and Drive permission before the first real submission.
function authorize() {
  sheet_();
  rootFolder_();
}
