---
sidebar_position: 1
---

# Sensor 驱动调试指南

## 概述

### 编写目的

此文档旨在指导如何在 V85X、V821、V861 平台上进行 Sensor 驱动移植和调试，调试过程中常见问题的处理，以便于相关人员查看。

### 适用范围

适用于 Tina Linux 平台，Tina-v4.0 ，Tina-v5.0 V系列相关，V85x\_TINA、V85xS\_ARTMOS、V821\_TINA、V861\_TINA。

### 相关人员

Camera驱动维护人员或Sensor驱动开发人员。

### 术语与缩略词

MIPI：移动产业处理器接口联盟(Mobile Industry Processor Interface)

D-PHY：MIPI-CSI2 物理层(D-Core Physical Layer)，将 Sensor 端发来的模拟电信号转换为数字信号

CSI2：MIPI-CSI2 协议层(Camera Serial Interface 2)，将数字信号按照协议内容进行解析和检错

Lane：连接 TX 和 RX 端的一组差分线代表一组lane，如下图所示 1lane 与 2lane 硬件连接图

![mipi1lane硬件连接图](images/mipi1lane硬件连接图-34f0ad33342b4851c3e681576d8748fb.png)

![mipi2lane硬件连接图](images/mipi2lane硬件连接图-2c1a0e4469af316565d75593fe9d9ce7.png)

Mbps：Mbit per second，表示 MIPI 数据传输速度的单位，比如 OV4689 的 MIPI 速率是 672Mbps，一般指的是单条 lane 上每秒钟传输的数据量是672Mbit

DVP：Digital Video Port 是并口传输，数据位宽有 8bit、10bit、12bit 等，是非差分信号，最高速率要比串行传输的MIPI接口低

PCLK：pixel clock 像素时钟，每个时钟对应一个像素数据，一般为几十MHz

HSYNC：Horizonal Synchronization，是行同步信号。就是在告诉接收端，HSYNC有效时段内接收端接收到的所有的信号输出属同一行

VSYNC：Vertical Synchronization，是场同步信号。以高电平有效为例，VSYNC置高直到被拉低，这个区段所输出的所有影像数据组成一个frame

MCLK：Master Clock，外部晶振或主控输出给Sensor的驱动时钟，典型值是24MHz、27MHz

SCL：Serial Clock Line，串行时钟线，负责产生同步时钟脉冲

SDA：Serial Data Line，串行数据线，负责在设备间传输串行数据

## Camera 驱动概览

### VIN 驱动目录

:::note

:::note

适用产品列表

:::

:::

| 模块版本 | 驱动文件 |
| --- | --- |
| Linux-4.9 | drivers/media/platform/sunxi\_vin/ |
| Linux-5.4/Linux-6.6 | bsp/drivers/vin/ |

V系列平台 sunxi-vin 驱动的目录概览：

```c
sunxi-vin/
├── Kconfig
├── Makefile
├── modules
│   ├── sensor  //sensor驱动文件目录
├── utility
├── vin.c       //vin.c是驱动的主要功能实现，包括注册/注销、参数读取、与 v4l2 上层接口、与各 device 的下层接口、中断处理、buffer 申请切换等；
├── vin-cci
├── vin-csi     //csi接口驱动文件
├── vin-isp
├── vin-mipi    //mipi接口驱动文件
├── vin-stat
├── vin-tdm     //TDM模块驱动文件
├── vin-video   //video设备驱动文件
└── vin-vipp    //VIPP模块驱动文件
```

### Sensor 驱动目录

:::note

:::note

适用产品列表

:::

:::

| 模块版本 | 驱动文件 |
| --- | --- |
| Linux-4.9 | drivers/media/platform/sunxi\_vin/modules/sensor/ |
| Linux-5.4/Linux-6.6 | bsp/drivers/vin/modules/sensor/ |

V系列平台 Sensor 驱动的目录概览：

```c
sensor/
├── ar0238.c
├── ar0238_hispi.c
├── bf2253l_mipi.c
├── bf2257cs_mipi.c
├── built-in.o
├── c2390a_mipi.c
├── C2398_mipi.c
├── c2399_mipi.c
├── camera_cfg.h
├── camera.h
├── f355p_dvp.c
├── f355p_mipi.c
├── f37h_mipi.c
├── f37p_mipi.c
├── f37p_mipi_vc.c
├── f53_mipi.c
├── gc02m1_mipi.c
├── gc0308_mipi.c
├── gc030a_mipi.c
├── gc0310_mipi.c
├── gc0339_mipi.c
├── gc0403_mipi.c
├── gc0406_mipi.c
....
```

### Sensor 驱动数据结构

以 gc2053\_mipi.c、gc1084\_mipi.c 驱动文件为例，下面给出 Sensor 驱动关键数据结构的说明

```c
// 【参考驱动文件目录】
// Linux-4.9
drivers/media/platform/sunxi_vin/modules/sensor/gc2053_mipi.c
// Linux-5.4或Linux-6.6
bsp/drivers/vin/modules/sensor/gc1084_mipi.c
```

#### Sensor 寄存器配置定义

 struct regval\_list 结构体用于填写 Sensor 初始化配置列表下需要写入的地址和值，配置由 Sensor 厂提供，struct regval\_list 结构体定义如下，每一组分辨率和帧率下对应一个 regval\_list 数组，regval\_list 结构体变量的命名规则一般是 sensor\_xxx(分辨率帧率)\_regs。

```c
struct regval_list {
	addr_type addr;
	data_type data;
};
```

```c

/* 此结构体用于填写 Sensor 寄存器列表，由 Sensor原厂提供 */
static struct regval_list sensor_1080p12_regs[] = {
    /*  1928*1088@12fps */
	/****system****/
	{0xfe, 0x80},
	{0xfe, 0x80},
	{0xfe, 0x80},
	{0xfe, 0x00},
	{0xf2, 0x00},
	{0xf3, 0x00},
...
	{0x02, 0x56},
	{0x03, 0x8e},
	{0x12, 0x80},
	{0x13, 0x07},
	{0x15, 0x12},
	{0xfe, 0x00},
	{0x17, 0x83},
};
```

#### Sensor 寄存器配置注册

```c
/* Sensor 驱动由不同的分辨率/帧率的寄存器配置，它们填写在  sensor_win_sizes 结构体数组中 */
static struct sensor_win_size sensor_win_sizes[] = {
	{
		.width		= 1928,
		.height 	= 1088,
		.hoffset	= 4,//0,
		.voffset	= 4,//0,
		.hts		= 2200,
		.vts		= 2700,
		.pclk		= 74250000,
		.mipi_bps	= 297 * 1000 * 1000,
		.fps_fixed	= 12,//12.5
		.bin_factor = 1,
		.intg_min	= 1 << 4,
		.intg_max	= (2700 - 16) << 4,
		.gain_min	= 1 << 4,
		.gain_max	= 110 << 4,
		.regs		= sensor_1080p12_regs,
		.regs_size	= ARRAY_SIZE(sensor_1080p12_regs),
		.set_size	= NULL,
	},
...
};
```

| 成员变量 | 含义说明 |
| --- | --- |
| width | 图像输出宽度，定义 parser 接收进来的宽度 |
| height | 图像输出高度，定义 parser 接收进来的高度 |
| hoffset | 定义输入 ISP 的宽度偏移量，用于裁剪不需要的像素列 |
| voffset | 定义输入 ISP 的宽度偏移量，用于裁剪不需要的像素行 |
| hts | 行长(以pclk为单位) |
| vts | 帧长(以hts为单位) |
| pclk | 像素时钟：pclk = hts × vts × fps |
| mipi\_bps | MIPI 速率：mipi bps = hts \* vts \* fps \* raw bit（数据位宽） / lane num（mipi lane 数） |
| fps\_fixed | 当前Sensor 寄存器配置对应的帧率 |
| bin\_factor | ISP binning配置，默认配置为1 |
| intg\_min | ISP可以设置的最小曝光时间（单位：曝光行），平台以16为一行，默认配置16 |
| intg\_max | 最大曝光时间（默认为当前帧率的VTS，或者 VTS - offset（部分Sensor无法跑满理论VTS时需扣除一定offset，与FAE确认即可） |
| gain\_min | ISP可以设置的Sensor最小增益，平台以16为一倍，默认配置16 |
| gain\_max | ISP可以设置的Sensor最大增益 |
| regs | 当前帧率/分辨率对应的 Sensor 寄存器数组 |
| regs\_size | 前帧率/分辨率对应的 Sensor 寄存器数组的长度 |
| set\_size | 默认为NULL |

上述成员变量中，.hts 和.vts 值的设置必须与当前所使用的初始化寄存器配置互相对应，一般在 sensor 的 datasheet 中可以找到，如下，sensor 原厂提供的配置里面也会进行标注，如果没有找到可以询问一下 sensor 原厂。

下图是格科微 gc2053 datasheet 中找到配置 vts 寄存器值，对应格科微 gc2053 MIPI接口 2lane 1080p 12帧 的寄存器配置中\{0x41, 0x0a\},\{0x42, 0x8c\}，所以对应的 vts 值为 0xa8c=2700，hts 值在 gc2053 datasheet 中没有找到，可以通过 pclk = hts × vts × fps 得出当前的 hts 值填写进去，或者询问 Sensor 原厂。

![gc2053\_vts寄存器](images/gc2053_vts寄存器-58e10a26f13b9bbe52c229ed5fcf0165.png)

.intg\_max 是最大曝光时间，示例中 gc2053 的最大曝光限制为 vts-16，因为主控端曝光是以 16 为一行，所以将 gc2053 最大曝光限制值左移 4 位填入.intg\_max。每个 sensor 的最大曝光限制都是不一样的，这个可以询问一下 sensor 原厂或者翻阅 sensor datasheet 进行查找。

.gain\_max 是最大增益，每个 sensor 的最大增益都是不一样的，这个可以询问一下 sensor 原厂或者翻阅 sensor datasheet 进行查找，本例中 sensor 的最大增益为 110 倍，而主控端 ISP 是以 16 为一倍，所以该值需要左移 4 位后填入。

.hoffset和.voffset 用于裁剪不需要的像素列和行，默认是居中裁剪，示例中hoffset为4，表示裁剪图像最左边4列和最右边4列，共裁剪8列，因此裁剪分辨率时，这个值填写为需要裁剪的列除以2，voffset同理。

如果 sensor 输出图像格式是 YUV 的话，则 .bin\_factor/.intg\_min/.intg\_max/.gain\_min/.gain\_max 这几个成员变量无须填写。

#### Parser 裁剪宽高

sensor\_win\_sizes中的width和height用于配置soc parser接收的图像宽度和高度，所以通常也可以用于裁剪sensor图像的宽高（在不修改sensor寄存器配置的前提下）。

如图所示，假设sensor输出图像分辨率：1928x1088，但是应用需要的分辨率（居中裁剪）：1920x1080, 按照如下配置，配置.hoffset为4，parser会裁剪掉左边4列，右边4列，即接收宽度为1920，同理，配置.voffset为的4，parser会裁剪掉上边4行，下边4列，接收高度为1080。

```c
static struct sensor_win_size sensor_win_sizes[] = {
	{
		.width		= 1928,
		.height 	= 1088,
		.hoffset	= 4,//0,
		.voffset	= 4,//0,
		...
		.regs		= sensor_1080p12_regs,
		.regs_size	= ARRAY_SIZE(sensor_1080p12_regs),
		.set_size	= NULL,
	},
...
```

#### Sensor 图像数据格式注册

```c
/*
 * Here we'll try to encapsulate the changes for just the output
 * video format.
 *
 */

static struct regval_list sensor_fmt_raw[] = {
// 一般为空
};
/*
 * Store information about the video data format.
 */
static struct sensor_format_struct sensor_formats[] = {
/* 定义 Sensor 输出的图像数据格式，根据Sensor输出格式填写，下述为 RAW 数据格式示例 */
	{
		.desc      = "Raw RGB Bayer",
		.mbus_code = MEDIA_BUS_FMT_SRGGB10_1X10,
		.regs      = sensor_fmt_raw,
		.regs_size = ARRAY_SIZE(sensor_fmt_raw),
		.bpp       = 1
	},
};
#define N_FMTS ARRAY_SIZE(sensor_formats)

// 如果Sensor 输出图像格式是 YUV，则需要根据 Sensor 图像数据输出顺序选择 YUYV/VYUY/UYVY/YVYU  其中一种，如下：
static struct sensor_format_struct sensor_formats[] = {
	{
		.desc = "YUYV 4:2:2",
		.mbus_code = MEDIA_BUS_FMT_YUYV8_2X8,
		.regs = sensor_fmt_raw,
		.regs_size = ARRAY_SIZE(sensor_fmt_raw),
		.bpp = 2,
	},
};
#define N_FMTS ARRAY_SIZE(sensor_formats)
```

| 成员变量 | 含义说明 |
| --- | --- |
| desc | 描述 sensor 输出的图像格式 |
| mbus\_code | 图像数据RGB分量排列顺序（常见 Bayer 格式：RGGB、BGGR、GRBG、GBRG） |
| regs | 默认填写sensor\_fmt\_raw |
| regs\_size | 默认填写sensor\_fmt\_raw的大小 |
| bpp | 默认为1 |

#### Sensor I2C 注册

Sensor I2C 设备地址用于告知主控端丛机所对应的设备地址，以便主控端在通过 I2C 通讯时，能够根据从机（sensor）的设备地址对其进行读写寄存器操作，Sensor I2C 设备地址一般在 Sensor 的 datasheet 中可以找到，在 I2C 读写示例中有标明，如图所示，格科微 gc2053 datasheet 中描述了 Sensor I2C 设备地址。

![gc2053\_SlaveID地址](images/gc2053_SlaveID地址-559de54d3589b6b43814e641f37f0854.png)

需要注意的是，有些 sensor 支持通过修改外围电路设计从而更改设备 TWI 地址，在配置 TWI 设备地址时需要查看原理图或者询问硬件设计人员，如下是 gc2053 两组 TWI 地址：

![gc2053\_SlaveAddress寄存器](images/gc2053_SlaveAddress寄存器-318db1dcf53621d47430a604d377d839.png)

驱动文件里面的 I2C\_ADDR 宏定义一般用于填写具体的I2C地址

```c
#define I2C_ADDR 0x6e  /* sensor的TWI地址,I2C_ADDR要和board.dts中的sensor0_twi_addr一致*/
```

Sensor I2C 数据位宽和地址位宽是在 cci\_driver 结构体中定义的，数据位宽和地址位宽必须按照手册说明进行配置，否则 I2C 通讯时没有将 sensor 寄存器值成功写入 sensor 中，导致 sensor 不出图。如下是 gc2053 datasheet I2C 通讯时序图。

```c
/* 定义两组 Sensor CCi driver，CCi全称是camera control interface，由i2c和gpio组成 */
static struct cci_driver cci_drv[] = {
	{
		.name = SENSOR_NAME,
		.addr_width = CCI_BITS_8,
		.data_width = CCI_BITS_8,
	}, {
		.name = SENSOR_NAME_2,
		.addr_width = CCI_BITS_8,
		.data_width = CCI_BITS_8,
	}
};

/* 用于下面Sensor_driver结构体来匹配设备树 */
static const struct i2c_device_id sensor_id[]

/* Sensor driver的定义，其中会通过id_table来匹配设备树 */
static struct i2c_driver sensor_driver[]
```

![gc2053TWI时序图](images/gc2053TWI时序图-df00be178bf56d2519252bcf06e5c49d.png)

#### Sensor 电气接口注册

Sensor 数据传输接口以及 Lane 数定义在 sensor\_g\_mbus\_config 函数中进行填写。

```c
#if LINUX_VERSION_CODE >= KERNEL_VERSION(6, 1, 0)
__maybe_unused static int sensor_g_mbus_config(struct v4l2_subdev *sd,
				struct v4l2_mbus_config *cfg)
{
#if IS_ENABLED(CONFIG_SENSOR_GC2053_ONE_LANE_MIPI)
	cfg->type  = V4L2_MBUS_CSI2_DPHY;
	cfg->bus.mipi_csi2.num_data_lanes = 0 | V4L2_MBUS_CSI2_1_LANE | V4L2_MBUS_CSI2_CHANNEL_0;
#else	/* two lane */
	cfg->type  = V4L2_MBUS_CSI2_DPHY;
	cfg->bus.mipi_csi2.num_data_lanes = 0 | V4L2_MBUS_CSI2_2_LANE | V4L2_MBUS_CSI2_CHANNEL_0;
#endif
	return 0;
}
#else
__maybe_unused static int sensor_g_mbus_config(struct v4l2_subdev *sd,
				struct v4l2_mbus_config *cfg)
{
#if IS_ENABLED(CONFIG_SENSOR_GC2053_ONE_LANE_MIPI)
	cfg->type  = V4L2_MBUS_CSI2_DPHY;
	cfg->flags = 0 | V4L2_MBUS_CSI2_1_LANE | V4L2_MBUS_CSI2_CHANNEL_0;
#else	/* two lane */
	cfg->type  = V4L2_MBUS_CSI2_DPHY;
	cfg->flags = 0 | V4L2_MBUS_CSI2_2_LANE | V4L2_MBUS_CSI2_CHANNEL_0;
#endif
	return 0;
}
#endif
```

### Sensor 驱动接口概览

