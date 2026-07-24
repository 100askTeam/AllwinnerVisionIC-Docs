---
sidebar_position: 3
---

# 系统相关常见问题

## V821是否已支持RTOS系统

V821芯片包含两个CPU。一个是主核心RISC-V CPU，运行Tina Linux系统，为芯片主系统；一个是RISC-V MCU，运行FreeRTOS系统，主要功能是提供通用算力补充、辅助 Linux 实现休眠唤醒、低功耗管理以及WIFI相关功能。

## V821 是合封的 WIFI 吗？合封的什么型号？是什么接口？

V821 **不是**合封的 WIFI，是集成在一体的低功耗 WIFI，其 WIFI 数字硬件与 CPU 集成在一块晶圆上，**其通过内部总线访问**，不像传统合封 WIFI 通过内部金线合封 CPU 和 WIFI 晶圆，相较于合封低功耗 WIFI 既保证了 WIFI 吞吐性能，又相较于合封高性能 WIFI 模块实现了较低的功耗。

## V821 启动引导

### V821 启动核心

V821与之前的芯片有所不同，其启动核心是RISC-V MCU，通过RISC-V MCU来引导RISC-V CPU主核心启动。

### V821 启动架构

V821双核异构系统BOOT代码结构与之前的平台大部分相同（BROM、BOOT0、UBOOT、FES），不过增加了E907\_BOOT、PMBOOT、UBOOT-EFEX三部分。

![V821 BOOT 架构](images/image-20241031132325211-42c61266f2e4c579453801a3a30c222b.png)

-   E907\_BOOT:

系统启动时该代码运行在RISC-V MCU，用于启动RISC-V CPU并使其跳转到BOOT0。

-   PMBOOT:

系统休眠唤醒时该代码运行在RISC-V CPU，是裁剪过的BOOT0代码。

-   UBOOT-EFEX:

系统烧写时使用的UBOOT代码，运行在RISC-V MCU。

### V821 启动流程

V821 启动分为常电与快起两个方案，这里以常电的启动流程作为演示说明，其流程如下图所示：

![image-20250425131530629](images/image-20250425131530629-e967c6240c0556c9219dd17f6fdab2d9.png)

1.  首先，由芯片内部的BROM在RISC-V MCU上运行，并寻找启动介质（SDCARD/EMMC/SPI-NOR/SPI-NAND），并加载“BOOT0”（包含E907\_BOOT和BOOT0）到 SRAM，然后跳转到E907\_BOOT执行。
2.  E907\_BOOT启动RISC-V CPU并使其跳转到BOOT0执行。
3.  BOOT0初始化DRAM，从FLASH加载OpenSBI、UBOOT、RTOS到DRAM。其中RTOS引导在 RISC-V MCU 上运行，此外引导 OpenSBI 在 RISC-V CPU 上运行。
4.  UBOOT最终加载引导Linux内核。
5.  待 Linux 启动后建立异构通讯。

### V821 烧写流程

V821双核异构系统烧写流程与启动有所区别，简化为全流程在RISC-V MCU执行，因此需要注意此时UBOOT-EFEX由RISC-V MCU编译工具链生成，使用独立配置sun300iw1p1\_efex\_defconfig

![image-20241122114415827](images/image-20241122114415827-8c28f2de73cf1a963f8e856395d6809c.png)

## 修改 PL 口默认电压

V821 PL 口中，PL0 PL1 固定为 1.8V 电平，无法修改，PL2~PL7 可以配置 1.8V 或者 3.3V，可以在 BOOT0 修改

首先确认当前方案使用的配置文件，这里以 perf2b 板级为例，查看 `BoardConfig_nor.mk` 和 `BoardConfig.mk` 中配置的 `LICHEE_BOOT0_BIN_NAME`，分布对应 SPI NOR 方案与 eMMC 方案下使用的 BOOT0 配置。

![image-20250319103359452](images/image-20250319103359452-fe724143091810f910b394edd6747507.png)

如果 `BoardConfig_nor.mk` 和 `BoardConfig.mk`中没有配置 `LICHEE_BOOT0_BIN_NAME` ，则标识方案使用默认配置，根据具体存储器件选择 `mmc.mk`，`spinor.mk`，`nand.mk` 即可

| 软件方案 | 存储器件 | 配置文件 |
| --- | --- | --- |
| 普通 | SPI NOR | `brandy/brandy-2.0/spl/board/sun300iw1p1/spinor.mk` |
| 普通 | SPI NAND | `brandy/brandy-2.0/spl/board/sun300iw1p1/nand.mk` |
| 普通 | eMMC/SD NAND | `brandy/brandy-2.0/spl/board/sun300iw1p1/mmc.mk` |
| 快起 | SPI NOR | `brandy/brandy-2.0/spl/board/sun300iw1p1/spinorfastboot.mk` |
| 快起 | eMMC/SD NAND | `brandy/brandy-2.0/spl/board/sun300iw1p1/mmcfastboot.mk` |

前往 `brandy/brandy-2.0/spl/board/sun300iw1p1` 找到配置文件

![image-20250319103533571](images/image-20250319103533571-9c491c09d329eefb5f8b8b0abe996aea.png)

这里以 `spinorpmc.mk` 为例，配置 `CFG_SUNXI_PL_1V8=y` 则 PL 口为 1.8V 如果注释或者删除则 PL 口为 3.3V

![image-20250319103605048](images/image-20250319103605048-417bf0874a8ba9c31caf85048567b440.png)

另外 fes 文件夹中的配置是执行 fes 时使用的，也需要配置

![image-20250430145041050](images/image-20250430145041050-c783845fc158693aad7749fc6d0a5367.png)

## 如何查看各模块时钟频率

```
mount -t debugfs none /sys/kernel/debug
cat /sys/kernel/debug/clk/clk_summary
```

如示例：

![如何查看各模块时钟频率](images/image-20241028131224466-620ca1609cc92f92537cf80b6667aed1.png)

如果没有节点，需要手动开启 `DebugFS representation of clock tree`

```
CONFIG_COMMON_CLK_DEBUG=y
```

![image-20250326100359277](images/image-20250326100359277-d6f21f0c33c2eea67def6f087b6361fd.png)

## 如何查看CPU当前频率

查看cpu当前频率：

```
cat /sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_cur_freq
```

查看cpu调频策略：

```
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
performance
```

