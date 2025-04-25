---
sidebar_position: 1
---
# SDK 框架介绍

Tina Linux 是全志科技基于Linux内核开发的针对智能硬件类产品的嵌入式软件系统。

Tina Linux v5.0 中包含 Linux 系统开发用到的 boot 源码、内核源码、MCU源码、驱动、工具、系统中间件与应用程序包。可以方便的定制、编译、打包生成Linux固件镜像。

## 目录结构

Tina Linux v5.0 目录结构主要有构建工具、构建系统、配置工具、工具链、芯片配置目录、内核、RTOS、及 BOOT 目录等组成。下面列出一些常用文件夹作说明

```text
.
├── brandy
│   └── brandy-2.0
│       ├── spl          # BOOT 启动引导
│       ├── tools        # BOOT 编译工具链
│       └── u-boot-2018  # U-Boot 源码
├── bsp                  # BSP 驱动源码目录
│   ├── configs          # 存放内核设备树 dtsi
│   ├── drivers          # Linux 设备外设驱动
... ...
│   └── include          # Linux 头文件
├── build                # SDK 构建系统，打包脚本
├── device               # SDK 板级配置
│   └── config
│       └── chips        # SDK 板级配置
│           └── V821
│               └── configs                    # 板级配置文件
│                   ├── default                # 板级公共配置
│                   ├── ipc                    # IPC 板级配置（最小板级，原型机）
│                   ├── perf2                  # PERF2 板级配置（开发板）
│                   ├── perf2_fastboot         # PERF2 板级快起方案配置（开发板快起）
│                   ├── perf2_fastboot_dual    # PERF2 板级双目快起方案配置（开发板双目快起）
│                   └── ver1                   # VER1 板级配置（带屏）
├── kernel
│   └── linux-5.4-ansc  # 内核原生源码
├── openwrt
│   ├── build           # OpenWrt 构建工具
│   ├── dl              # OpenWrt 软件包预下载目录
│   ├── openwrt         # OpenWrt 原生源码
│   ├── package         # 用户态软件包
│   └── target          # 目标板级文件系统配置
│       └── v821
│           ├── generic                        # 通用板级配置（一般不需要修改）
│           ├── Makefile                       # 编译 Makefile （一般不需要修改）
│           ├── v821-common                    # v821 平台通用文件系统配置
│           ├── v821-ipc                       # v821 IPC 板级通用文件系统配置
│           ├── v821-perf2                     # v821 PERF2 板级通用文件系统配置
│           ├── v821-perf2_fastboot            # v821 PERF2 快起板级通用文件系统配置
│           ├── v821-perf2_fastboot_dual       # v821 PERF2 双目快起板级通用文件系统配置
│           └── v821-ver1
├── out                 # 编译输出
│   └── v821_linux_perf2_uart0_nor.img         # 编译输出的固件
├── platform                                   # 部分应用源码（包括mpp源码）
│   ├── allwinner
│   │   ├── eyesee-mpp                         # 提供更丰富的多媒体组件和sample
│   │   ├── multimedia
|   |   |   └── tina_multimedia
|   |   |   	└── libcedarc_mpp              # mpp 使用的编码库
│   │   └── wireless
│   └── thirdparty
├── prebuilt            # 编译工具与工具链
├── hostbuilt           # 编译使用的工具
├── kernelbuilt         # 内核编译工具链
│   └── riscv32
│       └── nds32le-linux-glibc-v5d.txz
└── rootfsbuilt         # 文件系统编译工具链
│   └── riscv
|       └── nds32le-linux-musl-v5d.tar.xz
├── rtos                # RISC-V MCU 使用的 RTOS 源码
│   ├── board           # RTOS 板级配置
│   └── v821_e907
│   │   ├── ipc                                # RTOS IPC 板级配置
│   │   ├── perf2                              # PERF2 板级配置
│   │   ├── perf2_fastboot                     # PERF2 快起板级配置
│   │   ├── perf2_fastboot_dual                # PERF2 双目快起板级配置
│   │   └── ver1
│   ├── lichee          # RTOS 源码
│   │   ├── rtos                               # RTOS 源码
│   │   ├── rtos-components                    # RTOS 组件库
│   │   └── rtos-hal                           # RTOS 驱动 HAL
│   └── tools           # 相关工具
└── tools               # 相关工具
```

### brandy

