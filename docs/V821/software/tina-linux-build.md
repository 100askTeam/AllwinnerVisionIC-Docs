---
sidebar_position: 6
---

# SDK 固件编译

本章节主要介绍获取V821 SDK后，如何编译SDK，以及编译SDK中的单个组件。

## SDK 整体编译

### 检查SDK文件

下载完成后的 SDK 应有如下文件，可以使用 `ls` 或者 `tree -L 1` 命令检查

```
.
├── brandy
├── bsp
├── build
├── build.sh -> build/top_build.sh
├── device
├── kernel
├── openwrt
├── platform
├── prebuilt
├── rtos
└── tools

10 directories, 1 file
```

![image-20241121101633861](images/image-20241121101633861-ba8effa921d3bf3beecd14de30bfb7d6.png)

### 初始化环境

使用命令 `source build/envsetup.sh` 初始化SDK编译环境，初始化后便可以使用快捷指令与SDK相关指令。

![image-20241121101757735](images/image-20241121101757735-706dd82a23ebc924e42865f049d70860.png)

### 选择方案

首先需要明确方案与开发板的关系：

| 开发板名称 | 丝印名称 | 方案 | 方案描述 |
| --- | --- | --- | --- |
| [全志 PERF2B 开发板](https://docs.aw-ol.com/docs/soc/v821/hardware/development-board/perf2b) | V821M2-WXX\_PER2\_B\_4L | v821-perf2b-tina | PERF2B 开发板配套板级，支持验证多目输入，支持 PMC，支持低功耗，电池，带屏方案 |
| [全志 PERF2B 开发板](https://docs.aw-ol.com/docs/soc/v821/hardware/development-board/perf2b) | V821M2-WXX\_PER2\_B\_4L | v821-perf2b\_fastboot-tina | PERF2B 开发板配套**快起**板级，支持多目输入，支持 PMC，支持低功耗，电池，带屏方案 |
| [全志 PERF2 开发板](https://docs.aw-ol.com/docs/soc/v821/hardware/development-board/perf2) | V821M2-WXX\_PER2\_4L | v821-perf2-tina | PERF2 开发板配套板级，支持验证多目输入 |
| [全志 PERF2 开发板](https://docs.aw-ol.com/docs/soc/v821/hardware/development-board/perf2) | V821M2-WXX\_PER2\_4L | v821-perf2\_fastboot-tina | PERF2 开发板配套**快起**板级，支持多目输入验证 |
| [全志 IPC 原型机开发板](https://docs.aw-ol.com/docs/soc/v821/hardware/development-board/ipc_monocular) | V821M2-WXX\_PRO\_MONOCULAR\_IPC\_2L | v821-ipc-tina | IPC 板级配套最小化配置板级方案，支持 8M Flash，原型机配置 |
| [百问网 AvaotaF1 核心板](https://docs.aw-ol.com/docs/soc/v821/hardware/development-board/100ask_avaotaf1) | Avaota F1 | v821-100ask\_avaota\_f1-tina | 适配 100ASK Avaota F1 的方案板级，常电方案，基于 PERF2 板级差异化适配 |

:::tip

:::note

开发板名称请查看开发板 PCB 上的丝印确认

:::

:::
:::danger

:::note

v821-perf2-tina 和 v821-perf2b-tina 是两块完全不同的硬件型号，其供电配置完全不同，请选择你实际使用的板卡开发，以防选错无法启动烧录！

:::

:::

-   SDK 1.3
-   SDK 1.0~SDK 1.2

使用命令 `lunch` 选择编译的方案，这里以选择 `v821-perf2-tina` 为例，选择 7

![image-20251124140044342](images/image-20251124140044342-019748d00b744af93ea381e723356e98.png)

选择需要开发的板级后需要选择芯片，请根据芯片丝印型号选择，上面的所有板级都 P2P 支持以下芯片：

![image-20251124140126761](data:image/png;base64,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)

选择芯片后需要选择编译的波特率，提供 115200 和 1500000 两个波特率，更高的波特率可以减少 CPU 打印时间占用，增加性能

![image-20251124140252504](data:image/png;base64,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)

使用命令 `lunch` 选择编译的方案，这里以选择 `v821-perf2-tina` 为例，选择 4

![image-20241121101927912](images/image-20241121101927912-0f9f5cf678dc94ef00aa0ed0aaea06fc.png)

### 阅读免责声明

如果是一次下载使用SDK，`lunch` 选择方案后，需要等待8s来阅读免责声明，并按提示输入Y并回车确认接受免责声明。输入之后这份SDK，再做其他操作不会再有这个等待和提示。

![image-20241121102029771](images/image-20241121102029771-4fc1a4fc72ebd2fe7c6b1559fd9b55c9.png)

### 等待初始化环境

确认后需要等待 SDK 解压工具链，初始化开发环境

![image-20241121102242572](images/image-20241121102242572-f4dcea642f4e0fd9248415424a970431.png)

#### 演示

Loading asciinema cast...

### 完整编译SDK

使用命令 `m` 或 `make` 完整编译 SDK，也可以使用快捷命令 `mp` 执行编译和打包的动作。可以使用 `m -jN` 参数N为并行编译进程数量，依赖编译服务器CPU核心数，如 4 核PC，可 `m -j4`

![image-20241121102354528](images/image-20241121102354528-9e7002ae9464adadff69edc59ce5f8ca.png)

### 打包固件

SDK 编译完成，需要使用`pack`命令打包固件，其会在`out`目录下输出固件

![image-20241121112712423](images/image-20241121112712423-2bc245e9be21f5c8c69382319a4c9a65.png)

可以在 SDK 目录中的 `out` 文件夹找到

![image-20241121113202600](images/image-20241121113202600-64585cb6982cb29bb0a0df7d8954a707.png)

## SDK 组件单独编译

在开发过程中，会需要单独编译某一模块，但是完整编译太慢效率较低，这时可以使用单编命令。

| 命令 | 作用 | 作用范围 |
| --- | --- | --- |
| mboot | 编译boot0和uboot | boot0和uboot |
| mboot0 | 编译boot0 | boot0 |
| muboot | 编译uboot | uboot，uboot设备树 |
| mkernel | 编译内核 | 内核，设备树 |
| mrtos | 编译rtos镜像 | rtos镜像 |
| mkmpp | 编译eyesee-mpp-middleware | eyesee-mpp-middleware |
| cleanmpp | 清除eyesee-mpp-middleware的编译 | eyesee-mpp-middleware |

### 编译内核与内核设备树

使用命令 `mkernel` 可以单独编译内核与设备树，之后可以用 `p` 命令打包固件，编译后的 Kernel 固件会自动拷贝到 `out` 目录下 `out/kernel/build` 中

```
mkernel
```

![image-20241121113704394](images/image-20241121113704394-7b316c0ffdafc54fcf3b84ffa09ddbbf.png)

### 编译 RTOS

RTOS 可以使用 `mrtos` 编译，编译完成后使用 `pack` 打包，编译后的 RTOS 固件会自动拷贝到 `device` 目录下对应板级配置中。例如这里使用的 `v821-perf2` 板，会拷贝到 `device/config/chips/v821/configs/perf2/bin/amp_rv0.bin`

![image-20241121131758433](images/image-20241121131758433-be48cb0e1eb1ac6dc455b99c563dd368.png)

### 清理 RTOS 编译

可以使用 `mrtos clean` 命令清除上一次的 RTOS 编译产物。

![image-20241121133001013](images/image-20241121133001013-86a1ede2ebe6d4edfdbf1817956b9948.png)

### 编译 U-Boot 与 U-Boot 设备树

U-Boot 可以使用`muboot`目录编译，编译前会自动执行 `clean` 清除之前的编译产物。编译完成后使用 `pack` 打包，输出的 U-Boot 文件会自动拷贝到 `device` 目录下对应板级配置中。例如这里使用的 `v821-perf2` 板，会拷贝到 `device/config/chips/v821/configs/perf2/bin`

```
muboot
```

![image-20241121113807877](images/image-20241121113807877-8a817a91a1675033c802e1070257d8ba.png)

### 编译 SPL

SPL 可以用 `mboot0` 来编译，编译前会自动执行 `clean` 清除之前的编译产物。编译完成后使用 `pack` 打包，输出的 boot0 文件会自动拷贝到 `device` 目录下对应板级配置中。例如这里使用的 `v821-perf2` 板，会拷贝到 `device/config/chips/v821/configs/perf2/bin`

![image-20241121132019013](images/image-20241121132019013-42ec643d929f36d5bffede700329fdca.png)

### 编译 U-Boot和SPL

可以使用命令 `mboot` 同时编译 `U-boot` 和 SPL，编译前会自动执行 `clean` 清除之前的编译产物。该命令会先编译 U-Boot 然后再编译 SPL

![image-20241121132225318](images/image-20241121132225318-6b3004f8b1b6e57dae8b97df91cb4056.png)

### 编译 MPP

可以使用 `mkmpp` 命令单独编译 mpp，请注意编译前需要在 `menuconfig` 中配置需要编译的软件包

![image-20241121133134042](images/image-20241121133134042-62a10e9f6b35ca4fdbc049e4a3eb50b0.png)

### 清除 MPP 编译

使用 `cleanmpp` 命令清除 MPP 编译产物

![image-20241121133734468](images/image-20241121133734468-b2ced29700b0295f11bf931c1ba6f163.png)

### 单独编译某一软件包

SDK 支持单独编译某一软件包，方便加速开发，这里以 `mtd-utils` 为例，介绍单独编译某一软件包的方法

**以 Package 方式编译**

```
make openwrt_rootfs package/mtd-utils/compile
make openwrt_rootfs package/mtd-utils/clean
```

-   `package` 是指在 `openwrt/openwrt/package`, 和 `openwrt/package` 目录下搜索该软件包。 `tools` 是指在 `openwrt/openwrt/tools` 下搜索
-   `mtd-utils` 是定义软件包的 Makefile 所在目录的目录名，编译其他软件包时，替换该字段即可
-   `compile` 换成 `clean` 是清理软件包编译文件

![image-20241122145226535](images/image-20241122145226535-5338f364f829d94c5e6852cafd391801.png)

**以路径方式编译**

也可以使用软件包 `Makefile` 所在目录相对于`openwrt`原生代码根目录的相对路径来直接指定编译软件包

-   `mtd-utils` 软件包位置：`openwrt/openwrt/package/utils/mtd-utils`

编译指令：

```
make openwrt_rootfs package/utils/mtd-utils/compile
make openwrt_rootfs package/utils/mtd-utils/clean
```

![image-20241122145355482](images/image-20241122145355482-0465a741aa7d692a02d6f303ad58a4c8.png)

SDK为了区分openwrt原生代码与新增代码，软件包的 `Makefile` 放在 `openwrt/package/` 目录下，但编译时需嵌入到 `openwrt` 原生代码的标准路径，SDK 使用了软链接方式，将其软链接到 `openwrt/openwrt/package/subpackage`。这里以 `eyesee-mpp-middleware`包为例：

-   实际位置：`openwrt/package/allwinner/eyesee-mpp/middleware`
    
-   软链接之后的位置：`openwrt/openwrt/package/subpackage/allwinner/eyesee-mpp/middleware`
    

编译指令：

```
make openwrt_rootfs package/subpackage/allwinner/eyesee-mpp/middleware/compile
make openwrt_rootfs package/subpackage/allwinner/eyesee-mpp/middleware/clean
```

![image-20241122145514473](images/image-20241122145514473-cffb0b68d472559f3c2dc11216d7b0ca.png)

**以快捷指令方式编译**

SDK 提供一个快捷指令：`mmo` 只需要在 `mmo` 指令后面跟上需要编译的软件包名即可编译

```
mmo mtd-utils
```

![image-20241122150151448](images/image-20241122150151448-077fc70e858bdca5dfcb7966ed3ed43c.png)

如果需要清理上一次编译产物，重新编译，则使用 `mmo -B` 命令

```
mmo mtd-utils -B
```

![image-20241122150300081](images/image-20241122150300081-a339a7dc5a15b5fa0a4fcdff915d000f.png)

**前往文件夹下编译**

SDK 也支持在文件夹下编译软件包，例如 `mtd-utils` 位于 `package/utils/mtd-utils`，可以前往文件夹单独编译这个软件包

编译指令：

```
cd openwrt/openwrt/package/utils/mtd-utils
mm # 编译软件包、
mm -B # 先 clean 后重新编译软件包
```

![image-20241122152438273](images/image-20241122152438273-fbae99c927184a4f75f61d423a76838d.png)

## SDK 快捷命令

SDK 提供了一系列方便开发的快速跳转指令，在开发过程中可以使用这些指令快速跳转目录，执行操作。

| **命令** | **命令有效目录** | **作用** |
| --- | --- | --- |
| make | tina根目录 | 编译整个sdk |
| pack | tina根目录 | 打包固件 |
| m | tina下任意目录 | make的快捷命令，编译整个sdk |
| p | tina下任意目录 | pack的快捷命令，打包固件 |
| m menuconfig | tina下任意目录 | 任意目录启动软件包配置界面 |
| m kernel\_menuconfig | tina下任意目录 | 任意目录启动内核配置界面 |
| mrtos menuconfig | tina下任意目录 | 任意目录启动内核配置界面 |
| croot | tina下任意目录 | 快速切换到tina根目录 |
| cconfigs | tina下任意目录 | 快速切换到方案的bsp配置目录 |
| cplat | tina下任意目录 | 快速切换到tina方案配置目录 |
| cout | tina下任意目录 | 快速切换到方案的输出目录 |
| cboot0 | tina下任意目录 | 快速切换到boot0源码目录 |
| cboot | tina下任意目录 | 快速切换到uboot源码目录 |
| ckernel | tina下任意目录 | 快速切换到linux源码目录 |
| cbsp | tina下任意目录 | 快速切换到bsp驱动源码目录 |
| crtos | tina下任意目录 | 快速切换到rtos源码目录 |
| cgrep | tina下任意目录 | 在c/c++/h文件中查找字符串 |
| mm \[-B\] | 软件包目录 | 编译软件包，-B指编译前先clean |
| cmpp\_s | tina下任意目录 | 快速切换到mpp middleware源码目录 |
| cmpp\_p | tina下任意目录 | 快速切换到mpp middleware配置目录 |
| clibcedarc\_s | tina下任意目录 | 快速切换到libcedarc软件包目录 |
| clibcedarc\_p | tina下任意目录 | 快速切换到libcedarc配置目录 |
| crtmedia\_s | tina下任意目录 | 快速切换到rt-media源码目录 |
| crtmedia\_p | tina下任意目录 | 快速切换到rt-media配置目录 |