表示当前调频策略为 performance, 它会以当前最大频率运行。其他常用的调频策略，如interactive,会根据实际负载调节频率。一般常用的就是这两种，如果想了解其他调频策略，可以查看内核源码中 Documentation/cpu-freq/governors.txt 该文档，或者网上资料。

:::tip

:::note

提示

:::
:::note

若找不到这个文件，说明该方案未支持调频，可以通过查看时钟树获取

```
cat /sys/kernel/debug/clk/clk_summary | grep pll-cpu
```

如果还是没有这个文件，需要内核开启配置

```
CONFIG_DEBUG_FS=y
CONFIG_COMMON_CLK_DEBUG=y
```

或者使用工具 `cpu_monitor`

![image-20250603171705650](images/image-20250603171705650-c801d5ade0131bbb3c4a74e843cc687a.png)

或者查看 U-boot 的打印确认

![image-20250603171744117](images/image-20250603171744117-23ec559946afd8226a5deca44191956a.png)

:::

:::

## 如何修改CPU主频

### SYS 节点 CPU调频设置

```
# 设置用户调频模式
echo userspace > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# 查看可调频率
cd /sys/devices/system/cpu/cpu0/cpufreq/
cat scaling_available_frequencies

eg: 360000 480000 600000 720000 840000 960000 1080000

#设置CPU频率:
echo 720000 > scaling_setspeed     #设置CPU主频为720M
echo 960000 > scaling_setspeed     #设置CPU主频为960M
```

### 配置 0.92V 启用 1000MHz 频点

:::tip

:::note

提示

:::
:::note

由于 V821 支持 40M 或 24M 晶振，0.92V 的频点对应 40M 晶振是 1000MHz，对应 24M 晶振是 1008MHz，为了兼容两个晶振，默认 SDK 配置为两个晶振的最大公倍数 960MHz，若产品已知晶振型号，需要提升 0.92V 频率，可以手动修改支持最高频率。

:::

:::

1.  加载 SDK 环境变量 `source build/envsetup.sh && lunch` 选择需要开发的板级
2.  执行 `quick_config`，打开 `quick_config` 配置界面
3.  执行 `make distclean` 清除编译数据
4.  选择 `set_cpu_vf_0` 条目
5.  修改文件 `bsp/configs/linux-5.4-ansc/sun300iw1p1-vf.dtsi` 取消频点 `disable`

bsp/configs/linux-5.4-ansc/sun300iw1p1-vf.dtsi

```c
opp@960000000 {
	opp-hz = /bits/ 64 <960000000>;
	opp-microvolt-vf0000 = <920000>;
	opp-microvolt-40m-vf0000 = <920000>;
	clock-latency-ns = <244144>; /* 8 32k periods */
};

opp@1000000000 {
	opp-hz = /bits/ 64 <1000000000>;
	opp-microvolt-vf0000 = <0>;
	opp-microvolt-40m-vf0000 = <920000>;
	clock-latency-ns = <244144>; /* 8 32k periods */
	status = "okay";
};

opp@1008000000 {
	opp-hz = /bits/ 64 <1008000000>;
	opp-microvolt-vf0000 = <920000>;
	opp-microvolt-40m-vf0000 = <0>;
	clock-latency-ns = <244144>; /* 8 32k periods */
	status = "okay";
};
```

![image-20250613153321902](images/image-20250613153321902-c6fe91219f108ab2dc97c44e8b5c4da1.png)

6.  修改 `brandy/brandy-2.0/spl/board/sun300iw1p1/clock.c` 配置启动频率 1000MHz

brandy/brandy-2.0/spl/board/sun300iw1p1/clock.c

```c
void sunxi_board_pll_init(void)
{
#ifndef CFG_SUNXI_SIMPLEBOOT
#ifndef CFG_SUNXI_PMBOOT
	printf("set pll start\n");
#ifdef CFG_SUNXI_VF_2_1
// 1200MHz
#define PLL_CPU_CLK_40M_N CCMU_AON_PLL_CPU_N_60
#define PLL_CPU_CLK_24M_N CCMU_AON_PLL_CPU_N_50
#else
// 1000MHz/1008MHz
#define PLL_CPU_CLK_40M_N 49
#define PLL_CPU_CLK_24M_N 41
#endif
	// set PLL_CPU=hosc*N/D
	// set PLL_VEDIO hosc*N/D
	if (aw_get_hosc_freq() == HOSC_FREQ_40M) {
		set_pll_general(CCMU_PLL_CPUX_CTRL_REG,
				PLL_CPU_CTRL_REG_PLL_EN_ENABLE,
				PLL_CPU_CTRL_REG_PLL_OUTPUT_GATE_ENABLE,
				CCMU_AON_PLL_CPU_D_2,
				PLL_CPU_CTRL_REG_PLL_INPUT_DIV_CLEAR_MASK,
				PLL_CPU_CTRL_REG_PLL_INPUT_DIV_OFFSET,
				PLL_CPU_CLK_40M_N);
		// When efuse is burned, brom will initialize the vedio clock in advance.
```

![image-20250613153750849](images/image-20250613153750849-a6d024ba51131c2c685a0816f665966e.png)

7.  修改 `rtos/lichee/rtos-components/aw/pm/plat_sun300iw1p1/firmware/standby_main.c`

rtos/lichee/rtos-components/aw/pm/plat\_sun300iw1p1/firmware/standby\_main.c

```c
//1000MHz/1008MHz
#define PLL_CPU_CLK_40M_N 49
#define PLL_CPU_CLK_24M_N 41
```

![image-20250613153939625](images/image-20250613153939625-b5cbdafcc0f5f0bdf13d4db5cb4dcbc7.png)

### 修改使用 1.0V VF 表

1.  加载 SDK 环境变量 `source build/envsetup.sh && lunch` 选择需要开发的板级
2.  执行 `quick_config`，打开 `quick_config` 配置界面
3.  执行 `make distclean` 清除编译数据
4.  选择 `set_cpu_vf_2` 条目

### 修改特殊频点

有些测试场景下，希望使用一些特殊的频点进行测试，这些频点不属于 VF 表测定的稳定频点，**仅用于测试不可量产**，这里以搭配 40M 晶振的 V821 为例，在其上面新增一个 640MHz 频点，其修改方法如下：

:::info

:::note

信息

:::
:::note

搭配 40M 晶振的 V821 才可以倍频出 640MHz 频点，24MHz 晶振的无法倍频出整数 640MHz，最接近的是 648MHz

:::

:::

