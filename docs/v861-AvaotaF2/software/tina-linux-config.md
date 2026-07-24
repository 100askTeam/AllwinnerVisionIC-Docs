---
sidebar_position: 9
---

# SDK 功能配置

本章节将介绍 Tina Linux 系统中配置文件及其配置方法。这里以 V861 BGA\_PERF1 为例，演示基础的方案配置方法，对于其他方案请对应其文件路径。

## Kconfig 管理配置

SDK 采用 Kconfig 机制对 SDK 和内核进行配置。

Kconfig 是一种固定格式的配置文件。Linux 编译环境中的 menuconfig 程序可以识别这种格式的配置文件，并提取出有效信息生成可视化的配置菜单。

SDK 包含多个 menuconfig，包括对内核进行管理和配置的 `kernel_menuconfig`，对软件包进行管理和配置的 `Tina menuconfig`，对 RTOS 进行配置的 `Tina-RT menuconfig`。

### kernel menuconfig

在 `Tina Linux` 的配置环境中配置好环境变量进入可编译状态后，输入

```
make kernel_menuconfig
```

即可进入 `kernel menuconfig` 配置菜单。

![image-20260122114344547](images/image-20260122114344547-52ddc62de51aa6c9e1d1db6b99e1127e.png)

配置菜单源文件为：

```
device/config/chips/v861/configs/bga_perf1/linux-6.6-xuantie/bsp_defconfig
```

输出 `cconfig` 可快速转跳到该目录。

### Tina menuconfig

在 `Tina Linux` 的配置环境中配置好环境变量进入可编译状态后，输入

```
make menuconfig
```

即可进入Tina menuconfig配置菜单。

![image-20260122114417374](images/image-20260122114417374-8c8dd7bc4b78af994d65d871975f4563.png)

配置菜单源文件为：

```
openwrt/target/v861/v861-bga_perf1/defconfig
```

输出 `cplat` 可快速转跳到该目录。

### RTOS menuconfig

在 `Tina Linux` 的配置环境中配置好环境变量进入可编译状态后，输入

```
mrtos menuconfig
```

即可进入 `rtos menuconfig` 配置菜单。

![image-20260122114432613](images/image-20260122114432613-7324a867dd7f7810bbad0d17b3aaffae.png)

配置菜单源文件为：

```
rtos/lichee/rtos/projects/v861_e907/bga_perf1/defconfig
```

输出 `cplat` 可快速转跳到该目录。

### Kconfig 配置方法

这里以 `kernel menuconfig` 作为例子，讲解如何使用、配置各选项，并以配置 Wi-Fi，蓝牙驱动为例说明 Kconfig 基础配置方法。

首先我们进入 `kernel menuconfig`

```
make kernel_menuconfig
```

这里就是 `kernel menuconfig` 的主目录。其具体的操作方法如下图所示。

![image-20220711114825681](images/image-20220711105637061-6d564cc7110bef4941d0fb682790ebb6.png)

我们再进入较为常用的 `Device Driver` ，看一下各个符号的含义。

![image-20220711115616754](images/image-20220711115616754-75645f5d3d676d7624130ccdd27ea295.png)

其中，可以使用 `空格键` 选中各个选项，这里以 `Multimedia support` 选项为例：

![image-20220711120726186](images/image-20220711120726186-3a1a44b8ee2b077cc40746bc1857e68b.png)

也可以使用 `Y` `M` `N` 键来修改选项：

![image-20220711120802522](images/image-20220711120802522-dfd1cc5cfe018e0d58cc3611d1b6568c.png)

遇到被其他依赖选择的选项，可以查看 Help 页面检查被什么选项所依赖。

![image-20220711125703598](images/image-20220711121418636-10944c054f21d673e5dd1d833b08a279.png)

进入 Help 页面后，便可以查看这个选项的依赖情况。需要注意的是，有些选项是作为底层依赖无法随意取消，例如这里示例的 `Hardware Monitoring support` 选项。

![image-20220711125333193](images/image-20220711125333193-1db00c10a11a8eebd762bab5c544fae2.png)

Kconfig 所创建的界面还有一个功能，就是搜索功能，方便快速的找到目标选项。这里以搜索 LCD 屏幕 `icn6202` 驱动为例。

在 Kconfig 的界面中按 `/` 键，进入搜索页面。

![image-20220711130647390](images/image-20220711130647390-cad4854095bdc5e38b30b6b26bdeab73.png)

## Device Tree