| 接口定义 | 接口说明 |
| --- | --- |
| sensor\_g\_fps | 获取 Sensor 实时帧率 |
| sensor\_s\_fps | 动态设置 Sensor 帧率 |
| sensor\_g\_exp | 获取 Sensor 曝光时间（单位：曝光行） |
| sensor\_s\_exp | 设置 Sensor 曝光时间（单位：曝光行） |
| sensor\_g\_gain | 获取 Sensor 当前增益 |
| sensor\_s\_gain | 设置 Sensor 增益 |
| sensor\_s\_exp\_gain | 设置 Sensor 曝光时间和增益 |
| sensor\_s\_vflip | 动态设置 Sensor 垂直翻转 |
| sensor\_s\_hflip | 动态设置 Sensor 水平翻转 |
| sensor\_g\_flip | 获取 Sensor 当前翻转状态 |
| sensor\_get\_temp | 获取 Sensor 当前温度 |
| sensor\_power | Sensor 上下电函数 |
| sensor\_reset | 设置 Sensor 复位 |
| sensor\_detect | Sensor 探测函数（测试IIC通信） |
| sensor\_init | Sensor 驱动初始化入口 |
| sensor\_ioctl | Sensor 功能函数系统调用入口 |
| sensor\_g\_mbus\_config | Sensor 工作接口类型定义 |
| sensor\_g\_ctrl | Sensor v4l2\_ctrl 功能函数 |
| sensor\_s\_ctrl | Sensor v4l2\_ctrl 功能函数 |
| sensor\_reg\_init | Sensor 寄存器初始化函数 |
| sensor\_s\_stream | Sensor 开流函数 |
| sensor\_init\_controls | Sensor v4l2\_ctrl 系统调用初始化函数 |
| sensor\_probe | Sensor 驱动资源初始化函数 |
| sensor\_remove | Sensor 驱动卸载函数 |
| init\_sensor | Sensor 驱动注册函数 |
| exit\_sensor | Sensor 驱动注销函数 |

## Sensor 驱动点亮流程

### 线性模式

线性模式 Sensor 驱动移植根据 MIPI 接口和 DVP 接口来进行说明。

#### MIPI接口

##### 获取 Sensor 初始化寄存器配置

MIPI接口线性模式Senso驱动r移植以格科微 gc2053 为例，在调试Sensor驱动之前，需要确认以下几点：

| 图像规格 |
| --- |
| Sensor使用哪类接口进行图像传输（MIPI、DVP） |
| 需要用到的分辨率和帧率 |
| MCLK频率（常见：24/27M） |
| 连接模组的外围功能电路是否按照sensor原厂提供硬件参考设计来实现的 |

根据当前方案所需要的分辨率和帧率，对应的MCLK（一般建议是24M）以及sensor硬件设计上所使用到接口（mipi/dvp）和lane数，联系sensor原厂提供一份对应的初始化寄存器配置，提供的配置需要和当前使用的模组匹配。如图所示是格科微 gc2053 MIPI接口 2lane 1080p 12帧 的寄存器配置：

![gc2053\_12fps初始化寄存器配置表](images/gc2053_12fps初始化寄存器配置表-482be7caf670b9e25e87b2cd717d1cbb.png)

##### 添加驱动文件

```c
1.添加Makefile文件
2.添加Sensor驱动文件
3.添加Kconfig
4.配置kernel_menuconfig
```

**添加 MakeFile**

进入 sensor 目录，打开 MakeFile 文件，添加指定语句，这一步的作用是将.c 源文件编译为.o 文件，如下图所示：

![linux系统Makefile文件修改位置](images/linux系统Makefile文件修改位置-c321da1ebd2a8f36d5fb990ecab24f1b.jpg)

**添加 Sensor 驱动文件**

进入 sensor 目录，如果需要调试的模组对应的其他型号之前有在全志平台上点过的话，建议以 SDK 中的某个现成的驱动为基础修改，如格科微的 Sensor 驱动命名都是以 gc 开头的，思特威的 Sensor 驱动命名都是以 sc 开头的，索尼的 Sensor 驱动命名都是以 imx 开头的。 如果没有，可以找一份硬件配置（如 mipi lane 数，图像输出格式等）相近的驱动，在此基础上进行修改。本例中复用格科微其中一个 Sensor 的源文件，重命名成 gc2053\_mipi.c。

**添加 Kconfig**

在同级目录下的 Kconfig 文件中，将本文件按照格式添加进去，用于 kernel\_menuconfig 来选择配置

![linux系统Kconfig文件修改位置](images/linux系统Kconfig文件修改位置-3c5712dd193d195ad7a719cd362369da.jpg)

**配置 kernel\_menuconfig**

使用 make kernel\_menuconfig， 进入内核 menuconfig，选中本Senor驱动为 M，M 代表编译成模块（.ko文件），Y 代表编译进内核

```c
// Linux-5.10以前版本
→ Device Drivers → Multimedia support → V4L platform devices → sensor driver select
// Linux-5.10以后版本
→ Allwinner BSP → Device Drivers → VIN (camera) Drivers → sensor driver select
```

![kernel\_menuconfig选择界面](images/kernel_menuconfig选择界面-01e275ddbab7bd72e5c9aaa952029b35.jpg)

##### 修改引脚配置

由于模组硬件外围电路因为实际需求差异与公版开发板使用的 Sensor 模组的外围电路存在差异，所以需要根据当前的硬件设计原理图，修改板级配置 board.dts。

| 引脚配置与注意事项 |
| --- |
| MCLK引脚配置 |
| TWI引脚配置 |
| PWDN(sensor使能引脚)和RSTN(sensor复位引脚)配置 |
| 需要检查当前板级配置，是否有其他模块复用同组TWI或者GPIO的 |

```c
// 执行 source build/envsetup.sh 脚本且选择板级之后，可以直接执行 cconfigs 命令进入对应的板级目录。
// V85X平台
device/config/chips/xxx（芯片型号）/configs/xxx（板型）/board.dts
// V821平台
board.dts：device/config/chips/v821/configs/xxx（具体板型）/linux-5.4-ansc/board.dts
// V861平台
board.dts：device/config/chips/v861/configs/xxx（具体板型）/linux-6.6-xuantie/board.dts
```

这里以公版 V851s perf1 为例进行引脚配置说明，引脚复用功能可以查阅一号通文档《V851S&V851SE\_Datasheet\_V1.1》10.6.5 V851S GPIO Register Description 章节获取。

MCLK 引脚硬件连接图和对应引脚配置如下：

![MCLK硬件连接图](images/MCLK引脚硬件连接图-5c51c2690da56542f5d1cdd48e7b99ae.png)

```c
csi_mclk0_pins_a: csi_mclk0@0 {
    allwinner,pins = "PA10";   /* 填写方案硬件设计对应的GPIO引脚，本例填写为PA10 */
    allwinner,pname = "mipi_csi_mclk0";
    allwinner,function = "mipi_csi_mclk0";
    allwinner,muxsel = <0x4>;  /* 引脚复用功能，需要查阅对应平台的数据手册获取 */
    allwinner,drive = <2>;     /* 驱动能力配置，按照默认配置即可 */
    allwinner,pull = <0>;      /* 是否配置为上拉 */
};
```

![PA10引脚复用功能定义](images/PA10引脚复用功能定义-bf37b7c929b7ba9241b2170d6b984441.png)

TWI 引脚硬件连接图和对应引脚配置如下：

![TWI1引脚硬件连接图](images/TWI1引脚硬件连接图-bd44a7601419621eb857680a7d56e3e5.png)

```c
twi1_pins_a: twi1@0 {
    allwinner,pins = "PA6", "PA7";      /* 填写方案硬件设计对应的GPIO引脚，本例填写为PA6、PA7 */
    allwinner,pname = "twi1_scl", "twi1_sda";
    allwinner,function = "twi1";
    allwinner,muxsel = <4>;             /* 引脚复用功能，需要查阅对应平台的数据手册获取 */
    allwinner,drive = <0>;              /* 驱动能力配置，按照默认配置即可 */
    allwinner,pull = <1>;
};

&twi1 {
	clock-frequency = <400000>;
	pinctrl-0 = <&twi1_pins_a>;
	pinctrl-1 = <&twi1_pins_b>;
	pinctrl-names = "default", "sleep";
	/* For stability and backwards compatibility, we recommend setting twi_drv_used to 0 */
	twi_drv_used = <0>;
	twi_pkt_interval = <0>;
	status = "okay";       /* 需要检查此处有没有设置为okay */
};
```

![PA6引脚复用功能定义](images/PA6引脚复用功能定义-bb9eeb2e43c6bc8114788b47f5051d94.png)

![PA7引脚复用功能定义](images/PA7引脚复用功能定义-b32527cf4f18bf4f03459151d5f3409b.png)

PWDN 引脚硬件连接图和 RSTN 引脚硬件连接图：

![PWDN引脚硬件连接图](images/PWDN引脚硬件连接图-8e3cb7e3ddbe1a33de7a051d8835c2d1.png)

![RSTN引脚硬件连接图](images/RSTN引脚硬件连接图-e934c1a9dd5ec5a3bb1b4a28445809f3.png)

PWDN 引脚和 RSTN 引脚配置是在 board.dts sensor 属性中配置，公版 gc2053 是在 board.dts sensor0 属性中进行相关引脚配置：

```c
sensor0:sensor@0 {
      device_type = "sensor0";
      sensor0_mname = "gc2053_mipi";      /* 必须要和驱动的 SENSOR_NAME 一致 */
      sensor0_twi_cci_id = <1>;           /* 所使用的twi id号，本例中使用的是twi1，故填写为1 */
      sensor0_twi_addr = <0x6e>;          /* sensor 设备ID地址，必须与驱动中的I2C_ADDR一致 */
      sensor0_mclk_id = <0>;              /* 所使用的mclk id号，本例中使用的是MCLK0，故填写为0 */
      sensor0_pos = "rear";
      sensor0_isp_used = <1>;             /* 所使用的sensor为raw sensor，需要过ISP处理，故填写为1 */
      sensor0_fmt = <1>;                  /* sensor输出的图像格式，YUV：0，RAW：1 */
      sensor0_stby_mode = <0>;
      sensor0_vflip = <0>;                /* VIPP 图像垂直翻转 */
      sensor0_hflip = <0>;                /* VIPP 图像水平翻转 */
      sensor0_iovdd-supply = <&reg_aldo2>;/* sensor iovdd 连接的 ldo，根据硬件原理图的连接来决定（在硬件原理图中搜索aldo，然后找到CSI-iovdd对应的是哪一个aldo即可） */
      sensor0_iovdd_vol = <1800000>;	  /* iovdd的电压 */
      sensor0_avdd-supply = <&reg_bldo2>; /* sensor avdd连接的 ldo，根据硬件原理图的连接来决定 */
      sensor0_avdd_vol = <2800000>;		  /* 同上 */
      sensor0_dvdd-supply = <&reg_dldo2>;  /* 同上 */
      sensor0_dvdd_vol = <1200000>;        /* 同上 */
      sensor0_power_en = <>;
      sensor0_reset = <&pio PA 11 1 0 1 0>; /* GPIO 信息配置：pio 端口 组内序号 功能分配 内部电阻状态 驱动能力 输出电平状态,本例中使用的是PA11*/
      sensor0_pwdn = <&pio PA 9 1 0 1 0>;   /* GPIO 信息配置：pio 端口 组内序号 功能分配 内部电阻状态 驱动能力 输出电平状态,本例中使用的是PA9*/
      flash_handle = <&flash0>;
      act_handle = <&actuator0>;
      status  = "okay";
};
```

##### 移植 Sensor 驱动

修改驱动文件 gc2053\_mipi.c 以适配当前使用的模组，如下修改的内容是调试 sensor 驱动所必须填写的，如下：

###### 修改 Sensor Name

修改驱动文件中宏定义 SENSOR\_NAME 为"gc2053\_mipi"，SENSOR\_NAME 要与 board.dts 中的 sensor0\_mname 一致，SENSOR\_NUM 定义为1表示当前这份驱动只适配一个 gc2053 摄像头。

```c
#define SENSOR_NUM 0x1
#define SENSOR_NAME "gc2053_mipi"
```

###### 配置 MCLK 时钟

下面的设置代表 sensor 输入时钟频率，可通过 sensor 的 datasheet 查看类似 input clock frequency 对应的数据，其中 MCLK 和使用的寄存器配置强相关，在模组厂提供寄存器配置时，可直接询问当前配置使用的 MCLK 频率是多少，一般原厂提供的初始化寄存器配置里面就包含当前配置所使用的 MCLK 频率，如下是格科微 gc2053 初始化寄存器配置所填写的 MCLK。MCLK 是主控端发出来给到 sensor，MCLK 的配置会影响 sensor 出图的帧率以及上电时序的表现，部分Sensor没有接收到预期的MCLK时，可能存在I2C不通的情况。

![sensor的MCLK配置值](data:image/png;base64,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)

```c
// Linux-4.9
 lichee/linux-4.9/drivers/media/platform/sunxi-vin/modules/sensor/gc2053_mipi.c
// Linux-5.4和Linux-6.6
 bsp/drivers/vin/modules/sensor/gc2053_mipi.c
```

驱动面的 MCLK 宏定义修改为：

```c
#define MCLK              (24*1000*1000)
```

###### 配置 Sensor ID/CHIP ID

每个 sensor 的 Sensor ID/CHIP ID 都是独一无二，根据这个 ID 号可以探测当前使用的 sensor 是否与驱动相匹配，也可以用于初步校验主控端与 sensor 的 TWI 通讯是否正常， sensor list 适配也是通过探测 ID 号来实现的，Sensor ID/CHIP ID 一般在 sensor 的 datasheet 中找到，可以搜索关键字 Sensor ID 或 CHIP ID 进行查找。

如下是格科微 gc2053 datasheet 中找到 CHIP ID

![gc2053\_CHIPID寄存器](images/gc2053_CHIPID寄存器-435575fc2d0c5791f443dc5b51ecf856.png)

对应驱动文件里面的 V4L2\_IDENT\_SENSOR 宏定义修改为：

```c
#define V4L2_IDENT_SENSOR  0x2053
```

若 sensor 驱动中有宏定义是与 Sensor ID/CHIP ID 的寄存器地址以及 ID 值偏移有关，则对应需要进行填写：

```c
#define ID_REG_HIGH		0xf0     //gc2053 CHIP ID高8位寄存器地址
#define ID_REG_LOW		0xf1     //gc2053 CHIP ID低8位寄存器地址
#define ID_VAL_HIGH		((V4L2_IDENT_SENSOR) >> 8)    //gc2053 CHIP ID高8位寄存器读出来的值
#define ID_VAL_LOW		((V4L2_IDENT_SENSOR) & 0xff)  //gc2053 CHIP ID低8位寄存器读出来的值
```

上述与 Sensor ID/CHIP ID 有关的宏定义在 sensor\_detect 函数中会被使用，这个函数在 sensor 驱动被挂载的时候会被调用执行，同时也可以用来检测主控与 sensor TWI 通讯是否正常。

```c
static int sensor_detect(struct v4l2_subdev *sd)
{
	data_type rdval;
	int eRet;
	int times_out = 3;
	do {
		eRet = sensor_read(sd, ID_REG_HIGH, &rdval);
		sensor_dbg("eRet:%d, ID_VAL_HIGH:0x%x, times_out:%d\n", eRet, rdval, times_out);
		usleep_range(200, 220);
		times_out--;
	} while (eRet < 0  &&  times_out > 0);
    sensor_read(sd, ID_REG_HIGH, &rdval);
    sensor_dbg("ID_VAL_HIGH = %2x, Done!\n", rdval);
    if (rdval != ID_VAL_HIGH)
        return -ENODEV;

    sensor_read(sd, ID_REG_LOW, &rdval);
    sensor_dbg("ID_VAL_LOW = %2x, Done!\n", rdval);
    if (rdval != ID_VAL_LOW)
        return -ENODEV;

    sensor_dbg("Done!\n");
    return 0;
}
```

###### 配置 Sensor I2C 设备地址、数据/地址位宽

```c
#define I2C_ADDR 0x6e  /* sensor的TWI地址,I2C_ADDR要和board.dts中的sensor0_twi_addr一致*/
...
static struct cci_driver cci_drv[] = {
	{
		.name = SENSOR_NAME,
		.addr_width = CCI_BITS_8,
		.data_width = CCI_BITS_8,
	},
};
```

###### 添加和注册 Sensor 初始化寄存器配置

```c
static struct regval_list sensor_1080p12_regs[] = {
    /*  1928*1088@12fps */
	/****system****/
	{0xfe, 0x80},
	{0xfe, 0x80},
	{0xfe, 0x80},
	{0xfe, 0x00},
	{0xf2, 0x00},
	{0xf3, 0x00},
...
	{0x02, 0x56},
	{0x03, 0x8e},
	{0x12, 0x80},
	{0x13, 0x07},
	{0x15, 0x12},
	{0xfe, 0x00},
	{0x17, 0x83},
};
...
static struct sensor_win_size sensor_win_sizes[] = {
	{
		.width		= 1920,
		.height 	= 1088,
		.hoffset	= 4,//0,
		.voffset	= 4,//0,
		.hts		= 2200,
		.vts		= 2700,
		.pclk		= 74250000,
		.mipi_bps	= 297 * 1000 * 1000,
		.fps_fixed	= 12,//12.5
		.bin_factor = 1,
		.intg_min	= 1 << 4,
		.intg_max	= (2700 - 16) << 4,
		.gain_min	= 1 << 4,
		.gain_max	= 110 << 4,
		.regs		= sensor_1080p12_regs,
		.regs_size	= ARRAY_SIZE(sensor_1080p12_regs),
		.set_size	= NULL,
	},
...
};
```

###### 配置图像数据格式

```c
static struct sensor_format_struct sensor_formats[] = {
/* 定义 Sensor 输出的图像数据格式，根据Sensor输出格式填写，下述为 RAW 数据格式示例 */
	{
		.desc      = "Raw RGB Bayer",
		.mbus_code = MEDIA_BUS_FMT_SRGGB10_1X10,
		.regs      = sensor_fmt_raw,
		.regs_size = ARRAY_SIZE(sensor_fmt_raw),
		.bpp       = 1
	},
};
#define N_FMTS ARRAY_SIZE(sensor_formats)
```

###### 配置MIPI接口

```c
static int sensor_g_mbus_config(struct v4l2_subdev *sd,	struct v4l2_mbus_config *cfg)
{
	cfg->type  = V4L2_MBUS_CSI2;
	cfg->flags = 0 | V4L2_MBUS_CSI2_2_LANE | V4L2_MBUS_CSI2_CHANNEL_0;
	return 0;
}
```

