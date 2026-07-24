---
sidebar_position: 2
---

# 图像调试指南

## 前 言

### 文档简介

本文档适用于V系列平台图像效果调试，通过更具体化的示例帮助用户了解图像ISP效果调试的基础流程。

### 目标读者

软件工程师、技术支持工程师。

### 适用范围

:::note

:::note

适用产品列表

:::

:::

| **产品名称** | **ISP版本** |
| --- | --- |
| V85x | ISP600 |
| V821 | ISP603 |

### 文档约定

#### 标志说明

:::warning

:::note

注意

:::
:::note

提醒操作中应注意的事项。不当的操作可能会损坏器件，影响可靠性、降低性能等。

:::

:::
:::note

:::note

备注

:::
:::note

为准确理解文中指令、正确实施操作而提供的补充或强调信息。

:::

:::
:::tip

:::note

提示

:::
:::note

一些容易忽视的小功能、技巧。了解这些功能或技巧能帮助解决特定问题或者节省操作时间。

:::

:::

## 调试环境准备

### 图像效果调试需要准备的环境

| **名称** | **说明** |
| --- | --- |
| 样机 | 用于调试使用，建议调试前确定好需要量产的镜头，避免重复工作 |
| 对比机 | 用于对比使用，由于镜头、sensor对成像质量影响大，建议选取对比机使用同款sensor、镜头 |
| 调试固件 | 图像调试依赖于adb/ip两种连接方式，必须确保调试固件能正常使用其中一种方式 |
| awTuningApp | 调试ISP使用的板端应用 |
| TigerISP | 调试ISP使用的PC程序，前往APST下载 |
| 串口 | 样机需将串口接出，便于调试过程中使用 |
| 光源箱 | 用于客观标定，提供多种不同色温不同亮度的照明环境 |
| 散光片 | 用于客观标定，又称毛玻璃 |
| 24色色卡 | 用于客观标定，用于色彩调优 |

![TigerISP下载安装](images/TigerISP下载安装-0c6ceae446ae4c3f1438724ac17b934a.png)

![光源箱示例图](images/光源箱示例图-b8edc46fc831ff7f694f88619983b5cb.png)

![散光片示例图](images/散光片示例图-04541df468beb8a60888ed8ded682851.png)

![24色色卡示例图](images/24色色卡示例图-8987102ce95fb0a61f284d25edecd48f.png)

:::note

:::note

备注

:::
:::note

-   如无客观标定设备，可向我司对接人申请实验室环境用于客观标定。
-   `V821` 常电的 `awTuningApp` 路径： `\platform\allwinner\vision\libAWIspApi\isp_mpp\isp_v821\libisp\tuning_app`
-   `V821` 快启的 `awTuningApp` 路径： `\rtos\lichee\rtos-hal\hal\source\vin\vin_isp\isp_server\out`
-   `V85X` 常电的 `awTuningApp` 路径： `\external\eyesee-mpp\middleware\sun8iw21\media\LIBRARY\libisp\tuning_app`
-   `V85X` 快启的 `awTuningApp` 路径： `\lichee\rtos-hal\hal\source\vin\vin_isp\isp_server\out`

:::

:::

### 选择及设置色彩空间

色彩空间是一种数学模型，用于描述和表示图像或视频中的颜色，它定义了一组颜色值的范围、编码方式以及颜色之间的转换规则。

不同亮度范围的色彩空间是会导致动态范围呈现差异的；

**BT709-Partrange（部分范围）**：也称为"limited range"，它是指亮度范围在 16 到 235 之间的值。这意味着黑色对应的值是 16，白色对应的值是 235。在这个范围内，0 表示纯黑，255 表示纯白，而 1 和 235 之间的值用于表示灰度和其他亮度级别。Partrange 通常用于视频广播和一些消费电子设备中，以确保在传输和显示过程中能够兼容各种设备和标准。它可以防止黑色和白色之外的信息在传输或显示中被截断或失真。

**BT709-Fullrange（全范围）**：也称为"full range"，它是指亮度范围在 0 到 255 之间的值。这意味着黑色对应的值是 0，白色对应的值是 255。在这个范围内，所有的亮度级别都可以表示。Fullrange主要用于一些专业领域和特定应用，例如计算机图形和视频编辑。在这些情况下，使用全范围可以提供更大的亮度动态范围和更精细的色彩表示。

**在产品开发中，如果希望图像对比度更高，画面更通透，那么建议选择BT709-Fullrange的色彩空间**

在实际应用中，ISP、VE以及解码端，均需要设置色彩空间，在配置过程中，务必要确保三者保持设置同一个色彩空间，避免部分亮度丢失，对比度异常的问题。其中VE、ISP的色彩空间设置，请参考sample\_smartIPC\_demo中如下图所示配置，解码端需要找对应同事进行确认

V85xSample路径：`\external\eyesee-mpp\middleware\sun8iw21\sample\sample_smartIPC_demo\sample_smartIPC_demo.c`  
V821Sample路径：`\platform\allwinner\eyesee-mpp\middleware\sun300iw1\sample\sample_smartIPC_demo\sample_smartIPC_demo.c`

![色彩空间接口设置1](images/色彩空间接口设置1-04c79e971f5510b7fd0054b056234d44.png)

![色彩空间接口设置2](images/色彩空间接口设置2-7a7585f5116ad5b2b940de7c740c08a5.png)

ISP、VE设置好色彩空间后，通过抓取ISP、VE节点确认

ISP节点：`cat /sys/kernel/debug/mpp/isp`  
VE节点：`cat /sys/kernel/debug/mpp/ve*`

![ISP节点色彩空间](images/ISP节点色彩空间-599f3d707f6ad6eede13c750f131862e.png)

![VE节点色彩空间](images/VE节点色彩空间-f132f206a6b729357236db9c5759026d.png)

:::note

:::note

备注

:::
:::note

-   potplayer播放器默认使用的是Full\_range的色彩空间，vlc播放器默认使用的是Part\_range的色彩空间，如果需要使用播放器对比图像效果，色彩空间也需要匹配上。

:::

:::

### 确认对焦是否准确

镜头对焦确认方法：

**Step1**：打印如下测试图，打印要求：横向、无边距、至少A4大小（越大越好）、至少600dpi（越大越好）

![对焦示例图1](images/对焦示例图1-339a204d252675e8b627ae00e530741b.png)

**Step2**：在充足照明（不小于1000lux）的环境拍摄，选择产品常用的拍摄距离放置测试图，最好能保证测试图高度占画面高度不小于1/8  
**Step3**：彩色和红外下都需要测试。（如果打印版本无法在红外下使用，可到TB购买）  
**Step4**：打开看视频的应用，画质调到最高，画面稳定后截图  
**Step5**：用PS或ISP调试工具等打开图片，测量测试图的高度（上下边框的纵坐标差），根据最小的能看清楚三横三竖的图案所处位置，查表代入公式计算54941/Height/GE清晰度，如果图像有插值，那么公式为54941/Height/GE清晰度\*插值图像高度/sensor实际高度

![对焦示例图2](images/对焦示例图2-5a57d2f6999a731167d9350af1b14d01.png)

**Step6**：清晰度低于0.7的，请检查对焦  
示例如下：  
  
图片分辨率是1920x1080，测试图的高度为63像素，最小的能看清楚三横三竖的图案处于G-2E6，查表得1122.46。代入公式54941 / 63 / 1122.46 = 0.776935806，图像无插值，清晰度就是0.777

![对焦示例图3](images/对焦示例图3-475457cbba443c9b9c1bb30f429ee708.png)

![对焦示例图4](images/对焦示例图4-29150f63c4b160f247b89a4e5aeeb304.png)

### 镜头sensor选型介绍

镜头与sensor在匹配状态下，才能将清晰度、画面均匀度达到最佳状态，镜头选型需要注意的方面如下

-   镜头与sensor的CRA是否匹配

镜头与sensor均有一个CRA曲线，在选型过程中，要尽量保证CRA参数要尽可能接近（一般不超过3度）

![Sensor的Cra曲线](images/Sensor的Cra曲线-2f590d8465193ccec8a2877d6b2bca03.png)

-   镜头解析力与sensor尺寸是否匹配

镜头解析力稍大于或等于sensor尺寸，才能将清晰度更好展现，不然会导致清晰度差异及摩尔纹等问题

-   镜头靶面与sensor是否匹配

sensor尺寸一般是按照对角线长度描述（单位inch），通常是1/3',1/2'等，镜头靶面也是如此表示，如果镜头的靶面范围无法覆盖整个sensor，那么成像出来会存在严重暗角

-   镜头光圈及焦距

光圈越大进光量越大，摄像头模组的感光性更好，图像质量更佳（尤其是在低照度），焦距决定了成像的视场角，焦距越大，视场范围越小，适合用于观察远景。

-   镜头的景深范围、点胶距离如何确定

景深范围是指摄像头在纵向距离上，能看清楚的最远点，和能看清楚的最近点之间的范围，它是可变的，由点胶距离决定

-   是否支持日夜共焦

对于需要红外补光的定焦镜头，要确定镜头+ir\_cut 是否是日夜共焦的。我们一般是以白天模式去进行对焦，在可见光下，ir\_cut 切到滤光片下对焦，但到夜晚以后，补红外光，ir\_cut切到透光片，如果此时镜头日夜不共焦，红外夜视下图像效果就是模糊的，处于虚焦状态。要保证两种状态下对焦都是清晰的，这就要保证镜头+ir\_cut是日夜共焦的才可以。

-   镜头畸变

畸变可以通过畸变校准进行修复，但在一定程度上会损失视场角，因此选择镜头时对畸变有要求的话，就要考虑选择畸变范围小的镜头。

### 离线调试和在线调试介绍

| **名称** | **说明** |
| --- | --- |
| 离线调试 | 不跑应用或sample出流，`awTuningApp`负责出流及`ISP`调试 |
| 在线调试 | 跑应用或sample出流，`awTuningApp`只负责`ISP`调试 |

#### 离线调试使用步骤

-   检查调试环境，确保调试固件能支持`adb/ip`的连接方式
-   设备上电后进入控制台，输入`ls /dev/video*`，确保有对应的`video`节点
-   准备`SDK`环境对应的`awTuningApp`、`TigerISP`
-   准备SD卡，将`awTuningApp`放入卡中，插入样机。（如设备不支持SD卡，可通过adb将`awTuningApp`推到`tmp`目录）
-   如通过adb推到tmp目录，需要先执行`chmod 777 awTuningApp`给应用执行权限
-   小机端执行`./awTuningApp 8848 0 &`
-   PC端运行`TigerISP`工具,并选择对应的平台，下面的两个选项均不需勾选，点击`OK`

![TigerISP引导界面1](data:image/png;base64,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)

-   根据下面介绍进行填写，离线调试下如果部分参数未填对也可以连接上，但在线调试下没填对会导致连接不上并加载参数失败。

Comm Type ：连接方式，支持adb、IP连接方式  
Port：端口号，与小机端运行时使用的保持一致，默认为8848  
Sensor：sensor名  
Width：输入ISP的图像宽度  
Height：输入ISP的图像高度  
FPS：帧率  
ISP：ISP通道号  
Vich：Video通道号  
Wdr Mode：是否为WDR模式，非WDR模式选择None，如果为WDR模式请选择DOL  
Stitching：是否为拼接模式，仅大尺寸走拼接时需要配置

![TigerISP引导界面2](images/TigerISP引导界面2-f80cb09236bf8b0d80cdd356c4e3df50.png)

-   填写参数后进行连接，`TigerISP`的日志如下代表连接成功

![TigerISP引导界面3](images/TigerISP引导界面3-eaea52dfdcb8ca941ca240eb6e490597.png)

-   点击`Extra Tools`中的`Capture`后弹出`capture`窗口，点击`Dump`即可实现预览。

![TigerISP引导界面4](images/TigerISP引导界面4-208349840e34a40fce24d31c8215c16c.png)

![TigerISP引导界面5](images/TigerISP引导界面5-dc0462ede3fb27bf280e9ecda40bb1ba.png)

:::note

:::note

备注

:::
:::note

-   连接`TigerISP`使用的`awTuningApp`需使用sdk默认编译出来
-   如果使用adb连接，却无法跳转到连接加载界面，请在板端运行`ifconfig -a`，检查是否有lo的网口配置，如没有需要确认是否将这个配置裁剪了，可与sdk中默认内核配置对比确认。

:::

:::

#### 在线调试使用步骤

-   检查调试环境，确保调试固件能支持adb/ip的连接方式
-   设备上电后进入控制台，输入`ls /dev/video*`，确保有对应的`video`节点
-   确保小机端已运行`sample`或应用出流，并可以通过手机APP/PC端/屏幕等进行预览实时图像
-   准备`SDK`环境对应的`awTuningApp、TigerISP`
-   准备SD卡，将`awTuningApp`放入卡中，插入样机。（如设备不支持SD卡，可通过`adb`将`awTuningApp`推到`tmp`目录）
-   如通过adb推到tmp目录，需要先执行`chmod 777 awTuningApp`给应用执行权限
-   小机端执行`./awTuningApp 8848 1 &`，注意这里传的参数与离线模式的差异
-   PC端运行`TigerISP`工具,并选择对应的平台，下面的两个选项均不需勾选，点击`OK`
-   参数设置参考上面的离线调试介绍，在线调试设置参数必须与通路保持一致，不然会导致连接不上并加载参数失败

:::note

:::note

备注

:::
:::note

-   连接`TigerISP`使用的`awTuningApp`需使用`sdk`默认编译出来
-   如果使用`adb`连接，却无法跳转到连接加载界面，请在板端运行`ifconfig -a`，检查是否有`lo`的网口配置，如没有需要确认是否将这个配置裁剪了，可与`sdk`中默认内核配置对比确认
-   在线调试需严格根据应用或`sample`所跑的通路进行填写，不然会导致连接不上并加载参数失败，可通过`cat /sys/kernel/debug/mpp/vi`抓取节点确认

![TigerISP引导界面6](images/TigerISP引导界面6-4665edb3407cd2dcb131b14a25040f7e.png)

:::

:::

### TigerISP工具界面简介

| **名称** | **说明** |
| --- | --- |
| 加载参数 | 从PC本地选择一份ISP效果文件加载生效到板端 |
| 保存参数 | 将当前工具下的ISP效果文件保存到PC本地 |
| 抓取寄存器 | 抓取当前连接的sensor的寄存器配置 |
| 转换效果文件 | 进行效果文件的不同格式转换，如bin、h、dat |
| 图像标定 | 打开图像客观标定对应模块 |
| 实时预览 | 实时预览ISP处理后的YUV |
| 白平衡统计 | 预览白平衡统计的落点信息 |
| 编码预览 | 预览编码处理后的码流 |
| 编码锐化预览 | 预览编码锐化模块后的图像 |
| ISP日志 | 显示ISP各模块的debug信息，用于分析及调试 |

![TigerISP功能界面1](images/TigerISP功能界面1-978ff2b8c2a040c1d075d17b20aa2684.png)

![TigerISP功能界面2](images/TigerISP功能界面2-694383b12ebda6cde60a71bc41d99ae0.png)

### ISP log介绍及联动关系

#### 两种联动方式介绍

ISP 有两种不同的连动关系。  
ISP 的 2D 去噪、3D 去噪、色彩去噪、锐化、局部对比度、期望亮度、全局对比度、饱和度等参数都可以选择与环境亮度还是增益连动。在工具中调试这些参数时，可以看到这些参数都分成了 0~13，共 14个档位。

-   当选择与增益连动时 1 倍增益时使用第 0 档参数，  
    2 倍增益时使用第 1 档参数，  
    4 倍增益时使用第 2 档参数，  
    8 倍增益时使用第 3 档参数，  
    如 3 倍增益时，会使用第 1档与第2档参数进行线性插值，如此类推。  
    通过`ISP LOG`中的`TGAIN`的值可以得知当前处于什么增益下（`TGAIN` 的值以 256 为 1 倍）。
    
-   当选择与环境亮度连动时 系统会将 `AE Table` 分为 350 档，通过打印 `lum_idx` 的值来决定使用的档位  
    当 `lum_idx` 处于 0～25 之间时，使用第 0 档参数，  
    当 `lum_idx` 为 50 时，使用第 1 档参数，  
    当 `lum_idx` 为 75 时，使用第 2 档参数，  
    当 `lum_idx` 为 100 时，使用第 3 档参数，  
    如 `lum_idx` 为40时，会使用第 1档与第2档参数进行线性插值，如此类推。  
    通过`ISP LOG`中的`lum_idx`的值可以得知当前处于什么档位下。
    

![联动界面介绍](images/联动界面介绍-742f94df0f9d0c8508d793f86eabaafe.png)

#### ISP Log的打印方式介绍

如果想打印ISP Log，有以下方式可以实现

##### TigerISP调试工具

通过在线/离线连接上调试工具，点击`Extra Tools`中的`Log`，再点击`Dump`

![ISP\_LOG介绍](images/ISP_LOG介绍-7486735e72edc7f2bdd126102e7ff25b.png)

##### 修改效果参数打印等级

通过在线/离线连接上调试工具，修改效果文件里面的Log Param，打印会从串口或CMD界面输出。

