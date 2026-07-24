---
sidebar_position: 4
---

# UVC/UAC - 模块场景搭建

UVC（USB Video Class）全称USB视频类，其定义适用于所有用于USB操纵视频和相关功能的复合设备中的所有设备或功能。v861平台UVC版本为1.1。

UAC （USB Audio Class）全称USB音频类，是一种通过USB连接传输音频数据的标准协议。它允许音频设备（如耳机、麦克风、音频接口、扬声器等）与计算机或其他支持USB的设备进行通信。USB Audio Class定义了音频设备与计算机或其他USB主机之间的数据交换方式，从而使音频设备能够在无需专用音频接口卡的情况下，直接通过USB接口与计算机连接。v861平台UAC版本为1.0。

UVC/UAC 支持功能：

-   支持MJPEG、H264、YUY2、NV12格式
    
-   支持ISOC/BULK传输模式
    

本文将展示如何将 v861 配置成为 USB 摄像头，通过 MIPI 摄像头输入图像，MIC 输入音频，通过 UVC/UAC 将音视频数据传输到 PC 端相机软件。将 v861 作为一个 USB 摄像头使用。

## 模块配置说明

SDK 提供快速配置 `quick_config` 方式来配置 UVC 模块，也可以手动配置模块功能。下面分别介绍快速配置和手动配置的方法。

### 快速配置

在`v861/`目录下运行`quick_config`

```bash
quick_config
```

![](images/fbdd1d98a39e4b18b45f6c66029bd1876815-a3615da910f43ad4c66974082064f6e5.png)

可见 `enable_uvc_and_demo` 选项，输入序号并回车。然后显示是否同意执行配置，输入 `Y` 回车

![](data:image/png;base64,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)

接下来 SDK 会自动配置该功能，结束后编译并打包固件。

```bash
make -j32
pack
```

打包可能会失败，出现如下提示

![](images/0b3b534acd584bda831616e16ad2779d1279-25b8bcd5d54fd04c626d00873f8338af.png)

解决方法: 执行 `auto_update_partition`，一路选择默认配置，会自动更新分区表并打包固件

```bash
auto_update_partition
```

![](images/ab48dc5e198b4588bf5f3341e4e3b99c2870-9bf70b258cde9ca7175fe3692ac21b02.png)

编译打包流程结束后可以在 `platform/allwinner/eyesee-mpp/middleware/sun252iw1/sample/bin` 找到应用程序，复制到 SD 卡插入开发板。

### 手动配置

-   #### 内核配置
    

在`v861/`目录下运行`m kernel_menuconfig`

```bash
m kernel_menuconfig
```

```
Device Drivers  --->
	{*}Multimedia support  --->
		Media drivers  --->
			[*]Media USB Adapters  --->
				<M>USB Video Class (UVC)
```

进入`Device Drivers`

![](images/a039c567a01e4edf9b79630b376c665e9392-ef8ad6efe3e37a7470e90e94e3a8fa7a.png)

`Y`勾选`Multimedia support`

![](images/d692253129594c6bbc2f0d3802f5a0bc8414-bbdf4e2cc9b7f879696c40075eaed8ac.png)

`Y`勾选`Media drivers`

![](images/94a91fec42734d15b09ecb7e8f7aa3501015-e0a587d91a25adc377520e0875642ee5.png)

`Y`勾选`Media USB Adapters`

![](images/2c9f91acc5b44197947da39db401a8678088-462a44340b2a8694c8684560080fb40d.png)

`M`勾选`USB Video Class`

![](images/7760bb3dae9947be84edddbbba5a592d5368-b903a7c5663e6c790e0619b92083b2c1.png)

##### 回到`kernel_menuconfig`最初页

```
Device Drivers  --->
	<*>Sound card support  --->
		<*>Advanced Linux Sound Architecture  --->
			[*]USB sound devices  --->
				<*>USB Audio/MIDI driver
```

进入`Device Drivers`

![](images/a039c567a01e4edf9b79630b376c665e9392-ef8ad6efe3e37a7470e90e94e3a8fa7a.png)

`Y`勾选`Sound card support` ,并回车进入

![](images/4483e64b0da84f7795a4617b09af698d7694-773cc75b5ebd6f8fd61b19d65eb9fc75.png)

`Y`勾选`Advanced Linux Sound Architecture`，并回车进入

![](images/0d55ed0a58e04a549f42b5db28b2abdb5826-b01826ec43b87996bbeaa6e10f890e66.png)

