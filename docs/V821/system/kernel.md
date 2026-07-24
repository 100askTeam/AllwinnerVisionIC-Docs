---
sidebar_position: 9
---

# KERNEL - 内核使用

本章节主要介绍 Linux 内核的配置使用。

## 目录结构

`V821 kernel` 相关目录主要包含三个部分：

-   `kernel/linux-5.4-ansc` 目录。该目录下主要存放的是 Linux 主线原生内核代码。
-   `bsp` 目录。该目录下存放 AW SoC 相关的驱动源码。
-   `device/config/chips/v821/configs` 目录。存放芯片板级内核 `defconfig` 以及 `dtsi` 配置。

kernel 相关目录结构如下所示。

```
bsp
├── configs
│   └── linux-5.4-ansc     # 芯片SoC级公共设备树文件dtsi
├── drivers                # AW驱动源码(gpu、nand等模块除外)
│   ├── amp_timestamp
│   ├── andes_adaptor
│   ├── ...
│   └── wupio
├── include                # AW驱动对外导出的，或需要暴露给其他模块使用的头文件
│   ├── boot_param.h
│   ├── ...
│   └── video
├── modules                # AW nand和gpu驱动
├── platform               # AW SoC相关配置
└── ramfs                  # ramfs内存文件系统
device/config/chips/v821/
└── configs                # 芯片板级内核defconfig以及dtsi配置
kernel/
└── linux-5.4-ansc         # linux原生内核代码
    ├── arch
    ├── block
    ├── bsp -> ../../bsp   # 指向bsp目录
    ├── ...
    └── virt
```

## 编译使用

### 内核相关快捷命令

V821 SDK支持 openwrt 构建系统，在执行 source 与 lunch 操作后，可执行如下与内核相关的快捷命令：

| 命令 | 命令说明 |
| --- | --- |
| make | 编译整个SDK，包括内核 |
| mkernel | 编译内核 |
| make kernel\_menuconfig | 配置内核 |
| ckernel | 跳转到linux kernel目录 |
| ckernelout | 跳转到linux kernel编译输出目录 |
| cbsp | 跳转到bsp目录 |
| cdts | 跳转到SoC级公共dts目录 |

### 内核编译

执行make或者mkernel之后，会对内核镜像进行编译，编译过程主要分为如下几个部分：

-   编译builtin内核源码
-   编译内核模块
-   编译dts
-   生成boot.img

编译过程以及最终生成物分别位于`out/kernel/build`与`out/kernel/staging`下。

## 配置说明

### defconfig配置

在`device/config/chips/${SOC}/configs/${BOARD}/boardconfig.mk`中指定内核版本以及内核使用的defconfig文件名称。相关字段说明如下：

```c
LICHEE_KERN_VER:=5.4-ansc                               // 内核版本，无需修改
LICHEE_USE_INDEPENDENT_BSP=true                         // 内核版本，无需修改
LICHEE_KERN_DEFCONF:=bsp_defconfig                      // kernel defconfig名称，按实际修改即可
LICHEE_KERN_DEFCONF_RECOVERY:=bsp_recovery_defconfig    // kernel recovery defconfig名称，OTA功能使用，按实际修改即可
```

为满足不同 SoC、不同板子等场景下的 defconfig 个性化适配需求，支持在以下三个目录里存放 defconfig 文件:

-   板级配置：`device/config/chips/${SOC}/configs/${BOARD}/${KERN_VER}/xx_defconfig`
    
-   SoC级配置：`device/config/chips/${SOC}/configs/default/${KERN_VER}/xx_defconfig`
    
-   公共配置：`bsp/configs/${KERN_VER}/xx_defconfig`
    

若三个目录存在相同名称的defconfig文件，则默认使用优先级为：板级配置 > SoC级配置 > 公共配置。

### 设备树dts配置

Device Tree 是一种描述硬件信息的数据结构，它表现为一棵由电路板上 CPU、总线、设备组成的树，Device Tree 由一系列被命名的结点 (node) 和属性 (property) 组成，而结点本身可以包含子结点。dts 文件是 ASCII 文本格式文件的 Device Tree 描述。

内核的dts由两部分组成：

-   `bsp/configs/linux-${KERN_VER}`目录下的dtsi文件，这里是芯片SoC级公共设备树文件。
-   `device/config/chips/${SOC}/configs/${BOARD}/${KERN_VER}/board.dts`文件，这是板级设备树文件。

