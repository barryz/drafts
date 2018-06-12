# AWS Authentication Version 4


`Authorization`头应包含下列信息：

- 使用的签名算法(AWS4-HMAC-SHA256)
- 授信作用域(credential scope)
- 签名的头部列表
- 计算后的签名, 此签名基于请求信息, 并使用`secret access key`产生.

一个完整的请求示例:

```bash
GET https://iam.amazonaws.com/?Action=ListUsers&Version=2010-05-08 HTTP/1.1
Authorization: AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/iam/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7
content-type: application/x-www-form-urlencoded; charset=utf-8
host: iam.amazonaws.com
x-amz-date: 20150830T123600Z
```
---

## Task1 (构建标准请求)

Example:
```
CanonicalRequest =
  HTTPRequestMethod + '\n' +
  CanonicalURI + '\n' +
  CanonicalQueryString + '\n' +
  CanonicalHeaders + '\n' +
  SignedHeaders + '\n' +
  HexEncode(Hash(RequestPayload))
```

示例中`Hash`函数能生成信息摘要，比如`SHA-256`(这个hash算法可以自己指定). `HexEncode`函数返回以小写字符的表示的base-16编码摘要.

### 如何构建拼接出一个标准的请求

示例请求:
```
GET https://iam.amazonaws.com/?Action=ListUsers&Version=2010-05-08 HTTP/1.1
Host: iam.amazonaws.com
Content-Type: application/x-www-form-urlencoded; charset=utf-8
X-Amz-Date: 20150830T123600Z
```

1. **以HTTP请求方法（GET,PUT,POST,etc.),以换行符 `"\n"`结尾**

```bash
GET\n
```

2. **添加URI参数,以换行符`"\n"`结尾**

标准的URI是URI-encoded编码后的版本,它从HTTP`host`部分到`query string`部分(如果有的话)的问号字符（`？`）的URI中的所有内容.


```bash
/documents%20and%20settings/\n
```

如果绝对路径为空， 那只需使用 `/` 即可。
```bash
/\n
```

3. **添加标准请求字符串,以换行符`"\n"`结尾. 如果没有请求参数， 则使用空字符串代替**

```bash
Action=ListUsers&Version=2010-05-08\n
```