`Y`勾选`USB sound devices` ，并回车进入

![](images/d048947568e84e8a840fdb054c9282b65395-d6bc28281276713403ab006dee60b9cf.png)

`Y`勾选`USB Audio/MIDI driver`

![](images/88ac7d7052c4400587a0871ed676f5f83179-93c85e3c30b922cd23af519b0ed82b37.png)

##### 回到`kernel_menuconfig`最初页

```
Allwinner BSP  --->
	Device Drivers  --->
		USB Drivers  --->
			USB Gadget Drivers  --->
				<*>Allwinner USB Gadget support
                                <M>Allwinner USB Webcam function
                                <*>Allwinner Audio Class 1.0                            
```

进入`Allwinner BSP`

![](images/d0f23d8a5c7e4ee5963b8f58c520704e9071-056a74b6db34ee0762fa5bd49d20d4bf.png)

进入`Device Drivers`

![](images/6e9696ebcb7c4d18ab529bf7414c3d493597-1035abe7547f89964e380bf975e3eb5f.png)

进入`USB Drivers`

![](images/a793e908b71942d698e163c4f35d81e21477-12735c2266156a321e1695404ec5bad7.png)

进入`USB Gadget Drivers`

![](images/db5a7fe265fb461898602fa26b55cab05940-6e7e84638a42d8a63309ca991164d57d.png)

`Y`勾选`Allwinner USB Gadget support`

`M`勾选`Allwinner USB Webcam function`

`Y`勾选`Allwinner Audio Class 1.0`

![](images/55600483743d4c259feca0dfa225c2221434-d443d81fe2266de428b5b94ace45dcfc.png)

-   #### Tina配置
    

在`v861/`目录下运行`m menuconfig`

```bash
m menuconfig
```

```
Kernel modules  --->
	USB Support  --->
		<*> kmod-sunxi-uvc
```

进入`Kernel modules`

![](images/62b5b30918864847b1d25c9211ca7d574071-a1ddd95a5cd53189f585ec8766435edb.png)

进入`USB Support`

![](images/c98ad5cab95042ec85f3b6ace9e3fb7e2371-8dda2e0de451ff8e9cca2bd1fce3906a.png)

`Y`勾选`kmod-sunxi-uvc`

![](images/d08370d47aa7431f96c54f11cf35036c4032-242058847cfbb2f7a02bf0b5cd1dc293.png)

##### 回到`menuconfig`最初页

```
Allwinner  --->
	eyesee-mpp  --->
		[*] eyesee-mpp-middleware-demo config
                [*] select mpp sample  --->
                        [*] sample uvc in
                        [*] sample uvc_vo（要先勾选mpp sample uvc in才会出现这一项）
                        [*] sample uvcout                                                     
                        [*] sample uac
```

进入`Allwinner`

![](images/10eeeca573ce4ae682a0b93e994371915323-263f08498816bfb9f5a242f572ed56a6.png)

进入`eyesee-mpp`

![](images/c0a38e4b382843579fd9a44e1017913e2293-c336004cce4f43fd9c534e05bd4b98c6.png)

`Y`勾选`eyesee-mpp-middleware-demo config`  
`Y`勾选`select mpp sample`

![](images/ecc79b9fd0ee41268b3eee2356be2c4a4707-61bac3c135559c1a2f2cbeb5d634de12.png)

`Y`勾选`mpp sample uvc in`

`Y`勾选`mpp sample uvc_vo`（要先勾选`mpp sample uvc in`才会出现这一项）

`Y`勾选`mpp sample uvcout`

`Y`勾选`mpp sample uac`

-   这四个sample可以根据需要来开

![](images/8c208186846f49c2bf9d4e8c39964f756226-d056d309ac507c479dc91988ce4032f4.png)

##### 回到`menuconfig`最初页

```
Allwinner  --->
	eyesee-apps  --->
		<*> demo_uvc
```

进入`Allwinner`

![](images/10eeeca573ce4ae682a0b93e994371915323-263f08498816bfb9f5a242f572ed56a6.png)

进入`eyesee-apps`

![](images/27b3a4b4e3f14b6090ff15d27d4b8b1d2691-94b085e6aec590428c15ca5be6efa8e1.png)

`Y`勾选`demo_uvc`

![](images/9347fcc5eb5b41eb88d9b9eee0b357564653-3793833af78ae7a4b06f61b4fa3e25b1.png)

