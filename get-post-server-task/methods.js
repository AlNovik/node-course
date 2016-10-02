'use strict';

let fs = require('fs');
let path = require('path');
let mime = require('mime');
let sendError = require('./error');

const FILES_DIR = __dirname + '/files';
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1Mb

function GET(pathName, res) {
  if (pathName == '/') {
    sendFile(path.join(__dirname, '/public/index.html'), res);
  } else {
    pathName = checkPath(pathName, res);

    fs.stat(pathName, (err, stats) => {
      if (err || !stats.isFile()) {
        sendError(res, 404);
        return;
      }
      sendFile(pathName, res);
    })
  }
}

function POST(pathName, res, req) {
  if (req.headers['content-length'] > MAX_FILE_SIZE) {
    sendError(res, 413);
    return;
  }
  pathName = checkPath(pathName, res);

  if (pathName) {
    saveFile(pathName, res, req);
  }
}

function DELETE(pathName, res) {
  if (pathName == '/') {
    sendError(res, 404);
  } else {
    pathName = checkPath(pathName, res);

    fs.stat(pathName, (err, stats) => {
      if (err || !stats.isFile()) {
        sendError(res, 404);
        return;
      }
      removeFile(pathName, res);
    })
  }

}

function checkPath(pathName, res) {

  let filename = pathName.slice(1);

  if (!filename) {
    sendError(res, 404);
    return;
  }

  try {
    filename = decodeURIComponent(filename);
  } catch (e) {
    sendError(res, 400);
    return;
  }

  if (~filename.indexOf('\0')) {
    sendError(res, 400);
    return;
  }

  filename = path.normalize(path.join(FILES_DIR, filename));

  if(filename.indexOf(FILES_DIR) !== 0) {
    sendError(res, 404);
    return;
  }

  return filename;
}

function sendFile(filePath, res) {

  let file = fs.createReadStream(filePath);
  let mimeType = mime.lookup(filePath);

  file.pipe(res);

  file.on('error', err => {
    if (err.code === 'ENOENT') {
      sendError(res, 404);
    } else if (!res.headersSent) {
      sendError(res, 500);
    } else {
      res.end();
    }
  }).on('open', () => {
    res.setHeader('Content-Type', `${mimeType}; charset=utf-8`);
  }).on('close', () => {
    file.destroy();
  })
}

function removeFile(filePath, res) {
  fs.unlink(filePath, (err) => {
    if (err) {
      sendError(res, 500);
    }
    res.end();
  });
}

function saveFile(filePath, res, req) {
  let size = 0;
  let writeStream = new fs.WriteStream(filePath, {flags: 'wx'});

  req
      .on('data', chunk => {
        size += chunk.length;

        if (size > MAX_FILE_SIZE) {
          sendError(res, 413);

          res.destroy();
          writeStream.destroy();
          fs.unlink(filePath);
        }
      })
      .on('close', () => {
        writeStream.destroy();
        fs.unlink(filePath);
      })
      .pipe(writeStream);

  writeStream.on('error', err => {
    if (err.code === 'EEXIST') {
      sendError(res, 409);
    } else {
      if (!res.headersSent) {
        sendError(res, 500);
      } else {
        res.end();
      }
      fs.unlink(filePath);
    }
  }).on('close', () => {
    res.end();
  });
}

exports.GET = GET;
exports.POST = POST;
exports.DELETE = DELETE;