1.  修改文件 `bsp/configs/linux-5.4-ansc/sun300iw1p1-vf.dtsi` 新增需要的特殊频点

bsp/configs/linux-5.4-ansc/sun300iw1p1-vf.dtsi

```c
opp@640000000 {
	opp-hz = /bits/ 64 <640000000>;
	opp-microvolt-vf0000 = <0>;            /* 24M 晶振不使用这个频点，配置成 0 */
	opp-microvolt-40m-vf0000 = <920000>;
	clock-latency-ns = <244144>; /* 8 32k periods */
};

opp@648000000 {
	opp-hz = /bits/ 64 <648000000>;
	opp-microvolt-vf0000 = <920000>;
	opp-microvolt-40m-vf0000 = <0>;        /* 40M 晶振不使用这个频点，配置成 0 */
	clock-latency-ns = <244144>; /* 8 32k periods */
};
```

2.  修改 `brandy/brandy-2.0/spl/board/sun300iw1p1/clock.c` 配置启动倍频值

brandy/brandy-2.0/spl/board/sun300iw1p1/clock.c

```c
void sunxi_board_pll_init(void)
{
#ifndef CFG_SUNXI_SIMPLEBOOT
#ifndef CFG_SUNXI_PMBOOT
	printf("set pll start\n");
#ifdef CFG_SUNXI_VF_2_1
// 1200MHz
#define PLL_CPU_CLK_40M_N CCMU_AON_PLL_CPU_N_60
#define PLL_CPU_CLK_24M_N CCMU_AON_PLL_CPU_N_50
#else
// 1000MHz/1008MHz
#define PLL_CPU_CLK_40M_N 31  <-- 修改 40M 晶振时倍频为 31 
#define PLL_CPU_CLK_24M_N 26  <-- 修改 24M 晶振时倍频为 26
#endif
	// set PLL_CPU=hosc*N/D
	// set PLL_VEDIO hosc*N/D
	if (aw_get_hosc_freq() == HOSC_FREQ_40M) {
		set_pll_general(CCMU_PLL_CPUX_CTRL_REG,
				PLL_CPU_CTRL_REG_PLL_EN_ENABLE,
				PLL_CPU_CTRL_REG_PLL_OUTPUT_GATE_ENABLE,
				CCMU_AON_PLL_CPU_D_2,
				PLL_CPU_CTRL_REG_PLL_INPUT_DIV_CLEAR_MASK,
				PLL_CPU_CTRL_REG_PLL_INPUT_DIV_OFFSET,
				PLL_CPU_CLK_40M_N);
		// When efuse is burned, brom will initialize the vedio clock in advance.
```

:::info

:::note

倍频参数计算方式

:::
:::note

CPU 主频使用的 PLL 为 PLL CPU，其是通过晶振频率倍频所得，在下面公式中，$HOSC$ 是晶振主频，$N$ 是倍频值，$D$ 是前除频值。

$$\text{PLL\_CPU} = \frac{\text{HOSC} \cdot (N + 1)}{D}$$

-   针对 40M 晶振，SDK 默认使用 2 前除频，配置 `CCMU_AON_PLL_CPU_D_2`
-   针对 24M 晶振，SDK 默认使用 1 前除频，配置 `CCMU_AON_PLL_CPU_D_1`

所以已知晶振频率 $HOSC$，前除频 $D$，和目标 CPU 主频的时候，$N$ 的值求解如下：

$$N = \frac{\text{PLL\_CPU} \cdot D}{\text{HOSC}} - 1$$

根据已知条件，晶振频率 $\text{HOSC} = 40\text{M}$ ，$D = 2$，要求输出频率 $\text{PLL\_CPU} = 640 \text{M} $，可以使用上面推导的公式：

$$N_{40M} = \frac{\text{PLL\_CPU} \cdot D}{\text{HOSC}} - 1$$

将已知值代入公式：

$$N_{40M} = \frac{640 \times 2}{40} - 1$$

我们可以计算出 $N_{40M}$ 的值：

$$N_{40M} = \frac{1280}{40} - 1 = 32 - 1 = 31$$

所以，$N_{40M} = 31$。

针对 24M 晶振，根据已知条件，晶振频率 $\text{HOSC} = 24\text{M}$ ，$D = 1$，要求输出频率 $\text{PLL\_CPU} = 648 \text{M} $，可以使用上面推导的公式：

$$N_{24M} = \frac{\text{PLL\_CPU} \cdot D}{\text{HOSC}} - 1$$

将已知值代入公式：

$$N_{24M} = \frac{648 \times 1}{40} - 1$$

我们可以计算出 $N_{24M}$ 的值：

$$N_{24M} = \frac{648}{24} - 1 = 27 - 1 = 26$$

所以，$N_{24M} = 26$。

:::

:::

3.  同时需要修改 `rtos/lichee/rtos-components/aw/pm/plat_sun300iw1p1/firmware/standby_main.c`

rtos/lichee/rtos-components/aw/pm/plat\_sun300iw1p1/firmware/standby\_main.c

```c
// set PLL_CPU=hosc*N/D
#ifdef CONFIG_SUNXI_VF_2_1
//1200MHz
#define PLL_CPU_CLK_40M_N PLL_N_60
#define PLL_CPU_CLK_24M_N PLL_N_50
#else
//960MHz
#define PLL_CPU_CLK_40M_N 31  <-- 修改 40M 晶振时倍频为 31
#define PLL_CPU_CLK_24M_N 26  <-- 修改 24M 晶振时倍频为 26
#endif
```

## 为何 SPI NAND 存储可用空间比标称要小

如 NAND Flash 总大小是 128M Bytes, NAND 驱动本身会保留 1/8 到 1/10 左右的空间，包括用于 NAND 管理、预留给 Boot0/U-Boot 的空间，如果 NAND 存在坏块，空间也将相应的减小。

## 支持最大多大的 SD 卡

理论支持 2TB SD 卡，测试过最大的 1TB TF 卡正常挂载读写（exfat 格式）

![image-20250825164801582](images/image-20250825164801582-c364a0e073b11f2641762149cc0a3769.png)

![image-20250825164651455](images/image-20250825164651455-1fde45846738535843411e9a176230e5.png)

## 存储切换方法

快启SDK上切换存储需要修改的地方较多，不建议去切换。默认已提供NOR和EMMC的板级，建议直接使用对应存储类型的板级，或者复制板级进行修改。

快启SDK不支持SPI NAND。

## SPI NOR 卡启动