![ISP\_Log介绍1](images/ISP_Log介绍1-70dc4e9cfc253adb5e6372f9d5496cfe.png)

如果不想连接调试工具，也可以在效果文件里面修改打印，打印会从串口打印出来。

![ISP\_Log介绍2](images/ISP_Log介绍2-74791fa49c020d003751eb30b2801551.png)

打印等级参考下述定义

```
#define ISP_LOG_AE				(1 << 0)	//0x1
#define ISP_LOG_AWB				(1 << 1)	//0x2
#define ISP_LOG_AF				(1 << 2)	//0x4
#define ISP_LOG_ISO				(1 << 3)	//0x8
#define ISP_LOG_GAMMA				(1 << 4)	//0x10
#define ISP_LOG_COLOR_MATRIX			(1 << 5)	//0x20
#define ISP_LOG_AFS				(1 << 6)	//0x40
#define ISP_LOG_MOTION_DETECT			(1 << 7)	//0x80
#define ISP_LOG_GAIN_OFFSET			(1 << 8)	//0x100
#define ISP_LOG_DEFOG				(1 << 9)	//0x200
#define ISP_LOG_LSC				(1 << 10)	//0x400
#define ISP_LOG_GTM				(1 << 11)	//0x800
#define ISP_LOG_PLTM				(1 << 12)	//0x1000
```

### ISP各模块简介及pipeline

| **名称** | **说明** |
| --- | --- |
| BLC | 提供 Sensor 相关黑电平矫正 |
| AFS | 自动曝光下，保持曝光在 10ms(50Hz)或 8.33ms(60Hz)的整数倍以达到防工频闪烁的效果 |
| AE | 硬件输出自动曝光的统计值信息，软件根据统计信息调节 Sensor 以实现自动曝光的功能 |
| AF | 硬件输出自动对焦的图像清晰度评价信息统计，软件根据统计信息调节 VCM(对焦马达)以实现自动对焦的功能 |
| WB | 硬件输出白平衡统计信息，软件根据统计信息调节 R/G/B 增益以实现自动白平衡的功能 |
| AWB | 软件自动白平衡算法开关 |
| Hist | 硬件输出直方图统计信息，软件用于辅助 AE、DRC 的计算 |
| WDR Split | Sensor 内部合成宽动态图像，将 Sensor 输出的较多的 bit 位宽数据拆分成较少 bit 位宽的数据，使拆分后的数据能被 ISP 处理 |
| WDR Stitch | 对 Sensor 输出的多帧合成为一帧宽动态图像 |
| DPC | 提供对静态坏点和动态坏点的检测和矫正功能 |
| CTC | 消除由于 Sensor 和镜头的 CRA 不匹配导致的 Cross Talk 噪声 |
| GCA | 全局色差矫正，用于矫正镜头引入的轴向色差与横向色差 |
| LCA | 局部色差矫正，用于矫正镜头引入的轴向色差与横向色差 |
| NRP | ISP 内部预 Gamma 模块，提高降噪、锐化性能 |
| D2D(Denoise) | 空域降噪 |
| D3D(TDNF) | 时域降噪，去除图像高斯噪声，使图像更平滑 |
| Dig-Gain | ISP 分通道的数字增益 |
| LSC、MSC | 用于镜头阴影矫正 |
| PLTM | 局部色调映射，可提升暗部动态范围 |
| CFA(Demosaic) | 将 Bayer 格式的 Raw 图像转化到 RGB 图像，优化 CFA 参数可减弱密集纹理区因去马赛克导致的摩尔纹现象。 |
| Sharpness | 图像锐化，提高图像清晰度 |
| CCM | 通过 3x3 的矩阵和矢量偏移量完成颜色空间的线性矫正 |
| CNR | 色彩降噪 |
| DRC | 硬件动态范围控制模块 |
| GTM | 全局色调映射软件算法 |
| Gamma | 分 R/G/B 三通道调整图像亮度 |
| CEM | 利用 9x17x17 大小的 3D LUT 实现颜色调整操作 |
| CSC | 通过标准的 3x3 的矩阵和矢量偏移量将输入的 RGB 图像转化为 YUV |
| Encpp | 编码器 Yuv Sharp |
| Enc 3Dnr | 编码器时域降噪 |
| Enc 2Dnr | 编码器空域降噪 |

![ISP\_PipeLine介绍](images/ISP_PipeLine介绍-5cea56c4fb549976a123c6e57f216cf9.png)

## 客观效果调试流程

### 图像调试需要完成哪些基础模块校准

客观校准是图像调试的基础，当sensor或镜头是第一次使用，需要完成客观校准后，才能得到一份初版效果，用于后续主观效果调试

| **名称** | **说明** |
| --- | --- |
| BLC | 黑电平校准，以确保图像的动态范围从真正的黑色开始 |
| AWB | 白平衡校准，以确保图像在不同光源下白色还原正常 |
| MSC/LSC | 均匀度校准，以确保图像使在整个视场中具有相同的亮度色度水平 |
| CCM | 色彩校准，以确保图像色彩的准确性 |
| D2D | 噪声校准，以确保ISP区分噪声及细节轮廓准确性 |

:::note

:::note

备注

:::
:::note

-   sensor第一次使用，需要将上述的所有校准项完成一轮校准
-   sensor保持不变，只更换了镜头，只需要重新校准`AWB、MSC/LSC、CCM`模块即可
-   校准顺序建议按照`BLC -> AWB -> MSC/LSC -> CCM -> D2D`进行
-   `MSC、LSC`都是用于亮度色度均匀性校准，通常情况下只需要选择其中一种完成校准即可

:::

:::

### BLC校准流程介绍

#### 原理简介

sensor输出数据中包含了`OB（optical black）`或`data pedestal`部分，需要去除，以免影响画面暗部表现。去除的方法是每个像素的`R、Gr、Gb、B`都减去一个值

#### 标定过程

1.使用镜头盖或其他工具遮黑sensor，确保sensor处于全黑的环境。  
2.离线连接上调试工具，并按照下面流程将`ISP`模块全部关闭并设置为手动曝光  
3.点击`ISP Test`，在`ByPass Setting`模块，点击`All Operation`中的`disable`，关闭所有ISP模块,点击`write`，使修改生效

![BLC标定流程1](images/BLC标定流程1-f5b582ffde5480f0696e5c675260e542.png)

4.点击`ISP Test`，在`Test Attr`模块,将`TestMode`设置为`Mannual Mode`，并修改`Exposure Line`为16（16代表一行曝光行）,将`Gain`修改为256（256代表一倍增益），点击`write`，使修改生效

![BLC标定流程2](images/BLC标定流程2-a44073bf19b6e0acee33ef6e13da49cd.png)

5.点击`Calibration`，再点击`BLC`按钮，跳出`BLC`标定界面后，修改预览格式为`BAYER`格式（请根据实际sensor输出的拜尔格式进行选择），点击`Dump`直到预览界面出现图像后点击`Stop`

![BLC标定流程3](images/BLC标定流程3-9a8acae8a7f9b865d500cfe75999a976.png)

6.在`BLC`标定界面，选择对应的`Gain`，如当前使用的`Gain`为256（以256为一倍增益），那么应该选择`Gain`为0；这里的`Gain`与1.5.5中介绍的联动策略的一致，0代表1倍增益，1代表2倍增益，2代表4倍增益  
7.点击`Calc`进行标定计算，计算完成后各通道均会得到一个`BLC`值。

![BLC标定流程4](images/BLC标定流程4-c32f62dbf7f6d877e5dc7fcd22f1b334.png)

8.重新回到第4个步骤，将`Gain`修改为512（二倍增益），再依次进行5~7的步骤  
9.按照上述步骤，依次完成各增益下的`BLC`校准，最后点击`Apply`将校准值写入生效

:::note

:::note

备注

:::
:::note

-   通常情况下，现在主流的CMOS sensor都是自己把`black level`处理好，然后加上一个`pedestal`，所以sensor设定的`black level`一般是准确的。因此可以与sensor原厂沟通确认`BLC`值需要设置为多少，如果sensor原厂确认的`BLC`值与`BLC`标定得到的`BLC`值差异较大，请与sensor原厂确认sensor配置。

:::

:::

### AWB校准流程介绍

#### 原理简介

人眼具有独特的适应性，在一定的色温范围内，人眼无法察觉白色物体偏色，而摄像头对白色的响应却随着环境色温变化而变化。这就需要有`AWB`（自动白平衡），使得摄像头拍摄的图像更接近人眼的视觉习惯。在实际操作中，是在不同色温下给予sensor输出值不同的`Rgain`与`Bgain`。而为了准确判断出当前的色温，需要事先标定出不同色温下的`RGB`响应特性

#### 标定过程

1.将设备放入灯箱中，让设备镜头对向灯箱壁

![AWB标定流程1](images/AWB标定流程1-fc09194d9bd2296d65a8b2573e244afe.jpg)

2.离线连接上调试工具，点击`ISP Test`，在`ByPass Setting`模块，点击`All Operation`中的`disable`后，将`BLC Enable`,关闭除`BLC`外的所有`ISP`模块,点击`write`，使修改生效

![AWB标定流程2](images/AWB标定流程2-df5cd686d30d183dc38bb708192363ad.png)

3.点击`Calibration`，再点击`WB`按钮，跳出`AWB`标定界面，打开灯箱并选择为`D65`光源  
4.点击`WB`标定界面的`Get Exp`（这个按钮会自动将亮度调整为合适校准的亮度），待亮度调整正常后，右击下面6500K的色温点，在弹出的界面点击`Calc`  
5.分别切换灯箱光源为`Tl84（4000K）、CWF（4200K）、A（2800K）、H（2200K）`，重复上面第四个步骤，完成上述几种光源的校准

![AWB标定流程3](images/AWB标定流程3-968f51159f5d0608ac839be88a0788a2.png)

6.在空白区域单击鼠标右键添加新的色温点，按照曲线分别添加`4800K、5500K`两个色温点，添加的色温点要基本符合曲线走向（如下图`AWB`标定流程6所示）

![AWB标定流程4](images/AWB标定流程4-1412a07c02e2610d15a176624ea3b556.png)

![AWB标定流程5](images/AWB标定流程5-2ca99d8e8f0f7c0cf7ea823a1c6b61c4.png)

![AWB标定流程6](images/AWB标定流程6-11efec5a515360a36acf81d13cd3d492.png)

7.点击`Apply`将校准值写入生效

:::note

:::note

备注

:::
:::note

-   如灯箱有5000K、7500K的标准光源，建议按照标准光源做校准，不需要手动添加
-   标定完白平衡如何确认标定的准确性及如何做微调？
-   1.校准完白平衡后，将`AE、AWB、WB、NRP、BLC`打开
-   2.点击`Extra Tools`，再点击`3A Stat`按钮，跳出`3A Stat`界面，点击`Dump`
-   3.分别确认`D65、Tl84、CWF、A、H`光源下的落点是否落入标定的光源框内并基本在五角星区域，如有少许偏差，可手动微调光源框到落点聚集的区域

![AWB校验界面](images/AWB校验界面-93e818b64f55a13f41c19d396dca03cc.png)

:::

:::

### MSC校准流程介绍

#### 原理简介

光通过镜头后，光强分布近似与光线角度的余弦的4次方成正比，画面中央比四周要亮（Lens shading）。其次，`IR filter`对不同入射角度的光，截止频率不一样，画面中央与四周在色彩上也会不一致（Color shading）。`ISP`的`LSC`和`MSC`模块是根据像素在图像中所处的位置，给予相应的增益。`LSC`模块增益与像素离图像中心的距离有关，所以补偿增益呈同心圆分布。MSC模块增益受矩阵分配，可用于`shading`不中心对称的场景

#### 标定过程

1.将设备放入灯箱中，将设备镜头盖上毛玻璃。

![MSC标定流程1](images/MSC标定流程1-8ac6d0c5e611a6762609117c1079c26b.jpg)

2.离线连接上调试工具，点击`ISP Test`，在`ByPass Setting`模块，点击`All Operation`中的`disable`后，将`BLC Enable`,关闭除`BLC`外的所有`ISP`模块,点击`write`，使修改生效

![MSC标定流程2](images/MSC标定流程2-df5cd686d30d183dc38bb708192363ad.png)

3.点击`Calibration`，再点击`MSC`按钮，跳出`MSC`标定界面，打开灯箱并选择为H光源(2800K)  
4.点击`Clean All`，清除旧的`MSC`参数  
5.选择`Temperature`为2200,点击`Get Exp`，（这个按钮会自动将亮度调整为合适校准的亮度），待亮度调整正常后，点击`Calc`，完成该光源的校准，然后将`VCM`改成`Max Code`后，再点击一次`Calc`

![MSC标定流程3](images/MSC标定流程3-5aa5de73984a4b8c9237dd0bc69a81fb.png)

6.分别切换灯箱光源为`Tl84（4000K）、D65（6500K）`，重复上面第五个步骤，完成上述几种光源的校准后，点击`Apply`将校准值写入生效

:::note

:::note

备注

:::
:::note

-   `MSC`校准必须在sensor输出原始分辨率上进行
-   由于V线大部分产品均为定焦，因此`VCM`的`Min/Max Code`使用同一组图片标定即可，如果是变焦产品，VCM需要分别校准
-   建议2200K与2800K使用A光源进行校准，4000K-5500K使用Tl84光源进行校准，5500K-6500K使用D65光源进行校准
-   如校准的强度不够或太强，可通过调整`Compensation`的值修改校准强度
-   `LSC、MSC`都是用于做画面均匀度补偿，`LSC`是以画面中心做同心圆补偿，`MSC`是将画面分块进行补偿，一般只需要使用其中一种补偿方式即可。

:::

:::

### LSC校准流程介绍

#### 原理简介

光通过镜头后，光强分布近似与光线角度的余弦的4次方成正比，画面中央比四周要亮（`Lens shading`）。其次，`IR filter`对不同入射角度的光，截止频率不一样，画面中央与四周在色彩上也会不一致（`Color shading`）。`ISP`的`LSC`和`MSC`模块是根据像素在图像中所处的位置，给予相应的增益。`LSC`模块增益与像素离图像中心的距离有关，所以补偿增益呈同心圆分布。`MSC`模块增益受矩阵分配，可用于`shading`不中心对称的场景

#### 标定过程

1.将设备放入灯箱中，将设备镜头盖上毛玻璃。

![LSC标定流程1](images/LSC标定流程1-8ac6d0c5e611a6762609117c1079c26b.jpg)

2.离线连接上调试工具，点击`ISP Test`，在`ByPass Setting`模块，点击`All Operation`中的`disable`后，将`BLC Enable`,关闭除`BLC`外的所有`ISP`模块,点击`write`，使修改生效

![LSC标定流程2](images/LSC标定流程2-df5cd686d30d183dc38bb708192363ad.png)

3.点击`Calibration`，再点击`LSC`按钮，跳出`LSC`标定界面，打开灯箱并选择为H光源(2800K)  
4.点击`Clean All`，清除旧的`LSC`参数  
5.选择`Temperature`为2200,点击`Get Exp`，（这个按钮会自动将亮度调整为合适校准的亮度），待亮度调整正常后，点击`Calc`，完成该光源的校准，然后将`VCM`改成`Max Code`后，再点击一次`Calc`

![LSC标定流程3](images/LSC标定流程3-44a193eb6aaca0099a867b8b97fe8725.png)

6.分别切换灯箱光源为`Tl84（4000K）、D65（6500K）`，重复上面第五个步骤，完成上述几种光源的校准后，点击`Apply`将校准值写入生效

:::note

:::note

备注

:::
:::note

-   `LSC`校准必须在sensor输出原始分辨率上进行
-   由于V线大部分产品均为定焦，因此`VCM`的`Min/Max Code`使用同一组图片标定即可，如果是变焦产品，`VCM`需要分别校准
-   建议2200K与2800K使用A光源进行校准，4000K-5500K使用Tl84光源进行校准，5500K-6500K使用D65光源进行校准
-   如校准的强度不够或太强，可通过调整`Compensation`的值修改校准强度
-   `LSC、MSC`都是用于做画面均匀度补偿，`LSC`是以画面中心做同心圆补偿，`MSC`是将画面分块进行补偿，一般只需要使用其中一种补偿方式即可。

:::

:::

### CCM校准流程介绍

#### 原理简介

sensor对`RGB`的响应与人眼对`RGB`的响应并不一致，通过本项调试，可将sensor对`RGB`的响应调到与人眼接近，实现准确的色彩还原。在实际操作中，是将sensor输出的色彩空间通过一个色彩矩阵转化到`sRGB`色彩空间。

#### 标定过程

1.将设备放入灯箱中，让设备镜头对向24色色卡，保证色卡占据画面大小 3/4 左右。  
2.离线连接上调试工具，点击`ISP Test`，在`ByPass Setting`模块，点击`All Operation`中的`disable`后，将`BLC、AWB、WB、NRP、MSC/LSC Enable`，点击`write`，使修改生效

![CCM标定流程2](images/CCM标定流程2-cbec3b7279f90615c1cefdd49cb560cd.png)

