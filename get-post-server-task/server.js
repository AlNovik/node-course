/**
 ЗАДАЧА
 Написать HTTP-сервер для загрузки и получения файлов
 - Все файлы находятся в директории files
 - Структура файлов НЕ вложенная.

 - Виды запросов к серверу
   GET /file.ext
   - выдаёт файл file.ext из директории files,

   POST /file.ext
   - пишет всё тело запроса в файл files/file.ext и выдаёт ОК
   - если файл уже есть, то выдаёт ошибку 409
   - при превышении файлом размера 1MB выдаёт ошибку 413

   DELETE /file.ext
   - удаляет файл
   - выводит 200 OK
   - если файла нет, то ошибка 404

 Вместо file может быть любое имя файла.
 Так как поддиректорий нет, то при наличии / или .. в пути сервер должен выдавать ошибку 400.

- Сервер должен корректно обрабатывать ошибки "файл не найден" и другие (ошибка чтения файла)
- index.html или curl для тестирования

 */

// Пример простого сервера в качестве основы

'use strict';

const url = require('url');
const http = require('http');
const methods = require('./methods');
const sendError = require('./error');

module.exports = http.createServer((req, res) => {

  let pathname = decodeURI(url.parse(req.url).pathname);
  let filename = pathname.slice(1);

  if (filename.includes('/') || filename.includes('..')) {
    sendError(res, 400, 'Nested paths are not allowed');
    return;
  }

  if (methods[req.method]) {
    methods[req.method](pathname, res, req);
  } else {
    sendError(res, 502);
  }
});
