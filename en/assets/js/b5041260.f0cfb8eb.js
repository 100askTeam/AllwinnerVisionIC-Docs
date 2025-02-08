"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5671],{43201:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>E,contentTitle:()=>a,default:()=>R,frontMatter:()=>A,metadata:()=>r,toc:()=>s});var i=t(85893),o=t(11151);const A={sidebar_position:7},a="\u652f\u6301MIPI\u6444\u50cf\u5934",r={id:"V851S/part3/03-7_TinaSDK_SupportMIPICamera",title:"\u652f\u6301MIPI\u6444\u50cf\u5934",description:"\u4f7f\u7528Tina-SDK\u751f\u6210\u7684\u955c\u50cf\u5df2\u7ecf\u9ed8\u8ba4\u88c5\u8f7d\u4e86GC2053\u7684MIPI\u6444\u50cf\u5934\u9a71\u52a8\uff0c\u53ef\u4ee5\u901a\u8fc7\u5982\u4e0b\u547d\u4ee4\u67e5\u770b",source:"@site/docs/V851S/part3/03-7_TinaSDK_SupportMIPICamera.md",sourceDirName:"V851S/part3",slug:"/V851S/part3/03-7_TinaSDK_SupportMIPICamera",permalink:"/en/docs/V851S/part3/03-7_TinaSDK_SupportMIPICamera",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/AllwinnerVisionIC-Docs/tree/main/docs/V851S/part3/03-7_TinaSDK_SupportMIPICamera.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"v851SSidebar",previous:{title:"\u652f\u6301\u542f\u52a8WiFi",permalink:"/en/docs/V851S/part3/03-6_TinaSDK_SupportWifiBluetooth"}},E={},s=[{value:"\u4f7f\u7528camerademo\u6d4b\u8bd5MIPI\u6444\u50cf\u5934\u9a71\u52a8",id:"\u4f7f\u7528camerademo\u6d4b\u8bd5mipi\u6444\u50cf\u5934\u9a71\u52a8",level:2}];function m(n){const e={code:"code",h1:"h1",h2:"h2",img:"img",p:"p",pre:"pre",strong:"strong",...(0,o.a)(),...n.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.h1,{id:"\u652f\u6301mipi\u6444\u50cf\u5934",children:"\u652f\u6301MIPI\u6444\u50cf\u5934"}),"\n",(0,i.jsx)(e.p,{children:"\u4f7f\u7528Tina-SDK\u751f\u6210\u7684\u955c\u50cf\u5df2\u7ecf\u9ed8\u8ba4\u88c5\u8f7d\u4e86GC2053\u7684MIPI\u6444\u50cf\u5934\u9a71\u52a8\uff0c\u53ef\u4ee5\u901a\u8fc7\u5982\u4e0b\u547d\u4ee4\u67e5\u770b"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"root@TinaLinux:/# lsmod\nModule                  Size  Used by\nvin_v4l2              156643  0\ngc2053_mipi             8567  0\nvin_io                 21042  2 vin_v4l2,gc2053_mipi\nvideobuf2_v4l2          9304  1 vin_v4l2\nvideobuf2_dma_contig     8734  1 vin_v4l2\nvideobuf2_memops         948  1 videobuf2_dma_contig\nvideobuf2_core         21976  2 vin_v4l2,videobuf2_v4l2\nxradio_wlan              598  0\nxradio_core           430533  1 xradio_wlan\nxradio_mac            221572  1 xradio_core\n"})}),"\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.strong,{children:"\u65ad\u7535"}),"\u540e\uff0c\u5982\u4e0b\u56fe\u6240\u793a\u5c06GC2053\u7684MIPI\u6444\u50cf\u5934\u8fde\u63a5\u5230\u5f00\u53d1\u677f\u4e0a\u3002\u6ce8\u610f\u4e00\u5b9a\u9700\u8981\u65ad\u7535\u540e\u624d\u80fd\u8fde\u63a5\uff0c\u5426\u5219\u4f1a\u5c06\u6444\u50cf\u5934\u70e7\u574f\u3002"]}),"\n",(0,i.jsx)(e.p,{children:(0,i.jsx)(e.img,{src:"https://photos.100ask.net/dongshanpi-docs/YuzukiHD-Lizard/YuzukiHD-Lizard-13-1-camera.png",alt:"YuzukiHD-Lizard-13-1-camera.png"})}),"\n",(0,i.jsx)(e.h2,{id:"\u4f7f\u7528camerademo\u6d4b\u8bd5mipi\u6444\u50cf\u5934\u9a71\u52a8",children:"\u4f7f\u7528camerademo\u6d4b\u8bd5MIPI\u6444\u50cf\u5934\u9a71\u52a8"}),"\n",(0,i.jsx)(e.p,{children:"\u83b7\u53d6camerademo\u7684\u5e2e\u52a9\uff0c\u7528\u6237\u53ef\u4ee5\u6839\u636e\u81ea\u5df1\u7684\u9700\u6c42\u9009\u62e9\u5bf9\u5e94\u53c2\u6570"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"root@TinaLinux:/# camerademo -h\n[CAMERA]**********************************************************\n[CAMERA]*                                                        *\n[CAMERA]*              this is camera test.                      *\n[CAMERA]*                                                        *\n[CAMERA]**********************************************************\n[CAMERA]******************** camerademo help *********************\n[CAMERA] This program is a test camera.\n[CAMERA] It will query the sensor to support the resolution, output format and test frame rate.\n[CAMERA] At the same time you can modify the data to save the path and get the number of photos.\n[CAMERA] When the last parameter is debug, the output will be more detailed information\n[CAMERA] There are eight ways to run:\n[CAMERA]    1.camerademo --- use the default parameters.\n[CAMERA]    2.camerademo debug --- use the default parameters and output debug information.\n[CAMERA]    3.camerademo setting --- can choose the resolution and data format.\n[CAMERA]    4.camerademo setting debug --- setting and output debug information.\n[CAMERA]    5.camerademo NV21 640 480 30 bmp /tmp 5 --- param input mode,can save bmp or yuv.\n[CAMERA]    6.camerademo NV21 640 480 30 bmp /tmp 5 debug --- output debug information.\n[CAMERA]    7.camerademo NV21 640 480 30 bmp /tmp 5 Num --- /dev/videoNum param input mode,can save bmp or yuv.\n[CAMERA]    8.camerademo NV21 640 480 30 bmp /tmp 5 Num debug --- /dev/videoNum output debug information.\n[CAMERA]    8.camerademo NV21 640 480 30 bmp /tmp 5 Num 1 --- 1/2: chose memory: V4L2_MEMORY_MMAP/USERPTR\n[CAMERA]**********************************************************\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u4f7f\u7528debug\u786e\u5b9a\u6444\u50cf\u5934\u652f\u6301\u7684\u53c2\u6570\u914d\u7f6e"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"root@TinaLinux:/# camerademo debug\n[CAMERA]**********************************************************\n[CAMERA]*                                                        *\n[CAMERA]*              this is camera test.                      *\n[CAMERA]*                                                        *\n[CAMERA]**********************************************************\n[CAMERA]**********************************************************\n[CAMERA] open /dev/video0!\n[CAMERA]**********************************************************\n[CAMERA_DEBUG] Querey device capabilities succeed\n[CAMERA_DEBUG] cap.driver=sunxi-vin\n[CAMERA_DEBUG] cap.card=sunxi-vin\n[CAMERA_DEBUG] cap.bus_info=\n[CAMERA_DEBUG] cap.version=0x00010000\n[CAMERA_DEBUG] cap.capabilities=0x85201000\n[CAMERA]**********************************************************\n[CAMERA] The path to data saving is /tmp.\n[CAMERA] The number of captured photos is 5.\n[CAMERA] save bmp format\n[CAMERA_DEBUG]******************[   63.469141] [VIN_ERR]vin is not support this pixelformat\n********************************[   63.476141] [VIN_ERR]vin is not support this pixelformat\n********\n[CAMERA_DEBUG] enumera[   63.484878] [VIN_ERR]vin is not support this pixelformat\nte image formats\n[CAMERA_DEBUG][   63.493711] [VIN_ERR]vin is not support this pixelformat\n format index = 0, name = YUV422[   63.502495] [VIN_ERR]vin is not support this pixelformat\nP\n[CAMERA_DEBUG] format index =[   63.511287] [VIN_ERR]vin is not support this pixelformat\n 1, name = NV16\n[CAMERA_DEBUG] [   63.519961] [VIN_ERR]vin is not support this pixelformat\nformat index = 2, name = NV61\n[[   63.528991] [VIN_ERR]vin is not support this pixelformat\nCAMERA_DEBUG] format index = 3, [   63.537520] [VIN_ERR]vin is not support this pixelformat\nname = YUV420\n[CAMERA_DEBUG] fo[   63.546341] [VIN_ERR]vin is not support this pixelformat\nrmat index = 4, name = YVU420\n[[   63.555148] [VIN_ERR]vin is not support this pixelformat\nCAMERA_DEBUG] format index = 5, [   63.564044] [VIN_ERR]vin is not support this pixelformat\nname = NV12\n[CAMERA_DEBUG] format index = 6, name = NV21\n[CAMERA_DEBUG] format index = 7, name = BGGR8\n[CAMERA_DEBUG] format index = 8, name = GBRG8\n[CAMERA_DEBUG] format index = 9, name = GRBG8\n[CAMERA_DEBUG] format index = 10, name = RGGB8\n[CAMERA_DEBUG] format index = 11, name = BGGR10\n[CAMERA_DEBUG] format index = 12, name = GBRG10\n[CAMERA_DEBUG] format index = 13, name = GRBG10\n[CAMERA_DEBUG] format index = 14, name = RGGB10\n[CAMERA_DEBUG] format index = 15, name = BGGR12\n[CAMERA_DEBUG] format index = 16, name = GBRG12\n[CAMERA_DEBUG] format index = 17, name = GRBG12\n[CAMERA_DEBUG] format index = 18, name = RGGB12\n[CAMERA_DEBUG] format index = 19, name = YUYV\n[CAMERA_DEBUG] format index = 20, name = UYVY\n[CAMERA_DEBUG] format index = 21, name = VYUY\n[CAMERA_DEBUG] format index = 22, name = YVYU\n[CAMERA_DEBUG] format index = 23, name = YUYV\n[CAMERA_DEBUG] format index = 24, name = UYVY\n[CAMERA_DEBUG] format index = 25, name = VYUY\n[CAMERA_DEBUG] format index = 26, name = YVYU\n[CAMERA_DEBUG] format index = 27, name = UYVY\n[CAMERA_DEBUG] format index = 28, name = VYUY\n[CAMERA_DEBUG] format index = 29, name = YVYU\n[CAMERA_DEBUG] format index = 30, name = YUYV\n[CAMERA_DEBUG]*********************************************************\n[CAMERA_DEBUG] The sensor supports the following formats :\n[CAMERA_DEBUG] Index 0 : YUV422P.\n[CAMERA_DEBUG] Index 1 : NV16.\n[CAMERA_DEBUG] Index 2 : NV61.\n[CAMERA_DEBUG] Index 3 : YUV420.\n[CAMERA_DEBUG] Index 4 : YVU420.\n[CAMERA_DEBUG] Index 5 : NV12.\n[CAMERA_DEBUG] Index 6 : NV21.\n[CAMERA_DEBUG] Index 7 : BGGR8.\n[CAMERA_DEBUG] Index 8 : GBRG8.\n[CAMERA_DEBUG] Index 9 : GRBG8.\n[CAMERA_DEBUG] Index 10 : RGGB8.\n[CAMERA_DEBUG] Index 11 : BGGR10.\n[CAMERA_DEBUG] Index 12 : GBRG10.\n[CAMERA_DEBUG] Index 13 : GRBG10.\n[CAMERA_DEBUG] Index 14 : RGGB10.\n[CAMERA_DEBUG] Index 15 : BGGR12.\n[CAMERA_DEBUG] Index 16 : GBRG12.\n[CAMERA_DEBUG] Index 17 : GRBG12.\n[CAMERA_DEBUG] Index 18 : RGGB12.\n[CAMERA_DEBUG] Index 19 : YUYV.\n[CAMERA_DEBUG] Index 20 : UYVY.\n[CAMERA_DEBUG] Index 21 : VYUY.\n[CAMERA_DEBUG] Index 22 : YVYU.\n[CAMERA_DEBUG] Index 23 : YUYV.\n[CAMERA_DEBUG] Index 24 : UYVY.\n[CAMERA_DEBUG] Index 25 : VYUY.\n[CAMERA_DEBUG] Index 26 : YVYU.\n[CAMERA_DEBUG] Index 27 : UYVY.\n[CAMERA_DEBUG] Index 28 : VYUY.\n[CAMERA_DEBUG] Index 29 : YVYU.\n[CAMERA_DEBUG] Index 30 : YUYV.\n[CAMERA_DEBUG]**********************************************************\n[CAMERA_DEBUG] The YUV422P supports the following resolutions:\n[CAMERA_DEBUG] Index 0 : 1920 * 1088\n[CAMERA_DEBUG] Index 1 : 1920 * 1088\n[CAMERA_DEBUG] Index 2 : 1920 * 1088\n[CAMERA_DEBUG]**********************************************************\n[CAMERA_DEBUG] The NV16 supports the following resolutions:\n[CAMERA_DEBUG] Index 0 : 1920 * 1088\n[CAMERA_DEBUG] Index 1 : 1920 * 1088\n[CAMERA_DEBUG] Index 2 : 1920 * 1088\n[CAMERA_DEBUG]**********************************************************\n[CAMERA_DEBUG] The NV61 supports the following resolutions:\n[CAMERA_DEBUG] Index 0 : 1920 * 1088\n[CAMERA_DEBUG] Index 1 : 1920 * 1088\n[CAMERA_DEBUG] Index 2 : 1920 * 1088\n[CAMERA_DEBUG]**********************************************************\n[CAMERA_DEBUG] The YUV420 supports the following resolutions:\n[CAMERA_DEBUG] Index 0 : 1920 * 1088\n[CAMERA_DEBUG] Index 1 : 1920 * 1088\n[CAMERA_DEBUG] Index 2 : 1920 * 1088\n[CAMERA_DEBUG]**********************************************************\n[CAMERA_DEBUG] The YVU420 supports the following resolutions:\n[CAMERA_DEBUG] Index 0 : 1920 * 1088\n[CAMERA_DEBUG] Index 1 : 1920 * 1088\n[CAMERA_DEBUG] Index 2 : 1920 * 1088\n[CAMERA_DEBUG]**********************************************************\n[CAMERA_DEBUG] The NV12 supports the following resolutions:\n[CAMERA_DEBUG] Index 0 : 1920 * 1088\n[CAMERA_DEBUG] Index 1 : 1920 * 1088\n[CAMERA_DEBUG] Index 2 : 1920 * 1088\n[CAMERA_DEBUG]**********************************************************\n[CAMERA_DEBUG] The NV21 supports the following resolutions:\n[CAMERA_DEBUG] Index 0 : 1920 * 1088\n[CAMERA_DEBUG] Index 1 : 1920 * 1088\n[CAMERA_DEBUG] Index 2 : 1920 * 1088\n[CAMERA_DEBUG]**********************************************************\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u6302\u8f7dTF\u5361\u5206\u533a"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"root@TinaLinux:/# df -h\nFilesystem                Size      Used Available Use% Mounted on\n/dev/root                16.8M     16.8M         0 100% /rom\ndevtmpfs                 26.0M         0     26.0M   0% /dev\ntmpfs                    27.2M         0     27.2M   0% /tmp\n/dev/by-name/rootfs_data\n                         43.5M    136.0K     41.1M   0% /overlay\noverlayfs:/overlay       43.5M    136.0K     41.1M   0% /\ntmpfs                    27.2M         0     27.2M   0% /run\n/dev/ubi0_6              29.9M     24.0K     28.3M   0% /mnt/UDISK\n/dev/mmcblk0p1            3.7G    128.0K      3.7G   0% /mnt/extsd\nroot@TinaLinux:/# mount /dev/mmcblk0p1 /mnt/\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u4f7f\u7528GC2053\u6240\u652f\u6301\u7684\u53c2\u6570\u62cd\u6444\u4e94\u5f20\u7167\u7247\uff0c\u5e76\u5b58\u653e\u5230TF\u5361\u5206\u533a/mnt\u76ee\u5f55\u4e0b"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"root@TinaLinux:/# camerademo NV21 1920 1088 30 bmp /mnt 5\n[CAMERA]**********************************************************\n[CAMERA]*                                                        *\n[CAMERA]*              this is camera test.                      *\n[CAMERA]*                                                        *\n[CAMERA]**********************************************************\n[CAMERA]**********************************************************\n[CAMERA] open /dev/video0!\n[CAMERA]**********************************************************\n[CAMERA]**********************************************************\n[CAMERA] The path to data saving is /mnt.\n[CAMERA] The number of captured photos is 5.\n[CAMERA] save bmp format\n[   81.016864] [VIN_ERR]vin is not support this pixelformat\n[   81.023161] [VIN_ERR]vin is not support this pixelformat\n[   81.029406] [VIN_ERR]vin is not support this pixelformat\n[   81.035712] [VIN_ERR]vin is not support this pixelformat\n[   81.041841] [VIN_ERR]vin is not support this pixelformat\n[   81.048112] [VIN_ERR]vin is not support this pixelformat\n[   81.054244] [VIN_ERR]vin is not support this pixelformat\n[   81.060641] [VIN_ERR]vin is not support this pixelformat\n[   81.066969] [VIN_ERR]vin is not support this pixelformat\n[   81.073229] [VIN_ERR]vin is not support this pixelformat\n[   81.079441] [VIN_ERR]vin is not support this pixelformat\n[   81.085738] [VIN_ERR]vin is not support this pixelformat\n[CAMERA]**********************************************************\n[CAMERA] Using format parameters NV21.\n[CAMERA] camera pixelformat: NV21\n[CAMERA] Resolution size : 1920 * 1088\n[CAMERA] The photo save path is /mnt.\n[CAMERA] The number of photos taken is 5.\nbegin ion_alloc_open\npid: 992, g_alloc_context = 0xb6f28f70\n[CAMERA] Camera capture framerate is 20/1\n[CAMERA] VIDIOC_S_FMT succeed\n[CAMERA] fmt.type = 9\n[CAMERA] fmt.fmt.pix_mp.width = 1920\n[CAMERA] fmt.fmt.pix_mp.height = 1088\n[CAMERA] fmt.fmt.pix_mp.pixelformat = NV21\n[CAMERA] fmt.fmt.pix_mp.field = 1\n[CAMERA] stream on succeed\n[CAMERA] camera0 capture num is [0]\n[CAMERA_PROMPT] the time interval from the start to the first frame is 178 ms\n[CAMERA] camera0 capture num is [1]\n[CAMERA] camera0 capture num is [2]\n[CAMERA] camera0 capture num is [3]\n[CAMERA] camera0 capture num is [4]\n[CAMERA] Capture thread finish\n[CAMERA] close /dev/video0\nion_alloc_close\npid: 992, release g_alloc_context = 0xb6f28f70\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u62cd\u6444\u5b8c\u6210\u540e\uff0c\u4f7f\u7528\u4e0b\u9762\u547d\u4ee4\u5378\u8f7d\u5206\u533a\uff0c\u53d6\u4e0bTF\u5361\uff0c\u4f7f\u7528\u8bfb\u5361\u5668\u5373\u53ef\u5728\u7535\u8111\u7aef\u67e5\u770b\u4f7f\u7528MIPI\u6444\u50cf\u5934\u62cd\u6444\u7684\u7167\u7247"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"root@TinaLinux:/# umount /mnt/\n"})})]})}function R(n={}){const{wrapper:e}={...(0,o.a)(),...n.components};return e?(0,i.jsx)(e,{...n,children:(0,i.jsx)(m,{...n})}):m(n)}},11151:(n,e,t)=>{t.d(e,{Z:()=>r,a:()=>a});var i=t(67294);const o={},A=i.createContext(o);function a(n){const e=i.useContext(A);return i.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function r(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(o):n.components||o:a(n.components),i.createElement(A.Provider,{value:e},n.children)}}}]);