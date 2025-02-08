"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8941],{67956:(n,e,o)=>{o.r(e),o.d(e,{assets:()=>l,contentTitle:()=>t,default:()=>p,frontMatter:()=>a,metadata:()=>r,toc:()=>c});var i=o(85893),s=o(11151);const a={sidebar_position:1},t="\u7f16\u8bd1\u6784\u5efa\u7cfb\u7edf",r={id:"V853/part2/02-1_CompileAndBuildSystem",title:"\u7f16\u8bd1\u6784\u5efa\u7cfb\u7edf",description:"0.\u524d\u8a00",source:"@site/docs/V853/part2/02-1_CompileAndBuildSystem.md",sourceDirName:"V853/part2",slug:"/V853/part2/02-1_CompileAndBuildSystem",permalink:"/docs/V853/part2/02-1_CompileAndBuildSystem",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/AllwinnerVisionIC-Docs/tree/main/docs/V853/part2/02-1_CompileAndBuildSystem.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"v853Sidebar",previous:{title:"SDK\u57fa\u7840\u4f7f\u7528",permalink:"/docs/category/sdk\u57fa\u7840\u4f7f\u7528"},next:{title:"MIPI\u663e\u793a\u5c4f\u9002\u914d\u6307\u5357",permalink:"/docs/V853/part2/02-2_MIPIDisplayAdaptationGuide"}},l={},c=[{value:"0.\u524d\u8a00",id:"0\u524d\u8a00",level:2},{value:"1.\u4e0b\u8f7dTina SDK\u5305",id:"1\u4e0b\u8f7dtina-sdk\u5305",level:2},{value:"2.\u4e3aTina SDK\u5305\u6253\u4e0a\u767e\u95ee\u7f51V853\u7684\u8865\u4e01\u5305",id:"2\u4e3atina-sdk\u5305\u6253\u4e0a\u767e\u95ee\u7f51v853\u7684\u8865\u4e01\u5305",level:2},{value:"3.\u7f16\u8bd1\u7cfb\u7edf",id:"3\u7f16\u8bd1\u7cfb\u7edf",level:2},{value:"4.\u6253\u5305\u751f\u6210DongshanPI-AICT\u7cfb\u7edf\u955c\u50cf",id:"4\u6253\u5305\u751f\u6210dongshanpi-aict\u7cfb\u7edf\u955c\u50cf",level:2}];function d(n){const e={a:"a",code:"code",h1:"h1",h2:"h2",img:"img",p:"p",pre:"pre",strong:"strong",...(0,s.a)(),...n.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.h1,{id:"\u7f16\u8bd1\u6784\u5efa\u7cfb\u7edf",children:"\u7f16\u8bd1\u6784\u5efa\u7cfb\u7edf"}),"\n",(0,i.jsx)(e.h2,{id:"0\u524d\u8a00",children:"0.\u524d\u8a00"}),"\n",(0,i.jsxs)(e.p,{children:["\u672c\u7ae0\u4e3b\u8981\u4ecb\u7ecd\u5173\u4e8eDongshanPI-AICT\u5f00\u53d1\u677f\u7684Tina SDK\u5305\u7684\u4e0b\u8f7d\u548c\u7f16\u8bd1\u6253\u5305\u751f\u6210\u955c\u50cf\uff0c\u5e76\u5c06\u955c\u50cf\u70e7\u5f55\u5230DongshanPI-AICT\u5f00\u53d1\u677f\u4e0a\u3002\u5728\u8fdb\u884cDongshanPI-AICT\u5f00\u53d1\u677f\u7684\u73af\u5883\u914d\u7f6e\u524d\u9700\u8981\u83b7\u53d6\u914d\u7f6e\u865a\u62df\u673a\u7cfb\u7edf\uff0c\u53ef\u4ee5\u53c2\u8003\uff1a",(0,i.jsx)(e.a,{href:"/docs/V853/ConfigHostEnv",children:"\u5b89\u88c5\u5e76\u914d\u7f6e\u5f00\u53d1\u73af\u5883"}),"\u3002"]}),"\n",(0,i.jsxs)(e.p,{children:["\u5168\u5fd7Linux Tina-SDK\u5f00\u53d1\u5b8c\u5168\u624b\u518c\uff1a",(0,i.jsx)(e.a,{href:"https://tina.100ask.net/",children:"https://tina.100ask.net/"})]}),"\n",(0,i.jsx)(e.h2,{id:"1\u4e0b\u8f7dtina-sdk\u5305",children:"1.\u4e0b\u8f7dTina SDK\u5305"}),"\n",(0,i.jsx)(e.p,{children:"\u200b\t\u7531\u4e8eTina SDK\u5305\u7684\u5927\u5c0f\u8f83\u5927\uff0c\u6211\u4eec\u5c06\u5176\u5206\u5377\u538b\u7f29\u5e76\u653e\u5728\u5728\u4e86\u767e\u5ea6\u7f51\u76d8\u4e2d ,\u4f4d\u4e8e07_Tina_SDK\u5305\u76ee\u5f55\u4e0b\uff0c\u5c06\u8be5\u76ee\u5f55\u4e0b\u7684\u5168\u90e8\u6587\u4ef6\u4e0b\u8f7d\u5e76\u62f7\u8d1d\u5230\u865a\u62df\u673a\u4e0b\uff0c\u5982\u4e0b\u6240\u793a"}),"\n",(0,i.jsx)(e.p,{children:(0,i.jsx)(e.img,{alt:"image-20230410170425039",src:o(48572).Z+"",width:"1299",height:"189"})}),"\n",(0,i.jsx)(e.p,{children:"\u200b\t\u5728\u6b64\u76ee\u5f55\u4e0b\u6253\u5f00\u7ec8\u7aef\uff0c\u8f93\u5165cat tina-v853-open.tar.gz* | tar xz\uff0c\u5408\u5e76\u538b\u7f29\u5305\u5e76\u89e3\u538b\u538b\u7f29\u5305\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-shell",children:"book@100ask:~/workspaces$ cat tina-v853-open.tar.gz* | tar xz\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u8be5\u8fc7\u7a0b\u65f6\u95f4\u53ef\u80fd\u4f1a\u6bd4\u8f83\u957f\uff0c\u9700\u8981\u8010\u5fc3\u7b49\u5f85\u3002"}),"\n",(0,i.jsx)(e.p,{children:"\u200b\t\u89e3\u538b\u5b8c\u6210\u540e\u4f1a\u5728\u5f53\u524d\u76ee\u5f55\u4e0b\u751f\u6210\u4e00\u4e2atina-v853-open\u7684\u6587\u4ef6\u5939\uff0c\u8be5\u6587\u4ef6\u5939\u5373\u4e3aTina SDK\u5305\u7684\u5168\u90e8\u76ee\u5f55\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-shell",children:"book@100ask:~/workspaces$ ls\ntina-v853-open            tina-v853-open.tar.gz.01  tina-v853-open.tar.gz.03  tina-v853-open.tar.gz.05  tina-v853-open.tar.gz.07  tina-v853-open.tar.gz.09  tina-v853-open.tar.gz.11\ntina-v853-open.tar.gz.00  tina-v853-open.tar.gz.02  tina-v853-open.tar.gz.04  tina-v853-open.tar.gz.06  tina-v853-open.tar.gz.08  tina-v853-open.tar.gz.10\n"})}),"\n",(0,i.jsx)(e.h2,{id:"2\u4e3atina-sdk\u5305\u6253\u4e0a\u767e\u95ee\u7f51v853\u7684\u8865\u4e01\u5305",children:"2.\u4e3aTina SDK\u5305\u6253\u4e0a\u767e\u95ee\u7f51V853\u7684\u8865\u4e01\u5305"}),"\n",(0,i.jsx)(e.p,{children:"\u200b\t\u5728\u5f53\u524d\u76ee\u5f55\u4e0b\u901a\u8fc7GIT\u547d\u4ee4\u4e0b\u8f7dDongshanPI-AICT\u8865\u4e01\u5305\uff0c\u5bf9\u4e8e\u6b64\u8865\u4e01\u5305\u6211\u4eec\u4e5f\u5728gitee\u548c\u767e\u5ea6\u7f51\u76d8\u4e2d\u63d0\u4f9b\uff0c\u767e\u5ea6\u7f51\u76d8\u4e2d\u4f4d\u4e8e08_DongshanPI-AICT_TinaSDK\u8865\u4e01\u5305\u76ee\u5f55\u4e0b\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-shell",children:"book@100ask:~/workspaces$ git clone https://github.com/100askTeam/DongshanPI-AICT_TinaSDK.git\nCloning into 'DongshanPI-AICT_TinaSDK'...\nremote: Enumerating objects: 131, done.\nremote: Counting objects: 100% (131/131), done.\nremote: Compressing objects: 100% (86/86), done.\nremote: Total 131 (delta 12), reused 128 (delta 12), pack-reused 0\nReceiving objects: 100% (131/131), 1.73 MiB | 2.89 MiB/s, done.\nResolving deltas: 100% (12/12), done.\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u4e0b\u8f7d\u5b8c\u6210\u540e\u5c06\u6b64\u6587\u4ef6\u5939\u62f7\u8d1d\u5230tina-v853-open\u6587\u4ef6\u5939\u4e2d"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-shell",children:"book@100ask:~/workspaces$ cp -rfvd DongshanPI-AICT_TinaSDK/* tina-v853-open/\n"})}),"\n",(0,i.jsx)(e.h2,{id:"3\u7f16\u8bd1\u7cfb\u7edf",children:"3.\u7f16\u8bd1\u7cfb\u7edf"}),"\n",(0,i.jsx)(e.p,{children:"\u200b\t\u8fdb\u5165tina-v853-open\u76ee\u5f55\u4e0b\uff0c\u53ef\u4ee5\u901a\u8fc7ls\u547d\u4ee4\u67e5\u770b\u5f53\u524d\u6587\u4ef6\u5939\u4e0b\u7684\u6240\u6709\u6587\u4ef6"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-shell",children:"book@100ask:~/workspaces$ cd tina-v853-open/\nbook@100ask:~/workspaces/tina-v853-open$ ls\nbrandy  build  buildroot  build.sh  device  kernel  openwrt  platform  prebuilt  tools\n"})}),"\n",(0,i.jsxs)(e.p,{children:["\u200b\t\u5bf9\u4e8e\u60f3\u8be6\u7ec6\u4e86\u89e3Allwinner Tina Linux\u7cfb\u7edf\u5e73\u53f0\uff0c\u53ef\u4ee5\u5728\u540e\u7eed\u8bbf\u95ee\uff1a",(0,i.jsx)(e.a,{href:"https://tina.100ask.net/SdkModule/Linux_SystemSoftware_DevelopmentGuide-01/",children:"https://tina.100ask.net/SdkModule/Linux_SystemSoftware_DevelopmentGuide-01/"})]}),"\n",(0,i.jsx)(e.p,{children:"\u200b\t\u5efa\u7acb\u7f16\u8bd1\u73af\u5883\uff0c\u8f93\u5165 source build/envsetup.sh"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-shell",children:"book@100ask:~/workspaces/tina-v853-open$ source build/envsetup.sh\nNOTE: The SDK(/home/book/workspaces/tina-v853-open) was successfully loaded\nload openwrt... ok\nPlease run lunch next for openwrt.\nload buildroot,bsp...ok\nPlease run ./build.sh config next for buildroot,bsp.\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u200b\t\u9009\u62e9\u7f16\u8bd1\u7684\u5f00\u53d1\u677f\uff0c\u8f93\u5165lunch"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"book@100ask:~/workspaces/tina-v853-open$ lunch\n\nYou're building on Linux\n\nLunch menu... pick a combo:\n     1  v853-100ask-tina\n     2  v853-vision-tina\nWhich would you like?:\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u8fd9\u91cc\u662f\u9700\u8981\u60a8\u9009\u62e9\u7f16\u8bd1\u54ea\u4e2a\u65b9\u6848\u7684\u5f00\u53d1\u677f\uff0c\u8fd9\u91cc\u8f93\u51651\uff0c\u9009\u62e9v853-100ask-tina\uff0c\u518d\u6309\u56de\u8f66\u5373\u53ef\u3002"}),"\n",(0,i.jsx)(e.p,{children:"\u9009\u62e9\u5b8c\u6210\u540e\u4f1a\u5012\u65708\u79d2\uff0c\u8ba9\u60a8\u9605\u8bfb\u8bb8\u53ef\u534f\u8bae\uff0c\u9605\u8bfb\u5b8c\u6210\u540e\uff0c\u4f1a\u8be2\u95ee\u60a8\u662f\u5426\u63a5\u53d7\u4e0a\u8ff0\u6761\u6b3e\u534f\u8bae\u3002\u8f93\u5165y\uff0c\u518d\u6309\u56de\u8f66\u5373\u540c\u610f\u4ee5\u4e0a\u6761\u6b3e\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"book@100ask:~/workspaces/tina-v853-open$ lunch\n\nYou're building on Linux\n\nLunch menu... pick a combo:\n     1  v853-100ask-tina\n     2  v853-vision-tina\nWhich would you like?: 1\nJump to longan autoconfig\n/home/book/workspaces/tina-v853-open/build.sh autoconfig -o openwrt -i v853 -b 100ask           -n default\n\nBefore using this files, please make sure that you note the following important information.\n**********************************************************************\n\nCopyright (c) 2019-2022 Allwinner Technology Co., Ltd. ALL rights reserved.\n\nAllwinner is a trademark of Allwinner Technology Co.,Ltd., registered in\nthe the People's Republic of China and other countries.\nAll Allwinner Technology Co.,Ltd. trademarks are used with permission.\n\nDISCLAIMER\nTHIRD PARTY LICENCES MAY BE REQUIRED TO IMPLEMENT THE SOLUTION/PRODUCT.\nIF YOU NEED TO INTEGRATE THIRD PARTY'S TECHNOLOGY (SONY, DTS, DOLBY, AVS OR MPEGLA, ETC.)\nIN ALLWINNERS'SDK OR PRODUCTS, YOU SHALL BE SOLELY RESPONSIBLE TO OBTAIN\nALL APPROPRIATELY REQUIRED THIRD PARTY LICENCES.\nALLWINNER SHALL HAVE NO WARRANTY, INDEMNITY OR OTHER OBLIGATIONS WITH RESPECT TO MATTERS\nCOVERED UNDER ANY REQUIRED THIRD PARTY LICENSE.\nYOU ARE SOLELY RESPONSIBLE FOR YOUR USAGE OF THIRD PARTY'S TECHNOLOGY.\n\n\nTHIS SOFTWARE IS PROVIDED BY ALLWINNER\"AS IS\" AND TO THE MAXIMUM EXTENT\nPERMITTED BY LAW, ALLWINNER EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND,\nWHETHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING WITHOUT LIMITATION REGARDING\nTHE TITLE, NON-INFRINGEMENT, ACCURACY, CONDITION, COMPLETENESS, PERFORMANCE\nOR MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.\nIN NO EVENT SHALL ALLWINNER BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\nSPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT\nNOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;\nLOSS OF USE, DATA, OR PROFITS, OR BUSINESS INTERRUPTION)\nHOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,\nSTRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)\nARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED\nOF THE POSSIBILITY OF SUCH DAMAGE.\n\n**********************************************************************\nYou can read /home/book/workspaces/tina-v853-open/build/disclaimer/Allwinnertech_Disclaimer(Cn_En)_20181122.md for detailed information.\n\nYou read time left 8 seconds....\nI have already read, understood and accepted the above terms? [Y/N]y\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u786e\u8ba4\u540c\u610f\u6761\u6b3e\u540e\uff0c\u7cfb\u7edf\u4f1a\u81ea\u52a8\u914d\u7f6e\u73af\u5883\u53d8\u91cf"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"You select Yes, Build continue....\n========ACTION List: mk_autoconfig -o openwrt -i v853 -b 100ask -n default;========\noptions :\nINFO: Prepare toolchain ...\nINFO: kernel defconfig: generate /home/book/workspaces/tina-v853-open/kernel/linux-4.9/.config by /home/book/workspaces/tina-v853-open/device/config/chips/v853/configs/100ask/linux-4.9/config-4.9\nINFO: Prepare toolchain ...\nmake: Entering directory '/home/book/workspaces/tina-v853-open/kernel/linux-4.9'\n  HOSTCC  scripts/basic/fixdep\n  HOSTCC  scripts/kconfig/conf.o\n  SHIPPED scripts/kconfig/zconf.tab.c\n  SHIPPED scripts/kconfig/zconf.lex.c\n  SHIPPED scripts/kconfig/zconf.hash.c\n  HOSTCC  scripts/kconfig/zconf.tab.o\n  HOSTLD  scripts/kconfig/conf\n*** Default configuration is based on '../../../../../device/config/chips/v853/configs/100ask/linux-4.9/config-4.9'\n#\n# configuration written to .config\n#\nmake: Leaving directory '/home/book/workspaces/tina-v853-open/kernel/linux-4.9'\nINFO: clean buildserver\n\nUsage:\n kill [options] <pid> [...]\n\nOptions:\n <pid> [...]            send signal to every <pid> listed\n -<signal>, -s, --signal <signal>\n                        specify the <signal> to be sent\n -l, --list=[<signal>]  list all signal names, or convert one to a name\n -L, --table            list all signal names in a nice table\n\n -h, --help     display this help and exit\n -V, --version  output version information and exit\n\nFor more details see kill(1).\nINFO: prepare_buildserver\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u7f16\u8bd1\u7cfb\u7edf\uff0c\u8f93\u5165make\uff0c\u8f93\u5165\u5b8c\u6210\u540e\u7cfb\u7edf\u5c06\u4f1a\u5f00\u59cb\u7f16\u8bd1"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"book@100ask:~/workspaces/tina-v853-open$ make\n===There is tina environment.===\n Note: make is the shell functon in envsetup.sh.\n\n== action: openwrt_build, action_args:  ==\n========ACTION List: build_linuxdev ;========\noptions :\nINFO: ----------------------------------------\nINFO: build linuxdev ...\nINFO: chip: sun8iw21p1\nINFO: platform: linux\nINFO: kernel: linux-4.9\nINFO: board: 100ask\nINFO: output: /home/book/workspaces/tina-v853-open/out/v853/100ask/openwrt\nINFO: ----------------------------------------\nINFO: don't build dtbo ...\nINFO: build arisc\nINFO: build_bootloader: brandy_path= /home/book/workspaces/tina-v853-open/brandy/brandy-2.0\ngrep: /home/book/workspaces/tina-v853-open/brandy/brandy-2.0/spl/Makefile: No such file or directory\nbuild for sun8iw21p1_defconfig ...\nPrepare arm toolchain ...\n...//\u6b64\u90e8\u5206\u7f16\u8bd1\u8f93\u51fa\u4fe1\u606f\u7701\u7565\nBuilding kernel\n/home/book/workspaces/tina-v853-open/kernel/linux-4.9/output/lib/modules/4.9.191\n  CHK     include/config/kernel.release\n  CHK     include/generated/uapi/linux/version.h\n  CHK     include/generated/utsrelease.h\n  CHK     scripts/mod/devicetable-offsets.h\n  CHK     include/generated/timeconst.h\n  CHK     include/generated/bounds.h\n  CHK     include/generated/asm-offsets.h\n  CALL    scripts/checksyscalls.sh\n  CHK     include/generated/compile.h\n  DTC     arch/arm/boot/dts/board.dtb\n  Kernel: arch/arm/boot/Image is ready\n  Building modules, stage 2.\n  MODPOST 27 modules\n  Kernel: arch/arm/boot/zImage is ready\n  Kernel: arch/arm/boot/uImage is ready\n'arch/arm/boot/Image' -> 'output/bImage'\n'arch/arm/boot/uImage' -> 'output/uImage'\n'arch/arm/boot/zImage' -> 'output/zImage'\nCopy rootfs.cpio.gz for arm\nBuilding modules\n[GPU]: No GPU type is configured in /home/book/workspaces/tina-v853-open/kernel/linux-4.9/.config.\nregenerate rootfs cpio\n16149 blocks\n16150 blocks\nbuild_ramfs\nCopy boot.img to output directory ...\n./scripts/build.sh\n\nsun8iw21p1 compile Kernel successful\n\n\nINFO: ----------------------------------------\nINFO: build Tina OK.\nINFO: ----------------------------------------\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u7b49\u5f85\u7f16\u8bd1\u5b8c\u6210\uff0c\u6b64\u90e8\u5206\u7f16\u8bd1\u65f6\u95f4\u7531\u7535\u8111CPU\u7b49\u51b3\u5b9a\uff0c\u7b2c\u4e00\u6b21\u7f16\u8bd1\u7cfb\u7edf\u7684\u65f6\u95f4\u6bd4\u8f83\u957f\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85\u3002\u7b49\u5f85\u8f93\u51fa\u7f16\u8bd1Tina OK\u5373\u7f16\u8bd1\u6210\u529f\u3002"}),"\n",(0,i.jsx)(e.h2,{id:"4\u6253\u5305\u751f\u6210dongshanpi-aict\u7cfb\u7edf\u955c\u50cf",children:"4.\u6253\u5305\u751f\u6210DongshanPI-AICT\u7cfb\u7edf\u955c\u50cf"}),"\n",(0,i.jsx)(e.p,{children:"\u200b\t\u7f16\u8bd1\u5b8c\u6210\u540e\uff0c\u8f93\u5165pack\uff0c\u53ef\u4ee5\u76f4\u63a5\u5c06\u521a\u521a\u7f16\u8bd1\u5b8c\u6210\u7684\u7cfb\u7edf\u6253\u5305\u751f\u6210\u53ef\u70e7\u5199\u5230\u677f\u8f7dEMMC\u4e0a\u7684\u955c\u50cf\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{children:"book@100ask:~/workspaces/tina-v853-open$ pack\n/home/book/workspaces/tina-v853-open/build/pack -c sun8iw21p1 -i v853 -p openwrt -b 100ask -k linux-4.9 -d uart0 -v none -m normal -w none -n default\nINFO: /home/book/workspaces/tina-v853-open/out/v853/common/keys\ncopying tools file\ncopying configs file\ncopying product configs file\n...\n\nDragon execute image.cfg SUCCESS !\n----------image is at----------\n\n33M     /home/book/workspaces/tina-v853-open/out/v853/100ask/openwrt/v853_linux_100ask_uart0.img\n\npack finish\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u7b49\u5f85\u6253\u5305\u5b8c\u6210\uff0c\u6253\u5305\u5b8c\u6210\u540e\u53ef\u4ee5\u6839\u636e\u4e0a\u9762\u7684\u8f93\u51fa\u4fe1\u606f\u63d0\u793a\u7684\u76ee\u5f55\u4e0b\u627e\u5230v853_linux_100ask_uart0.img\u955c\u50cf\uff0c\u5c06\u6b64\u955c\u50cf\u6587\u4ef6\u62f7\u8d1d\u5230Windows\u7535\u8111\u4e2d\u3002"}),"\n",(0,i.jsxs)(e.p,{children:["\u7cfb\u7edf\u7684\u70e7\u5f55\u8bf7\u53c2\u8003\u5f00\u53d1",(0,i.jsx)(e.strong,{children:"\u66f4\u65b0\u7cfb\u7edf"}),"\u7ae0\u8282\u3002"]})]})}function p(n={}){const{wrapper:e}={...(0,s.a)(),...n.components};return e?(0,i.jsx)(e,{...n,children:(0,i.jsx)(d,{...n})}):d(n)}},48572:(n,e,o)=>{o.d(e,{Z:()=>i});const i=o.p+"assets/images/image-20230410170425039-b824dc11e62a447dea0499f7d8e72a11.png"},11151:(n,e,o)=>{o.d(e,{Z:()=>r,a:()=>t});var i=o(67294);const s={},a=i.createContext(s);function t(n){const e=i.useContext(a);return i.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function r(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(s):n.components||s:t(n.components),i.createElement(a.Provider,{value:e},n.children)}}}]);