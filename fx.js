import * as R from 'ramda';
import cheerio from 'cheerio';
import {readFileSync, readdirSync} from 'fs';


var getBooksWithPeoples = function(){

  const content = readFileSync("index.html","utf8");

  var getCheerio = content => cheerio.load(content);
  var getChinese = s => s.match(/[\u4e00-\u9fa5]/g).join("");
  var removeTail = s => s.replace("人物大全","")
  var getBooks = $ => $("h2.dataname").map((i,e)=> removeTail($(e).text())).get();
  var getPeoples = $ => $("div.datapice").map((i,e)=> {
    return [$(e).children("a").map((ai,ae) => getChinese($(ae).text())).get()];
  }).get();


  var $c = getCheerio(content);
  var books = getBooks($c);
  var peoples = getPeoples($c);

  return R.pipe(R.zip(books),R.fromPairs)(peoples);

};

const bookPeoplePairs = getBooksWithPeoples();



var getStatisticsWithBook = (bookName) => {

  var readContent = (function(){
    let contentCache = {};

    return (bookName)=>{
      let content = R.prop(bookName,contentCache);
      if (!content){
        content = readFileSync(bookName+".txt", "utf8");
        contentCache[bookName] = content;
      }else{
        // console.info(content);
      }
      return content;
    };
  })();

  var getNameUsedCountInContent = (name, content) => content.split(name).length-1;

  var getNameUsedCountInBook = (name, book) => getNameUsedCountInContent(name, readContent(book));

  console.info("=".repeat(20) + bookName + "人物出现次数" + "=".repeat(20));
  let peoples = R.prop(bookName, bookPeoplePairs)
  R.forEach(name => {
    const message = name +  ":" + getNameUsedCountInBook(name,bookName);
    console.info(message);
  })(peoples);
  console.info("=".repeat(20) + bookName + "人物出现次数" + "=".repeat(20));
}

// getStatisticsWithBook("天龙八部");
const getFileName = s => s.replace("\.txt","")

var dirs = readdirSync("./");

R.pipe(
  R.filter(t=>t.endsWith(".txt")),
  R.map(getFileName),
  R.forEach(getStatisticsWithBook)
  )(dirs);