**快启SDK卡启动只能在EMMC板级才支持，nor板级不支持卡启动。**

SPI NOR 固件用于卡启动时，需要注意两个点：

-   卡启动的启动存储介质是SD卡，是mmcblk设备，Tina默认挂载ext4文件系统。
-   ext4文件系统需要更大的分区容量。

（1）内核配置

```
File systems  --->
   <*> The Extended 4 (ext4) filesystem   ----->确认ext4默认已选上
```

（2）Tina环境配置

```
make menuconfig 层层选中

Global build settings  --->
   [ ] Strip unnecessary functions from libraries  //取消勾选

Utilities  --->
   Filesystem  --->
      <*> e2fsprogs //选中ext4工具
```

（3）sys\_partition.fex分区表配置

```
[partition]
    name         = rootfs_data
    size         = 1024     ---->nor默认给的rootfs_data比较小，ext4建议配置3M以上，即6144以上
    user_type    = 0x8000
```

## 如何替换开机LOGO

将准备好的 bmp 文件替换下面的路径即可

```
openwrt/target/v821/v821-common/boot-resource/boot-resource/bootlogo.bmp
```

## 如何确认LCD屏本身工作是否正常

可打开LCD屏自测模式，测试colorbar输出是否正常，测试命令：

```c
echo 1 > /sys/class/disp/disp/attr/colorbar
```

## 芯片内部的GPIO是否带上下拉电阻

芯片设计时，GPIO是有带上下拉电阻，约为100K，精度为20%.

## PINCTRL 调试

1.调试节点

```
mount -t debugfs none /sys/kernel/debugfs

对于非 GPIOL 的 GPIO，在这个节点
cd /sys/kernel/debug/pinctrl/42000000.pinctrl/

对于 GPIOL 的 GPIO，在这个节点
cd /sys/kernel/debug/pinctrl/42000540.pinctrl/
```

2.查看引脚复用状态

```
cd /sys/kernel/debug/pinctrl/42000000.pinctrl/
cat pinmux-pins
```

![查看引脚复用状态](images/image-20241028145226913-9c6cdba09351b7a6a6099c05736e5b21.png)

3.查看配置

```
cd /sys/kernel/debug/pinctrl/42000000.pinctrl/
cat pinconf-pins
```

![查看配置](images/image-20241028145313337-3b74d7e31be7038a4af30d9bbefa8cba.png)

4.查看功能复用

```
cd /sys/kernel/debug/pinctrl/42000000.pinctrl/
cat pinmux-functions
```

![查看功能复用](images/image-20241028145416411-30334e3bbb0fd76d585f2f3a719ef044.png)

### Linux 标准GPIO调试

确认系统中有“/sys/class/gpio”这级目录，如果没有，在编译内核时加入。

```
Device Drivers  
	—>  GPIO Support  
		—> /sys/class/gpio/… (sysfs interface)
```

/sys/class/gpio使用说明：

```
1.通过/sys/文件接口操作IO端口，即GPIO到文件系统的映射；
2.控制GPIO的目录位于/sys/class/gpio；
3./sys/class/gpio/export文件，用于通知系统需要导出控制的GPIO引脚编号；
4./sys/class/gpio/unexport文件， 用于通知系统取消导出；
5./sys/class/gpio/gpiochipX目录保存系统中GPIO寄存器的信息，包括每个寄存器控制引脚的起始编号base，寄存器名称，引脚总数。
```

导出一个引脚的操作步骤：

-   首先计算此引脚编号： 引脚编号 = 控制引脚的寄存器基数 + 控制引脚寄存器位数 举例（具体GPIO参考数据手册），如想控制PB2引脚，那么引脚编号就等于1 x 32 + 2 = 34。
-   export引脚： 向 /sys/class/gpio/export 写入此编号，比如34号引脚，在 shell 中可以通过以下命令实现：

```c
echo 34 > /sys/class/gpio/export
```

命令成功后生成 /sys/class/gpio/gpio34目录，如果没有出现相应目录，说明此引脚不可导出。

-   定义输入输出： direction 文件，定义输入输入方向，可以通过下面命令定义为输出。

```c
echo out > /sys/class/gpio/gpio34/direction
```

 direction 接受的参数可以是：in、out、high、low。其中参数 high / low 在设置方向为输出的同时，将 value 设置为相应的 1 / 0。

-   设置value值： value 文件是端口的数值，为1或0，通过下面命令将gpio34设置为高电平。

```c
echo 1 > /sys/class/gpio/gpio34/value
```

## 如何进行USB眼图测试

### USB0 OTG Device眼图测试

```
手动切换Device模式:
cat /sys/devices/platform/soc@2002000/soc@2002000:usbc0@0/usb_device

每个芯片平台的节点路径会有些差异，请通过find命令确认：
find /sys -name otg_ed_test

眼图测试命令：
echo test_pack > /sys/devices/platform/soc@2002000/44100000.udc-controller/otg_ed_test
```

### USB0 OTG Host眼图测试

```
手动切换Host模式:
cat /sys/devices/platform/soc@2002000/soc@2002000:usbc0@0/usb_host

每个芯片平台的节点路径会有些差异，请通过find命令确认(注意选择带有ehci0的路径)：
find /sys -name ed_test

眼图测试命令：
echo test_pack > /sys/devices/platform/soc@2002000/44101000.ehci0-controller/ed_test
```

## 在 U-Boot 中设置内核打印等级

启动时进入 U-Boot 控制台，使用 `print` 目录查看环境变量中的 `loglevel=` 字段，可以看到这里字段是 `8`

![image-20250211093239164](images/image-20250211093239164-18aff0e7404844058adc1da8fdb1d957.png)

使用命令 `setenv loglevel 1` 即可修改打印等级为1，修改后可以打印出来看看

![image-20250211093410506](images/image-20250211093410506-d75b585caccb9dff9c1e6b7c5f66342f.png)

如果需要保存永久，使用 `saveenv` 命令

![image-20250211093452115](data:image/png;base64,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)

使用 `boot` 命令启动系统

## 打印 awbase abnormal

![image-20250325100208367](images/image-20250325100208367-8ef632d8196ea670e8eeb269f5937bc7.png)

如果出现打印 `awbase abnormal...[0x33330001]` 标识目前检测到内核不正常，请检查内核内守护进程 `awbase.ko` 是否正常挂载。使用命令查看

```
lsmod
```

