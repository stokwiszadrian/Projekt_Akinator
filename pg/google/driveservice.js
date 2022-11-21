const { google } = require('googleapis')
const credentials = require('./credentials.json')
const scopes = [
    'https://www.googleapis.com/auth/drive'
  ];
const auth = new google.auth.JWT(
    credentials.client_email, null,
    credentials.private_key, scopes
);
const drive = google.drive({ version: "v3", auth });

module.exports = drive;