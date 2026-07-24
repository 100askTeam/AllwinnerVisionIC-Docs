---
sidebar_position: 6
---

# SPI LCD 显示驱动

SPI LCD 一般用于小分辨率的 SPI 屏显示，该驱动支持使用 SPI 协议软件控制 DC 方式驱动 SPI 屏幕，另外也对支持 MIPI DBI 接口芯片支持硬件控制 DC，3 线 9Bit 模式。SPI LCD 一般遵循 MIPI DBI 协议。SPI LCD 驱动架构如下：

![image-20250403112830462](images/image-20250403112830462-9cd37898aa734ba4e02b0d21ad06ba39.png)

部分芯片平台的 SPI 接口支持 MIPI DBI 模式，其规格如下：

-   支持 DBI Type C 3线/4线接口模式，支持 2 DATA LANE 接口模式
-   支持 QSPI 1线、2线、4线接口
-   支持来自 CPU 或 DMA 的数据源
-   支持 RGB111/444/565/666/888 视频格式
-   DBI 1 DATA LANE 最大分辨率：RGB666 240 x 320@30Hz
-   DBI 2 DATA LANE 最大分辨率：RGB888 240 x 320@60Hz 或 RGB666 320 x 480@30Hz
-   QSPI 最大分辨率：RGB666 480 x 480@30Hz
-   支持屏 TE 同步接口（DBI TE，GPIO TE）

MIPI DBI（显示总线接口）也称为MCU接口。MIPI-DBI用于与具有集成图形内存（GRAM）的LCD进行通讯的接口。像素数据首先在显示驱动芯片的本地图形内存中更新，然后该内存会不断刷新显示器。主机和显示模块可以通过简单的GPIO连接。

:::info

:::note

信息

:::
:::note

MIPI-DBI的类型如下，V861 支持的是 DBI TYPE C 协议，完整协议内容请参考《MIPI Alliance Standard for Display Bus Interface》：

-   **DBI TYPE A**：基于摩托罗拉 6800 总线
    -   支持 8/9/16/18/24 位并行数据传输
-   **DBI TYPE B**：基于Intel® 8080总线
    -   支持8/9/16/18/24位并行数据传输
-   **DBI TYPE C**：基于SPI协议
    -   支持3线或4线SPI接口

:::

:::

支持屏幕接口如下表所示：

| DBI 协议 | 协议名称 | 信号线 | 市场惯用叫法 | 驱动方式 | 是否支持 |
| --- | --- | --- | --- | --- | --- |
| L3I1 | 3 线 1 Data | `CS`, `SCK`, `SDA` | 3 线 SPI  
3 Line 9Bit | DBI | 是 |
| L3I2 | 3 线 2 Data（单独的读取IO） | `CS`, `SCK`, `SDA`, `SDO` | 3 线 SPI  
3 Line 9Bit | DBI | 是 |
| L4I1 | 4 线 1 Data | `CS`, `SCK`, `SDA`, `DC` | 4 线 SPI  
SPI 4W | SPI/DBI | 是 |
| L4I2 | 4 线 2 Data（单独的读取IO） | `CS`, `SCK`, `SDA`, `DC`, `SDO` | 4 线 SPI | DBI | 是 |
| D2LI | 2 Data Lane | `CS`, `SCK`, `SDA`, `WR` | 2 Data SPI  
3Wire 2data 9bit DSPI | DBI | 是 |
| \\ | QSPI 单线 | `CS`, `CLK`, `D0` | QSPI | QSPI | 是 |
| \\ | QSPI 双线 | `CS`, `CLK`, `D0`, `D1` | QSPI | QSPI | 是 |
| \\ | QSPI 四线 | `CS`, `CLK`, `D0`, `D1`, `D2`, `D3` | QSPI | QSPI | 是 |

接口硬件复用关系如下表所示，DBI 复用仅有 SPI1 控制器支持，SPI/QSPI 任意 SPI 均可：

| SPI | L3I1 | **L3I2** | **L4I1** | **L4I2** | D2LI | QSPI |
| --- | --- | --- | --- | --- | --- | --- |
| SPI-CS | DBI-CSX | DBI-CSX | DBI-CSX | DBI-CSX | DBI-CSX | QSPI-CS |
| SPI-HOLD | / | / | DBI-DCX | DBI-DCX | DBI-WRX | QSPI-D3 |
| SPI-CLK | DBI-SCLK | DBI-SCLK | DBI-SCLK | DBI-SCLK | DBI-SCLK | QSPI-CLK |
| SPI-MOSI | DBI-SDA | DBI-SDO | DBI-SDA | DBI-SDO | DBI-SDA | QSPI-D0 |
| SPI-MISO | / | DBI-SDI | / | DBI-SDI | / | QSPI-D1 |
| SPI-WP | DBI-TE | DBI-TE | DBI-TE | DBI-TE | DBI-TE | QSPI-D2 |

:::tip

:::note

提示

:::
:::note

QSPI 不限制 SPI 控制器，任意 SPI 控制器均可

:::

:::

## 时序与信号说明

### SPI 时序

`SPI` 接口就是俗称的 4 线 SPI 模式，这是因为发送数据时需要额外借助`DC`线来区分命令和数据，与 `SCLK`，`CS`和`SDA`共四线。只支持 RGB565 模式。

:::tip

:::note

提示

:::
:::note

-   SPI 接口协议与 DBI 的 `L4I1` 和 `L4I2` 四线模式时序一样，完全兼容，区别是 DBI 下 DC 脚的控制是硬件自动化控制，而 SPI 模式下需要 CPU 软件控制 DC 脚，由于是非硬件操作，所以刷图性能平均较低。一般 SPI 屏幕配置 DBI L4I1 模式即可。由硬件控制 DC 脚即可。
    
-   有一些特殊的屏幕需要专门控制 DC 时序，此时才使用 SPI 模式，手动控制 DC 时序。
    

:::

:::

SPI 时序如下时序图所示：

![image-20250729102657873](images/image-20250729102657873-d4c846c50cd2e2634cb20d33ca68bca8.png)

RGB565 送图数据如下时序图所示：

![image-20250729103822312](images/image-20250729103822312-49d8a70d45a04d27031100f4caddc4d4.png)

### DBI 时序

#### DBI 3-Line L3I1/L3I2

`L3I1` 和`L3I2` 是三线模式（不需要`DC`脚，SPI 使用 9BIT，第一个 BIT 区分是 Command 还是 Data）

`L3I1` 和`L3I2` 的区别是读时序，也就是是否需要额外脚来读寄存器。读写时序图如下：

-   L3I 写时序：

![L3I 写时序](images/image-20250729102735947-07aafdc59929e6b6bb3e86bd09038ee0.png)

-   L3I 读时序，其中 L3I1 使用 interface I 时序读取数据，L3I2 使用 Interface 2 时序读取数据。

![L3I 读时序](images/image-20250729102753502-7c15284b50de6be94321132fc09bb75d.png)

-   DBI 3-Line RGB111 送图格式

![DBI 3-Line RGB111 送图格式](images/image-20250729104432116-ab427b682fad4c3f61b886a11d3a7579.png)

-   DBI 3-Line RGB444 送图格式

![DBI 3-Line RGB444 送图格式](images/image-20250729104530957-1158d98bcb3a072f6947dc67db03d7c3.png)

-   DBI 3-Line RGB565 送图格式

![DBI 3-Line RGB565 送图格式](images/image-20250729104602212-73dc2f52bd1be80e454adc00aae489cb.png)

-   DBI 3-Line RGB666 送图格式

![DBI 3-Line RGB666 送图格式](images/image-20250729104633748-ae8677163f216a6adc17d1d6d9c5fc58.png)

#### DBI 4-Line L4I1/L4I2

`L4I1` 和 `L4I2` 是四线模式，与 SPI 接口协议一样，区别是 DBI 下 DC 脚的控制是硬件自动化控制，而 SPI 模式下需要 CPU 软件控制 DC 脚。另外 I2 和 I1 的区别是读时序，也就是否需要额外脚来读取寄存器。

-   L4I 写时序

![L4I 写时序](images/image-20250729102657873-d4c846c50cd2e2634cb20d33ca68bca8.png)

-   L4I读时序

![L4I读时序](images/image-20250729102826299-651749d0c3be81a7b863aab7a99c1427.png)

-   DBI 4-Line RGB111 送图格式

![DBI 4-Line RGB111 送图格式](images/image-20250729105156728-2c5a0b454a8d499b8ae91bd2d8d6a668.png)

-   DBI 4-Line RGB444 送图格式

![DBI 4-Line RGB444 送图格式](images/image-20250729105235404-8343ca6cbb8319f598240402bc526a64.png)

-   DBI 4-Line RGB565 送图格式

![DBI 4-Line RGB565 送图格式](images/image-20250729105247216-2f47db060a8a5129383684381d6f221e.png)

-   DBI 4-Line RGB666 送图格式

![DBI 4-Line RGB666 送图格式](images/image-20250729105257853-e5566ab7f9d777f6343b380d32016bd3.png)

#### DBI 2-Data Lane D2L1

`D2LI` 是 2 DATA LANE 模式。硬件连接上，第二根数据脚连接到原来 1 DATA LANE 的DC脚，2 DATA LANE 在传输数据时就自带D/C (Data/Commend)信息了，所以原来的 DC 脚就可以空出来作为第二根数据线了。

| 引脚 | 功能 |
| --- | --- |
| CSX | 芯片使能 |
| DCX | 串行时钟 |
| SDA | 串行数据输入/输出 |
| WRX | 串行数据输入 2 |

-   D2LI 命令写时序

:::tip

:::note

提示

:::
:::note

2 DATA LANE 模式接口的命令写入协议与3线串行接口相同，因此用户可以忽略WRX的输入数据。任何指令都可以按任意顺序发送给驱动程序。最高有效位（MSB）先传输。当CSX为高电平时，串行接口初始化。在此状态下，SCL时钟脉冲或SDA数据没有影响。CSX的下降沿使串行接口启用，并指示数据传输的开始。

:::

:::

![image-20250729102933692](images/image-20250729102933692-743222a82c80d490e65ac68fa631f856.png)

-   D2L1 读时序

:::tip

:::note

提示

:::
:::note

2 DATA LANE 模式接口的命令读协议与3线串行接口相同。

:::

:::

![D2L1 读时序](images/image-20250729102753502-7c15284b50de6be94321132fc09bb75d.png)

-   DBI 4-Line RGB444 送图格式

![DBI 4-Line RGB444 送图格式](images/image-20250729105524052-71cbf0b1df30618de98499f210dc0e4f.png)

-   DBI 4-Line RGB565 送图格式

![DBI 4-Line RGB565 送图格式](images/image-20250729105542867-bcd3f226cc9d106ec876e4007e21bdd4.png)

-   DBI 4-Line RGB666 送图格式（格式0）

![DBI 4-Line RGB666 送图格式（格式0）](images/image-20250729105557044-45fd0eb955c3f21bdac44b9bb92706bf.png)

-   DBI 4-Line RGB666 送图格式（格式1，ilitek 格式）

![DBI 4-Line RGB666 送图格式（格式1，ilitek 格式）](images/image-20250729105800313-1e0249d904d2fde0bbdca6f15cfb9973.png)

-   DBI 4-Line RGB666 送图格式（格式2，新格式，兼容RGB888）

![DBI 4-Line RGB666 送图格式（格式2，新格式，兼容RGB888）](images/image-20250729105855269-3a1a8f8c10e4d573dfa5bfd922e03698.png)

-   DBI 4-Line RGB888 送图格式

![DBI 4-Line RGB888 送图格式](images/image-20250729105918248-5a60c9432b7d377c43efaed0e6ce8b50.png)

### QSPI 时序

QSPI 时序是标准 SPI 4 线协议，其每一次都需要发送命令和数据，不需要用 DC 脚区分发送的是命令还是数据。支持 QSPI 1线、2线、4线模式。

#### QSPI 读时序

当主机读取 QSPI 的命令或参数时，主机需要先发送1字节的写命令指令（0x0B）。然后，主机发送3字节的地址数据（AD\[23:0\]），该地址由1字节的0x00、1字节的命令地址和1字节的0x00组成。在主机发送完读命令和地址数据（AD\[23:0\]）后，接下来的输出数据为命令地址的参数（即参数数据）。当最后一个参数的位被输出完毕后，CSX引脚应该返回高电平。

![QSPI 读时序](images/image-20250409113454912-98f9742bc173b9a5ed5fdba655b975cc.png)

#### QSPI 单线写时序

当主机向 QSPI 写入命令或参数时，主机需要发送1字节的单线写命令指令（0x02）。然后，主机发送3字节的地址数据（AD\[23:0\]），该地址由1字节的0x00、1字节的命令地址和1字节的0x00组成。在主机发送完指令和地址数据（AD\[23:0\]）后，接下来的数据为命令的参数（即参数数据）。当最后一个参数位被发送完毕后，CSX引脚应该恢复为高电平。

驱动配置为 `LCD_FB_QSPI_LANE1`，采用 QSPI 单线写方式驱动。

![QSPI 单线写时序](images/image-20250409113314256-23461ede2b26c8af59a04c83e7ffaffa.png)

-   RGB565 单线写送图格式

![RGB565 单线写送图格式](images/image-20250729110456250-1fc0ff436d0c4c94a23bfdb82e994d26.png)

-   RGB666 单线写送图格式

![image-20250729110716534](images/image-20250729110716534-087e726f5ad9cbfcdb14d8a609006cdb.png)

