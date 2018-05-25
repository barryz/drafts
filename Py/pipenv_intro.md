# pipenv 使用简介

> Pipenv is a tool that aims to bring the best of all packaging worlds (bundler, composer, npm, cargo, yarn, etc.) to the Python world. Windows is a first-class citizen, in our world.

> It automatically creates and manages a virtualenv for your projects, as well as adds/removes packages from your Pipfile as you install/uninstall packages. It also generates the ever-important Pipfile.lock, which is used to produce deterministic builds.

> Pipenv is primarily meant to provide users and developers of applications with an easy method to setup a working environment. For the distinction between libraries and applications and the usage of setup.py vs Pipfile to define dependencies, see ☤ Pipfile vs setup.py.

总结成一句话：
pipenv类似于node的npm, rust的cargo, 把原来开发流程中virtualenv和pip组合用法整合到一个工具中来了。


---

## 安装

### MacOS
  ```bash
  brew install pipenv
  ```
### Other Platform
  ```bash
  pip install pipenv
  ```

---

## 基本用法

### 创建虚拟环境
如果是老项目本身已经存在虚拟环境， pipenv会自动检测到。

####  创建新的virtualenv虚拟环境
  ```bash
  pipenv --two  使用Python2创建virtualenv
  pipenv --three 使用Python3创建virtualenv
  pipenv --python 3.6.5 使用指定的Python版本创建virtualenv
  ```
创建成功后， 会自动进入virtualenv。

#### 退出virtualenv虚拟环境
  ```bash
  exit
  ```

#### 重新进入virtualenv虚拟环境
  ```bash
  pipenv shell
  ```

#### 查看当前virtualenv虚拟环境路径信息
  ```bash
  pipenv --venv
  ```
---

### 项目依赖包安装

#### 安装一个新包
  ```bash
  pipenv install request django ...
  ```

如果项目本身有`requirements.txt`， 可以指定从`requirements.txt`
安装包:
  ```bash
  pipenv install -r path/to/requirements.txt
  ```

可以在安装virtualenv同时安装相关依赖包:
  ```bash
  pipenv install -r path/to/requirements.txt --python 3.6.5
  ```


安装完成后在项目当前目录会生成 `Pipfile` 和 `Pipfile.lock` 两个文件。
默认pipenv是从官方pypi源去安装依赖包， 国内用户访问会比较慢， 我们可以编辑 `Pipfile` 中相关内容，使用国内的阿里云pypi镜像源。
  ```bash
  [[source]]
  url = "http://mirrors.aliyun.com/pypi/simple"
  verify_ssl = false
  name = "pypi"
  ```

Pipfile中的包分成了`production`和`dev`两种环境的包， 本地开发可以直接安装`dev`环境相关的包:
  ```bash
  pipenv install -d[--dev]
  ```

**生产环境** 安装包建议使用`Pipfile.lock`来安装：
  ```bash
  pipenv install --ignore-pipfile
  ```
---

更多用法参考: [Pipenv](https://docs.pipenv.org/)