3.点击`Calibration`，再点击`CCM`按钮，跳出`CCM`标定界面，打开灯箱并选择为`D65`光源(6500K)，点击`Dump`预览到画面后`Stop`，右击鼠标将24色色卡框选上，点击`Mark As`，再点击`All 24 Blocks`，会进行24色块的标记。

![CCM标定流程3](images/CCM标定流程3-c1cc7458f5358a1e27329c4e5693d7a9.png)

4.调整24个框的位置及大小，使其能完整落在24色色卡的每个色块上面  
5.选择`Temperature`为6500，将`Use Gamma`设置为`True`，`Gamma File`选择`TigerISP`文件夹中的`\data\gamma_sample.txt`  
6.将`Use RGB Ref.`设置为`True`，`RGB File`选择`TigerISP`文件夹中的`\data\rgb_ref_nrp_*.txt`，其中\*的数字选的越大，校准出来的色彩饱和度越高，建议`D65、Tl84`光源选择`rgb_ref_nrp_90.txt`，A光源选择`rgb_ref_nrp_80.txt`  
7.点击`Get Exp`，（这个按钮会自动将亮度调整为合适校准的亮度），待亮度调整正常后，点击`Calc`，完成该光源的校准

![CCM标定流程4](images/CCM标定流程4-05ec30317bd946f4ca620c5979138ab0.png)

8.分别切换灯箱光源为`Tl84（4000K）、A（2800K）`，重复上面第五~第七步骤，完成上述几种光源的校准后，点击`Apply`将校准值写入生效

:::note

:::note

备注

:::
:::note

-   校准时标记24色色卡，必须确保每个框落入对应的色块，不能落出去或者出现一个框框住两个色块的情况

:::

:::

### D2D校准流程介绍

#### 原理简介

由于不同Sensor的噪声水平差异，在不同增益下通过标定，可以更好的区分噪声及细节边缘。

#### 标定过程

##### D2D

1.将设备放入灯箱中，让设备镜头对向灰阶卡，保证灰阶卡占据画面大小 3/4 左右。

![D2D标定流程1](images/D2D标定流程1-ebce852947f6b92a27358055146990ee.jpg)

2.离线连接上调试工具，点击`ISP Test`，在`ByPass Setting`模块，点击`All Operation`中的`disable`后，将`BLC、AWB、WB、NRP、DGain Enable`，点击`write`，使修改生效

![D2D标定流程2](images/D2D标定流程2-eae5c313b0a79f13368fcce82ac1d06d.png)

3.点击`Calibration`，再点击`D2D`按钮，跳出`D2D`标定界面，打开灯箱并选择为`D65`光源(6500K)，将需要标定的档位勾选上（建议勾选0~7即可，其中 0 代表 1倍增益，1 代表 2 倍增益，2 代表 4 倍增益，以此类推），将`Mode`设置为`D2D`，点击`Dump`预览到画面后`Stop`，手动调整曝光行数 `Exposure Line`，使得在一倍增益下灰阶最亮灰块的亮度`Y`达到 220左右。  
4.右击鼠标将灰阶卡最亮灰块选上，点击`Mark As`，再点击`Gray Block 0`，将第一个灰块标记上，依次勾选其他灰块并做好标记。

![D2D标定流程3](images/D2D标定流程3-3962d2fa7ddb909289477688886b7a52.png)

![D2D标定流程4](images/D2D标定流程4-6723a2236197b7b090aad6032e0c37a1.png)

5.点击`calc`，完成各档位下的`D2D`标定  
6.标定结束后，在 `ISP Test->ByPass Setting` 点击`Read Pane`，`Denoise` 模块和 `CNR` 模块（两者都为 `D2D` 降噪模块）会自动打开

![D2D标定流程5](images/D2D标定流程5-34b1ee0e96bb4a1ea2262cb53044b78f.png)

7.在 `BDNF` 点击`Read`，`D2D` 降噪曲线会发生变化，点击`Apply`同步数据

![D2D标定流程6](images/D2D标定流程6-c223a9bd5477ff35efb0e898b49deab4.png)

8.在 `Dynamic Tuning->Denoise` 点击`Read Pane`，`Denoise` 参数发生变化，点击`Write Pane`同步数据

9.最后在 `Start` 菜单栏点击`Save dat File`备份 `D2D` 标定后的`dat` 文件

![D2D标定流程7](images/D2D标定流程7-142bfecfb2fb89f28316c51d9af967a7.png)

##### D3D

1.将设备放入灯箱中，让设备镜头对向灰阶卡，保证灰阶卡占据画面大小 3/4 左右。

![D3D标定流程1](images/D3D标定流程1-ebce852947f6b92a27358055146990ee.jpg)

2.离线连接上调试工具，点击`ISP Test`，在`ByPass Setting`模块，点击`All Operation`中的`disable`后，将`BLC、AWB、WB、NRP、DGain Enable`，点击`write`，使修改生效

![D3D标定流程2](images/D3D标定流程2-eae5c313b0a79f13368fcce82ac1d06d.png)

3.点击`Calibration`，再点击`D2D`按钮，跳出`D2D`标定界面，打开灯箱并选择为`D65`光源(6500K)，将需要标定的档位勾选上（建议勾选0~7即可，其中 0 代表 1倍增益，1 代表 2 倍增益，2 代表 4 倍增益，以此类推），将`Mode`设置为`D3D`，点击`Dump`预览到画面后`Stop`，手动调整曝光行数 `Exposure Line`，使得在一倍增益下灰阶卡最亮灰块的亮度 `Y` 达到 220左右。

4.右击鼠标将灰阶卡最亮灰块选上，点击`Mark As`，再点击`Gray Block 0`，将第一个灰块标记上，注意接下来需要框选最亮灰块和次亮灰块的边界并标记为 1，之后以此类推依次框选灰块边界，最后框选灰阶卡最暗色块。注意框选灰块边界时要保证灰块边界位于中间，即两边不同灰块面积基本相等。

![D3D标定流程3](images/D3D标定流程3-5a589809db66f9c97be51814df7a9641.png)

5.点击`calc`，完成各档位下的`D3D`标定

6.标定结束后，在 `ISP Test->ByPass Setting` 点击`Read Pane`，`TDNF` 模块会自动打开

![D3D标定流程4](images/D3D标定流程4-88ee0e250d78f82a9d58480654a6f26e.png)

7.在 `TDNF` 点击`Read`，`D3D` 降噪曲线会发生变化，点击`Apply`同步数据

![D3D标定流程5](images/D3D标定流程5-14bde1964d181c9abc392eea4b3c5da4.png)

8.在 `Dynamic Tuning->TDNF` 点击`Read Pane`，`TDNF` 参数发生变化，点击`Write Pane`同步数据

9.最后在 `Start` 菜单栏点击`Save dat File`备份 `D3D` 标定后的`dat` 文件

![D3D标定流程6](images/D3D标定流程6-05b703d7ca332f0576b021cf340c3a16.png)

:::note

:::note

备注

:::
:::note

-   新sensor需要进行`D2D`校准，如果是旧sensor只更换了镜头，那么不需要重新进行`D2D`校准
-   `D2D`校准时标记灰阶时，必须确保每个框落入对应的灰阶，不能落出去或者出现一个框框住两个灰阶的情况；`D3D`校准时，注意框选时要保证灰块边界位于中间，即两边不同灰块面积基本相等
-   需确保标记的`Block0`为灰阶卡最亮灰块
-   `D2D、D3D`校准耗时较长，请确保电脑电量充足，避免标定失败

:::

:::

## 主观效果调试流程

### 整体调图思路介绍

-   进行主观效果调试前，确保已完成客观效果调试；如使用的sensor没有参考的效果文件，可使用同sensor原厂的效果配置作为初版效果
-   图像效果调试应基本遵循亮度->对比度->色彩->清晰度的调试顺序，调试场景应包含白天户外、室内、低照度等多种场景，确保覆盖所有照度场景
-   亮度是图像效果的基础，当增益一定的情况下，曝光时间越长，能使得sensor接收到更多细节，但曝光时间变长，同时也容易导致运动拖影、亮区过曝等副作用，因此曝光调试应尽量对齐竞品，对比度在一定程度上会影响亮度调试时的判断，因此建议调试亮度时可以先关闭对比度模块将过曝区域调到与竞品对齐
-   对比度影响整体图像感官并在一定程度上会影响细节清晰度，适度调节对比度使图像动态范围更佳，并能提升细节的局部对比度。
-   色彩分为白平衡和颜色，白平衡作用于全局，从效果上是整体图像偏色，而颜色作用于局部，从效果上是某种颜色与真实颜色的偏差。两者搭配使用，能让色彩表现更佳。
-   清晰度分为去噪和锐化，如果噪声抹除过多，会导致细节在后期的锐化无法凸显出来，如果锐化强度过低，也会导致图像经过编码以后无法展现出来，因此当遇到清晰度问题时，先需要确认是哪里导致的问题，才能从根源解决。

:::note

:::note

备注

:::
:::note

-   推荐使用在线调试，能确保调试效果与应用最终展示效果一致

:::

:::

### 曝光基础调试思路介绍

#### 模块参数介绍

与曝光相关的模块如下

![AE参数介绍1](images/AE参数介绍1-b734d0d2be9366e268f4620503265a1a.png)

![AE参数介绍2](images/AE参数介绍2-61db46088c3aaa34a0ee021a16ed8217.png)

#### 调试思路介绍

##### 如何提高或降低亮度值

**Step1**：调试`AE`前，先确定好曝光表

曝光表代表了`ISP`的曝光索引，记录了最小曝光最小增益到最大曝光最大增益的索引值，`AE`根据当前场景计算出当前曝光增益下的亮度值与我们的预期亮度进行对比，如果偏暗，就向上索引曝光表，提高曝光增益，如果偏亮，就向下索引曝光表，降低曝光增益

| **名称** | **说明** |
| --- | --- |
| Min Exp | 代表当前行的最小曝光值，22000代表1/22000秒 |
| Max Exp | 代表当前行的最大曝光值，20代表1/20秒 |
| Min Gain | 代表当前行的最小增益值，256代表1倍增益 |
| Max Gain | 代表当前行的最大增益值 |

![AE参数介绍3](images/AE参数介绍3-65b213d5669acc2c4304713b1e38101d.png)

下面举例说明：\\

-   按照上图的曝光表，如果当前画面曝光值处于1/30秒，1倍增益的情况下，画面亮度偏暗\\
-   这个时候`AE`会按照第一行索引，继续提高曝光直到1/20秒，1倍增益，如果这时候的画面仍然偏暗\\
-   `AE`就开始转到第二行，开始提高增益值，当提升到1/20秒，5倍增益（1280）后，画面亮度与期望亮度一致\\

**Step2**: 调整`Dynamic Tuning`中的`AE`，`AE`通常是根据`Lum`联动，先根据当前环境下的日志确认当前跑的`Lum idx`，如下图所示，打开`log`，`lum_idx`为177（6.08X），对应`Dynamic Tuning`中的`AE`中的第6~7档参数

![AE参数介绍4](images/AE参数介绍4-fc450e2a58f514b401449bbc8421b8ee.png)

**Step3**: 如果希望将亮度降低，降低对应档位的`Target`值

![AE参数介绍5](images/AE参数介绍5-d7a7e8457e415bdba9eb03c02019e6af.png)

![AE参数修改示例1](images/AE参数修改示例1-67f34f660bfebd60b0fdff981a61142d.png)

##### 如何优化暗部偏暗死黑

**Step1**：先关闭`GTM、DRC`这两个对比度相关模块，确认是否这里导致的暗部偏暗，如果排查是这里导致，那么参考下一章对比度模块继续调试优化  
**Step2**：与对比机对比过曝区域，如果我们的过曝区域比对比机的大，那么可以适当降低对应档位的`Target`值  
**Step3**：如果暗部仍然不够亮，可以适当提高`PLTM`强度来提高暗部亮度解决，请参考下一章对比度模块继续调试优化

##### 如何排查亮度闪烁问题

**Step1**：先关闭`GTM、DRC、PLTM`这三个对比度相关模块，确认是否还有闪烁，如果没有闪烁，请联系FAE确认  
**Step2**：关闭`AE`改成手动曝光，确认是否还存在闪烁  
**Step3**：如果确认是`AE`模块导致闪烁，可先通过调整`Frames Delay`尝试改善，找Sensor原厂确认曝光增益的延迟生效帧数，并填写进去  
**Step4**：调整`Dynamic Tuning`中的`AE` 对应档位的`Speed、Tolerance`，使得收敛速度变慢，`AE`容忍度变高  
**Step5**：检查曝光表是否有问题，`AE target`设置是否平滑  
**Step6**：检查 `Sensor` 驱动的 `HTS、VTS 和 PCLK` 的值是否正确  
**Step7**：检查曝光函数是否使用 Sensor 的 `group hold/group write` 功能。如果 Sensor 支持，一定要使用

:::note

:::note

备注

:::
:::note

-   曝光表设置务必要准守每行只调整曝光或增益的其中一个，且上一行的曝光增益最大值是下一行的曝光增益最小值
-   调试`AE target`值后无变化，可以将`AE`重新开关，使`AE`能正常收敛到最佳状态

:::

:::

### 对比度基础调试思路介绍

#### 模块参数介绍

与对比度相关的模块如下

![GTM参数介绍1](images/GTM参数介绍1-1920de5d5439d0fb956651cd2bb6c671.png)

![GTM参数介绍2](images/GTM参数介绍2-c405ec85302fa3ecccd86a378436a643.png)

![Pltm参数介绍1](images/Pltm参数介绍1-12de540e061315c5d85f6f9717940eeb.png)

![Pltm参数介绍2](images/Pltm参数介绍2-57a559605c3246cb4eb4d48a5c29fec3.png)

#### 调试思路介绍

##### 如何提高画面对比度

以`GTM Type 5` 为例，

**Step1**：关闭PLTM，确认是否`PLTM`强度太大导致画面对比度不够，如果是`PLTM`导致，那么可以适当降低`PLTM`强度  
**Step2**：如果不是`PLTM`影响，将`Dynamic Tuning`中的`GTM`对应档位的`Gain、EQ Ratio`值写大，可提升画面对比度

![修改对比度示例1](images/修改对比度示例1-db28834630464a276e9c6de7dcd5f416.png)

![修改对比度示例2](images/修改对比度示例2-7c17452da1d9ac22cecc93135a4315c4.png)

**Step3**：如果认为`GTM`将亮度上拉导致部分区域过曝，可以降低`Black、White`，使亮部上拉强度降低

![修改对比度示例3](images/修改对比度示例3-97ed313b80f8b5fe35b0fbbebe9008ab.png)

![修改对比度示例4](images/修改对比度示例4-cc6dfcbfbb005e14c799280e2bfdcf3e.png)

##### 如何提升暗部亮度

**Step1**：关闭`GTM、DRC`模块，确认是否`GTM`模块将暗部压暗  
**Step2**：与对比机对比过曝区域，如果对比机的过曝区域比我们的大，那么可以适当提高对应档位的`AE Target`值，提高曝光增益  
**Step3**：如果确认上述原因无法改善暗部亮度，先通过`Log`确认当前环境下的`Pltm`强度，如果当前`Pltm`强度小于`Max Stren Clip`，那么可以通过提高`Auto Stren`来提高暗部亮度

![修改对比度示例5](images/修改对比度示例5-75318525326397a1ce351ea9c73ba66f.png)

![修改对比度示例6](images/修改对比度示例6-fff7051b5055c04f683826904d4d9c23.png)

![修改对比度示例7](images/修改对比度示例7-aada7bc55107e78673a2a3acc1e15eee.png)

**Step4**：如果当前的`Pltm`强度等于`Max Stren Clip`,那么需要将`Max Stren Clip`提高来放开对`PLTM`强度的限制

![修改对比度示例8](images/修改对比度示例8-507d29c1d13bd723b3ada4b096935288.png)

:::note

:::note

备注

:::
:::note

-   `GTM Type`建议设置为4/5，其余的不建议使用，设置为4的话，需要占用一路`Vipp`节点
-   `pltm`强度不建议开太强，画面提亮太多易导致噪声偏大，画面对比度变低

:::

:::

### 色彩基础调试思路介绍

#### 模块参数介绍

与颜色相关的模块如下：

`AWB`为白平衡模块，作用于全局，主要作用是让白色还原为白色

![awb参数介绍1](images/awb参数介绍1-c3b39fb66b5b707bc5f3aa91af03c431.png)

![awb参数介绍2](images/awb参数介绍2-c23535c303886c200bb4b51814306935.png)

`CEM`为颜色模块，作用于`HSV`，可单独修改某个颜色的色调、饱和度、亮度，通常可用于提高绿植饱和度、降低人像肤色饱和度等

![cem参数介绍1](images/Cem参数介绍1-744c21c34d187a79f0b6562f6d3d84c4.png)

![cem参数介绍2](images/Cem参数介绍2-dac5cc3aa932131ebf07869454518e49.png)

![cem参数介绍3](images/Cem参数介绍3-45600bd53a6a20e955a792818b81bc08.png)

![cem参数介绍4](images/Cem参数介绍4-de9052d5e32ef7c6e0d96556f0e17036.png)

#### 调试思路介绍

##### 如何排查偏色问题