Device Tree（设备树）是标准Linux下定义的一种硬件板级描述机制，通过.dts文件，对硬件进行配置。

### .dts文件

Tina Linux 下有三份.dts文件，分别位于BSP仓库和方案目录下。包括如下三份设备树

-   内核设备树：用于描述SoC的系统资源，外设，寄存器配置。
-   方案设备树：用于描述具体的引脚配置，外设功能，Sensor配置等。
-   U-Boot 设备树：用于描述方案 Uboot 的相关参数，flash map 等功能。

内核dts文件路径：

```
bsp/configs/linux-6.6-xuantie/sun252iw1p1.dtsi
```

方案dts文件路径：

```
device/config/chips/v861/configs/bga_perf1/linux-6.6-xuantie/board.dts
```

U-Boot 设备树路径：

```
device/config/chips/v861/configs/bga_perf1/uboot-board.dts
```

方案dts优先级高于内核dts方案，遇到冲突时方案dts的内容会覆盖内核dts中的配置。

方案开发时一般建议只修改方案目录下的dts文件 `board.dts` ，以免影响其它方案。

## 分区表

在全志平台中，通过 `sys_partition.fex` 文件配置分区。分区表包括两份，针对 SPI NOR 设备使用 `sys_partition_nor.fex` 针对非 SPI NOR 设备（例如SPI NAND，eMMC）使用 `sys_partition.fex`

分区配置文件路径：

```
device/config/chips/v861/configs/bga_perf1/sys_partition_nor.fex
device/config/chips/v861/configs/bga_perf1/sys_partition.fex
```

### 配置格式示例

以rootfs分区为例：

```
[partition]
    name            = rootfs
    size            = 20480
    downloadfile    = "rootfs.fex"
    user_type        = 0x8000
```

每个分区以 **\[partition\]** 标识，分区属性及其意义如下表。

| 属性 | 含义 | 必选 | 备注 |
| --- | --- | --- | --- |
| name | 分区名 | Y |  |
| size | 分区大小 | Y | 单位:扇区(512B), |
| downloadfile | 分区烧入的镜像文件 | N | 注2 |
| verify | 量产后校验标识 | N | (默认)1:使能; 0:禁用 |
| user\_type | 分区属性 | N | 注4 |
| keydata | 量产时是否擦除本分区 | N | 0x8000：使能; 其他无效 |

1.  最后一个分区(UDISK)，不设置 size，表示分配所有剩余空间。
2.  downloadfile 支持绝对路径和相对路径，相对于`tina/out/<方案名>/image`。
3.  verify决定是否校验 downloadfile 中指定的镜像，若为ext4稀疏镜像，务必禁用。
4.  历史遗留，目前只对UBI方案有效。`bit0`为1时，表示创建**静态卷**，反之为**动态卷**。

**\[partition\] **标识用户空间的逻辑分区，在 UBI 方案中，表现为 UBI卷。此外，在`sys_partiton.fex`中存在特殊的配置**MBR**，用于配置MBR空间大小，此配置在UBI方案中无效。例如：

```
[mbr]
size = 2048
```

MBR 分区以 **Kbyte** 为单位，对用户不可见，属于隐藏空间，其大小也必须满足对齐原则。

### 分区大小与对齐

分区大小的对齐要求与不同介质(nor/nand/mmc)、不同存储方案相关。不按对齐要求配置，可能出现文件系统异常，分区边界数据丢失等现象。对齐规则如下表。

| 介质 | 对齐大小 | 备注 |
| --- | --- | --- |
| nor | 64K | 对齐物理擦除块大小，注1 |
| (nftl) spinand | 驱动超级块大小 | 注2 |
| (ubi) spinand | 2 × 物理块 - 2 × 页 | 注3 |
| rawnand | 驱动超级块大小 | 与物料相关，16M对齐可基本兼容 |
| emmc | 16M | 与物料相关，16M对齐可基本兼容 |

-   SPI NOR 的擦除块常见为 **64K**，即在 `sys_partition_nor.fex` 中分区size进行 **128** 对齐。在 id 表配置为4K擦除且使能内核`CONFIG_MTD_SPI_NOR_USE_4K_SECTORS` 时，也可使用4K对齐。推荐使用默认64K对齐。
-   在常见的128M SPI Nand中，为 **256K** 对齐，即在sys\_partition.fex中分区size进行512对齐。需要和逻辑擦除块（super block）对齐，1个super block包含两个物理擦除块，常见的物理擦除块128K，1个逻辑的超级块为256K，但是需要使用每个物理块的第一个page（2K）来作为ubi所需的信息头部，所以实际的为（256k-2\*2k），为 **252K** 对齐，即在sys\_partition.fex中分区size进行504对齐。

