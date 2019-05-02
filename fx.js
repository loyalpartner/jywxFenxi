import {
  readFileSync,
  readdirSync
} from 'fs';

import {
  filter,
  forEach,
  fromPairs,
  map,
  pipe,
  prop,
  zip
} from 'ramda';
import cheerio from 'cheerio';

import {
  getChinese,
  getFileName,
  nameUsedCount,
  print,
  removeTail
} from './utils';

const readHtml = (html) => readFileSync(html, "utf8");
let content = readHtml("index.html");

const getPeoplesTable = (content) => {
  let $ = cheerio.load(content);
  let books = $("h2.dataname").map((i, e) => removeTail($(e).text())).get();
  let peoples = $("div.datapice").map((i, e) => {
    return [$(e).children("a").map((ai, ae) => getChinese($(ae).text())).get()];
  }).get();
  return pipe(zip(books), fromPairs)(peoples);
}

const getBookContent = (bookName) => {
  let contentCache = {};

  return (() => {
    let content = prop(bookName, contentCache);
    if (!content) {
      content = readFileSync(bookName + ".txt", "utf8");
      contentCache[bookName] = content;
    }
    return content;
  })();
}


const getResultByBook = (book) => {
  const peoplesTable = getPeoplesTable(content);
  const bookContent = getBookContent(book);
  let names = prop(book, peoplesTable)
  let useCounts = map(name => nameUsedCount(name, bookContent), names);

  return zip(names, useCounts);
}

var dirs = readdirSync("./");

pipe(
  filter(t => t.endsWith(".txt")),
  map(getFileName),
  map(getResultByBook),
  print
)(dirs);