![image-20250325100758319](images/image-20250325100758319-30dbd6ad797e04e2a1f43f199bb17144.png)

如果检测到长时间内核守护进程未启动，则会报错 `awbase abnormal...[0x33330001]`

## 禁用小核

V821 若不使用休眠唤醒功能与 SIP WIFI 功能，可选择关闭小核，将小核内存释放出来供大核使用。

（1）删除设备树小核相关节点

![image-20250411095337923](images/image-20250411095337923-77644a860ea9ac81787a5c35bce1d046.png)

删除以下预留内存节点

```c
rv_ddr_reserved: rvddrreserved@81000000 {
	reg = <0x0 0x81000000 0x0 0x200000>;
	no-map;
};
/*
* The name should be "vdev%dbuffer".
* Its size should be not less than
*     RPMSG_BUF_SIZE * (num of buffers in a vring) * 2
*   = 512 * (num of buffers in a vring) * 2
*/
rv_vdev0buffer: vdev0buffer@81200000 {
	compatible = "shared-dma-pool";
	reg = <0x0 0x81200000 0x0 0x40000>;
	no-map;
};
/*
* The name should be "vdev%dvring%d".
* The size of each should be not less than
*     PAGE_ALIGN(vring_size(num, align))
*   = PAGE_ALIGN(16 * num + 6 + 2 * num + (pads for align) + 6 + 8 * num)
*
* (Please refer to the vring layout in include/uapi/linux/virtio_ring.h)
*/
rv_vdev0vring0: vdev0vring0@81240000 {
	reg = <0x0 0x81240000 0x0 0x2000>;
	no-map;
};

rv_vdev0vring1: vdev0vring1@81242000 {
	reg = <0x0 0x81242000 0x0 0x2000>;
	no-map;
};

e907_mem_fw: e907_mem_fw@81244000 {
	/* boot0 & uboot0 load elf addr */
	reg = <0x0 0x81244000 0x0 0x00200000>;
};

e907_share_irq_table: share_irq_table@81644000 {
	reg = <0x0 0x81644000 0x0 0x2000>;
	no-map;
};

e907_rpbuf_reserved:e907_rpbuf@81646000 {
	compatible = "shared-dma-pool";
	reg = <0x0 0x81646000 0x0 0x8000>;
	no-map;
};
```

删除以下通讯使用节点

```c
reserved-irq {
	share-e907 {
		arch-name = "e907";
		memory-region = <&e907_share_irq_table>;
		/* defined by sun300iw1-share-irq-dt.h */
		share-irq =
				<1    0x1    E907_PA_IRQ_NUM    A27_PA_IRQ_NUM    0x00000000>,
				<3    0x3    E907_PC_IRQ_NUM    A27_PC_IRQ_NUM    0x00000000>,
				<4    0x4    E907_PD_IRQ_NUM    A27_PD_IRQ_NUM    0x00000000>,
				<12   0xc    E907_PL_IRQ_NUM    A27_PL_IRQ_NUM    0x00000000>;
	};
};

hifbypass: hifbypass {
	compatible = "allwinner,sun300wi-sip-wifi";
	interrupts-extended = <&plic0 160 IRQ_TYPE_LEVEL_HIGH>;
	clocks = <&aon_ccu CLK_DCXO>;
	clock-names = "hosc";
	status = "disabled";
};

rpbuf_controller0: rpbuf_controller0@0 {
	compatible = "allwinner,rpbuf-controller";
	remoteproc = <&e907_rproc>;
	ctrl_id = <0>;
	memory-region = <&e907_rpbuf_reserved>;
	status = "okay";
};

rpbuf_xradio: rpbuf_xradio@0 {
	compatible = "allwinner,rpbuf-xradio";
	rpbuf = <&rpbuf_controller0>;
	status = "okay";
};
```

删除 `rproc` 节点

```c
&e907_rproc {
	firmware-name = "amp_rv0.bin";
	mboxes = <&msgbox 0>;
	mbox-names = "arm-kick";
	auto-boot;
	skip-shutdown;
	fw-region = <&e907_mem_fw>;
	memory-region = <&rv_ddr_reserved>, <&rv_vdev0buffer>, <&rv_vdev0vring0>, <&rv_vdev0vring1>, <&e907_share_irq_table>;
	fw-partitions = "riscv0", "riscv0-r";
	fw-partition-sectors = <2432>;
	memory-mappings =
	/* < DA         len             PA >    */
	/* SRAM ISP */
	< 0x2000000        0xa800        0x2000000 >,
	/* SRAM VE */
	< 0x200a800        0x17400       0x200a800 >,
	/* SRAM WIFI */
	< 0x68000000       0x1000000     0x68000000 >,
	/* DRAM */
	< 0x80000000       0x0fffffff    0x80000000 >;
	stop-record-reg = <0x4a00020c>;

	share-irq = "e907";
	status = "okay";

	rproc_wdt: rproc_wdt@0 {
		timeout_ms = <6000>;
		try_times = <1>;
		reset_type = <0x2>;
		panic_on_timeout = <1>;
		status = "okay";
	};
};
```

（2）删除小核分区

![image-20250411095707547](images/image-20250411095707547-5d4d3853b134aa7f609d3d61f0a71e9f.png)

```
[partition]
    name         = riscv0
    size         = 2432
    downloadfile = "amp_rv0.fex"
    user_type    = 0x8000
```

![image-20250411095732580](images/image-20250411095732580-5a2f882488649164f2ec6cdf2f7a4934.png)

```
[partition]
    name         = riscv0
    size         = 4096
    downloadfile = "amp_rv0.fex"
    user_type    = 0x8000
```

（3）编辑内核配置，关闭小核通讯控制相关功能：

```
CONFIG_AW_REMOTEPROC
CONFIG_AW_RPROC_FAST_BOOT
CONFIG_AW_RPROC_SUBDEV
CONFIG_AW_RPROC_SUBDEV_WDT
CONFIG_SUNXI_RPROC_SHARE_IRQ
CONFIG_AW_REMOTEPROC_E907_BOOT
CONFIG_AW_REMOTEPROC_E907_STOP_NOTIFY
CONFIG_AW_RPMSG_CTRL
CONFIG_AW_RPMSG_NOTIFY
CONFIG_AW_RPBUF_SERVICE_RPMSG
CONFIG_AW_RPBUF_CONTROLLER_SUNXI
CONFIG_AW_MSGBOX
```

（4）编辑 boot0 配置

