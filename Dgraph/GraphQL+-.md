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

### 0x05 TODO