构建标准请求字符串时， 需要遵循以下规则：

 - Sort the parameter names by character code point in ascending order. For example, a parameter name that begins with the uppercase letter F precedes a parameter name that begins with a lowercase letter b.

 - URI-encode each parameter name and value according to the following rules:

 - Do not URI-encode any of the unreserved characters that [RFC 3986](http://tools.ietf.org/html/rfc3986) defines: A-Z, a-z, 0-9, hyphen ( - ), underscore ( _ ), period ( . ), and tilde ( ~ ).

 - Percent-encode all other characters with %XY, where X and Y are hexadecimal characters (0-9 and uppercase A-F). For example, the space character must be encoded as %20 (not using '+', as some encoding schemes do) and extended UTF-8 characters must be in the form %XY%ZA%BC.

 - Build the canonical query string by starting with the first parameter name in the sorted list.

 - For each parameter, append the URI-encoded parameter name, followed by the equals sign character (=), followed by the URI-encoded parameter value. Use an empty string for parameters that have no value.

 - Append the ampersand character (&) after each parameter value, except for the last value in the list.

Example canonical query string:

```bash
Action=ListUsers&Version=2010-05-08&X-Amz-Algorithm=AWS4-HMAC-SHA256& X-Amz-Credential=AKIDEXAMPLE%2F20150830%2Fus-east-1%2Fiam%2Faws4_request& X-Amz-Date=20150830T123600Z& X-Amz-SignedHeaders=content-type%3Bhost%3Bx-amz-date
```

4. **添加标准头部，以换行符`"\n"`结尾. 标准头部是有一系列需要验证的http头部组成的列表**

其中,`host`头部是必须添加的. 标准头部例如 `Content-Type`则是可选的.

Example canonical SignedHeaders

```bash
content-type:application/x-www-form-urlencoded; charset=utf-8\n
host:iam.amazonaws.com\n
x-amz-date:20150830T123600Z\n
```

有几点需要注意:
 - 创建标准头部时， 需要将所有头部名称转换成小写形式，并移除行首行位的空白字符. 将value中的连续空白字符转换成单个空白字符.
 - 转换时需要根据头部名字首个字符的字符码点(ASCII)进行升序排序.

比如原生的headers如下：

```bash
Host:iam.amazonaws.com\n
Content-Type:application/x-www-form-urlencoded; charset=utf-8\n
My-header1:    a   b   c  \n
X-Amz-Date:20150830T123600Z\n
My-Header2:    "a   b   c"  \n
```

转换后的标准头部为:

```bash
content-type:application/x-www-form-urlencoded; charset=utf-8\n
host:iam.amazonaws.com\n
my-header1:a b c\n
my-header2:"a b c"\n
x-amz-date:20150830T123600Z\n
```

5. **添加签名后的header, 以换行符`"\n"`结尾**

值就是包含在标准headers的头部名称列表, 其中`host`头部是必需的.  转换方式与构建标准头部的形式一致， 都需要小写且按照首字符排序.

Example:

```bash
content-type;host;x-amz-date\n
```

6. **使用一种Hash算法(SHA256)计算出请求体payload的信息摘要**

如果指定了`SHA256`算法, 那就需要在请求的`Authorization`头部指定`AWS4-HMAC-SHA256`作为签名算法. payload被hash之后必须以小写的十六进制字符串表示.

Example:
```bash

e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

7. **构造所有已完成的标准请求, 将各个标准组件组合起来**

Example:

```bash

GET  # method
/ # uri path
Action=ListUsers&Version=2010-05-08 # query string
content-type:application/x-www-form-urlencoded; charset=utf-8
host:iam.amazonaws.com
x-amz-date:20150830T123600Z # canonical headers

content-type;host;x-amz-date # signed headers
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 # payload digest
```

8. **使用与加密payload相同的hash算法为标准请求生成摘要**

这个摘要信息将会在步骤2中构建`StringToSign`使用到.

```bash
Hash(canonical requeset)

f536975d06c0309214f805bb90ccff089219ecd68b2577efef23edd43b7e1a59
```

---

## Task2 (Create a String to Sign for Signature Version 4)

签名字符串包含了请求的meta信息和之前步骤创建的标准请求摘要.

创建签名字符串, 需要将加密算法, 日期时间, 授信作用域(credential scope), 标准请求的摘要信息组合起来, 如下所示:

```bash

StringToSign =
    Algorithm + \n +
    RequestDateTime + \n +
    CredentialScope + \n +
    HashedCanonicalRequest
```

### 如何创建一个签名字符串

Example HTTPS request:

```bash
GET https://iam.amazonaws.com/?Action=ListUsers&Version=2010-05-08 HTTP/1.1
Host: iam.amazonaws.com
Content-Type: application/x-www-form-urlencoded; charset=utf-8
X-Amz-Date: 20150830T123600Z
```

1. **以算法名称开头, 以换行符`"\n"`结尾**

这里的算法名称就是用来计算标准请求的hash算法.


```bash

AWS4-HMAC-SHA256\n
```

2. **追加请求的日期时间值, 以换行符`"\n"`结尾**

日期时间的格式由[ISO8601](定义)定义, 格式为: `YYYYMMDD'T'HHMMSS'Z'`.

```bash

20150830T123600Z\n
```

3. **追加授信作用域的值, 以换行符`"\n"`结尾**

这个值应当包括请求日期(不包含时间), 请求的地区, 请求的目标(需要请求什么服务), 以及一个终止小写字符串("aws_request"), 其中:

- 地区(region)和Service 必须以UTF-8编码.
- 日期格式必须为 `YYYYMMDD`, 且不包括时间信息.

```bash

20150830/us-east-1/iam/aws4_request\n # date/region/service/terminated_string
```

4. **追加在步骤1中生成的标准请求的摘要信息**

摘要信息必须为小写的base-16编码格式.

```bash

f536975d06c0309214f805bb90ccff089219ecd68b2577efef23edd43b7e1a59
```


5. **最终构成的签名字符串为:**

```bash
AWS4-HMAC-SHA256
20150830T123600Z
20150830/us-east-1/iam/aws4_request
f536975d06c0309214f805bb90ccff089219ecd68b2577efef23edd43b7e1a59
```

---

## Task3 (计算V4签名)

在计算V4签名之前， 需要根据AWS的secret access key 生成`signing key`. 因为生成的`signing key` 指定了日期, 请求的服务, 地区. 它提供了足够的资源限制与保护.


### 如何创建一个v4签名

1. **生成`signing key`**

使用个人或组织的access key 创建一系列**基于hash的消息认证码(HAMCs)**

伪代码如下:

```bash

kSecret = your secret access key # access key
kDate = HMAC("AWS4" + kSecret, Date)
kRegion = HMAC(kDate, Region)
kService = HMAC(kRegion, Service)
kSigning = HMAC(kService, "aws4_request") # final signing key
```

日期需要使用格式: `YYYYMMDD`

Example:

```bash
# Input example
HMAC(HMAC(HMAC(HMAC("AWS4" + kSecret,"20150830"),"us-east-1"),"iam"),"aws4_request")

# output example
c4afb1cc5771d871763a393e44b703571b55cc28424d1a5e86da6ed3c154a4b9
```

关于如何使用特定语言生成`signing key`可以参考: [Examples of How to Derive a Signing Key for Signature Version 4 ](https://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html).

2. **计算v4签名**

使用生成的`signing key` 和 之前步骤生成的 `string to sign` 做HMAC运算. 并将结果转换成十六进制

伪代码如下:

```bash
# input example
signature = HexEncode(HMAC(signing key, string to sign))

# output example
5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7
```

---

## Task4 (向HTTP请求中添加签名信息)

有两种方式可以添加签名信息:
- 以头部方式向 `Authorization` 的头部添加签名信息
- 以请求字符串的方式添加签名信息

### 向`Authorization` Header 添加签名信息

Pseudocode:

```bash
# format
Authorization: algorithm Credential=access key ID/credential scope, SignedHeaders=SignedHeaders, Signature=signature

# example
Authorization: AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/iam/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7
```

有几点需要注意:

- `algorithm` 和 `Credential` 之间没有分隔符, 但是 `SignedHeaders` 和 `Signature`
之间有逗号分隔.
-  `Credential` 以 access key ID 开始， 后面跟 `/` , 再跟授信作用域(credential scope). `secret access key` 在生成 `signing key` 的时候被使用了, 但并没有这里被使用.