-   #### 设备树配置
    

```bash
vi ~/tina-v861/device/product/configs/bga_perf1/linux-6.6-xuantie/board.dts
```

找到`udc`节点

![](data:image/png;base64,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)

修改节点信息

```
&udc {
        status = "okay";
        aw,suspend_not_disconnect;     //增加此行
};
```

![](data:image/png;base64,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)

### 配置UVC设备

输入 `setusbconfig uvc` 即可配置 V 为 UVC 设备，可以看到提示新设备 Tina UVC

```
setusbconfig uvc
```

![](images/eb9367bea4654b9983e672ac5880883c3562-a0630d1adf6f5a3f34c2cd9df2f3c5aa.png)

可能会有这种报错，可以先不用理会

![](data:image/png;base64,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)

运行后,`ls /dev/video*`可以看到出现了新的 `video1` 节点

```bash
ls /dev/video*
```

![](data:image/png;base64,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)

PC 可以看到提示新设备 Tina UVC（也可能不提示，可以进设置，设备看看有没有Tina UVC设备）

![](images/9dcd466a2aac45c5b8d7c3fad76d28ad5458-fe02f3dc519ac296a66692e08db40058.png)

### 运行测试用例

这个用例

```
./sample_uvcout -D 0 -d 1 -B 10 &
```

| 参数   | 功能描述 | 示例 |
| --- | --- | --- |
| \-D / --vipp\_dev                       | 选择 vipp 设备。                   | \-D 0 表示选择 /dev/video0                         |
| \-d / --uvc\_dev                       | 选择 uvc 设备。                     | \-d 1 表示选择 /dev/video1                         |
| \-B / --bitrate                       | 设置 MJPEG/H264 流的比特率。       | \-B 5 表示设置比特率为 5 Mbps                     |
| \-s / --dual\_stream                   | 启用 MJPEG 插入 H264 流的功能。     | \-s 1 表示启用双流功能                             |
| \-s\_vipp\_dev / --dual\_stream\_vipp\_dev | 设置双流使用的 vipp 设备。         | \-s\_vipp\_dev 4 表示双流使用 /dev/video4           |
| \-b / --uvc\_bulk\_mode                 | 启用 UVC 批量传输模式。             | \-b 1 表示启用 UVC 批量传输模式                   |
| \-uac\_in / --uac\_in                   | 启用 UAC1 输入功能。               | \-uac\_in 1 表示启用 UAC1 输入功能                 |
| \-uac\_out / --uac\_out                 | 启用 UAC1 输出功能。               | \-uac\_out 1 表示启用 UAC1 输出功能                 |
| \-uac\_sr / --uac\_sample\_rate           | 设置 UAC1 音频采样率。             | \-uac\_sr 16000 表示设置 UAC1 音频采样率为 16000Hz |
| \-uac\_ch / --uac\_channel               | 设置 UAC1 音频通道数。             | \-uac\_ch 1 表示设置 UAC1 音频通道为 1             |
| \-uac\_bw / --uac\_bitwidth             | 设置 UAC1 音频位宽。               | \-uac\_bw 16 表示设置 UAC1 音频位宽为 16位         |
| \-uac\_aec / --uac\_aec                 | 启用音频 AEC（回声消除）功能。     | \-uac\_aec 1 表示启用音频回声消除功能               |
| \-uac\_agc / --uac\_agc                 | 启用音频 AGC（自动增益控制）功能。 | \-uac\_agc 1 表示启用音频自动增益控制功能           |
| \-uac\_ans / --uac\_ans                 | 启用音频 ANS（自动噪声抑制）功能。 | \-uac\_ans 1 表示启用音频自动噪声抑制功能           |
| \-enable\_dual\_uvc / --enable\_dual\_uvc | 启用双 UVC 设备功能。               | \-enable\_dual\_uvc 表示启用双 UVC 设备功能         |
| \-debug / --debug\_mode                 | 启用调试模式，发送图片。           | \-debug 1 表示启用调试模式，发送图片               |

PC端打开PotPlayer，`右键-->选项-->设备-->摄像头-->格式` 选择对应格式及分辨率角打开设备。

右键-->选项

![](images/ba2ed564882344ee84cbfc9b74d8127a6747-38d268f738243f6858a587736d462f0b.png)

设备-->摄像头

![](images/ccbc8af926dd4f1ca6bbf4873827dc4c8751-d27a722de982aa611a2f27dee73ebe14.png)