#### QSPI 双线写时序

当主机向 QSPI 写入命令或参数时，主机需要发送1字节的双线写命令指令（0xA2）。然后，主机发送3字节的地址数据（AD\[23:0\]），该地址由1字节的0x00、1字节的命令地址和1字节的0x00组成。在主机发送完指令和地址数据（AD\[23:0\]）后，接下来的数据为命令的参数（即参数数据）。当最后一个参数位被发送完毕后，CSX引脚应该恢复为高电平。

驱动配置为 `LCD_FB_QSPI_LANE2`，采用 QSPI 双线写方式驱动，命令还是单线模式。

![QSPI 双线写时序](images/image-20250409113351810-b5a827df29ca6da8c8a97a218d27b720.png)

-   RGB565 双线写送图格式

![RGB565 双线写送图格式](images/image-20250729110526406-7f02345f79e30633baf2ce7ebc687195.png)

-   RGB666 双线写送图格式

![image-20250729110754933](images/image-20250729110754933-3cce104c5082e913e3766d3efd5abf61.png)

#### QSPI 四线写时序

当主机向 QSPI 写入命令或参数时，主机需要发送1字节的四线写命令指令（0x32）。然后，主机发送3字节的地址数据（AD\[23:0\]），该地址由1字节的0x00、1字节的命令地址和1字节的0x00组成。在主机发送完指令和地址数据（AD\[23:0\]）后，接下来的数据为命令的参数（即参数数据）。当最后一个参数位被发送完毕后，CSX引脚应该恢复为高电平。

驱动配置为 `LCD_FB_QSPI_LANE4`，采用 QSPI 四线写方式驱动，命令还是单线模式。

![QSPI 四线写时序](images/image-20250409113430521-0de8e9d5ca018b69c8705a9aea1d21b0.png)

-   RGB565 四线写送图格式

![image-20250729110847823](images/image-20250729110847823-b65868528e38af89edf16afd7c5d5815.png)

-   RGB666 四线写送图格式

![image-20250729110832296](images/image-20250729110832296-6c8803d343e9d482bdfbfb43221a6c85.png)

## 源码结构介绍

SPI LCD 驱动在内核中叫做 LCD FB 驱动。其源码如下所示：

```c
.
├── dev_fb.c
├── dev_fb.h
├── dev_lcd_fb.c
├── dev_lcd_fb.h
├── disp_display.c
├── disp_display.h
├── disp_lcd.c
├── disp_lcd.h
├── include.h
├── Kconfig
├── lcd_fb_feature.h
├── lcd_fb_intf.c
├── lcd_fb_intf.h
├── logo.c
├── logo.h
├── Makefile
└── panels
    ├── Kconfig
    ├── kld2844b.c
    ├── kld2844b.h
    ├── ... 
    ├── lcd_source.h
    ├── panels.c
    ├── panels.h
    └── spi_panel.c
```

SPI LCD 源码包括驱动源码与 SPI 屏幕驱动。其中屏幕驱动位于 `panels` 文件夹内。新增一款屏幕需要在 `panels` 文件夹中添加新屏幕驱动。

### 驱动版本

驱动版本可以查看 `bsp/drivers/video/sunxi/lcd_fb/dev_lcd_fb.c` 中末尾的 `MODULE_VERSION` 定义

![image-20250729111258708](data:image/png;base64,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)

## 模块配置介绍

### 内核模块配置

模块配置路径如下所示：

```
Allwinner BSP  ---> 
    Device Drivers  --->
        Video Drivers  --->
            SPI LCD Panel Drivers  --->
                <*> LCD FB Driver Support (SPI LCD)
```

![LCDFB 驱动路径](images/image-20250403095616924-17436453780011-e251e396e116ecbadc39a529e3855b26.png)

LCD 显示面板驱动位于

```
Allwinner BSP  ---> 
    Device Drivers  --->
        Video Drivers  --->
            SPI LCD Panel Drivers  --->
                LCD FB Panels select  --->
                    [*] LCD support kld2844B panel
                    ...
```

![LCD 显示面板驱动](images/image-20250403095706237-228fc94c016cc41e65a5ccad46c2134d.png)

### 设备树配置

这里以配置双屏，不同型号屏幕，屏幕 1 使用 SPI1 的 MIPI DBI 方式驱动，屏幕 2 使用 SPI2 的 SPI 软件 DC 方式驱动作为示例。配置如下所示：

```c
&lcd_fb {
    status = "okay";
    port {
        #address-cells = <1>;
        #size-cells = <0>;
        spi_panel0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&panel_st7789v_spi1>;
        };
        spi_panel1: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&panel_st7789v_spi2>;
        };
    };
};

&spi1 {
    pinctrl-0 = <&spi1_pins_default &spi1_pins_hold>;
    pinctrl-1 = <&spi1_pins_sleep>;
    pinctrl-names = "default", "sleep";
    clock-frequency = <100000000>;
    sunxi,spi-bus-mode = <SUNXI_SPI_BUS_DBI>;
    sunxi,spi-cs-mode = <SUNXI_SPI_CS_SOFT>;
    status = "okay";

    panel_st7789v_spi1: slave@0 {
        device_type = "spi-panel";
        compatible = "allwinner,spi-panel";
        reg = <0x0>;
        spi-max-frequency = <100000000>;
        lcd_used = <1>;
        lcd_driver_name = "st7789v";
        lcd_if = <1>;
        lcd_dbi_if = <2>;
        lcd_data_speed = <48>;
        lcd_x = <240>;
        lcd_y = <240>;
        lcd_pixel_fmt = <10>;
        lcd_dbi_fmt = <2>;
        lcd_rgb_order = <0>;
        lcd_width = <60>;
        lcd_height = <60>;
        lcd_pwm_used = <0>;
        lcd_pwm_ch = <6>;
        lcd_pwm_freq = <5000>;
        lcd_pwm_pol = <1>;
        lcd_frm = <1>;
        lcd_gamma_en = <1>;
        fb_buffer_num = <2>;
        lcd_backlight = <100>;
        lcd_fps = <60>;
        lcd_dbi_te = <0>;
        lcd_dbi_clk_mode = <0>;
        lcd_gpio_0 = <&pio PD 4 GPIO_ACTIVE_LOW>;
        status = "okay";
    };
};

&spi2 {
    clock-frequency = <100000000>;
    pinctrl-0 = <&spi2_pins_default>;
    pinctrl-1 = <&spi2_pins_sleep>;
    pinctrl-names = "default", "sleep";
    sunxi,spi-bus-mode = <SUNXI_SPI_BUS_MASTER>;
    sunxi,spi-cs-mode = <SUNXI_SPI_CS_AUTO>;
    status = "okay";

    panel_st7789v_spi2: slave@0 {
        device_type = "spi-panel";
        compatible = "allwinner,spi-panel";
        reg = <0x0>;
        spi-max-frequency = <100000000>;
        lcd_used = <1>;
        lcd_driver_name = "st7789v";
        lcd_if = <0>;
        lcd_dbi_if = <0>;
        lcd_data_speed = <48>;
        lcd_x = <172>;
        lcd_y = <320>;
        lcd_pixel_fmt = <10>;
        lcd_dbi_fmt = <2>;
        lcd_rgb_order = <0>;
        lcd_width = <60>;
        lcd_height = <60>;
        lcd_pwm_used = <0>;
        lcd_pwm_ch = <6>;
        lcd_pwm_freq = <5000>;
        lcd_pwm_pol = <1>;
        lcd_frm = <1>;
        lcd_gamma_en = <1>;
        fb_buffer_num = <2>;
        lcd_backlight = <100>;
        lcd_fps = <60>;
        lcd_dbi_te = <0>;
        lcd_dbi_clk_mode = <0>;
        lcd_spi_dc_pin = <&pio PD 17 GPIO_ACTIVE_LOW>;
        lcd_gpio_0 = <&pio PD 13 GPIO_ACTIVE_LOW>;
        status = "okay";
    };
};
```

`lcd_fb` 节点用于配置和管理 LCD 屏幕的显示功能。该节点通过 `port` 属性配置了两款不同的 SPI 接口屏幕，分别为 `spi_panel0` 和 `spi_panel1`。每个屏幕的配置都通过 `endpoint` 和 `remote-endpoint` 关联，指定了屏幕的接口和驱动信息。

`spi` 节点定义了 SPI 控制器使用的引脚，SPI 驱动方式，SPI 最大频率，其中定义了 Panel 的节点标识该 LCD 显示面板位于该 SPI 节点下。

`panel_st7789v` 节点定义了屏幕的物理尺寸，时序，接口，背光 PWM 等，配置项如下表所示

| 配置项 | 说明 |
| --- | --- |
| `lcd_used` | LCD显示屏是否启用。值为 `<1>` 表示启用。 |
| `lcd_driver_name` | LCD显示屏驱动的名称，此处为 `st7789v`，表示使用ST7789V驱动。必须与屏驱动中`strcut __lcd_panel`变量的`name`成员一致。 |
| `lcd_if` | LCD接口类型，  
`<0>` 代表使用SPI接口。  
`<1>` 代表使用DBI接口。 |
| `lcd_dbi_if` | LCD DBI接口类型  
0：L3I1  
1：L3I2  
2：L4I1  
3：L4I2  
4：D2LI |
| `lcd_data_speed` | 数据传输速率，`<48>` 表示设置为48 MHz。用于设置 SPI/DBI 接口时钟的速率，单位MHz。 |
| `lcd_x` | 屏幕的横向分辨率，`<240>` 表示240像素。 |
| `lcd_y` | 屏幕的纵向分辨率，`<240>` 表示240像素。 |
| `lcd_pixel_fmt` | 像素格式，`<10>` 表示使用RGB565格式。 |
| `lcd_dbi_fmt` | DBI接口的格式，`<2>` 表示并行接口的16位数据格式。 |
| `lcd_rgb_order` | RGB像素顺序，`<0>` 表示RGB顺序。 |
| `lcd_width` | LCD宽度，`<60>` 表示60mm宽。 |
| `lcd_height` | LCD高度，`<60>` 表示60mm高。 |
| `lcd_pwm_used` | 是否启用PWM调光，`<0>` 表示未启用。 |
| `lcd_pwm_ch` | PWM通道，`<6>` 表示使用通道6。 |
| `lcd_pwm_freq` | PWM频率，`<5000>` 表示5000 Hz。 |
| `lcd_pwm_pol` | PWM极性，`<1>` 表示正极性。 |
| `lcd_frm` | 是否启用 `frm` 模式 |
| `lcd_gamma_en` | 是否启用Gamma校正，`<1>` 表示启用。 |
| `fb_buffer_num` | 帧缓冲区的数量，`<2>` 表示有两个缓冲区。 |
| `lcd_backlight` | 背光亮度，`<100>` 表示设置为100%。 |
| `lcd_fps` | 显示帧率，`<60>` 表示每秒60帧。 |
| `lcd_dbi_te` | DBI接口的TE信号，`<0>` 表示禁用。 |
| `lcd_dbi_clk_mode` | DBI时钟模式  
0: 自动停止。有数据就有时钟，没发数据就没有  
1: 一直保持。无论发不发数据都有时钟 |
| `lcd_spi_dc_pin` | LCD 的 DC 引脚，使用 SPI 模式时需要配置 |
| `lcd_gpio_0` | LCD 的 GPIO 配置，`< &pio PD 4 GPIO_ACTIVE_LOW >` 表示连接到PD4，低电平有效。一般配置为屏幕 RST 引脚 |
| `status` | 配置状态，`"okay"` 表示配置正常启用。 |

### 模块参数配置

#### lcd\_driver\_name

LCD 屏驱动的名字（字符串），必须与屏驱动中 `strcut __lcd_panel` 变量的 `name` 成员一致。

#### lcd\_if

设置相应值的对应含义为：

```c
enum sunxi_lcd_fb_disp_lcd_if {
    LCD_FB_IF_SPI = 0,
    LCD_FB_IF_DBI = 1,
    LCD_FB_IF_QSPI = 2,
};
```

`SPI` 接口就是俗称的 4 线 SPI 模式，这是因为发送数据时需要额外借助`DC`线来区分命令和数据，与`sclk`，`cs`和`sda`共四线。如果设置了`dbi`接口，那么还需要进一步区分`dbi`接口，需要设置 `lcd_dbi_if`，如果设置了 `qspi` 接口，那么还需要进一步区分`qspi`接口，需要设置 `lcd_qspi_if`

#### lcd\_dbi\_if

LCD DBI 接口设置。

这个参数只有在 `lcd_if=1` 时才有效。

设置相应值的对应含义为：

```c
enum sunxi_lcd_fb_dbi_if {
    LCD_FB_L3I1 = 0x0,
    LCD_FB_L3I2 = 0x1,
    LCD_FB_L4I1 = 0x2,
    LCD_FB_L4I2 = 0x3,
    LCD_FB_D2LI = 0x4,
};
```

所有模式在发送数据时每个周期的比特数量根据不同像素格式不同而不同。

#### lcd\_dbi\_fmt

`DBI`接口像素格式。

```c
enum lcdfb_dbi_fmt {
    LCDFB_DBI_RGB111 = 0x0,
    LCDFB_DBI_RGB444 = 0x1,
    LCDFB_DBI_RGB565 = 0x2,
    LCDFB_DBI_RGB666 = 0x3,
    LCDFB_DBI_RGB888 = 0x4,
};
```

