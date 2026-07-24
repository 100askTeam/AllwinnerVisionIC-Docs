---
sidebar_position: 11
---

# SDK 框架介绍

Tina Linux 是全志科技基于Linux内核开发的针对智能硬件类产品的嵌入式软件系统。

Tina Linux v5.0 中包含 Linux 系统开发用到的 boot 源码、内核源码、MCU源码、驱动、工具、系统中间件与应用程序包。可以方便的定制、编译、打包生成Linux固件镜像。

## 目录结构

Tina Linux v5.0 采用分层、模块化设计架构，通过清晰的目录划分实现了功能的解耦与管理的便捷性。根目录下各子目录职责明确，层次分明，共同构成了完整的嵌入式Linux系统开发环境。

### 目录设计理念

Tina Linux的目录结构设计遵循以下原则：

-   **功能分离**：不同功能模块独立存放，便于维护和管理
-   **层次清晰**：从底层引导、内核到上层应用，形成完整的软件栈
-   **配置集中**：芯片和产品配置集中管理，支持快速定制
-   **构建统一**：统一的构建系统，简化编译和打包流程

## 整体目录布局

```
.
├── brandy      # 启动引导代码目录，包含boot0、U-Boot等
├── bsp         # 板级支持包，包含内核驱动、设备树等
├── build       # 构建系统脚本，负责编译和打包
├── build.sh    # 主构建脚本
├── device      # 芯片方案配置文件目录
├── docs        # 文档目录
├── kernel      # Linux内核源码目录
├── openwrt     # OpenWrt源码和软件包目录
├── out         # 编译输出目录
├── platform    # 平台相关代码和配置
├── prebuilt    # 预编译工具和库
├── README.md   # 项目说明文档
├── rtos        # RTOS源码目录
├── test        # 测试代码和脚本
└── tools       # 开发和调试工具脚本
```

### 主要目录功能说明

| 目录名称 | 主要功能 | 核心内容 |
| --- | --- | --- |
| brandy | 启动引导系统 | boot0、U-Boot、SPL等引导加载程序 |
| bsp | 板级支持包 | 内核驱动、设备树、平台特定代码 |
| build | 构建系统 | 编译规则、环境配置、打包脚本 |
| device | 芯片方案配置 | 内核配置、分区表、板级配置文件 |
| kernel | Linux内核 | 内核源码、内核配置 |
| openwrt | 上层系统和软件包 | OpenWrt源码、用户态软件包、文件系统配置 |
| rtos | RTOS系统 | RTOS源码、驱动、配置 |
| tools | 开发工具 | 调试工具、烧录工具、辅助脚本 |

### brandy

brandy目录是Tina Linux系统的启动引导代码存放目录，主要包含boot0、U-Boot等启动加载程序的源代码。在V861平台的启动流程中，brandy组件负责系统的初始化和引导，是整个系统启动的关键环节。

**目录结构详解：**

```
.
├── brandy-2.0
│   ├── amp-spl       # 异构多处理(AMP)模式下的SPL(第二阶段引导加载程序)代码
│   ├── build.sh -> tools/build.sh  # 构建脚本，链接到tools目录下的build.sh
│   ├── opensbi-1.4   # RISC-V平台的开源SBI( Supervisor Binary Interface)实现
│   ├── spl           # 第二阶段引导加载程序(SPL)，对应boot0源码
│   ├── temp.mk       # Makefile文件
│   ├── tools         # 构建和调试工具
│   ├── u-boot-2023   # U-Boot 2023版本的源代码
│   └── u-boot-bsp    # U-Boot的板级支持包，包含平台的特定配置
└── dramlib           # DRAM相关库，V861不使用
```

**启动流程说明：**

1.  **SPL (boot0)阶段**：
    
    -   这是CPU上执行的第一个阶段代码
    -   主要任务包括：初始化硬件环境、配置时钟和DDR内存
    -   从Flash存储中读取RTOS镜像和Linux镜像到内存
    -   启动RTOS系统，并准备启动Linux系统
2.  **U-Boot阶段**：
    
    -   作为第三阶段引导加载程序，负责更复杂的初始化工作
    -   提供命令行交互界面，支持系统调试和配置
    -   加载Linux内核镜像和设备树到内存
    -   最终启动Linux内核

**快捷跳转命令：** `cboot` (进入boot目录)、`cboot0` (进入boot0源码目录)、`cspl` (进入SPL目录)、`cuboot` (进入U-Boot目录)、`cubsp` (进入U-Boot BSP目录)

### build

build目录存放Tina Linux的系统构建脚本，是整个项目的编译构建核心，主要功能有：