更多配置信息请参考《Tina\_Linux\_存储\_开发指南》

## env.cfg

env用于配置一些系统级参数，如启动等待时间、内核会用到的环境变量、系统加载状态、串口及打印等级、安全校验参数等。请注意快起系统不使用这部分参数。

芯片默认env配置文件路径，如果板级文件夹内没有 `env.cfg` 则用的是这一份：

```
device/config/chips/v861/configs/default/env.cfg
```

具体方案env配置文件路径：

```
device/config/chips/v861/configs/bga_perf1/env.cfg
```

具体方案的配置文件优先级大于芯片默认配置文件。

## sys\_config.fex

sys\_config 是全志平台定义的一种GPIO配置的方法。适用于 BOOT0 环境，包括配置 DRAM 参数，BOOT0 使用的 PIN，储存介质等信息。一般不需要修改

配置文件路径为：

```
device/config/chips/v861/configs/bga_perf1/sys_config.fex
```

GPIO配置格式：

```
 Port:端口+组内序号<功能分配><内部电阻状态><驱动能力><输出电平状态>
```

sys\_config.fex 的配置优先级高于 u-boot 设备树的优先级，当配置冲突时会以 sys\_config.fex 配置为准。

### 配置 BOOT0 串口

这里以BOOT0 串口使用PD22，PD23的UART0作为示例。配置如下

```
[uart_para]
uart_debug_port = 0
uart_debug_tx   = port:PD22<3><1><default><default>
uart_debug_rx   = port:PD23<3><1><default><default>
```

### 关闭/开启BOOT0日志打印

配置 sys\_config.fex 中的 `debug_mode` 项，0为关闭打印，8为打开全部打印。

```
[platform]
debug_mode = 0
```

![image-20241118150805894](data:image/png;base64,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)

## 文件系统

**只读根文件系统**

SDK提供squashfs和erofs两种只读的fs作为根文件系统，默认使用squashfs。切换erofs方法如下：

```
m menuconfig
CONFIG_TARGET_ROOTFS_EROFS=y
TARGET_ROOTFS_SQUASHFS is not set    ---------取消勾选

m kernel_menuconfig
CONFIG_EROFS_FS=y
```

**可读写文件系统**

Tina默认会在根文件系统上再挂载一个可读写的文件系统作为overlay。sys\_partition\_(nor).fex分区表中默认提供rootfs\_data分区，rootfs\_data会在启动后挂载可读写文件系统，emmc方案会挂载ext4、spinor方案会挂载jffs2。以spinor为例，overlayfs的lowerdir是squashfs（rootfs分区），upperdir是jffs2(rootfs\_data)。用户可以在/overlay/upper/路径下看到写入的文件，可读写的空间跟rootfs\_data挂钩，可以增大rootfs\_data的分区size来增大根文件系统的可读写空间。

**注：快启SDK默认开机会运行demo将码流存到/mnt/extsd目录，这个目录是SD卡的挂载目录，在SD卡没有挂载情况下，此时的/mnt/extsd是overlay，会直接将码流写到SPI NOR上，在rootfs\_data过小情况下，会直接将overlay写满**。

**文件系统静态制作**

很多用户不需要整个根文件系统可写，需要自定义某个文件路径可写。那么可以在PC静态制作好文件系统，再通过设备端mount到指定路径即可。

```
[1]
out/host/bin/mkfs.jffs2 -p 0x80000 -e 0x10000  -X rtime -x zlib -x lzma -d  ./filesystem  -o  ./filesystem.fex
-p: 指定目标分区大小
-e: 指定block大小，当前是0x10000 64KB
-X: 指定压缩方式
-x: 指定不使用的压缩方式
-d: 想要制作成文件系统镜像的文件夹
-o: 输出的文件系统镜像
将制作好的filesystem.fex拷贝至device/config/chips/vxxx/configs/fastboot/linux路径下

[2]
sys_partition_nor.fex和board.dts中新增分区，存放目标镜像
[partition]
    name         = filesystem
    size         = 1024
    downloadfile = "filesystem.fex"
    user_type    = 0x8000

[3]
设备端完成烧录启动后，会增加一个/dev/by-name/filesystem分区，使用mount命令挂载"mount -t jffs2 /dev/by-name/filesystem /目标路径"即可。也可将mount操作加到启动脚本中使其自动挂载。
```
