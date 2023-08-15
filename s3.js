var Minio = require('minio')
const region = "ap-southeast-2"
const bucketName = "team-image-betting-website"
const accessKey = "xc7EayBcknKazUUu"
const scretKey = "FS7jKRpXcVZCYVRk5SAKSX28X1bTDAwo"
var minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: accessKey,
    secretKey: scretKey
});
// /home/khanh/betting_web/betting_be/routes/imgHandler.js
var file = '/home/khanh/betting_web/betting_team_image/images/Barca.png';
var metaData = {
    'Content-Type': 'application/octet-stream'
}
minioClient.fPutObject('team-image-betting-website', 'Barca.png', file, metaData, function(err, etag) {
    if (err) return console.log(err)
    console.log('File uploaded successfully.',etag)
  });
module.export= {minioClient}
