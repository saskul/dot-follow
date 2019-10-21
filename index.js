const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const bmp2json = require('bmp2json').bmp2json;

const app = express();


//  CONFIG  ////////////////////////////////////////////////////////////////////
dotenv.config();
const { PORT } = process.env;
const SIZE_LIMITS = {
  json: '10mb',
  urlencoded: '1mb',
  fileUpload: 50 * 1024 * 1024
}


//  MIDDLEWARES ////////////////////////////////////////////////////////////////
app.use(bodyParser.json({
  limit: SIZE_LIMITS.json, extended: true
}));
app.use(bodyParser.urlencoded({
  limit: SIZE_LIMITS.urlencoded, extended: true
}));
app.use(fileUpload({
  limits: { fileSize: SIZE_LIMITS.fileUpload },
}));


//  API ////////////////////////////////////////////////////////////////////////
const api = express.Router();
api.post('/upload', function(req, res) {
  console.log(req.files.foo);
  // console.table(bmp2json('./img.bmp', 6));
});


//  CLIENT  ////////////////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname+'/client/build')));
app.use('/api', api);
app.get('*', function(req,res) {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(PORT, () => console.log(`\nServer is listening on port ${PORT}`));
