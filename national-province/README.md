
**调用方法名：**
 - getProvince(Promise异步调用，内部代码已将执行结果以JSON格式写入文件，并返回)

**参数：**

 - 无

 **返回值：**

 - 所有省份(json格式)

**结果：** 获取到国家省级地区信息并写入json文件

**代码中使用方式:**
```javascript
// 文件头部require方式引入
const province=require('national-province');

// 代码中使用
province.getProvince()
        .then(res => {
          // 这里写拿到数据后的自己的一些操作代码
          // 因为内部是异步调用方式，这里用then来接受结果，结果为查找到的所有省数据，数据格式为json格式
          console.log(res);
        })
        .catch(err => { 
          console.log(err);
        });
```