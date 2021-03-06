# CANDDi Interview Technical Task Part 1

## Spec:

At it’s core CANDDi is a data processing engine. We’re always looking for new sources
where we can get data to “mix” into our existing sources.

We often get email addresses from our clients (ex: tim@canddi.com).
Given this data we’d really like to obtain additional information about the company (Address,
Phone Number, Other Email Addresses etc…).
The task is to build a Node.js console based web-scraper - which given an email address,
visits the web-page and programmatically extracts any relevant information to echo to the
screen.

## Requirements:

1. Node.js (https://nodejs.org/en/)
2. Github (www.github.com)
3. Npm (https://www.npmjs.com/)
4. Node Require Modules
   1. Require (https://www.npmjs.com/package/require)
   2. Cherio (https://github.com/cheeriojs/cheerio)
   3. Kwnl (https://github.com/loadfive/Knwl.js/)

## How to use:

1. Run `npm install`
2. Run `npm link`
3. Run `email-web-scrapper <email>`
4. Get the Results