##### 上电时序配置

sensor 的上电时序控制在 sensor\_power 函数中实现，上电时序必须严格按照 sensor datasheet 中的说明来进行，上电时序不对会导致 TWI 异常，主控端与 sensor 通讯失败。

如下图所示是 gc2053 的上电时序图，就是 IOVDD->DVDD->AVDD 的上电顺序，此外 PWDN 和 RESET 引脚的使用也需要结合时序图配置。

![gc2053上电时序图](images/gc2053上电时序图-910b4a5622bda43ef95f764b4a1f9757.png)

```c
static int sensor_power(struct v4l2_subdev *sd, int on)
{
	switch (on) {
	/* STBY_ON 和 STBY_OFF 基本不使用，可忽略这两个选项的配置 */
	case STBY_ON:
		...

	case STBY_OFF:
		...
	/* 进行上电操作 */
	case PWR_ON:
		sensor_dbg("PWR_ON!\n");
		cci_lock(sd);
		vin_set_mclk(sd, ON);        /* 开启mclk时钟 */
		usleep_range(1000, 1200);
		vin_set_mclk_freq(sd, MCLK); /* 设置MCLK */
		usleep_range(1000, 1200);
		vin_gpio_set_status(sd, PWDN, 1);        /* 将PWDN引脚置为输出 */
		vin_gpio_set_status(sd, RESET, 1);       /* 将RESET引脚置为输出 */
		vin_gpio_write(sd, PWDN, CSI_GPIO_LOW);  /* 将PWDN引脚电频置为低电平 */
		vin_gpio_write(sd, RESET, CSI_GPIO_LOW); /* 将RESET引脚电频置为低电平 */
		usleep_range(1000, 1200);
		vin_set_pmu_channel(sd, IOVDD, ON);      /* 按照时序来分别给IOVDD、DVDD、AVDD供电 */
		usleep_range(1000, 1200);
		vin_set_pmu_channel(sd, DVDD, ON);
		usleep_range(1000, 1200);
		vin_set_pmu_channel(sd, AVDD, ON);
		usleep_range(1000, 1200);
		vin_gpio_write(sd, PWDN, CSI_GPIO_HIGH);  /* 将PWDN、RESET置为高电平 */
		usleep_range(10000, 12000);
		vin_gpio_write(sd, RESET, CSI_GPIO_HIGH);
		usleep_range(10000, 12000);
		cci_unlock(sd);
		break;
}
```

##### 曝光接口实现

sensor 曝光接口是在 sensor\_s\_exp 函数中实现的（YUV 格式的 sensor 不需要实现返回0即可），需要翻阅 sensor datasheet 查找控制曝光的相关寄存器，一般使用的是手动曝光模式。如下是 gc2053 控制曝光所需要操作的寄存器。

![gc2053控制曝光寄存器](images/gc2053控制曝光寄存器-c8d9ce9149c41c41fa2d7b874a7fcb46.jpg)

由于主控端的 ISP 曝光是以 16 为一行的，而本例中 gc2053 也是以一行为单位的，所以只需要将传入的曝光值exp\_val 除以 16 按照 sensor datasheet 将值写入对应的寄存器。

```c
static int sensor_s_exp(struct v4l2_subdev *sd, unsigned int exp_val)
{
    struct sensor_info *info = to_state(sd);
    int tmp_exp_val = exp_val / 16;                     /* exp_val / 16 得到一行的曝光值 */
    sensor_dbg("exp_val:%d\n", exp_val);
    sensor_write(sd, 0x03, (tmp_exp_val >> 8) & 0xFF);  /* 将曝光值的高8位填入gc2053的控制曝光高位寄存器 */
    sensor_write(sd, 0x04, (tmp_exp_val & 0xFF));       /* 将曝光值的低8位填入gc2053的控制曝光低位寄存器 */
    info->exp = exp_val;
    return 0;
}
```

注：若所调试的 sensor 是以 1/16 行为单位的，则传入的曝光值 exp\_val 可以直接写入 sensor 曝光寄存器 若所调试的 sensor 是以半行为单位的，则传入的曝光值 exp\_val 需要除以 16 得到一行的曝光值然后乘以 2 后写入 sensor 曝光寄存器

##### 增益接口实现

sensor 增益接口是在 sensor\_s\_gain 函数中实现的（YUV 格式的 sensor 不需要实现返回0即可），每个 sensor 的 Gain Table 都是不一样的，这个可以询问一下 sensor 原厂 Gain Table 填写方式或者翻阅 sensor datasheet 进行查找。

本次以思特威 sc1346 为例对 sensor 增益接口实现进行一个简单的说明，如下是 sc1346 的模拟增益表，一般会使用模拟增益，思特威的 sensor 会使用数字增益对模拟增益进行一个平滑过渡。主控端的 ISP 增益精度是 1/16（也就是 16 为一倍增益）。

![sc1346模拟增益表](images/sc1346模拟增益表-45871a3c47623bbd469940d354676edb.png)

```c
static int sensor_s_gain(struct v4l2_subdev *sd, int gain_val)
{
  	struct sensor_info *info = to_state(sd);
	data_type anagain = 0x00;
	data_type gaindiglow = 0x80;
	data_type gaindighigh = 0x00;
	int gain_tmp;

	gain_tmp = gain_val << 3;
	if (gain_val < 32) {     /* 对应数据手册一倍模拟增益，一倍模拟增益到两倍模拟增益（不含两倍模拟增益）以内对应的寄存器值为0x00 */
		anagain = 0x00;
		gaindighigh = 0x00;
		gaindiglow = gain_tmp;  /* 数字增益的计算方式需要询问sensor原厂，这里以思特威提供的计算方式进行一个示例 */
	} else if (gain_val < 64) {
		anagain = 0x08;     /* 对应数据手册两倍模拟增益，两倍模拟增益到三倍模拟增益（不含三倍模拟增益）以内对应的寄存器值为0x08 */
		gaindighigh = 0x00;
		gaindiglow = gain_tmp * 100 / 200/ 1;
	} else if (gain_val < 128) {
		anagain = 0x09;
		gaindighigh = 0x00;
		gaindiglow = gain_tmp * 100 / 200 / 2;
	} else if (gain_val < 256) {
		anagain = 0x0b;
		gaindighigh = 0x00;
		gaindiglow = gain_tmp * 100 / 200 / 4;
	} else if (gain_val < 512) {
		anagain = 0x0f;
		gaindighigh = 0x00;
		gaindiglow = gain_tmp * 100 / 200 / 8;
	} else if (gain_val < 1024) {
		anagain = 0x1f;
		gaindighigh = 0x00;
		gaindiglow = gain_tmp * 100 / 200 / 16;
	} else if (gain_val < 2048) {   /* 数据手册标明最大增益只能到32倍，所以后面的增益模拟增益寄存器值都填写为0x1f */
		anagain = 0x1f;
		gaindighigh = 0x01;
		gaindiglow = gain_tmp * 100 / 200 / 32;
	} else if (gain_val < 4096) {
		anagain = 0x1f;
		gaindighigh = 0x03;
		gaindiglow = gain_tmp * 100 / 200 / 64;
	} else if (gain_val < 8192) {
		anagain = 0x1f;
		gaindighigh = 0x07;
		gaindiglow = gain_tmp * 100 / 200 / 128;
	} else {
		anagain = 0x1f;
		gaindighigh = 0x07;
		gaindiglow = 0xfc;
	}

	sensor_write(sd, 0x3e09, (unsigned char)anagain);      /* 将增益值写入sensor模拟增益寄存器 */
	sensor_write(sd, 0x3e07, (unsigned char)gaindiglow);   /* 将增益值写入sensor数字增益低位寄存器 */
	sensor_write(sd, 0x3e06, (unsigned char)gaindighigh);  /* 将增益值写入sensor数字增益高位寄存器 */

	sensor_dbg("sensor_set_anagain = %d, 0x%x, 0x%x, 0x%x Done!\n", gain_val, anagain, gaindighigh, gaindiglow);
	//sensor_dbg("digital_gain = 0x%x, 0x%x Done!\n", gaindighigh, gaindiglow);
	info->gain = gain_val;

	return 0;
}
```

上述 sensor 驱动的曝光接口和增益接口实现之后，还需要将接口注册到 vin v4l2 框架中，以便上层应用可以调用到相关的接口控制 sensor 的曝光和增益。

sensor\_init\_controls 函数添加增益和曝光控件选项，如下：

```c
static int sensor_init_controls(struct v4l2_subdev *sd, const struct v4l2_ctrl_ops *ops)
{
	v4l2_ctrl_handler_init(handler, 2);
	ctrl = v4l2_ctrl_new_std(handler, ops, V4L2_CID_GAIN, 1 * 1600, 256 * 1600, 1, 1 * 1600);
	ctrl = v4l2_ctrl_new_std(handler, ops, V4L2_CID_EXPOSURE, 1, 65536 * 16, 1, 1);

    if (ctrl != NULL)
		ctrl->flags |= V4L2_CTRL_FLAG_VOLATILE;
	return ret;
}
```

sensor\_s\_ctrl 函数添加 V4L2\_CID\_GAIN 和 V4L2\_CID\_EXPOSURE，对应之前实现的 sensor\_s\_gain 和 sensor\_s\_exp 函数。sensor\_s\_ctrl 下曝光和增益的实现，在于当处于手动曝光模式下，上层可以通过 API 调用到 sensor 驱动实现的 sensor\_s\_exp 和 sensor\_s\_gain 函数。

```c
static int sensor_s_ctrl(struct v4l2_ctrl *ctrl)
{
	struct sensor_info *info =
			container_of(ctrl->handler, struct sensor_info, handler);
	struct v4l2_subdev *sd = &info->sd;

	switch (ctrl->id) {
	case V4L2_CID_GAIN:
		return sensor_s_gain(sd, ctrl->val);
	case V4L2_CID_EXPOSURE:
		return sensor_s_exp(sd, ctrl->val);
	}
	return -EINVAL;
}
```

sensor\_s\_exp\_gain 接口主要用于上层 ISP 算法库做完 3A 算法之后通过 VIDIOC\_VIN\_SENSOR\_EXP\_GAIN 给 sensor 驱动更新曝光和增益。

```c
static int sensor_s_exp_gain(struct v4l2_subdev *sd, struct sensor_exp_gain *exp_gain)
{
	int exp_val, gain_val;
	int shutter = 0, frame_length = 0;
	struct sensor_info *info = to_state(sd);

	exp_val = exp_gain->exp_val;
	gain_val = exp_gain->gain_val;

	if (gain_val < (1 * 16)) {  /* 限制最小增益为1倍 */
		gain_val = 16;
	}

	if (exp_val > 0xfffff)      /* 限制最大曝光值 */
		exp_val = 0xfffff;
	sensor_s_exp(sd, exp_val);
	sensor_s_gain(sd, gain_val);

	info->exp = exp_val;
	info->gain = gain_val;
	return 0;
}

static long sensor_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
{
	int ret = 0;
	struct sensor_info *info = to_state(sd);

	switch (cmd) {
        case VIDIOC_VIN_SENSOR_EXP_GAIN:
            sensor_s_exp_gain(sd, (struct sensor_exp_gain *)arg);
            break;
	    ...
        default:
		return -EINVAL;
	}
	return ret;
}
```

##### 翻转接口的实现

Sensor 设置翻转场景：

-   由于物理结构设计错误，导致镜头或者 sensor 反装，需要在软件上电时就默认翻转回来正确的方向。
    
-   软件规格上需要支持在线设置翻转的功能（SDV、IPC、CDR），供设备倒装放置。
    

翻转功能有两种实现方式：VIPP 翻转，sensor 驱动翻转， 应用层 API 如下：

```c
// V85X平台
文件目录：external/eyesee-mpp/middleware/sun8iw21/media/mpi_vi.c
// V821平台
platform/allwinner/eyesee-mpp/middleware/sun300iw1/media/mpi_vi.c
// V861平台
platform/allwinner/eyesee-mpp/middleware/sun252iw1/media/mpi_vi.c

// 设置 VIPP 翻转，如果输出的图像格式为 LBC 压缩格式的话，不可以使用 VIPP 翻转
AW_S32 AW_MPI_VI_SetVippFlip(VI_DEV ViDev, int Value);
AW_S32 AW_MPI_VI_SetVippMirror(VI_DEV ViDev, int Value);

// 设置 Sensor 驱动翻转，需要按照下文实现驱动的翻转函数
AW_S32 AW_MPI_ISP_SetMirror(VI_DEV ViDev, int Value);
AW_S32 AW_MPI_ISP_SetFlip(VI_DEV ViDev, int Value);
```

**VIPP 实现翻转**

主控端 VIPP 硬件已集成翻转功能，可以完成图像水平、垂直两个方向翻转，但使用时需要留意，当 VIPP 输出格式为 LBC 压缩格式时，VIPP 翻转功能不能使用，这个时候可以选择使用 sensor 驱动完成翻转功能。

**Sensor 驱动实现翻转**

执行 make kernel\_menuconfig，将 CONFIG\_ENABLE\_SENSOR\_FLIP\_OPTION 打开，意味着使用 sensor 驱动完成翻转，不使用 VIPP 翻转：

```c
// Linux-4.9
 → Device Drivers → Multimedia support → V4L platform devices → select sensor flip to replace vipp flip
// Linux-5.4和Linux-6.6
 → Allwinner BSP → Device Drivers → VIN (camera) Drivers → select sensor flip to replace vipp flip
```

![CONFIG\_ENABLE\_SENSOR\_FLIP\_OPTION内核选项](images/CONFIG_ENABLE_SENSOR_FLIP_OPTION内核选项-03cb572eaa23ed0603940bed76e2ff0b.png)

第一步，实现 sensor\_s\_vflip 和 sensor\_s\_hflip 函数。sensor\_s\_vflip 用于设置垂直翻转，sensor\_s\_hflip 用于设置水平翻转。 以思特威 sc3336 为例，规格书中会有翻转寄存器及翻转方向的说明，使用细节及注意事项可以咨询 sensor 原厂。 下图是 sc3336 规格书中对翻转功能的描述：

![SC3336翻转寄存器说明](images/sc3336翻转寄存器说明-42dc6b7e110be7a2e9e3db157629efb3.png)

Sensor 驱动翻转接口实现如下：

```c
/* 设置水平翻转 */
static int sensor_s_hflip(struct v4l2_subdev *sd, int enable)
{
	data_type get_value;
	data_type set_value;

	if (!(enable == 0 || enable == 1))
		return -1;

	sensor_read(sd, 0x3221, &get_value);    /* 读取sc3336翻转寄存器值，获取当前的翻转状态 */
	sensor_dbg("ready to flip, regs_data = 0x%x\n", get_value);
	if (enable)
		set_value = get_value | 0x06;	   /* 水平翻转被使能，设置sc3336翻转寄存器的[2:1]为11 */
	else
		set_value = get_value & 0xf9;      /* 水平翻转被禁用，为了不影响垂直翻转效果以及其他寄存器位，此处 & 0xF9保留水平翻转效果 */

	sensor_write(sd, 0x3221, set_value);   /* 将翻转值写入翻转寄存器 */
	sensor_flip_status = set_value;        /* 全局变量记录当前翻转的状态 */
	return 0;
}

/* 设置垂直翻转 */
static int sensor_s_vflip(struct v4l2_subdev *sd, int enable)
{
	data_type get_value;
	data_type set_value;
	if (!(enable == 0 || enable == 1))
		return -1;

	sensor_read(sd, 0x3221, &get_value);   /* 读取sc3336翻转寄存器值，获取当前的翻转状态 */
	sensor_dbg("ready to vflip, regs_data = 0x%x\n", get_value);

	if (enable) {
		set_value = get_value | 0x60;    /* 垂直翻转被使能，设置sc3336翻转寄存器的[6:5]为11 */
	} else {
		set_value = get_value & 0x9f;    /* 垂直翻转被禁用，为了不影响水平翻转效果以及其他寄存器位，此处 & 0x9f保留水平翻转效果 */
	}
	sensor_write(sd, 0x3221, set_value);   /* 将翻转值写入翻转寄存器 */
	sensor_flip_status = set_value;        /* 全局变量记录当前翻转的状态 */
	return 0;
}
```

第二步，修改 sensor\_get\_fmt\_mbus\_core 接口

RAW sensor 图像是以 Bayer 格式传输的（每个像素只表示 RGB 其中一个分量），常见的 Bayer 格式：RGGB、BGGR、GRBG、GBRG，如图所示，Sensor 规格书中会有说明，也可以直接咨询 Sensor 原厂获取。

![sc3336Bayer顺序](images/sc3336Bayer顺序-b321c4303444f2f4d65783fb7a6c8b62.png)

因为 sc3336 在翻转后自身的 Bayer 格式也会随之发生变化，需要修改 sensor\_get\_fmt\_mbus\_core 函数调整 Bayer 格式，如下：

```c
/* 以sc3336为例 */
默认格式：BGGR      		执行水平翻转：GBRG        再执行垂直翻转：RGGB
排列位置：          		排列位置：          		排列位置：
BG             ==>  	GB             ==>      RG
GR                 		RG                      GB

默认格式：BGGR      		执行垂直翻转：GRBG        再执行水平翻转：RGGB
排列位置：          		排列位置：          		排列位置：
BG             ==>  	GR             ==>      RG
GR                 		BG                      GB
```

