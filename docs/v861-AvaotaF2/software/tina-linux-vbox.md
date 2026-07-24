---
sidebar_position: 12
---

# SDK 开发虚拟机搭建

本文帮助您搭建 Tina Linux SDK 的编译环境。如果您没有 Ubuntu 主机，可以通过虚拟机在 Windows/Mac 上运行 Ubuntu 系统，完成 SDK 编译。

:::tip

:::note

已有 Ubuntu 环境？

:::
:::note

如果您已有 Ubuntu 主机环境，可直接跳转至 【SDK 编译环境配置】 文档安装编译依赖。

:::

:::

## 编译环境要求

Tina Linux SDK 在 Ubuntu 系统上开发和测试，推荐使用 Ubuntu 作为编译环境。

支持的 Ubuntu 版本：14、16、18、20、22、24、26

其他 Linux 发行版由于未进行测试，且软件包管理器、软件版本和功能的差异，可能导致编译报错等问题。不推荐使用。

:::warning

:::note

架构限制

:::
:::note

**仅支持 x86\_64 (AMD64) 架构**，不支持 ARM 架构（如 Apple Silicon Mac、ARM 笔记本等）。

原因：Tina SDK 中的预编译工具链（交叉编译器、打包工具等）仅提供 x86\_64 版本，无法在 ARM 架构上运行。

如果您使用 ARM 架构设备，建议：

-   使用云端 Linux 服务器（x86\_64 架构）
-   使用远程编译服务器
-   推荐使用 **Ubuntu 20.04** 版本，与内部 SDK 开发环境一致

:::

:::

推荐的虚拟机配置：

| 配置项 | 推荐值 | 说明 |
| --- | --- | --- |
| 内存 | ≥ 12GB | 编译过程需要较大内存 |
| 虚拟硬盘 | ≥ 100GB | SDK 及编译产物占用较大空间 |
| CPU 核心 | ≥ 4核 | 多核心可加快编译速度 |

* * *

## 自行安装虚拟机

### 下载安装 VirtualBox

VirtualBox 是一款免费开源的跨平台虚拟机软件，支持 Windows、Mac、Linux。

官网下载：[https://www.virtualbox.org/](https://www.virtualbox.org/)

安装教程参考：[VirtualBox 安装教程](https://blog.csdn.net/kaixuansui/article/details/89334859/)

### 安装 Ubuntu 虚拟机

VirtualBox 安装 Ubuntu 的完整教程可参考：[VirtualBox 安装 Ubuntu 环境](https://blog.csdn.net/weixin_42135087/article/details/108193641)

安装时的关键配置要点：

1.  内存大小设置：建议大于 2GB
2.  虚拟硬盘大小设置：建议至少设置 50GB（SDK 所需较大空间）
3.  安装好 Ubuntu 虚拟机环境后，建议不要在线升级 Ubuntu 版本

### 配置增强功能

安装增强功能可以获得以下便利：

-   **共享粘贴板** — 在 PC 和虚拟机之间复制粘贴文本
-   **共享文件夹** — 在主机创建文件夹，映射到虚拟机中访问
-   **更好的显示支持** — 自动调整虚拟机窗口大小

#### 安装步骤

1.  启动虚拟机，进入 Ubuntu 系统
2.  点击菜单栏 **设备 → 安装增强功能**
3.  虚拟机光驱自动加载 `VBoxGuestAdditions.iso`
4.  点击弹出的 **Run** 按钮
5.  按提示完成安装，重启虚拟机

> 另一种方法：在 Linux 中手动挂载光驱安装，参考 [挂载光驱教程](https://jingyan.baidu.com/article/fdbd42779d9530b89e3f489c.html)

#### 配置共享文件夹

参考教程：[VirtualBox 共享文件夹设置](http://www.koudaipe.com/funny/1002.html)

:::warning

:::note

注意

:::
:::note

SDK 下载目录不要设置在共享文件夹中。如果共享文件夹挂载的是 Windows 系统，可能无法正常下载 Tina SDK 代码。

:::

:::

#### 解决权限问题

共享文件夹可能因权限问题无法访问，执行以下命令添加用户到 vboxsf 组：

```shell
sudo usermod -aG vboxsf $(whoami)
```

执行后需重启虚拟机生效。