**Step1**：确保当前镜头搭配Sensor已完成`AWB`标定，`Dynamic Tuning`中的`AWB`模块参数正常，建议按照256设置，待白平衡正常后再调整偏好色。  
**Step2**：打开`log`，检查`awb log`是否正常，如下图`Outlier Light num`为339，说明有339个落点块未被统计到

![色彩调试示例1](images/色彩调试示例1-d41f406d1d0fe3a120d5b43f9ae84505.png)

**Step3**：打开`3A Stat`后，点击`dump`，检查当前场景的落点信息

![色彩调试示例2](images/色彩调试示例2-71e9ceeb672648a8d24b7f4a44ec86d0.png)

**Step4**：如落点基本未落入光源框中，需要手动移动光源框到大部分落点所在区域（或新增光源框框柱对应落点）

![色彩调试示例3](images/色彩调试示例3-4d91020b844eae7192ec2f0190443668.png)

![色彩调试示例4](images/色彩调试示例4-1f0422cedeaf8020108c63f8b307451b.png)

**Step5**：如果落点基本能落入光源框中，仍然有偏色现象，关闭`MSC/LSC`模块，确认是否`MSC/LSC`模块对各通道的补偿差异导致色彩异常，如是，请重新校准`MSC`

**Step6**：关闭`CEM`模块，确认`CEM`曲线是否对低饱和度提升过大导致色彩异常，如关闭`CEM`后，整体色彩基本正常但整体饱和度偏低

**Step7**：按照下图方式调整`CEM`曲线解决，如果是刚开始调试，`CEM`曲线建议先`Reset All`并在修改后`Save`曲线（曲线不一定完全按照下图设置，需根据实际场景在合适的位置做饱和度下拉）

![色彩调试示例6](images/色彩调试示例5-173de7c8e697618e686dd161997670d1.png)

![色彩调试示例7](images/色彩调试示例6-72469355a97483ba51cbe56eeb94dc6b.png)

##### 如何提升整体饱和度

**Step1**：调整`Dynamic Tuning`中的`CEM`，将对应档位的参数提高，即可提高整体饱和度

![饱和度调试示例1](images/饱和度调试示例1-867b9dc473b12850891b5c72aa712a40.png)

![饱和度调试示例2](images/饱和度调试示例2-6cc3082abec1c473b4be20731534c9cc.png)

##### 如何提升绿色饱和度

**Step1**：确认整体饱和度是否与竞品接近，如果整理饱和度偏低，可以先提高`Dynamic Tuning`中的`CEM`的饱和度值  
**Step2**：如果只是绿色饱和度偏低，可通过调整`CEM`曲线来优化，如果是刚开始调试，`CEM`曲线建议先`Reset All`并在修改后`Save`曲线

![饱和度调试示例3](images/饱和度调试示例3-ac0103dee39e259204de4b0d1dfe633a.png)

![饱和度调试示例4](images/饱和度调试示例4-49e02615b26e77e52c95abe7c88c6c33.png)

##### 如何优化肤色问题

在初步完成标定及主观调试后，由于CCM并无法将每种色彩完全还原准确，这些差异经过了CEM色彩增强后，会比较明显，比如肤色。  
肤色会存在的问题主要有肤色过重（饱和度偏高）、肤色偏红、肤色偏黄绿等，针对此类问题，可参考下面优化步骤进行修改。

**Step1**：与竞品对齐肤色饱和度，如果整体饱和度偏高，先降低`Dynamic Tuning`中的`CEM`的饱和度值，如果降低后肤色仍然偏重，通过调整cem曲线来改善

**Step2**：人脸饱和度大致可按照下图曲线进行设置，如果肤色饱和度偏低，那么中间这条曲线可往回拉

![人脸调试示例1](images/人脸调试示例1-7237495c7f03f991c99c72756201f1ea.png)

**Step3**：修改完人脸饱和度后，如果人脸有偏黄绿的问题，可调整肤色色调，使其往红色方向偏移

![人脸调试示例2](images/人脸调试示例2-0fff3b24f8b5e4aff8b8ddb348b23da5.png)

##### 如何优化暗部偏色

**Step1**：关闭`PLTM`模块，检查目标区域是否有明显偏色，如果并非`PLTM`拉亮导致暗部偏色，那么建议可以通过`CEM`模块，降低暗部饱和度的方式进行抑制

![暗部偏色示例1](images/暗部偏色示例1-566b937809c2fa26dcf2bc99b8fbf98a.png)

**Step2**：`PLTM`拉升暗部亮度时，同时也会放大暗部的色噪，如果确认是`PLTM`导致，先关闭`PLTM`后，检查暗部区域亮度均值，估算`DSC`的亮度阈值范围，如本图的暗部亮度均值为28（8bit）  
**Step3**：由于`DSC`亮度范围为12bit，所以换算后亮度值为28\*16=448，那么可以将亮度阈值定在448左右，调试时适当偏移  
**Step4**：将亮度的低阈值定在466，那么图像中亮度小于466的区域暗部饱和度抑制程度最大，处于466-768范围内抑制程度逐渐衰减，大于768的区域不受抑制，并适当调整`Ratio`直到调整前后抑制效果明显，可以较好地改善偏色现象

![暗部偏色示例2](images/暗部偏色示例2-f7685fb915c3ae450aedc5ea65a61147.png)

![暗部偏色示例3](images/暗部偏色示例3-44592a4a7d734c7bd41d061d28d9ef2b.png)

##### 如何修改白平衡统计窗口大小

针对行车类产品或户外摄像头设备，可能会存在上半部分蓝天区域被误纳入白平衡统计，导致白平衡异常，画面偏黄，针对此类问题，可以通过修改白平衡统计窗口大小，将白平衡统计改为只统计下半部分图像来优化此类问题  
统计窗口是将全图坐标归一化到\[-1000,1000\]，那么如果想让awb只计算画面的下半部分，可以这样修改，使白平衡只针对画面下半部分计算。

```
isp_gen->awb_settings.awb_coor.y1 = 0;
```

![修改白平衡统计窗口示例1](images/修改白平衡统计窗口示例1-04e3e025f1003b7865c17406eb7d8299.png)

![修改白平衡统计窗口示例2](data:image/png;base64,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F8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCF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)

##### 如何优化混淆色

为什么会出现白平衡混淆色？  
由于当前主流的白平衡算法都是使用灰块统计的方式，有部分特殊场景（如蓝天、肤色、绿植、黄土地等），容易被判断为灰块进行收白，从而导致白平衡异常  
通常混淆色会导致的颜色异常包含有：  
蓝天 - 大面积蓝天会被判定为高色温，导致蓝天收白，导致白平衡严重偏黄  
肤色 - 大面积肤色会被判定为中色温，在室内正常日光灯下会导致轻微偏蓝  
绿植 - 大面积绿植如果落入统计框，会导致白平衡偏紫  
黄土地 - 大面积黄土地会被判定为低色温，导致图像偏蓝

如何优化白平衡混淆色？  
**Step1**：降低对应光源框的range，通常混淆色与我们标定的色温标准落点会有一定偏差，降低range，可以一定程度上将这些混淆色剔除，避免纳入白平衡收白的落点中  
**Step2**：如果是大面积绿植导致偏色，还可以通过调整Green Zone来优化，此值越小，绿植对白平衡的影响会降低，但如果白平衡标定数据不够准确或此值写的太小，可能会导致图像偏绿。

![白平衡混淆色调试1](images/白平衡混淆色调试1-a7c5f7972d62bfd17190fe216040341d.png)

**Step3**：除上述的修改方案外，如果检查awb落点落入了多个色温下，可以将混淆色对应的色温的权重写小，来减小混淆色对整体白平衡的影响  
**Step4**：如果是大面积蓝天场景导致偏色，还可以修改白平衡统计窗口，将白平衡统计改为只统计下半部分图像来优化

:::note

:::note

备注

:::
:::note

-   `CEM`曲线修改后请保存曲线，避免后面关闭工具后加载参数无法查看
-   `CEM`曲线修改要相对平滑，避免色彩过渡不均匀

:::

:::

### 清晰度基础调试思路介绍

#### 模块参数介绍

与清晰度相关的模块如下：

##### 去噪参数介绍

`DPC`模块用于去除sensor坏点，去坏点强度太强容易影响清晰度，需要均衡调试

![DPC参数介绍](images/DPC参数介绍-46f5afc91e9fc21a9bc2b2763aea2dbb.png)

`Denoise`模块作用于空域去噪，强度过大易导致清晰度变差

![Denoise参数介绍1](images/Denoise参数介绍1-d6719cdf45ea22db6423db0aaa917200.png)

![Denoise参数介绍2](images/Denoise参数介绍2-3de2e20a865d6e8649fa11f34f00568d.png)

`TDNF`模块作用于时域去噪，强度过大易导致拖影问题

![TDNF参数介绍1](images/TDNF参数介绍1-6c066844de51821492e26617b2f018e7.png)

![TDNF参数介绍2](images/TDNF参数介绍2-0da805fa92a91e84985dd70360846c93.png)

![TDNF参数介绍3](images/TDNF参数介绍3-5a8b35b835747cd76006cc9a83c0fe86.png)

##### 锐化参数介绍

`Sharpness`模块用于提升图像锐化强度，增强细节体现，锐化阈值及强度需要把控好，避免黑白边过强或锐出噪声等问题(`Encpp-Sharp`参数与`Sharpness`基本一致，建议两级锐化都需要打开使用)

![Sharp参数介绍1](images/Sharp参数介绍1-76ceada1d352abad75f196aa9cf92e95.png)

![Sharp参数介绍2](images/Sharp参数介绍2-b0a3b8b55aa6886a2db76722c1cccaac.png)

![Sharp参数介绍3](images/Sharp参数介绍3-5139c2711de63d71b06900f5de1ca399.png)

![Sharp参数介绍4](images/Sharp参数介绍4-d7bbd83f4694768615dedef595bb8b38.png)

:::note

:::note

备注

:::
:::note

-   V821的`D2D`模块 `LYR3 DNR YRatio`不需要进行调试

:::

:::

#### 调试思路介绍

##### 如何提升图像清晰度

**Step1**：由于`IPC、CDR`等编码产品，画质效果与编码有紧密的关系，在调试清晰度前，需要对比竞品将编码配置调整好，如码率、QP等，如果对清晰度要求较高，建议关闭编码2D、3D模块（通过应用接口设置）  
**Step2**：确认好机器对焦准确，没有明显虚焦，如果存在虚焦，需要确认镜头底座与板子之间是否存在缝隙，尝试更换镜头或扭紧螺丝  
**Step3**：分别关闭`Denoise、DPC`模块，确认是否去坏点强度过大或`D2D`强度过大导致细节损失（关闭后建议开关一下`TDNF`，使得画面细节重新收敛）  
**Step4**：如果关闭后，细节有明显提升，可降低对应档位`DPC`去坏点强度，直到开始出现坏点，再降低`D2D`强度，直到运动区域开始出现明显噪声

![清晰度调试示例1](images/清晰度调试示例1-6afb1f6c399d9f859b81e23883966292.png)

**Step5**：如果排除去噪模块影响，可通过两级锐化来提高清晰度

![清晰度调试示例2](images/清晰度调试示例2-3a5881d31579f98320099a2f8d013508.png)

![清晰度调试示例3](images/清晰度调试示例3-3578ca4087cde9654a2fc5c90bc5856b.png)

![清晰度调试示例2](images/清晰度调试示例4-90b5c0ac8c08adef845791efbeb5ad2e.png)

##### 如何去除噪声

**Step1**：如需要去除运动噪声，比如手臂挥动、人像走动出现的噪声，通过提高`Denoise`去噪强度解决  
**Step2**：如画面中存在跳动噪声，需要提高`TDNF`去噪强度解决  
**Step3**：如果画面中存在坏点，可通过`DPC`模块去除  
**Step4**：如果静止画面存在噪声，需要依次排除是哪个模块引入噪声，先关闭`Sharpness、Encpp`确认是否锐化引入噪声，如是，那么需要通过调整锐化阈值，避免低频噪声被锐化出来  
**Step5**：如果不是锐化出来的噪声，可关闭`PLTM、GTM`模块等确认是否其他亮度增益模块拉出噪声  
**Step6**：低照度环境下，通过降低亮度可以减少噪声出现

##### 如何优化拖影问题

**Step1**：连接调试工具，关闭`TDNF`模块，如果拖影消失，说明拖影为ISP引入。关闭TDNF会导致画面噪声闪烁，为正常现象  
**Step2**如确认是ISP导致，先尝试降低D3D模块运动降噪强度，将`SS MV DNR`和`LS MV DNR`的强度设置为0

![拖影调试示例1](images/拖影调试示例1-4971977f894836f3dd76ab71d1311a23.png)

**Step3**：如果仍然存在拖影，可再继续降低D3D整体去噪强度,直到画面出现轻微噪声闪烁为止

![拖影调试示例2](images/拖影调试示例2-20eeb84b6a644a35f5a228a3cc07bfdd.png)

**Step4**：如果不是ISP导致，请抓取VE节点确认编码3D是否打开，如有打开可关闭再确认效果

![拖影调试示例3](images/拖影调试示例3-d95edc0d6852f6443164c2522bef0676.png)

### 画质升级调试方法

#### 介绍

最新画质升级成果包含VE及ISP两部分。VE模块更新了码控策略，在IPC、CDR等编码产品上，能降低码率并提升图像清晰度及细节。ISP上新增了联动参数，可以更准确的区分出噪声区域和平坦区域、运动区域和静止区域，在保留细节的同时能更准确的去除噪声。

#### ISP调试风格适配

由于新增的联动功能，能提高运动及噪声区域的去噪强度，因此如果按照原有的D2D去噪强度，会导致降噪强度过大，导致出现拖影、细节丢失的情况。在使用画质升级的配置后，需要按照下述步骤适配ISP及VE参数，以达到最佳效果。

**Step1**：请先确认当前环境是否已完成画质升级，V821 SDK1.0及以上版本都已支持，V85x如需要升级，需要先升级至SDK1.2，再联系我们提供补丁升级。

**Step2**：编码配置中，使用新版VBR策略，并打开RegionLink功能，请通过抓取VE节点确认是否开启成功。

![画质升级ISP调试适配1](images/画质升级ISP调试适配1-ee981faecd250a7e2d0d9612d20eb924.png)

![画质升级ISP调试适配2](images/画质升级ISP调试适配2-f25a842f9eba8da6e7f479882b3a0566.png)

**Step3**：ISP效果参数中，将BDNF中的MSC CMP Ratio改为31，将TDNF中的MSC CMP Ratio改为0。

![画质升级ISP调试适配3](images/画质升级ISP调试适配3-68de867ea70deae4bb7634b4087d8327.png)

![画质升级ISP调试适配4](images/画质升级ISP调试适配4-bda91fc014176870331a7280d4d82c20.png)

**Step4**：ISP效果参数中的Dynamic Tuning，将Denoise中的降噪强度调整为原有的1/16,适当降低TDNF的降噪强度，直到没有跳动噪声即可。

![画质升级ISP调试适配5](images/画质升级ISP调试适配5-f3a068917f3f0beca8be3410ca332460.png)

![画质升级ISP调试适配6](images/画质升级ISP调试适配6-e3253544a6a1473a6698a2f4b30fcfd3.png)

## FAQ

### 如何使用或关闭降帧策略

降帧策略通常在低照度下生效，通过延长曝光时间来提升画面亮度和信噪比，下面简单介绍降帧策略的使用方法

**Step1**：确认 Sensor 的 `VTS`寄存器

![自动降帧示例1](images/自动降帧示例1-1f73068d7e80dc4cc444c74b9182e554.jpg)

**Step2**：在 `sensor_s_exp_gain` 函数中检查当前设置的曝光时间是否超过当前帧率对应的 `VTS`，如果超过则动态调整 `VTS` 来延长曝光时间，如果没有则不需要调整`VTS`

