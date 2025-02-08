---
sidebar_position: 3
---
# E907小核开发

## 0.前言

​	DongshanPI-AICT开发板的V853芯片集成Arm Cortex-A7和RISC-V E907 双CPU，玄铁E907 是一款完全可综合的高端 MCU 处理器。它兼容 RV32IMAC 指令集，提供可观的整型性能提升以及高能效的浮点性能。E907 的主要特性包括：单双精度浮点单元，以及快速中断响应。下图为RISC-V E907 核的介绍。

![img](https://bbs.aw-ol.com/assets/uploads/files/1677222896251-934bf475-964e-4113-b4ac-9a19c4bc8783-%E5%9B%BE%E7%89%87.png)

本章主要讲述如何E907小核进行开发并与Arm A7大核进行通信。

平头哥E907官网：https://www.t-head.cn/product/E907?spm=a2ouz.12986968.0.0.7bfc2cbdcYnL2b

E907芯片资源下载中心：https://occ.t-head.cn/community/download?id=3916180248689188864

全志E907开发指南：https://tina.100ask.net/SdkModule/Linux_E907_DevelopmentGuide-01/

Yuzuki大佬的V85x E907 小核开发与使用：https://www.gloomyghost.com/live/20230215.aspx



## 1.配置E907环境

E907_RTOS BSP包：https://github.com/YuzukiHD/Yuzukilizard/tree/master/Software/BSP/e907_rtos

E907编译工具链： https://github.com/YuzukiHD/Yuzukilizard/releases/download/Compiler.0.0.1/riscv64-elf-x86_64-20201104.tar.gz

感谢Yuzuki大佬的V851S的仓库提供的E907_RTOS源码，这里我将E907开发包放在百度网盘中，方便大家获取。链接为：

链接：https://pan.baidu.com/s/1TX742vfEde9bMLd9IrwwqA?pwd=sp6a 
提取码：sp6a 

您可以在百度网盘的V853资料光盘中09_E907开发包中获取到`e907_rtos.tar.gz`

## 1.1 编译E907源码

将下载完成的E907开发包放在任意目录下，假设放在`/home/book/workspaces`目录下

```
book@100ask:~/workspaces$ ls
e907_rtos.tar.gz   
```

解压e907源码压缩包，输入`tar -xzvf e907_rtos.tar.gz `，例如：

```
book@100ask:~/workspaces$ tar -xzvf e907_rtos.tar.gz 
e907_rtos/
e907_rtos/README.md
e907_rtos/rtos/
e907_rtos/rtos/LICENSE
e907_rtos/rtos/toolchain/
e907_rtos/rtos/toolchain/riscv64-elf-x86_64-20201104/
e907_rtos/rtos/toolchain/riscv64-elf-x86_64-20201104/libexec/
e907_rtos/rtos/toolchain/riscv64-elf-x86_64-20201104/libexec/gcc/
...
```

解压完成后，进入e907源码目录

```
book@100ask:~/workspaces$ cd e907_rtos/
book@100ask:~/workspaces/e907_rtos$ ls
README.md  rtos  rtos-hal
```

进入`rtos/source/`目录下

```
book@100ask:~/workspaces/e907_rtos$ cd rtos/source/
book@100ask:~/workspaces/e907_rtos/rtos/source$ ls
disfunc.sh  ekernel   envsetup.sh  Kbuild   Kconfig.melis     Makefile      modules.order  platform.txt  scripts
drivers     emodules  include      Kconfig  Kconfig.platform  melis-env.sh  out            projects      tools
```

配置编译环境变量，输入`source melis-env.sh`

```
book@100ask:~/workspaces/e907_rtos/rtos/source$ source melis-env.sh
```

输入`lunch`选中对应的开发板

```
book@100ask:~/workspaces/e907_rtos/rtos/source$ lunch

You're building on Linux 100ask 5.4.0-148-generic #165~18.04.1-Ubuntu SMP Thu Apr 20 01:14:06 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux

Lunch menu... pick a combo:
The supported board:
    1. v851-e907-lizard
    2. v851-e907-lizard-tinymaix
    3. v853-e907-100ask
    4. v853-e907-100ask-tinymaix
What is your choice? 
```

此时输入3，并按回车。选择`v853-e907-100ask`方案，选择完成后会如下所示

```
book@100ask:~/workspaces/e907_rtos/rtos/source$ lunch

You're building on Linux 100ask 5.4.0-148-generic #165~18.04.1-Ubuntu SMP Thu Apr 20 01:14:06 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux

Lunch menu... pick a combo:
The supported board:
    1. v851-e907-lizard
    2. v851-e907-lizard-tinymaix
    3. v853-e907-100ask
    4. v853-e907-100ask-tinymaix
What is your choice? 3
You have select v853-e907-100ask 
============================================
Project Based On Platform sun20iw3p1 v853-e907-100ask
============================================
```

此时即可进行编译，输入`make`

```
book@100ask:~/workspaces/e907_rtos/rtos/source$ make
scripts/kconfig/conf  --silentoldconfig Kconfig
  CHK     include/config/kernel.release
  CHK     include/generated/uapi/melis/version.h
fatal: not a git repository (or any parent up to mount point /)
Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).
fatal: not a git repository (or any parent up to mount point /)
Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).
fatal: not a git repository (or any parent up to mount point /)
Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).
fatal: not a git repository (or any parent up to mount point /)
Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).
  UPD     include/generated/uapi/melis/version.h
  CHK     include/generated/utsrelease.h
  CC      sysconfig.fex
  CC      ekernel/arch/common/common.o
  LD      ekernel/arch/common/built-in.o
  AS      ekernel/arch/riscv/sunxi/blobdata.o
  LD      ekernel/arch/riscv/sunxi/built-in.o
  LD      ekernel/arch/riscv/built-in.o
  LD      ekernel/arch/built-in.o
  LD      ekernel/built-in.o
  LD [M]  ekernel/melis30.o
/home/book/workspaces/e907_rtos/rtos/source/../toolchain/riscv64-elf-x86_64-20201104//bin/riscv64-unknown-elf-ld: ekernel/melis30.o: section .dram_seg.stack lma 0x43c3a2b8 adjusted to 0x43c3a34c
  OBJCOPY ekernel/melis30.bin
  RENAME  ekernel/melis30.o ----> ekernel/melis30.elf
/home/book/workspaces/e907_rtos/rtos/source/../toolchain/riscv64-elf-x86_64-20201104//bin/riscv64-unknown-elf-strip: ekernel/stW7SdkR: section .dram_seg.stack lma 0x43c3a2b8 adjusted to 0x43c3a34c

   text    data     bss     dec     hex filename
 221280   17132   25488  263900   406dc ekernel/melis30.elf

  pack    melis

#### make completed successfully (11 seconds) ####
```

编译完成后会在当前目录的`ekernel/`下生成一个`melis30.elf`文件，该文件即可用于启动小核。



### 1.2 E907配置项

​	E907开发包的配置与Tina SDK的配置类似，在`e907_rtos/rtos/source`目录下，执行`make menuconfig`

例如：

```
book@100ask:~/workspaces/e907_rtos/rtos/source$ make menuconfig
```

执行完成后会进入如下界面：

![image-20230504112330976](images/image-20230504112330976.png)



## 2.加载E907小核

### 2.1 Tina配置

#### 2.1.1 设备树配置

​	在Tina根目录下，进入设备树目录

```
book@100ask:~/workspaces/tina-v853-open$ cd device/config/chips/v853/configs/100ask/
```

编辑设备树

```
book@100ask:~/workspaces/tina-v853-open/device/config/chips/v853/configs/100ask$ vi board.dts 
```

在设备树文件中找到E907相关的设备树节点，设备树默认设置为：

```
reserved-memory {
                e907_dram: riscv_memserve {
                        reg = <0x0 0x48000000 0x0 0x00400000>;
                        no-map;
                };

                vdev0buffer: vdev0buffer@47000000 {
                        /* 256k reserved for shared mem pool */
                        compatible = "shared-dma-pool";
                        reg = <0x0 0x47000000 0x0 0x40000>;
                        no-map;
                };

                vdev0vring0: vdev0vring0@47040000 {
                        reg = <0x0 0x47040000 0x0 0x20000>;
                        no-map;
                };

                vdev0vring1: vdev0vring1@47060000 {
                        reg = <0x0 0x47060000 0x0 0x20000>;
                        no-map;
                };
        };

        e907_rproc: e907_rproc@0 {
                compatible = "allwinner,sun8iw21p1-e907-rproc";
                clock-frequency = <600000000>;
                memory-region = <&e907_dram>, <&vdev0buffer>,
                                                <&vdev0vring0>, <&vdev0vring1>;

                mboxes = <&msgbox 0>;
                mbox-names = "mbox-chan";
                iommus = <&mmu_aw 5 1>;

                memory-mappings =
                /* DA            len         PA */
                        /* DDR for e907  */
                        < 0x48000000 0x00400000 0x48000000 >;
                core-name = "sun8iw21p1-e907";
                firmware-name = "melis-elf";
                status = "okay";
        };

        rpbuf_controller0: rpbuf_controller@0 {
                compatible = "allwinner,rpbuf-controller";
                remoteproc = <&e907_rproc>;
                ctrl_id = <0>;  /* index of /dev/rpbuf_ctrl */
                iommus = <&mmu_aw 5 1>;
                status = "okay";
        };

        rpbuf_sample: rpbuf_sample@0 {
                compatible = "allwinner,rpbuf-sample";
                rpbuf = <&rpbuf_controller0>;
                status = "okay";
        };
```

由于我们需要使用`uart3`打印E907小核的打印信息，为防止内核抢占`uart3`，所以需要禁用`uart3`节点

```
&uart3 {
        pinctrl-names = "default", "sleep";
        pinctrl-0 = <&uart3_pins_active>;
        pinctrl-1 = <&uart3_pins_sleep>;
        uart-supply = <&reg_dcdc1>;
        status = "okay";
};
```

修改设备树复用

```
uart3_pins_active: uart3@0 {
                allwinner,pins = "PH0", "PH1";
                allwinner,function = "uart3";
                allwinner,muxsel = <5>;
                allwinner,drive = <1>;
                allwinner,pull = <1>;
        };

        uart3_pins_sleep: uart3@1 {
                allwinner,pins = "PH0", "PH1";
                allwinner,function = "gpio_in";
                allwinner,muxsel = <0>;
        };
```



#### 2.1.2 内核配置

在Tina根目录下，执行`make kernel_menuconfig`，例如：

```
book@100ask:~/workspaces/tina-v853-open$ make kernel_menuconfig
```

**1.使能硬件支持**

进入内核配置界面后，进入` Device Drivers  `目录，选中`Mailbox Hardware Support`，如下图所示

![image-20230504145616213](images/image-20230504145616213.png)

选中后进入`Mailbox Hardware Support`目录中，选中`sunxi Mailbox`和`sunxi rv32 standby driver`，选中完成后如下图所示：

![image-20230504145817407](images/image-20230504145817407.png)

**2.使能RPMsg驱动**

进入如下目录中

```
→ Device Drivers 
	→ Rpmsg drivers
```

选中如下配置

```
<*> allwinnertech rpmsg driver for v853-e907
<*> allwinnertech rpmsg hearbeat driver
<*> sunxi rpmsg ctrl driver
<*> Virtio RPMSG bus driver 
```

选中完成后如下图所示：

![image-20230504145408205](images/image-20230504145408205.png)

**3.使能共享内存驱动**

​	进入如下目录中

```
→ Device Drivers 
	→ Remoteproc drivers 
```

选中如下配置

```
<*> SUNXI remote processor support  --->
```

如下图所示：

![image-20230504150510997](images/image-20230504150510997.png)

修改完成后，保存内核配置并退出。

#### 2.1.3 编译新镜像

在Tina根目录下，输入`make`编译刚刚选中的内核驱动，编译完成后，输入`pack`，打包生成新镜像。例如：

```
book@100ask:~/workspaces/tina-v853-open$ make
...
book@100ask:~/workspaces/tina-v853-open$ pack
...
```

生成新镜像后，将生成的`v853_linux_100ask_uart0.img`文件拷贝到Windows主机端。

### 2.2 E907配置

#### 2.2.1 修改E907链接脚本

​	进入目录`e907_rtos/rtos/source/projects/v853-e907-100ask`中，找到`kernel.lds`文件，该文件保存有E907小核的链接信息。

```
book@100ask:~/workspaces/e907_rtos/rtos/source/projects/v853-e907-100ask$ ls
configs  data  epos.img  kernel.lds  src  version
```

修改`kernel.lds`，找到`MEMORY`节点，修改起始地址为`0x48000000`，长度为`0x00400000`。此参数需要和Tina设备树中的E907内存参数一致，所以可修改`MEMORY`节点参数为：

```
MEMORY
{
   /*DRAM_KERNEL: 4M */
   DRAM_SEG_KRN (rwx) : ORIGIN = 0x48000000, LENGTH = 0x00400000
}
```

两者对比图如下：

![image-20230504152546509](images/image-20230504152546509.png)

这里使用的`0x48000000`是假设V853拥有128M的内存，可设置十六进制为为`0x48000000`；长度为4M，十六进制为`0x00400000`

#### 2.2.2 修改E907配置

进入`e907_rtos/rtos/source/projects/v853-e907-100ask/configs`目录下，修改`defconfig`文件，例如：

```
book@100ask:~/workspaces/e907_rtos/rtos/source/projects/v853-e907-100ask$ cd configs/
book@100ask:~/workspaces/e907_rtos/rtos/source/projects/v853-e907-100ask/configs$ ls
defconfig  sys_config.fex
```

修改下面三个参数为：

```
CONFIG_DRAM_PHYBASE=0x48000000
CONFIG_DRAM_VIRTBASE=0x48000000
CONFIG_DRAM_SIZE=0x0400000
```

如下图所示：

![image-20230504153420513](images/image-20230504153420513.png)

#### 2.2.3 使用uart3输出信息

**1.修改引脚复用**

配置引脚复用文件，进入`e907_rtos/rtos/source/projects/v853-e907-100ask/configs`目录下

修改`sys_config.fex`文件，通过查询数据手册，查看引脚复用功能，我们使用PH0和PH1作为`uart3`功能

![image-20230504161901226](images/image-20230504161901226.png)

修改uart3节点为：

```
[uart3]
uart_tx         = port:PH00<5><1><default><default>
uart_rx         = port:PH01<5><1><default><default>
```

**2.修改配置**

在`e907_rtos/rtos/source`目录下输入`make menuconfig`，进入E907配置界面

进入如下目录，选中`[*] Support Serial Driver`

```
 → Kernel Setup 
 	→ Drivers Setup 
 		→ Melis Source Support
 			[*] Support Serial Driver
```

![image-20230504155321387](images/image-20230504155321387.png)



进入如下目录，选中`[*] enable sysconfig`，启用读取解析 sys_config.fex 功能

```
 → Kernel Setup 
 	→ Drivers Setup 
 		→ SoC HAL Drivers 
 			→ Common Option 
 				[*] enable sysconfig
```

![image-20230504155644570](images/image-20230504155644570.png)



进入如下目录中，启用uart驱动，并使用uart3。

```
 → Kernel Setup 
 	→ Drivers Setup 
 		→ SoC HAL Drivers 
 			→ UART Devices
 				[*] enable uart driver 
 				[*]   support uart3 device
 				(3)   cli uart port number 
```

![image-20230504155927822](images/image-20230504155927822.png)

进入如下目录，启用sys_config.fex 解析器

```
 → Kernel Setup 
 	→ Subsystem support 
 		→ devicetree support 
 			[*] support traditional fex configuration method parser. 
```

![image-20230504160213237](images/image-20230504160213237.png)

保存并退出E907配置。

#### 2.2.4 编译生成新镜像

在`workspaces/e907_rtos/rtos/source`目录下，输入`make`

```
book@100ask:~/workspaces/e907_rtos/rtos/source$ make
  CHK     include/config/kernel.release
  CHK     include/generated/uapi/melis/version.h
fatal: not a git repository (or any parent up to mount point /)
Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).
fatal: not a git repository (or any parent up to mount point /)
Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).
fatal: not a git repository (or any parent up to mount point /)
Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).
fatal: not a git repository (or any parent up to mount point /)
Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).
  UPD     include/generated/uapi/melis/version.h
  CHK     include/generated/utsrelease.h
  CC      sysconfig.fex
  CC      ekernel/arch/common/common.o
  LD      ekernel/arch/common/built-in.o
  AS      ekernel/arch/riscv/sunxi/blobdata.o
  LD      ekernel/arch/riscv/sunxi/built-in.o
  LD      ekernel/arch/riscv/built-in.o
  LD      ekernel/arch/built-in.o
  LD      ekernel/built-in.o
  LD [M]  ekernel/melis30.o
/home/book/workspaces/e907_rtos/rtos/source/../toolchain/riscv64-elf-x86_64-20201104//bin/riscv64-unknown-elf-ld: ekernel/melis30.o: section .dram_seg.stack lma 0x4803a2b8 adjusted to 0x4803a34c
  OBJCOPY ekernel/melis30.bin
  RENAME  ekernel/melis30.o ----> ekernel/melis30.elf
/home/book/workspaces/e907_rtos/rtos/source/../toolchain/riscv64-elf-x86_64-20201104//bin/riscv64-unknown-elf-strip: ekernel/stWPSq13: section .dram_seg.stack lma 0x4803a2b8 adjusted to 0x4803a34c

   text    data     bss     dec     hex filename
 221280   17132   25488  263900   406dc ekernel/melis30.elf

  pack    melis

#### make completed successfully (7 seconds) ####
```

编译完成后会在`ekernel`目录下生成的`melis30.elf`。



### 2.4 开发板内使能E907

使用全志烧写工具`AllwinnertechPhoeniSuit`更新Tina新镜像，详情请参考https://forums.100ask.net/t/topic/2882

更新完成后，打开串口终端进入开发板控制台，将`melis30.elf`拷贝到`/lib/firmware`目录下。

假设我使用ADB功能将文件拷贝到开发板的`root/`目录下

```
root@TinaLinux:~# cd /root/
root@TinaLinux:~# ls
melis30.elf
```

将`root`目录下的`melis30.elf`拷贝到`/lib/firmware`目录下

```
root@TinaLinux:~# cp melis30.elf /lib/firmware/
root@TinaLinux:~# ls /lib/firmware/
boot_xr829.bin   fw_xr829.bin     melis30.elf      sdd_xr829.bin
etf_xr829.bin    fw_xr829_bt.bin  regulatory.db
```

拷贝完成后，可以在`/lib/firmware`目录下，看到小核固件。

#### 2.4.1 连接开发板的uart3

​	此时需要使用USB转串口模块，连接我们上面设置的`uart3`。我们需要找到开发板上的PH0、PH1、GND，分别连接到USB转串口模块的RXD、TXD、GND。DongshanPI-AICT开发板已经将PH0、PH1、GND引出来，位置图图下所示

![image-20230504175344715](images/image-20230504175344715.png)

具体的引脚可查看开发板背面的丝印，确认引脚位置。

![image-20230504175534607](images/image-20230504175534607.png)

通过背面的丝印可以知道PH0、PH1、GND的位置，如下图所示，PH0、PH1、GND，分别连接到USB转串口模块的RX、TX、GND。

![image-20230504180138631](images/image-20230504180138631.png)

连接完成后将USB转串口模块插入windows主机端后，使用串口软件打开uart3串口界面，波特率为115200。

在Tina Linux开发板串口终端输入

```
root@TinaLinux:~# echo melis30.elf > /sys/kernel/debug/remoteproc/remoteproc0/firmware 
```

将`melis30.elf`固件放在硬件节点`firmware `下，启动E907固件

```
root@TinaLinux:~# echo start > /sys/kernel/debug/remoteproc/remoteproc0/state
[ 3926.510018]  remoteproc0: powering up e907_rproc
[ 3926.515440]  remoteproc0: failed to parser head (melis30.elf) ret=-2
[ 3926.522674]  remoteproc0: failed to read boot_package item
[ 3926.528930]  remoteproc0: request_firmware failed from boot_package: -14
[ 3926.537528] virtio_rpmsg_bus virtio0: rpmsg host is online
[ 3926.543964]  remoteproc0: registered virtio0 (type 7)
[ 3926.550538]  remoteproc0: remote processor e907_rproc is now up
root@TinaLinux:~# [ 3926.560537] virtio_rpmsg_bus virtio0: creating channel rpbuf-service addr 0x400
[ 3926.569199] virtio_rpmsg_bus virtio0: creating channel sunxi,rpmsg_heartbeat addr 0x401
[ 3926.578725] virtio_rpmsg_bus virtio0: creating channel sunxi,notify addr 0x402
[ 3926.587194] virtio_rpmsg_bus virtio0: creating channel sunxi,rpmsg_ctrl addr 0x403
```

使能后可以在另一个串口界面看到如下打印信息

```
|commitid: 
|halgitid: 
|timever : Thu, 04 May 2023 04:22:23 -0400

scheduler startup
msh >Start Rpmsg Hearbeat Timer
rpmsg ctrldev: Start Running...
```

按下回车即可进入终端界面。

输入`ps`即可看见小核进程信息

```
msh >ps
thread                           pri  status      sp     stack size max used left tick  error
-------------------------------- ---  ------- ---------- ----------  ------  ---------- ---
tshell                            21  ready   0x000003e8 0x00004000    19%   0x00000008 000
ctrldev                            6  suspend 0x00000148 0x00001000    08%   0x0000000a 000
rpmsg_srm                          8  suspend 0x000000f8 0x00000800    22%   0x0000000a 000
vring-ipi                         15  suspend 0x00000118 0x00002000    03%   0x0000000a 000
rpbuf_init                         8  suspend 0x000000e8 0x00001000    12%   0x0000000a 000
standby                            1  suspend 0x00000128 0x00001000    07%   0x0000000a 000
tidle                             31  ready   0x00000178 0x00002000    04%   0x0000001e 000
timer                              8  suspend 0x000000d8 0x00000200    73%   0x0000000a 000
```

## 3.双核通信

### 3.1 E907小核创建通讯节点

在E907小核串口终端建立两个通讯节点用于监听数据，输入`eptdev_bind test 2`

```
msh >eptdev_bind test 2
```

查看监听节点，输入`rpmsg_list_listen`

```
msh >rpmsg_list_listen
name             listen  alive
test             2  0
console                  100  0
```

### 3.2 大核创建通讯节点

在Tina LInux下也创建两个通讯监听节点，输入以下两个命令

```
echo test > /sys/class/rpmsg/rpmsg_ctrl0/open
echo test > /sys/class/rpmsg/rpmsg_ctrl0/open
```

输入后，如下所示：

```
root@TinaLinux:~# echo test > /sys/class/rpmsg/rpmsg_ctrl0/open
[ 5060.227158] virtio_rpmsg_bus virtio0: creating channel sunxi,rpmsg_client addr 0x404
s/rpmsg/rpmsg_ctrl0/openroot@TinaLinux:~# echo test > /sys/class/rpmsg/rpmsg_ctrl0/open
[ 5061.464758] virtio_rpmsg_bus virtio0: creating channel sunxi,rpmsg_client addr 0x405
```

在大核TIna Linux中也创建了两个监听节点，输入`ls /dev/rpmsg*`查看节点信息

```
root@TinaLinux:~# ls /dev/rpmsg*
/dev/rpmsg0       /dev/rpmsg1       /dev/rpmsg_ctrl0
```

创建完成后，可以在E907小核终端中查看自动输出的信息。

```
msh >ctrldev: Rx 44 Bytes
client: Rx 8 Bytes
rpmsg0: binding
send 0x13131411 to rpmsg0
create rpmsg0 client success
ctrldev: Rx 44 Bytes
client: Rx 8 Bytes
rpmsg1: binding
send 0x13131411 to rpmsg1
create rpmsg1 client success
```

### 3.3 大核传输至E907小核

在Tina LInux下输入

```
echo "hello DongshanPI-AICT" > /dev/rpmsg0
echo "hello Tina Linux" > /dev/rpmsg1
```

将`Linux Message 0`信息通过创建的监听节点传输到E907小核，例如：

```
root@TinaLinux:~# echo "hello DongshanPI-AICT" > /dev/rpmsg0
root@TinaLinux:~# echo "hello Tina Linux" > /dev/rpmsg1
```

输入后，打开E907串口终端可以发现，大核传输过来的信息。

```
rpmsg0: Rx 22 Bytes
Data:hello DongshanPI-AICT

rpmsg1: Rx 17 Bytes
Data:hello Tina Linux
```

### 3.4 E907小核传输至大核

​	在小核端需要使用命令 `eptdev_send` 用法 `eptdev_send <id> <data>`，这里的`id`号从0开始，我们设置有两个通信节点，所以id号分别为0和1。

​	在小核的串口终端输入以下命令：

```
eptdev_send 0 "hello E907"
eptdev_send 1 "hello E907"
```

例如：

```
msh >eptdev_send 0 "hello E907"
will send hello E907 to rpmsg0
msh >eptdev_send 1 "hello E907"
will send hello E907 to rpmsg1
```

输入完成后，小核会将信息分别传入rpmsg0和rpmsg1两个通讯节点。可以在大核Tina Linux端输入

```
cat /dev/rpmsg0
cat /dev/rpmsg1
```

可查看从E907小核传输过来的信息。例如:

```
root@TinaLinux:~# cat /dev/rpmsg0
hello E907
^C
root@TinaLinux:~# cat /dev/rpmsg1
hello E907
^C
```

按下Crtl+C结束监听前持续监听该节点。

​	您可以在小核端多次传输信息到该节点，该节点支持持续接受小核传输的信息，例如：

在E907小核，多次传输信息到监听节点`rpmsg0`

```
msh >eptdev_send 0 "hello E907 "
will send hello E907  to rpmsg0
msh >eptdev_send 0 "hello E907 "
will send hello E907  to rpmsg0
msh >eptdev_send 0 "hello E907 "
will send hello E907  to rpmsg0
msh >eptdev_send 0 "hello E907 "
will send hello E907  to rpmsg0
msh >eptdev_send 0 "hello E907 "
will send hello E907  to rpmsg0
msh >eptdev_send 0 "hello E907 "
will send hello E907  to rpmsg0
msh >eptdev_send 0 "hello E907 "
will send hello E907  to rpmsg0
```

在大核端则会一直接收到小核传输过来的信息

```
root@TinaLinux:~# cat /dev/rpmsg0
hello E907 hello E907 hello E907 hello E907 hello E907 hello E907 hello E907 
```

### 3.5 关闭通讯

​	在大核Tina Linux端，操作节点即可，输入以下命令，`echo <id>`给到rpmsg的控制关闭节点即可

```
echo 0 > /sys/class/rpmsg/rpmsg_ctrl0/close
echo 1 > /sys/class/rpmsg/rpmsg_ctrl0/close
```

例如：

```
root@TinaLinux:~# echo 0 > /sys/class/rpmsg/rpmsg_ctrl0/close
[ 6783.156899] virtio_rpmsg_bus virtio0: destroying channel sunxi,rpmsg_client addr 0x404
root@TinaLinux:~# echo 1 > /sys/class/rpmsg/rpmsg_ctrl0/close
root@TinaLinux:~# [ 6784.224740] virtio_rpmsg_bus virtio0: destroying channel sunxi,rpmsg_client addr 0x405
```

​	此时E907小核端也会自动关闭通信节点，自动输出以下信息

```
send 0x13131411 to rpmsg0
rpmsg0: unbinding
ctrldev: Rx 44 Bytes
send 0x13131411 to rpmsg1
rpmsg1: unbinding
```

