# Promo intake: setup (about 5 minutes)

The form lives at `/promo/intake` on the site. This connects it to a Google Sheet.

1. Go to sheets.new and name the sheet "Africode Promo Responses".
2. In the sheet, click **Extensions > Apps Script**.
3. Delete anything in the editor, then paste in the whole of `Code.gs` from this folder. Click **Save**.
4. In the function dropdown at the top choose **authorize** and click **Run**. Google will ask for permission to use Sheets and Drive. Choose your account, **Advanced > Go to project (unsafe) > Allow**. (It says "unsafe" only because you wrote the script yourself and Google hasn't reviewed it.)
5. Click **Deploy > New deployment**. Click the gear and pick **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
7. Open `src/config.js` and paste that URL into `PROMO.SCRIPT_URL`. Redeploy the site.

## Testing
Open `/promo/intake`, fill it in with a test business and submit. A row should appear in the sheet, with the photos in a new Drive folder called "Africode Promo Photos". Set that row's **Status** to `Cancelled` afterwards to free the spot and category again.

## Running the promo
- The page shows "X of 10 spots left" and greys out any category that has been taken.
- To release a spot, change **Status** to `Cancelled`.
- The **AI BRIEF** column is ready to paste into Claude or ChatGPT with `MASTER-PROMPT.md`.

## If you change `Code.gs` later
Use **Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy**. The URL stays the same.