```
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
  if (!sc3336_fps_change_flag) { // 检查是否在主动调节帧率，通过标志位或者锁互斥即可
    shutter = exp_val >> 4; // SOC 曝光行（时间）是以16为1行，所以将上层传下来的曝光行除以16，换算当前实际曝光行
    if (shutter > sc3336_sensor_vts - 8) { // 判断当前曝光时间是否大于当前帧率下的 VTS（“-8”只是偏移量，每个 Sensor 不一定）
    frame_length = shutter + 8; // 如果大于当前帧率下的 VTS，那么意味着需要增加VTS 来达到降帧的目的，以此实现自动降帧
  } else
    frame_length = sc3336_sensor_vts; // 如果曝光时间未达到需要调整 VTS 来降帧的情况下，那么还是保持当前帧率需要 VTS 值即可
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

**Step3**：调整 `ISP` 效果文件的最大曝光时间

`ISP` 效果文件中的 `AE Table` 用于设定当前效果的曝光表：

如图所示，`Min Exp` 代表最小曝光时间（倒数）—— 1/22000s，`Max Exp` 代表最大曝光时间（倒数）—— 1/20s，  
`Min Gain` 代表最小增益、`Max Gain` 代表最大增益（均以 256 为一倍），光圈调节暂不支持，故需要设置为默认值为266；

`AE` 调整亮度的逻辑：第 0 档为起始档位，`AE` 会保持一倍增益的前提下，优先提高曝光时间来达到提升亮度的目的，曝光时间的可调范围为【1/22000s，1/20s】，如果曝光时间提高到 1/20s的状态还没有达到期望亮度，那么会开始向下顺延执行第 1 档的设定：维持曝光时间为 1/20s 的前提，开始提高增益的倍数，增益的可调范围【256，32768】（也就是 1x - 128x），以此类推，直到达到最大曝光时间和最大增益

![自动降帧示例2](images/自动降帧示例2-86e33e5826d83e60fb327def922cf35f.png)

如果当前帧率为 20fps，则需要限制最大曝光时间为 1/20s，那么意味着 `ISP` 给驱动设置的最大曝光时间则不会大于 1/20s（50ms），如果有自动降帧需求，那么可以将最大曝光时间设置大于1/20s；例如设置为 1/10s ：意味着最大曝光时间从 50ms 调整到 100ms，驱动发现当前曝光时间大于当前 `VTS` 时，便会重新调整 `VTS` 来降帧延长曝光时间；

![自动降帧示例3](images/自动降帧示例3-84b6671b82ff119b5b46639aceda4546.png)

上述是通过调试工具调整曝光表，也可以通过直接修改对应 `ISP` 效果文件来实现自动降帧，打开效果文件并搜索 `ae_table_preview`,参数和工具界面的参数是一一对应的

![自动降帧示例4](images/自动降帧示例4-427cbd3daaf8323a02264fd962a9ab64.png)

**Step4**：如果希望关闭自动降帧策略，可将效果文件的最大曝光时间改成帧率对应的曝光值，如最大帧率为20fps，那么最大曝光就是1/20s（50ms），此外也可以将驱动文件里面写`VTS`寄存器的动作注释

![自动降帧示例5](images/自动降帧示例5-f93e810f0f35a3d2b569e384cd6daaa4.jpg)

:::note

:::note

备注

:::
:::note

-   如有疑问请参考《Tina\_Linux\_Camera\_降帧\_开发指南》、《sensor帧率控制及检查》

:::

:::

### 如何解决工频干扰问题

交流电的瞬时功率周期性变化，导致没有滤波电路或滤波不好的照明设备发光强度也周期性变化。使用滚动快门的图像传感器，周期性变化的光强会在画面上呈现周期性的水平亮度差异，看起来就是周期性的条纹。世界主要有50Hz和60Hz两种交流电频率，对应亮度变化周期是1/100s和1/120s。要完全解决工频闪烁，就要令曝光时间是亮度变化周期的整数倍，通过调整`ISP`可以优化工频干扰

以使用50Hz交流电为例说明。

**Step1**：`ISP`效果参数使能`AFS（Anti-Flicker）`模块并打开`AE log`，`EXP_TIME`是以微秒为单位的，`exp_time`的值应该要等于或接近10000的整数倍。

![抗工频干扰示例1](images/抗工频干扰示例1-c67c3879cc4d58b7b30dabbd1d7083f5.png)

**Step2**：若`exp_time`的值明显小于10000，则通过提高`AE target`可以提高`exp_time`的值，令其接近10000us，修改方法可看第4.2章节详情  
**Step3**：若不便提高`AE`期望亮度，令帧率严格等于100/N（N为正整数），可以让条纹定住不动，感观上也好一点。  
**Step4**：若`exp_time`的值等于或接近10000的整数倍，仍有工频闪烁，就说明sensor驱动里面的`pclk、vts、hts`至少其中一个值不准确，请检查sensor驱动配置并与原厂确认  
**Step5**：若`exp_time`的值大于10000，但不是10000的整数倍，则可以设置`flicker_type=1`，令`Anti-Flicker`强制处于50Hz模式，或设置`flicker_type=0`，令`Anti-Flicker`处于自动检测模式，并通过改变`Ratio`的值让`Anti-Flicker`工作在50Hz模式。

![抗工频干扰示例2](images/抗工频干扰示例2-a3c6e451224c58386d90b1adcdfc63d2.jpg)

**Step6**：如果不希望通过调整效果文件，而是通过应用接口控制，可使用下述接口设置抗工频闪烁属性，模式列表如下

```
enum v4l2_power_line_frequency { 
V4L2_CID_POWER_LINE_FREQUENCY_DISABLED = 0, 
V4L2_CID_POWER_LINE_FREQUENCY_50HZ = 1, 
V4L2_CID_POWER_LINE_FREQUENCY_60HZ = 2, 
V4L2_CID_POWER_LINE_FREQUENCY_AUTO = 3, 
}; 
```

![抗工频干扰示例3](images/抗工频干扰示例3-0ce97929441a5ff0e61607c03ff62550.png)

### 如何解决拜耳格式导致的图像问题

Bayer矩阵是图像传感器上用于捕捉彩色图像的一种滤色阵列。它的核心思想是通过排列红（R）、绿（G）、蓝（B）三种颜色滤镜，使每个像素仅捕获一种颜色信息，再通过插值算法（Demosaic）还原全彩图像。

当sensor输出raw数据的拜尔矩阵与sensor驱动设置的不一致，进行demosaic算法时，插值算法会错误计算颜色，导致图像颜色完全错误，因此在点亮sensor时，请根据sensor实际输出的拜尔格式正确填写到sensor驱动中。

#### 图像翻转如何适配拜尔格式

如果用户使用的翻转是sensor翻转，那么需要找原厂确认翻转以后sensor输出的拜尔格式是否变化，如有变化，请确认sensor驱动是否适配翻转后的拜尔格式。适配方法请参考一号通《Tina\_Linux\_Sensor驱动\_调试指南》中第3.2.15.2节实现。

一般sensor有自适应翻转功能，也就是在操作sensor翻转后，sensor保持输出的拜尔格式不会变化，这时候sensor驱动就不需要适配翻转后的拜耳格式，此功能请与原厂确认。

### 如何优化紫边问题

#### 模块参数介绍

由于被摄物体反差较大，在高光与低光部位交界处出现的色斑的现象即为色差，常见为紫色，因此又叫紫边现象。此现象与透镜无法将各种波长的色光都聚焦在同一点有较大关系，`ISP` 有两个模块参与去紫边，分别是 `GCA` 和 `LCA`，去除紫边建议先做全局色差矫正

#### GCA校准流程介绍

**Step1**：离线连接上调试工具，点击`ISP Test`，在`ByPass Setting`模块，点击`All Operation`中的`disable`，关闭所有`ISP`模块,点击`write`，使修改生效  
**Step2**：点击`Calibration`，再点击`GCA`按钮，跳出`GCA`标定界面

![CFA校准流程1](images/CFA校准流程1-1e8d8bebab60113c727155e4bce6dcad.jpg)

**Step3**：准备`GCA`标定图，需要用到黑底的白圆点图，尺寸建议 A2/A1，如下图所示

![普通镜头标定图示意图](images/CFA校准流程2-f5e6c6c7ee199f8f7d29e9049ad20631.png)

![畸变镜头标定图示意图](images/CFA校准流程3-b8cec24d74e18024bdd6c36cc58bfb64.png)

**Step4**：手动设置曝光、增益至合适的倍数，拖动鼠标右键框选中央区域，选择 `RGB` 测算，`G_MAX` 数值应接近最大值。

![CFA校准流程4](images/CFA校准流程4-6830673c3f0c9f8c6d7d542e9f3d30e8.png)

**Step5**：完成 Sensor 曝光设置后，点击 `Capture`按钮抓取 20 帧 `Raw` 数据,点击`Calc`，工具将根据设定的参数计算出 `R Param0 ~ B Param2` 这 6 个参数,点击`Apply`使参数生效。

![CFA校准流程5](images/CFA校准流程5-2ded6d3270d76c1c0e5fdeba6735a527.png)

#### 主观调试方法

![LCA参数介绍1](images/LCA参数介绍1-efa135721ee805703a953b9b06dc9d09.png)

**Step1**：在 `GCA` 已标定好的前提下，物体边缘若还有紫边，可调试 `LCA` 参数。  
**Step2**：`LCA` 调试时先将校正系数设置为最强（`PF/GF Correction Ratio = 1024，PF/GF CLRC Ratio = 0，PF DECR Ratio = 15`）来分别调试偏绿/偏紫紫边的检测区域（`Lum，Grad，CLR，PF Rshf，PF Blsp`）  
**Step3**：在调试得到合适的检测区域后，可开始调试校正系数来平衡紫边去除程度及副作用（`PF/GF Correction Ratio，PF/GF CLRC Ratio，PF DECR Ratio` 以及两条曲线）

:::note

:::note

备注

:::
:::note

-   设置 Sensor 曝光、增益时需要将 `TestMode` 设置为 `Manual Mode`
-   `Raw` 图的尺寸、`Bayer` 格式确保选择正确（`cat vi` 节点查看相关的配置）
-   抓取 `Raw` 图时，确保标定图占满整个画面，并且尽量拍到更多的白点

:::

:::

### 如何解决黑白全彩切换偏色

通常黑白全彩切换可能存在如下问题：

-   全彩切黑白或黑白切全彩时出现紫帧
-   黑白切全彩出现白平衡偏绿、紫帧等问题

需要优化上述问题，切换流程建议按照下述设置：  
从彩色图像切换到黑白图像，一般建议先切换 ISP 效果（彩色->黑白），打开红外灯，再使能 IR-CUT，这样可以防止先使能 IR-CUT 后，摄像头会拍摄到红外光分量导致图像先变红再变黑白。  
从黑白图像切换到彩色图像，一般建议先关闭红外灯（白天场景环境光较充足），关闭 IR-CUT，切换ISP 效果（黑白->彩色）

### 如何去除sensor坏点

坏点主要产生原因与sensor相关，长时间高低温等极端环境工作、传感器受到外力撞击挤压或静电放电时可能直接破坏像素单元的电路结构、传感器生产过程中微小的工艺偏差等均有导致坏点的可能

![坏点图像示例1](images/坏点图像示例1-bdabd31274bc3ec17e334784d05106bb.png)

ISP中的DPC模块可用于去除这类坏点，但需要根据具体sensor情况进行调试，具体操作方法如下：

**Step1**：先确认ISP效果参数中的DPC模块是否打开，若未打开，请打开  
**Step2**：按照下述流程进行调试  
调试分为检测和校正，以下调试建议在默认值参数的基础上进行。  
1.检测：  
a)现将校正参数NBHD\_DIFF\_RATIO和NEAREST\_DIFF\_RATIO调至最小，保证调整检测参后，马上就能看出检测的实时效果。  
b)调节SLOPE\_TH参数，若图像动态坏点不明显（表现为稍亮），又希望将其去掉，将SLOPE\_TH参数调小，以此来检测出更多的不明显坏点。若图像的动态坏点都比较明显，则可调大SLOPE\_TH参数，防止误测出更多的纹理。  
c)在上一步的基础上，配合HOT\_RATIO参数去除亮坏点。将 HOT\_RATIO参数调小，则能越容易检测出亮坏点，同时，越多的亮边缘纹理也将被误检；将 COLD\_RATIO参数调小，COLD ABS TH调大（一般使用默认值即可，不需要整），则越容易检测出暗坏点来，同时，越多的暗边缘纹理也将被误检，需要权衡。  
d)调整到合适的检测参数后，将校正参数NBHD\_DIFF\_RATIO和NEAREST\_DIFF\_RATIO调至最大，接下进行调试校正参数。  
2.校正：  
1)由于校正参数被设置最大，虽然检测到了，但是依然没校正过来。因此，逐步减小校正参数NBHD\_DIFF\_RATIO和NEAREST\_DIFF\_RATIO，会越来越多的坏点被校正。  
2)若希望被检测出的坏点更多的被校正（去坏点），则将NBHD\_DIFF\_RATIO和NEAREST\_DIFF\_RATIO参数继续调小，主要调NBHD\_DIFF\_RATIO参数，次调NEAREST\_DIFF\_RATIO。  
3)若希望被检测出的坏点更多的保持原始值（纹理和边缘），则将NBHD\_DIFF\_RATIO和NEAREST\_DIFF\_RATIO参数调大。

![坏点调试参数](images/坏点调试参数-dda53178979aa6162e3a1d59f8320bb0.png)

### 如何读写Sensor寄存器配置

#### 通过sensor节点进行读写

**Step1**：`cd /sys/devices/gc2053_mipi`（进入目标 sensor 节点目录）  
**Step2**：`echo 0x10 > addr_width; echo 0x8 > data_width`（输入目标 sensor 寄存器地址/数据位宽，请查阅 `datasheet` 获取）  
**Step3**：`echo 0 > read_flag`（`read_flag`：读写控制节点，使能为1表示后续操作为读动作，使能为0表示后续操作为写动作）  
**Step4**：`echo 30350021 > cci_client`（“30350021”：0x3035【目标寄存器地址】，0x0021【将要写入的寄存器值】，在 `read_flag = 1` 情况下，写入值为无效状态）  
**Step5**：`cat read_value`（打印上一步操作的结果：寄存器值）

#### 通过TigerISP工具进行读写

**Step1**：离线/在线连接上调试工具  
**Step2**：打开读取寄存器界面，正确选择sensor寄存器的地址及数据位宽  
**Step3**：操作为读取寄存器时，先在`Address`这一列填入要读取的寄存器地址，点击`Read`，在`Data`这一列会显示读出来的寄存器数值  
**Step4**：操作为读取寄存器时，先在`Address`这一列填入要写入的寄存器地址，再在`Data`这一列填入要写入的寄存器数值，点击`Write`，即可写入进去  
**Step5**：`Write`以后可以再`Read`一下，确认是否写入生效

![TigerISP读取寄存器示例](images/TigerISP读取寄存器示例-d0b14883a50d2afa9368f08933e38433.png)

:::note

:::note

备注

:::
:::note

-   `IIC` 在系统和硬件上正常工作；
-   上述命令需要在 `Camera` 正常工作状态下执行才会有效，如 `/sys/devices/sensor` 节点是否存在，`Camera` 是否上电等等；
-   上述命令只在 `tina-linux` 系统有效，`rtos` 系统暂不支持；

:::

:::

### 如何转换效果文件并合入应用生效

#### 介绍效果文件格式及转化方法

`ISP`效果文件有三种格式：`dat、h、bin`

-   `dat`文件用于效果调试，工具加载及保存只能使用`dat`文件
-   `h`文件用于编译，使`ISP`在运行起来时，能快速找到对应匹配的效果文件并加载生效到应用中
-   `bin`文件用于效果切换，客户可以将文件放入文件系统中，在应用起来时通过调用接口读取`bin`文件，实现`ISP`效果加载生效

下述为三种效果文件格式的转化方式

![效果文件转化](images/效果文件转化-162071c7240005923eb42dd0d078d791.png)

#### 应用应该如何适配ISP效果文件并生效

##### h头文件

**Step1**：拷贝效果`.h`至 `SDK`

在工具中将`.dat` 文件转换为`.h` 文件，拷贝至 `SDK`指定路径  
V85x常电效果文件目录：`/external/eyesee-mpp/middleware/sun8iw21/media/LIBRARY/libisp/isp_cfg/SENSOR_H/gc4663/`  
V85x快起效果文件目录：`/lichee/rtos-hal/hal/source/vin/vin_isp/isp_server/isp_cfg/SENSOR_H`  
V821常电效果文件目录：`/platform/allwinner/vision/libAWIspApi/isp_mpp/isp_v821/libisp/isp_cfg/SENSOR_H/gc4663`  
V821快起效果文件目录：`/rtos/lichee/rtos-hal/hal/source/vin/vin_isp/isp_server/isp_cfg/SENSOR_H`

**Step2**：配置 `isp_ini_parse.c`，`include`添加上新增的`ISP`效果文件

V85x常电`isp_ini_parse`文件目录：`/external/eyesee-mpp/middleware/sun8iw21/media/LIBRARY/libisp/isp_cfg/isp_ini_parse.c`  
V85x快起效果文件目录：`/lichee/rtos-hal/hal/source/vin/vin_isp/isp_server/isp_cfg/isp_ini_parse.c`  
V821常电效果文件目录：`/platform/allwinner/vision/libAWIspApi/isp_mpp/isp_v821/libisp/isp_cfg/isp_ini_parse.c`  
V821快起效果文件目录：`/rtos/lichee/rtos-hal/hal/source/vin/vin_isp/isp_server/isp_cfg/isp_ini_parse.c`

![配置ISP效果文件1](images/配置ISP效果文件1-4b87b729ad6d39e00ae757f48b4ce3b3.png)

**Step3**：配置效果文件对应的属性，这一步是确保效果文件能否加载正确的关键

① Sensor dev名称：这个是驱动里面注册的sensorname，通常单路就是gc4663\_mipi,如果是双目的情况下，另一路通常注册为gc4663\_mipi\_2，如果不能确定，可以通过cat vi节点确认sensorname  
② ISP 效果头文件名称：对应效果文件名  
③ 分辨率宽度：当前vi节点sensor输出宽度，如果不能确定可以通过cat vi节点确认  
④ 分辨率高度：当前vi节点sensor输出高度，如果不能确定可以通过cat vi节点确认  
⑤ 帧率  
⑥ 红外 IR 模式标志位：值为1则按照红外夜视黑白效果加载此效果文件  
⑦ WDR 模式标志位：值为1则说明效果为 WDR 模式专用效果，使用 WDR 模式才需要配置  
⑧ ISP 效果.h 末尾的 ISP 参数结构体“struct isp\_cfg\_pt gc4663\_mipi\_linear\_isp\_cfg”

![配置ISP效果文件2](images/配置ISP效果文件2-a0c3cf0f2dcc7aaabe59dccaa6bbad5e.png)

如打开效果头文件后，这里结构体名字与isp\_ini\_parse.c对应不上，那么需要修改isp\_ini\_parse.c中的⑧为&gc4663\_mipi\_rgb\_isp\_cfg

![配置ISP效果文件3](images/配置ISP效果文件3-6a3a9a1e20d17fe8a237f8146c8f638f.png)

**Step4**：应用上使用 AW\_MPI\_ISP\_SwitchIspConfig接口切换效果配置

IspDev 为当前使用的 ISP 通道号  
ModeFlag为切换模式，0代表线性模式彩色效果，1代表WDR 模式彩色效果，2代表线性模式红外黑白效果，3代表WDR 模式红外黑白效果

![配置ISP效果文件4](images/配置ISP效果文件4-ab3c34350f025f0db03400874177f32e.png)

##### bin文件

**Step1**：将效果文件转换为bin格式并存放在文件系统指定路径下  
**Step2**：应用上使用 AW\_MPI\_ISP\_ReadIspCfgBin接口切换效果配置

![配置ISP效果文件5](images/配置ISP效果文件5-c4fb2db97641a520520bf8a052f98452.png)

### 如何基于彩色效果整理一份初版红外效果

从彩色模式参数同步到红外模式过程中，效果文件上有以下点需要修改确认

-   CAC(LCA+GCA)模块需要关闭，避免红外模式下颜色误判断引起的异常
-   WB模块需要关闭(AWB保持打开)，避免色温异常判断引起画面的异常变化
-   CCM模块建议关闭
-   对比度(GTM模块)需要适当增强，避免红外补光灯下容易出现的图像发“朦”

### 如何抓取sensor raw数据

遇到图像效果异常，而无法判定是主控导致还是sensor本身的问题，在面对这种情况下，抓取raw数据进行分析是最快捷直观的排查手段，V系列支持多种抓取raw数据的方式 \\

#### Sample\_virvi抓取raw数据

##### 介绍

Sample\_virvi支持从vipp抓取raw数据，这个过程中vipp直接输出raw格式数据，不会经过isp的任何处理，只能抓取video0节点下的raw数据。但由于在跑sample\_virv抓raw数据时，无法预览经过isp后的图像数据，因此针对一些非必现的场景问题下，此方案抓raw不推荐使用。

##### 使用方法：

**Step1**：将sample\_virvi放入卡中，图像尺寸帧率请按实际配置  
**Step2**：修改sample\_virvi.conf文件，修改如下配置pic\_format\_0 = “srggb10”,raw\_store\_count = 5  
**Step3**：执行./sample\_virvi -path ./sample\_virvi &  
**Step4**：在mnt/extsd目录下有raw图保存

#### TigerISP离线抓取raw数据

##### 介绍

TigerISP是ISP调试工具，客户可以在APST上面进行下载。这里的离线指的是不跑sample出流或客户应用，通过运行TuningApp连接调试工具出流。本方法可以预览并判断到当前场景已复现到问题后，再进行raw数据抓取，但只能抓取video0节点下的raw数据，因此如果是双摄、三摄的情况下，需要手动配置设备树，将有问题的一路sensor配置到video0节点中。

##### 使用方法

**Step1**：进入串口，手动运行tuningapp，指令如下：./Tuningapp 8848 0 &  
**Step2**：打开TigerISP，填写sensor对应的尺寸帧率等配置，完成调试工具连接  
**Step3**：导入现在使用的效果参数，并预览图像，检查是否复现到问题  
**Step4**：复现到问题以后，通过log记录下当前使用的曝光增益  
**Step5**：在调试工具中手动关闭isp所有模块  
**Step6**：在手动曝光窗口下，将复现场景下记录的曝光增益写到sensor中  
**Step7**：在capture界面下，将格式改为sensor输出的raw图格式（如BAYER-RGGB10），在点击右上角的capture按钮就可以完成raw图抓取

![抓取raw数据示例1](images/抓取raw数据示例1-f6f8de86f12ba626ad60a9fb8d849f2b.png)

#### sample\_smartIPC\_demo抓取raw数据

##### 介绍

sample\_smartIPC\_demo是基于IPC客户开发的示例demo，其中包含整个vin通路及rtsp功能，使用该sample可以实现通过wifi、adb、eth等方式的实时图像码流预览。通过sample\_smartIPC\_demo抓取raw数据，可以实现在实时预览经过ISP、VE处理后的码流的同时，将这一段raw数据保存到本地。

##### 使用方法

**Step1**：m kernel\_menuconfig，搜索并打开SUPPORT\_ISP\_TDM、TDM\_OFFLINE\_HANDLE\_RAW  
**Step2**：打开board.dts，将vin通路配置为离线模式

![抓取raw数据示例2](images/抓取raw数据示例2-91f08565b00a6e1e14cef92c875a5440.png)

![抓取raw数据示例3](images/抓取raw数据示例3-5d6ae0eeed0898174a67a2f953859709.png)

**Step3**：配置sample\_smartIPC\_demo.conf，其中main\_isp\_tdm\_raw\_process\_type请根据实际sensor输出的raw图的格式进行选择，其余配置按照sensor输出尺寸及需求进行配置。

```
main_isp_tdm_raw_process_type = -1 #-1:disable, 0:dump 8bit, 1:dump 10bit, 2:dump 8bit for tools, 3:dump 10bit for tools, 4:send 8bit, 5:send 10bit
main_isp_tdm_raw_width = 1920
main_isp_tdm_raw_height = 1080
main_isp_tdm_raw_rxbuf_num = 5
main_isp_tdm_raw_process_frame_cnt_min = 0
main_isp_tdm_raw_process_frame_cnt_max = 5
main_isp_tdm_raw_file_path = "/mnt/extsd/tdm_raw.bin"
```

**Step4**：编译新固件并烧录  
**Step5**：运行sample\_smartIPC\_demo进行raw数据抓取

#### TigerISP在线抓取raw数据

##### 介绍

TigerISP是ISP调试工具，客户可以在APST上面进行下载。这里的在线指的是在跑sample或客户应用的时候，连接上调试工具，进行raw数据抓取，在一些低概率才能复现到的问题上，推荐使用此方法进行raw数据抓取

##### 使用方法

**Step1**：参考sample\_smartIPC\_demo抓取raw数据步骤的前两点进行通路配置  
**Step2**：编译新固件并烧录  
**Step3**：进入串口，手动运行tuningapp，指令如下：./Tuningapp 8848 1 &  
**Step4**：打开TigerISP，填写sensor对应的尺寸帧率等配置，完成调试工具连接  
**Step5**：确认当前场景下已复现到问题  
**Step6**：在capture界面下，将格式改为sensor输出的raw图格式（如BAYER-RGGB10），在点击右上角的capture按钮就可以完成raw图抓取

![抓取raw数据示例4](images/抓取raw数据示例4-b6ab89242d36f74d4a5eaeea8d1739a6.png)

:::note

:::note

备注

:::
:::note

-   sample\_smartIPC\_demo抓取raw数据只支持V85x sdk1.2及以上版本、V821 SDK1.0及以上版本
-   TigerISP在线抓取raw数据，只支持V821 SDK1.0及以上版本

:::

:::

### 如何通过ISP优化高温热噪

#### 介绍

-   由于Sensor处于高温环境或长时间工作，本身积热严重形成热噪，噪声对图像效果产生比较大的影响，通过实时读取Sensor温度，适时调整ISP模块表现来优化画质表现。

![热噪示例图](images/热噪示例图-b6d6822c6c7d762509047093e528d0f0.jpg)

#### ISP高温联动策略介绍

-   Sensor驱动获取温度（标定拟合的温度曲线）
-   调试ISP高温联动模块

通过实时获取Sensor温度，联动 ISP Pipeline 的 Denoise、TDNF、BLC、Sharp、Saturation等模块来实时调整图像表现，例如高温下热噪严重，读取Sensor温度处于较高水平时，对应加强降噪模块的强度，减弱锐化模块的强度，使得图像不会因为热噪而变得十分异常。

如图所示，ISP高温策略通过获取Sensor温度进行联动，温度值归一化在【55℃, 120℃】范围内（意味着Sensor获取温度值后，需要将其归一化在这个范围内）。

![ISP高温联动策略](images/ISP高温联动策略-565ab33be8a51be404fc968b3e1eaac3.png)

如图所示，ISP高温联动模块的参数是各个模块强度（降噪、锐化、饱和度、BLC等）的补偿系数。

-   以256为默认值，小于256为衰减补偿，大于256为增强补偿。
-   如下表所示，BLC的补偿值系数默认值为0，补偿系数是在原有的BLC模块基础值上进行补偿偏移。

![ISP高温策略联动范围](images/ISP高温策略联动范围-9e3102c968d746c264d00ec7d745e759.png)

```
2D Black	2D暗部降噪联动系数，数值越大降噪越强，取值范围【0，4095】，默认值：256
2D White	2D亮部降噪联动系数，数值越大降噪越强，取值范围【0，4095】，默认值：256
3D Black	3D暗部降噪联动系数，数值越大降噪越强，取值范围【0，4095】，默认值：256
3D Black	3D亮部降噪联动系数，数值越大降噪越强，取值范围【0，4095】，默认值：256
DTC Stren	D3D DTC 强度联动系数，数值越大噪声越多，取值范围【0，256】，默认值：256
BLC_R   	黑电平 R 分量偏移，取值范围【-4095，4095】，默认值：0
BLC_G   	黑电平 G 分量偏移，取值范围【-4095，4095】，默认值：0
BLC_B   	黑电平 B 分量偏移，取值范围【-4095，4095】，默认值：0
Sharp	    锐化强度联动系数，数值越大锐化越强，取值范围【0，4095】，默认值：256
Satu_Low	低亮饱和度联动系数，数值越大低亮区域饱和度越强，取值范围【0，512】，默认值：256
Satu_Mid	中亮饱和度联动系数，数值越大中亮区域饱和度越强，取值范围【0，512】，默认值：256
Satu_High	高亮饱和度联动系数，数值越大高亮区域饱和度越强，取值范围【0，512】，默认值：256
```

#### 高温热噪调试策略

高温热噪的现象通常比较好分辨，如图所示，整个画面闪动的噪声会十分严重（特别是四角），随着时间流逝，清晰度也逐渐变差，与此同时，图像的颜色也会出现一些偏差。

![热噪示例图](images/热噪示例图-b6d6822c6c7d762509047093e528d0f0.jpg)

画面颜色偏差主要还是 Sensor BLC 在这个场景下有偏移导致，例如原本 BLC 只需要由平台扣除16，但受高温影响后实际需要扣除的BLC已经比16更大了。所以调试中需要观察每个温度档位下，图像中黑色的被摄物体是否有发红的表现，然后相应调整高温联动模块中的 BLC 参数和饱和度参数。

从上图中可以看到，受温度的影响，图像噪声十分严重，那么就可以根据温度档位，适当调整降噪强度补偿和锐化强度补偿（下图参数仅作为示例，参数设置以实际情况调试为准），让画面恢复到比较正常的表现。

![调试参数示例](images/调试参数示例-24faf5fdd4a8fa72ef368f0ede53d5d4.png)

下图为高温联动策略生效后的效果，即使是高温条件下，图像也能够调整回相对正常的状态。

PS：如果通过高温联动策略也未能调整好图像，那么只能考虑从机器的模具设计、Sensor 选型来避免此类问题。

![优化热噪示例图](images/优化热噪示例图-7cf038ef2f82ba18b1fbe58d98754ece.jpg)

### 如何使用远程调图

#### 介绍

全志调试工程师与需调试设备两者异地，全志调试工程师可使用远程调试系统，在系统对已挂上系统的需调试设备进行画质调试。

#### 使用流程

##### 安装 TigerDOS

TigerDOS是一款基于互联网的设备远程在线调试系统，支持线上远程调试设备（adb调试 & 串口调试 & IP+Port调试（比如ISP在线调试）& 远程PC桌面协助），通过远程线上调试快速支持全志客户问题。  
工具可以通过全志客户服务平台的开发工具页面获取，也可以使用 APST 获取。

![远程调图流程1](images/远程调图流程1-f66c03f7eea7eea377e7046536e2abda.png)

##### 准备调试环境

在调试之前，需要准备好调试固件，并且连接好串口，确认能使用adb/ip连接调试工具，在线调图连接工具方法请看第2.5.2章

##### 登录 TigerDOS

安装完成，打开 TigerDOS 后，全志客户输入一号通账号与密码（要求有NDA权限）

![远程调图流程2](images/远程调图流程2-571c6c228a86557098fc39fb2134b414.png)

非NDA账号会显示无法登录

![远程调图流程3](data:image/png;base64,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)

##### 分享桌面

选择工具中的PC桌面选项，在搜索框中输入员工的姓名，点击开始共享

![远程调图流程4](images/远程调图流程4-5e17a5c111d46904d654fe5cdf46320a.png)

然后会显示验证码，将验证码发给对应员工即可

![远程调图流程5](images/远程调图流程5-6140182a00fca62802923000eb921b10.png)

### 如何抓取及分析ISP、VI节点

如下所示为vi节点，串口执行下述指令可以查看 VI 节点状态：cat /sys/kernel/debug/mpp/vi

```
VIN hardware feature list:
mcsi 2, ncsi 1, parser 2, isp 1, vipp 2, dma 2
CSI_VERSION: CSI300_600, ISP_VERSION: ISP603_100
CSI_CLK: 200000000, ISP_CLK: 0
*****************************************************
vi0:
gc1084_mipi => mipi0 => csi0 => isp0 => vipp0
input => hoff: 0, voff: 0, w: 1280, h: 720, fmt: GRBG10
output => width: 1280, height: 720, fmt: LBC_1X
interface: MIPI, isp_mode: NORMAL, hflip: 0, vflip: 0
prs_in => x: 1280, y: 720, hb: 2432, hs: 6451
bkuf => cnt: 4 size: 1429504 rest: 4, work_mode: online
frame => cnt: 306, lost_cnt: 7, error_cnt: 0
internal => avg: 34(ms), max: 34(ms), min: 33(ms)
CSI Bandwidth: 0
*****************************************************
vi4:
(efault) => mipi0 => csi0 => isp0 => vipp4
input => hoff: 0, voff: 0, w: 0, h: 0, fmt: NULL
output => width: 0, height: 0, fmt: NULL
interface: NULL, isp_mode: NORMAL, hflip: 0, vflip: 0
prs_in => x: 0, y: 0, hb: 0, hs: 0
bkuf => cnt: 0 size: 0 rest: 0, work_mode: online
frame => cnt: 0, lost_cnt: 0, error_cnt: 0
internal => avg: 0(ms), max: 0(ms), min: 0(ms)
CSI Bandwidth: 0
*****************************************************
```

VI 节点参数说明

| 参数 | 描述 |
| --- | --- |
| mcsi | MIPI通道号，0/1 |
| ncsi | DVP通道号，0 |
| parser | 图像数据解析通道号，0/1/2/3 |
| isp | ISP通道号，0/1 |
| vipp | VI通道号，0~12 |
| input => hoff | 输入图像水平偏移 |
| input => voff | 输入图像垂直偏移 |
| input => w | 输入图像宽度 |
| input => h | 输入图像高度 |
| input => fmt | 输入图像格式，RAW：RGGB/BGGR/GRBG/GBRG，YUV： |
| output => width | 输出图像宽度 |
| output => height | 输出图像高度 |
| output => fmt | 输出图像格式：RAW8/10/12，YUV420等，LBC\_1/1.5/2/2.5X |
| interface | 接口类型：PARALLEL/MIPI/BT656/SUBLVDS/HISPI |
| isp\_mode | ISP模式：NORMAL/DOL\_WDR/CMD\_WDR/SEHDR |
| hflip | 输出图像水平（镜像）翻转：0/1 |
| vflip | 输出图像垂直翻转：0/1 |
| prs\_in => x | parser输入数据宽度 |
| prs\_in => y | parser输入数据高度 |
| prs\_in => hb | 行消隐时间 |
| prs\_in => hs | 行同步时间 |
| bkbuf => cnt | 图像buffer个数 |
| bkbuf => size | 图像buffer大小 |
| bkbuf => rest | 空闲图像buffer个数 |
| bkbuf => work\_mode | 图像编码模式：offline/online |
| tdmbuf => cnt | TDM buffer个数 |
| tdmbuf => size | TDM buffer大小 |
| tdmbuf => cmp\_ratio | TDM LBC 压缩系数 |
| ispbuf => cnt | ISP 3DNR buffer个数 |
| ispbuf => size | ISP 3DNR buffer大小 |
| ispbuf => cmp\_ratio | ISP 3DNR 压缩系数 |
| frame => cnt | 图像帧计数 |
| frame => lost\_cnt | 图像丢帧计数 |
| frame => error\_cnt | 图像异常帧计数 |
| internal => avg | 图像帧间隔平均值（ms） |
| internal => max | 图像帧间隔最大值（ms） |
| internal => min | 图像帧间隔最小值（ms） |

如下所示为isp节点，串口执行下述指令可以查看 isp 节点状态：cat /sys/kernel/debug/mpp/isp

```
cat /sys/kernel/debug/mpp/isp
*****************************************************
VIN hardware feature list:
CSI_VERSION: CSI300_600, ISP_VERSION: ISP603_100
CSI_CLK: 200000000, ISP_CLK: 0
vipp0, isp_dode: NORMAL
*****************************************************
ISP0 debug param list:
===> exp: 21600, gain: 17, lum_idx: 187, coms_temp: 48
===> color_temp: 5630, rgain: 468, bgain: 442
===> contrast: 256, sharp: 256, bright: 256
===> satur: 256, tdnf: 256, bdnf: 256, pltm: 0
*****************************************************
[ISP Colorspace]
====> REC709_FULL
[ISP Cfg Version Name]
====> gc2083_mipi_isp603_20241205_171656_final_rgb_suit
[ISP Libs Commit Version]
====> commit: b821ee6be69ccb9b847874aae1a3d8fb3fbb1e05
*****************************************************
```

ISP 节点参数说明

| 参数 | 描述 |
| --- | --- |
| exp | 当前环境曝光时间，其中16代表一行曝光 |
| gain | 当前环境下的增益，其中16代表一倍增益 |
| lum\_idx | 当前环境下的曝光idx值 |
| coms\_temp | 当前环境下的设备温度，需要实现高温功能 |
| color\_temp | 当前环境下的awb统计的色温值 |
| rgain | 当前环境下的awb r通道补偿 |
| bgain | 当前环境下的awb b通道补偿 |
| contrast | 对比度叠加强度，通过应用接口调用设置 |
| sharp | 锐化叠加强度，通过应用接口调用设置 |
| bright | 亮度叠加强度，通过应用接口调用设置 |
| satur | 饱和度叠加强度，通过应用接口调用设置 |
| tdnf | d3d去噪叠加强度，通过应用接口调用设置 |
| bdnf | d2d去噪叠加强度，通过应用接口调用设置 |
| pltm | pltm叠加强度，通过应用接口调用设置 |
| ISP Colorspace | ISP色域空间 |
| ISP Cfg Version Name | 当前使用的效果文件名 |
| ISP Libs Commit Version | 当前的ISP库版本号 |

### 如何排查连接图像调试工具失败

先根据本文的第2.5章节离线调试和在线调试介绍，确认awTuningApp的执行脚本、确认awTuningApp是从哪里拿到的、确认TigerISP连接界面填写的参数（sensorname、尺寸、帧率等）  
在线调试的情况下，执行脚本为`./awTuningApp 8848 1 &` ， 离线调试的情况下，执行脚本为`./awTuningApp 8848 0 &`  
awTuningApp必须从SDK对应路径获取

-   `V821` 常电的 `awTuningApp` 路径： `\platform\allwinner\vision\libAWIspApi\isp_mpp\isp_v821\libisp\tuning_app`
-   `V821` 快启的 `awTuningApp` 路径： `\rtos\lichee\rtos-hal\hal\source\vin\vin_isp\isp_server\out`
-   `V85X` 常电的 `awTuningApp` 路径： `\external\eyesee-mpp\middleware\sun8iw21\media\LIBRARY\libisp\tuning_app`
-   `V85X` 快启的 `awTuningApp` 路径： `\lichee\rtos-hal\hal\source\vin\vin_isp\isp_server\out`

如果均已按照上述的规范来连接，还是连接不上，请确认调试工具填写的尺寸帧率等配置是否填写正确，有两种常见方法可以确认是否填写正确

1、执行awTuningApp后，进入设备端`tmp`路径，找到如下图所示文件夹`isp1_1920_1080_20_0`

其中isp1代表使用的ispid为1  
1920代表宽，1080代表高  
20代表帧率  
0代表非WDR模式

![TigerISP连接异常排查1](data:image/png;base64,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)

2、抓取vi节点，通过打印的尺寸及帧率等即可确定，但这里打印的帧率不一定为vi初始化时使用的帧率，存在降帧影响导致帧率误差

### 如何排查灯光高亮边缘存在彩条

![灯光高亮区异常色彩](images/灯光高亮区异常色彩-189752697f45ca9aca7426b2558872d6.jpg)

如出现此类异常问题，请按照步骤进行排查

**Step1**：离线连接调试工具，导入现有参数并确认能复现到问题，离线调试预览的是未过编码的图像，可以排除编码影响  
**Step2**：依次关闭ISP相关模块，定位是否是ISP某个模块导致的偏色  
**Step3**：关闭d3d后，发现彩条消失，能确定是sensor在高亮区彩噪偏大，经过d3d后彩噪被定住导致彩条  
**Step4**：根据上述排查思路，通过降低d3d的降噪强度,使得d3d不要将低频彩噪定住，可优化彩条问题

### 如何调用接口使用AE ROI模式

针对门锁、IPC等客户，需要使用AE ROI模式，通过设置AE ROI参数，使得指定区域的曝光能够达到预期效果。

快启方案使用方法如下所示：

```
    //使用方式
    isp_ctrl_attr.isp_attr_cfg.cfg_id = RT_ISP_CTRL_AE_ROI_TARGET;
    isp_ctrl_attr.isp_attr_cfg.ae_roi_area.enable = 1; //使能AE ROI
    isp_ctrl_attr.isp_attr_cfg.ae_roi_area.force_ae_target = forceAeTarget; //AE预期目标亮度,值越大则指定区域的曝光越大
    isp_ctrl_attr.isp_attr_cfg.ae_roi_area.coor.x1 = x1;
    isp_ctrl_attr.isp_attr_cfg.ae_roi_area.coor.y1 = y1;
    isp_ctrl_attr.isp_attr_cfg.ae_roi_area.coor.x2 = x2;
    isp_ctrl_attr.isp_attr_cfg.ae_roi_area.coor.y2 = y2;
    ret = AWVideoInput_SetIspAttrCfg(id, &isp_ctrl_attr);