`board.dts` 板级文件中会include芯片SoC级功能设备树文件。

## 常用功能

### 修改内核配置

推荐在根目录执行make kernel\_menuconfig命令来通过图形化方式修改内核配置，执行完成后，将启动一个基于文本的菜单系统，在菜单最上面有一些操作说明如下：

```c
Arrow keys navigate the menu.  <Enter> selects submenus ---> (or empty submenus ----).  Highlighted letters are hotkeys.  Pressing <Y> includes, <N> excludes, <M> modularizes features.  Press <Esc><Esc> to exit, <?> for Help, </> for Search.  Legend: [*] built-in  [ ] excluded  <M> module  < > module capable
```

配置上常用的操作有Y、N、M键操作：

-   Y，表示启用功能，将相应的功能编译进内核镜像
-   N，表示不启用功能
-   M，表示启用功能，将该功能编译为一个模块（.ko文件），可以在后续用户空间中根据需要加载。

配置完成后，保存退出。

可按照如下两种操作，来确认内核配置改动是否生效：

-   检查out/kernel/build/.config文件中是否包含对应改动。
-   按照上述“defconfig配置”章节中的说明，检查对应的defconfig文件中是否有包含对应改动。

根据配置的改动不同，可以采用如下方式快速编译打包固件，无需完整编译。

-   如果修改配置Y与N，可执行mkernel编译内核后，直接打包固件。
    
-   如果修改了M选项，需执行make进行完整编译后，再进行打包固件。
    

### 修改dts配置

内核的dts由两部分组成：

-   `bsp/configs/linux-${KERN_VER}`目录下的dtsi文件，这里是芯片SoC级公共设备树文件。
-   `device/config/chips/${SOC}/configs/${BOARD}/${KERN_VER}/board.dts`文件，这是板级设备树文件。

通常情况下，不修改芯片SoC级公共设备树文件，而是对板级设备树文件进行修改。

修改完设备树后，需执行mkernel对dts进行编译，编译过程中主要会生成如下几个文件/目录，编译完成后可直接打包固件。

-   `out/$(SOC)/kernel/staging/dts_dep`目录，编译最终dtb所依赖的文件，可检查该目录下`.sunxi.dtb.dts.tmp`文件是否包含对应改动。
-   `out/$(SOC)/kernel/staging/sunxi.dtb`文件，编译dts文件生成的dtb文件。
-   `out/$(SOC)/$(BOARD)/openwrt/sunxi.dtb`文件，由 `out/$(SOC)/kernel/staging/sunxi.dtb` 复制而来，打包固件需要该文件。

### 新增驱动

以下均以 `moduleX` 作为示例，演示在bsp仓库里添加一个新驱动的方法。

#### 添加驱动源码

-   在`bsp/drivers`目录下，新建moduleX目录：

```shell
bsp/drivers/.
        ├── moduleX
```

-   `bsp/drivers/Makefile`文件内添加模块moduleX的编译规则：

```c
obj-y += moduleX/
```

-   `bsp/drivers/Kconfig`文件内模块moduleX Kconfig规则：

```c
source "$(BSP_TOP)drivers/moduleX/Kconfig"
```

-   在moduleX目录下添加相应的.c、.h、Makefile和Kconfig文件

```shell
bsp/drivers/moduleX.
.
├── Kconfig
├── Makefile
├── moduleX.c
└── moduleX.h
```

#### 添加驱动设备树

-   添加 `moduleX` 对应 `dtsi` 配置，位置为`sdk/bsp/configs/${KERNEL_VER}/xx.dtsi`，：

```shell
moduleX: moduleX@xxxx {
        compatible = "allwinner,moduleX";
        reg = <0x0 xxxx 0x0 xxx>;
        interrupts = xxx;
        ...
};
```

-   在devices目录添加moduleX对应板级配置，位置为`sdk/device/config/chips/${SOC}/configs/${BOARD}/${KERNEL_VER}/board.dts`;

```shell
&moduleX {
    xxx;
    ...
};
```

#### 新增驱动配置及编译

执行 `make kernel_menuconfig` 命令对模块进行配置，然后执行 `mkernel` 命令对新增的模块进行编译。

### 修改 ko

#### ko 文件编译及复制说明