首先确认当前方案使用的配置文件，这里以 perf2b 板级为例，查看 `BoardConfig_nor.mk` 和 `BoardConfig.mk` 中配置的 `LICHEE_BOOT0_BIN_NAME`，分布对应 SPI NOR 方案与 eMMC 方案下使用的 BOOT0 配置。

![image-20250319103359452](images/image-20250319103359452-fe724143091810f910b394edd6747507.png)

如果 `BoardConfig_nor.mk` 和 `BoardConfig.mk`中没有配置 `LICHEE_BOOT0_BIN_NAME` ，则标识方案使用默认配置，根据具体存储器件选择 `mmc.mk`，`spinor.mk`，`nand.mk` 即可

| 软件方案 | 存储器件 | 配置文件 |
| --- | --- | --- |
| 普通 | SPI NOR | `brandy/brandy-2.0/spl/board/sun300iw1p1/spinor.mk` |
| 普通 | SPI NAND | `brandy/brandy-2.0/spl/board/sun300iw1p1/nand.mk` |
| 普通 | eMMC/SD NAND | `brandy/brandy-2.0/spl/board/sun300iw1p1/mmc.mk` |
| 快起 | SPI NOR | `brandy/brandy-2.0/spl/board/sun300iw1p1/spinorfastboot.mk` |
| 快起 | eMMC/SD NAND | `brandy/brandy-2.0/spl/board/sun300iw1p1/mmcfastboot.mk` |

前往 `brandy/brandy-2.0/spl/board/sun300iw1p1` 找到配置文件

![image-20250319103533571](images/image-20250319103533571-9c491c09d329eefb5f8b8b0abe996aea.png)

这里以 `spinorpmc.mk` 为例

关闭下面两个配置，可以注释可以删除

```
CFG_DEFAULT_BOOT_RTOS
CFG_EARLY_BOOT_RISCV
```

:::tip

:::note

提示

:::
:::note

-   `CFG_DEFAULT_BOOT_RTOS` 配置一般配置在 `brandy/brandy-2.0/spl/board/sun300iw1p1/common.mk`

![image-20250416111824129](images/image-20250416111824129-d9457f1287b115f659d392833264d2d8.png)

-   `CFG_EARLY_BOOT_RISCV`配置一般配置在板级配置

![image-20250416111847818](images/image-20250416111847818-ca8590a01c1b5a3ac6fe451e514b3524.png)

:::

:::

## 裁剪 U-Boot 增加启动速度

在部分场景下，如果不需要使用 U-Boot 的相关功能，可以裁剪掉 U-Boot 使用 SPL 去拉起内核。

:::warning

:::note

注意

:::
:::note

去除 U-Boot 之后将无法使用 U-Boot 提供的部分功能，包括

-   卡升级
-   卡量产
-   DragonSN 烧号

:::

:::

### SPI NOR 方案

这里以 PERF2B 板级搭配 NOR 存储器件作为示例。

（1）增加 BOOT0 配置

在目录 `brandy/brandy-2.0/spl/board/sun300iw1p1` 新增 BOOT0 配置项 `spinorskipboot.mk`

```makefile
FILE_EXIST=$(shell if [ -f $(TOPDIR)/board/$(PLATFORM)/common.mk ]; then echo yes; else echo no; fi;)
EXT_FILE_EXIST=$(shell if [ -f $(TOPDIR)/board/$(PLATFORM)/common$(LICHEE_BOARD).mk ]; then echo yes; else echo no; fi;)
ifeq (x$(EXT_FILE_EXIST),xyes)
include $(TOPDIR)/board/$(PLATFORM)/common$(LICHEE_BOARD).mk
else ifeq (x$(FILE_EXIST),xyes)
include $(TOPDIR)/board/$(PLATFORM)/common.mk
else
include $(TOPDIR)/board/$(CP_BOARD)/common.mk
endif

MODULE=spinorskipboot
CFG_SUNXI_SPINOR=y
CFG_SUNXI_SPI =y
CFG_SUNXI_SPIF =y
#CFG_SUNXI_DMA =y
#CFG_SPI_USE_DMA =y
CFG_SUNXI_ELF =y
CFG_SUNXI_FDT =y
CFG_SUNXI_GPT =y
CFG_SUNXI_ENV =y
CFG_SUNXI_ENV_SIZE =0x1000
CFG_SUNXI_HAVE_REDUNDENV=y
#CFG_SUNXI_NO_UPDATE_FDT_CHOSEN=y
CFG_SUNXI_LOGIC_OFFSET=2016
CFG_SPINOR_GPT_ARD=2016
CFG_SPINOR_UBOOT_OFFSET=128
CFG_SPINOR_UBOOT_PARAMS_OFFSET=120

CFG_BOOT0_LOAD_KERNEL=y
CFG_KERNEL_BOOTIMAGE=y
CFG_LOAD_DTB_FROM_KERNEL=y
CFG_KERNEL_CHECKSUM=n #y will check kernel checksum in bimage, but slower
CFG_SPINOR_KERNEL_OFFSET=0x20 #first partition, 0x20  4064+0x20 = 4096 sector = 2.0M
CFG_SPINOR_LOGICAL_OFFSET=4064
CFG_KERNEL_LOAD_ADDR=0x82000000
CFG_SUNXI_FDT_ADDR=0x81d00000
CFG_SPINOR_KERNEL_BACKUP_OFFSET=0x1BA0 # Adjusted according to sys_partition file
CFG_FASTBOOT_EFEX=y
CFG_RESERVE_FDT_SIZE=0x30000
CFG_SUNXI_SUPPORT_RAMDISK=y # 支持ramdisk镜像，主要用于recovery系统
CFG_RAMDISK_ADDR=0x80700000 # ramdisk镜像存放地址

#IR STATE
CFG_SUNXI_PHY_KEY=y
CFG_GPADC_KEY=y
CFG_BOOT0_LOAD_FLASH=y
CFG_SET_GPIO_NEW=y

#compression
CFG_SUNXI_LZ4=y

#gpadc
CFG_SUNXI_PHY_KEY=y
CFG_GPADC_KEY=y
```

把这个配置增加到编译列表中

![image-20250416112854642](images/image-20250416112854642-28690aa2f5db82dce6875858c526389a.png)

（2）修改使用该配置的 BOOT0

进入修改 `device/config/chips/v821/configs/perf2b/BoardConfig_nor.mk` 文件，改为刚才新增的 BOOT0 配置

