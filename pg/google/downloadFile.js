const path = require('path')

const bucketName = 'q20bucket';
const srcFileName = 'resources.zip';
const destFileName = path.join(__dirname, srcFileName);

const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

async function downloadPublicFile() {
  const options = {
    destination: destFileName,
  };

  await storage.bucket(bucketName).file(srcFileName).download(options);

  console.log(
    `Downloaded public file ${srcFileName} from bucket name ${bucketName} to ${destFileName}`
  );
}

downloadPublicFile().catch(console.error);