brandy目录下主要存放boot0，uboot等代码。spl目录下为boot0源码，是CPU1上可操作的第一个阶段，在快启启动流程中，他的主要任务是初始化dram,并从flash中分别读取RTOS镜像和LINUX镜像，继而在CPU1上运行RTOS，在CPU0上运行LINUX。

```text
brandy
└── brandy-2.0
    ├── build.sh -> tools/build.sh       # 超链接
    ├── spl                              # boot0仓库
    ├── tools                            # 一些工具
    └── u-boot-2018                      # u-boot 源码
```

快捷跳转命令：`cboot` `cboot0` `cspl`

### build

build目录存放Tina Linux的系统构建脚本，主要功能有：

1. 提供编译需要的环境变量、函数、规则。
2. 提供各目标模块的编译方法、规则。
3. 对接 openWrt, 不同构建系统。
4. 打包生成系统固件的脚本

快捷跳转命令：`cbuild`

### device

device目录用于存放芯片方案的配置文件，包括内核配置，env配置，分区表配置，sys_config.fex， board.dts等。

```text
device
├── config
│   ├── chips
│   ├── common
│   └── rootfs_tar
└── product -> ./config/chips/v821
```

快捷跳转命令：`cchips`, `cconfigs`

### BSP

bsp 目录用于存放内核设备树 dtsi，内核驱动，内核头文件，配置文件等

```text
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

kernel目录主要存放内核原生代码。

```text
kernel
└── linux-5.4-ansc
```

快捷跳转命令：`cbsp`

### openwrt

openwrt目录存放着openWrt原生代码，及软件包、芯片方案目录。

```text
openwrt
└── openwrt
   ├── build           # OpenWrt 构建工具
   ├── dl              # OpenWrt 软件包预下载目录
   ├── openwrt         # OpenWrt 原生源码
   ├── package         # 用户态软件包
   └── target          # 目标板级文件系统配置
        └── v821
            ├── generic                        # 通用板级配置（一般不需要修改）
            ├── Makefile                       # 编译 Makefile （一般不需要修改）
            ├── v821-common                    # v821 平台通用文件系统配置
            ├── v821-ipc                       # v821 IPC 板级通用文件系统配置
            ├── v821-perf2                     # v821 PERF2 板级通用文件系统配置
            ├── v821-perf2_fastboot            # v821 PERF2 快起板级通用文件系统配置
            ├── v821-perf2_fastboot_dual       # v821 PERF2 双目快起板级通用文件系统配置
            └── v821-ver1
```

快捷跳转命令：`cplat`

### rtos

RTOS 目录存放着 CPU1 使用的 RTOS 源码，组件，驱动，RTOS 板级配置文件

```text
rtos
    ├── board
    │   └── v821_e907
    ├── envsetup.sh -> tools/scripts/source_envsetup.sh
    ├── lichee
    │   ├── rtos
    │   ├── rtos-components
    │   └── rtos-hal
    └── tools
        ├── scripts
        └── tool
```

快捷跳转命令：`crtos`

## 快捷指令

| 命令                   | 命令有效目录   | 作用                                |
| ---------------------- | -------------- | ----------------------------------- |
| make                   | tina根目录     | 编译整个sdk                         |
| make menuconfig        | tina根目录     | 启动软件包配置界面                  |
| make kernel_menuconfig | tina根目录     | 启动内核配置界面                    |
| croot                  | tina下任意目录 | 快速切换到tina根目录                |
| cconfigs               | tina下任意目录 | 快速切换到方案的bsp配置目录         |
| cplat                  | tina下任意目录 | 快速切换到方案配置目录              |
| ctarget                | tina下任意目录 | 快速切换到openWrt软件包编译产物目录 |
| crootfs                | tina下任意目录 | 快速切换到openWrt rootfs目录        |
| copsrc                 | tina下任意目录 | 快速切换到openWrt目录               |
| cout                   | tina下任意目录 | 快速切换到方案的输出目录            |
| cboot                  | tina下任意目录 | 快速切换到bootloader目录            |
| cgrep                  | tina下任意目录 | 在c／c++／h文件中查找字符串         |
| mm [-B]                | 软件包目录     | 编译软件包，-B指编译前先clean       |
| mmo [-B] pkg           | tina下任意目录 | 编译指定的软件包，-B指编译前先clean |
| pack                   | tina根目录     | 打包固件                            |
| m                      | tina下任意目录 | make的快捷命令，编译整个sdk         |
| p                      | tina下任意目录 | pack的快捷命令，打包固件            |