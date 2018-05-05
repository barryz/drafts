### 0x01 HelloWorld(简单查询)

```js
{
    find_someone(func: eq(name, "SomeOne's name")) {
        uid
        name
        age
        sex
    }
}
```

上面的查询语句表示, 新建一个名为 `find_someone` 的query, 查询条件为集合内name等于 `SomeOne's name`的实体, 并返回 uid, name, age, sex 字段。
其中 `uid` 是 dgraph 内部的用来标识entity的唯一identify, 是一个16进制的数. 也可以通过`uid` 来查询某个entity:

```js
{
    find_someone(func: uid(0x6)) {
        name
        age
        sex
        uid
        someFieldNotFound # 如果字段不存在,则不显示,不会报错
    }
}
```

### 0x02 关系查询

可以查询某entity和另外的entity的关系(edge)

```js
{
    find_someone(func: eq(name, "Michael")) {
        name
        age
        uid
        owner_pet {  # 查询Michael拥有的宠物
            name
        }
        friend { # 查询Michael的朋友
            name
            age
            uid
            friend {
                name # 查询Michael朋友的朋友
            }
        }
    }
}
```

Response:

```js
{
  "data": {
    "find_someone": [
      {
        "name": "Michael",
        "age": 39,
        "uid": "0x3",
        "friend": [
          {
            "age": 35,
            "uid": "0x4",
            "friend": [
              {
                "name": "Michael"
              }
            ]
          },
          {
            "age": 24,
            "uid": "0x5",
            "friend": [
              {
                "name": "Catalina"
              }
            ]
          },
          {
            "name": "Catalina",
            "age": 19,
            "uid": "0x6"
          },
          {
            "age": 35,
            "uid": "0x7"
          },
          {
            "name": "Sarah",
            "age": 55,
            "uid": "0xa"
          }
        ]
      }
    ]
  }
```

### 0x03 数据类型和节点

Dgraph中可用的数据类型有:

- `int`	    signed 64 bit integer
- `float`	    double precision floating point number
- `string`    string
- `bool`	    boolean
- `id`	    ID’s stored as strings
- `dateTime`	RFC3339 time format with optional timezone eg:        2006-01-02T15:04:05.999999999+10:00 or 2006-01-02T15:04:05.999999999
- `geo`	    geometries stored using go-geom
- `uid`       uid

### 0x04 多语言支持
Dgraph支持UTF-8编码的字符串文本查询.

字符串值谓词可以用`language tag`进行注释.

比如:

```js
    "Lily"@en # 表示以英文存储
    "अमित"@hi # 表示以菲律宾语存储
    "상현"@ko  # 表示以韩文存储
    "张三"@ch  # 表示中文存储
```

Query可以通过以哪种语言搜索以及以哪种语言返回来搜索带Tag语言的文本.
如果是以此种格式要求返回: `@lang1:...:langN`, 则需遵循以下规则：

- 至少返回一个结果
- 如果结果存在于首选语言中，则返回最左边（在首选项列表中）的结果
- 如果结果不存在于首选语言中，则不返回结果，除非首选项列表以`.`结尾，在这种情况下，将返回没有指定语言的值.

### 0x05 函数和过滤

节点根据应用于节点edge的函数进行过滤.

过滤不仅可以应用在查询的顶级节点上, 事实上, 查询过滤可以应用在任何节点上.

下列是一些常用的过滤函数:

- `allOfTerms(edge_name, "term1 ... termN")`： 以任何顺序匹配符合所有指定模式的字符串;不区分大小写
- `anyOfTerms(edge_name, "term1 ... termN")`： 以任何顺序匹配符合任何指定模式的字符串;不区分大小写

- 等值或不等值查询过滤, 可以用来比较的类型有: `int`, `float`, `string`和 `date`.

    1. `eq(edge_name, value)`：  等于
    2. `ge(edge_name, value)`：  大于等于
    3. `le(edge_name, value)`：  小于等于
    4. `gt(edge_name, value)`：  大于
    5. `lt(edge_name, value)`：  小于

- 还有其他过滤函数诸如： `regular expression`, `full text search`, `geo search`


eg.

```js
{
    filter_friend(func: allofterms(name, "Michael")) {
        name
        age
        friend @filter(le(age, 27)) { # 子过滤, 过滤出年龄小于27的朋友..
          name@. # tag 为 . , 表示显示所有语言类别的name
          age
        }
    }
}
```

Response:

```js
{
  "data": {
    "filter_friend": [
      {
        "name": "Michael",
        "age": 39,
        "friend": [
          {
            "name@.": "Sang Hyun",
            "age": 24
          },
          {
            "name@.": "Catalina",
            "age": 19
          }
        ]
      }
    ]
  }
}
```

### 0x06 逻辑运算(AND, OR and NOT)

逻辑操作符 `AND`, `OR` 和 `NOT` 可以在一个filter中组合多个function.

eg.

```js
{
  filter_test(func: anyofterms(name, "Michael")) {
    age
    name
    friend @filter(lt(age, 40) AND gt(age, 20)) { # 过滤大于20且小于40的friend.
      name@.
      age
    }
  }
}

{
  filter_test(func: anyofterms(name, "Michael")) {
    age
    name
    friend @filter(NOT ge(age, 20)) { # 过滤小于20的friend.
      name@.
      age
    }
  }
}
```

注意: 逻辑操作符不能直接用于func关键字之后, 比如: 

```js
{
  filter_xxx(func: AND allofterms()) ... # 报错
}
```

### 0x07 排序

查询结果可以使用 `orderasc` 和 `orderdesc` 来升降序排序.

排序结果只会在JSON Response中才会体现.

eg.

```js
{
  filter_test(func: allofterms(name, "Michael")) {
    age
    name
    friend (orderdesc: age) { # 以age倒序排列
      name@.
      age
    }
  }
}
```


### 0x08 分页(offset, first, after)

通常来说,一个查询返回上万的结果的情况并不罕见.

有些场景下, 我们可能不需要这么多的数据,或者只是需要 `top-K` 的数据, 对结果进行分页显示，或者limit一些结果.

在 `GraphQL+-` 语法中, 关键字: `offset`, `first`, `after` 可以和排序功能组合使用.

- `first: N` 返回前N个结果
- `offset: N` 跳过前N个结果
- `after: uid` 返回该uid之后的数据

**这里的N必须是无符号整型**

**默认的, 查询结果通过`uid`进行排序.**  

eq.

```js
{
  filter_test(func: allofterms(name, "Michael")) {
    age
    name
    friend (orderdesc: name@., first: 2, offset: 1) { 
      name@.
      age
    }
  }
}
```

### 0x09 计数(Count)

使用 `count` 函数可以统计结果集中的edges个数.

eg.

```js
{
  filter_test(func: anyofterms(name, "Michael")) {
    age
    name
    count(friend)
  }
}
```

Response:

```js
"data": {
    "filter_test": [
      {
        "age": 39,
        "name": "Michael",
        "count(friend)": 5
      }
    ]
  }
}
```