V821 Tina5.0环境下，当执行`make kernel_menuconfig`将内核功能配置为M模式，在编译内核时对应功能模块将会被编译成ko文件。 此外还需要执行`make menuconfig`选中对应的kmod配置项后，执行`make openwrt_rootfs`重新编译rootfs，才会拷贝相关ko文件到rootfs中。

rootfs中kmod配置文件说明如下：

-   `openwrt/target/$(SOC)/$(SOC)-common/modules.mk`。板级通用模块配置文件，如果是多个板级通用，可以将配置放在这里。
-   `openwrt/target/$(SOC)/$(SOC)-$(BOARD)/modules.mk`。特定板级模块配置文件，存放特定板级的模块配置信息。

如下以 `vin-v4l2` 模块为例说明相关配置项。

```c
# 定义一个vin-v4l2名称的模块，对应CONFIG_PACKAGE_kmod-vin-v4l2宏，通过make menuconfig可以开启/关闭该宏
define KernelPackage/vin-v4l2
        # SUBMENU表示menuconfig中子菜单的名字，这里$(VIDEO_MENU)是“Video Support”
        SUBMENU:=$(VIDEO_MENU)
        # TITLE表示该选项的title，会在menuconfig选项中显示对应的字符串。
        TITLE:=Video input support (staging)
        # 是否依赖相关配置
        DEPENDS:=
        # FILES表示ko文件路径来源，编译openwr rootfs时会从这些路径复制ko文件到rootfs中
        FILES+=$(CONFIG_EXTERNAL_KERNEL_TREE)/drivers/media/common/videobuf2/videobuf2-common.ko
        FILES+=$(CONFIG_EXTERNAL_KERNEL_TREE)/drivers/media/common/videobuf2/videobuf2-memops.ko
        FILES+=$(CONFIG_EXTERNAL_KERNEL_TREE)/drivers/media/common/videobuf2/videobuf2-dma-contig.ko
        FILES+=$(CONFIG_EXTERNAL_KERNEL_TREE)/drivers/media/common/videobuf2/videobuf2-v4l2.ko
        FILES+=$(CONFIG_EXTERNAL_KERNEL_TREE)/bsp/drivers/vin/vin_io.ko
        FILES+=$(CONFIG_EXTERNAL_KERNEL_TREE)/bsp/drivers/vin/modules/sensor/gc1084_mipi.ko
        FILES+=$(CONFIG_EXTERNAL_KERNEL_TREE)/bsp/drivers/vin/vin_v4l2.ko
        # 指定rootfs init程序启动过程中自动加载哪些ko文件
        AUTOLOAD:=$(call AutoProbe,videobuf2-common videobuf2-memops videobuf2-dma-contig videobuf2-v4l2 vin_io gc1084_mipi vin_v4l2)
endef

# vin-v4l2模块的描述信息
define KernelPackage/vin-v4l2/description
        Kernel modules for video input support
endef

# 定义vin-v4l2内核模块包的openwrt构建规则，规则会告诉openwrt如何操作vin-v4l2内核模块。
$(eval $(call KernelPackage,vin-v4l2))
```

如果希望拷贝 `vin-v4l2` 中指定的 ko 文件到 rootfs，需要执行`make menuconfig`开启 `CONFIG_PACKAGE_kmod-vin-v4l2` 配置，执行`make openwrt_rootfs`重新编译 `rootfs`，然后打包固件。

#### 修改 ko 源码

如果修改现有的 `ko` 源码，需要执行 `make` 重新完整编译，再进行固件打包。

#### 新增 ko

##### 新增 ko 源码

参考"新增驱动"章节添加源码及内核编译规则。

##### 新增 openwrt 编译规则

参考"ko文件编译及复制到 `rootfs` 中"章节，在特定板级模块配置文件 `modules.mk` 文件中新增该模块的相关配置信息。

### 修改内核压缩方式

V821 内核支持 5 种压缩方式，分别为`lzma`、`gzip`、`lz4`、`bzip2`、`lzo`，也可以支持不压缩，不同压缩方式的配置信息如下：

| 压缩方式 | uboot配置 | BoardConfig\*.mk配置 |
| --- | --- | --- |
| none | 无 | LICHEE\_COMPRESS:= |
| lzma | CONFIG\_LZMA=y | LICHEE\_COMPRESS:=lzma |
| gzip | CONFIG\_GZIP=y | LICHEE\_COMPRESS:=gzip |
| lz4 | CONFIG\_LZ4=y | LICHEE\_COMPRESS:=lz4 |
| bzip2 | CONFIG\_BZIP2=y | LICHEE\_COMPRESS:=bzip2 |
| lzo | CONFIG\_LZO=y | LICHEE\_COMPRESS:=lzo |