```

快启方案关于坐标设置请务必注意，统计窗口是将全图坐标归一化到\[-1000,1000\]，因此坐标设定请按照下述坐标设置。

![修改白平衡统计窗口示例2](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABBwAAAJwCAIAAAClH+VJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACCGSURBVHhe7d1tlhTJsQRQ7WfWo/3MerQe7UePKswE/YEzdDg8BXPvnwHL7MpKOO4erpGO/vEfAACAA5YKAADgiKUCAAA4YqkAAACOWCoAAIAjlgoAAOCIpQIAADhiqQAAAI5YKgAAgCOWCgAA4IilAgAAOGKpAAAAjlgqAACAI5YKAADgiKUCAAA4YqkAAACOWCoAAIAjlgoAAOCIpQIAADhiqQAAAI5YKgAAgCOWCgAA4IilAgAAOGKpAAAAjlgqAACAI5YKAADgiKUCAAA4YqkAAACOWCoAAIAjlgoAAOCIpQIAADhiqQAAAI5YKgAAgCOWCgAA4IilAgAAOGKpAAAAjlgqAACAI5YKAADgiKUCAAA4YqkAAACOWCoAAIAjlgoAAOCIpQIAADhiqQAAAI5YKgAAgCOWCgAA4IilAgAAOGKpAAAAjlgqAACAI5YKAADgiKUCAAA4YqkAAACOWCoAAIAjlgoAAOCIpQIAADhiqQAAAI5YKgAAgCOWCgAA4IilAgAAOGKpAAAAjlgqAACAI5YKAADgiKUCAAA4YqkAAACOWCoAAIAjlgoAAOCIpQIAADhiqQAAAI5YKgAAgCOWCgAA4IilAgAAOGKpAAAAjlgqAACAI5YKAADgiKUCAAA4YqkAAACOWCpW/PvPP/7xjz/+/Hd++z3/+ucP3Lzi3Sc+v/Vnry9+7NKH/Yw/kF/wyp8esf+9AQDuY6lY8Dhb/vNf+c13PO59czj9qb7xxOdBOd/6+esv1z926YN+xh/IL3zlH/m7BwD4XVkqjv31Y2XvfPxz8wz9bd984uvT8eOGvMXHLn3IN7/egW9+5k965ccNW98dAOBSlopDr8+Uz0PoV6fO179/eHPe/enePHEIPnbpmx63vHz/tz/0Fz7mh33/u34JPnYpbBUAAJaKM++cKF+sEW+OoA/vhj/V6yc+v+OLk/5/k49dGjye/fU977z9z/gD+XWv/Eh+7V8nAMD/GEvFmU9H17fnyee58xG/PYA+/YUz9OOW97z9sL/k9ROfH//+WfljlyYvH/76qzx8K3vP955Wrz/z+Xk//F7DpS8e0csEAODvxVJx5FvHyedZ9I8/vnHifn3e/fleP/Fjx+jh0ujrpz9+/eYHvr5hy+vPHL78xy598Yh+7d8nAMD/FkvFkcdx8uUBs56n0eHa8iH0edT94vVzXz/xY8fo4dLsy+Mfv3p7/5frP+B/55Uf0fLfJwDAVSwVRx7HyZcHzM+eJ8+n967+hTP08zD7jvc+7i94/cTn93vxFf57x8cufUfve/zznVd472Me2Xv+6p/A68/8ia/8uOlVBADwt2KpOPPpiPn2OPk8iX46/L49kX72zrn0J3vzxH7F+uqGj136jsdP/vHnn5/uf28p+Bl/IL/wlR/3vPdaAAB/F5aKM58Pyy/OmM9j6NdH0tdn0J9yhp6988RH1KPwq5Pzhy49rny5743HzY//kcm7t7zz9Y6985kfeq/p0mfPV/ulf50AAP9jLBWHXp8on0fQr4Ln71+dQx/Zrz2Fvv/Ez9/t6fVB+YcvPdLXd77wPI9/45b3v96Z9z/zh9/rabhkpwAAsFQseJw4x+P038H3T9a/69nbTgEAYKlY4Fj53Kz+ljuFv3sAgE8sFSue//2Yv/2/rhj8nv865/FWVgoAAEsFP9njP8v/xNkbAOD3ZakAAACOWCoAAIAjlgoAAOCIpQIAADhiqQAAAI5YKgAAgCOWCgAA4IilAgAAOGKpAAAAjlgqWPD4/8wGgN9RRh0wUiosSN8FgN9ORh0wUiosSN8FgN9ORh0wUiosSN8FgN9ORh0wUiosSN8FgN9ORh0wUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCFMswqKTBSKixI362kAHChDLNKCoyUCgvSdyspAFwow6ySAiOlwoL03UoKABfKMKukwEipsCB9t5ICwIUyzCopMFIqLEjfraQAcKEMs0oKjJQKC9J3KykAXCjDrJICI6XCgvTdSgoAF8owq6TASKmwIH23kgLAhTLMKikwUiosSN+tpABwoQyzSgqMlAoL0ncrKQBcKMOskgIjpcKC9N1KCgAXyjCrpMBIqbAgfbeSAsCF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)

常电方案使用方法如下所示：

```
    //常电方案使用接口  AW_S32 AW_MPI_ISP_AE_SetRoiArea(ISP_DEV IspDev, SIZE_S Res, RECT_S RoiRgn, AW_U16 ForceAeTarget, AW_U16 Enable)
    //使用方法
    Res.Width = 1920;     // 设置图像分辨率
    Res.Height = 1080;
    RoiRgn.X = 0;         // 设置ROI区域，其中（x,y）为ROI区域左上角坐标，（width,height）为ROI区域宽高
    RoiRgn.Y = 0;
    RoiRgn.Width = 640;
    RoiRgn.Height = 480;
    AW_U16 ForceAeTarget = 50;
    ret = AW_MPI_ISP_AE_SetRoiArea(IspDev, Res, RoiRgn, ForceAeTarget, 1);
