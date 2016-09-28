'use strict';

let fs = require('fs');
let path = require('path');
let mime = require('mime');
let sendError = require('./error');

const FILES_DIR = __dirname + '/files';
const MAX_FILE_SIZE = 1 * 1024 * 1024;

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
  if (pathName == '/') {
    sendFile(path.join(__dirname, '/public/index.html'), res);
  } else {
    if (req.headers['content-length'] > MAX_FILE_SIZE) {
      sendError(res, 413);
      return;
    }
    pathName = checkPath(pathName, res);

    fs.stat(pathName, (err, stats) => {
      if (err && err.code !== 'ENOENT') {
        sendError(res, 500);
        return;
      }

      if (stats && stats.isFile()) {
        sendError(res, 409)
      }

      saveFile(pathName, res, req);
    })
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
  try {
    pathName = decodeURIComponent(pathName);
  } catch (e) {
    sendError(res, 400);
    return;
  }

  if (~pathName.indexOf('\0')) {
    sendError(res, 400);
    return;
  }

  pathName = path.normalize(path.join(FILES_DIR, pathName));

  if(pathName.indexOf(FILES_DIR) !== 0) {
    sendError(res, 404);
    return;
  }

  return pathName;
}

function sendFile(filePath, res) {

  let file = fs.ReadStream(filePath);
  let mimeType = mime.lookup(filePath);

  res.setHeader('Content-Type', mimeType + '; charset=utf-8');

  file.pipe(res);

  file.on('error', err => {
    sendError(res, 500);
  });

  res.on('close', () => {
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
  var file = fs.createWriteStream(filePath);
  file.on('error', err => {
    sendError(res, 500);
  });
  file.on('finish', err => {
    res.end();
  });

  req.pipe(file);

  req.on('abort', () => {
    file.destroy();
  })
}

exports.GET = GET;
exports.POST = POST;
exports.DELETE = DELETE;
