# BloodConnect — HTML, CSS and JavaScript prototype

## Pages
- `index.html` — landing page and quick donor search
- `donors.html` — donor search/filter
- `request-blood.html` — emergency request form
- `awareness.html` — blood donation awareness content
- `login.html` — demo registration and login
- `admin-dashboard.html` — request dashboard with status actions
- `css/style.css` — responsive styling
- `js/app.js` — form behavior and browser-local demo data

## Run it
1. Extract the ZIP folder.
2. Open the folder in Visual Studio Code.
3. Install/use the **Live Server** extension, then right-click `index.html` and choose **Open with Live Server**.
   Alternatively, double-click `index.html` to open it in a browser.
4. Use the navigation to try each page.

## Important limitations
This is a front-end-only academic prototype, matching the provided BloodConnect synopsis and screenshots. It uses `localStorage` in your browser for demo records; it does **not** use PHP, MySQL, server-side authentication, or secure role-based admin access. Do not enter real passwords or personal medical/contact data. Donor records are sample data and are not verified. During a real medical emergency, contact a hospital or licensed blood bank directly.

The synopsis describes a future database-driven system using HTML, CSS, JavaScript, PHP and MySQL. To implement actual multi-user accounts and shared records, a backend and database would need to be added.