选择的依据是接收端屏`Driver IC`的支持情况，请查看`Driver IC`手册或询问屏厂。

然后必须配合 `lcd_pixel_fmt` 的选择，比如说选 RGB565 时，`lcd_pixel_fmt`也要选565格式。

#### lcd\_dbi\_te

使能 DBI TE 触发。

TE 即（Tearing Effect），也就是撕裂的意思，由于读写不同导致撕裂现象，TE 脚的功能就是用于同步读写，TE 脚的频率也就是屏的刷新率，所以 TE 脚也可以看做 VSYNC 脚（垂直同步脚）

```
0: 禁止te
1: 下降沿触发
2: 上升沿触发
```

#### lcd\_spi\_te\_pin

使用 GPIO 中断方式处理 TE 信号，不使用 DBI 控制器的 TE 中断，需要配置引脚，支持 SPI、DBI、QSPI 屏，使用这个模式的时候需要配置 `lcd_dbi_te = <0>`

配置示例：

```
lcd_spi_te_pin = <&pio PD 6 GPIO_ACTIVE_LOW>;
```

-   关闭 TE 状态下显示黑白屏，可以明显看到屏幕黑白切换滚动显示

![GIF 2025-11-17 20-20-30](images/GIF2025-11-1720-20-30-ca067a116ebc6d8f3fd50f71b0c0d1ed.gif)

-   开启 TE 状态下显示黑白屏，可以明显看到屏幕切换固定显示

![GIF 2025-11-17 20-30-12](images/GIF2025-11-1720-30-12-00210aa6b345d06e232c7cc2c2f0428a.gif)

#### lcd\_dbi\_clk\_mode

选择 `dbi` 时钟的行为模式。

```
0:自动停止。有数据就有时钟，没发数据就没有
1:一直保持。无论发不发数据都有时钟
```

注意上面的选项关系屏兼容性。部分屏幕需要一直提供时钟进行刷屏，否则不会更新显示。

#### lcd\_rgb\_order

输入图像数据 `rgb` 顺序识别设置，仅当 `lcd_if=1` 配置为 DBI 模式时有效。

```
0:RGB
1:RBG
2:GRB
3:GBR
4:BRG
5:BGR
6:G_1RBG_0
7:G_0RBG_1
8:G_1BRG_0
9:G_0BRG_1
```

非 RGB565 格式用 0 到 5 即可。

针对 RGB565 格式说明如下：

RGB565 格式会遇到大小端问题，ARM/RISC-V 平台和 PC 平台存储都是小端(little endian，低字节放在低地址，高字节放在高地址），但是许多 SPI 屏都是默认大端（Big Endian）。

也就是存储的字节顺序和发送的字节顺序不对应。这个时候选择 6 以下，DBI接口就会自动将小端转成大端。如果遇到默认是小端的 SPI 屏，则需要选择 6 以上，DBI接口会自动用回小端方式。

:::tip

:::note

提示

:::
:::note

6 以上格式这样解释：

R是5比特，G是6比特，B是5比特，再把G拆成高3位(G\_1)和低3位(G\_0) 所以以下两种顺序：

![rgb565像素排列](images/rgb565-16932054745467-17436508934999-75f2fcd05dce1e32c5563de84931bc3e.png)

1.  R-G\_1-G\_0-B，大端。
2.  G\_0-B-R-G\_1，对应上面的9，小端。

:::

:::

#### lcd\_qspi\_if

LCD QSPI 接口设置。

这个参数只有在 `lcd_if=2` 时才有效。

设置相应值的对应含义为：

```c
enum sunxi_lcd_fb_qspi_if {
    LCD_FB_QSPI_LANE1 = 0x0,
    LCD_FB_QSPI_LANE2 = 0x1,
    LCD_FB_QSPI_LANE4 = 0x2,
};
```

#### lcd\_x

显示屏的水平像素数量，注意如果屏支持横竖旋转，那么 lcd\_x 和 lcd\_y 也要对调。

#### lcd\_y

显示屏的行数，注意如果屏支持横竖旋转，那么 lcd\_x 和 lcd\_y 也要对调。

#### lcd\_data\_speed

用于设置 SPI/DBI 接口时钟的速率，单位MHz。

1.  发送端（SoC) 的最大限制需要参考芯片数据手册。
2.  接收端（屏Driver IC）的限制，请查看对应Driver IC手册或者询问屏厂支持。
3.  超出以上限制都有可能导致显示异常。

#### lcd\_data\_speed\_hz

用于设置 SPI/DBI 接口时钟的速率，单位Hz。

1.  发送端（SoC) 的最大限制需要参考芯片数据手册。
2.  接收端（屏Driver IC）的限制，请查看对应Driver IC手册或者询问屏厂支持。
3.  超出以上限制都有可能导致显示异常。
4.  **使用该配置后，lcd\_data\_speed 所配置的 MHz 参数将弃用，优先使用 lcd\_data\_speed\_hz**

#### lcd\_fps