```
LICHEE_BOOT0_BIN_NAME:=spinorskipboot
```

![image-20250416112932370](images/image-20250416112932370-79be96c817a60d50f12e237194d33e00.png)

增加配置 ENV

```
LICHEE_REDUNDANT_ENV_SIZE:=0x1000
```

![image-20250416115227848](images/image-20250416115227848-394cc2cf4fca20e79f3f13d0dcd4c8d7.png)

修改压缩方式为 lz4

```
LICHEE_COMPRESS:=lz4
```

![image-20250416133200171](images/image-20250416133200171-978667cd4fbbc7c847adfd1630c5e43a.png)

（3）修改 `boot_package` 配置

新增文件 `boot_package_nor.cfg` ，写入以下内容（注意最后需要添加一行空行！）

```ini
[package]
;item=Item_TOC_name,         Item_filename,
item=opensbi,                 opensbi.fex
item=pmboot,                 pmboot_spinor.fex
```

![image-20250416113335605](images/image-20250416113335605-6572fc4390c14853662eaaab9fcf6eeb.png)

（4）修改设备树

由于裁剪了 U-Boot，需要将启动参数写在设备树中，修改设备树文件 `device/config/chips/v821/configs/perf2b/linux-5.4-ansc/board.dts`

```
chosen {
	bootargs = "earlyprintk=sunxi-uart,0x42500000 initcall_debug=0 console=ttyS0,1500000 loglevel=8 root=/dev/mtdblock7 rootwait init=/init rdinit=/rdinit partitions=boot-resource@mtdblock1:env@mtdblock2:env-redund@mtdblock3:boot@mtdblock4:private@mtdblock5:riscv0@mtdblock6:rootfs@mtdblock7:rootfs_data@mtdblock8:UDISK@mtdblock9 coherent_pool= androidboot.hardware=sun300iw1p1 boot_type=3 androidboot.boot_type=3 gpt=1 mbr_offset=311296 rootfstype=squashfs";
};
```

![image-20250416132705733](images/image-20250416132705733-50b4ad5ecb78d6666b9fc95ef857d3cb.png)

注意 `partitions` 后面的分区表需要与分区表一一对应

```
partitions=boot-resource@mtdblock1:env@mtdblock2:env-redund@mtdblock3:boot@mtdblock4:private@mtdblock5:riscv0@mtdblock6:rootfs@mtdblock7:rootfs_data@mtdblock8:UDISK@mtdblock9
```

![image-20250416132533708](images/image-20250416132533708-8f6d213add31af508d5d59075dcdc604.png)

另外存储设备也默认开启，由于没有 U-Boot，不会自动识别存储设备，需要默认配置好，找到 `spif` 节点配置 `okay`

![image-20250416133825826](images/image-20250416133825826-ff9179c6abc7bf6bc412557bb803d798.png)

修改 U-Boot 的分区表，删除 U-Boot 分区，缩小空间

```
nor_map {
	/*Unit: Sector, 8M flash:16384, 16M flash:32768, 32M flash:65536*/
	/* logic offset requires block size(64K) alignment - 32(mbr size) */
	flash_size = <16384>;
	logic_offset = <608>;
	secure_logic_offset = <2016>;
	rtos_logic_offset = <2016>;
	rtos_secure_logic_offset = <2016>;
	boot_param_start = <272>;
	boot_param_size = <8>;
	uboot_start = <280>;
	uboot_size = <328>;
	boot0_start = <0>;
	status = "okay";
};
```

![image-20250416141127174](images/image-20250416141127174-b23ff1fc5eea77e4a31c0ef76564fd1f.png)

（5）修改用户空间 env 配置

修改配置 `env` 大小为 `0x1000`

```
# Allwinner Tina
/dev/by-name/env	       0x0000          0x1000
/dev/by-name/env-redund       0x0000          0x1000
```

![image-20250416172312345](images/image-20250416172312345-494150b424af16d89e77d100add61708.png)

（6）完成修改，验证

修改后需要重新加载 SDK，以使用新的环境变量

```
source build/envsetup.sh
lunch
```

然后编译 SDK 测试，启动日志如下，可以对比存在什么问题

