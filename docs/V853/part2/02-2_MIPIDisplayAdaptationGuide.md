---
sidebar_position: 2
---
# MIPI显示屏适配指南

## 0.前言

​	由于之前我们已经适配过RGB屏，如果我们去适配了4寸MIPI屏，那么RGB屏就不能使用了。对于4寸屏购买链接为：

[百问网4寸MIPI屏](https://item.taobao.com/item.htm?spm=a1z10.5-c-s.w4002-18944745104.11.268678a0HuK0No&id=706091265930)

![image-20230413093019260](images/image-20230413093019260.png)

LCD_调试指南:https://tina.100ask.net/SdkModule/Linux_LCD_DevelopmentGuide-01/

Display_开发指南:https://tina.100ask.net/SdkModule/Linux_Display_DevelopmentGuide-01/



4寸屏适配资源包：https://forums.100ask.net/uploads/short-url/g7BQ0FPSSnKHSptR2QMjIPwnwno.zip。该资源包里面包含了适配修改后的所有文件（包括驱动程序、设备树和配置文件等）

## 1.添加新驱动

将驱动程序添加到

内核的lcd驱动目录下：

`tina-v853-open/kernel/linux-4.9/drivers/video/fbdev/sunxi/disp2/disp/lcd`

uboot的lcd驱动目录下：

` tina-v853-open/brandy/brandy-2.0/u-boot-2018/drivers/video/sunxi/disp2/disp/lcd/`

由于uboot和内核中的屏驱动会存在一些差别，下面分别展示出uboot和内核中不同的屏驱动。具体源文件可以在4寸屏适配资源包中查看。

### 1.1 uboot驱动程序

驱动程序头文件tft08006.h

```c
#ifndef _TFT08006_H
#define _TFT08006_H

#include "panels.h"

extern __lcd_panel_t tft08006_panel;

extern s32 bsp_disp_get_panel_info(u32 screen_id, disp_panel_para *info);

#endif /*End of file*/
```

驱动程序的C文件tft08006.c

这里只展示与内核不同的部分

```c
__lcd_panel_t tft08006_panel = {
        /* panel driver name, must mach the name of
         * lcd_drv_name in sys_config.fex
         */
        .name = "tft08006",
        .func = {
                .cfg_panel_info = lcd_cfg_panel_info,
                        .cfg_open_flow = lcd_open_flow,
                        .cfg_close_flow = lcd_close_flow,
                        .lcd_user_defined_func = lcd_user_defined_func,
        },
};
```

### 1.2 内核驱动程序

驱动程序头文件tft08006.h

```c
#ifndef _TFT08006_H
#define _TFT08006_H

#include "panels.h"

extern struct __lcd_panel tft08006_panel;

extern s32 bsp_disp_get_panel_info(u32 screen_id, struct disp_panel_para *info);

#endif /*End of file*/
```

驱动程序的C文件"tft08006.c，这里只展示与uboot不同的部分。

```c
struct __lcd_panel tft08006_panel = {
        /* panel driver name, must mach the name of
         * lcd_drv_name in sys_config.fex
         */
        .name = "tft08006",
        .func = {
                .cfg_panel_info = lcd_cfg_panel_info,
                        .cfg_open_flow = lcd_open_flow,
                        .cfg_close_flow = lcd_close_flow,
                        .lcd_user_defined_func = lcd_user_defined_func,
        },
};
```

## 2.修改内核中panels.h和panels.c

由于内核中没有对tft08006屏驱动有相关的配置，所以我们还需要在panels全志显示驱动中增加定义。

### 2.1 修改内核中panels.h

在屏驱动目录下修改panels.h

```
book@100ask:~/workspaces/tina-v853-open/kernel/linux-4.9/drivers/video/fbdev/sunxi/disp2/disp/lcd$ vi panels.h
```

在icn6202屏驱动定义的后面增加tft08006屏驱动定义

```c
#ifdef CONFIG_LCD_SUPPORT_ICN6202
extern struct __lcd_panel icn6202_panel;
#endif
#ifdef CONFIG_LCD_SUPPORT_ICN6202
extern struct __lcd_panel icn6202_panel;
#endif
#ifdef CONFIG_LCD_SUPPORT_NT35510_MIPI
extern struct __lcd_panel nt35510_panel;
#endif
```

按下ESC，输入`:wq`，保存刚才的修改并退出

### 2.2 修改内核中panels.c

在屏驱动目录下修改panels.c

```
book@100ask:~/workspaces/tina-v853-open/kernel/linux-4.9/drivers/video/fbdev/sunxi/disp2/disp/lcd$ vi panels.c
```

在icn6202屏驱动定义的后面增加tft08006屏驱动定义

```c
#ifdef CONFIG_LCD_SUPPORT_ICN6202
       &icn6202_panel,
#endif
#ifdef CONFIG_LCD_SUPPORT_TFT08006
        &tft08006_panel,
#endif

#ifdef CONFIG_LCD_SUPPORT_NT35510_MIPI
        &nt35510_panel,
#endif
```

按下ESC，输入`:wq`，保存刚才的修改并退出

## 3.修改内核中Kconfig和Makefile

### 3.1 修改内核中的Kconfig

修改屏驱动目录下的Kconfig，使内核配置中增加tft08006屏驱动的，以便后续选择编译该屏驱动

在屏驱动目录下输入`vi Kconfig`

```
tina-v853-open/kernel/linux-4.9/drivers/video/fbdev/sunxi/disp2/disp/lcd$ vi Kconfig
```

在icn6202屏驱动配置的后面增加tft08006屏驱动配置

```c
config LCD_SUPPORT_ICN6202
       bool "LCD support icn6202 panel"
       default n
       ---help---
               If you want to support icn6202 panel for display driver, select it.

config LCD_SUPPORT_TFT08006
       bool "LCD support tft08006 panel"
       default n
       ---help---
               If you want to support tft08006 panel for display driver, select it.

config LCD_SUPPORT_NT35510_MIPI
        bool "LCD support nt35510_mipi panel"
        default n
        help
                If you want to support nt35510_mipi panel for display driver, select it.
```

按下ESC，输入`:wq`，保存刚才的修改并退出

### 3.2 修改内核中的Makefile

返回屏驱动的上一级目录，修改Makefile文件

```
book@100ask:~/workspaces/tina-v853-open/kernel/linux-4.9/drivers/video/fbdev/sunxi/disp2/disp$ vi Makefile
```

在icn6202屏驱动编译规则的后面增加tft08006屏驱动编译规则

```c
disp-$(CONFIG_LCD_SUPPORT_ICN6202) += lcd/icn6202.o
disp-$(CONFIG_LCD_SUPPORT_TFT08006) += lcd/tft08006.o
disp-$(CONFIG_LCD_SUPPORT_NT35510_MIPI) += lcd/nt35510.o
```

按下ESC，输入`:wq`，保存刚才的修改并退出

## 4.修改内核配置

在Tina的根目录下输入`make kernel_menuconfig`,进入内核配置界面。

```
book@100ask:~/workspaces/tina-v853-open$ make kernel_menuconfig
```

在选中屏驱动前，要确保`DISP Driver Support(sunxi-disp2) `，我们的提供的SDK默认已经打开了，如果您之前关闭了，需要在内核配置界面中，进入`Video support for sunxi`目录下输入Y选中`sunxi-disp2`打开lcd节点配置。

```
→ Device Drivers 
	→ Graphics support 
		→ Frame buffer Devices 
			→ Video support for sunxi
				<*> DISP Driver Support(sunxi-disp2)
```

进入屏驱动目录，输入Y选中tft08006

```
→ Device Drivers 
	→ Graphics support 
		→ Frame buffer Devices 
			→ Video support for sunxi 
				→ LCD panels select 
					[*] LCD support tft08006 panel
```

如下图所示，选中tft08006屏驱动，编译到内核中。

![image-20230412141639648](images/image-20230412141639648.png)

保存并退出内核配置界面。

## 5.修改uboot配置

进入uboot的根目录下，执行`make menuconfig`，打开uboot配置界面。

```
book@100ask:~/workspaces/tina-v853-open/brandy/brandy-2.0/u-boot-2018$ make menuconfig
```

在选中屏驱动前，要确保`DISP Driver Support(sunxi-disp2) `，我们的提供的SDK默认已经打开了，如果您之前关闭了，需要在内核配置界面中，进入`Graphics support`目录下输入Y选中`sunxi-disp2`打开lcd节点配置。

```
→ Device Drivers 
	→ Graphics support 
		[*] DISP Driver Support(sunxi-disp2)  --->
```

进入屏驱动目录下，输入Y选中TFT08006屏驱动。

```
→ Device Drivers 
	→ Graphics support 
		→ LCD panels select 
			 [*] LCD support TFT08006 panel 
```

如下图所示，选中tft08006屏驱动。

![image-20230412143445778](images/image-20230412143445778.png)

保存并退出uboot配置界面

## 6.修改设备树

设备树位置：tina-v853-open/device/config/chips/v853/configs/100ask/

```
book@100ask:~/workspaces/tina-v853-open/device/config/chips/v853/configs/100ask$ ls
BoardConfig.mk  board.dts  buildroot  env.cfg  linux-4.9  sys_config.fex  uboot-board.dts
```

其中board.dts为内核设备树，uboot-board.dts为uboot设备树。

### 6.1 修改uboot设备树

在设备树的目录下输入`vi uboot-board.dts`，编译uboot设备树。

```
book@100ask:~/workspaces/tina-v853-open/device/config/chips/v853/configs/100ask$ vi uboot-board.dts
```

注释掉原来的lcd0节点，修改tft08006屏lcd0节点

```
&lcd0 {
        base_config_start   = <1>;
        lcd_used            = <1>;

        lcd_driver_name     = "tft08006";

        lcd_backlight       = <500>;
        lcd_if              = <4>;

        lcd_x               = <480>;
        lcd_y               = <800>;
        lcd_width           = <52>;
        lcd_height          = <52>;
        lcd_dclk_freq       = <25>;

        lcd_pwm_used        = <1>;
        lcd_pwm_ch          = <9>;
        lcd_pwm_freq        = <50000>;
        lcd_pwm_pol         = <1>;
        lcd_pwm_max_limit   = <255>;

        lcd_hbp             = <10>;
        lcd_ht              = <515>;
        lcd_hspw            = <5>;

        lcd_vbp             = <20>;
        lcd_vt              = <830>;
        lcd_vspw            = <5>;

        lcd_dsi_if          = <0>;
        lcd_dsi_lane        = <2>;
        lcd_dsi_format      = <0>;
        lcd_dsi_te          = <0>;
        lcd_dsi_eotp        = <0>;
        lcd_frm             = <0>;
        lcd_io_phase        = <0x0000>;
        lcd_hv_clk_phase    = <0>;
        lcd_hv_sync_polarity= <0>;
        lcd_gamma_en        = <0>;
        lcd_bright_curve_en = <0>;
        lcd_cmap_en         = <0>;
        lcdgamma4iep        = <22>;

        lcd_gpio_0          = <&pio PH 0 1 0 3 1>;
        pinctrl-0           = <&dsi4lane_pins_a>;
        pinctrl-1           = <&dsi4lane_pins_b>;
        base_config_end     = <1>;

};
```

在&pio节点后增加复用引脚

```
         dsi4lane_pins_a: dsi4lane@0 {
                allwinner,pins = "PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD9", "PD10", "PD11";
                allwinner,pname = "PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD9", "PD10", "PD11";
                allwinner,function = "dsi";
                allwinner,muxsel = <5>;
                allwinner,drive = <3>;
                allwinner,pull = <0>;
        };

        dsi4lane_pins_b: dsi4lane@1 {
                allwinner,pins = "PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD9", "PD10", "PD11";
                allwinner,pname = "PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD9", "PD10", "DP11";
                allwinner,function = "io_disabled";
                allwinner,muxsel = <0xf>;
                allwinner,drive = <1>;
                allwinner,pull = <0>;
        };
```

### 6.2 修改内核设备树

在设备树的目录下输入`vi board.dts`，编译内核设备树。

```
book@100ask:~/workspaces/tina-v853-open/device/config/chips/v853/configs/100ask$ vi board.dts
```

注释掉原来的lcd0节点，修改tft08006屏lcd0节点

```
&lcd0 {
        base_config_start   = <1>;
        lcd_used            = <1>;

        lcd_driver_name     = "tft08006";

        lcd_backlight       = <500>;
        lcd_if              = <4>;

        lcd_x               = <480>;
        lcd_y               = <800>;
        lcd_width           = <52>;
        lcd_height          = <52>;
        lcd_dclk_freq       = <25>;

        lcd_pwm_used        = <1>;
        lcd_pwm_ch          = <9>;
        lcd_pwm_freq        = <50000>;
        lcd_pwm_pol         = <1>;
        lcd_pwm_max_limit   = <255>;

        lcd_hbp             = <10>;
        lcd_ht              = <515>;
        lcd_hspw            = <5>;

        lcd_vbp             = <20>;
        lcd_vt              = <830>;
        lcd_vspw            = <5>;

        lcd_dsi_if          = <0>;
        lcd_dsi_lane        = <2>;
        lcd_dsi_format      = <0>;
        lcd_dsi_te          = <0>;
        lcd_dsi_eotp        = <0>;
        lcd_frm             = <0>;
        lcd_io_phase        = <0x0000>;
        lcd_hv_clk_phase    = <0>;
        lcd_hv_sync_polarity= <0>;
        lcd_gamma_en        = <0>;
        lcd_bright_curve_en = <0>;
        lcd_cmap_en         = <0>;
        lcdgamma4iep        = <22>;

        lcd_gpio_0          = <&pio PH 0 1 0 3 1>;
        pinctrl-0           = <&dsi4lane_pins_a>;
        pinctrl-1           = <&dsi4lane_pins_b>;
        base_config_end     = <1>;

};
```

在&pio节点后增加复用引脚

```
         dsi4lane_pins_a: dsi4lane@0 {
                allwinner,pins = "PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD9", "PD10", "PD11";
                allwinner,pname = "PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD9", "PD10", "PD11";
                allwinner,function = "dsi";
                allwinner,muxsel = <5>;
                allwinner,drive = <3>;
                allwinner,pull = <0>;
        };

        dsi4lane_pins_b: dsi4lane@1 {
                allwinner,pins = "PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD9", "PD10", "PD11";
                allwinner,pname = "PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD9", "PD10", "DP11";
                allwinner,function = "io_disabled";
                allwinner,muxsel = <0xf>;
                allwinner,drive = <1>;
                allwinner,pull = <0>;
        };
```

## 7.增加I2C触摸

通过拿到的屏幕资料包，我们可以知道该MIPI屏的触摸芯片为FT5336，下面我们使用全志已经内置好的FT6336触摸驱动。

### 7.1 修改设备树

修改twi2节点，使用ft6336驱动，修改触摸的范围。宽X为480，高y为800。其中初始化引脚需要查看V853底板原理图，其中初始化引脚为PH7，唤醒引脚为PH8。

![image-20230414193438036](images/image-20230414193438036.png)

```
&twi2 {
        ctp@38 {
                status = "okay";
                ctp_used = <1>;
                ctp_name = "ft6336";
                ctp_twi_id = <0x2>;
                ctp_twi_addr = <0x38>;
                ctp_screen_max_x = <0x480>;
                ctp_screen_max_y = <0x800>;
                ctp_revert_x_flag = <0x0>;
                ctp_revert_y_flag = <0x1>;
                ctp_exchange_x_y_flag = <0x0>;
                ctp_int_port = <&pio PH 7 6 1 3 0xffffffff>;
                ctp_wakeup   = <&pio PH 8 1 1 3 0xffffffff>;
        };
};
```

对于设备树的参数意义，可以访问百问网的Tina站点:https://tina.100ask.net/SdkModule/Linux_Deploy_DevelopmentGuide-02/#39

### 7.2 修改内核配置

​	由于我们之前适配过了RGB屏触摸驱动，所以需要进入内核中修改为我们使用的新驱动，进入如下目录中，按下空格键取消勾选之前的触摸驱动gt9xxnew touchscreen driver，输入Y选中我们使用的ft6336 touchscreen driver新驱动，并保存退出。

```
→ Device Drivers 
	→ Input device support 
		→ Touchscreens
			<*>   ft6336 touchscreen driver
```

![image-20230414193735639](images/image-20230414193735639.png)

### 7.3 修改驱动程序

修改ft6336.c触摸驱动程序，这里只展示修改的部分，源文件可见4寸屏适配资源包中查看。

```
                        input_report_abs(ts->input_dev,
                                        ABS_MT_POSITION_X, -(event->au16_x[i]-480));
                        input_report_abs(ts->input_dev,
                                        ABS_MT_POSITION_Y, -(event->au16_y[i]-800));
```

### 7.4 LVGL绑定新触摸节点

由于Tina使用的默认绑定的触摸节点为/dev/input/event0，我们需要修改lvgl驱动头文件中绑定的节点为我们触摸驱动上报数据的节点，我们触摸驱动上报的节点为event2，所以需要进入

`tina-v853-open/platform/thirdparty/gui/lvgl-8/lv_examples/src`目录下修改lv_drv_conf.h头文件，如下所示

```shell
book@100ask:~/workspaces/tina-v853-open$ cd platform/thirdparty/gui/lvgl-8/lv_examples/src/
book@100ask:~/workspaces/tina-v853-open/platform/thirdparty/gui/lvgl-8/lv_examples/src$ vi lv_drv_conf.h
```

找到触摸节点中的`LIBINPUT_NAME`，将原来的`/dev/input/event0`修改`/dev/input/event2`,如下图红框内所示。

![image-20230417101852786](images/image-20230417101852786.png)

注意：我们这里修改的是头文件，可能之前编译生成过了之后再重新编译时可能不会再编译头文件，导致修改的节点不会生效，可以手动删除out目录中的`lv_examples`示例程序或者直接删除out目录重新编译即可。具体原因可以观看韦东山老师的《ARM架构与编程》课程中的gcc编译过程详解。访问链接为：[ARM架构与编程](https://www.100ask.net/p/t_pc/goods_pc_detail/goods_detail/p_5f857338e4b0e95a89c3cdb0)

## 8.编译系统并打包生成镜像

返回Tina根目录下，输入`make`,编译系统

```shell
book@100ask:~/workspaces/tina-v853-open$ make -j4
...
sun8iw21p1 compile Kernel successful
INFO: ----------------------------------------
INFO: build Tina OK.
INFO: ----------------------------------------
```

打包生成镜像，输入`pack`

```shell
book@100ask:~/workspaces/tina-v853-open$ pack
...
Dragon execute image.cfg SUCCESS !
----------image is at----------

33M     /home/book/workspaces/tina-v853-open/out/v853/100ask/openwrt/v853_linux_100ask_uart0.img

pack finish
```

## 9.烧录并测试

​	打包完成后，将新生成的镜像拷贝到Windows主机电脑上，使用全志PhoenixSuit烧写工具，烧写到开发板上。具体可以参考：https://forums.100ask.net/t/topic/2882。烧写完成后需要**断电**，才能连接MIPI屏的排线到MIPI屏接口，注意排线的线序是否一致。

​	接完排线后，重新接入电源，和2条Type-C数据线，再将开关拨向电源接口处上电启动，启动时会出现Tina Linux小企鹅logo，进入系统后，可以查看触摸节点

```
root@TinaLinux:/# ls /dev/input/
event0  event1  event2
```

​	我们使用的event2，如果你不确定您的触摸驱动程序使用的是哪个，可以通过`cat /dev/input/event*`，其中`*`表示要查看的是哪一个触摸节点，例如我使用的是event2，则需要输入`cat /dev/input/event2`，此时触摸屏幕会有上报信息。

​	使用LVGL DEMO示例，输入`lv_examples 0`启动lvgl示例，可以通过点击屏幕上的UI交互按钮测试触摸是否生效。

```shell
root@TinaLinux:/# lv_examples 0
wh=480x800, vwh=480x1600, bpp=32, rotated=0
Turn on double buffering.
Turn on 2d hardware acceleration.
Turn on 2d hardware acceleration rotate.
```