```c
/* 将四种情况一一列举，并更新给 *code */
static int sensor_get_fmt_mbus_core(struct v4l2_subdev *sd, int *code)
{
	struct sensor_info *info = to_state(sd);
	data_type get_value;

	sensor_read(sd, 0x3221, &get_value);
	sensor_dbg("read value:0x%x\n", get_value);  //读取翻转寄存器获取当前sensor的翻转状态
	switch (get_value & 0x66) {
	case 0x00:   /* sensor当前没有做翻转操作，Bayer格式为sensor初始化时默认的Bayer格式 */
		*code = MEDIA_BUS_FMT_SBGGR10_1X10;
		break;
	case 0x06:   /* sensor当前处于水平翻转，Bayer格式为GBRG */
		*code = MEDIA_BUS_FMT_SGBRG10_1X10;
		break;
	case 0x60:   /* sensor当前处于垂直翻转，Bayer格式为GRBG */
		*code = MEDIA_BUS_FMT_SGRBG10_1X10;
		break;
	case 0x66:   /* sensor当前水平和垂直同时翻转，Bayer格式为RGGB */
		*code = MEDIA_BUS_FMT_SRGGB10_1X10;
		break;
	default:
		*code = info->fmt->mbus_code;
	}
	return 0;
}
```

第三步，上述 Sensor 驱动的翻转接口实现之后，还需要将接口注册到 vin v4l2 框架中，以便上层应用可以调用到相关的接口控制 sensor 的翻转。

sensor\_init\_controls 函数添加水平和垂直翻转控件选项，如下：

```c
static int sensor_init_controls(struct v4l2_subdev *sd, const struct v4l2_ctrl_ops *ops)
{
	v4l2_ctrl_handler_init(handler, 2);
	v4l2_ctrl_new_std(handler, ops, V4L2_CID_HFLIP, 0, 1, 1, 0);
	v4l2_ctrl_new_std(handler, ops, V4L2_CID_VFLIP, 0, 1, 1, 0);

    if (ctrl != NULL)
		ctrl->flags |= V4L2_CTRL_FLAG_VOLATILE;
	return ret;
}
```

sensor\_s\_ctrl 函数添加 V4L2\_CID\_HFLIP 和 V4L2\_CID\_VFLIP，对应上述的 sensor\_s\_hflip 和 sensor\_s\_vflip 函数。

```c
static int sensor_s_ctrl(struct v4l2_ctrl *ctrl)
{
	struct sensor_info *info =
			container_of(ctrl->handler, struct sensor_info, handler);
	struct v4l2_subdev *sd = &info->sd;

	switch (ctrl->id) {
	case V4L2_CID_HFLIP:
		return sensor_s_hflip(sd, ctrl->val);
	case V4L2_CID_VFLIP:
		return sensor_s_vflip(sd, ctrl->val);
	}
	return -EINVAL;
}
```

第四步，sensor\_ctrl\_ops 添加 .try\_ctrl = sensor\_try\_ctrl，防止重复调用会失效：

```c
// 仅添加对应代码即可
static const struct v4l2_ctrl_ops sensor_ctrl_ops = {
	.g_volatile_ctrl = sensor_g_ctrl,
	.s_ctrl = sensor_s_ctrl,
	.try_ctrl = sensor_try_ctrl,	// 防止重复调用会失效
};
```

注：如果需要在上电初始化时就完成翻转动作，那么可以在 sensor 初始化寄存器列表中添加翻转寄存器设置，是否支持需要咨询 sensor 原厂。

##### 自动降帧的实现

sensor 帧率调节场景：

-   环境照度变化（如照度降低），sensor 在 ISP 的引导下被动降低帧率，以延长曝光时间来提升画面亮度和信噪比。
-   高温环境、缩时录影、高负载下降帧率等应用场景，通过 API 给 sensor 设置帧率，以达到主动调节帧率应对不同场景。

实现自动降帧功能需要对以下几个参数有一个了解：

```
帧：描述一个图像帧（一副图像）

最大曝光时间：当前稳定帧率下，sensor 支持的最大曝光时间，比如帧率是20fps，则最大曝光时间：1 / 20fps = 50ms，如果要加长曝光时间，那么意味着帧率需要下调，以此来满足 sensor 更长的曝光时间

PCLK：像素时钟，是指控制图像传感器中每个像素采样和传输的时钟信号。

HTS：行长，一行的长度，可以理解为包含了 hblank 一行的像素数。

VTS：帧长，一帧的长度，可以理解为包含的行数。

FPS：sensor单位时间内曝光并输出图像的频率，比如帧率是20fps，则代表1秒内输出20帧图像。

PCLK、HTS、VTS、FPS满足以下公式（主流 sensor 通用）： PCLK = HTS * VTS * FPS

由此可以推导出 sensor 帧率由 HTS、VTS、PCLK 决定：FPS = PCLK / (HTS * VTS)
```

注：sensor 动态调整帧率的实现方式（大部分 sensor 都是支持，有些 sensor 可能操作上存在一点差异，需要咨询 sensor 原厂），正是通过动态调整 VTS（HTS 也是可以的，只不过不太常用，也有部分 sensor 可能只能通过调整 HTS 来实现）来实时调整帧率的。

**动态调整帧率**

第一步，确认 sensor 的 VTS、HTS 寄存器，sensor 规格书中，一般会标明 VTS 寄存器的详情和使用方式。如下图所示为思特威 SC3336 VTS 寄存器说明：

![sc3336vts寄存器说明](images/sc3336vts寄存器说明-96526755dda37af5dd1986c2cb682f25.png)

第二步，实现 sensor\_s\_fps 函数

sensor 驱动中提供 sensor\_s\_fps 函数来动态设置 sensor 帧率：

```c
static int sensor_s_fps(struct v4l2_subdev *sd, struct sensor_fps *fps)
```

以 sc3336 为例（提前与 sensor 原厂确认 sensor 是否支持自动降帧且满足公式），通过公式：FPS = PCLK / (HTS \* VTS)来实时计算目标帧率需要的 VTS 并动态设置寄存器，其中要注意做好最大/低帧率限制，防止出现异常情况导致不出图，提供参考代码如下：

```c
static int sc3336_sensor_vts;		// 用于自动降帧策略
static int sc3336_fps_change_flag;	// 帧率变化标志位
static int sensor_s_fps(struct v4l2_subdev *sd, struct sensor_fps *fps)
{
	struct sensor_info *info = to_state(sd);
	struct sensor_win_size *wsize = info->current_wins;
	int sc3336_sensor_target_vts = 0;

	if (fps->fps <= 0 || wsize->hts <= 0) {
		sensor_err("fps->fps = %d, wsize->hts = %d\n!!!!", fps->fps, wsize->hts);
		return -1;
	}

	sc3336_fps_change_flag = 1;
	sc3336_sensor_target_vts = wsize->pclk / fps->fps / wsize->hts;		// 计算目标帧率需要的 VTS 大小

	if (sc3336_sensor_target_vts <= wsize->vts) { // the max fps		// 最大帧率保持，最大帧率限定在原始 setting 输出的帧率，可根据需求自行调整
		sc3336_sensor_target_vts = wsize->vts;
	} else if (sc3336_sensor_target_vts >= (wsize->pclk / wsize->hts)) { // the min fps 最小帧率限制在 1fps，需要与 FAE 沟通此帧率下是否有注意事项，如 VTS 偏移量的控制
		sc3336_sensor_target_vts = (wsize->pclk / wsize->hts) - 8;
	}

	sc3336_sensor_vts = sc3336_sensor_target_vts;
	sensor_dbg("target_fps = %d, sc3336_sensor_target_vts = %d, 0x320e = 0x%x, 0x320f = 0x%x\n", fps->fps,
		sc3336_sensor_target_vts, sc3336_sensor_target_vts >> 8, sc3336_sensor_target_vts & 0xff);
	sensor_write(sd, 0x320f, (sc3336_sensor_target_vts & 0xff));	// 更新 VTS 寄存器，具体寄存器地址以具体 Sensor 为准
	sensor_write(sd, 0x320e, (sc3336_sensor_target_vts >> 8));
	sc3336_fps_change_flag = 0;

	return 0;
}
```

第三步，实现 sensor\_g\_fps 函数用于获取帧率

```c
static int sensor_g_fps(struct v4l2_subdev *sd, struct sensor_fps *fps)
{
	struct sensor_info *info = to_state(sd);
	struct sensor_win_size *wsize = info->current_wins;
	data_type frame_length = 0, act_vts = 0;
	sensor_read(sd, 0x320f, &frame_length);
	act_vts = frame_length << 8;
	sensor_read(sd, 0x320e, &frame_length);
	act_vts |= frame_length;
	fps->fps = wsize->pclk / (wsize->hts * act_vts);
	sensor_dbg("fps = %d\n", fps->fps);
	return 0;
}
```

第四步， 修改 sensor\_ioctl 函数，添加 VIDIOC\_VIN\_SENSOR\_SET\_FPS 和 VIDIOC\_VIN\_SENSOR\_GET\_FPS

```c
static long sensor_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
{
    int ret = 0;
    struct sensor_info *info = to_state(sd);
    switch (cmd) {
        case VIDIOC_VIN_SENSOR_GET_FPS:
            ret = sensor_g_fps(sd, (struct sensor_fps *)arg);
            break;
        case VIDIOC_VIN_SENSOR_SET_FPS:
            ret = sensor_s_fps(sd, (struct sensor_fps *)arg);
            break;
        default:
            return -EINVAL;
    }
	return ret;
}
```

第五步，定义一个全局变量（双目场景共用驱动时需要做区分），用于记录当前的 vts 值，并在 sensor\_reg\_init 中初始化，如下：

```c
static int sensor_reg_init(struct sensor_info *info)
{
	int ret;
	struct v4l2_subdev *sd = &info->sd;
	struct sensor_format_struct *sensor_fmt = info->fmt;
	struct sensor_win_size *wsize = info->current_wins;

	ret = sensor_write_array(sd, sensor_default_regs,ARRAY_SIZE(sensor_default_regs));
	if (ret < 0) {
		sensor_err("write sensor_default_regs error\n");
		return ret;
	}

	sensor_dbg("sensor_reg_init\n");

	sensor_write_array(sd, sensor_fmt->regs, sensor_fmt->regs_size);

	if (wsize->regs)
		sensor_write_array(sd, wsize->regs, wsize->regs_size);

	if (wsize->set_size)
		wsize->set_size(sd);

	info->width = wsize->width;
	info->height = wsize->height;
	sc3336_sensor_vts = wsize->vts;  //初始化sc3336_sensor_vts

	sensor_dbg("s_fmt set width = %d, height = %d\n", wsize->width, wsize->height);

	return 0;
}
```

第六步，应用层调用 API 设置帧率

```c
// V85X平台
文件目录：external/eyesee-mpp/middleware/sun8iw21/media/mpi_vi.c
// V821平台
platform/allwinner/eyesee-mpp/middleware/sun300iw1/media/mpi_vi.c
// V861平台
platform/allwinner/eyesee-mpp/middleware/sun252iw1/media/mpi_vi.c

AW_S32 AW_MPI_ISP_SetSensorFps(ISP_DEV IspDev, int fps);
```

**自动降帧**

自动降帧场景一般比较常见：当拍摄场景进入低照度后，ISP 通过延长曝光时间使得 sensor 自动降帧，从而提高信噪比。

第一步，自动降帧的实现方式大同小异，一般是在 sensor\_s\_exp\_gain 函数中检查当前设置的曝光时间是否超过当前帧率对应的 vts，如果超过则动态调整 vts 来延长曝光时间，如果没有则不需要调整 vts，以 sc3336 为例：

```c
static int sensor_s_exp_gain(struct v4l2_subdev *sd, struct sensor_exp_gain *exp_gain)
{
	struct sensor_info *info = to_state(sd);
	int shutter, frame_length;
	int exp_val, gain_val;

	exp_val = exp_gain->exp_val;
	gain_val = exp_gain->gain_val;
	if (gain_val < 1 * 16)
		gain_val = 16;
	if (exp_val > 0xfffff)
		exp_val = 0xfffff;

	if (!sc3336_fps_change_flag) {				 // 检查是否在主动调节帧率，通过标志位或者锁互斥即可
		shutter = exp_val >> 4;					// 主控 曝光行（时间）是以16为1行，所以将上层传下来的曝光行除以16，换算当前实际曝光行
		if (shutter > sc3336_sensor_vts - 8) {	  // 判断当前曝光时间是否大于当前帧率下的 VTS（“-8”只是偏移量，每个sensor都是不一样的）
			frame_length = shutter + 8;			 // 如果大于当前帧率下的 VTS，那么意味着需要增加 VTS 来达到降帧的目的，以此实现自动降帧
		} else
			frame_length = sc3336_sensor_vts;	  // 如果曝光时间未达到需要调整 VTS 来降帧的情况下，那么还是保持当前帧率需要 VTS 值即可
		sensor_write(sd, 0x320f, (frame_length & 0xff));
		sensor_write(sd, 0x320e, (frame_length >> 8));
	}
	sensor_s_exp(sd, exp_val);
	sensor_s_gain(sd, gain_val);
	sensor_dbg("sensor_set_gain exp = %d, %d Done!\n", gain_val, exp_val);
	info->exp = exp_val;
	info->gain = gain_val;

	return 0;
}
```

第二步，调整 ISP 效果文件的最大曝光时间

以下是对 AE Table 进行一个简要的说明， AE Table 用于设定当前效果的曝光表，如图所示，Min Exp 代表最小曝光时间（倒数）—— 1/22000s，Max Exp 代表最大曝光时间（倒数）—— 1/20 s，Min Gain 代表最小增益、Max Gain 代表最大增益（均以 256 为一倍），光圈调节暂不支持，故需要设置为默认值266。

AE 调整亮度的逻辑：第 0 档为起始档位，\`AE 会保持一倍增益的前提下，优先提高曝光时间来达到提升亮度的目的，曝光时间的可调范围为 1/22000s，1/20s，如果曝光时间提高到 1/20s 的状态还没有达到期望亮度，那么会开始向下顺延执行第1档的设定：维持曝光时间为 1/20s 的前提，开始提高增益的倍数，增益的可调范围\[256，32768\]（也就是 1x ~ 128x），以此类推，直到达到最大曝光时间和最大增益。

![设置为20帧时ae\_table表](images/设置为20帧时ae_table表-7f7c77e32c02c20d7eef778c035211fd.png)

如果当前帧率为 20fps，则需要限制最大曝光时间为 1/20s，那么意味着 ISP 给驱动设置的最大曝光时间则不会大于 1/20s（50ms），如果有自动降帧需求，那么可以将最大曝光时间设置大于 1/20s，例如设置为 1/10s，意味着最大曝光时间从 50ms 调整到 100ms，驱动发现当前曝光时间大于当前 vts 时，便会重新调整 vts 来降帧延长曝光时间。

![设置为10帧时ae\_table表](images/设置为10帧时ae_table表-754d8517aa9f5443112de523db158465.png)

同样，也可以通过修改当前 sensor 的 ISP 效果头文件来验证自动降帧功能是否生效。

![isp\_cfg\_ae\_table修改方法](images/isp_cfg_ae_table修改方法-b5a069a2261ac9a8f66548a61b7fb2a2.png)

可以通过指令 cat /sys/kernel/debug/mpp/vi 查看 vi 结点的帧间隔来检查降帧是否有生效，如下，internal 指的是当前 sensor 输入图像的帧间隔时长，50ms 对应 20fps：

![vi未降帧节点信息](images/vi未降帧节点信息-66d19b52ab40b4646e7e476071885fb1.png)

当降帧策略生效时（API 设置帧率或自动降帧），可以看到 50ms 更新为 100ms，意味着帧率从 20fps 下降到 10fps：

![vi降帧节点信息](images/vi降帧节点信息-96705b547a25a96dab501c5172b99173.png)

##### 两个 Sensor 共用一份 Sensor 驱动

全志平台支持两个 sensor 共用一份 sensor 驱动，需要修改的内容如下，也可以参考 SDK 中已经支持两个 sensor 共用一份 sensor 驱动的驱动。

```c
/*  下面的设置代表有两个sensor，同名sensor可以共用同一个驱动，SENSOR_NAME要与board.dts中的sensor0_mname一致  */
#define SENSOR_NUM    0x2
#define SENSOR_NAME   "gc2053_mipi"
#define SENSOR_NAME_2 "gc2053_mipi_2"

static int sensor_probe(struct i2c_client *client,
			const struct i2c_device_id *id)
{
    ...
	if (client) {
		for (i = 0; i < SENSOR_NUM; i++) {
			if (!strcmp(cci_drv[i].name, client->name))
				break;
		}
		cci_dev_probe_helper(sd, client, &sensor_ops, &cci_drv[i]);
	} else {
		cci_dev_probe_helper(sd, client, &sensor_ops, &cci_drv[sensor_dev_id++]);
	}
    ...
	return 0;
}

static int sensor_remove(struct i2c_client *client)
{
    ...
	if (client) {
		for (i = 0; i < SENSOR_NUM; i++) {
			if (!strcmp(cci_drv[i].name, client->name))
				break;
		}
		sd = cci_dev_remove_helper(client, &cci_drv[i]);
	} else {
		sd = cci_dev_remove_helper(client, &cci_drv[sensor_dev_id++]);
	}
    ...
	return 0;
}

static const struct i2c_device_id sensor_id[] = {
	{SENSOR_NAME, 0},
	{}
};

static const struct i2c_device_id sensor_id_2[] = {
	{SENSOR_NAME_2, 0},
	{}
};

MODULE_DEVICE_TABLE(i2c, sensor_id);
MODULE_DEVICE_TABLE(i2c, sensor_id_2);

static struct i2c_driver sensor_driver[] = {
	{
		.driver = {
			   .owner = THIS_MODULE,
			   .name = SENSOR_NAME,
			   },
		.probe = sensor_probe,
		.remove = sensor_remove,
		.id_table = sensor_id,
	}, {
		.driver = {
			   .owner = THIS_MODULE,
			   .name = SENSOR_NAME_2,
			   },
		.probe = sensor_probe,
		.remove = sensor_remove,
		.id_table = sensor_id_2,
	},
};
static __init int init_sensor(void)
{
	int i, ret = 0;

	sensor_dev_id = 0;

	for (i = 0; i < SENSOR_NUM; i++)
		ret = cci_dev_init_helper(&sensor_driver[i]);

	return ret;
}