选择格式

![](images/617454e28bb2452b8be66282170572667595-3c93962a210ebec10282e2c7dbf86706.png)

应用并确定

![](images/daf068f552a841cfae0a733a1199d84e7071-b792bd271c22c886ff7c80526cb410a4.png)

`右键-->打开-->摄像头/其他设备`

![](images/a7734ffe064e420aa219d16af99e74529927-8802c023f7ee76d8da806cf06c7fcee0.png)

注意，此时应该不会有画面，还有可能有如下提示，这是正常的

![](images/8f0aa9923fb040aca89bc4e6a504677b4986-99bee558b7f3f703d4637a4396855f75.png)

### 配置支持格式与支持分辨率

修改`setusbconfig`脚本，路径如下：

```
platform/allwinner/usb/setusbconfig/setusbconfig
```

找到`enable_uvc`函数，修改如下代码格式为：

```
uvc_create_frame <format> <flag> <width> <height> <index>
```

```
...

uvc_create_frame mjpeg m 1920 1080 1
uvc_create_frame mjpeg m 1280 720 2
uvc_create_frame mjpeg m 640 480 3
uvc_create_frame uncompressed u 320 240 1
uvc_create_frame h264 h 1920 1080 1
uvc_create_frame h264 h 1280 720 2
uvc_create_frame nv12 nv12 320 240 1

...
```

![](images/cda967506e394c02b0f41cfc44f787018091-820d822c45d4fef13bcb18b0fa693687.png)

修改时注意，需要按照如上代码配置format、flag。相同格式下index从1开始递增，每个格式的 index 都是独立的。

### UVC BULK传输模式配置

使用如下指令初始化UVC BULK模式。

```
setusbconfig uvc,bulk
```

可能会有这种报错，可以先不用理会

![](data:image/png;base64,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)

使用测试用例加入`-b 1` 参数。

```
./sample_uvcout -D 0 -d 1 -B 10 -b 1 &
```

`右键-->打开-->摄像头/其他设备`

![](images/a7734ffe064e420aa219d16af99e74529927-8802c023f7ee76d8da806cf06c7fcee0.png)

可见potplay上有画面

![](images/ca34a8782c404639a1a47244b285f7039926-0c62f9b4319d262c168818d78e7ac1fd.png)

串口调试信息如下

![](images/015e100b9e1a48318dec686349fbb1122167-990312a261cb74778b2536dac733ea5f.png)

### 双路UVC设备

使用如下指令初始化双路UVC设备。

```
setusbconfig uvc,dual
```

![](images/5bf32cbc0a354839a51d66753836a1788113-fc4fdfdec2cb7fefb546e2c9bf600ae6.png)

使用如下指令测试：

```
sample_uvcout -D 0 -d 1 -B 10 -enable_dual 1 -D 4 -d 2 -B 10 &
```

接入Windows PC打开设备管理器可以看到两个UVC设备，使用potplayer打开对应的UVC设备进行预览。

![](images/7a22e5c069914393bfe5e09ba70268054522-c4a70e541784f87d410883b4fc54ed43.png)

![](images/39d635dbaef04ff9a94bda98a9e4f1954999-1f988c61f4abb73c1b97afb3d1db5b65.png)

## UVC 和 UAC1 复合设备的使用

### 初始化设备

勾选驱动后进行编译打包烧录，小机端串口输入：

```bash
setusbconfig uvc,uac1
```

切换到UVC+UAC1复合设备。

接入Windows PC后设备管理器会显示出UVC（UVC Camera）+UAC1（AC Interface）设备。（HD Audio 这个是电脑显示屏的，可以无视）

![](images/3a63127f0cf140bd9092ad75578f79953760-b91c89ae9f91c13a7cd4e4c2d4f2acb8.png)

### 运行测试用例

```
./sample_uvcout -D 0 -d 1 -B 5 -uac_in 1 -uac_out 1 -uac_sr 16000 -uac_bw 16 -uac_ch 1 -uac_aec 1 -uac_ans 1 -uac_agc 1
```

-   配置设备 0（`/dev/video0`）为视频输入设备，
    
-   配置设备 1（`/dev/video1`）为 UVC 视频输入设备，
    
-   设置视频流比特率为 5 Mbps，
    
-   启用音频输入输出功能，并设置音频相关参数（采样率、位宽、通道数等），
    
-   启用音频的回声消除、自动噪声抑制和自动增益控制功能。
    

