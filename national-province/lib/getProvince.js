// 加载cheerio库，用来在服务端直接操作页面dom
const cheerio = require('cheerio');
// 引入http、https模块，根据所爬网站协议来选择合适的进行使用
const http = require('http');
//引入相关模块
const iconv = require('iconv-lite');
// 引入文件系统
const fs = require('fs');

// 获取当前年份值
var year = new Date().getFullYear() - 1;
// 目的网址
var url = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/' + year + '/index.html';

function getProvince() {
  const resultPromise = new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let chunkBuffers = [];

      res.on('data', (chunk) => {
        chunkBuffers.push(chunk);
      });

      res.on('end', () => {
        try {
          // 对字节进行处理
          let buffer = Buffer.concat(chunkBuffers);
          // 对window环境下的返回字符编码为gb2312编码格式的字符内容进行处理
          let html = iconv.decode(buffer, 'gb2312');

          let $provinceCheerio = cheerio.load(html);
          let $province = $provinceCheerio('.provincetr');
          let provinceObj = [];

          let $td = '';
          $province.each(function (i, item) {
            $td = $provinceCheerio(item).find('td');
            $td.each(function (i, item) {
              let resObj = {
                provinceCode: $provinceCheerio(item).find('a').attr('href').split('.')[0],
                provinceName: $provinceCheerio(item).find('a').text()
              }
              provinceObj.push(resObj);
            });
          });
          // 将数据写入文件
          fs.writeFile(year + '国家省区信息.json', JSON.stringify(provinceObj), (err) => {
            if (err) throw err;
            console.log('file saved');
            resolve(JSON.stringify(provinceObj));
          });
        } catch (e) {
          console.error(e.message);
        }
      }).on('error', (e) => {
        console.error(`出现错误: ${e.message}`);
      });
    });
  });
  return resultPromise;
}
module.exports = { getProvince };