static __exit void exit_sensor(void)
{
	int i;

	sensor_dev_id = 0;

	for (i = 0; i < SENSOR_NUM; i++)
		cci_dev_exit_helper(&sensor_driver[i]);
}
```

#### DVP接口

dvp 接口 sensor 配置方式大部分内容与 MIPI 接口一样，有以下几处地方需要进行修改：

##### 定义分辨率相关配置

分辨率相关配置填写在 sensor\_win\_sizes 数组内成员变量，各成员变量定义和填写规则如下：

```c
//dvp接口的YUV sensor
static struct sensor_win_size sensor_win_sizes[] = {
    {
        .width = HD1080_WIDTH,
        .height = HD1080_HEIGHT,
        .hoffset = 0,
        .voffset = 0,
        .fps_fixed = 25,
        .regs = reg_1080p25_2ch,
        .regs_size = ARRAY_SIZE(reg_1080p25_2ch),
        .set_size = NULL,
    },
}

//dvp接口的raw sensor
static struct sensor_win_size sensor_win_sizes[] = {
	{
        .width = VGA_WIDTH,
        .height = VGA_HEIGHT,
        .hoffset = 0,
        .voffset = 0,
        .hts = 640,
        .vts = 480,
        .pclk = 9216 * 1000,
        .fps_fixed = 1,
        .bin_factor = 1,
        .intg_min = 1,
        .intg_max = 480 << 4,
        .gain_min = 1 << 4,
        .gain_max = 10 << 4,
        .regs = sensor_vga_regs,
        .regs_size = ARRAY_SIZE(sensor_vga_regs),
        .set_size = NULL,
	},
}
```

##### 配置DVP接口

sensor\_g\_mbus\_config 函数赋值也需要进行一个修改，如下：

```c
//dvp接口 BT601 协议的 raw/YUV sensor
static int sensor_g_mbus_config(struct v4l2_subdev *sd, struct v4l2_mbus_config *cfg)
{
	cfg->type = V4L2_MBUS_PARALLEL;
	cfg->flags = V4L2_MBUS_MASTER | VREF_POL | HREF_POL | CLK_POL;
	return 0;
}

//dvp接口 BT656/BT1120 协议的 YUV sensor
static int sensor_g_mbus_config(struct v4l2_subdev *sd, struct v4l2_mbus_config *cfg)
{
	cfg->type = V4L2_MBUS_BT656;
	cfg->flags = CLK_POL | CLK_POH | CSI_CH_0 | CSI_CH_1;  //与当前AHD RX使用的初始化寄存器配置有关，当前使用的是2chn
	return 0;
}
```

对于 interlace 隔行输入 dvp 接口的 sensor，需要在 sensor\_probe 函数将成员变量 sensor\_field 修改为 V4L2\_FIELD\_INTERLACED，如下：

```c
static int sensor_probe(struct i2c_client *client, const struct i2c_device_id *id)
{
	struct v4l2_subdev *sd;
	struct sensor_info *info;
	int ret;

	info = kzalloc(sizeof(struct sensor_info), GFP_KERNEL);
	if (info == NULL)
		return -ENOMEM;
	sd = &info->sd;
	cci_dev_probe_helper(sd, client, &sensor_ops, &cci_drv);
	sensor_init_controls(sd, &sensor_ctrl_ops);
	mutex_init(&info->lock);

	info->fmt = &sensor_formats[0];
	info->fmt_pt = &sensor_formats[0];
	info->win_pt = &sensor_win_sizes[0];
	info->fmt_num = N_FMTS;
	info->win_size_num = N_WIN_SIZES;
	info->sensor_field = V4L2_FIELD_INTERLACED;  /* sensor_field 修改为 V4L2_FIELD_INTERLACED */
}
```

### WDR 模式

mipi 接口 sensor WDR 配置方式大部分内容与 mipi 接口线性模式配置一样，有以下几处地方需要进行修改，如下

#### Sensor 初始化寄存器配置

sensor WDR 初始化寄存器配置与线性模式是不同的，需要翻阅 sensor datasheet 或者询问 sensor 原厂，查看当前 sensor 是否支持 WDR 模式，如支持，需要根据实际应用场景让 sensor 原厂提供对应分辨率和帧率下的初始化寄存器配置。

#### 定义分辨率相关配置

 sensor\_win\_sizes 需要添加两个成员变量，此处以 gc4663 为例，如下：

```c
static struct sensor_win_size sensor_win_sizes[] = {
    {
            .width      = 2560,
            .height     = 1440,
            .hoffset    = 0,
            .voffset    = 0,
            .hts        = 1375,
            .vts        = 2400,
            .pclk       = 132 * 1000 * 1000,
            .mipi_bps   = 648 * 1000 * 1000,
            .fps_fixed  = 15,
            .bin_factor = 1,
            .if_mode    = MIPI_VC_WDR_MODE, /* if_mode成员需要填写为 MIPI_VC_WDR_MODE */
            .wdr_mode   = ISP_DOL_WDR_MODE, /* wdr_mode成员需要填写为 ISP_DOL_WDR_MODE */
            .intg_min   = 1 << 4,
            .intg_max   = 1600 << 4,
            .gain_min   = 1 << 4,
            .gain_max   = 110 << 4,
            .regs       = sensor_2560x1440p15_wdr_regs,
            .regs_size  = ARRAY_SIZE(sensor_2560x1440p15_wdr_regs),
            .set_size   = NULL,
            .top_clk    = 300*1000*1000,
            .isp_clk    = 297*1000*1000,
    },
}
```

注：if\_mode 成员根据当前 sensor WDR 模式下数据传输方式进行填写，一般分为 LI Output 和 VC mode 这两种模式，可以翻阅数据手册或者询问 sensor 原厂。

LI Output：line information output，这种方式是长短帧都在同一个通道交替输出，CSI 拿到后根据 delay line 进行拆分，if\_mode 成员需要填写为 MIPI\_DOL\_WDR\_MODE。

VC Mode：virtual channel mode，这种方式是 MIPI 虚拟出两个通道分别输出长短帧，if\_mode 成员需要填写为 MIPI\_VC\_WDR\_MODE。

如下，是索尼 imx335 DOL WDR 模式下两种数据传输方式 LI Output 和 VC mode 的描述：

LI Output 模式长短帧只有一个 frame start 和 frame end，因为是在一个通道交替输出的，输出的间隔可以受 VBP1 控制。

![imx335WDR模式LI\_Output描述](images/imx335WDR模式LI_Output描述-8e7dc465e994880d6e0c2acd7d616f3f.png)

VC 模式长短帧分别都有一个 frame start 和 frame end，是因为分开了两个虚拟通道。

![imx335WDR模式VC\_Mode描述](images/imx335WDR模式VC_Mode描述-f47e9dd5fca507f43fb9d7705982e9a0.png)

#### 配置 MIPI 接口及 Channel 通道

sensor\_g\_mbus\_config 需要根据当前是否是 WDR 模式，对应传输接口定义需要进行修改，如下：

```c
static int sensor_g_mbus_config(struct v4l2_subdev *sd, struct v4l2_mbus_config *cfg)
{
	struct sensor_info *info = to_state(sd);
	cfg->type  = V4L2_MBUS_CSI2;

    /* 两lane senor WDR模式需要再添加一个标志 V4L2_MBUS_CSI2_CHANNEL_1*/
	if (info->isp_wdr_mode == ISP_DOL_WDR_MODE)
		cfg->flags = 0 | V4L2_MBUS_CSI2_2_LANE | V4L2_MBUS_CSI2_CHANNEL_0 | V4L2_MBUS_CSI2_CHANNEL_1;
	else
		cfg->flags = 0 | V4L2_MBUS_CSI2_2_LANE | V4L2_MBUS_CSI2_CHANNEL_0;

	return 0;
}
```

#### 增益和曝光函数修改

曝光函数的实现 WDR 模式与线性模式差异点在于需要将 ISP 传下来的短曝光值通过换算写入到 sensor 驱动的短曝光寄存器里面，WDR sensor 在 WDR 模式下会有长帧和短帧，所以需要填写 sensor 的短曝光和长曝光寄存器，短曝光与长曝光的换算关系如下：`短曝光（曝光行） = 长曝光（曝光行） / 曝光比`。如下是 gc4663 短曝光寄存器和长曝光寄存器描述：

![gc4663\_短曝光寄存器](images/gc4663_短曝光寄存器-1592092a9f8bb9a6595bb813a7668a25.png)

![gc4663\_长曝光寄存器](images/gc4663_长曝光寄存器-d53e4cd24ba9a0fc7893df09f5089e15.png)

对应的驱动曝光函数修改如下：

```c
static int sensor_s_shutter(struct v4l2_subdev *sd, unsigned int intt_long, unsigned int intt_short)
{
	unsigned int intt_long_h, intt_long_l, intt_short_h, intt_short_l;
	unsigned int short_exp_max = 900, long_exp_max = 0;

	if (intt_long <= 1)
		intt_long = 1;
	if (intt_short < 1)
		intt_short = 1;

	if (intt_short >= short_exp_max)
		intt_short = short_exp_max;
	long_exp_max = 2400 - intt_short - 16;
	if (intt_long >= long_exp_max) {
		intt_long = long_exp_max;
		intt_short = intt_long / HDR_RATIO;
	}

    /* 将换算后的长曝光和短曝光值分别写入sensor短曝光和长曝光寄存器 */
	intt_long_l = intt_long & 0xff;
	intt_long_h = (intt_long >> 8) & 0x3f;
	intt_short_l = intt_short & 0xff;
	intt_short_h = (intt_short >> 8) & 0x3f;

	sensor_write(sd, 0x0202, intt_long_h);
	sensor_write(sd, 0x0203, intt_long_l);
	sensor_dbg("sensor_set_long_exp = %d line Done!\n", intt_long);
	sensor_write(sd, 0x0200, intt_short_h);
	sensor_write(sd, 0x0201, intt_short_l);
	sensor_dbg("sensor_set_short_exp = %d line Done!\n", intt_short);

	return 0;
}

static int sensor_s_exp(struct v4l2_subdev *sd, unsigned int exp_val)
{
	struct sensor_info *info = to_state(sd);
	int tmp_exp_val = exp_val / 16;  //sensor以一行为单位，将ISP设置下来的长曝光值除以16得到长曝光值
	int exp_short = 0;

    /* 需要根据当前模式是WDR还是线性模式，填写对应的曝光寄存器 */
	if (info->isp_wdr_mode == ISP_DOL_WDR_MODE) {
		sensor_dbg("Sensor in WDR mode, HDR_RATIO = %d\n", HDR_RATIO);
		exp_short = tmp_exp_val / HDR_RATIO;   //短曝光（曝光行）= 长曝光（曝光行）/ 曝光比，曝光比与sensor相关，本例中gc4663曝光比为32
		sensor_s_shutter(sd, tmp_exp_val, exp_short);
	} else {
		sensor_dbg("exp_val:%d\n", exp_val);
		sensor_write(sd, 0x202, (tmp_exp_val >> 8) & 0xFF);
		sensor_write(sd, 0x203, (tmp_exp_val & 0xFF));
	}

	info->exp = exp_val;
	return 0;
}
```

WDR 模式下增益函数也需要进行修改，同线性模式一样，每个 sensor 的 Gain Table 都是不一样的，这个可以询问一下 sensor 原厂 Gain Table 填写方式或者翻阅 sensor datasheet 进行查找。如下是 gc4663 增益函数实现：

```c
static int setSensorGain(struct v4l2_subdev *sd, unsigned int gain)
{
	struct sensor_info *info = to_state(sd);
	int i, total;
	unsigned int tol_dig_gain = 0;

	total = sizeof(analog_gain_table) / sizeof(unsigned int);
	for (i = 0; i < total; i++) {
		if (i ==  0) {
			if (analog_gain_table[i] > gain)
				break;
		}
		if (i < total - 1) {
			if ((analog_gain_table[i] <= gain) && (gain < analog_gain_table[i + 1]))
				break;
		}
		if (i == total - 1) {
			if (gain >= analog_gain_table[i])
				break;
		}
	}
	if (i >= total)
		i = total - 1;

	tol_dig_gain = gain * 64 / analog_gain_table[i];

      /* 需要根据当前模式是WDR还是线性模式，填写对应的Gain Table */
	if (info->isp_wdr_mode == ISP_DOL_WDR_MODE) {
		sensor_write(sd, 0x02b3, reg4663ValTable_wdr[i][0]);
		sensor_write(sd, 0x02b4, reg4663ValTable_wdr[i][1]);
		sensor_write(sd, 0x02b8, reg4663ValTable_wdr[i][2]);
		sensor_write(sd, 0x02b9, reg4663ValTable_wdr[i][3]);
		sensor_write(sd, 0x0515, reg4663ValTable_wdr[i][4]);
		sensor_write(sd, 0x0519, reg4663ValTable_wdr[i][5]);
		sensor_write(sd, 0x02d9, reg4663ValTable_wdr[i][6]);
	} else {
		sensor_write(sd, 0x02b3, reg4663ValTable[i][0]);
		sensor_write(sd, 0x02b4, reg4663ValTable[i][1]);
		sensor_write(sd, 0x02b8, reg4663ValTable[i][2]);
		sensor_write(sd, 0x02b9, reg4663ValTable[i][3]);
		sensor_write(sd, 0x0515, reg4663ValTable[i][4]);
		sensor_write(sd, 0x0519, reg4663ValTable[i][5]);
		sensor_write(sd, 0x02d9, reg4663ValTable[i][6]);

		sensor_write(sd, 0x20e, (tol_dig_gain>>6));
		sensor_write(sd, 0x20f, ((tol_dig_gain&0x3f)<<2));
	}

	return 0;
}

static int sensor_s_gain(struct v4l2_subdev *sd, int gain_val)
{
	struct sensor_info *info = to_state(sd);

	if (gain_val == info->gain) {
		return 0;
	}

	sensor_dbg("gain_val:%d\n", gain_val);
	setSensorGain(sd, gain_val * 4);
	info->gain = gain_val;
	return 0;
}
```

### 运行 MPP sample

在完成 sensor 驱动的移植，驱动模块正常加载，I2C 正常通信后，将会在/dev 目录下创建相应的 video 节点，此时可以运行 mpp sample sample\_virvi 打开对应的 video 节点进行图像采集。（mpp sample sample\_virvi 使用方法可以参考一号通文档《Tina\_Linux\_MPP\_Sample\_使用说明》）

运行 sample\_virvi 时会根据配置文件打开对应的 video 节点进行图像采集，如下是 sample\_virvi 正常运行的情况：

![samplevirvi正常运行时打印](images/samplevirvi正常运行时打印-a9f3e7029be9747d3439b2ea2bac795f.png)

 如果主控端没有收到 sensor 端发过来的数据，则会出现 select timeout 打印，如下：

![samplevirvi运行异常时打印](images/samplevirvi运行异常时打印-289231484ea537bdbc2d2be65f282f4f.png)

 同时，可以执行指令 cat /sys/kernel/debug/mpp/vi 查看当前打开的 video 节点 cnt 值是否一直在增长。

![mppvi节点信息](images/mppvi节点信息-3107f4192bba782b1e353ca9811a5641.png)

### Sensor 驱动接口调用流程

 如下是 sensor 驱动挂载驱动接口的调用流程：

![sensor驱动挂载调用流程](images/sensor驱动挂载调用流程-cd01366b2fe004858ae4b9e9378eb6fe.png)

 如下是运行 sample\_virvi 驱动接口的调用流程：

![运行samplevirvi调用流程](images/运行samplevirvi调用流程-d6dda804361155d6f390626db371d58d.png)

### 异构快启系统 Sensor 移植指导

这个章节是对异构快启系统 Sensor 驱动 移植的简要说明。移植前需要确保该 Sensor 驱动在 Linux 系统已经正常运行并且出图，再进行小核 Sensor 驱动移植，Linux 系统 Sesnor 驱动调试请参考前面章节。

异构快启系统 Linux 系统下 sensor 驱动需要修改以下两点：

1.函数 sensor\_probe()添加一下两个语句：

```c
info->preview_first_flag = 1;
info->first_power_flag = 1;
```

2.修改加载驱动方式

```c
// V85X 平台
#ifdef CONFIG_SUNXI_FASTBOOT
subsys_initcall_sync(init_sensor);
#else
module_init(init_sensor);
#endif

// V821和V861 平台，可以参考 bsp/drivers/vin/modules/sensor/gc1084_mipi.c
VIN_INIT_DRIVERS(init_sensor);
```

| 平台 | 小核驱动路径 |
| --- | --- |
| V85X | lichee/rtos-hal/hal/source/vin/modules/sensor/ |
| V821/V861 | rtos/lichee/rtos/drivers/rtos-hal/hal/source/vin/modules/sensor/ |

将 Linux 系统已经点亮的驱动移植到 melis 这边，melis 系统提供的系统接口与 Linux 差异较大，需要修改 sensor 驱动解决编译错误，具体可以参考同级目录下已经点亮的 sensor 驱动文件。

此处以 V851s 快启开发板所使用的 gc2053 为例进行说明：

#### 添加驱动文件

将 Linux 系统已经点亮的 sensor 驱动添加到 melis 系统 sensor 驱动文件下(lichee/rtos-hal/hal/source/vin/modules/sensor)，melis 系统提供的系统接口与Linux差异较大，需要修改 sensor 驱动解决编译错误，具体可以参考同级目录下已经点亮的 sensor 驱动文件。

#### 添加 MakeFile

进入 lichee/rtos-hal/hal/source/vin/modules/sensor 目录，打开 MakeFile 文件，添加指定语句，这一步的作用是将.c 源文件编译为.o 文件，如下图所示：

![melis系统Makefile文件修改位置](images/melis系统Makefile文件修改位置-3df1d9e978e2f83b1525b8e125894c19.png)

#### 添加 Kconfig

在同级目录下的 Kconfig 文件中，将本文件按照格式添加进去，V85X使用 melis menuconfig 来选择配置, V821和V861使用mrtos menuconfig 来选择配置

![melis系统Kconfig文件修改位置](images/melis系统Kconfig文件修改位置-ce40c1521703e0d09c25b83c9b144091.png)

#### 配置 menuconfig

V85X平台使用 mmelis menuconfig， V821、V861平台使用 mrtos menuconfig，进入配置选择对应驱动。

```c
// V85X
 Kernel Setup -> Drivers Setup -> SoC HAL Drivers  -> VIN Devices  -> enable vin driver (DRIVERS_VIN [=y])  -> sensor driver select