Windows PC可在声音设置界面进行测试验证：

![](images/f739521fe0c34636b5d26ad83c8e3e2a1886-631498400f2a534c9eb8a8ad5c903757.png)

UAC1播放测试：

![](images/86251530fc8a44fb9079834c5d581c794660-c2f37c86bef510fc6580504f75b24b75.png)

UAC1采集测试：

![](images/4a6b720567944aec8354be3c4eaae7cd9955-1408a09c15bdc84a878b7db659f96033.png)

![](images/41c38dcc92ed4622bfc9ed3b5961dd2e8647-c976d407c0c655cb08f2709919b04312.png)

使用侦听功能进行测试验证。

### 默认参数修改

默认UAC1设备参数为支持双向对讲、16k采样率、16bit位宽、单通道，req size为200Bytes。

音频参数可通过`setusbconfig`脚本进行修改。

```
platform/allwinner/usb/setusbconfig/setusbconfig
```

找到如下位置进行修改。

```c
echo 0xef > /sys/kernel/config/usb_gadget/g1/bDeviceClass
echo 0x02 > /sys/kernel/config/usb_gadget/g1/bDeviceSubClass
echo 0x01 > /sys/kernel/config/usb_gadget/g1/bDeviceProtocol
[ -d /sys/kernel/config/usb_gadget/g1/functions/uac1.usb0 ] || {
mkdir /sys/kernel/config/usb_gadget/g1/functions/uac1.usb0

}

# playback and capture
echo 0x1 > /sys/kernel/config/usb_gadget/g1/functions/uac1.usb0/p_chmask
echo 0x1 > /sys/kernel/config/usb_gadget/g1/functions/uac1.usb0/c_chmask
echo 16000 > /sys/kernel/config/usb_gadget/g1/functions/uac1.usb0/p_srate
echo 16000 > /sys/kernel/config/usb_gadget/g1/functions/uac1.usb0/c_srate
echo 0x2 > /sys/kernel/config/usb_gadget/g1/functions/uac1.usb0/p_ssize
echo 0x2 > /sys/kernel/config/usb_gadget/g1/functions/uac1.usb0/c_ssize
echo 0x2 > /sys/kernel/config/usb_gadget/g1/functions/uac1.usb0/req_number
echo "Tina UVC,UAC1" > /sys/kernel/config/usb_gadget/g1/strings/0x409/product
ln -s /sys/kernel/config/usb_gadget/g1/functions/uac1.usb0/ /sys/kernel/config/usb_gadget/g1/configs/c.1/uac1.usb0
enable_uvc 0
```

| 参数     | 说明                                           | 默认值 |
| --- | --- | --- |
| p\_chmask | playback 音频通道数（0x1：单通道 0x3：双通道） | 0x1     |
| c\_chmask | capture 音频通道数（0x1：单通道 0x3：双通道）   | 0x1     |
| p\_srate   | playback 音频采样率                             | 16000   |
| c\_srate   | capture 音频采样率                             | 16000   |
| p\_ssize   | playback 音频位宽                               | 16     |
| c\_ssize   | capture 音频位宽                               | 16     |
| req\_num   | UAC1驱动req个数                                 | 2       |

> UAC1 out/capture指主机HOST到小机端Device，即小机端作为USB喇叭。

> UAC1 in/playback指小机端Device到主机端HOST，即小机端作为麦克风。

某些门锁猫眼板厂商会对 `UAC wMaxPacketSize` 大小有要求，这就需要对应修改。

例如在某某厂商某型号猫眼板，对模组的 `UAC wMaxPacketSize` 要求16 bytes。

![](images/002dac8dc2384473a20aa6ddad2a2a882431-89a9eb065594ea4e18279635e5d1dd6c.png)

在 V861上 `wMaxPacketSize` 在UAC1驱动中进行修改，如下图修改为16 bytes。

文件路径：

```
bsp/drivers/usb/gadget/function/u_uac1.h
```

修改 `UAC1_OUT_EP_MAX_PACKET_SIZE` 宏定义的数值。

```
#define UAC1_OUT_EP_MAX_PACKET_SIZE     16
```

![](images/e70f1724185b4dcbbda11c1818614cfa7333-a65bd6a41d24344e2ae2485ba56238a8.png)

## 常见问题

### PotPlayer 打开设备卡住最后显示未响应

问题现象：

![](images/83d5897e4543478689ded86a867f15696850-71148f4e1441064bf8dc72ca9e43135d.png)