由于 `CONFIG_BZIP2` 没有在 `uboot` 原生的 `Kconfig` 里面定义，`bzip2` 压缩还需要在 `uboot` 源码（执行 `cboot` 快捷跳转目录）中手动添加如下改动：

```
diff --git a/include/configs/sun300iw1p1.h b/include/configs/sun300iw1p1.h
index 5014f66aff..682a5d683f 100644
--- a/include/configs/sun300iw1p1.h
+++ b/include/configs/sun300iw1p1.h
@@ -32,6 +32,10 @@
 /* #define CONFIG_UBI_OFFLINE_BURN */
 #endif

+#ifndef CONFIG_BZIP2
+#define CONFIG_BZIP2
+#endif
+
 #ifdef CONFIG_USB_EHCI_HCD
 #define CONFIG_USB_EHCI_SUNXI
 //#ifdef CONFIG_SUNXI_RTOS
```

修改内核压缩方式具体操作如下：

-   修改`device/config/chips/$(CHIP)/configs/$(BOARD)/BoardConfig*.mk`中的LICHEE\_COMPRESS为对应的压缩方式。
-   修改uboot的配置为对应的压缩方式。其中uboot配置文件位于`brandy/brandy-2.0/u-boot-2018/configs`目录下，文件名由`device/config/chips/$(CHIP)/configs/$(BOARD)/BoardConfig*.mk`中的LICHEE\_BRANDY\_DEFCONF宏定义。
-   重新执行`source build/envsetup.sh`与lunch，执行make重新编译整个系统，然后打包固件。

如下是V821某平台内核在不同压缩方式下的镜像大小以及启动耗时增量测试数据，仅供参考。

| 压缩格式 | boot.img大小 | 启动耗时增加 |
| --- | --- | --- |
| none | 5740544 | 0 |
| lzma | 2508800 | +552ms |
| gzip | 3039232 | +33ms |
| lz4 | 3346432 | \-19ms |
| bzip2 | 2822144 | +1975ms |
| lzo | 3280896 | +388ms |

### 打印/设置寄存器

平台实现了 `sunxi_dump` 机制，可以到 `/sys/class/sunxi_dump` 目录下dump相关的寄存器。部分命名如下所示：

```shell
echo 0x02001000,0x02001200 > dump;cat dump //打印0x02001000到0x02001200这段寄存器数据
echo 0x02500100 0x02000000 > wrte //设备0x02500100寄存器数据为0x02000000
```

### 挂载 debugfs

`debugfs` 系统可以提供一些调试信息，具体可以在控制台里面执行以下指令挂载debugfs。

```shell
mount -t debugfs none /sys/kernel/debug
```

### 配置内核日志打印

Linux支持8种打印等级，如下所示，只有打印等级小于等于loglevel值的日志才会输出到控制台。因此可以调整loglevel值来控制打印是否输出到控制台。

```
#define KERN_EMERG           "<0>" /* system is unusable */
#define KERN_ALERT           "<1>" /* action must be taken   immediately */
#define KERN_CRIT            "<2>" /* critical conditions */
#define KERN_ERR             "<3>" /* error conditions */
#define KERN_WARNING         "<4>" /* warning conditions */
#define KERN_NOTICE          "<5>" /* normal but significantcondition */
#define KERN_INFO            "<6>" /* informational */
#define KERN_DEBUG           "<7>" /* debug-level messages */
```

V821支持在启动时以及运行时配置内核的打印等级loglevel，常用于调试以及启动优化场景。

-   启动时：修改`device/config/chips/$(SOC)/configs/$(BOARD)/env*.cfg`文件中的loglevel值，然后重新执行pack命令打包，烧录固件。
    
-   运行时：执行`echo <num> > /proc/sys/kernel/printk`命令更改打印等级。该方式即时生效，属于临时更改，重启后打印等级恢复为启动时的值。
    

> 如果是快启方案( `BoardConfig.mk`中设定快启 `boot0`，例如`LICHEE_BOOT0_BIN_NAME:spinorfastboot`)，`bootargs` 不是在 `env` 中设定，需要在dts中设置好，因此需要修改板级`board.dts`文件，搜索并修改`loglevel`的值。然后执行`mkernel`编译内核后再打包生成镜像。
