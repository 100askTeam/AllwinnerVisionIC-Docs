"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[3400],{8074:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>h,frontMatter:()=>o,metadata:()=>l,toc:()=>t});var r=i(5893),s=i(1151);const o={sidebar_position:1},d="SDK\u5f00\u53d1\u6307\u5357",l={id:"Dshanpi-R1-Docs/part4/part4-2/SDK",title:"SDK\u5f00\u53d1\u6307\u5357",description:"\u672c\u7ae0\u8282\u5c06\u8bb2\u89e3\u5982\u4f55\u5728RK\u7684SDK-Linux5.10\u7248\u672c\u4e2d\u8fdb\u884c u-boot\u3001kernel \u548c buildroot\u5355\u72ec\u7f16\u8bd1\u4e0e\u914d\u7f6e\u3002\u9ed8\u8ba4\u5df2\u9009\u62e9\u8fc7\u677f\u7ea7\u914d\u7f6e\u6587\u4ef6\uff0c\u5982\u679c\u6ca1\u6709\uff0c\u8bf7\u5148\u9605\u8bfb\u300a\u5f00\u53d1\u73af\u5883\u642d\u5efa\u300b\u7ae0\u8282\uff0c\u4ee5\u4e0b\u64cd\u4f5c\u7686\u5728ubuntu\u6267\u884c\u3002",source:"@site/docs/Dshanpi-R1-Docs/part4/part4-2/01-SDK.md",sourceDirName:"Dshanpi-R1-Docs/part4/part4-2",slug:"/Dshanpi-R1-Docs/part4/part4-2/SDK",permalink:"/en/docs/Dshanpi-R1-Docs/part4/part4-2/SDK",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/linuxboard-docs/tree/main/docs/Dshanpi-R1-Docs/part4/part4-2/01-SDK.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"rk3568Sidebar",previous:{title:"linux5.10",permalink:"/en/docs/category/linux510"},next:{title:"\u9a71\u52a8\u5f00\u53d1\u5165\u95e8",permalink:"/en/docs/category/\u9a71\u52a8\u5f00\u53d1\u5165\u95e8"}},c={},t=[{value:"U-boot\u4f7f\u7528",id:"u-boot\u4f7f\u7528",level:2},{value:"\u914d\u7f6eu-boot",id:"\u914d\u7f6eu-boot",level:3},{value:"uboot\u914d\u7f6e\u4fee\u6539",id:"uboot\u914d\u7f6e\u4fee\u6539",level:4},{value:"uboot\u8bbe\u5907\u6811\u4fee\u6539",id:"uboot\u8bbe\u5907\u6811\u4fee\u6539",level:4},{value:"\u7f16\u8bd1uboot\u90e8\u5206",id:"\u7f16\u8bd1uboot\u90e8\u5206",level:3},{value:"Kernel\u4f7f\u7528",id:"kernel\u4f7f\u7528",level:2},{value:"\u914d\u7f6ekernel",id:"\u914d\u7f6ekernel",level:3},{value:"\u4fee\u6539\u5185\u6838\u914d\u7f6e",id:"\u4fee\u6539\u5185\u6838\u914d\u7f6e",level:4},{value:"\u5185\u6838\u8bbe\u5907\u6811\u4fee\u6539",id:"\u5185\u6838\u8bbe\u5907\u6811\u4fee\u6539",level:4},{value:"\u7f16\u8bd1kernel\u90e8\u5206",id:"\u7f16\u8bd1kernel\u90e8\u5206",level:3},{value:"Buildroot\u4f7f\u7528",id:"buildroot\u4f7f\u7528",level:2},{value:"\u914d\u7f6ebuildroot",id:"\u914d\u7f6ebuildroot",level:3},{value:"\u7f16\u8bd1buildroot\u90e8\u5206",id:"\u7f16\u8bd1buildroot\u90e8\u5206",level:3}];function a(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"sdk\u5f00\u53d1\u6307\u5357",children:"SDK\u5f00\u53d1\u6307\u5357"}),"\n",(0,r.jsx)(n.p,{children:"\u672c\u7ae0\u8282\u5c06\u8bb2\u89e3\u5982\u4f55\u5728RK\u7684SDK-Linux5.10\u7248\u672c\u4e2d\u8fdb\u884c u-boot\u3001kernel \u548c buildroot\u5355\u72ec\u7f16\u8bd1\u4e0e\u914d\u7f6e\u3002\u9ed8\u8ba4\u5df2\u9009\u62e9\u8fc7\u677f\u7ea7\u914d\u7f6e\u6587\u4ef6\uff0c\u5982\u679c\u6ca1\u6709\uff0c\u8bf7\u5148\u9605\u8bfb\u300a\u5f00\u53d1\u73af\u5883\u642d\u5efa\u300b\u7ae0\u8282\uff0c\u4ee5\u4e0b\u64cd\u4f5c\u7686\u5728ubuntu\u6267\u884c\u3002"}),"\n",(0,r.jsx)(n.h2,{id:"u-boot\u4f7f\u7528",children:"U-boot\u4f7f\u7528"}),"\n",(0,r.jsx)(n.h3,{id:"\u914d\u7f6eu-boot",children:"\u914d\u7f6eu-boot"}),"\n",(0,r.jsx)(n.p,{children:"u-boot\u662f\u4e00\u4e2a\u5f15\u5bfc\u52a0\u8f7d\u7a0b\u5e8f\uff0c\u7528\u4e8e\u521d\u59cb\u5316\u786c\u4ef6\u5e76\u5f15\u5bfc\u64cd\u4f5c\u7cfb\u7edf\u3002\u4e00\u822c\u5e76\u4e0d\u9700\u8981\u4fee\u6539\uff0cRK\u5bf9\u4e8e\u539f\u751f\u7684u-boot\u6709\u4e86\u5b8c\u5584\u7684\u652f\u6301\uff0c\u4f8b\u5982\u521d\u59cb\u5316\u786c\u4ef6\uff0cuboot\u4f1a\u4f7f\u7528kernel\u7684\u8bbe\u5907\u6811\u6765\u521d\u59cb\u5316\u3002"}),"\n",(0,r.jsx)(n.p,{children:"\u5982\u679c\u9700\u8981\u4fee\u6539u-boot\uff0c\u5f80\u5f80\u662f\u4fee\u6539\u76f8\u5e94\u5904\u7406\u5668\u7684uboot\u914d\u7f6e\u6587\u4ef6\u3001\u8bbe\u5907\u6811\u3002\u4f8b\u5982rk3568\u5904\u7406\u5668\uff0c\u914d\u7f6e\u6587\u4ef6\u662f u-boot/configs/rk3568_defconfig\uff0c\u8bbe\u5907\u6811\u5728 u-boot/arch/arm/dts/\u76ee\u5f55\u91cc\u3002uboot\u914d\u7f6e\u6587\u4ef6\u53ef\u4ee5\u5728\u677f\u7ea7\u914d\u7f6e\u6587\u4ef6\u91cc\u67e5\u770b\u9700\u8981\u4fee\u6539\u90a3\u4e2a\u6587\u4ef6\u3002"}),"\n",(0,r.jsx)(n.h4,{id:"uboot\u914d\u7f6e\u4fee\u6539",children:"uboot\u914d\u7f6e\u4fee\u6539"}),"\n",(0,r.jsx)(n.p,{children:"\u8fdb\u5165 SDK/u-boot/ \u76ee\u5f55\u4e0b\uff0c\u6267\u884c\u4ee5\u4e0b\u6307\u4ee4\uff0c\u6253\u5f00\u914d\u7f6e\u754c\u9762\uff0c"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"make rk3568_defconfig\nmake menuconfig\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u5982\u4e0b\uff1a"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20250114120312921",src:i(413).Z+"",width:"2452",height:"1183"})}),"\n",(0,r.jsxs)(n.p,{children:["\u5982\u679c\u6267\u884c\u4e86\u4fee\u6539\uff0c\u9700\u8981\u8fdb\u884c\u4fdd\u5b58",(0,r.jsx)(n.code,{children:"Save"})," \u7136\u540e \u9000\u51fa",(0,r.jsx)(n.code,{children:"Exit"}),"\u3002\u4ec5\u4ec5\u8fd9\u6837\u64cd\u4f5c\u5e76\u4e0d\u4f1a\u4fee\u6539 ",(0,r.jsx)(n.code,{children:"rk3568_defconfig"}),"\uff0c\u9700\u8981\u8fdb\u884c\u4ee5\u4e0b\u64cd\u4f5c\uff1a"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"make savedefconfig\ncp defconfig configs/rk3568_defconfig\n"})}),"\n",(0,r.jsx)(n.h4,{id:"uboot\u8bbe\u5907\u6811\u4fee\u6539",children:"uboot\u8bbe\u5907\u6811\u4fee\u6539"}),"\n",(0,r.jsx)(n.p,{children:"\u5982\u679c\u9700\u8981\u4fee\u6539\u8bbe\u5907\u6811\uff0c\u5728 SDK/u-boot/arch/arm/dts/ \u76ee\u5f55\u4e0b\uff0c\u627e\u5230\u76f8\u5e94\u7684\u8bbe\u5907\u6811\u6587\u4ef6\u8fdb\u884c\u4fee\u6539\uff0crk3568\u7684\u8bbe\u5907\u6811\u6587\u4ef6\u5305\u542b\u5173\u7cfb\u5982\u4e0b\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"rk3568-evb.dts\n\trk3568.dtsi\n\t\trk3568-pinctrl.dtsi\n\trk3568-u-boot.dtsi\n"})}),"\n",(0,r.jsx)(n.h3,{id:"\u7f16\u8bd1uboot\u90e8\u5206",children:"\u7f16\u8bd1uboot\u90e8\u5206"}),"\n",(0,r.jsxs)(n.p,{children:["RK\u7684SDK\u6e90\u7801\uff0c\u6709\u63d0\u4f9b\u4e00\u4e2a\u7f16\u8bd1\u811a\u672c ",(0,r.jsx)(n.code,{children:"./build.sh"}),"\uff0c\u6211\u4eec\u53ef\u4ee5\u6839\u636e\u811a\u672c\u4f7f\u7528\u6307\u4ee4\u6765\u67e5\u770b\u5982\u4f55\u7f16\u8bd1u-boot\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u8fdb\u5165SDK\u6e90\u7801\u6839\u76ee\u5f55\uff0c\u6267\u884c\u4ee5\u4e0b\u6307\u4ee4\uff0c\u7f16\u8bd1uboot\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"./build.sh uboot\n"})}),"\n",(0,r.jsx)(n.h2,{id:"kernel\u4f7f\u7528",children:"Kernel\u4f7f\u7528"}),"\n",(0,r.jsx)(n.h3,{id:"\u914d\u7f6ekernel",children:"\u914d\u7f6ekernel"}),"\n",(0,r.jsx)(n.p,{children:"\u5728kernel\u9636\u6bb5\uff0c\u5e38\u5e38\u9700\u8981\u589e\u51cf\u9a71\u52a8\u3001\u8bbe\u5907\u6811\u8282\u70b9\uff0c\u6765\u9002\u914d\u677f\u8f7d\u786c\u4ef6\u529f\u80fd\u3002kernel\u6e90\u7801\u5728 SDK/kernel/ \u76ee\u5f55\u4e0b\u3002"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20250114142641029",src:i(7860).Z+"",width:"2399",height:"407"})}),"\n",(0,r.jsx)(n.h4,{id:"\u4fee\u6539\u5185\u6838\u914d\u7f6e",children:"\u4fee\u6539\u5185\u6838\u914d\u7f6e"}),"\n",(0,r.jsx)(n.p,{children:"\u5982\u679c\u60f3\u5bf9\u5185\u6838\u6e90\u7801\u8fdb\u884c\u914d\u7f6e\uff0c\u4f8b\u5982\u628a\u67d0\u4e2a\u9a71\u52a8\u7f16\u8bd1\u8fdb\u5185\u6838\u6216\u8005\u7f16\u8bd1\u6210\u6a21\u5757\uff0c\u8fdb\u5165kernel\u6e90\u7801\u76ee\u5f55\uff0c\u6267\u884c\u4ee5\u4e0b\u6307\u4ee4\uff0c\u6253\u5f00\u5185\u6838\u7684\u914d\u7f6e\u754c\u9762\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"make ARCH=arm64 menuconfig\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u6267\u884c\u540e\uff0c\u4f1a\u8fdb\u5165\u5185\u6838\u914d\u7f6e\u754c\u9762\uff0c\u5982\u4e0b\uff1a"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20250114152615241",src:i(6494).Z+"",width:"2443",height:"1174"})}),"\n",(0,r.jsx)(n.p,{children:"\u5982\u679c\u4fee\u6539\u4e86\u5185\u6838\u914d\u7f6e\u4fe1\u606f\uff0c\u9664\u4e86\u4fdd\u5b58\u9000\u51fa\uff0c\u8fd8\u9700\u8981\u6267\u884c\u4ee5\u4e0b\u64cd\u4f5c\uff0c\u5426\u5219\u7f16\u8bd1\u65f6\u4f1a\u590d\u539f\u4e3a\u4fee\u6539\u524d\u7684\u914d\u7f6e\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"make ARCH=arm64 savedefconfig\ncp defconfig arch/arm64/configs/rockchip_100ask_linux_defconfig\n"})}),"\n",(0,r.jsx)(n.h4,{id:"\u5185\u6838\u8bbe\u5907\u6811\u4fee\u6539",children:"\u5185\u6838\u8bbe\u5907\u6811\u4fee\u6539"}),"\n",(0,r.jsx)(n.p,{children:"\u8bbe\u5907\u6811\u6587\u4ef6\u662frk3568-100ask-evb1-ddr4-v10-linux.dts\uff0c\u5b58\u653e\u5728 SDK/kernel/arch/arm64/boot/dts/rockchip/\u76ee\u5f55\u4e0b\uff0crk3568-100ask-evb1-ddr4-v10-linux.dts\u5305\u542b\u591a\u4e2adtsi\u6587\u4ef6\uff0c\u5176\u5305\u542b\u5173\u7cfb\u5982\u4e0b\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"rk3568-100ask-evb1-ddr4-v10-linux.dts\n\trk3568-100ask-evb1-ddr4-v10.dtsi\n\t\trk3568.dtsi\n\t\trk3568-100ask-evb.dtsi\n\trk3568-100ask-480-800-mipi.dtsi\n\trk3568-100ask-typec.dtsi\n\trk3568-linux.dtsi\n"})}),"\n",(0,r.jsx)(n.h3,{id:"\u7f16\u8bd1kernel\u90e8\u5206",children:"\u7f16\u8bd1kernel\u90e8\u5206"}),"\n",(0,r.jsxs)(n.p,{children:["RK\u7684SDK\u6e90\u7801\uff0c\u6709\u63d0\u4f9b\u4e00\u4e2a\u7f16\u8bd1\u811a\u672c ",(0,r.jsx)(n.code,{children:"./build.sh"}),"\uff0c\u6211\u4eec\u53ef\u4ee5\u6839\u636e\u811a\u672c\u4f7f\u7528\u6307\u4ee4\u6765\u67e5\u770b\u5982\u4f55\u7f16\u8bd1kernel\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u8fdb\u5165SDK\u6e90\u7801\u6839\u76ee\u5f55\uff0c\u6267\u884c\u4ee5\u4e0b\u6307\u4ee4\uff0c\u7f16\u8bd1kernel\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"./build.sh kernel\n"})}),"\n",(0,r.jsx)(n.h2,{id:"buildroot\u4f7f\u7528",children:"Buildroot\u4f7f\u7528"}),"\n",(0,r.jsx)(n.h3,{id:"\u914d\u7f6ebuildroot",children:"\u914d\u7f6ebuildroot"}),"\n",(0,r.jsx)(n.p,{children:"Buildroot \u662f\u4e00\u4e2a\u5f00\u6e90\u5de5\u5177\uff0c\u7528\u4e8e\u5feb\u901f\u751f\u6210\u5d4c\u5165\u5f0f Linux \u7cfb\u7edf\u7684\u6839\u6587\u4ef6\u7cfb\u7edf\u3001\u5185\u6838\u548c\u5f15\u5bfc\u52a0\u8f7d\u7a0b\u5e8f\u3002RK\u7684SDK\u91cc\u8fd8\u6709Yocto\u6784\u5efa\u5de5\u5177\uff0c\u9ed8\u8ba4\u662f\u4f7f\u7528 Buildroot \uff0c\u8fd9\u91cc\u4f7f\u7528\u7684\u4e5f\u662f Buildroot\u3002"}),"\n",(0,r.jsx)(n.p,{children:"Buildroot \u7684\u6e90\u7801\u5b58\u653e\u5728 SDK/buildroot/ \u76ee\u5f55\u5e95\u4e0b\uff0c"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20250114160651627",src:i(8882).Z+"",width:"1969",height:"133"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"ubuntu@ubuntu2004:~/rk3568_linux5.10_sdk/buildroot$ tree -L 1\n.\n\u251c\u2500\u2500 arch               #\u5b58\u653e\u4e0e\u7279\u5b9a\u67b6\u6784\u76f8\u5173\u7684\u4ee3\u7801\u548c\u914d\u7f6e\u6587\u4ef6\uff0c\u4f8b\u5982\u4e0d\u540c\u5904\u7406\u5668\u67b6\u6784\u7684\u652f\u6301\u3002\n\u251c\u2500\u2500 board              #\u5305\u542b\u7279\u5b9a\u786c\u4ef6\u5e73\u53f0\u7684\u652f\u6301\u6587\u4ef6\u548c\u914d\u7f6e\uff0c\u7528\u4e8e\u5b9a\u4e49\u7279\u5b9a\u677f\u5361\u7684\u6784\u5efa\u8fc7\u7a0b\u548c\u8bbe\u7f6e\u3002\n\u251c\u2500\u2500 boot               #\u5305\u542b\u4e0e\u5f15\u5bfc\u76f8\u5173\u7684\u6587\u4ef6\u548c\u811a\u672c\uff0c\u5904\u7406\u5f15\u5bfc\u52a0\u8f7d\u7a0b\u5e8f\u7684\u6784\u5efa\u548c\u914d\u7f6e\u3002\n\u251c\u2500\u2500 build              #\u4e34\u65f6\u6784\u5efa\u76ee\u5f55\uff0c\u7528\u4e8e\u5b58\u653e\u6784\u5efa\u8fc7\u7a0b\u4e2d\u4ea7\u751f\u7684\u4e2d\u95f4\u6587\u4ef6\u3002\n\u251c\u2500\u2500 CHANGES\n\u251c\u2500\u2500 Config.in          #\u914d\u7f6e\u6587\u4ef6\uff0c\u5b9a\u4e49\u4e86\u53ef\u4f9b\u9009\u62e9\u7684\u914d\u7f6e\u9009\u9879\uff0c\u5e76\u6307\u5b9a\u5176\u4f9d\u8d56\u5173\u7cfb\uff0c\u901a\u5e38\u7528\u4e8e\u914d\u7f6e\u83dc\u5355\u3002\n\u251c\u2500\u2500 Config.in.legacy\n\u251c\u2500\u2500 configs            #\u5305\u542b\u9884\u5b9a\u4e49\u7684\u914d\u7f6e\u6587\u4ef6\uff08.config\uff09\uff0c\u9002\u7528\u4e8e\u7279\u5b9a\u786c\u4ef6\u6216\u9879\u76ee\uff0c\u53ef\u4ee5\u901a\u8fc7\u8fd9\u4e9b\u6587\u4ef6\u5feb\u901f\u5f00\u59cb\u6784\u5efa\u3002\n\u251c\u2500\u2500 COPYING\n\u251c\u2500\u2500 DEVELOPERS\n\u251c\u2500\u2500 dl                 #\u4e0b\u8f7d\u76ee\u5f55\uff0c\u5b58\u653e\u5728\u6784\u5efa\u8fc7\u7a0b\u4e2d\u4e0b\u8f7d\u7684\u8f6f\u4ef6\u5305\u548c\u6e90\u4ee3\u7801\u3002\n\u251c\u2500\u2500 docs\t\t\t   #\u5305\u542b\u6587\u6863\u548c\u8bf4\u660e\uff0c\u5e2e\u52a9\u7406\u89e3\u548c\u4f7f\u7528 Buildroot\u3002\n\u251c\u2500\u2500 fs\t\t\t\t   #\u5b58\u653e\u4e0e\u6587\u4ef6\u7cfb\u7edf\u76f8\u5173\u7684\u4ee3\u7801\u548c\u914d\u7f6e\u3002\n\u251c\u2500\u2500 linux              #\u5305\u542b\u5185\u6838\u76f8\u5173\u7684\u914d\u7f6e\u548c\u6587\u4ef6\uff0c\u652f\u6301\u6784\u5efa Linux \u5185\u6838\u3002\n\u251c\u2500\u2500 Makefile           #\u4e3b\u8981\u7684\u6784\u5efa\u6587\u4ef6\uff0c\u5b9a\u4e49\u4e86\u5982\u4f55\u6784\u5efa\u6574\u4e2a\u9879\u76ee\uff0c\u5305\u542b\u6784\u5efa\u6d41\u7a0b\u7684\u89c4\u5219\u548c\u76ee\u6807\u3002\n\u251c\u2500\u2500 Makefile.legacy\n\u251c\u2500\u2500 output             #\u5b58\u653e\u6700\u7ec8\u6784\u5efa\u7ed3\u679c\uff0c\u5305\u62ec\u751f\u6210\u7684\u6839\u6587\u4ef6\u7cfb\u7edf\u548c\u5176\u4ed6\u4ea7\u7269\u7684\u76ee\u5f55\u3002\n\u251c\u2500\u2500 package            #\u5305\u542b\u6240\u6709\u53ef\u7528\u8f6f\u4ef6\u5305\u7684\u5b9a\u4e49\u548c\u6784\u5efa\u4fe1\u606f\uff0c\u5141\u8bb8\u9009\u62e9\u548c\u96c6\u6210\u4e0d\u540c\u7684\u8f6f\u4ef6\u5305\u3002\n\u251c\u2500\u2500 README\n\u251c\u2500\u2500 support            #\u5305\u542b\u7528\u4e8e\u652f\u6301\u6784\u5efa\u7684\u5de5\u5177\u548c\u811a\u672c\uff0c\u53ef\u80fd\u5305\u62ec\u8c03\u8bd5\u5de5\u5177\u548c\u6d4b\u8bd5\u811a\u672c\u3002\n\u251c\u2500\u2500 system             #\u4e0e\u7cfb\u7edf\u7ea7\u914d\u7f6e\u548c\u670d\u52a1\u76f8\u5173\u7684\u6587\u4ef6\u548c\u8bbe\u7f6e\u3002\n\u251c\u2500\u2500 toolchain          #\u5b58\u653e\u4e0e\u5de5\u5177\u94fe\u76f8\u5173\u7684\u6587\u4ef6\u548c\u914d\u7f6e\uff0c\u5305\u62ec\u4ea4\u53c9\u7f16\u8bd1\u5668\u7684\u8bbe\u7f6e\u3002\n\u2514\u2500\u2500 utils              #\u5b9e\u7528\u5de5\u5177\u548c\u8f85\u52a9\u811a\u672c\uff0c\u7528\u4e8e\u652f\u6301\u6784\u5efa\u8fc7\u7a0b\u6216\u63d0\u4f9b\u5176\u4ed6\u529f\u80fd\u3002\n\n15 directories, 8 files\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u8fdb\u5165SDK\u6e90\u7801\u6839\u76ee\u5f55\uff0c"}),"\n",(0,r.jsx)(n.p,{children:"\u5728\u5f53\u524d\u76ee\u5f55\u4e0b\uff0c\u6267\u884c\u4ee5\u4e0b\u64cd\u4f5c\uff0c\u53ef\u4ee5\u6253\u5f00buildroot\u914d\u7f6e\u754c\u9762\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"source envsetup.sh\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u9009\u62e9buildroot\u914d\u7f6e\u6587\u4ef6rockchip_rk3568_100ask\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"op of tree: /home/ubuntu/rk3568_linux5.10_sdk\n\nPick a board:\n...\n44. rockchip_rk3568_100ask\n45. rockchip_rk3568_32\n46. rockchip_rk3568_recovery\n47. rockchip_rk3588\n48. rockchip_rk3588_base\n49. rockchip_rk3588_ramboot\n50. rockchip_rk3588_recovery\nWhich would you like? [1]: 44\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u8fdb\u5165buildroot\u6e90\u7801\u8def\u5f84\uff0c\u6267\u884c\u4ee5\u4e0b\u6307\u4ee4\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"make menuconfig\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u6267\u884c\u540e\uff0c\u4f1a\u8fdb\u5165buildroot\u914d\u7f6e\u754c\u9762\uff0c\u5982\u4e0b\uff1a"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"image-20250114162538975",src:i(1414).Z+"",width:"2438",height:"1170"})}),"\n",(0,r.jsxs)(n.p,{children:["\u53ef\u4ee5\u5728\u914d\u7f6e\u754c\u9762\uff0c\u9009\u4e0a\u4e00\u4e9b\u9700\u8981\u7684package\u7b49\uff0c\u914d\u7f6e\u5b8c\u6210\u540e\uff0c\u9009\u62e9\u4fdd\u5b58",(0,r.jsx)(n.code,{children:"Save"}),"\uff0c\u7136\u540e\u9000\u51fa",(0,r.jsx)(n.code,{children:"Exit"}),"\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u6267\u884c\u4ee5\u4e0b\u6307\u4ee4\u5373\u53ef\u4fdd\u5b58\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"make savedefconfig\n"})}),"\n",(0,r.jsx)(n.h3,{id:"\u7f16\u8bd1buildroot\u90e8\u5206",children:"\u7f16\u8bd1buildroot\u90e8\u5206"}),"\n",(0,r.jsxs)(n.p,{children:["RK\u7684SDK\u6e90\u7801\uff0c\u6709\u63d0\u4f9b\u4e00\u4e2a\u7f16\u8bd1\u811a\u672c ",(0,r.jsx)(n.code,{children:"./build.sh"}),"\uff0c\u6211\u4eec\u53ef\u4ee5\u6839\u636e\u811a\u672c\u4f7f\u7528\u6307\u4ee4\u6765\u67e5\u770b\u5982\u4f55\u7f16\u8bd1buildroot\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u8fdb\u5165SDK\u6e90\u7801\u6839\u76ee\u5f55\uff0c\u6267\u884c\u4ee5\u4e0b\u6307\u4ee4\uff0c\u7f16\u8bd1buildroot\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"./build.sh buildroot\n"})})]})}function h(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},413:(e,n,i)=>{i.d(n,{Z:()=>r});const r=i.p+"assets/images/image-20250114120312921-d7dc94070b15d93154414d30efd015d9.png"},7860:(e,n,i)=>{i.d(n,{Z:()=>r});const r=i.p+"assets/images/image-20250114142641029-b3f444876279677d6d88061323261e6e.png"},6494:(e,n,i)=>{i.d(n,{Z:()=>r});const r=i.p+"assets/images/image-20250114152615241-2d0d107247e82f802463f8da7ac8febd.png"},8882:(e,n,i)=>{i.d(n,{Z:()=>r});const r=i.p+"assets/images/image-20250114160651627-450581b1e7094e42072effba15870bfd.png"},1414:(e,n,i)=>{i.d(n,{Z:()=>r});const r=i.p+"assets/images/image-20250114162538975-c55913081c63c8daafb98e4d1a6eb352.png"},1151:(e,n,i)=>{i.d(n,{Z:()=>l,a:()=>d});var r=i(7294);const s={},o=r.createContext(s);function d(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:d(e.components),r.createElement(o.Provider,{value:n},e.children)}}}]);