问题分析：出现这个现象说明 UVC 设备未响应，那么大概率为小机端没有跑 UVC 测试用例或者打开的 `video` 节点不对。

问题排查步骤：

检查是否运行了 UVC 测试用例，是否 UVC 测试用例报错退出。

UVC设备节点也是 `/dev/video` 节点与VIPP的节点类似，需要分清楚。可以参考以下几种方式确认打开的UVC节点是否正确。

1.  执行 `setusbconfig uvc` 前后查看生成的video节点，如下图 UVC 节点为 `/dev/video1`

```c
root@(none):/# ls /dev/video*
/dev/video0  /dev/video4
root@(none):/# setusbconfig uvc
root@(none):/# ls /dev/video*
/dev/video0  /dev/video1  /dev/video4
root@(none):/#
```

2.  通过 `class` 设备模型确认，如下图 `video1` 节点为UVC节点

```c
root@(none):/# cat /sys/class/video4linux/video1/name
sunxi_usb_udc
root@(none):/# cat /sys/class/video4linux/video0/name
vin_video0
```

### BULK 模式 PotPlayer 打开失败或者黑屏无图像

问题现象：

1.  提示该没问题无法播放

![](images/a7c3828b54fa4209ab4f50470d2d17ad9290-99bee558b7f3f703d4637a4396855f75.png)

2.  进入了播放界面确没有图像显示

![](images/e0a82a9e3b6a4000a885c524cc5a6b115696-3aa11d99eb11e06328e91756b7181c72.png)

问题分析：V861 支持两种UVC传输模式，每个模式都需要配置对应的UVC设备描述符并且上层处理UVC协议逻辑也要对应选择。所以针对该问题需要对UVC设备描述符和上层应用逻辑一起分析。

问题排查步骤：

1.  接入PC使用 `usbview` 工具查看UVC设备描述符配置是否正确，如下图说明该设备为UVC BULK传输模式。

![](images/4000e2de721246c698c65f03b8561d121754-fb973d5f6531df7d86b4bcf5d50714eb.png)

![](images/c5255f5e08ca46f3bae1cb588323ebb18757-11ebe7c15d73f672028ae918ebf0caa1.png)

2.  UVC驱动通过驱动模块参数判断是否要配置为BULK模式，可根据如下来确认。

```
# 1代表UVC BULK模式
root@(none):/# cat /sys/kernel/config/usb_gadget/g1/functions/uvc.usb0/streaming_bulkep
1
# 0代表UVC ISOC模式
root@(none):/# cat /sys/kernel/config/usb_gadget/g1/functions/uvc.usb0/streaming_bulkep
0
```

3.  确认设备树`~/tina-v861/device/product/configs/bga_perf1/linux-6.6-xuantie/board.dts`中udc节点已经修改如下

```
&udc {
        status = "okay";
        aw,suspend_not_disconnect;     //增加此行
};
```

4.  确认UVC测试用例加入了 -b 1 参数

```bash
./sample_uvcout -D 0 -d 1 -B 10 -b 1 &
```

### UVC测试用例输出colorbar测试单UVC通路

加入 `-debug 1` 选项输出colorbar图像。

```bash
./sample_uvcout -D 0 -d 1 -B 10 -debug 1 &
```

### 如何修改音量大小

#### 采集音量大小设置

```c
platform/allwinner/eyesee-mpp/middleware/sun252iw1/sample/sample_uvcout/uac/uac.c

  
result = AW_MPI_AI_EnableChn(ai_dev, ai_chn);

if (result != SUCCESS)
{
    aloge("enable ai chn %d fail!", ai_chn);
    goto _destroy_ai_chn;
}

  
AW_MPI_AI_SetDevVolume(ai_dev, 80); //加入这句

  
while (1)
```

采集音量大小范围0~100，默认为80。

#### 播放音量大小设置

修改如下文件：

```c
platform/allwinner/eyesee-mpp/middleware/sun252iw1/sample/sample_uvcout/uac/uac.c
 

...
result = AW_MPI_AO_StartChn(ao_dev, ao_chn);
if (result != SUCCESS)
{
    aloge("ao dev %d ao chn %d start fail!", ao_dev, ao_chn);
    goto _destroy_ao_chn;
}
  

AW_MPI_AO_SetDevVolume(ao_dev, 80); //加入这句
  

while (1)
...
```

播放音量大小范围0~100，默认为80。