// V821和V861
 Kernel Setup -> Drivers Setup -> SoC HAL Drivers  -> VIN Devices  -> enable vin driver (DRIVERS_VIN [=y])  -> sensor driver select
```

![melis\_menuconfig配置界面](images/melis_menuconfig配置界面-012207bfeefaa4d3b400f3d48b531772.png)

#### 添加 sensor\_fuc\_core 结构体

camera.h (lichee/rtos-hal/hal/source/vin/modules/sensor)\`添加 sensor\_fuc\_core 结构体，如下：

```c
extern struct sensor_fuc_core gc2053_core;
```

#### 注册 func\_core 结构体

sensor\_register.c (lichee/rtos-hal/hal/source/vin/modules/sensor)\`注册 sensor 驱动的 func\_core 结构体，如下：

```c
struct sensor_cfg_array sensor_array[] = {
#ifdef CONFIG_SENSOR_GC2053_MIPI
    {"gc2053_mipi", &gc2053_core},
#endif
};
```

#### 修改 vin 板级配置文件

V85X平台，板级配置文件如下：

```c
// 目录：lichee/rtos-hal/hal/source/vin/platform/vin_config_sun8iw21p1.c
struct sensor_list global_sensors[VIN_MAX_CSI] = {
	/*mipi0 parser0*/
	[0] = {
		.used = 1,
		.sensor_name = "gc2053_mipi",
		.sensor_twi_addr = 0x6e,  //sensor twi地址
		.sensor_twi_id = 1,       //使用的twi组号
		.mclk_id = 0,             //使用的mclk id号
		.use_isp = 1,
		.id = 0,
		.addr_width = 8,          //twi地址位宽
		.data_width = 8,          //twi数据位宽
		.reset_gpio = GPIOE(6),   //reset引脚配置
		.pwdn_gpio = GPIOE(7),    //pwdn引脚配置
		.ir_cut_gpio[0] = 0xffff,
		.ir_cut_gpio[1] = 0xffff,
		.ir_led_gpio = 0xffff,
	},
}
```

 V821、V861 平台，板级配置文件如下：

```c
// V821目录：rtos/board/v821_e907/板级/configs/sys_config.fex
// V861目录：rtos/board/v861_e907/板级/configs/sys_config.fex
// 以V821 pef2-fastboot 为例：rtos/board/v821_e907/perf2_fastboot/configs/sys_config.fex
[vind]

vind_user	= 1
csi_top	= 200000000
csi_top_parent = 1200000000