```

### 如何实现软光敏模式

软光敏的设计方案：通过软件上获取相关参数（亮度信息+红外光分量）来判断当前环境状态，且是否要切换场景，从而替代硬件光敏感知环境亮度

其主要实现接口如下：

1.  &lt;AW\_MPI\_ISP\_GetEnvLV>获取当前图像亮度等级（存在负值），此参数值可初步表征当前场景亮度，亮度越高参数值越高，亮度越低参数值越低
2.  &lt;AW\_MPI\_ISP\_GetAwbGainIr>获取当前图像中红外光分量等级（awb\_rgain\_ir、awb\_bgain\_ir），两个参数值可以在红外夜视下初步表征当前图像中红外光分量的程度，数值越高，红外光分量程度越高
3.  &lt;AW\_MPI\_ISP\_SwitchIspConfig>切换 ISP 效果
4.  &lt;AW\_MPI\_VENC\_SetColor2Grey>设置编码通道颜色

如需了解更详细的实现流程，请通过一号通浏览《V系列Camera-IPC产品软光敏方案开发指南》了解

### 如何排查快启方案前几帧图像异常

#### 快启方案介绍

快启异构方案出图基本流程如下图所示，可以大概分为以下三个流程：

1.  Boot0引导melis系统（rtos系统）启动，melis系统启动后初始化sensor、CSI和ISP硬件以及初始化ISP算法库，图像开始采集并且ISP库对图像开始处理。
    
2.  Boot0引导Linux系统启动，然后等待melis的通知，melis系统对图像处理后关闭CSI和ISP硬件并发消息告知Linux系统。
    
3.  Linux系统打开CSI和ISP硬件开始接收图像，并把图像信息发送给melis系统的ISP算法库对图像进行处理，处理结果再发送回给Linux系统的ISP硬件，双系统协同完成图像的接收和处理。
    

#### 快速收敛图像的三种方案介绍

Melis 系统sensor首帧初始化目前支持预取值模式、高帧率模式、硬光敏模式和硬光敏高帧率模式，通过mmelis menuconfig选择配置，如下：

![快起ISP模式配置](images/快起ISP模式配置-f1dfe2874992b9647db468aba80beffc.png)

1.  read ae threshold from flash：预取值模式，指的是sensor的初始化曝光增益使用的是上一次系统关闭时候保存在flash的曝光和增益，以保证首帧曝光增益正常。
    
    优点就是出图时间快，缺点是场景变化会导致下一次出图曝光增益不准。
    
2.  use HFR to make AE&AWB fast stability(HFR)：高帧率模式（也称软光敏模式），指的是先使用低分辨高帧率先计算出曝光增益和白平衡，然后再切换到目标帧率，以得到当前环境正确的曝光增益和白平衡。
    
    优点就是首帧曝光增益和白平衡比较正常，缺点是比较耗时，特别是夜视需要开启ir\_cut，所以夜视出图耗时需要增加200ms。
    
3.  ISP\_ONLY\_HARD\_LIGHTADC（GPADC）：硬光敏模式，指的是读取光敏电阻数值从而得到当前环境的亮度，所以可以在boot0就判断当前环境的亮度，提前控制ir\_cut和红外补光，进入melis系统后通过提前标定光敏电阻gpadc数值与曝光增益关系的得到关系表，从而使得冷启动后获取当前环境gpadc数值经查询关系表得出sensor的曝光增益，从而保证首帧曝光增益正常。
    
    优点就是出图时间快，但是曝光增益准确性依赖于光敏电阻的精度，缺点是增加成本且首帧白平衡会有偏差。
    
4.  use hard light\_adc to make AE&AWB fast stability(GPADC&HFR)：硬光敏高帧率模式，指的是读取光敏电阻数值从而得到当前环境的亮度，所以可以在boot0就判断当前环境的亮度，提前控制ir\_cut和红外补光，进入melis系统的时候再使用高帧率模式收敛曝光增益和白平衡。
    
    由于提前在boot0就控制了it\_cut，所以优点就是出图比第二种高帧率模式快，而且首帧曝光增益和白平衡也比较正常，缺点是增加成本。
    

#### 快起前几帧图像异常的排查方法

##### 前几帧图像颜色异常

**预取模式**

1、确保在稳定环境下，搭配当前使用的效果文件抓取isp\_reg更新

预取模式下，前三帧图像用的是isp\_reg中设置的rgain/bgain，等三帧后才是是白平衡算法设置的增益

2、检查效果参数中的isp\_color\_temp不能设置太极端

白平衡算法的初始色温值使用的效果文件中的isp\_color\_temp，isp\_color\_temp值越大，初始化色温越偏高色温，初始化的图像可能会更偏黄，如下图所示

![快起白平衡偏色1](images/快起白平衡偏色1-7c1b4e143638159195443dd3d33b4124.png)

**高帧率模式**

1、确保高帧率效果参数的AWB相关参数与低帧率的一致

高帧率模式下，会使用高帧率参数进行AE及AWB的收敛，因此需要确保高帧率下的效果参数能将白平衡做准

2、抓取高帧率isp\_reg更新，并检查高帧率效果参数中的isp\_color\_temp不能设置太极端

3、检查小核打印awb是否收敛完成

默认高帧率是跑15帧，如果发现小核打印中收敛帧率已经到了15帧，说明可能还没收敛完，调试阶段可以把高帧率的稳定帧数设置大一点确保高帧率时候awb是完全稳定

![快起白平衡偏色2](images/快起白平衡偏色2-8bac9b8c2697848135d173144515c089.png)

##### 前几帧图像亮度异常

**预取模式**

1、确认小核sensor驱动是否实现从flash中读取曝光增益

预期模式下，AE会从flash中获取上次ISP退出时候的曝光增益并从第一帧设置给sensor作为初始化的曝光增益。

![快起亮度异常1](images/快起亮度异常1-4747f1213ef24e7422fc47b44be03353.png)

2、确认flash中读取的曝光增益是否与上一次退出时保存的曝光增益值一致

预期模式下，除初始化vin时使用的是小核驱动曝光外，跳到内核出流都是通过linux的sensor驱动控制曝光增益，因此通过在大小核中的曝光函数中加打印即可确认。如果不一致的话，请确认dts中分区情况是否调整，导致isp保存及读取的地址存在异常。

**高帧率模式**

1、确认小核sensor驱动是否实现从flash中读取曝光增益

2、确认高帧率收敛后的曝光增益值是否已经稳定

默认高帧率是跑15帧，如果发现小核打印中收敛帧率已经到了15帧，说明可能还没收敛完，调试阶段可以把高帧率的稳定帧数设置大一点确保高帧率时候ae是完全稳定

3、确保高帧率效果参数的亮度相关参数与低帧率同步好

-   高帧率模式参数头文件中的ae table的min\_exp和ae\_max\_lv需要与线性模式一致，且ae table的max\_gain需要提高（例如：低帧率用的是30fps，最大增益设置为20000；在120fps高帧率下最大增益需要设置为 120 \* 20000 / 30 = 80000）。
    
-   高帧率模式参数头文件中ae target需要与线性模式的一致；一般情况下低帧率的彩色模式和红外模式下的AE target差异较小时可共用一份高帧率参数；如差异较大，高帧率可以分别使用彩色模式和红外模式两份效果头文件。
    
-   低帧率模式ISP参数头文件中PLTM manual\_strength代表首帧的PLTM强度，需要填写各ISO下稳定时的PLTM实际强度。
    
-   高帧率模式ISP参数头文件中ae tolerance越大，切换低帧率的时间越快，首帧的AE、AWB准确性越低；反之，切换低帧率的时间越慢，首帧的AE、AWB准确性越高。
    

**硬光敏模式**

1、确认硬光敏是否完成标定，能覆盖到户外照度到低照度的各个照度

2、检查硬光敏设置的曝光值是否基本符合要求

:::note

:::note

备注

:::
:::note

-   上述是各模式下的图像异常的常见排查流程，但实际应用场景中会包含更多要素，如是否开关灯及切ircut等工作在流程的哪个位置执行、aiisp切换包含8bit到10bit效果差异等，需要结合上述排查流程并结合实际场景进行排查。
-   软光敏模式下，设备烧录固件第一次上电，flash使用的是默认值，无法实现首帧曝光正常；此外如果上一次上电的环境与本次上电的环境的亮度差异较大，也无法保证首帧曝光正常。
-   如想了解快启ISP更多信息，请通过一号通浏览《Tina\_Linux\_异构快启Camera\_使用指南》了解

:::

:::

### 关于编码及Encpp如何影响图像

Encpp是编码锐化模块，在ISP调试过程中，Encpp起到了非常重要的作用，由于Encpp模块开关由应用及ISP效果共同决定，在调试前，务必确认Encpp模块是否生效。

-   确认方法：在线连接调试工具，在调试工具中分别开关Encpp模块，分别观察图像的变化，如果没有变化，请确认应用接口是否调用正确
-   编码参数配置对画质有很大影响，如果客户对画质要求较高，那么建议通过调整编码参数使画质效果进一步提升

抓取VE节点后，可参考下述介绍

编码2D3D使能： 打开使能后，编码码控效果更好，在运动、晃动等场景下，码率能有效降低，但一定程度上会影响清晰度，如对画质要求高可关闭  
区域联动使能： 编码新策略，使用该策略能更好的平衡运动、静止、平坦、细节区域的ISP降噪强度，新版编码库上有支持，建议打开  
Encpp使能： 编码锐化使能，建议打开  
VE ISP联动使能： 编码ISP联动使能，用于ISP和VE之间进行信息传递，用以优化编码码率及ISP效果，建议打开  
码率编码策略及QP： 码率越大，通常图像效果更佳，在图像调试前，必须先与竞品对齐码率,编码策略及QP值可按照默认设置

![编码节点介绍](images/编码节点介绍-3ab4d637d59144b9e39d995b08f139ee.png)

:::note

:::note

备注

:::
:::note

-   如对编码有更高调试要求或希望了解更多，请通过一号通浏览《Tina\_Linux\_编码码率控制\_使用指南》了解

:::

:::

### 如何在编码码流中插入SEI信息

SEI全称"Supplemental Enhancement Information"，SEI是h264/h265规范中定义的字段，可以用来插入辅助增强信息。我们把ISP和VENC 在编码过程中的实时信息作为SEI插入码流中，便于后续从码流数据中分析视频采集的ISP参数和编码参数。

mpp平台和rt\_media都可以支持。

#### mpp打开SEI功能

mpi\_venc组件接口：

```c
ERRORTYPE AW_MPI_VENC_ConfigSEI(VENC_CHN VeChn, const VENC_SEI_ATTR *pAttr);
```

设置mpi\_venc组件通道的SEI模式和参数。

数据结构VENC\_SEI\_ATTR的定义如下：

```c
typedef enum {
    VencSei_Disable = -1,
    VencSei_FollowShellSet = 0, // check /tmp/sei_venc_chn
    VencSei_Enable = 1,
}VencSeiEnableSettingE;

