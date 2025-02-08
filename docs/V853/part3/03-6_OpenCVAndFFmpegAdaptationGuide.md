---
sidebar_position: 6
---
# opencv和ffmpeg适配

## 0.前言

​	感谢Yuzuki大佬提供的两个支持包，原贴链接：https://bbs.aw-ol.com/topic/3427/

 	opencv支持包：[opencv.tar.gz](https://forums.100ask.net/uploads/short-url/5yNatU5BBvsoRGv8EGnIuOMEeaB.gz)

​	 ffmpeg支持包：[ffmpeg.tar.gz](https://forums.100ask.net/uploads/short-url/xqyLFwIcZoZwjEvxpORGdL1FHss.gz)

## 1.安装opencv和ffmpegopencv和ffmpeg适配指南

​	将下载的两个压缩包`opencv.tar.gz`和`ffmpeg.tar.gz`传入Ubuntu中，可以放置在任意目录中，假设我放在`/home/book/workspaces`目录下

```
book@100ask:~/workspaces$ ls
tina-v853-open     opencv.tar.gz     ffmpeg.tar.gz
```

解压两个压缩包输入

```
tar -xzvf opencv.tar.gz 
tar -xzvf ffmpeg.tar.gz 
```

例如：

```
book@100ask:~/workspaces$ tar -xzvf opencv.tar.gz 
opencv/
opencv/patches/
opencv/patches/010-uclibc-ng.patch
opencv/patches/020-l_tmpnam.patch
opencv/Makefile
opencv-sample/
opencv-sample/opencv-camera/
opencv-sample/opencv-camera/src/
opencv-sample/opencv-camera/src/main.cpp
opencv-sample/opencv-camera/src/Makefile
opencv-sample/opencv-camera/Makefile
opencv-sample/yolov5-post-opencv/
opencv-sample/yolov5-post-opencv/src/
opencv-sample/yolov5-post-opencv/src/main.cpp
opencv-sample/yolov5-post-opencv/src/Makefile
opencv-sample/yolov5-post-opencv/Makefile
book@100ask:~/workspaces$ tar -xzvf ffmpeg.tar.gz 
ffmpeg/
ffmpeg/patches/
ffmpeg/patches/030-h264-mips.patch
ffmpeg/patches/050-glibc.patch
ffmpeg/patches/010-pkgconfig.patch
ffmpeg/Config.in
ffmpeg/Makefile
```

将解压出来的文件拷贝到`tina-v853-open/openwrt/package/`目录下

```
book@100ask:~/workspaces$ cp -rfd opencv tina-v853-open/openwrt/package/
book@100ask:~/workspaces$ cp -rfd opencv-sample tina-v853-open/openwrt/package/
book@100ask:~/workspaces$ cp -rfd ffmpeg tina-v853-open/openwrt/package/
```

查看该目录可看到复制过来的三个文件

```
book@100ask:~/workspaces$ ls tina-v853-open/openwrt/package/
allwinner  feeds  ffmpeg  opencv  opencv-sample  thirdparty
```

## 2.编译opencv和ffmpeg

进入Tina根目录下，配置Tina环境，选择100ASK_V853-PRO开发板。

```
book@100ask:~/workspaces$ cd tina-v853-open/
book@100ask:~/workspaces/tina-v853-open$ source build/envsetup.sh 
NOTE: The SDK(/home/book/workspaces/tina-v853-open) was successfully loaded
load openwrt... ok
Please run lunch next for openwrt.
load buildroot,bsp...ok
Please run ./build.sh config next for buildroot,bsp.
book@100ask:~/workspaces/tina-v853-open$ lunch

You're building on Linux

Lunch menu... pick a combo:
     1  v853-100ask-tina
     2  v853-vision-tina
Which would you like? [Default v853-100ask]: 1
Jump to longan autoconfig
/home/book/workspaces/tina-v853-open/build.sh autoconfig -o openwrt -i v853 -b 100ask           -n default 
========ACTION List: mk_autoconfig -o openwrt -i v853 -b 100ask -n default;========
options : 
INFO: Prepare toolchain ...
INFO: kernel defconfig: generate /home/book/workspaces/tina-v853-open/kernel/linux-4.9/.config by /home/book/workspaces/tina-v853-open/device/config/chips/v853/configs/100ask/linux-4.9/config-4.9
INFO: Prepare toolchain ...
make: Entering directory '/home/book/workspaces/tina-v853-open/kernel/linux-4.9'
*** Default configuration is based on '../../../../../device/config/chips/v853/configs/100ask/linux-4.9/config-4.9'
#
# configuration written to .config
#
make: Leaving directory '/home/book/workspaces/tina-v853-open/kernel/linux-4.9'
INFO: clean buildserver

Usage:
 kill [options] <pid> [...]

Options:
 <pid> [...]            send signal to every <pid> listed
 -<signal>, -s, --signal <signal>
                        specify the <signal> to be sent
 -l, --list=[<signal>]  list all signal names, or convert one to a name
 -L, --table            list all signal names in a nice table

 -h, --help     display this help and exit
 -V, --version  output version information and exit

For more details see kill(1).
INFO: prepare_buildserver
```

进入Tina的配置界面

```
book@100ask:~/workspaces/tina-v853-open$ make menuconfig
```

进入如下目录中，选中`opencv-camera`和`yolov5-post-opencv`

```
 > lizard 
 	> opencv-sample 
 		<*> opencv-camera............ opencv camera, capture video and display to fb0             
		< > yolov5-post-opencv....................... yolov5 post process with opencv
```

其中opencv-camera是使用opencv通过video获取图像并显示在fb0节点上；yolov5-post-opencv为使用opencv编写的yolov5后处理程序。

​	这里选中opencv-camera完成后保存并退出Tina配置界面。

​	编译opencv和例程，在Tina根目录下输入`make`

```
book@100ask:~/workspaces/tina-v853-open$ make
...
```

等待编译完成。



编译完成后，将镜像重新烧写到开发板上。