[vind/sensor0]
sensor0_used          = 1
sensor0_mname         = "gc1084_mipi"
sensor0_twi_cci_id    = 0
sensor0_twi_addr      = 0x6e
sensor0_mclk_id       = 0
sensor0_isp_used      = 1
sensor0_power_en      = port:PD12<default><default><default><default>
sensor0_pwdn          = port:PD12<default><default><default><default>
sensor0_reset         = port:PD12<1><0><1><0>
sensor0_sm_hs         = port:PD12<default><default><default><default>
sensor0_sm_vs         = port:PD12<default><default><default><default>
sensor0_ir_cut0       = port:PD12<default><default><default><default>
sensor0_ir_cut1       = port:PD12<default><default><default><default>
sensor0_ir_led        = port:PD12<default><default><default><default>
```

#### 修改引脚配置

TWI 引脚配置需要修改对应板级方案下的 sys\_config.fex，以 V851s 快启开发板板级配置为例，修改 lichee/melis-v3.0/source/projects/v851-e907-perf2-board/configs/目录下的 sys\_config.fex 文件。

![快起开发板twi引脚硬件连接图](data:image/png;base64,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)

![melis系统中sysconfig文件twi修改图](images/melis系统中sysconfig文件twi修改图-8d0979ad982030f8b73f529dda7ae669.png)

如果所使用的 TWI 组号不是公版默认的 TW0 或 TW1，需要在对应板级方案 main.c 中添加 TWI 信号注册。以 V851s 快启开发板板级配置为例，修改 lichee/melis-v3.0/source/projects/v851-e907-perf2-board/src/ 目录下的 main.c。如下：

![main函数添加twi信号回调函数注册](images/main函数添加twi信号回调函数注册-a228f7d967369d78a4bd42f96b41f657.png)

sensor 所使用的 MCLK`、`PWDN(sensor使能引脚)`和 RSTN(sensor复位引脚)`也是在 sys\_config.fex 下进行修改的，如下：

![快起开发板sensor引脚硬件连接图](images/快起开发板sensor引脚硬件连接图-82c4d281d8d5b2ac0636aa951088a438.png)

![melis系统中sysconfig文件sensor修改图](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnUAAACkCAIAAAB+aE+gAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABvZSURBVHhe7Z3Bq2THdca90EK72WljMBEzmqexRsJhsDQZ9CJGeDFazSJYBoPwyll4oUXQQmRWsxiUAeEs4oADgjBGC+9mI4xCEAEthBAhiIAkAgmEJGAIhpC/IPnIRw6HU3Wr+3bf1/Ne3x/8eNQ9depU1a3T9b3qfq/vt37vu98HAACAZUFfAQAAlgd9BQAAWB70FQAAYHnQVwAAgOVBXwEAAJZnR3198aXv/fJHTz/+ybfeuv2dfFl4cPdSbgUAALASdtTXd954xgpqfW2x4k7VAgAAHDe76OutGy98+OOn3jx9dqCgsstHnsUOAACwBmbr68n1Gw/uXtL5dXBCdZV8ih0AAGAlzNZXCaq0Uwo60FcOrwAAsHLm6WvW1Cl95fAKAAAwT1+lmg/uXjq5fkPlKX3l8AoAADBDX+/cvJqFs6uvHF4BAADEDH2VasY/thbCh8MrAACAmPf+cKY9v3J4BQAAMEvqq8o6y965eTUsAAAA62R3fQUAAIAp0FcAAIDlQV8BAACWB30FAABYHvQVAABgedBXAACA5UFfAQAAlgd9BQAAWB70FQAAYHmevL7+7E/+9N/+47e/+6//Nh/86tfF4YLym7/9u5jU1//0Lz9864+LAwAAHDHnRV+lRsV+NHzxD/+IvgIArI0d9dVfPvz4J9/K3z9868YLH/74qXioTq4acKH1NR++f/ufv/uzP//L4iDQVwCAFbKjvsaz6kJE79y8qsv4cn9fbiOxF1dfpabSVMmnL1XoSiz6CgCwQnbRV59T3zx9Nj8/R4r74O6lk+s3fKmCLrd5Vt1AXwenQ8mVRKutUhzZ791/GA1z5EHAqaoPfvVrX0omXSs3OauqCKeHFHIboK8AACtktr6GcJbn08miSxl92T69boopfbU95EqXKlulSpXahiKqnAVS6qhL/83UIKDdYgwO4lauEm5oERWOlodtTxnDYtQQfQUAWBuz9VWSaR0tCupLnWt1unU5H2cHtEJlJJCSSYtcQc5qooa+tOZZ/7I0ihx8KmBuni1CZatmHp57L9FsfPzRxzKGp0FfAQBWyDx9zZpa9NXE57LbvDNspvTV9iyWppVDYQ1TwToX0puDTwW0UpYBOI4K1tfSRIS+5vHoEn0FAAAxT1+lmnEq7Z5fhQr+gNZnWdcOmNJXYemSvAnpliRNxpDJwkZ9Fd2A5SRq1MRKOdZXHVhzfPQVAADMDH29c/Nqlsysr/5Q1uKaa2X05YCBvgYWM6FCPi+2jPU1yAFdbvVVDVWY0ldHLlXRKoO+AgCskBn6Gu/9toSaxgeuobjRfIpt9FVkFRwo1pb6KiJgK9jZMqWvogyjjWMGowUAgGNl9t83Bfn8Kqy+5f9ft/kUdkoCJWnZqLKPmypbGlslEwN9HQQsIjqoyngYEVPjyV0H6CsAwApZTF9FOeCWP32aYnDElFHaZop0uVXUCkugmmTPEnwQ0DraVg30VVhi21YZ9BUAYIXsrq9LUSTw+EBfAQBWCPp65qCvAAArBH09c9BXAIAVcl701R9hDj7pvHDkz3rRVwCAtfHk9RUAAOD4QF8BAACWB30FAABYHvQVAABgedBXAACA5TlyffX3Kx3N3yQDAMBFAX0FAABYnh311V8+XL5k2I999ZcP52fpPEGKvub/tZVdteEJZ83rz7/y+eXXhAqlCgDg+NhRX+Or/ENf/cCceH6OHCTAkmFfPimyvrr8xf8/dUcFJPYwXLv28qMrp+Ldq7fQVwBYCbvoq8+pb54+G8/PaZ+lY5+Nj9D5zfBxN4Pj5g//72Gr3aryhVDC+lq+p9ARQm7h7Hj/uVffPrmlgn6irwCwEmbrqx+cruNp1lSraRxes1tYugz01eXQP12qbHUsVfIPifUhNRTal9LXHNnIKOmVMSxw1qCvALAeZuurBNVv/GZ9bc+v1lcRli4DfQ1pdFWmtMonUf3Mh9QIUqI5wuOPPpbRFtiI73N+Y8DIWDynQF8BYD3M09eBpuqoqiOsDrK+lN1/5eTLKQb66rK27yKx3fd1Lau5uWn1NTfXJfp6SNBXAFgP8/RVIirJ9B8Gt2dW1fqPnsRPf/DtPd8fFvnAJCGURoaPjZlt9FUH1uyAvh4Y9BUA1sMMfb1z82o+obb6mhnXBmN9DayOltju+dUM9DVUWeWode9xCWN4fxgAYHtm6Gs+nhaKp5AYS1+lssVeKPoq8dN+3eqrCKVUuXzIGrTSq7ICdlsNdBrOCPQVANbDvPeHM4MTavksdoAF1frncuirLrPQquzzq8rW2q40ZjeVJd6hym4VMdU8SzscAPQVANbDYvqqQhxnN37smpHgWValdvfuP9SZMiQwqlybtTDe7w0sosJnVqGC3aLKEutaxPVgSFa/vny78OjKaXEDADgmdtdXAAAAmAJ9BQAAWB70FQAAYHnQVwAAgOVBXwEAAJYHfQUAAFge9BUAAGB50FcAAIDlQV8BAACWB30FgPOCv2EtvnBtI/kb2VQotduT43S/2/zsWOGU18O69NVflxjfvwiwDaTNwZglNnZe9hEditaKzZkmwAqnvB7m6eudm1fjS4ZNfkiOv5HY9i2/3//ADJLGVfFbofK4OMBq2WGv0Z7lXJrKKO2nU5nmPXRu1YDXn3/l88uvLfhkhcUDBp7glmKjFZl7KzZyzvX1OKa8Hmbr65Rwyqiq+Gb/7R+hc0imksYpHr8VqrB4EsPFZTd9zXuWLqWmOYIsX371jXyyUf6yiE8+/axk4KCqoIByc9fXrr386MqpePdqfXLR9pM604AFvxK3Fxv1qH6LfR/KwpmpqTFlGLOYvkpQH9y9dHL9hi9V0OXGB+koq7xZeAMSOXu05Fp428ue4mXuVnVbKSFsKThRSoY5goy+hAuEFlRrd+/+w0iPvBdMpc1UHo7TJsfM+SO6GSU3X7qJOvVow02tHFk/S1YPqjIevz3F+8+9+vbJLRW6TwaUm5zVJBsLZx1Q5EUxITa+bza2s1YQL1M2CrnJuW1V/N1vHonQ8PKKeEYt0coOTBm6LKOv7bNg/U6yjGHpoqzy4nm1nFtCZadCrKIWNfKmVOlSZefHoFXURqJMGT0qGcMCFwW/+IU3LC9lLsdC2zNXiTYPRTdtArctW6Hi5D3LlsgoNVFZYdVEhdzQqK8SMJiq8phjRoWuHAoPvgzVHCagJqLpxL31pR2mXsvuosWeaqVC9K5y3C5F8G13VXdZ5d8OvusZMGWYYq/PX+PDV785rFq7SWhV9ebpszLaMoXXKa+iEyIKkRnOVOdTzsjCoJXoJk2J5giPP/pYxvCBA+OFi30kkLF4FrR8covVjAQomRBVDjjIQzHea1yrOAoYxrJn5b5c65FMRZYltshCt8pxhArZHkzJoXD+l7YHC1huVH4xegnC3/cwr2Bx6OKAvsPF30NyVVDGY7qeGaYMXebpa8bvAPs4G/qa3xb2YTc3afG+Frth0CaWcB6o4LVvG45biW7SRH7n5rqUMbvBhaBsKMIJkDedwM4qTOWh2bjXtLjT2LN0qd41BpUdLfoqnkZ9hX+hrfLU2iCZgRwKDynCHixge2PtWV6Mge9VXHr5FCQsLbmL4t/2LrrL0fUs2GfNU4aW3fVVWFZ1WnVBB9b8LvE++uqVU1UhUs25aGMs8MZW3aRxfuvAmqs0JBnDBy4KZUMR3j5iFwu7kLNXeSoPTTdtxqjTkoGxfzm1Ykvqdu2Bdbettsp95S5atpFDBVEoXR4sYHtjY5kiQkFBwlkN5SPPsIS9tHIXxb/tXWio24yzJQa82ilDy1766o9ddVqN/8yJt4iF3yWOyy7dzUVosbXk2yybs9M7zsZW3aSJLMnDcF7GJRwYL6V3ikzea7qUDUV4+4hdLOwiVnkqD802e02hu2cZVeUZmZK06sspnY2mW+URTjURu72de9YBbcw31m21ENvsAF6+3IuNup+xlLmL4t/2LroL1/XMMGXospe+Sk1DU3f+++GcGZnuqneJBFV53Goqg0urKTc4/0xtKO2aZssgD8U4H9xFzh9RMirobltyljFb5FD25WCqyoOcmsWUHHri3aEeIKAt+caqHA5T9zAoay0cMLfKN7z4e6iuCrqdtuPMMGWYYnd99XvCoaDxXrEvZdfh1X/9NMDrFMmXsWp2F1j+OUVUjh1n0Mqoqt2e3CpiyqckMVwUyoaSl7IkW06bQR6abtoYty218u/uPnJu4zhCtuSxFQZVQv0qVGRy0JVDuclZTbKxcNYBVYjpqKzF0qUXQkaVB9HsX16n8o+AjhDd+T47uMt5JEbNuwuXw2bUXEEGgxSqzR2pEKFUPsopg5mnr5LP+OPh8m6wsMS6ahtxFXn5W5RGSibnhAlPr7EpCTdoJfx7WVRFqkVeijaD4aKQE0OUjSO2GJFXeZyHYipthPOtdDTYs1q7I6hQBm/kP64qyDO6kAp+ffl24dGVU1W50zyRKc40oNA98XRUcJBYCF/GfEVeI8VRrXzCIhRWwe2s2vd+/os8KhWi6t79h/J0Vdgz0UrksFHFlGHMXu8PA5w39MpvNyAAgMODvsJRgb4CwDkBfYWjAn0FgHMC+gpHBfoKAOcE9BUAAGB50FcAAIDlQV8BAACWB30FAABYHvQVAABgeY5BX/3VS4Mv3wGAC8Hc13L+2jUVSu325Dj5i5YOwAqnvB7QV4AN8J1wB2PWa9nOXyz6RbiK1orNmSbACqe8Hubpqx+YkynfM+yvIBYqhPGs2T5BnTTxq58aFgeAlh32Gu1ZTrOpZFO6du2DFHWeu2rWgeP151/5/PJr3cfd7MbiAQPPcUux0Yq0N3BPzrm+HseU18NsfZ3STj+QTvz0B98+n/pqt/jVT4XFMxWOkt30Ne9ZupQo5giyfPnVN/LJxkGKWo8jyVWlIWlgvswoYHR97drLj66cinev1sfdbD+pMw1Y2PK1bBRn6ibsjG5sO7apqTFlGLOYvr7zxjN+OJ1+bq+vTrt79x9qzfyLuVdusOS57CbGCToVUJSYKuhSRl/CcTBIAJHTJv92peTxpfLBtXKTs9r6stDGLOnaTTa5+dJN1KlHG25TKWr/3Kk35WwxHn/Y33/u1bdPbqmw1OPkFg8o8qKYEBvfARvzehkFUUM1z0bhm9O2Kv7tXRUaXl4Cz6glWtmBKUOXxfQ1mKuvXjynl366LHubRk4OFZxMsd6+dAQHjAyLgG1iucoB4WiYyqgoRw7YM1cJ7xre44Q9u7tS4LZ5UxNlz7Ilkk1NVFZYNVHBDQcpmjPceIR5j4t9ObsFXTkU7qIM1RwmoKcWs84z9Q2JOcrHN9ldtNhTrVSI3lWOpVEE33ZXtTdcyL8dfNczYMowxWx9HXz4anbQ10g+p6PWWxanRVhUq4yRUYWSEDlBS8DIkuxjN9kff/SxjLbAucLr7k0kI2PxLExlVE6kXOWA8lcrtY1aZ4jL473GtYoTCSlKiua+XOuR5MiDFG0HUALaQagQPpkpORTut7Q9WMByo8prOft7ynkFi0MXB/StK/4eUr6roozHdD0zTBm6zNPXjD9wbaV0rr6WFfJia/Fk108vs32UglrRduEHCRrO4ZNT1gHtCcfBIKO01jlthJ1VUCZkVS60KbeRsmfpUr1rDCo7WvQVnuMUzRGEBhO/bbhh7q5lIIfCQ4r4BwvY3lh7lpsQ+F7FpZdPQcLSkrso/m3vIpYjG7ueBfusecrQsru+ComopNQfuwaL6KtXTjknvvzqG6ElVNnOZeEjQVWeyif76DSQ26qJjC7DcTCVUTlJAjk7AWRfXF8VMMj7l7MutqToemOK5piffPqZYsoS9naLzGwjhwpy4IDtjY1liggFBQnndq3DXlq5i+Lf9i401G3G2RIDXu2UoWUvfX3xpe/98kdPv/PGM9m4oL6qVijzZHQ5V0WTvHXKngOGswtKBbsZO8clnB/0atdax2YR5L2mS0kA4YzKSRJEAsiu4KU2aFNuI909y6gqz8jIOCtFy5B8qQlqmuGT2e3t3LMOaGO+sW6rO+AE0G2JqhbfnNyLjfke5i6Kf9u76C5c1zPDlKHLXvrqj2P1Mxv30ddYVKeafkmPk6svlQptFqoc6TXIp5JG22QzXDjGGZWXO1uUPEXYMuNUcRc5tURJtiAnZCBnGV3IrQb9aqh5msLOU7OYkkNPvDvUAwS0JU9Q5XAod6OlrLVwwNwq3/Di76G2a9F22o4zw5Rhit311W8Ol8Or2EdftZxx6bTzEjpjIjP0M34rdAT/AhiXEdAN3cq/cLkscl9wNJQEyKvsTcF5Ys/IolLVojjhXHDbUiv/7u4j5zaOI6iwZYoOBqOqeJlkunIoNzmrSTYWzjqgCjEXlTVfXXohfDcG0exf7o/8I6AjRHe+zw7uch6JUfPuwuWwGTVXkMEghWpzRypEKJWPcspg5umrtDP//XA+uZYq8+DupXDo4qUK8jK7KlJBy6lLJ0pcChWUbco5V8k/55+rIkgkn2jTFI6AQUaJ2GJETgDbI7taFEShom1klHCOlY6UllN7Vmt3BJenUjTPS0Fs7CLP6EIq+PXl24VHV05V5U7zRKY404Bi6rUsfBkTF3mNFCffIqOwCm5n1b7381/kUakQVffuP5Snq8KeiVYih40qpgxj9np/eH+0Tm26AOwMGQUA5wT0FY4KMgoAzgnoKxwVZBQAnBPQVzgqyCgAOCc8YX0FAAA4StBXAACA5UFfAQAAlgd9BQAAWB70FQAAYHkupL7m77jJ34oiPuh9/xwAXAj80s7fWDQmbwUqlNrtGWwpZ80Kp7weLvb59Yvm2+bQV1icn/GdcIdiltjYWZtAse9Du6WIM02AFU55PczTVz8wJ/PLHz394kvfc23+CuIHdy+dXL8RDc+IufrqpIlf/abcADI77DXKTKfZVLIpUaeS0HtoW7VP9v7+tZf/5soffn359tsnt0rVDrz+/CufX36t+/ycPfHctxQbrcjc+7CRc66vxzHl9TBbX6eejSNxDU31c2EPILGz9NV5rCa+VGHxTIWjZDd9zZmpS4lijiDLl199I59slL8s4pNPPyvJuX32KmB5UYj3n3vV38Uf+rr9pHLAa9defnTlVLx7tT4/Z7eABU9ze7FRj+q32PehLJyZmhpThjGL6Wthm6fUKbG0VEos/fRmoZXWNqTFDh/V+hd2EZtL0GZG0VflgRoqvsrFWQVdtjHhQuON7N79h1p0p03eC7w72J7zJNLGGSjkJmfnT0sbs+RhN9mch8JN1KlHG25q5cj6mYfnqjZgm70efx6e8HHzpyd/oCNsPr/KTc5tkEwJKJ12BP1c5Pl0Ii+K0Z1xladpY7khQkG8TNko5CbntlXxd795JELDy/fZM2qJVnZgytDlyevrP//rv//FX/21FlgFrZl3Ojs4LyPzVIiyKZkh3Nzp5TxwWrSJJU/VyhgWOAK86JE2XuVcjhywZ64S3jW8xwl7dnelwG3LVthmpiyRbGqissL6JZAbGvWVA26TvbEve0aBT5zSRb9FXN4fdpwyVDMV0HT1VcwNqDlqpjE1X9rBs/aKiLgn7qLFnmqlQvSuctxJRfBtd1V7V4X828F3PQOmDFPs9flr/vC18M4bzwxqjRPLmaGlch545aI252VLmxnyzxnZTWLhtHv80ccy2gLnCqeEN5GMjMWzoJWVWyy040SOqRCetjhgyRbhDHF5vNe4VnFyHpbMzH251iOZiiyL09iXG7PXcYQKtgQSQsmqxLWrr8LBS9tBQDOlr2JWwHKj8kw9zfD3PcwrWBy6OKDvcPH3kFwVlPGYrmeGKUOXefqaObl+48HdS91DqmVYElvshUgsp5HX2DudarfJpDYz1FwxP/n0s7Jdlr6csnYOHzgC2rRxkuRNJ7CzCs46/cy1wca9pqVkpi7Vu8agsqNFX20OC/UV/mKcva5tg4isqVP6Kjyk6HEQMBjoq9gyYHtj7VlmGvhexaWXT0HC0pK7KP5t76K7HF3Pgn3WPGVo2V1fhZRV+vrW7e9ko8V1mz9uKonlNdal9bW76oXWx82NymF3X/qVPyeNHGQMHzgCyoYinCSRbGEXcnYCOG1KbbDNXlNQp5GHImepsy62pG7XHlj4jLPXfXVfLO8/9+qjK6fXrr2s8kZ9VRCF0uUgYLCNvm4M2N7YWKaIUFCQcFZD+cgzLGEvrdxF8W97FxrqNuNsiQGvdsrQspe++u+E8znVirvxnWETiaWl1QJ7jXWpBVNtyYwubWZ401Fk57cubY9UCItwF3EJ5wenhNarIGPxLLRp4ySJZAu7iARw1pXaYJu9ptDds4wzsyBj9lFfTmNfbsxeO+Qm4o9ObmYJ3OH94RIwM9DX7QPamG+s22qaToByWwq+A7kXG/ONyl0U/7Z30V24rmeGKUOXvfTVR1X99OUscRUlsbzGulSuqNaFSJoubWbI3wntmDm5i7MdxtkMF46pDaVd7mwZJ9s4VdxFTi1Rki3obltyljFb5JBTV5SA7ZBsybOI/8lpiVaeeHeobcDMlL7OCmhLnoXK4VCm3FLWWjhgbpVvePH3UNu1aDttx5lhyjDF7vpqNY3D61xxFWN9tTHvMqoSLps2M+QQTZxnkV7uLnJLbUumwhFQNpS8yk6tSCF5RqqUqhbFyamYcdtS22amkXMbxxGyJY/NqCzLxuyVXaHCLdOeX+UmZzUJS8tUwK6+7hBQhZipypqULr0QnvIgmv3LTZB/BHSE6M732cFdziMxat5duBw2o+YKMhikUG3uSIUIpfJRThnMPH3N39CUT65CQpurzIO7l8KhxamgVbeUeo2dBOGjVXRO5BX1Ahcin3JOuAuRL+3f3Z7golNyo2wcscWInAC262d4Fpyi0TbvUAqiUKWjwZ7V2h1BhW5iy99uW2avgnS7LvrqTvNEpsgB1bwchcWjK6eq2i2giNe4Cg4SC+FL15q8RorT3geFVXA7q/a9n/8ij0qFqLp3/6E8XRX2TLQSOWxUMWUYs9f7wwDnDb3y2w0IAODwoK9wVKCvAHBOQF/hqEBfAeCcgL7CUYG+AsA5AX0FAABYniepr//z96g7AAAcJ+grAADA8qCvAAAAy4O+AgAALA/6CgAAsDzoKwAAwPLMUzg/MCcTX+hfqrZ5/iv6CgAAx8psff3wx0/duvFCsRf8XNiNEou+AgDAsXIm+ireuv2djc+qQ18BAOBYQV8BAACWZ7a+5g9ZpxTUz1qXxBZ7AX0FAIBjZXeFO7l+48HdS/k4a1m19L7zxjPhOQX6CgAAx8peCjc4p0pfN76TjL4CAMCxspfC+e+Eu0dVV43fIkZfAQDgWNlL4fxxrH4Wu0BfAQBgzeyucH5zuHt49Uez/P0wAACslnkKp/Oo/3zJ5JNrqRqfXA36CgAAx8qTVDj0FQAAjhX0FQAAYHnQVwAAgOVBXwEAAJYHfQUAAFgeFA4AAGB50FcAAIDlQV8BAACWB30FAABYHvQVAABgedBXAACA5UFfAQAAlgd9BQAAWB70FQAAYHnQVwAAgKX57vf/F64ogZ291GW4AAAAAElFTkSuQmCC)

V821、V861平台，引脚配置也是在板级配置文件中修改：

```c
// V821目录：rtos/board/v821_e907/板级/configs/sys_config.fex
// V861目录：rtos/board/v861_e907/板级/configs/sys_config.fex
// 以V821 pef2-fastboot 为例：rtos/board/v821_e907/perf2_fastboot/configs/sys_config.fex
;----------------------------------------------------------------------------------
;twi configuration
;[twix]
;twi_sck    scl的GPIO配置
;twi_sda    sda的GPIO配置
;----------------------------------------------------------------------------------
[twi0]
twi_sck  = port:PA03<4><1><default><default>
twi_sda  = port:PA04<4><1><default><default>
```

### 运行 demo\_video\_in

在完成 sensor 驱动的移植，驱动模块正常加载，TWI 正常通信后，将会在/dev 目录下创建相应的 video 节点，此时可以运行 rt-meida demo demo\_video\_in 打开对应的 video 节点进行图像采集。

（rt-meida demo demo\_video\_in 使用可以参考快启 SDK 文档：external/fast-user-adapter/rt\_media/rt\_media-demo使用说明.md）

运行 demo\_video\_in 时会根据配置文件打开对应的 video 节点进行图像采集，如下是 demo\_video\_in 正常运行的情况：

![demo\_video\_in正常运行打印信息](images/demo_video_in正常运行打印信息-1ece00ea56ee8c5c0471bbbc973114f1.png)

## 常见问题汇总

### 串口读写 Sensor 寄存器

【读 sensor 寄存器命令示例】

```
1）cd /sys/devices/gc2053_mipi（进入目标 sensor 节点目录）
2）echo 16 > addr_width; echo 8 > data_width（输入目标 sensor 寄存器地址/数据位宽，请查阅 datasheet 获取）
3）echo 1 > read_flag（read_flag：读写控制节点，使能为1表示后续操作为读动作，使能为0表示后续操作为写动作）
4）echo 30350021 > cci_client（“30350021”：表示读取0x3035【目标寄存器地址】，在 read_flag = 1 情况下，写入值0021为无效状态）
5）cat read_value（打印上一步操作的结果：寄存器值）
```

【写 sensor 寄存器命令示例】

```
1）cd /sys/devices/gc2053_mipi（进入目标 sensor 节点目录）
2）echo 16 > addr_width; echo 8 > data_width（输入目标 sensor 寄存器地址/数据位宽，请查阅 datasheet 获取）
3）echo 0 > read_flag（read_flag：读写控制节点，使能为1表示后续操作为读动作，使能为0表示后续操作为写动作）
4）echo 36510021 > cci_client （“36510021”：0x3651【目标寄存器地址】，0x0021【将要写入的寄存器值】，在 read_flag = 0 情况下，写入值为0x0021）
5）cat read_value
```

### TWI 通讯异常

主控读写 sensor 寄存器都是通过 TWI 来完成的，所以在调试 sensor 时经常会遇到 TWI 通讯异常，如下：

#### TWI 被占用

TWI 被占用一般是 TWI 配置有冲突导致的，需要检查当前方案 sensor 所使用的 TWI 在 uboot.dts 和 sysconfig.fex 是否也配置上了，需要将其注释掉，如下是 TWI4 被占用的打印：

![TWI被占用时打印信息](images/TWI被占用时打印信息-6a5471768044b63b1229733f994bbfbf.png)

sysconfig.fex 和 uboot.dts 修改如下，将 TWI4 配置注释掉：

![sysconfig修改图](data:image/png;base64,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)

![uboot\_dts修改处](images/uboot_dts修改处-0912bc1353a104414488171c3e0a8ba3.png)

#### TWI 通讯异常

如图 TWI 通讯异常的打印，如果出现 TWI 通讯异常，建议先从几个方面进行排查：

![TWI通讯异常打印信息](images/TWI通讯异常打印信息-17dae74af8272ee587a2bba21ab53bd6.png)

-   检查 board.dts 当前方案 sensor 所使用的 TWI 引脚配置是否正确，是否被其他模块使用。
    
-   检查 board.dts 当前方案 sensor 的 TWI 地址是否正确。
    
-   TWI SCK SDA 引脚硬件上是否有接上拉电阻。
    
-   检查 sensor 驱动的上电时序（sensor\_power 函数）是否有问题，如果上电时序没有问题，需要用万用表量一下 sensor 三路供电 IOVDD、DVDD 和 AVDD 是否符合 sensor 硬件设计指南上的需求，IOVDD 一般是 1.8V, DVDD 一般是 1.2V，AVDD 一般是 2.8V。
    
-   检查 board.dts 当前方案 sensor 的 MCLK 引脚配置是否有冲突，如果配置没有问题，需要使用示波器量一下 sensor 端 MCLK 是否有输出以及频率是否正确，是否与 sensor 驱动配置的一样。
    
-   检查 board.dts 当前方案 sensor 的 PWDN 和 RESET 引脚配置是否有冲突，如下，当前方案 sensor 使用的 PE11 引脚与音频模块有冲突，需要将其注释掉。
    
    ![引脚定义冲突示例](images/引脚定义冲突示例-21f6a8376c8e2fa1f25cd41fb9661232.png)
    

#### TWI 读出来的寄存器值异常

如果 TWI 通讯没有出现异常，但是主控端读取到 sensor 寄存器值都为0，则需要检查一下 sensor 驱动配置的 TWI 数据位宽和地址位宽是否与 sensor datasheet 说明一样，见 Sensor TWI 数据位宽和地址位宽章节说明。同时，检查一下 sensor 三路供电 IOVDD`、`DVDD 和 AVDD 是否正常。

![TWI读取sensor\_id失败打印信息](images/TWI读取sensor_id失败打印信息-f4087fe3c793cb4cae9c6f3f5e88a1d7.png)

### select timeout 不出图

主控将 sensor 初始化配置写进 sensor 之后，一般 sensor 就会有数据输出，如果出现`[ISP_ERR]video_wait_buffer, line: 488,video8 select timeout!`，则表示当前 video 节点所在的 sensor 是没有数据给到主控端，或者是给过来的数据是有问题的。

![select\_timeout打印](images/select_timeout打印-022f7779db2a44214b8079e83f8a62a9.png)

出现 select timeout 的打印可以从以下几点定位问题：

#### 检查 SOC MIPI 寄存器状态

##### MIPI-Parser 寄存器

在 sample\_virvi 运行起来之后，连续抓取 parser 寄存器，这个寄存器值表示 SOC 收到图像的宽高信息，可以快速判断 SOC 是否收到图像数据，抓取寄存器指令如下：

【V85X平台】

以 V85X 平台为例，MIPIA检查 0x05820034 寄存器，MIPIB检查 0x05821034 寄存器。

-   MIPIA/MIPI0：cd /sys/class/sunxi\_dump && echo 0x05820000, 0x05820100 > dump; cat dump
-   MIPIB/MIPI1：cd /sys/class/sunxi\_dump && echo 0x05821000, 0x05821248 > dump; cat dump

![MIPIParser寄存器说明](images/MIPIParser寄存器说明-65eb055c455bf503343fe20fb4fcd665.png)

【V821平台】

以 V821 平台为例，MIPIA检查 0x45820034 寄存器，MIPIB检查 0x45821034 寄存器。

-   MIPIA/MIPI0：cd /sys/class/sunxi\_dump && echo 0x45820000, 0x45820200 > dump; cat dump
-   MIPIB/MIPI1：cd /sys/class/sunxi\_dump && echo 0x45821000, 0x45821200 > dump; cat dump

![V821\_PARSER寄存器](images/V821_PARSER寄存器-560fc59cd8edd2de4c2a453b6ef9bfd3.png)

【V861平台】

以 V861 平台为例，MIPIA检查 0x05820034 寄存器，MIPIB检查 0x05821034 寄存器。

-   MIPIA/MIPI0：cd /sys/class/sunxi\_dump && echo 0x05820000, 0x05820100 > dump; cat dump
-   MIPIB/MIPI1：cd /sys/class/sunxi\_dump && echo 0x05821000, 0x05821248 > dump; cat dump

![V861\_PARSER寄存器](images/V861_PARSER寄存器-500e39108047395b18141aa2de8da98f.png)

##### MIPI-PHY 寄存器

在通路运行起来之后，连续抓取 MIPI-PHY 寄存器，以 V85X 平台 MIPI0 lane0 为例，检查 0x058101f0 寄存器\`(MIPI1：0x058102f0 寄存器值)的\[19:16\]和\[0:3\]的值，如果 LP 状态处于 3(0011)，则表示 sensor 没有发数据，如果 LP 状态处于 3-5 之间切换，则代表有数据，抓取寄存器指令如下：

【V85X平台】

-   MIPIA/MIPI0：cd /sys/class/sunxi\_dump && echo 0x05810100, 0x058101fc > dump; cat dump
    
-   MIPIB/MIPI1：cd /sys/class/sunxi\_dump && echo 0x05810200, 0x058102fc > dump; cat dump
    

![MIPIPHY寄存器clk状态值说明](images/MIPIPHY寄存器clk状态值说明-e2ad028c7af002eb9713d63a1390cb35.png)

![MIPIPHY寄存器data状态值说明](images/MIPIPHY寄存器data状态值说明-a42bf253f158768bc9896beb7207fe3c.png)

【V821平台】

-   MIPIA/MIPI0：cd /sys/class/sunxi\_dump && echo 0x45810100, 0x458101ff > dump; cat dump
    
-   MIPIB/MIPI1：cd /sys/class/sunxi\_dump && echo 0x45810200, 0x458102fc > dump; cat dump
    

![V821\_PHY寄存器](images/V821_PHY寄存器-8659eeea0cf167b3e2db19b63cb59855.png)

【V861平台】

-   MIPIA/MIPI0：cd /sys/class/sunxi\_dump && echo 0x05810100, 0x058101fc > dump; cat dump
    
-   MIPIB/MIPI1：cd /sys/class/sunxi\_dump && echo 0x05810200, 0x058102fc > dump; cat dump
    

![V861\_PHY\_4-31寄存器](images/V861_PHY_4-31寄存器-ec7277a2243acd74e50ec95672a72b39.png) ![V861\_PHY\_0-3寄存器](images/V861_PHY_0-3寄存器-57c1770ecbd810deac63ce34f12467c1.png)

##### MIPI-PAYLOAD 寄存器

在通路运行起来之后，连续抓取 MIPI-PAYLOAD 寄存器，检查\[31：07\]的 ERR PD 标志位是否被置位，如果 ERR PD 被置位，需要检查 MIPI 波形是否正常，抓取寄存器指令如下：

【V85X平台】

以 V85X 平台为例，MIPIA检查 0x05811118 寄存器，MIPIB检查 0x05811518 寄存器。

-   MIPIA/MIPI0：cd /sys/class/sunxi\_dump && echo 0x05811000, 0x058111ff > dump; cat dump
-   MIPIA/MIPI1：cd /sys/class/sunxi\_dump && echo 0x05811400, 0x058115ff > dump; cat dump

![MIPIPAYLOAD寄存器说明](images/MIPIPAYLOAD寄存器说明-5dacee580504c26ec28aaeec1ab21a74.png)

【V821平台】

以 V821 平台为例，MIPIA检查 0x45811118 寄存器，MIPIB检查 0x45811518 寄存器。

-   MIPIA/MIPI0：cd /sys/class/sunxi\_dump && echo 0x45811000, 0x458111ff > dump; cat dump
-   MIPIA/MIPI1：cd /sys/class/sunxi\_dump && echo 0x45811400, 0x458115ff > dump; cat dump

![V821\_PAYLOAD寄存器](images/V821_PAYLOAD寄存器-1b9370780415d391da5c2667ee253bab.png)

【V861平台】

以 V861 平台为例，MIPIA检查 0x05811118 寄存器，MIPIB检查 0x05811518 寄存器。

-   MIPIA/MIPI0：cd /sys/class/sunxi\_dump && echo 0x05811000, 0x058111ff > dump; cat dump
-   MIPIA/MIPI1：cd /sys/class/sunxi\_dump && echo 0x05811400, 0x058115ff > dump; cat dump

![V861\_PAYLOAD寄存器](images/V861_PAYLOAD寄存器-fdba1542c3c6b1a1fd044d6b92164857.png)

通过上述查看寄存器的方式，可以先初步判断一下是否是 sensor 端没有发送数据过来，与此同时，可以使用示波器量一下 sensor 端的 mipi data 和 mipi clk 引脚是否有波形，如果没有量到波形，则需要检查一下 sensor 驱动的初始化配置是否与 sensor 原厂提供初始化配置一致，同时需要将问题反馈给 sensor 原厂。如果初步检查Sensor有发送数据，且 SOC MIPI 状态有在轮转，那么可以尝试调节 MIPI Clk Delay 寄存器。

#### 调节 MIPI Clk Delay 寄存器

##### 确定 clk delay 范围

PS：需要在边跑应用出图的同时来调试，尽可能在边预览图像边调试，方便判断调整后图像是否还存在花屏、异常横/竖线等异常现象。 第一步，连续多次抓取 MIPI PAYLOAD 寄存器，检查bit【7-12】等异常中断标志位是否被置起，以此来判断 MIPI 状态是否异常。

| 平台 | MIPIA | MIPIB |
| --- | --- | --- |
| V85X/V861 | 0x05811118 | 0x05811518 |
| V821 | 0x45811118 | 0x45811518 |

````c
// V85X、V861
// MIPIA
cd /sys/class/sunxi_dump && echo 0x05811118 0xffffffff > write			// 清除中断标志位
cd /sys/class/sunxi_dump && echo 0x05811000, 0x058111ff > dump; cat dump
// MIPIB
cd /sys/class/sunxi_dump && echo 0x05811518 0xffffffff > write			// 清除中断标志位
cd /sys/class/sunxi_dump && echo 0x05811400, 0x058115ff > dump; cat dump

// V821
// MIPIA
cd /sys/class/sunxi_dump && echo 0x45811118 0xffffffff > write			// 清除中断标志位
cd /sys/class/sunxi_dump && echo 0x45811000, 0x458111ff > dump; cat dump
// MIPIB
cd /sys/class/sunxi_dump && echo 0x45811518 0xffffffff > write			// 清除中断标志位
cd /sys/class/sunxi_dump && echo 0x45811400, 0x458115ff > dump; cat dump
```第二步，如图所示，bit【24:20】是 clk lane0 的软件设定延时值，起到延时采样的作用，适当调整这个参数可以使得 SOC 与 Sensor 的时序更加匹配。

