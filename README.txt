TNX Studios — website
=====================

Pages
  index.html                  Homepage (includes the Campaign Planner)
  new-gen-production.html     Service 01 — the full deck + planner
  performance-marketing.html  Service 02
  web-development.html        Service 03

Shared assets (assets/)
  tnx.css       design system, header, dropdown, hero stage, motifs
  tnx.js        header, dropdown, reveals, FAQ, contact dialog, counters
  planner.css   Campaign Planner styles
  planner.js    Campaign Planner logic
  tnx-mark.png  brand mark
  brand*.png    client logos
  scene-*.jpg   hero phone-fan imagery

Deploy to Vercel
  1. vercel.com/new
  2. Drag this TNX-Site folder onto the page
  3. Deploy

  Routes:
    /                      index
    /new-gen-production
    /performance-marketing
    /web-development

Notes
  Any element with data-planner opens the calculator.
  Any element with data-contact opens the book/email dialog.
