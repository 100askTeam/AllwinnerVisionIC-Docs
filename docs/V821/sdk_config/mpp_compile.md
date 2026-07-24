---
sidebar_position: 4
---

# SDK 配置多媒体库

quick\_config 中内置了配置多媒体库的功能，可以配置多媒体库使用动态库还是静态库。该配置支持常电和快起系统。

-   mpp\_compile\_dynamic\_lib：配置多媒体使用动态库
-   mpp\_compile\_static\_lib：配置多媒体使用静态库（SDK 默认）

## 配置示例

### 配置多媒体使用动态库

1.  加载 SDK 环境变量 `source build/envsetup.sh && lunch` 选择需要开发的快起板级
2.  执行 `quick_config`，打开 `quick_config` 配置界面
3.  执行 `make distclean` 清除编译数据
4.  选择 `mpp_compile_dynamic_lib` 条目

Loading asciinema cast...

### 配置多媒体使用静态库

1.  加载 SDK 环境变量 `source build/envsetup.sh && lunch` 选择需要开发的快起板级
2.  执行 `quick_config`，打开 `quick_config` 配置界面
3.  执行 `make distclean` 清除编译数据
4.  选择 `mpp_compile_static_lib` 条目

Loading asciinema cast...