设置屏的刷新率，单位Hz。当 [lcd\_dbi\_te](#lcd_dbi_te) 使能时，这个值设置无效。

#### lcd\_pwm\_used

是否使用 PWM。此参数标识是否使用 PWM 用以背光亮度的控制。

#### lcd\_pwm\_ch

此参数标识使用的 PWM 通道。

#### lcd\_pwm\_freq

这个参数配置PWM信号的频率，单位为Hz。

#### lcd\_pwm\_pol

这个参数配置PWM信号的占空比的极性。设置相应值对应含义为：

```
0：active high
1：active low
```

#### lcd\_pwm\_max\_limit

最高限制，以亮度值表示。

比如150，则表示背光最高只能调到150，0～255范围内的亮度值将会被线性映射到0～150范围内。用于控制最高背光亮度，节省功耗。

#### lcd\_backlight

默认背光值，取值范围0到255，值越大越亮。

#### lcd\_bl\_en

背光使能脚定义

#### lcd\_spi\_dc\_pin

指定作为 DC 的管脚，用于 SPI 接口时软件控制 DC 模式。

#### lcd\_gpio\_x

`x` 表示数字。如果有多个 gpio 脚需要控制，则定义 `lcd_gpio_0`，`lcd_gpio_1` 等。

#### lcd\_pixel\_fmt

选择传输数据的像素格式。

可选值如下，当你更换RGB分量顺序的时候，也得相应修改 `lcd_rgb_order`，或者修改屏驱动的 RGB 分量顺序（一般是`3Ah`寄存器）。

:::note

:::note

备注

:::
:::note

DBI接口支持 RGB32 和 RGB16 的情况。

SPI 接口只支持 RGB16 的情况。

:::

:::

```c
enum lcdfb_pixel_format {
    LCDFB_FORMAT_ARGB_8888 = 0x00,	// MSB  A-R-G-B  LSB
    LCDFB_FORMAT_ABGR_8888 = 0x01,
    LCDFB_FORMAT_RGBA_8888 = 0x02,
    LCDFB_FORMAT_BGRA_8888 = 0x03,
    LCDFB_FORMAT_XRGB_8888 = 0x04,
    LCDFB_FORMAT_XBGR_8888 = 0x05,
    LCDFB_FORMAT_RGBX_8888 = 0x06,
    LCDFB_FORMAT_BGRX_8888 = 0x07,
    LCDFB_FORMAT_RGB_888 = 0x08,
    LCDFB_FORMAT_BGR_888 = 0x09,
    LCDFB_FORMAT_RGB_565 = 0x0a,
    LCDFB_FORMAT_BGR_565 = 0x0b,
    LCDFB_FORMAT_ARGB_4444 = 0x0c,
    LCDFB_FORMAT_ABGR_4444 = 0x0d,
    LCDFB_FORMAT_RGBA_4444 = 0x0e,
    LCDFB_FORMAT_BGRA_4444 = 0x0f,
    LCDFB_FORMAT_ARGB_1555 = 0x10,
    LCDFB_FORMAT_ABGR_1555 = 0x11,
    LCDFB_FORMAT_RGBA_5551 = 0x12,
    LCDFB_FORMAT_BGRA_5551 = 0x13,
};
```

#### fb\_buffer\_num

显示 `framebuffer` 数量，为了平滑显示，这里一般是2个，为了省内存也可以改成1。

:::info

:::note

信息

:::
:::note

以下配置为 1.0.6 版本新增配置

:::

:::

#### lcd\_vsync\_send\_frame

每一次 TE 信号都去送显，与 Vsync 信号同步。不需要等待上层调用 `FBIO_PAN_DISPLAY` 再去送显。会增加 CPU 占用，但是能改善帧率。需要配置 GPIO TE 模式。

![image-20250729111626303](images/image-20250729111626303-319b8baaa1515a5c8c43e31e70356b22.png)

配置示例：

```
lcd_vsync_send_frame = <0>; # 关闭功能
lcd_vsync_send_frame = <1>; # 启用功能
```

![image-20251117210705129](images/image-20251117210705129-ffe2ae1552f0c114f97587c182659646.png)

:::warning

:::note

注意

:::
:::note

开启功能会增加 CPU 占用，在 V861 平台将占用 4% CPU

![image-20251117210740251](images/image-20251117210740251-30697accc45514fb7dbfa14cb7a73d40.png)

:::

:::

## 模块调试节点

在驱动 1.0.7 版本中，新增了模块调试节点，位于 `/sys/class/lcd_fb/lcd_fb/attr/` 目录下，可以执行屏幕配置测试

### screenid

用于配置调试使用的屏幕 ID，默认为屏幕 0，在多屏环境下可以使用这个节点切换屏幕，例如下面的把屏幕切到屏幕`1`

```
echo 1 > /sys/class/lcd_fb/lcd_fb/attr/screenid
```

### colorbar

用于测试屏幕显示，输出彩条测试

| 参数 | 作用 | 次数 |
| --- | --- | --- |
| 0 | 显示黑屏，清零 FB 数据 | 1 |
| 1 | 显示彩条，用于点屏测试 | 1 |
| 2 | 显示黑白屏切回，用于 TE 调试 | 500 |

```
echo 1 > /sys/class/lcd_fb/lcd_fb/attr/colorbar
```

![image-20251117202727838](images/image-20251117202727838-3a37cb456f32735e48384f72532b6752.png)

## 模块配置案例

### SPI 模式接口屏配置

如果 IC 支持 DBI 接口，那么就没有必要用 SPI 接口，DBI 接口其协议能覆盖所有情况。

:::tip

:::note

提示

:::
:::note

SPI 接口协议与 DBI 的 `L4I1` 和 `L4I2` 四线模式时序一样，区别是DBI 下 DC 脚的控制是硬件自动化控制，而 SPI 模式下需要 CPU 软件控制 DC 脚，由于是非硬件操作，所以刷图性能平均较低。一般 SPI 屏幕配置 DBI L4I1 模式即可。由硬件控制 DC 脚即可。

:::

:::
:::warning

:::note

注意

:::
:::note

部分屏幕需要特殊时序的 DC 脚，需要交由 CPU 软件控制 DC 时序，此时仅可使用 SPI 模式。如果使用 SPI 接口，它有一些限制。

1.  不支持 2 data lane。
2.  必须指定DC脚。这是由于spi协议不会自动控制DC脚来区分数据命令，通过设置 `lcd_spi_dc_pin` 可以完成这个目的，这跟管脚不必用 SPI 控制器中的脚，可以任意选择GPIO。
3.  只支持 RGB565 的像素格式。由于只有单 data lane，速度过慢，RGB565 以上格式都不现实。

:::

:::

配置如下：

```c
&pio {
    spi1_pins_default: spi1@0 {
        pins = "PD1", "PD2", "PD3"; /* CS, SCK, SDA */
        function = "spi1";
        allwinner,drive = <3>;
    };

    spi1_pins_sleep: spi1@2 {
        pins = "PD1", "PD2", "PD3";
        function = "io_disabled";
    };
};

&lcd_fb {
    status = "okay";
    port {
        #address-cells = <1>;
        #size-cells = <0>;
        spi_panel0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&panel_st7789v_spi1>;
        };
    };
};

&spi1 {
    clock-frequency = <100000000>;
    pinctrl-0 = <&spi1_pins_default>;
    pinctrl-1 = <&spi1_pins_sleep>;
    pinctrl-names = "default", "sleep";
    sunxi,spi-bus-mode = <SUNXI_SPI_BUS_MASTER>;
    sunxi,spi-cs-mode = <SUNXI_SPI_CS_SOFT>; // 使用 SPI 模式需要配置软件 CS 模式
    status = "okay";
    
    panel_st7789v_spi1: slave@0 {
        device_type = "spi-panel";
        compatible = "allwinner,spi-panel";
        reg = <0x0>;
        spi-max-frequency = <100000000>;
        lcd_used = <1>;
        lcd_driver_name = "st7789v";
        lcd_if = <0>;
        lcd_dbi_if = <0>;
        lcd_data_speed = <48>;
        lcd_x = <172>;
        lcd_y = <320>;
        lcd_pixel_fmt = <10>;
        lcd_dbi_fmt = <2>;
        lcd_rgb_order = <0>;
        lcd_width = <60>;
        lcd_height = <60>;
        lcd_pwm_used = <0>;
        lcd_pwm_ch = <6>;
        lcd_pwm_freq = <5000>;
        lcd_pwm_pol = <1>;
        lcd_frm = <1>;
        lcd_gamma_en = <1>;
        fb_buffer_num = <2>;
        lcd_backlight = <100>;
        lcd_fps = <60>;
        lcd_dbi_te = <0>;
        lcd_dbi_clk_mode = <0>;
        lcd_spi_dc_pin = <&pio PD 17 GPIO_ACTIVE_LOW>;
        lcd_gpio_0 = <&pio PD 13 GPIO_ACTIVE_LOW>;
        status = "okay";
    };
};
```

### DBI 模式 L4I1 接口屏配置

:::tip

:::note

提示

:::
:::note

SPI 接口协议与 DBI 的 `L4I1` 和 `L4I2` 四线模式时序一样，区别是DBI 下 DC 脚的控制是硬件自动化控制，而 SPI 模式下需要 CPU 软件控制 DC 脚，由于是非硬件操作，所以刷图性能较低。一般 SPI 屏幕配置 DBI L4I1 模式即可。由硬件控制 DC 脚即可。

:::

:::

```c
&pio {
    dbi1_pins_default: dbi1@0 {
        pins = "PD1", "PD2", "PD3"; /* dbi-cs, dbi-clk, dbi-sdo */
        function = "spi1";
        allwinner,drive = <3>;
    };

    dbi1_pins_dcx: dbi1@1 {
        pins = "PD5"; /* dbi-dcx */
        function = "spi1_hold";
        allwinner,drive = <3>;
        bias-pull-up;
    };

    dbi1_pins_sleep: dbi1@2 {
        pins = "PD1", "PD2", "PD3", "PD5";
        function = "io_disabled";
    };
};

&lcd_fb {
    status = "okay";
    port {
        #address-cells = <1>;
        #size-cells = <0>;
        spi_panel0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&panel_st7789v_spi1>;
        };
    };
};

&spi1 {
    pinctrl-0 = <&dbi1_pins_default &dbi1_pins_dcx>;
    pinctrl-1 = <&dbi1_pins_sleep>;
    pinctrl-names = "default", "sleep";
    clock-frequency = <100000000>;
    sunxi,spi-bus-mode = <SUNXI_SPI_BUS_DBI>;
    sunxi,spi-cs-mode = <SUNXI_SPI_CS_AUTO>;
    status = "okay";

    panel_st7789v_spi1: slave@0 {
        device_type = "spi-panel";
        compatible = "allwinner,spi-panel";
        reg = <0x0>;
        spi-max-frequency = <100000000>;
        lcd_used = <1>;
        lcd_driver_name = "st7789v";
        lcd_if = <1>;
        lcd_dbi_if = <2>;
        lcd_data_speed = <48>;
        lcd_x = <240>;
        lcd_y = <240>;
        lcd_pixel_fmt = <10>;
        lcd_dbi_fmt = <2>;
        lcd_rgb_order = <0>;
        lcd_width = <60>;
        lcd_height = <60>;
        lcd_pwm_used = <0>;
        lcd_pwm_ch = <6>;
        lcd_pwm_freq = <5000>;
        lcd_pwm_pol = <1>;
        lcd_frm = <1>;
        lcd_gamma_en = <1>;
        fb_buffer_num = <2>;
        lcd_backlight = <100>;
        lcd_fps = <60>;
        lcd_dbi_te = <0>;
        lcd_dbi_clk_mode = <0>;
        lcd_gpio_0 = <&pio PD 4 GPIO_ACTIVE_LOW>;
        status = "okay";
    };
};
```

### DBI 模式 L3I1 接口屏配置

```c
&pio {
    dbi1_pins_default: dbi1@0 {
        pins = "PD1", "PD2", "PD3"; /* dbi-cs, dbi-clk, dbi-sdo */
        function = "spi1";
        allwinner,drive = <3>;
    };

    dbi1_pins_dcx: dbi1@1 {
        pins = "PD5"; /* dbi-dcx */
        function = "spi1_hold";
        allwinner,drive = <3>;
        bias-pull-up;
    };

    dbi1_pins_sleep: dbi1@2 {
        pins = "PD1", "PD2", "PD3", "PD5";
        function = "io_disabled";
    };
};

&lcd_fb {
    status = "okay";
    port {
        #address-cells = <1>;
        #size-cells = <0>;
        spi_panel0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&panel_st7789v_spi1>;
        };
    };
};

&spi1 {
    pinctrl-0 = <&dbi1_pins_default &dbi1_pins_dcx>;
    pinctrl-1 = <&dbi1_pins_sleep>;
    pinctrl-names = "default", "sleep";
    clock-frequency = <100000000>;
    sunxi,spi-bus-mode = <SUNXI_SPI_BUS_DBI>;
    sunxi,spi-cs-mode = <SUNXI_SPI_CS_AUTO>;
    status = "okay";

    panel_st7789v_spi1: slave@0 {
        device_type = "spi-panel";
        compatible = "allwinner,spi-panel";
        reg = <0x0>;
        spi-max-frequency = <100000000>;
        lcd_used = <1>;
        lcd_driver_name = "st7789v";
        lcd_if = <1>;
        lcd_dbi_if = <0>;
        lcd_data_speed = <48>;
        lcd_x = <240>;
        lcd_y = <240>;
        lcd_pixel_fmt = <10>;
        lcd_dbi_fmt = <2>;
        lcd_rgb_order = <0>;
        lcd_width = <60>;
        lcd_height = <60>;
        lcd_pwm_used = <0>;
        lcd_pwm_ch = <6>;
        lcd_pwm_freq = <5000>;
        lcd_pwm_pol = <1>;
        lcd_frm = <1>;
        lcd_gamma_en = <1>;
        fb_buffer_num = <2>;
        lcd_backlight = <100>;
        lcd_fps = <60>;
        lcd_dbi_te = <0>;
        lcd_dbi_clk_mode = <0>;
        lcd_gpio_0 = <&pio PD 4 GPIO_ACTIVE_LOW>;
        status = "okay";
    };
};
```

### DBI 模式 D2I1 接口屏配置

```c
&pio {
    dbi1_pins_default: dbi1@0 {
        pins = "PD1", "PD2", "PD3"; /* dbi-cs, dbi-clk, dbi-sdo */
        function = "spi1";
        allwinner,drive = <3>;
    };

    dbi1_pins_dcx: dbi1@1 {
        pins = "PD5"; /* dbi-dcx */
        function = "spi1_hold";
        allwinner,drive = <3>;
        bias-pull-up;
    };

    dbi1_pins_sleep: dbi1@2 {
        pins = "PD1", "PD2", "PD3", "PD5";
        function = "io_disabled";
    };
};

&lcd_fb {
    status = "okay";
    port {
        #address-cells = <1>;
        #size-cells = <0>;
        spi_panel0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&panel_nv3031a_spi1>;
        };
    };
};

&spi1 {
    pinctrl-0 = <&dbi1_pins_default &dbi1_pins_dcx>;
    pinctrl-1 = <&dbi1_pins_sleep>;
    pinctrl-names = "default", "sleep";
    clock-frequency = <100000000>;
    sunxi,spi-bus-mode = <SUNXI_SPI_BUS_DBI>;
    sunxi,spi-cs-mode = <SUNXI_SPI_CS_AUTO>;
    status = "okay";

    panel_nv3031a_spi1: slave@0 {
        device_type = "spi-panel";
        compatible = "allwinner,spi-panel";
        reg = <0x0>;
        spi-max-frequency = <100000000>;
        lcd_used = <1>;
        lcd_driver_name = "nv3031a";
        lcd_if = <1>;
        lcd_dbi_if = <4>;
        lcd_data_speed = <48>;
        lcd_x = <240>;
        lcd_y = <240>;
        lcd_pixel_fmt = <10>;
        lcd_dbi_fmt = <2>;
        lcd_rgb_order = <0>;
        lcd_width = <60>;
        lcd_height = <60>;
        lcd_pwm_used = <0>;
        lcd_pwm_ch = <6>;
        lcd_pwm_freq = <5000>;
        lcd_pwm_pol = <1>;
        lcd_frm = <1>;
        lcd_gamma_en = <1>;
        fb_buffer_num = <2>;
        lcd_backlight = <100>;
        lcd_fps = <60>;
        lcd_dbi_te = <0>;
        lcd_dbi_clk_mode = <0>;
        lcd_gpio_0 = <&pio PD 4 GPIO_ACTIVE_LOW>;
        status = "okay";
    };
};
```

### QSPI 模式单线 QSPI 接口屏配置

时序图：

![image-20250409113936063](images/image-20250409113936063-c37d837fa50121ffb128d08049a18d3e.png)

```c
&pio {
    spi1_pins_default: spi1@0 {
        pins = "PD1", "PD2", "PD3"; /* CS, SCK, D0 */
        function = "spi1";
        allwinner,drive = <3>;
    };

    spi1_pins_sleep: spi1@3 {
        pins = "PD1", "PD2", "PD3";
        function = "io_disabled";
    };
};

&lcd_fb {
    status = "okay";
    port {
        #address-cells = <1>;
        #size-cells = <0>;
        spi_panel0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&panel_st7789v_spi1>;
        };
    };
};

&spi1 {
    pinctrl-0 = <&spi1_pins_default>;
    pinctrl-1 = <&spi1_pins_sleep>;
    pinctrl-names = "default", "sleep";
    clock-frequency = <100000000>;
    sunxi,spi-bus-mode = <SUNXI_SPI_BUS_MASTER>;
    sunxi,spi-cs-mode = <SUNXI_SPI_CS_SOFT>;
    status = "okay";

    panel_st7789v_spi1: slave@0 {
        device_type = "spi-panel";
        compatible = "allwinner,spi-panel";
        reg = <0x0>;
        spi-max-frequency = <100000000>;
        spi-rx-bus-width = <1>;
        spi-tx-bus-width = <1>;
        lcd_used = <1>;
        lcd_driver_name = "st77916_qspi";
        lcd_if = <2>;
        lcd_dbi_if = <0>;
        lcd_qspi_if = <0>;
        lcd_data_speed = <48>;
        lcd_x = <360>;
        lcd_y = <360>;
        lcd_pixel_fmt = <10>;
        lcd_dbi_fmt = <2>;
        lcd_rgb_order = <0>;
        lcd_width = <60>;
        lcd_height = <60>;
        lcd_pwm_used = <0>;
        lcd_pwm_ch = <6>;
        lcd_pwm_freq = <5000>;
        lcd_pwm_pol = <1>;
        lcd_frm = <1>;
        lcd_gamma_en = <1>;
        fb_buffer_num = <2>;
        lcd_backlight = <100>;
        lcd_fps = <60>;
        lcd_dbi_te = <0>;
        lcd_dbi_clk_mode = <0>;
        lcd_gpio_0 = <&pio PD 14 GPIO_ACTIVE_LOW>;
        status = "okay";
    };
};
```

### QSPI 模式双线 QSPI 接口屏配置

时序图：

![image-20250409114011763](images/image-20250409114011763-63f3e3fd2103cc979c73a3cc19d1af2e.png)

```c
&pio {
    spi1_pins_default: spi1@0 {
        pins = "PD1", "PD2", "PD3", "PD4"; /* CS, SCK, D0, D1 */
        function = "spi1";
        allwinner,drive = <3>;
    };

    spi1_pins_sleep: spi1@3 {
        pins = "PD1", "PD2", "PD3", "PD4";
        function = "io_disabled";
    };
};

&lcd_fb {
    status = "okay";
    port {
        #address-cells = <1>;
        #size-cells = <0>;
        spi_panel0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&panel_st7789v_spi1>;
        };
    };
};

&spi1 {
    pinctrl-0 = <&spi1_pins_default>;
    pinctrl-1 = <&spi1_pins_sleep>;
    pinctrl-names = "default", "sleep";
    clock-frequency = <100000000>;
    sunxi,spi-bus-mode = <SUNXI_SPI_BUS_MASTER>;
    sunxi,spi-cs-mode = <SUNXI_SPI_CS_SOFT>;
    status = "okay";

    panel_st7789v_spi1: slave@0 {
        device_type = "spi-panel";
        compatible = "allwinner,spi-panel";
        reg = <0x0>;
        spi-max-frequency = <100000000>;
        spi-rx-bus-width = <2>;
        spi-tx-bus-width = <2>;
        lcd_used = <1>;
        lcd_driver_name = "st77916_qspi";
        lcd_if = <2>;
        lcd_dbi_if = <0>;
        lcd_qspi_if = <1>;
        lcd_data_speed = <48>;
        lcd_x = <360>;
        lcd_y = <360>;
        lcd_pixel_fmt = <10>;
        lcd_dbi_fmt = <2>;
        lcd_rgb_order = <0>;
        lcd_width = <60>;
        lcd_height = <60>;
        lcd_pwm_used = <0>;
        lcd_pwm_ch = <6>;
        lcd_pwm_freq = <5000>;
        lcd_pwm_pol = <1>;
        lcd_frm = <1>;
        lcd_gamma_en = <1>;
        fb_buffer_num = <2>;
        lcd_backlight = <100>;
        lcd_fps = <60>;
        lcd_dbi_te = <0>;
        lcd_dbi_clk_mode = <0>;
        lcd_gpio_0 = <&pio PD 14 GPIO_ACTIVE_LOW>;
        status = "okay";
    };
};
```

### QSPI 模式四线 QSPI 接口屏配置

时序图：

![image-20250409113550253](images/image-20250409113550253-7ace7459a97e1e1c7bc6536f3f111630.png)

```c
&pio {
    spi1_pins_default: spi1@0 {
        pins = "PD1", "PD2", "PD3", "PD4"; /* CS, SCK, D0, D1 */
        function = "spi1";
        allwinner,drive = <3>;
    };

    spi1_pins_hold: spi1@1 {
        pins = "PD5"; /* D2 */
        function = "spi1_hold";
        allwinner,drive = <3>;
        bias-pull-up;
    };

    spi1_pins_wp: spi1@2 {
        pins = "PD6"; /* D3 */
        function = "spi1_wp";
        allwinner,drive = <3>;
        bias-pull-up;
    };

    spi1_pins_sleep: spi1@3 {
        pins = "PD1", "PD2", "PD3", "PD4", "PD5", "PD6";
        function = "io_disabled";
    };
};

&lcd_fb {
    status = "okay";
    port {
        #address-cells = <1>;
        #size-cells = <0>;
        spi_panel0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&panel_st7789v_spi1>;
        };
    };
};

&spi1 {
    pinctrl-0 = <&spi1_pins_default &spi1_pins_hold &spi1_pins_wp>;
    pinctrl-1 = <&spi1_pins_sleep>;
    pinctrl-names = "default", "sleep";
    clock-frequency = <100000000>;
    sunxi,spi-bus-mode = <SUNXI_SPI_BUS_MASTER>;
    sunxi,spi-cs-mode = <SUNXI_SPI_CS_SOFT>;
    status = "okay";

    panel_st7789v_spi1: slave@0 {
        device_type = "spi-panel";
        compatible = "allwinner,spi-panel";
        reg = <0x0>;
        spi-max-frequency = <100000000>;
        spi-rx-bus-width = <4>;
        spi-tx-bus-width = <4>;
        lcd_used = <1>;
        lcd_driver_name = "st77916_qspi";
        lcd_if = <2>;
        lcd_dbi_if = <0>;
        lcd_qspi_if = <2>;
        lcd_data_speed = <48>;
        lcd_x = <360>;
        lcd_y = <360>;
        lcd_pixel_fmt = <10>;
        lcd_dbi_fmt = <2>;
        lcd_rgb_order = <0>;
        lcd_width = <60>;
        lcd_height = <60>;
        lcd_pwm_used = <0>;
        lcd_pwm_ch = <6>;
        lcd_pwm_freq = <5000>;
        lcd_pwm_pol = <1>;
        lcd_frm = <1>;
        lcd_gamma_en = <1>;
        fb_buffer_num = <2>;
        lcd_backlight = <100>;
        lcd_fps = <60>;
        lcd_dbi_te = <0>;
        lcd_dbi_clk_mode = <0>;
        lcd_gpio_0 = <&pio PD 14 GPIO_ACTIVE_LOW>;
        status = "okay";
    };
};
```

:::info

:::note

信息

:::
:::note

以下配置为 1.0.6 版本新增功能

:::

:::

### 带 TE 脚的屏使用 DBI TE 信号

TE 即（Tearing Effect），也就是撕裂的意思，是由于读写不同步导致撕裂现象，TE 脚的功能就是用于同步读写，TE 脚的频率也就是屏的刷新率，所以 TE 脚也可以看做 Vsync 脚（垂直同步脚）。

1.  硬件设计阶段，需要将屏的 TE 脚连接到 IC 的 DBI 接口的 TE 脚。
2.  配置上接口使用 DBI 接口。
3.  然后配置 [lcd\_dbi\_te](#lcd_dbi_te)。
4.  屏驱动使能 TE 功能，寄存器一般是 `35h`，详情看屏对应的 `Driver IC` 手册。
5.  屏驱动设置帧率，根据屏能接受的传输速度选择合理的帧率（比如ST7789里面是通过`c6h`来设置 TE 频率）。

```c
&pio {
    dbi1_pins_default: dbi1@0 {
        pins = "PD1", "PD2", "PD3"; /* dbi-cs, dbi-clk, dbi-sdo */
        function = "spi1";
        allwinner,drive = <3>;
    };

    dbi1_pins_dcx: dbi1@1 {
        pins = "PD5"; /* dbi-dcx */
        function = "spi1_hold";
        allwinner,drive = <3>;
        bias-pull-up;
    };

    dbi1_pins_te: dbi1@2 {
        pins = "PD6"; /* dbi-te */
        function = "spi1_wp";
        allwinner,drive = <3>;
        bias-pull-up;
    };

    dbi1_pins_sleep: dbi1@3 {
        pins = "PD1", "PD2", "PD3", "PD5", "PD6";
        function = "io_disabled";
    };
};

&lcd_fb {
    status = "okay";
    port {
        #address-cells = <1>;
        #size-cells = <0>;
        spi_panel0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&panel_st7789v_spi1>;
        };
    };
};

&spi1 {
    pinctrl-0 = <&dbi1_pins_default &dbi1_pins_dcx &dbi1_pins_te>;
    pinctrl-1 = <&dbi1_pins_sleep>;
    pinctrl-names = "default", "sleep";
    clock-frequency = <100000000>;
    sunxi,spi-bus-mode = <SUNXI_SPI_BUS_DBI>;
    sunxi,spi-cs-mode = <SUNXI_SPI_CS_AUTO>;
    status = "okay";

    panel_st7789v_spi1: slave@0 {
        device_type = "spi-panel";
        compatible = "allwinner,spi-panel";
        reg = <0x0>;
        spi-max-frequency = <100000000>;
        lcd_used = <1>;
        lcd_driver_name = "st7789v";
        lcd_if = <1>;
        lcd_dbi_if = <2>;
        lcd_data_speed = <48>;
        lcd_x = <240>;
        lcd_y = <240>;
        lcd_pixel_fmt = <10>;
        lcd_dbi_fmt = <2>;
        lcd_rgb_order = <0>;
        lcd_width = <60>;
        lcd_height = <60>;
        lcd_pwm_used = <0>;
        lcd_pwm_ch = <6>;
        lcd_pwm_freq = <5000>;
        lcd_pwm_pol = <1>;
        lcd_frm = <1>;
        lcd_gamma_en = <1>;
        fb_buffer_num = <2>;
        lcd_backlight = <100>;
        lcd_fps = <60>;
        lcd_dbi_te = <1>;
        lcd_dbi_clk_mode = <0>;
        lcd_gpio_0 = <&pio PD 4 GPIO_ACTIVE_LOW>;
        status = "okay";
    };
};
```

### 带 TE 脚的屏使用 GPIO TE 信号

TE 即（Tearing Effect），也就是撕裂的意思，是由于读写不同步导致撕裂现象，TE 脚的功能就是用于同步读写，TE 脚的频率也就是屏的刷新率，所以 TE 脚也可以看做 Vsync 脚（垂直同步脚）。

1.  硬件设计阶段，需要将屏的 TE 脚连接到 IC 的 DBI 接口的 TE 脚。
2.  配置上接口使用 DBI/SPI/QSPI 接口。
3.  然后配置 [lcd\_spi\_te\_pin](#lcd_spi_te_pin)。
4.  屏驱动使能 TE 功能，寄存器一般是 `35h`，详情看屏对应的 `Driver IC` 手册。
5.  屏驱动设置帧率，根据屏能接受的传输速度选择合理的帧率（比如ST7789里面是通过`c6h`来设置 TE 频率）。

```c
&pio {
    dbi1_pins_default: dbi1@0 {
        pins = "PD1", "PD2", "PD3"; /* dbi-cs, dbi-clk, dbi-sdo */
        function = "spi1";
        allwinner,drive = <3>;
    };

    dbi1_pins_dcx: dbi1@1 {
        pins = "PD5"; /* dbi-dcx */
        function = "spi1_hold";
        allwinner,drive = <3>;
        bias-pull-up;
    };

    dbi1_pins_sleep: dbi1@2 {
        pins = "PD1", "PD2", "PD3", "PD5";
        function = "io_disabled";
    };
};

&lcd_fb {
    status = "okay";
    port {
        #address-cells = <1>;
        #size-cells = <0>;
        spi_panel0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&panel_st7789v_spi1>;
        };
    };
};

&spi1 {
    pinctrl-0 = <&dbi1_pins_default &dbi1_pins_dcx>;
    pinctrl-1 = <&dbi1_pins_sleep>;
    pinctrl-names = "default", "sleep";
    clock-frequency = <100000000>;
    sunxi,spi-bus-mode = <SUNXI_SPI_BUS_DBI>;
    sunxi,spi-cs-mode = <SUNXI_SPI_CS_AUTO>;
    status = "okay";

    panel_st7789v_spi1: slave@0 {
        device_type = "spi-panel";
        compatible = "allwinner,spi-panel";
        reg = <0x0>;
        spi-max-frequency = <100000000>;
        lcd_used = <1>;
        lcd_driver_name = "st7789v";
        lcd_if = <1>;
        lcd_dbi_if = <2>;
        lcd_data_speed = <48>;
        lcd_x = <240>;
        lcd_y = <240>;
        lcd_pixel_fmt = <10>;
        lcd_dbi_fmt = <2>;
        lcd_rgb_order = <0>;
        lcd_width = <60>;
        lcd_height = <60>;
        lcd_pwm_used = <0>;
        lcd_pwm_ch = <6>;
        lcd_pwm_freq = <5000>;
        lcd_pwm_pol = <1>;
        lcd_frm = <1>;
        lcd_gamma_en = <1>;
        fb_buffer_num = <2>;
        lcd_backlight = <100>;
        lcd_fps = <60>;
        lcd_dbi_te = <1>;
        lcd_dbi_clk_mode = <0>;
        lcd_vsync_send_frame = <1>; /* 每次TE都送显，可选 */
        lcd_gpio_0 = <&pio PD 4 GPIO_ACTIVE_LOW>; /* RESET */
        lcd_spi_te_pin = <&pio PD 6 GPIO_ACTIVE_LOW>; /* TE */
        status = "okay";
    };
};
```

### 其他配置

#### 横竖屏旋转

1.  平台没有硬件旋转功能，软件旋转太慢而且耗费CPU。
2.  不少 SPI 屏支持内部旋转，需要在屏驱动初始化的时候进行设置，一般是**36h**寄存器。

```c
/* 转成横屏 */
sunxi_lcd_cmd_write(sel, 0x36);
sunxi_lcd_para_write(sel, 0xa0);
```

1.  lcd\_fb 的配置中需要将 [lcd\_x](#lcd_x) 和 [lcd\_y](#lcd_y) 的值对调，此时软件将屏视为横屏。
2.  屏内部旋转出图效果可能会变差，建议选屏的时候直接选好方向。

#### 帧率控制

屏的刷新率受限于多方面：

1.  SPI/DBI 硬件传输速度，也就是时钟脚的频率。设置 [lcd\_data\_speed](#lcd_data_speed) 可以设置硬件传输速度，一般最大不超过100MHz。如果屏能正常接收，这个值自然是越大越好。
2.  屏 Driver IC 接收能力。Driver IC 手册中会提到屏的能接受的最大 SCLK 周期。
3.  使用 2 DATA LANE 还是 1 DATA LANE，理论上 2 DATA LANE 的速度会翻倍。见\[DBI 模式 D2I1 接口屏配置\](#DBI 模式 D2I1 接口屏配置)。
4.  像素格式。像素格式决定需要传输的数据量，颜色数量越小的像素格式，帧率越高，但是效果越差。
5.  带TE脚的屏一节中我们知道，TE 相关设置直接影响到屏刷新率。
6.  如果不支持 TE，可以通过设置[lcd\_fps](#lcd_fps)来控制帧率，你需要根据第一点和第二点选择一个合适的值。

#### 背光控制

1.  硬件需要支持 PWM 背光电路。
2.  驱动支持 PWM 背光调节，只需要配置好[lcd\_pwm](#lcd_pwm_used)开头，[lcd\_backlight](#lcd_backlight)和[lcd\_bl\_en](#lcd_bl_en)等背光相关配置即可。

#### 像素格式相关

1.  [lcd\_pixel\_fmt](#lcd_pixel_fmt)，这个设置项用于设置fbdev的像素格式。
2.  [lcd\_dbi\_fmt](#lcd_dbi_fmt)，这个用于设置DBI接口发送的像素格式。

SPI/DBI 发送数据的时候没有必要发送 alpha 通道，但是应用层却有对应的 alpha 通道，比如 ARGB8888 格式。

这个时候硬件会自动帮我们处理好 alpha 通道，所以 `lcd_pixel_fmt` 选择有 alpha 通道的格式时，`lcd_dbi_fmt` 可以选 rgb666 或者 rgb888，不用和它一样。

#### 电源配置

有多个电源的情况，就用 `lcd_power1`，`lcd_power2` 然后屏驱动里面调用 [sunxi\_lcd\_power\_enable](#sunxi_lcd_power_enable) 接口即可。

#### GPIO配置说明

[lcd\_bl\_en](#lcd_bl_en)、[lcd\_spi\_dc\_pin](#lcd_spi_dc_pin)以及 [lcd\_gpio\_x](#lcd_gpio_x) 都是属于GPIO属性类型。

```
lcd_spi_dc_pin  = <&pio PD 4 GPIO_ACTIVE_LOW>;
```

#### 多个显示 LCD

1.  确定硬件有没有多余的 SPI/DBI 接口。
2.  需要在设备树里面新增 `lcd_fb` 中的 `endpoint`

:::warning

:::note

注意

:::
:::note

每个 SPI 控制器仅能接一块屏幕，不支持一个 SPI 接口挂多个屏幕使用 CS 控制。

:::

:::

例如配置 6 个 SPI 控制器驱动 6 块屏：

```c
&lcd_fb {
    status = "okay";
    port {
        #address-cells = <1>;
        #size-cells = <0>;
        spi_panel0: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&panel_st7789v_spi1>;
        };
        spi_panel1: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&panel_st7789v_spi2>;
        };
        spi_panel2: endpoint@2 {
            reg = <2>;
            remote-endpoint = <&panel_st7789v_spi3>;
        };
        spi_panel3: endpoint@3 {
            reg = <3>;
            remote-endpoint = <&panel_st7789v_spi4>;
        };
        spi_panel4: endpoint@4 {
            reg = <4>;
            remote-endpoint = <&panel_st7789v_spi5>;
        };
        spi_panel5: endpoint@5 {
            reg = <5>;
            remote-endpoint = <&panel_st7789v_spi6>;
        };
    };
};
```

#### 使用 RGB666 的屏，送显 RGB888 的数据

这里以 DBI RGB666 时序为例，可以看到 RGB666 的送图格式中，每个颜色都需要发送两个 dummy clock，这两个数据会被屏幕自动丢弃，所以我们可以直接送显 RGB888 的数据，屏幕配置为 RGB666，屏幕自行丢弃低位两个不需要的 data，达到屏幕配置 RGB666，送显 RGB888 的功能。

![image-20250729114312335](images/image-20250729114312335-c29ee085d37c92d581c0a6f9568900d1.png)

参考 QSPI，也有类似的丢弃

![image-20250729114530966](images/image-20250729114530966-a14bed26421dd7c35e2fdd8f267b455a.png)

## 编写屏驱动

屏驱动源码位置：

```
bsp/drivers/video/sunxi/lcd_fb/panels
```

1.  在屏驱动源码位置下拷贝现有一个屏驱动，包括头文件和源文件，然后将文件名改成有意义的名字，比如屏型号。
2.  修改源文件中的`strcut __lcd_panel`变量的名字，以及这个变量成员`name`的名字，这个名字必须和 `board.dts` 中 `[lcd_fb0]`的`lcd_driver_name`一致。
3.  在屏驱动目录下修改`panel.c`和`panel.h`。在全局结构体变量`panel_array`中新增刚才添加`strcut __lcd_panel`的变量指针。`panel.h`中新增`strcut __lcd_panel`的声明。并用宏括起来。
4.  修改`bsp/drivers/video/sunxi/lcd_fb/panels/Kconfig`，新增一个config，与第三点提到的宏对应。
5.  修改`bsp/drivers/video/sunxi/lcd_fb`路径下的Makefile文件。给lcd\_fb-obj变量新增刚才加入的源文件对应`.o`。
6.  根据本手册以及屏手册，Driver IC手册修改设备树中的\[lcd\_fb0\]节点下面的属性
7.  实现屏源文件中的`LCD_open_flow`，`LCD_close_flow`，`LCD_panel_init`，`LCD_power_on`等函数

### 开关屏流程函数

开关屏的操作流程如下图所示。

其中，`LCD_open_flow` 和 `LCD_close_flow` 称为开关屏流程函数，该函数利用 `LCD_OPEN_FUNC` 进行注册回调函数，先注册先执行，可以注册多个，不限制数量。

![开关屏函数流程](images/lcd_flow-174365089349913-dc7aecb31b0f19d742fee34553217c81.png)

#### LCD\_open\_flow

功能：初始化开屏的步骤流程。

原型：

```c
static __s32 LCD_open_flow(__u32 sel)
```

函数常用内容为：

```c
static __s32 LCD_open_flow(__u32 sel)
{
    LCD_OPEN_FUNC(sel, LCD_power_on,10);
    LCD_OPEN_FUNC(sel, LCD_panel_init, 50);
    LCD_OPEN_FUNC(sel, lcd_fb_black_screen, 100); 
    LCD_OPEN_FUNC(sel, LCD_bl_open, 0);
    return 0;
}
```

如上，初始化整个开屏的流程步骤为四个：

1.  打开LCD电源，再延迟10ms。
2.  初始化屏，再延迟50ms；（不需要初始化的屏，可省掉此步骤）。
3.  向屏发送全黑的数据。这一步骤是必须的，而且需要在开背光之前。
4.  打开背光，再延迟0ms。

`LCD_open_flow` 函数只会系统初始化的时候调用一次，执行每个 `LCD_OPEN_FUNC` 即是把对应的开屏步骤函数进行注册，**并没有立即执行该开屏步骤函数**。`LCD_open_flow` 函数的内容必须统一用 `LCD_OPEN_FUNC(sel, function, delay_time)` 进行函数注册的形式，确保正常注册到开屏步骤中。

`LCD_OPEN_FUNC` 的第二个参数是前后两个步骤的延时长度，单位ms，注意这里的数值请按照屏手册规定去填，乱填可能导致屏初始化异常或者开关屏时间过长，影响用户体验。

#### LCD\_close\_flow

功能：初始化关屏的步骤流程。

原型：

```c
static __s32 LCD_close_flow(__u32 sel)
```

函数常用内容为：

```c
static __s32 LCD_close_flow(__u32 sel)
{
    LCD_CLOSE_FUNC(sel, LCD_bl_close, 50);
    LCD_CLOSE_FUNC(sel, LCD_panel_exit, 10);
    LCD_CLOSE_FUNC(sel, LCD_power_off, 10);
    return 0;
}
```

1.  `LCD_bl_close`，是关背光，关完背光在处理其它事情，不会影响用户视觉。
2.  `LCD_panel_exit`，发送命令让屏退出工作状态。
3.  关电复位，让屏彻底关闭。

#### LCD\_OPEN\_FUNC

功能：注册开屏步骤函数到开屏流程中，记住这里是注册不是执行！

原型：

```c
void LCD_OPEN_FUNC(__u32 sel, LCD_FUNC func, __u32 delay)
```

参数说明：

func 是一个函数指针，其类型是：`void (*LCD_FUNC) (__u32 sel)`，用户自己定义的函数必须也要用统一的形式。比如：

```c
void user_defined_func(__u32 sel)
{
    //do something
}
```

`delay` 是执行该步骤后，再延迟的时间，时间单位是毫秒。

#### LCD\_power\_on

这是开屏流程中第一步，一般在这个函数使用[sunxi\_lcd\_gpio\_set\_value](#sunxi_lcd_gpio_set_value)进行GPIO控制，用[sunxi\_lcd\_power\_enable](#sunxi_lcd_power_enable)函数进行电源开关。

参考屏手册里面的上电时序（Power on sequence）。

#### LCD\_panel\_init

这是开屏流程第二步，一般使用[sunxi\_lcd\_cmd\_write](#sunxi_lcd_cmd_write)和sunxi\_lcd\_para\_write对屏寄存器进行初始化。

请向屏厂索要初始化寄存器代码或者自行研究屏Driver IC手册。

#### lcd\_fb\_black\_screen

接口用于向屏幕传输全黑数据，确保在开启背光时，避免显示雪花屏，若启用了启动LOGO，则会传输包含LOGO的图像。

#### LCD\_bl\_open

这是背光使能，固定调用。

1.  [sunxi\_lcd\_backlight\_enable](#sunxi_lcd_backlight_enable), 打开lcd\_bl\_en脚。
2.  [sunxi\_lcd\_pwm\_enable](#sunxi_lcd_pwm_enable), 使能pwm。

#### LCD\_bl\_close

这是关闭背光。固定调用下面两个函数，分别是：

1.  [sunxi\_lcd\_backlight\_disable](#sunxi_lcd_backlight_enable)，lcd\_bl\_en关闭
2.  [sunxi\_lcd\_pwm\_disable](#sunxi_lcd_pwm_enable), 关闭pwm。

#### LCD\_power\_off

这是关屏流程中最后一步，一般在这个函数使用[sunxi\_lcd\_gpio\_set\_value](#sunxi_lcd_gpio_set_value)进行GPIO控制，用[sunxi\_lcd\_power\_enable](#sunxi_lcd_power_enable)函数进行电源开关。

参考屏手册里面的下电时序（Power off sequence）。

### 屏驱接口函数

#### sunxi\_lcd\_delay\_ms

函数：**sunxi\_lcd\_delay\_ms/sunxi\_lcd\_delay\_us**

功能：延时函数，分别是毫秒级别/微秒级别的延时。

原型：`s32 sunxi_lcd_delay_ms(u32 ms); / s32 sunxi_lcd_delay_us(u32 us);`

#### sunxi\_lcd\_backlight\_enable

函数：**sunxi\_lcd\_backlight\_enable/ sunxi\_lcd\_backlight\_disable**

功能：打开/关闭背光，操作的是[lcd\_bl\_en](#lcd_bl_en)。

原型：

-   `void sunxi_lcd_backlight_enable(u32 screen_id);`
    
-   `void sunxi_lcd_backlight_disable(u32 screen_id);`
    

#### sunxi\_lcd\_pwm\_enable

函数：**sunxi\_lcd\_pwm\_enable / sunxi\_lcd\_pwm\_disable**

功能：打开/关闭 pwm 控制器，打开时 pwm 将往外输出 pwm 波形。对应的是 lcd\_pwm\_ch 所对应的那一路 pwm。

原型：

-   `s32 sunxi_lcd_pwm_enable(u32 screen_id);`
    
-   `s32 sunxi_lcd_pwm_disable(u32 screen_id);`
    

#### sunxi\_lcd\_power\_enable

函数：**sunxi\_lcd\_power\_enable / sunxi\_lcd\_power\_disable**

功能：打开/关闭Lcd电源，操作的是板级配置文件中的`lcd_power/lcd_power1/lcd_power2`。（pwr\_id 标识电源索引）。

原型：

-   `void sunxi_lcd_power_enable(u32 screen_id, u32 pwr_id);`
    
-   `void sunxi_lcd_power_disable(u32 screen_id, u32 pwr_id);`
    

1.  pwr\_id = 0：对应于配置文件中的lcd\_power。
2.  pwr\_id = 1：对应于配置文件中的lcd\_power1。
3.  pwr\_id = 2：对应于配置文件中的lcd\_power2。
4.  pwr\_id = 3：对应于配置文件中的lcd\_power3。

#### sunxi\_lcd\_cmd\_write

函数：**sunxi\_lcd\_cmd\_write**

功能：使用 SPI/DBI 发送命令。

原型：`s32 sunxi_lcd_cmd_write(u32 screen_id, u8 cmd);`

#### sunxi\_lcd\_para\_write

函数：**sunxi\_lcd\_para\_write**

功能：使用 SPI/DBI 发送参数。

原型：`s32 sunxi_lcd_para_write(u32 screen_id, u8 para);`

#### sunxi\_lcd\_qspi\_cmd\_write

函数：**sunxi\_lcd\_qspi\_cmd\_write**

功能：使用 QSPI 发送命令。

原型：`s32 sunxi_lcd_qspi_cmd_write(u32 screen_id, u8 cmd);`

#### sunxi\_lcd\_qspi\_para\_write

函数：**sunxi\_lcd\_qspi\_para\_write**

功能：使用 QSPI 发送参数。

原型：`s32 sunxi_lcd_qspi_para_write(u32 screen_id, u8 cmd, u8 para);`

#### sunxi\_lcd\_qspi\_multi\_para\_write

函数：**sunxi\_lcd\_qspi\_multi\_para\_write**

功能：使用 QSPI 发送多组参数。

原型：`s32 sunxi_lcd_qspi_para_write(u32 screen_id, u8 cmd, u8 *tx_buf, u32 len);`

#### sunxi\_lcd\_gpio\_set\_value

函数：**sunxi\_lcd\_gpio\_set\_value**

功能：`LCD_GPIO PIN` 脚上输出高电平或低电平。

原型：

```c
s32 sunxi_lcd_gpio_set_value(u32 screen_id, u32 io_index, u32 value);
```

参数说明：

-   io\_index = 0：对应于配置文件中的lcd\_gpio\_0。
-   io\_index = 1：对应于配置文件中的lcd\_gpio\_1。
-   io\_index = 2：对应于配置文件中的lcd\_gpio\_2。
-   io\_index = 3：对应于配置文件中的lcd\_gpio\_3。
-   value = 0：对应IO输出低电平。
-   Value = 1：对应IO输出高电平。

只用于该GPIO定义为输出的情形。

#### sunxi\_lcd\_gpio\_set\_direction

函数：**sunxi\_lcd\_gpio\_set\_direction**

功能：设置 `LCD_GPIO PIN` 脚为输入或输出模式。

原型：

```c
s32 sunxi_lcd_gpio_set_direction(u32 screen_id, u32 io_index, u32 direction);
```

参数说明：

-   io\_index = 0：对应于配置文件中的lcd\_gpio\_0。
-   io\_index = 1：对应于配置文件中的lcd\_gpio\_1。
-   io\_index = 2：对应于配置文件中的lcd\_gpio\_2。
-   io\_index = 3：对应于配置文件中的lcd\_gpio\_3。
-   direction = 0：对应IO设置为输入。
-   direction = 1：对应IO设置为输出。

## Linux FBDEV 编程注意事项

:::note

:::note

备注

:::
:::note

若开启 `lcd_vsync_send_frame` 配置，则不需要手动 `FBIO_PAN_DISPLAY`，但是会增加 CPU 占用。

:::

:::

在标准的 framebuffer (fbdev) 操作中，通常的写入操作会直接更新显示内容。然而 LCD\_FB 驱动与常规 fbdev 操作不同的，当你通过 `write` 向 framebuffer 内存写入数据时，显示不会立刻更新。这是因为 `write` 操作只会将数据写入 framebuffer 内存，并不会立即将该数据呈现到显示设备上。

要将数据更新至显示设备上，必须通过调用 `FBIO_PAN_DISPLAY` ioctl 命令。这个命令用于触发显示内容的刷新，将 framebuffer 内存中的内容显示到屏幕上。

即便没有特定的移动需求（例如不需要改变显示坐标），依然需要调用 `FBIOPAN_DISPLAY`，并且可以将坐标参数设置为 `(0, 0)`。这样，`FBIOPAN_DISPLAY` 命令就会确保显示内容的刷新，无论是否有显示内容的实际变化。

![image-20250613144345772](images/image-20250613144345772-6bdb6fd799cc1f7ab93b1a8110ba6571.png)

### 示例操作流程

1.  **写入数据到 framebuffer 内存**：
    -   使用常规的写操作将数据写入 framebuffer 内存。
2.  **调用 `FBIO_PAN_DISPLAY` 刷新显示**：
    -   即使没有改变显示位置，也需要调用此命令来更新显示。
    -   示例 ioctl 调用：`ioctl(fd, FBIOPAN_DISPLAY, &pan_display_info)`，其中 `pan_display_info` 中的坐标参数可以设为 `(0, 0)`。

### 优化建议

-   在频繁更新显示的应用中（例如视频播放或动态图形界面），可以通过合适的时机调用 `FBIO_PAN_DISPLAY`，避免不必要的刷新操作，以优化性能。
-   在不需要移动显示内容的情况下，合理使用 `(0, 0)` 坐标值，可以简化代码并保持显示效果的及时更新。

## SPI LCD 显示 BOOTLOGO

SPI LCD 驱动在1.0.5 实现了启动 BOOTLOGO 的功能，其通过 bootloader 加载启动 LOGO 文件，在内核中显示，以实现启动 LOGO 的功能。其流程如下所示：

![image-20250714193243978](images/image-20250714193243978-197bdb96a38b91985e14c7a9ad452d4f.png)

:::info

:::note

信息

:::
:::note

SDK 目前未合并该功能，需要打入补丁支持该功能。补丁请与全志 FAE 联系获取。

:::

:::

### 配置 BOOTLOGO 功能

SDK 默认需要使用 LZMA 压缩的 LOGO，需要勾选 `CONFIG_AW_LCD_FB_DECOMPRESS_LZMA` 选项：

![image-20250714193327825](images/image-20250714193327825-1be02cc22517c6b6321b822632cf8167.png)

:::info

:::note

不使用压缩功能

:::
:::note

SDK 默认会将 `openwrt/target/v861/v861-common/boot-resource/boot-resource/bootlogo.bmp` 进行 LZMA 压缩打包，所以正常使用需要勾选。

如果不想要压缩，可以修改文件 `build/pack` 增加源文件的拷贝

![image-20250714193556897](images/image-20250714193556897-c74f6f08741a1c490e76c90716048949.png)

```
if [ ! -f ${LICHEE_PACK_OUT_DIR}/bootlogo.bmp ]; then
	cp ${LICHEE_PACK_OUT_DIR}/boot-resource/bootlogo.bmp ${LICHEE_PACK_OUT_DIR}/bootlogo.bmp
	cp ${LICHEE_PACK_OUT_DIR}/boot-resource/bootlogo.bmp ${LICHEE_PACK_OUT_DIR}/bootlogo_orig.fex
fi
```

:::

:::
:::tip

:::note

bootlogo.fex 是怎么生成的

:::
:::note

BOOTLOGO 会在 `build/pack` 脚本中进行预处理，并将它们压缩成 `.lzma` 格式，生成相应的头文件，并创建符号链接。代码如下

build/pack

```c
if [ ! -f ${LICHEE_PACK_OUT_DIR}/bootlogo.bmp ]; then
    cp ${LICHEE_PACK_OUT_DIR}/boot-resource/bootlogo.bmp ${LICHEE_PACK_OUT_DIR}/bootlogo.bmp
fi

lzma -k ${LICHEE_PACK_OUT_DIR}/bootlogo.bmp
lzma -k ${LICHEE_PACK_OUT_DIR}/bempty.bmp
lzma -k ${LICHEE_PACK_OUT_DIR}/battery_charge.bmp

if [ -f ${LICHEE_PACK_OUT_DIR}/bootlogo.bmp.lzma ]; then
    add_lzma_header "${LICHEE_PACK_OUT_DIR}/bootlogo.bmp.lzma" "${LICHEE_PACK_OUT_DIR}/bootlogo.bmp"
    (cd ${LICHEE_PACK_OUT_DIR}; ln -sf bootlogo.bmp.lzma.head  bootlogo.fex)
fi
```

1.  **检查 `bootlogo.bmp` 是否存在**：
    
    ```bash
    if [ ! -f ${LICHEE_PACK_OUT_DIR}/bootlogo.bmp ]; then
    ```
    
    这行检查 `${LICHEE_PACK_OUT_DIR}` 目录下是否存在 `bootlogo.bmp` 文件。如果文件不存在，则进入 `then` 部分执行操作。
    
2.  **拷贝 `bootlogo.bmp` 文件**：
    
    ```bash
    cp ${LICHEE_PACK_OUT_DIR}/boot-resource/bootlogo.bmp ${LICHEE_PACK_OUT_DIR}/bootlogo.bmp
    ```
    
    -   `cp` 命令将 `${LICHEE_PACK_OUT_DIR}/boot-resource/bootlogo.bmp` 文件复制到 `${LICHEE_PACK_OUT_DIR}/bootlogo.bmp`，即将源文件放到目标位置。
3.  **压缩文件**：
    
    ```bash
    lzma -k ${LICHEE_PACK_OUT_DIR}/bootlogo.bmp
    lzma -k ${LICHEE_PACK_OUT_DIR}/bempty.bmp
    lzma -k ${LICHEE_PACK_OUT_DIR}/battery_charge.bmp
    ```
    
    这三行命令使用 `lzma` 压缩工具对 `bootlogo.bmp`、`bempty.bmp` 和 `battery_charge.bmp` 这三个文件进行压缩，生成对应的 `.lzma` 压缩文件。
    
    -   `-k` 选项表示保留原始文件，即压缩后不会删除原始文件。
4.  **检查 `bootlogo.bmp.lzma` 文件是否存在**：
    
    ```bash
    if [ -f ${LICHEE_PACK_OUT_DIR}/bootlogo.bmp.lzma ]; then
    ```
    
    这行检查压缩后的 `bootlogo.bmp.lzma` 文件是否存在。如果文件存在，则执行下面的操作。
    
5.  **添加 LZMA 头文件**：
    
    ```bash
    add_lzma_header "${LICHEE_PACK_OUT_DIR}/bootlogo.bmp.lzma" "${LICHEE_PACK_OUT_DIR}/bootlogo.bmp"
    ```
    
    这行命令调用 `add_lzma_header` 函数，它将 `bootlogo.bmp.lzma` 文件的 LZMA 头添加到 `bootlogo.bmp` 文件中。
    
    build/pack
    
    ```c
    function add_lzma_header()
    {
    	lzma_file=$1
    	original_file=$2
    	file_size=$(printf "%.8x\n" `stat -c%s ${lzma_file}`)
    	original_file_size=$(printf "%.8x\n" `stat -c%s ${original_file}`)
    
    	bin_str=""
    
    	file_size_len=${#file_size}
    
    	#"LZMA"+size+origin_size
    	bin_str="\x4c\x5a\x4d\x41\x${file_size:6:2}\x${file_size:4:2}\x${file_size:2:2}\x${file_size:0:2}"
    	bin_str+="\x${original_file_size:6:2}\x${original_file_size:4:2}\x${original_file_size:2:2}\x${original_file_size:0:2}"
    
    
    	printf "%b" ${bin_str} > tempbin
    
    	cat ${lzma_file} >> tempbin
    
    	mv tempbin "${lzma_file}.head"
    }
    ```
    
    `add_lzma_header` 函数的功能是给 LZMA 压缩文件添加一个头部，并将结果保存为带头部的文件：
    
    1.  **函数参数**
    
    ```bash
    lzma_file=$1
    original_file=$2
    ```
    
    -   `lzma_file` 是压缩后的 `.lzma` 文件路径。
    -   `original_file` 是原始文件路径，通常是被压缩的文件。
    
    2.  **获取文件大小**
    
    ```bash
    file_size=$(printf "%.8x\n" `stat -c%s ${lzma_file}`)
    original_file_size=$(printf "%.8x\n" `stat -c%s ${original_file}`)
    ```
    
    -   `stat -c%s ${lzma_file}` 获取 `lzma_file` 的大小（以字节为单位）。
    -   `printf "%.8x\n"` 将文件大小转换为 8 位的十六进制格式，确保文件大小是 8 位（不够时前面补零）。
    
    3.  **构建 LZMA 文件头**
    
    ```bash
    bin_str="\x4c\x5a\x4d\x41\x${file_size:6:2}\x${file_size:4:2}\x${file_size:2:2}\x${file_size:0:2}"
    bin_str+="\x${original_file_size:6:2}\x${original_file_size:4:2}\x${original_file_size:2:2}\x${original_file_size:0:2}"
    ```
    
    -   `\x4c\x5a\x4d\x41` 是字符 `LZMA` 的十六进制表示。
    -   然后拼接文件大小（`file_size`）和原始文件大小（`original_file_size`）的字节顺序。使用 `${file_size:6:2}` 这种方式提取文件大小的每两个字符，并按从低位到高位的顺序拼接。
    
    4.  **输出二进制字符串到临时文件**
    
    ```bash
    printf "%b" ${bin_str} > tempbin
    ```
    
    -   `printf "%b"` 会将 `bin_str` 中的十六进制表示转换为实际的二进制数据，然后写入到 `tempbin` 文件中。
    
    5.  **将 LZMA 文件内容追加到头部**
    
    ```bash
    cat ${lzma_file} >> tempbin
    ```
    
    -   使用 `cat` 将原本的 `lzma_file` 内容追加到 `tempbin` 文件后面。
    
    6.  **重命名文件**
    
    ```bash
    mv tempbin "${lzma_file}.head"
    ```
    
    -   将 `tempbin` 文件重命名为 `${lzma_file}.head`，这就是添加了头部信息的最终文件。
6.  **创建符号链接**：
    
    ```bash
    (cd ${LICHEE_PACK_OUT_DIR}; ln -sf bootlogo.bmp.lzma.head bootlogo.fex)
    ```
    
    这一行命令在 `${LICHEE_PACK_OUT_DIR}` 目录下创建一个名为 `bootlogo.fex` 的符号链接，指向 `bootlogo.bmp.lzma.head` 文件。
    
    -   `ln -sf` 选项表示创建符号链接，如果 `bootlogo.fex` 已存在，则会强制替换它。

整体操作流程如下：

-   检查并拷贝 `bootlogo.bmp` 文件到目标目录。
-   对 `bootlogo.bmp`、`bempty.bmp` 和 `battery_charge.bmp` 进行压缩。
-   如果 `bootlogo.bmp` 被压缩成 `.lzma` 格式，则通过 `add_lzma_header` 函数添加 LZMA 头，并在目标目录创建一个指向压缩文件头的符号链接 `bootlogo.fex`。

:::

:::

### 准备 BOOTLOGO

先准备一个 BMP 格式的图片，放到路径 `openwrt/target/v861/v861-common/boot-resource/boot-resource/bootlogo.bmp` 下

:::warning

:::note

注意

:::
:::note

-   BMP 图片的宽高需要小于显示屏，不需要与显示一致大小，驱动会自动居中显示
-   BMP 图片仅支持 24 位色深或者 32 位色深。其中 32 位色深支持透明度图层

![image-20250714192839923](data:image/png;base64,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)

:::

:::

然后配置 bootlogo 分区，将启动 logo 放到独立分区中

```
[partition]
    name         = bootlogo
    size         = 256
    user_type    = 0x8000
    downloadfile = bootlogo.fex
```

![image-20250714192959931](images/image-20250714192959931-4f507ccde58f18945b76eafc94a58136.png)

:::info

:::note

不使用压缩功能

:::
:::note

如果想使用不压缩的 LOGO，在上面修改完成 `build/pack` 后，可以使用源文件打包即可

```
[partition]
    name         = bootlogo
    size         = 256
    user_type    = 0x8000
    downloadfile = bootlogo_orig.fex
```

:::

:::

### 常电方案 U-Boot 配置功能

修改板级目录下的 `env.cfg` 增加预留内存配置和读取 logo 的相关配置

这里将 logo 读取到地址 `0x80e55000` 长度 `16384`，在没用过 `setargs` 中增加这个配置即可。

```
lcdfb_reserve=16384,0x80e55000
```

![image-20250714194922240](images/image-20250714194922240-ba2e3b27613f6f629fbcc6ec57a922e2.png)

增加命令把 `bootlogo` 加载到内存中

```
load_bootlogo=sunxi_flash read 0x80e55000 bootlogo
```

![image-20250714195042513](images/image-20250714195042513-6910a6305239c98c44dbc0d27b3c4cb4.png)

然后在默认启动的时候执行这个命令

```
bootcmd=run setargs_nand load_bootlogo boot_normal#default nand boot
```

![image-20250714195119191](images/image-20250714195119191-7c27a95e811d861f68b4e752058c176c.png)

配置完成可以在启动阶段看到相关打印

![image-20250714195209053](images/image-20250714195209053-a37fa97ce2b26410ac57ca76325046a7.png)

### 快起方案配置功能

快起配置加载功能需要编写下代码，修改文件 `brandy/brandy-2.0/spl/common/flash_loader.c` 增加加载 BOOTLOGO 的逻辑代码

在 `load_isp_param` 这里增加加载的代码

```c
if (init_gpt()) {
    printf("init GPT fail\n");
    return -1;
}
if (get_part_info_by_name("bootlogo", &start_sector, &sector_num)) {
    return -1;
}
load_flash_success = spl_flash_read(start_sector, 16384, (void *)(phys_addr_t)0x80e55000);
```

![image-20250714195432605](images/image-20250714195432605-20a747610bc1af0a1983e99385d66e00.png)

然后在设备树 `board.dts` 中，增加预留内存的配置，修改 `bootargs`

```
lcdfb_reserve=16384,0x80e55000
```

![image-20250723094000217](images/image-20250723094000217-5552abaa01f9e020dd9e860ad8037e2a.png)

配置完成可以在启动阶段看到相关打印

![image-20250714195209053](images/image-20250714195209053-a37fa97ce2b26410ac57ca76325046a7.png)

### 常见问题

:::danger

:::note

危险

:::
:::note

1.  注意选择的地址需要与其他功能不冲突，示例使用的 `0x80e55000` 地址可能与其他功能互相重叠造成踩内存的问题，请根据方案确定空闲内存地址。
2.  读取的长度需要对齐 64K，预留内存的长度需要比打包的 LOGO 大，另外需要对齐 4K

:::

:::
:::tip

:::note

提示

:::
:::note

如果内核打印如下：

![image-20250717110021947](images/image-20250717110021947-eb011936580edb3a8a4abbee46d946cf.png)

请到 U-Boot 中检查载入的文件是否正确，若是 LZMA 文件，可以看到 LZMA的文件头，驱动会去匹配这个头去解压 LZMA 文件并映射

```
sunxi_flash read 0x80e55000 bootlogo ## 执行 bootlogo 加载到地址0x80e55000
md 0x80e55000 0x100 ## 打印内存
```

![image-20250717105816397](images/image-20250717105816397-855097a163b420cba057e73e86001907.png)

若是 BMP 原图，可以在这里看到 `BM` 的 BMP 头，驱动会直接去映射

![image-20250717110232196](images/image-20250717110232196-8cb078a787a9f739a1de46e7e2b0fe7f.png)

如果此步骤检查出现异常，请确定：

-   该地址未被其他功能占用，例如设备树，预留内存等
-   该地址在其生命周期中未被其他覆盖
-   小核未操作该地址内存

:::

:::

## FAQ

### 怎么判断屏初始化成功

屏初始化成功，一般呈现的现象是雪花屏。因为屏驱动里面，在 `LCD_open_flow` 中添加了`lcd_fb_black_screen`的注册，故正常情况下开机是有背光的黑屏画面。

### 黑屏-无背光

一般是电源或者pwm相关配置没有配置好。参考[lcd\_pwm](#lcd_pwm_used)开头的相关配置。

### 送图无显示

排除步骤:

1.  屏驱动里面，在`LCD_open_flow`中删除`lcd_fb_black_screen`的注册，启动后，如果屏初始化成功应该是花屏状态(大部分屏如此)。
2.  如果屏没有初始化成功，请检查屏电源，复位脚状态。
3.  如果屏初始化成功，但是发数据时又没法显示，那么需要检查是不是帧率过快，查看[帧率控制](#%E5%B8%A7%E7%8E%87%E6%8E%A7%E5%88%B6)。
4.  如果电源复位脚正常，请检查配置，[lcd\_dbi\_if](#lcd_dbi_if), [lcd\_dbi\_fmt](#lcd_dbi_fmt)是否正确，屏是否支持, 如果支持，在屏驱动里面是否有对应上。
5.  尝试修改[lcd\_dbi\_clk\_mode](#lcd_dbi_clk_mode)。

### 闪屏

非常有可能是速度跑太快，参考[帧率控制](#%E5%B8%A7%E7%8E%87%E6%8E%A7%E5%88%B6)一小节。

### 画面偏移

画面随着数据的发送偏移越来越大。

尝试修改[lcd\_dbi\_clk\_mode](#lcd_dbi_clk_mode)。

### 屏幕白屏

屏幕白屏，但是背光亮起

![image-20231017113731873](images/image-20231017113731873-3d3adbac8e2f1962375388187476c7ef.png)

白屏是因为屏幕没有初始化，需要检查屏幕初始化序列或者初始化数据是否正确。

### 屏幕花屏

屏幕花屏，无法控制

![image-20231017113841569](images/image-20231017113841569-d53bca31be5cdfb31fb690ba0da8d2e1.png)

花屏一般是因为屏幕初始化后没有正确设置 `addrwin`，或者初始化序列错误。

### LVGL 屏幕颜色不正确

出现反色，颜色异常

![image-20231017113620580](images/image-20231017113620580-07f56167d7baf3353d4a5f85efb88f33.png)

请配置 LVGL `LV_COLOR_DEPTH` 参数为 16，`LV_COLOR_16_SWAP` 为 1，这是由 SPI LCD 的特性决定的。如果是 DBI 屏幕，则调整 lcd\_dbi\_fmt 和 lcd\_pixel\_fmt，不需要调整 `LV_COLOR_16_SWAP`

![image-20231017113520621](images/image-20231017113520621-a2fc83466eac28a45e728c48f805f611.png)

:::warning

:::note

注意

:::
:::note

修改后请重新编译 LVGL

```bash
mmo lv_examples -B
```

:::

:::

### LVGL 显示不对

出现几乎大白屏，显示也不对

![image-20250604150009916](images/image-20250604150009916-96ad9896e29e7a2feb5d209922bdc765.png)

请配置 LVGL `LV_COLOR_DEPTH` 参数为 16，SPI LCD 大多数是 `RGB666` 或 `RGB565` 的，配置参数 `32` 是 `RGB888` 的，图层数据排布不同导致显示异常

![image-20231017113520621](images/image-20231017113520621-a2fc83466eac28a45e728c48f805f611.png)

:::warning

:::note

注意

:::
:::note

修改后请重新编译 LVGL

```bash
mmo lv_examples -B
```

:::

:::

### 显示反色

这是由于屏幕启动了 RB SWAP，一般是 `0x36` 寄存器修改

正常显示

```
sunxi_lcd_cmd_write(sel, 0X36);
sunxi_lcd_para_write(sel, 0x00);
```

反色显示

```
sunxi_lcd_cmd_write(sel, 0X36);
sunxi_lcd_para_write(sel, 0x08);
```

### 出现部分花屏

![image-20231023103039467](images/image-20231023103039467-8e7109036505353a7bc9cbe2f3e004c8.png)

-   检查 `address` 函数是否正确
-   检查 `board.dts` 屏幕配置分辨率是否正确

### SPI LCD 颜色相关问题

首先，得先确定显示屏使用的是SPI接口，还是DBI接口，不同的接口，输入数据的解析方式是不一样的。

DBI接口的全称是 `Display Bus Serial Interface` ，在显示屏数据手册中，一般会说这是SPI接口，所以有人会误认为 SPI 屏可以使用 `normal spi` 去直接驱动。

阅读`lcd_dbi_if`部分的介绍可以知道，在3线模式时，发送命令前有1位A0用于指示当前发送的是数据，还是命令。而命令后面接着的数据就没有这个A0位了，代表SPI需要在9位和8位之间来回切换，而在读数据时，更是需要延时 `dummy clock` 才能读数据，`normal spi` 都很难，甚至无法实现。所以 `normal spi` 只能使用软件控制 DC GPIO 去模拟 4 线的DBI的写操作。

对于这类支持DBI接口的CPU，可以选择不去了解SPI。如果需要用到SPI去驱动显示屏，必须把显示屏设置成小端。

#### RGB565和RGB666

SPI显示屏一般支持RGB444,RGB565和RGB666，RGB444使用的比较少，所以只讨论RGB565和RGB666.

RGB565代表一个点的颜色由2字节组成，也就是R（红色）用5位表示，G（绿色）用6位表示，B（蓝色）用5位表示，如下图所示：

![image-20231016100553340](images/image-20231016100553340-55634b3b8d97fcd55fdfc7bcda4229c4.png)

RGB666一个点的颜色由3字节组成，每个字节代表一个颜色，其中每个字节的低2位会无视，如下图所示：

![image-20231016100620890](images/image-20231016100620890-e744d0a92d7badd5c499d9b4399c020e.png)

#### SPI 接口

因为SPI接口的通讯效率不高，所以建议使用RGB565的显示，以 `jlt35031c` 显示屏为例，他的显示驱动芯片是 `ST7789`，设置显示格式的方式是往 `3a` 寄存器写入`0x55（RGB565`）或者 `0x66（RGB666）`

```
sunxi_lcd_cmd_write(sel, 0x3a);
sunxi_lcd_para_write(sel, 0x55);
```

在例程中，输入的数据是 `0xff，0x00，0xff，0x00`，对于SPI接口，是按字节发送。实际上，例程只需要每次发送2字节即可，因为前后发送的都是相同的ff 00，所以没有看出问题。

根据对 `565` 的数据解析，我们拆分 `ff 00` 就可以得到红色分量是 `0b11111`，也就是 `31`，绿色是`0b111000`，也就是 `56`，，蓝色是 `0`.我们等效转换成 `RGB888`，有：

```
R = 31/31*255 = 255
G = 56/63*255 = 226
```

在调色板输入对应颜色，就可以得到黄色

![image-20231016100913213](data:image/png;base64,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)

#### DBI 接口

因为 `DBI` 通讯效率较高，所以可以使用 `RGB565` 或者 `RGB666`，使用 `DBI` 接口，也就是 `lcd_if` 设置为`1`时，驱动会根据 `lcd_pixel_fmt` 配置寄存器，以 `SDK` 中的 `kld2844b.c` 为例，这显示屏的显示驱动也是 `ST7789`，但是不同的屏幕，厂家封装时已经限制了通讯方式，所以即使是能使用 DBI 接口的驱动芯片的屏幕，或许也用不了DBI。

```c
sunxi_lcd_cmd_write(sel, 0x3A); /* Interface Pixel Format */
/* 55----RGB565;66---RGB666 */
if (info[sel].lcd_pixel_fmt == LCDFB_FORMAT_RGB_565 ||
    info[sel].lcd_pixel_fmt == LCDFB_FORMAT_BGR_565) {
    sunxi_lcd_para_write(sel, 0x55);
    if (info[sel].lcd_pixel_fmt == LCDFB_FORMAT_RGB_565)
        rotate &= 0xf7;
    else
        rotate |= 0x08;
} else if (info[sel].lcd_pixel_fmt < LCDFB_FORMAT_RGB_888) {
    sunxi_lcd_para_write(sel, 0x66);
    if (info[sel].lcd_pixel_fmt == LCDFB_FORMAT_BGRA_8888 ||
        info[sel].lcd_pixel_fmt == LCDFB_FORMAT_BGRX_8888 ||
        info[sel].lcd_pixel_fmt == LCDFB_FORMAT_ABGR_8888 ||
        info[sel].lcd_pixel_fmt == LCDFB_FORMAT_XBGR_8888) {
        rotate |= 0x08;
    }
} else {
    sunxi_lcd_para_write(sel, 0x66);
}
```

对于 DBI 格式，不再是以字节的形式去解析，而是以字的方式去解析，为了统一，软件已经规定了，`RGB565` 格式时，字大小是2字节，也就是16位，而 `RGB666` 格式时，字大小是4字节，也就是32位。

对于 `RGB565` 格式，同样是设置为 `0xff,0x00`。因为屏幕是大端，而芯片存储方式是小端，所以芯片的 DBI 模块，会自动把数据从新排列，也就是实际上 DBI 发送数据时，会先发送`0x00`，再发送`0xff`，也就是红色分量为0，绿色分量为 `0b000111`，也就是7，蓝色分量是 `0x11111`，也就是31，我们同样转换成RGB888

```
G = 7/63*255 = 28
B= 31/31*255 = 255
```

在调色板上输入，可以得到蓝色。

![image-20231016101233907](data:image/png;base64,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)

如果是 `RGB666`，虽然占用的是3个字节，但是没有CPU是3字节对齐的，所以需要一次性输入4字节，然后 DBI 硬件模块，会自动舍弃1个字节，软件同意舍弃了最后一个字节。

依旧以例程为例，例程输入了 `0xff，0x00，0xff，0x00`，为了方便说明，标准为 `0xff(1)，0x00(1)，0xff(2)，0x00(2)`，其中 `0x00(2)`会被舍弃掉，然后发送顺序是`0xff(2)，0x00(1)，0xff(1)`，也就是 `0xff(2)` 是红色分量，`0xff(1)` 是蓝色分量，混合可以得到紫色。

![image-20231016101308346](data:image/png;base64,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)

## 总结

调试LCD显示屏实际上就是调试发送端芯片（全志SOC）和接收端芯片（LCD屏上的driver IC）的一个过程：

1.  添加屏驱动请看编写屏驱动
2.  仔细阅读屏手册以及driver IC手册（有的话）。
3.  仔细阅读板级显示配置参数详解。
4.  确保LCD所需要的各路电源管脚正常。
