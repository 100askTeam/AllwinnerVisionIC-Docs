---
sidebar_position: 2
---

# BOOT0 - 启动引导功能配置

## BOOT0 使用

本章节主要介绍一级bootloader使用。

### 目录结构

源码位于brandy/brandy-2.0/spl目录下，结构如下：

```
├── arch	#芯片arch相关文件
├── board
│   └── {chip_platform}	#存放各个芯片平台的boot0配置，具体目录名请参考对应芯片SDK
├── common	#存放通用组件，如：GPT和env
├── drivers
├── fes		#烧录阶段才执行，用于初始化dram。镜像只打包到固件中
├── include
├── Makefile
├── mk
├── nboot	#常规启动阶段执行代码
├── pmboot	#休眠唤醒阶段执行代码
├── sboot	#安全启动阶段执行代码
├── simpleboot	#特殊启动阶段执行的代码，用于初始化dram
├── solution	#快启相关功能代码
└── tools
```

### 确定方案使用的编译 `mk` 文件

确认当前方案使用的配置文件，这里以 perf2b 板级为例，查看 `BoardConfig_nor.mk` 和 `BoardConfig.mk` 中配置的 `LICHEE_BOOT0_BIN_NAME`，分布对应 SPI NOR 方案与 eMMC 方案下使用的 BOOT0 配置。

![image-20250319103359452](images/image-20250319103359452-fe724143091810f910b394edd6747507.png)

如果 `BoardConfig_nor.mk` 和 `BoardConfig.mk`中没有配置 `LICHEE_BOOT0_BIN_NAME` ，则标识方案使用默认配置，根据具体存储器件选择 `mmc.mk`，`spinor.mk`，`nand.mk` 即可

| 软件方案 | 存储器件 | 配置文件 |
| --- | --- | --- |
| 普通 | SPI NOR | `brandy/brandy-2.0/spl/board/{chip_platform}/spinor.mk` |
| 普通 | SPI NAND | `brandy/brandy-2.0/spl/board/{chip_platform}/nand.mk` |
| 普通 | eMMC/SD NAND | `brandy/brandy-2.0/spl/board/{chip_platform}/mmc.mk` |
| 快起 | SPI NOR | `brandy/brandy-2.0/spl/board/{chip_platform}/spinorfastboot.mk` |
| 快起 | eMMC/SD NAND | `brandy/brandy-2.0/spl/board/{chip_platform}/mmcfastboot.mk` |

:::tip

:::note

提示

:::
:::note

`{chip_platform}` 为对应芯片平台的配置目录名称，具体名称请参考对应芯片的 SDK 目录结构或芯片数据手册。

:::

:::

### 编译烧录使用

编译boot0的快捷命令是：

```
mboot0
```

根据 `spl/board/{chip_platform}/` 目录下不同的mk文件，对应不同boot0的编译产物，根据不同阶段划分。

启动阶段编译产物如下，根据方案配置选择一下其中一个烧录到设备端flash

```
boot0_spinor_{chip_platform}.bin	#nor介质启动boot0，对应spinor.mk
boot0_nand_{chip_platform}.bin	#nand介质启动boot0，对应nand.mk
boot0_sdcard_{chip_platform}.bin	#emmc介质启动boot0，对应mmc.mk

boot0_spinorfastboot_{chip_platform}.bin	#nor介质快启boot0，对应spinorfastboot.mk
boot0_mmcfastboot_{chip_platform}.bin	#emmc介质快启boot0，对应mmcfastboot.mk

sboot_nor_{chip_platform}.bin	#nor介质安全启动boot0，对应sboot_nor.mk
```

烧录阶段编译产物如下，所有方案都是使用以下镜像。文件保留在固件中，不会烧录到设备端flash

```
fes1_{chip_platform}.bin	#对应fes.mk
```

休眠唤醒阶段编译产物如下，对应pmboot.mk，如:nor方案则使用 `pmboot_spinor_{chip_platform}.bin`

```
pmboot_spinor_{chip_platform}.bin
pmboot_nand_{chip_platform}.bin
pmboot_sdcard_{chip_platform}.bin
```

:::tip

:::note

提示

:::
:::note

`{chip_platform}` 为对应芯片平台的标识符，具体名称请参考对应芯片的 SDK 编译产物或芯片数据手册。

:::

:::

### 配置说明

#### 串口配置

boot0的串口配置位于 `device/config/chips/{IC}/configs/{BOARD}/sys_config.fex`文件。

#### 串口输出配置

通过修改sys\_config.fex文件platform节点下的debug\_mode来控制串口输出。

debug\_mode为0时，boot0 printf函数打印不输出。需要使用pr\_emerg函数才能打印。

debug\_mode为1时，boot0打印放开，方便调试开发。

```
[platform]
debug_mode = 1
```

#### 更换串口

通过修改`sys_config.fex`文件`uart_para`节点来修改烧录和启动阶段的boot0打印。

`uart_debug_port`代表使用uart控制器编号，如：使用uart2就配置成2。

`uart_debug_tx`代表tx引脚GPIO配置，`uart_debug_rx`代表rx引脚GPIO配置。

```
[uart_para]
uart_debug_port = 0
uart_debug_tx   = port:PD22<3><1><default><default>
uart_debug_rx   = port:PD23<3><1><default><default>
```

### 常用功能

#### 添加新的宏

通常情况下，新增一段自定义代码，添加一个新的宏去管控比较方便调试开发。

新的宏以 CFG\_ 开头，在对应芯片平台的 board 配置目录下的mk文件中添加。

:::tip

:::note

提示

:::
:::note

具体芯片平台的 board 配置目录名称请参考对应芯片的 SDK 目录结构。

:::

:::

比如：只想在 `spinor` 常电启动过程中添加一段代码，使用 `CFG_TEST` 的宏管控；则在 `spinor.mk` 文件中添加

```
CFG_TEST=y
```

#### 方案使用自定义boot0 bin文件

按照以下几步操作执行即可：

-   确定新方案是快启还是常电，基于已有mk文件复制一份新的mk文件，并重命名。 如：新方案是快启nor介质，指定新的boot0文件为test，则

```
cp board/{chip_platform}/spinorfastboot.mk board/{chip_platform}/test.mk
```

-   在 `board/{chip_platform}/common.mk` 文件 BOARD\_BUILD\_NBOOT 添加新的mk名称，如添加一个test.mk

```
BOARD_BUILD_NBOOT=spinorfastboot mmcfastboot test
```

-   执行 `mboot0` 编译，即可看到cout快捷命令对应目录有 `boot0_test_{chip_platform}.bin`
    
-   修改 `device/config/chips/{CHIP}/configs/{BOARD}/BoardConfig_nor.mk`，添加 `LICHEE_BOOT0_BIN_NAME` 指定方案使用的 `boot0`
    

```
LICHEE_BOOT0_BIN_NAME:=test
```

5.  重新source,lunch打包烧录验证。

:::tip

:::note

提示

:::
:::note

`{chip_platform}` 为对应芯片平台的配置目录名称，`{CHIP}` 为芯片名称，具体名称请参考对应芯片的 SDK 目录结构。

:::

:::