| 平台       | MIPIA       | MIPIB          |
| ----------- | ----------- | -------------- |
| V85X/V861   | 0x05810118  | 0x05810218     |
| V821        | 0x45810118  | 0x45810218     |

```c
// V85X、V861
// MIPIA PHYA 读指令
cd /sys/class/sunxi_dump && echo 0x05810100, 0x058101fc > dump; cat dump
// PHYA 0x05810118 寄存器写指令
cd /sys/class/sunxi_dump && echo 0x05810118 0x00000000 > write
// MIPIB PHYB 读指令
cd /sys/class/sunxi_dump && echo 0x05810200, 0x058102fc > dump; cat dump
// PHYB 0x05810218 寄存器写指令
cd /sys/class/sunxi_dump && echo 0x05810218 0x00000000 > write

// V821
// MIPIA PHYA 读指令
cd /sys/class/sunxi_dump && echo 0x45810100, 0x458101ff > dump; cat dump
// PHYA 0x45810118 寄存器写指令
cd /sys/class/sunxi_dump && echo 0x45810118 0x00000000 > write
// MIPIB PHYB 读指令
cd /sys/class/sunxi_dump && echo 0x45810200, 0x458102fc > dump; cat dump
// PHYB 0x45810218 寄存器写指令
cd /sys/class/sunxi_dump && echo 0x45810218 0x00000000 > write

// 示例：V85X 0x05810118 clk delay 配置为 2
cd /sys/class/sunxi_dump && echo 0x05810118 0x00200000 > write
````

![V821\_DESKEW寄存器](images/V821_DESKEW寄存器-b2e353384d865cb57ca34c5fa8aba676.png)

第三步，保持 clk dly 为 0x0，步进递增延时值，同时检查步骤一是否出现异常状态。例如设置 clk dly 等于 0x0，步进递增至0x9 时，MIPI状态满足步骤一（即 MIPI 状态寄存器值异常），那么 clk dly 适用的的范围为【0x0，0x8】，最佳值是取这个范围的中间也就是 0x4。

##### Sensor 驱动配置 clk delay

将调试出来的 clk delay 值配置到 Sensor 驱动。

```c
// 请配置在 sensor_init 函数中
static int sensor_init(struct v4l2_subdev *sd, u32 val)
{
	int ret;
	struct sensor_info *info = to_state(sd);

	sensor_dbg("sensor_init\n");

	/*Make sure it is a target sensor */
	ret = sensor_detect(sd);
	if (ret) {
		sensor_err("chip found is not an target chip.\n");
		return ret;
	}

	info->focus_status = 0;
	info->low_speed = 0;
	info->width = 1280;
	info->height = 720;
	info->hflip = 0;
	info->vflip = 0;
	info->gain = 0;
	info->exp = 0;
	info->deskew = 0x4;		// 配置 clk delay 参数

	info->tpf.numerator      = 1;
	info->tpf.denominator    = 20;	/* 30fps */
	return 0;
}
```

### 翻转失效或图像异常

#### 翻转失效

在调用水平或垂直方向进行翻转，API 已返回成功后，画面延迟生效或者概率性失效，大部分 sensor 在设置翻转寄存器到生效需要一小段时间，可以在设置寄存器后加一点点小延时来规避，也可以通过回读寄存器来大致估摸需要的延时时长，或者在代码中添加回读机制，保证翻转寄存器被更新到后才执行其它操作，如下：

```c
// gc2083垂直翻转示例
data_type sensor_flip_status;	//定义私有全局变量，用于记录当前翻转状态
static int sensor_s_vflip(struct v4l2_subdev *sd, int enable)
{
	unsigned int iic_addr;
	data_type get_value;
	data_type set_value;
	data_type value_0015;
	data_type value_0d15;
	int times_out = 3;
	int eRet;

	if (!(enable == 0 || enable == 1)) {
		sensor_err("Invalid parameter!!!\n");
		return -1;
	}

	sensor_i2c_addr_get(sd, &iic_addr);
	get_value = sensor_flip_status & 0x03;
	if (enable)
		set_value = get_value | 0x02;
	else
		set_value = get_value & 0xFD;

	sensor_write(sd, 0x0015, set_value);
	sensor_write(sd, 0x0d15, set_value);
	do {
		/* write repeatly */
		sensor_write(sd, 0x0015, set_value);	//覆写寄存器
		sensor_write(sd, 0x0d15, set_value);
		eRet = sensor_read(sd, 0x0015, &value_0015);	//回读寄存器
		eRet = sensor_read(sd, 0x0d15, &value_0d15);
		sensor_print("[V] eRet:%d, value_0015 = 0x%x, value_0d15 = 0x%x, times_out:%d\n", eRet, value_0015, value_0d15, times_out);
		usleep_range(10000, 30000);
		times_out--;
	} while ((value_0015 != set_value) && (value_0d15 != set_value) && (times_out >= 0));	//通过覆写和回读，确认寄存器已被更新

	if ((times_out < 0) && ((value_0d15 != set_value) || (value_0015 != set_value))) {
		sensor_err("set vflip failed, please set more times!!!\n");	//寄存器未能被更新到，上报异常
		return -1;
	} else {
		sensor_flip_status = set_value;
	}
	sensor_print("vflip current_switch_choice : 0x%x, set_value : 0x%x, sensor_flip_status = 0x%x, , value_0015 = 0x%x, value_0d15 = 0x%x\n",iic_addr, set_value, sensor_flip_status, value_0015, value_0d15);

	return 0;
}
```

如果寄存器未被正常更新，则上报异常，具体问题也可以咨询 sensor 原厂翻转寄存器设置时，是否有其它相关联寄存器需要同步设置（如切页、组写等），同时，检查驱动中是否有其它操作翻转寄存器的代码，是否存在同时使用的冲突。

### 自动降帧常见问题

#### 调整的帧率与预期不符

有以下几种可能性：

1.sensor\_win\_sizes 中的 VTS、HTS、PCLK 信息填写不正确，VTS、HTS 需要按照 sensor 初始化寄存器列表里的值来进行填写，PCLK 可以通过 sensor 原厂获取（或自行计算）后填写，注意三者要满足公式，这三个关键信息是会交由 ISP 计算实际的曝光时间的，如果填写不准确会间接导致曝光时间有误差，进而导致降帧时帧率产生误差。

```c
 PCLK = HTS * VTS * FPS
```

2.更新 VTS、HTS 寄存器的方法有误，寄存器的读写方式需要严格按照规格书描述来操作（也可以直接询问 sensor 原厂），注意大部分寄存器会区分高低位信息分别更新两个寄存器，需要留意写入的值是否符合预期，可以在更新寄存器后，使用 sensor\_read 函数回读打印确认，并实时查看 VI 结点信息来检查。

3.检查 ISP 效果的最大曝光时间设置是否与预期不符，如目标是自动降帧至 10fps，但最大曝光时间又限制在 1/20s，那么不会触发自动降帧策略，当然也存在当前照度可能还未到要降帧延长曝光时间的时候；

#### 设置帧率之后，Sensor 不出图

有以下几种可能性：

1.回退驱动中帧率调整的相关代码，检查出图稳定性，是否真的是帧率改动导致的不出图。

2.检查VTS、HTS 寄存器，确保 VTS、HTS 寄存器更新成功，设置的值也符合预期；如果确定寄存器值符合预期，那么可以咨询 sensor 原厂该 sensor 在调整帧率时是否有其它注意事项，如 VTS 偏移量限制等。

### Sensor 调试案例汇总

#### 思特威 sc031lot 摄像头 select timeout

在 V851s 平台调试思特威 sc031lot 摄像头时，运行 sample\_virvi 出现 select timeout 获取不到图像数据，通过以下方式进行排查：

```c
1. 用万用表测量sensor的三路供电(DOVDD/DVDD/AVDD)是否正常，电压均正常
2. 查看sensor驱动的上电时序部分并对比sensor datasheet，上电时序符合要求
3. 用示波器测量sensor端的MCLK引脚，MCLK引脚有波形输出，频率符合设定值
4. 用示波器测量sensor端的mipi data和mipi clk引脚有波形输出
5. 通过执行指令 `cd /sys/class/sunxi_dump && echo 0x05810200,0x058102fc > dump; cat dump` 查看主控端MIPI-PHY寄存器的状态，如下：
```

![MIPIPHY寄存器data异常状态值TRNDS](images/MIPIPHY寄存器data异常状态值TRNDS-c388a850aaae1bbbb2d7b93ccf5926f6.png)

从上面截图信息可以看出，0x058102f0 寄存器\[0:3\]的值是4，表示当前LP 状态处于 4(0100)，则表示当前主控端处于异常状态 TRNDS，主控端会进入异常状态 TRNDS 是由于 MIPI DATA 引脚接收到了 sensor 端发过来的一段异常数据(LP11-10-00-10-00)导致的，如下：

![MIPITRNDS状态时序图](images/MIPITRNDS状态时序图-eb7de6a8dd1c91058ebea0d4aa5fdd34.png)

在运行 sample\_virvi 时 sensor 发送给第一段数据时，用示波器和逻辑分析仪抓取波形分析，能够看到 sensor 发送的第一段数据包含了异常数据(LP11-10-00-10-00)，如下：

![示波器抓取的DATA引脚波形图](images/示波器抓取的DATA引脚波形图-f6f2b34cc9050b90e90b40450dd19815.png)

![逻辑分析仪抓取的DATA引脚波形图](images/逻辑分析仪抓取的DATA引脚波形图-f3c0cb02e151202bce1af5515e5ae8bb.png)

由于这段异常数据 sensor 原厂无法规避，而主控端处于异常状态 TRNDS 时，会由原先的 RX 状态切换为 TX 状态，此时只能对主控端的 MIPI-PHY 进行复位才能恢复正常，在应用层获取 sensor 图像之前执行指令复位主控端的 MIPI-PHY，如下：

![samplevirvi复位MIPIPHY方法](images/samplevirvi复位MIPIPHY方法-6e60d355b9c618548ad13a4f5f2bffcd.png)

#### 后拉图像黑白问题

有客户在 V851 平台上使用 tp9951 yuv sensor，出现图像黑白问题，通过以下方式进行排查：

```
1. 用万用表测量sensor的三路供电(DOVDD/DVDD/AVDD)是否正常，电压均正常
2. 查看sensor驱动的上电时序部分并对比sensor datasheet，上电时序符合要求
3. 用示波器测量sensor端的MCLK引脚，MCLK引脚有波形输出，但频率有一定偏差
```

将问题反馈给 AHD RX 芯片原厂，原厂定位分析是 V851 主控端输出的 27M MCLK 偏大，MCLK 频偏不能超过 50ppm，颜色是调制信号，频偏比较大会 lock 不住色彩同步。用示波器量 MCLK 波形，量出来的频率是 27.1372MHz，不符合 AHD RX 芯片原厂的要求，如下：

![27Mmclk频偏波形图](images/27Mmclk频偏波形图-d593495028871ecb5da27dc30f73d0ed.jpg)

在 AHD 芯片上外挂一个 27M 晶振后，出来的图像颜色就正常了，所以可以得出是主控端的 27M MCLK 有频偏导致的，通过指令 cat /sys/kernel/debug/clk/clk\_summary 查看到当前使用的 MCLK 时钟源是 CSIPLL4X\`，如下：

![clksummary节点](images/clksummary节点-fc259fad74c4a14ef262932cb039a1f9.png)

通过指令 cd /sys/class/sunxi\_dump && echo 0x02001048 > dump; cat dump 查看 0x02001048 寄存器 bit24 是否被置1， 判断 27M MCLK 时钟源 CSIPLL4X 是否有打开展频功能，如下，相应 PLL 寄存器展频是打开的。（确认展频功能是否有打开可以参考 一号通文档 《Tina\_Linux\_V85X\_方案FAQ》1.12.4 确认展频功能是否打开章节）

![PLLCSI寄存器值](data:image/png;base64,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)

![PLLCSI寄存器信息](data:image/png;base64,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)

通过修改 lichee/linux-4.9/arch/arm/boot/dts/sun8iw19p1-clk.dtsi，将 PLL\_CSIX4 时钟源的展频功能关掉后，重新测量 MCLK 波形，MCLK 频率为 27.002504 MHz，出来的图像颜色就正常了。

![csix4时钟设备树配置](images/csix4时钟设备树配置-5259e9c3eb9870da6c15e0b514a2f27f.png)

![27Mmclk正常输出波形图](images/27Mmclk正常输出波形图-b4526ef34b54dac9472f9946994fcfaa.png)