typedef struct
{
    VencSeiEnableSettingE eSeiEnableSetting;
    int nSeiDataTypeFlags; //SEIDataType_ISP, SEIDataType_VIPP, SEIDataType_VENC
    ISP_DEV nIspDev;
    VI_DEV nVipp;
    int nFrameIntervalForISPLevel1; //Exp
    int nFrameIntervalForISPLevel2; //Colortmp
    int nFrameIntervalForISPLevel3; //Awb
    int nFrameIntervalForVIPP;
    int nFrameIntervalForVencLevel1; //nSceneStatus, nMoveStatus
    int nFrameIntervalForVencLevel2; //nMadTh,bOnlineEn
}VENC_SEI_ATTR;
```

数据结构VENC\_SEI\_ATTR的成员说明如下：

* * *

成员名称 描述

* * *

eSeiEnableSetting 3种SEI模式:  
VencSei\_Disable: 关  
VencSei\_Enable: 开  
VencSei\_FollowShellSet: mpi\_venc组件从配置文件 "/tmp/sei\_venc\_chn"读取要开启SEI功能的编码通道号，将这些 编码通道开启SEI功能。编码通道号之间用空格隔开。例如用户 可以在程序运行时，在串口终端输入 `echo "0 2 4" >/tmp/sei_venc_chn`，即表示打开编码通道0, 2,4的SEI功能。删除配置文件`rm /tmp/sei_venc_chn`或清空配 置文件`echo >/tmp/sei_venc_chn`，就表示关闭所有编码通道 的SEI功能。

nSeiDataTypeFlags 指定要包含的SEI数据种类，目前设计了3种类型: SEIDataType\_ISP, SEIDataType\_VIPP, SEIDataType\_VENC。其 中VIPP类型尚未实现。

nIspDev 指定视频帧来源的Isp设备号。

nVipp 指定视频帧来源的VIPP设备号。

nFrameIntervalForISPLevel1 ISP的level1等级的信息在视频帧中出现的频率，即多少帧携带 一笔ISP level1等级的信息。ISP驱动决定哪些信息是level1 的，例如曝光信息Exp等。level1是长度较少的信息，可以多次 出现而不影响码率。

nFrameIntervalForISPLevel2 ISP的level2等级的信息在视频帧中出现的频率，即多少帧携带 一笔ISP level2等级的信息。ISP驱动决定哪些信息是level2 的，例如色温Colortmp等。level2是长度稍长的信息，出现频率 要稍小一点，避免影响码率。

nFrameIntervalForISPLevel3 ISP的level3等级的信息在视频帧中出现的频率，即多少帧携带 一笔ISP level3等级的信息。ISP驱动决定哪些信息是level3 的，例如白平衡Awb等。level3是长度较长的信息，有时长达 10KB，出现频率要严格控制，避免影响码率。

nFrameIntervalForVIPP 未实现。

nFrameIntervalForVencLevel1 VENC的level1等级的信息在视频帧中出现的频率，即多少帧携带 一笔VENC level1等级的信息。VENC驱动决定哪些信息是level1 的，例如nSceneStatus, nMoveStatus等。level1是长度较少的 信息，可以多次出现而不影响码率。

nFrameIntervalForVencLevel2 VENC的level2等级的信息在视频帧中出现的频率，即多少帧携带 一笔VENC level2等级的信息。VENC驱动决定哪些信息是level2 的，例如nMadTh,bOnlineEn等。level2是长度稍长的信息，出现 频率要稍小一点，避免影响码率。

* * *

各等级信息出现的帧间隔推荐如下：

```
nFrameIntervalForISPLevel1 = 5
nFrameIntervalForISPLevel2 = 20
nFrameIntervalForISPLevel3 = 200

nFrameIntervalForVencLevel1 = 20
nFrameIntervalForVencLevel2 = 200
```

mpi\_venc支持3种SEI模式，默认使用VencSei\_FollowShellSet模式。在该模式下，mpi\_venc组件从配置文件"/tmp/sei\_venc\_chn"读取要 开启SEI功能的编码通道号，将这些编码通道开启SEI功能。编码通道号之间用空格隔开。因此用户可以在程序运行时，在串口终端通过 shell指令修改/tmp/sei\_venc\_chn的内容，从而实时配置各个视频编码通道的SEI功能。例如输入`echo "0 2 4" >/tmp/sei_venc_chn`， 即表示打开编码通道0,2,4的SEI功能。删除配置文件`rm /tmp/sei_venc_chn`或清空配置文件`echo >/tmp/sei_venc_chn`，就表示关闭 所有编码通道的SEI功能。

用户可以在串口终端执行`cat /sys/kernel/debug/mpp/ve_base`查询到当前正在工作的视频编码通道号。

#### rt\_media打开SEI功能

AWVideoInput的接口：

```c
int AWVideoInput_VENC_ConfigSEI(int channel, AWVideoInput_SeiAttr *pAttr)
```

数据结构AWVideoInput\_SeiAttr的定义如下：

```c
typedef enum {
    AWVideoInput_SeiDisable = -1,
    AWVideoInput_SeiFollowShellSet = 0, // check /tmp/sei_rtmedia_chn
    AWVideoInput_SeiEnable = 1,
}AWVideoInput_SeiEnableSettingE;

typedef struct {
    AWVideoInput_SeiEnableSettingE eSeiEnableSetting;
    int nSeiDataTypeFlags; //RTSEIDataType_ISP, RTSEIDataType_VIPP, RTSEIDataType_VENC
    int nFrameIntervalForISPLevel1; //Exp
    int nFrameIntervalForISPLevel2; //Colortmp
    int nFrameIntervalForISPLevel3; //Awb
    int nFrameIntervalForVIPP;
    int nFrameIntervalForVencLevel1; //nSceneStatus, nMoveStatus
    int nFrameIntervalForVencLevel2; //nMadTh,bOnlineEn
} AWVideoInput_SeiAttr;
```

数据结构AWVideoInput\_SeiAttr的成员说明如下：

* * *

成员名称 描述

* * *

eSeiEnableSetting 3种SEI模式:  
AWVideoInput\_SeiDisable: 关  
AWVideoInput\_SeiEnable: 开  
AWVideoInput\_SeiFollowShellSet: rtmedia通道从配置文 件"/tmp/sei\_rtmedia\_chn"读取要开启SEI功能的rtmedia通 道号，将这些通道开启SEI功能。rtmedia通道号之间用空格 隔开。例如用户可以在程序运行时，在串口终端输入 `echo "0 2 4" >/tmp/sei_rtmedia_chn`，即表示打开通道 0,2,4的SEI功能。删除配置文件 `rm /tmp/sei_rtmedia_chn`或清空配置文件 `echo >/tmp/sei_rtmedia_chn`，就表示关闭所有rtmedia 通道的SEI功能。

nSeiDataTypeFlags 指定要包含的SEI数据种类，目前设计了3种类型: RTSEIDataType\_ISP, RTSEIDataType\_VIPP, RTSEIDataType\_VENC。其中VIPP类型尚未实现。

nFrameIntervalForISPLevel1 ISP的level1等级的信息在视频帧中出现的频率，即多少帧 携带一笔ISP level1等级的信息。ISP驱动决定哪些信息是 level1的，例如曝光信息Exp等。level1是长度较少的信 息，可以多次出现而不影响码率。

nFrameIntervalForISPLevel2 ISP的level2等级的信息在视频帧中出现的频率，即多少帧 携带一笔ISP level2等级的信息。ISP驱动决定哪些信息是 level2的，例如色温Colortmp等。level2是长度稍长的信 息，出现频率要稍小一点，避免影响码率。

nFrameIntervalForISPLevel3 ISP的level3等级的信息在视频帧中出现的频率，即多少帧 携带一笔ISP level3等级的信息。ISP驱动决定哪些信息是 level3的，例如白平衡Awb等。level3是长度较长的信息， 有时长达10KB，出现频率要严格控制，避免影响码率。

nFrameIntervalForVIPP 未实现。

nFrameIntervalForVencLevel1 VENC的level1等级的信息在视频帧中出现的频率，即多少帧 携带一笔VENC level1等级的信息。VENC驱动决定哪些信息 是level1的，例如nSceneStatus, nMoveStatus等。level1 是长度较少的信息，可以多次出现而不影响码率。

nFrameIntervalForVencLevel2 VENC的level2等级的信息在视频帧中出现的频率，即多少帧 携带一笔VENC level2等级的信息。VENC驱动决定哪些信息 是level2的，例如nMadTh,bOnlineEn等。level2是长度稍长 的信息，出现频率要稍小一点，避免影响码率。

* * *

rtmedia支持3种SEI模式，默认使用AWVideoInput\_SeiFollowShellSet模式。在该模式下，rtmedia通道从配置文件 "/tmp/sei\_rtmedia\_chn"读取要开启SEI功能的rtmedia通道号，将这些通道开启SEI功能，通道号之间用空格隔开。因此用户可以在程序 运行时，在串口终端通过shell指令修改"/tmp/sei\_venc\_chn"的内容，从而实时配置各个rtmedia通道的SEI功能。例如输入 `echo "0 2 4" >/tmp/sei_rtmedia_chn`，即表示打开rtmedia通道0,2,4的SEI功能。删除配置文件`rm /tmp/sei_rtmedia_chn`或清空配 置文件`echo >/tmp/sei_rtmedia_chn`，就表示关闭所有rtmedia通道的SEI功能。

#### 如何解析SEI信息

使用上述方法打开SEI功能后录制出来的码流中会包含SEI信息，可通过下述方式进行解析，当前只支持H264/H265格式的裸码流解析。

##### 使用TigerISP调试工具进行解析

1、打开TigerISP调试工具，选择V821平台，点击OK，打开TigerISP调试工具，这里不需要连接板端设备。

2、点击菜单栏的Extra Tools，选择Play后跳出Play窗口，模式选为File，根据码流格式选择H264或H265，然后点击Browse，选择码流文件,即可完成解析。

![SEI解析1](images/SEI解析1-a867523dc26fe60da90aa061263a5ece.png)

3、解析出来的SEI信息生成在码流同级目录下。

![SEI解析2](images/SEI解析2-ce7e4eade8e006a582bbaa2cdaa75e89.png)

##### 使用解析程序进行解析

使用编译好的解析程序，在控制台进行执行，执行指令后面加多一个 “V85X”或 “V82X”配置参数，可指定版本。不加这个配置参数，默认为V82X，除此外还需加上码流文件路径参数，即可实现解析。

![SEI解析3](data:image/png;base64,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)

#### 如何基于解析的SEI信息检查AWB落点情况

1、如果是V821的SEI信息，请打开TigerISP调试工具，选择A733平台，默认打开即可，如果是V85X平台，则选择A523平台打开调试工具。

2、导入当前使用的效果文件dat文件

3、点击菜单栏的Extra Tools，选择JpegExt,点击Load TXT，选择SEI信息文件，即可实现检查AWB落点信息。

![SEI解析4](images/SEI解析4-a9e98f46a61b80d180cf93923eb20590.png)

#### 如何修改SEI中各模块频率

以mpi\_venc组件从配置文件VencSei\_FollowShellSet为例，调用VideoEncConfigSEI接口前需要配置各个模块的频率，其中isp区分了3个Level进行频率设置，如果需要修改个模块的频率可参考下述代码修改。

![SEI频率设置1](images/SEI频率设置1-80fdf264ac1f1ca0df35ed6ae4638163.png)

![SEI频率设置2](images/SEI频率设置2-e6dd880fc65592332de38ad894015236.png)