1.  **环境配置**：提供编译需要的环境变量、函数、规则，确保编译环境的一致性。
2.  **编译规则**：提供各目标模块的编译方法、规则，包括内核、驱动、应用程序等。
3.  **系统对接**：对接OpenWrt等不同构建系统，实现统一的构建流程。
4.  **固件打包**：包含打包生成系统固件的脚本，将编译产物整合为可烧录的固件镜像。

快捷跳转命令：`cbuild`

### device

device目录用于存放芯片方案的配置文件，包括内核配置，env配置，分区表配置，sys\_config.fex，board.dts等。这个目录对于产品的差异化配置至关重要，它包含了针对不同硬件方案的具体配置参数。

```
.
├── config
│   ├── chips
│   │   └── v861
│   │       ├── bin
│   │       ├── boot-resource
│   │       │   └── boot-resource
│   │       ├── configs
│   │       │   ├── default        # 默认配置方案
│   │       │   ├── perf1          # perf1方案
│   │       │   ├── perf2          # perf2方案
│   │       │   ├── ipc            # ipc方案
│   │       │   ├── aiglass        # AI眼镜方案
│   │       │   ├── aov            # Always On Video方案
│   │       │   ├── bga_perf1      # BGA PERF1方案
│   │       │   ├── sc1771v        # SC1771V 方案
│   │       └── tools
│   ├── common
│   └── rootfs_tar
└── product -> ./config/chips/v861
```

快捷跳转命令：`cchips`, `cconfigs`

### BSP

bsp 目录用于存放内核设备树 dtsi，内核驱动，内核头文件，配置文件等

```
bsp
  ├── certs
  ├── configs
  ├── drivers
  ├── include
  ├── Kconfig
  ├── lib
  ├── Makefile
  ├── modules
  ├── platform
  ├── ramfs
  └── scripts
```

快捷跳转命令：`cbsp`

### kernel

kernel 目录主要存放内核原生代码。

```
kernel
└── linux-6.6-xuantie
```

快捷跳转命令：`cbsp`

### openwrt

openwrt目录存放着openWrt原生代码，及软件包、芯片方案目录。

```
openwrt
└── openwrt
   ├── build           # OpenWrt 构建工具
   ├── dl              # OpenWrt 软件包预下载目录
   ├── openwrt         # OpenWrt 原生源码
   ├── package         # 用户态软件包
   └── target          # 目标板级文件系统配置
        └── v861
            ├── generic                        # 通用板级配置（一般不需要修改）
            ├── Makefile                       # 编译 Makefile （一般不需要修改）
            ├── v861-common                    # v861 平台通用文件系统配置
            ├── v861-ipc                       # v861 IPC 板级通用文件系统配置
            ├── v861-perf2                     # v861 PERF2 板级通用文件系统配置
            ├── v861-perf2_fastboot            # v861 PERF2 快起板级通用文件系统配置
```

快捷跳转命令：`cplat`

### rtos

RTOS 目录存放着 E907 使用的 RTOS 源码，组件，驱动，RTOS 板级配置文件

```
rtos
    ├── board
    │   └── v861_e907
    ├── envsetup.sh -> tools/scripts/source_envsetup.sh
    ├── lichee
    │   ├── rtos
    │   ├── rtos-components
    │   └── rtos-hal
    └── tools
        ├── scripts
        └── tool
```

快捷跳转命令：`crtos`

## 快捷指令

| 命令 | 命令有效目录 | 作用 |
| --- | --- | --- |
| make | tina根目录 | 编译整个sdk |
| make menuconfig | tina根目录 | 启动软件包配置界面 |
| make kernel\_menuconfig | tina根目录 | 启动内核配置界面 |
| croot | tina下任意目录 | 快速切换到tina根目录 |
| cconfigs | tina下任意目录 | 快速切换到方案的bsp配置目录 |
| cplat | tina下任意目录 | 快速切换到方案配置目录 |
| ctarget | tina下任意目录 | 快速切换到openWrt软件包编译产物目录 |
| crootfs | tina下任意目录 | 快速切换到openWrt rootfs目录 |
| copsrc | tina下任意目录 | 快速切换到openWrt目录 |
| cout | tina下任意目录 | 快速切换到方案的输出目录 |
| cboot | tina下任意目录 | 快速切换到bootloader目录 |
| cgrep | tina下任意目录 | 在c／c++／h文件中查找字符串 |
| mm \[-B\] | 软件包目录 | 编译软件包，-B指编译前先clean |
| mmo \[-B\] pkg | tina下任意目录 | 编译指定的软件包，-B指编译前先clean |
| pack | tina根目录 | 打包固件 |
| m | tina下任意目录 | make的快捷命令，编译整个sdk |
| p | tina下任意目录 | pack的快捷命令，打包固件 |
