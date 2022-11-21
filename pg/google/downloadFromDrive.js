const { google } = require('googleapis');
const { unzip } = require('zlib')
const credentials = require('./credentials.json');
const StreamZIp = require('node-stream-zip')
const drive = require('./driveservice')
const fs = require('fs')
const axios = require('axios')
require('dot-env').config
const listFiles = require('./listfiles')

const filename = process.env.DRIVE_FILENAME || 'test_resources'

async function downloadFile(filename) {
    const scopes = [
        'https://www.googleapis.com/auth/drive'
      ];
      const auth = new google.auth.JWT(
        credentials.client_email, null,
        credentials.private_key, scopes
      );
      const drive = google.drive({ version: "v3", auth });
      
      const fileId = await listFiles(filename)
      console.log(fileId)
      
      try {
          const file = await drive.files.get({
            fileId: fileId,
          });
          console.log(file);
          const data = await axios.get(file.request.responseURL)
          console.log(data.error)
          // unzip(buff, (err, buffer) => {
          //   if (err) {
          //     console.error('An error has occurred: ', err)
          //     process.exitCode = 1
          //   }
          //   console.log(buffer.toString())
          // })
          // const zip = new StreamZIp.async({ fd: file })
          // fs.writeFile("downloaded.zip", buff, (err) => {
          //   if (err) throw err;
          //   console.log("Done!")
          // })
        } catch (err) {
          console.log(err);
        }
}

downloadFile(filename)