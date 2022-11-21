const drive = require('./driveservice')

async function listFiles (fileName) {
    const f = fileName+".zip"
    let res = await new Promise((resolve, reject) => {
      drive.files.list({}, function (err, res) {
        if (err) {
          reject(err);
        }
          resolve(res);
      });
    });
    const files = res.data.files;
    if ( files.length ) {
        return files.filter(file => file.name == f)[0].id
    }
    return undefined
  }

module.exports = listFiles
// listFiles("test_resources")
//   .then(res => {
//     console.log(res)
//   })
//   .catch(rej => {
//     console.log(rej)
//   })
