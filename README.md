# finance-literacy
A vanilla HTML/CSS/JS budgeting app with a customizable 50-30-20 split, expense &amp; savings goal trackers, interactive charts, and a built-in glossary on loan terms and loan-shark red flags built to boost financial literacy.
Finance Literacy is a lightweight, single-page web app that helps users understand and manage their personal finances. It combines a customizable 50-30-20 style budget planner with expense/savings trackers, an animated visual dashboard, and a built-in glossary of loan terms and loan-shark red flags — all aimed at improving financial literacy for everyday users in India.
Built with pure HTML, CSS, and JavaScript — no frameworks, no build step, just open index.html in a browser.
# Features
1. Income & Deductions
Enter monthly income and total EMI/loan obligations.
Add multiple insurance premiums, which are deducted before budgeting.
Live warning if deductions exceed income.
2. Customizable Budget Split
Adjustable Needs / Wants / Savings sliders (defaults to the classic 50-30-20 rule).
Real-time validation to ensure the split always totals 100%.
One-click reset to the default 50-30-20 split.
Instant breakdown of Net Usable Income into each category.
3. Needs & Wants Trackers
Add individual expenses under Needs and Wants.
Interactive conic-gradient pie chart with hover tooltips showing each item's share.
Automatic warning when spending exceeds the allocated budget.
Items visually shift toward red as they approach/exceed the budget limit.
4. Savings Goals Tracker
Set savings goals with a target amount and monthly contribution.
Visual stacked progress bar showing how each goal is allocated within the savings budget.
Automatically calculates estimated time (in years/months) to reach each goal.
5. Loan Terms Glossary
Quick-reference modal popups explaining key lending concepts: Principal, Interest Rate, Collateral, Amortization, Loan Tenure, EMI, Prepayment/Foreclosure, Processing Fee, Credit Score, and Default.
6. Danger Zone — Loan Shark Awareness
Educates users on predatory lending red flags: hidden interest rates, daily/weekly collections, blank cheque scams, harassment tactics, fake loan apps, excessive penalties, missing agreements, and debt-trap "rolling loans."
Includes a dedicated "How to Protect Yourself" guide with practical steps and official Indian grievance-redressal resources (RBI Ombudsman, National Cybercrime Reporting Portal, helpline 1930).
7. Visual Polish
Animated falling-currency background effect (3D CSS transforms on rupee note images).
Scroll-triggered fade-in animations for each section.
Fully responsive, glassmorphism-style dark UI with an olive-green accent theme

# Project Structure 
.
├── index.html      # Page structure and layout
├── style.css       # Theme, layout, and animations
├── script.js       # Budgeting logic, trackers, charts, and glossary data
└── assets/         # Background image + currency note images (not included in repo)

# NOTE:
The falling-money animation and background reference local image assets. Add your own currency note images and background image to the project root (or update the paths in style.css / script.js) for the visuals to render correctly.
