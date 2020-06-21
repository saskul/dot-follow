const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const bmp2json = require('bmp2json');

const app = express();


//  CONFIG  ////////////////////////////////////////////////////////////////////
const { PORT } = process.env;
const SIZE_LIMITS = {
  json: '10mb',
  urlencoded: '1mb',
  fileUpload: 50 * 1024 * 1024
};

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

api.get('/vader', function(req, res) {
  try {
    const { quality } = req.query;
    const json = bmp2json.getBrightPixelMatrix(
      path.join(__dirname+'/gallery/vader.bmp'),
      Number(quality)
    );
    res.json(json);
  } catch (err) {
    res.status(500).json(err);
  }
})


//  CLIENT  ////////////////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname+'/html')));
app.use('/api', api);
app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname+'/html/index.html'));
});

try {
	if (!process.env.PORT) throw new Error("Set PORT environment variable");
	app.listen(PORT, () => console.log(`\nServer is listening on port ${PORT}`));
} catch(err) {
	console.error(err);
}