```
[0]HELLO! BOOT0 is starting!
[2]BOOT0 commit : 93baf00a8b-dirty
[6]set pll start
[9]set pll end
[10]board init ok: use hosc 40M
[15]DRAM use internal ZQ!!
[17]ZQ value = 0x30
[19]DRAM BOOT DRIVE INFO: V1.00
[22]DRAM CLK = 520 MHz
[24]DRAM Type = 2 (2:DDR2,3:DDR3)
[27]DRAMC read ODT off.
[29]DRAM ODT off.
[32]trefi: 7.8us
[33]DRAM Size = 64 MB
[37]DRAM simple test OK.
[39]dram size =64
[41]set spif freq:100000000
[44]spi sample_mode:0 sample_delay:14
[48]spinor id is: 20 40 18, read cmd: ed
[52]Succeed in reading toc file head.
[55]The size of toc is 18000.
[59]Entry_name        = opensbi
[62]Entry_name        = pmboot
[65]GPT load from sector:0x0, sectors: 0x8
[85]kernel_addr:80000000
[139]block size: 2867788
[202]block size: 2044903
[253]kernel:80000000 4af64e
[256]update dts
[258]Jump to OpenSBI: opensbi_base = 0x80fc0000, dtb_base = 0x81d00000, kernel_addr = 0x80000000

OpenSBI c19b4e8ed2bdc4057ebb0077a35f3ff672c1d68d
   ____                    _____ ____ _____
  / __ \                  / ____|  _ \_   _|
 | |  | |_ __   ___ _ __ | (___ | |_) || |
 | |  | | '_ \ / _ \ '_ \ \___ \|  _ < | |
 | |__| | |_) |  __/ | | |____) | |_) || |_
  \____/| .__/ \___|_| |_|_____/|____/_____|
        | |
        |_|

init msb region pma attribute
Platform Name             : sun300iw1
Platform Features         : medeleg
Platform HART Count       : 1
Platform IPI Device       : sunxi_plicsw
Platform Timer Device     : sunxi_plmt @ 40000000Hz
Platform Console Device   : sunxi_uart
Platform HSM Device       : ---
Platform PMU Device       : ---
Platform Reboot Device    : sunxi_wdt
Platform Shutdown Device  : sunxi_wdt
Firmware Base             : 0x80fc0400
Firmware Size             : 75 KB
Runtime SBI Version       : 0.3

Domain0 Name              : root
Domain0 Boot HART         : 0
Domain0 HARTs             : 0*
Domain0 Region00          : 0x80fc0000-0x80fdffff ()
Domain0 Region01          : 0x00000000-0xffffffff (R,W,X)
Domain0 Next Address      : 0x80000000
Domain0 Next Arg1         : 0x81d00000
Domain0 Next Mode         : S-mode
Domain0 SysReset          : yes

Boot HART ID              : 0
Boot HART Domain          : root
Boot HART ISA             : rv32imafdcnsux
Boot HART Features        : scounteren,mcounteren,mcountinhibit,sscofpmf
Boot HART PMP Count       : 64
Boot HART PMP Granularity : 8
Boot HART PMP Address Bits: 31
Boot HART MHPM Count      : 4
Boot HART MIDELEG         : 0x00000222
Boot HART MEDELEG         : 0x0000b109
[    0.000000] Linux version 5.4.220 (tina-dev@tina-dev-163) (gcc version 10.4.0 (2024-02-02_nds32le-linux-glibc-v5d-bbc31ec98)) #12 PREEMPT Wed Apr 16 13:38:18 HKT 2025
[    0.000000] printk: bootconsole [earlycon0] enabled
[    0.000000] Reserved memory: created CMA memory pool at 0x0000000083c00000, size 4 MiB
[    0.000000] OF: reserved mem: initialized node linux,cma, compatible id shared-dma-pool
[    0.000000] Reserved memory: created DMA memory pool at 0x0000000081200000, size 0 MiB
[    0.000000] OF: reserved mem: initialized node vdev0buffer@81200000, compatible id shared-dma-pool
[    0.000000] Reserved memory: created DMA memory pool at 0x0000000081646000, size 0 MiB
[    0.000000] OF: reserved mem: initialized node e907_rpbuf@81646000, compatible id shared-dma-pool
[    0.000000] Zone ranges:
[    0.000000]   Normal   [mem 0x0000000080000000-0x0000000083ffffff]
[    0.000000] Movable zone start for each node
[    0.000000] Early memory node ranges
[    0.000000]   node   0: [mem 0x0000000080000000-0x0000000080ffefff]
[    0.000000]   node   0: [mem 0x0000000081244000-0x0000000081643fff]
[    0.000000]   node   0: [mem 0x000000008164e000-0x0000000083ffffff]
[    0.000000] Initmem setup node 0 [mem 0x0000000080000000-0x0000000083ffffff]
[    0.000000] On node 0 totalpages: 15793
[    0.000000]   Normal zone: 128 pages used for memmap
[    0.000000]   Normal zone: 0 pages reserved
[    0.000000]   Normal zone: 15793 pages, LIFO batch:3
[    0.000000] SBI specification v0.3 detected
[    0.000000] SBI implementation ID=0x1 Version=0x10000
[    0.000000] SBI v0.2 TIME extension detected
[    0.000000] SBI v0.2 IPI extension detected
[    0.000000] SBI v0.2 RFENCE extension detected
[    0.000000] SBI SRST extension detected
[    0.000000] riscv: base ISA extensions acdfim
```

## 配置默认启用 LDO1 2.8V

（1）修改 BOOT0 开启 LDO1

修改文件 `brandy/brandy-2.0/spl/board/sun300iw1p1/common.mk`，增加一行

```
CFG_ENABLE_LDO28=y
```

（2）设备树修改

增加节点开启 LDO1

```c
&pmu_soc_ldo1 {
	regulator-name = "ldo1";
	regulator-min-microvolt = <2250000>;
	regulator-max-microvolt = <3000000>;
	regulator-enable-ramp-delay = <1000>;
	regulator-boot-on;
	regulator-always-on;
};
```

![image-20250416141939356](images/image-20250416141939356-9ca0487a0f6dc92120e1352fb5643e90.png)

## ADB中输入 WIFI 指令，ADB没有输出

由于 WIFI 进程与操作 WIFI 配置的进程 `wifi daemon` 是两个进程，所以默认情况下，在 ADB 输入的 WIFI 指令操作会打印到串口。

如果需要输出指令，请打开此配置 `m menuconfig`

```
Allwinner  --->
	Wireless  --->
		<*> wifimanager-v2.0  --->
			[*]   wifi daemon log socket to wifi
```

![image-20250423152324936](images/image-20250423152324936-fbd6f0ac8bd31b3510f9ec3cbb4588b7.png)

## RTC 时钟源配置

1.  外部32K晶振：精准度最高，功耗低，但是需要外挂晶振
2.  RCCAL：精准度次高，需要定时校准（通过高频晶振对RCOSC进行校准），功耗高
3.  RCOSC：精准度不高，随温度变化，功耗低

配置方法分别如下：

1.  外部晶振

board.dts

```c
&prcm_ccu {
	extern_32k = "enabled";
	extern_fre = <32768>;
};
```

2.  RCCAL

board.dts

```c
&prcm_ccu {
	extern_32k = "disabled";
	extern_fre = <32768>;
};
```

3.  RCOSC

board.dts

```c
&prcm_ccu {
	/delete-property/ extern_32k;
	extern_fre = <32768>;
};
```

## 启动加载 WIFI 模块直接崩溃，无法使用

日志如下：

![image-20250515140637896](images/image-20250515140637896-58c71a28522d429702af4e6ab2e8ac0c.png)

-   这是因为 V821 使用了 V821B 的固件，或者 V821 使用了 V821B 的固件，造成 WIFI 驱动不同导致的系统崩溃。
-   请确认 `lunch` 时的芯片型号

![image-20250515140754615](data:image/png;base64,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)

## 快起系统启动打印大量乱码，无法启动

日志如下：

![image-20250515140923678](images/image-20250515140923678-b7df8f0f5859b9f8b1b768109dfbe35d.png)

-   这是因为 V821 使用了 V821B 的固件，或者 V821 使用了 V821B 的固件，造成 WIFI 驱动不同导致的系统崩溃。
-   请确认 `lunch` 时的芯片型号

![image-20250515140754615](data:image/png;base64,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)

## REBOOT 卡死

![image-20250515160546340](data:image/png;base64,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)

-   这是因为 V821 使用了 V821B 的固件，或者 V821 使用了 V821B 的固件，造成 WIFI 驱动不同导致的系统崩溃卡死。
-   请确认 `lunch` 时的芯片型号

![image-20250515140754615](data:image/png;base64,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)
