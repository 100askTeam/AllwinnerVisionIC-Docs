"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8624],{12792:(n,e,i)=>{i.r(e),i.d(e,{assets:()=>t,contentTitle:()=>d,default:()=>p,frontMatter:()=>r,metadata:()=>a,toc:()=>c});var s=i(85893),o=i(11151);const r={sidebar_position:4},d="MIPI\u6444\u50cf\u5934\u9002\u914d\u6307\u5357",a={id:"V853/part2/02-4_MIPICameraAdaptationGuide",title:"MIPI\u6444\u50cf\u5934\u9002\u914d\u6307\u5357",description:"0.\u524d\u8a00",source:"@site/docs/V853/part2/02-4_MIPICameraAdaptationGuide.md",sourceDirName:"V853/part2",slug:"/V853/part2/02-4_MIPICameraAdaptationGuide",permalink:"/docs/V853/part2/02-4_MIPICameraAdaptationGuide",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/AllwinnerVisionIC-Docs/tree/main/docs/V853/part2/02-4_MIPICameraAdaptationGuide.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"v853Sidebar",previous:{title:"\u6ce2\u8f6e\u5f00\u5173\u9002\u914d\u6307\u5357",permalink:"/docs/V853/part2/02-3_PulleySwitchAdaptationGuide"},next:{title:"AI\u5e94\u7528\u5f00\u53d1",permalink:"/docs/category/ai\u5e94\u7528\u5f00\u53d1"}},t={},c=[{value:"0.\u524d\u8a00",id:"0\u524d\u8a00",level:2},{value:"1.VIN\u6846\u67b6\u4ecb\u7ecd",id:"1vin\u6846\u67b6\u4ecb\u7ecd",level:2},{value:"2.\u9a71\u52a8\u914d\u7f6e",id:"2\u9a71\u52a8\u914d\u7f6e",level:2},{value:"3.\u8bbe\u5907\u6811\u914d\u7f6e",id:"3\u8bbe\u5907\u6811\u914d\u7f6e",level:2},{value:"4.\u5185\u6838\u914d\u7f6e",id:"4\u5185\u6838\u914d\u7f6e",level:2},{value:"5.Tina\u914d\u7f6e",id:"5tina\u914d\u7f6e",level:2},{value:"6.modules.mk\u914d\u7f6e",id:"6modulesmk\u914d\u7f6e",level:2},{value:"7.S00mpp\u914d\u7f6e",id:"7s00mpp\u914d\u7f6e",level:2},{value:"8.\u589e\u52a0\u6444\u50cf\u5934\u6d4b\u8bd5\u7a0b\u5e8f",id:"8\u589e\u52a0\u6444\u50cf\u5934\u6d4b\u8bd5\u7a0b\u5e8f",level:2},{value:"8.\u7f16\u8bd1\u70e7\u5199\u955c\u50cf",id:"8\u7f16\u8bd1\u70e7\u5199\u955c\u50cf",level:2},{value:"9.\u8fd0\u884ccamera\u6d4b\u8bd5\u7a0b\u5e8f",id:"9\u8fd0\u884ccamera\u6d4b\u8bd5\u7a0b\u5e8f",level:2}];function l(n){const e={a:"a",code:"code",h1:"h1",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,o.a)(),...n.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(e.h1,{id:"mipi\u6444\u50cf\u5934\u9002\u914d\u6307\u5357",children:"MIPI\u6444\u50cf\u5934\u9002\u914d\u6307\u5357"}),"\n",(0,s.jsx)(e.h2,{id:"0\u524d\u8a00",children:"0.\u524d\u8a00"}),"\n",(0,s.jsx)(e.p,{children:"\u200b\tDongshanPI-AICT\u5f00\u53d1\u677f\u652f\u63014LINE\u7684MIPI\u6444\u50cf\u5934\u548c2LINE\u7684MIPI\u6444\u50cf\u5934\uff0c\u4f7f\u7528\u767e\u95ee\u7f51\u63d0\u4f9b\u7684Tina SDK\u5305\u751f\u6210\u7684\u955c\u50cf\uff0c\u7cfb\u7edf\u5df2\u7ecf\u914d\u7f6e\u597d\u4e86\uff0c\u53ef\u4ee5\u76f4\u63a5\u4f7f\u7528\u3002\u672c\u7ae0\u4ecb\u7ecd\u5982\u4f55\u53bb\u9002\u914d\u4e00\u4e2aMIPI\u6444\u50cf\u5934\uff0c\u672c\u6587\u6240\u7528\u76842LINE\u7684MIPI\u6444\u50cf\u5934\uff0c\u5927\u5bb6\u53ef\u4ee5\u5728\u767e\u95ee\u7f51\u5b98\u65b9\u6dd8\u5b9d\u5e97\u94fa\u4e0a\u8d2d\u4e70\u3002"}),"\n",(0,s.jsxs)(e.p,{children:["\u5168\u5fd7Linux Tina-SDK\u5f00\u53d1\u5b8c\u5168\u624b\u518c\uff1a",(0,s.jsx)(e.a,{href:"https://tina.100ask.net/",children:"https://tina.100ask.net/"})]}),"\n",(0,s.jsx)(e.p,{children:"\u5982\u679c\u60a8\u60f3\u9002\u914d\u81ea\u5df1\u7684\u6444\u50cf\u5934\uff0c\u5f3a\u70c8\u5efa\u8bae\u60a8\u53c2\u7167\u4ee5\u4e0b\u5f00\u53d1\u6307\u5357\u8fdb\u884c\u64cd\u4f5c\uff1a"}),"\n",(0,s.jsxs)(e.p,{children:["Camera_\u5f00\u53d1\u6307\u5357\uff1a",(0,s.jsx)(e.a,{href:"https://tina.100ask.net/SdkModule/Linux_Camera_DevelopmentGuide-01/",children:"https://tina.100ask.net/SdkModule/Linux_Camera_DevelopmentGuide-01/"})]}),"\n",(0,s.jsx)(e.h2,{id:"1vin\u6846\u67b6\u4ecb\u7ecd",children:"1.VIN\u6846\u67b6\u4ecb\u7ecd"}),"\n",(0,s.jsx)(e.p,{children:"V853\u652f\u6301\u5e76\u53e3CSI\u3001MIPI\uff0c\u4f7f\u7528VIN camera\u9a71\u52a8\u6846\u67b6\u3002"}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"Camera \u901a\u8def\u6846\u67b6"})}),"\n",(0,s.jsx)(e.p,{children:"\u2022 VIN \u652f\u6301\u7075\u6d3b\u914d\u7f6e\u5355/\u53cc\u8def\u8f93\u5165\u53ccISP \u591a\u901a\u8def\u8f93\u51fa\u7684\u89c4\u683c"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 \u5f15\u5165media \u6846\u67b6\u5b9e\u73b0pipeline \u7ba1\u7406"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 \u5c06libisp \u79fb\u690d\u5230\u7528\u6237\u7a7a\u95f4\u89e3\u51b3GPL \u95ee\u9898"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 \u5c06\u7edf\u8ba1buffer \u72ec\u7acb\u4e3av4l2 subdev"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 \u5c06\u7684scaler\uff08vipp\uff09\u6a21\u5757\u72ec\u7acb\u4e3av4l2 subdev"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 \u5c06video buffer \u4fee\u6539\u4e3amplane \u65b9\u5f0f\uff0c\u4f7f\u7528\u6237\u5c42\u53d6\u56fe\u66f4\u65b9\u4fbf"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 \u91c7\u7528v4l2-event \u5b9e\u73b0\u4e8b\u4ef6\u7ba1\u7406"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 \u91c7\u7528v4l2-controls \u65b0\u7279\u6027"}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.img,{alt:"image-20230419160150480",src:i(51403).Z+"",width:"1284",height:"539"})}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"VIN \u6846\u67b6"})}),"\n",(0,s.jsx)(e.p,{children:"\u2022 \u4f7f\u7528\u8fc7\u7a0b\u4e2d\u53ef\u7b80\u5355\u7684\u770b\u6210\u662fvin \u6a21\u5757+ device \u6a21\u5757+af driver + flash \u63a7\u5236\u6a21\u5757\u7684\u65b9\u5f0f\uff1b"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 vin.c \u662f\u9a71\u52a8\u7684\u4e3b\u8981\u529f\u80fd\u5b9e\u73b0\uff0c\u5305\u62ec\u6ce8\u518c/\u6ce8\u9500\u3001\u53c2\u6570\u8bfb\u53d6\u3001\u4e0ev4l2 \u4e0a\u5c42\u63a5\u53e3\u3001\u4e0e\u5404device \u7684\u4e0b\u5c42\u63a5\u53e3\u3001\u4e2d\u65ad\u5904\u7406\u3001buffer \u7533\u8bf7\u5207\u6362\u7b49\uff1b"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 modules/sensor \u6587\u4ef6\u5939\u91cc\u9762\u662f\u5404\u4e2asensor \u7684\u5668\u4ef6\u5c42\u5b9e\u73b0\uff0c\u4e00\u822c\u5305\u62ec\u4e0a\u4e0b\u7535\u3001\u521d\u59cb\u5316\uff0c\u5404\u5206\u8fa8\u7387\u5207\u6362\uff0cyuv sensor \u5305\u62ec\u7edd\u5927\u90e8\u5206\u7684v4l2 \u5b9a\u4e49\u7684ioctrl \u547d\u4ee4\u7684\u5b9e"}),"\n",(0,s.jsx)(e.p,{children:"\u73b0\uff1b\u800craw sensor \u7684\u8bdd\u5927\u90e8\u5206ioctrl \u547d\u4ee4\u5728vin \u5c42\u8c03\u7528isp \u5e93\u5b9e\u73b0\uff0c\u5c11\u6570\u5982\u66dd\u5149/\u589e\u76ca\u8c03\u8282\u4f1a\u900f\u8fc7vin \u5c42\u5230\u5b9e\u9645\u5668\u4ef6\u5c42\uff1b"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 modules/actuator \u6587\u4ef6\u5939\u5185\u662f\u5404\u79cdvcm \u7684\u9a71\u52a8\uff1b"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 modules/flash \u6587\u4ef6\u5939\u5185\u662f\u95ea\u5149\u706f\u63a7\u5236\u63a5\u53e3\u5b9e\u73b0\uff1b"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 vin-csi \u548cvin-mipi \u4e3a\u5bf9csi \u63a5\u53e3\u548cmipi \u63a5\u53e3\u7684\u63a7\u5236\u6587\u4ef6\uff1b"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 vin-isp \u6587\u4ef6\u5939\u4e3aisp \u7684\u5e93\u64cd\u4f5c\u6587\u4ef6\uff1b"}),"\n",(0,s.jsx)(e.p,{children:"\u2022 vin-video \u6587\u4ef6\u5939\u5185\u4e3b\u8981\u662fvideo \u8bbe\u5907\u64cd\u4f5c\u6587\u4ef6\uff1b"}),"\n",(0,s.jsx)(e.p,{children:"\u9a71\u52a8\u8def\u5f84\u4f4d\u4e8elinux-4.9/drivers/media/platform/sunxi-vin \u4e0b\u3002"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"sunxi-vin:\n\u2502 vin.c ;v4l2\u9a71\u52a8\u5b9e\u73b0\u4e3b\u4f53\uff08\u5305\u542b\u89c6\u9891\u63a5\u53e3\u548cISP\u90e8\u5206\uff09\n\u2502 vin.h ;v4l2\u9a71\u52a8\u5934\u6587\u4ef6\n\u2502 top_reg.c ;vin\u5bf9\u5404v4l2 subdev\u7ba1\u7406\u63a5\u53e3\u5b9e\u73b0\u4e3b\u4f53\n\u2502 top_reg.h ;\u7ba1\u7406\u63a5\u53e3\u5934\u6587\u4ef6\n\u2502 top_reg_i.h ;vin\u6a21\u5757\u63a5\u53e3\u5c42\u90e8\u5206\u7ed3\u6784\u4f53\n\u251c\u2500\u2500 modules\n\u2502 \u251c\u2500\u2500 actuator ;vcm driver\n\u2502 \u2502 \u251c\u2500\u2500 actuator.c\n\u2502 \u2502 \u251c\u2500\u2500 actuator.h\n\u2502 \u2502 \u251c\u2500\u2500 dw9714_act.c\n\u2502 \u2502 \u251c\u2500\u2500 Makefile\n\u2502 \u251c\u2500\u2500 flash ;\u95ea\u5149\u706fdriver\n\u2502 \u2502 \u251c\u2500\u2500 flash.c\n\u2502 \u2502 \u2514\u2500\u2500 flash.h\n\u2502 \u2514\u2500\u2500 sensor ;sensor driver\n\u2502 \u251c\u2500\u2500 ar0144_mipi.c\n\u2502 \u251c\u2500\u2500 camera_cfg.h ;camera ioctl\u6269\u5c55\u547d\u4ee4\u5934\u6587\u4ef6\n\u2502 \u251c\u2500\u2500 camera.h ;camera\u516c\u7528\u7ed3\u6784\u4f53\u5934\u6587\u4ef6\n\u2502 \u251c\u2500\u2500 Makefile\n\u2502 \u251c\u2500\u2500 ov2775_mipi.c\n\u2502 \u251c\u2500\u2500 ov5640.c\n\u2502 \u251c\u2500\u2500 sensor-compat-ioctl32.c\n\u2502 \u251c\u2500\u2500 sensor_helper.c ;sensor\u516c\u7528\u64cd\u4f5c\u63a5\u53e3\u51fd\u6570\u6587\u4ef6\n\u2502 \u251c\u2500\u2500 sensor_helper.h\n\u251c\u2500\u2500 platform ;\u5e73\u53f0\u76f8\u5173\u7684\u914d\u7f6e\u63a5\u53e3\n\u251c\u2500\u2500 utility\n\u2502 \u251c\u2500\u2500 bsp_common.c\n\u2502 \u251c\u2500\u2500 bsp_common.h\n\u2502 \u251c\u2500\u2500 cfg_op.c\n\u2502 \u251c\u2500\u2500 cfg_op.h\n\u2502 \u251c\u2500\u2500 config.c\n\u2502 \u251c\u2500\u2500 config.h\n\u2502 \u251c\u2500\u2500 sensor_info.c\n\u2502 \u251c\u2500\u2500 sensor_info.h\n\u2502 \u251c\u2500\u2500 vin_io.h\n\u2502 \u251c\u2500\u2500 vin_os.c\n\u2502 \u251c\u2500\u2500 vin_os.h\n\u2502 \u251c\u2500\u2500 vin_supply.c\n\u2502 \u2514\u2500\u2500 vin_supply.h\n\u251c\u2500\u2500 vin-cci\n\u2502 \u251c\u2500\u2500 sunxi_cci.c\n\u2502 \u2514\u2500\u2500 sunxi_cci.h\n\u251c\u2500\u2500 vin-csi\n\u2502 \u251c\u2500\u2500 parser_reg.c\n\u2502 \u251c\u2500\u2500 parser_reg.h\n\u2502 \u251c\u2500\u2500 parser_reg_i.h\n\u2502 \u251c\u2500\u2500 sunxi_csi.c\n\u2502 \u2514\u2500\u2500 sunxi_csi.h\n\u251c\u2500\u2500 vin-isp\n\u2502 \u251c\u2500\u2500 sunxi_isp.c\n\u2502 \u2514\u2500\u2500 sunxi_isp.h\n\u251c\u2500\u2500 vin-mipi\n\u2502 \u251c\u2500\u2500 sunxi_mipi.c\n\u2502 \u2514\u2500\u2500 sunxi_mipi.h\n\u251c\u2500\u2500 vin-stat\n\u2502 \u251c\u2500\u2500 vin_h3a.c\n\u2502 \u251c\u2500\u2500 vin_h3a.h\n\u2502 \u251c\u2500\u2500 vin_ispstat.c\n\u2502 \u2514\u2500\u2500 vin_ispstat.h\n\u251c\u2500\u2500 vin_test\n\u251c\u2500\u2500 vin-video\n\u2502 \u251c\u2500\u2500 vin_core.c\n\u2502 \u251c\u2500\u2500 vin_core.h\n\u2502 \u251c\u2500\u2500 vin_video.c\n\u2502 \u2514\u2500\u2500 vin_video.h\n\u2514\u2500\u2500 vin-vipp\n\u251c\u2500\u2500 sunxi_scaler.c\n\u251c\u2500\u2500 sunxi_scaler.h\n\u251c\u2500\u2500 vipp_reg.c\n\u251c\u2500\u2500 vipp_reg.h\n\u2514\u2500\u2500 vipp_reg_i.h\n"})}),"\n",(0,s.jsx)(e.h2,{id:"2\u9a71\u52a8\u914d\u7f6e",children:"2.\u9a71\u52a8\u914d\u7f6e"}),"\n",(0,s.jsx)(e.p,{children:"\u200b\tDongshanPI-AICT\u5f00\u53d1\u677f\u652f\u63014LINE\u53cc\u6444\u955c\u5934\u6a21\u7ec4\u548c2LINE\u5355\u6444\u955c\u5934\u6a21\u7ec4\uff0c\u4e0b\u9762\u6211\u4ec5\u6f14\u793a2LINE\u7684MIPI\u6444\u50cf\u5934\u5982\u4f55\u8fdb\u884c\u914d\u7f6e\u3002\u6211\u4eec\u4f7f\u7528\u7684\u662fGC2053\u6444\u50cf\u5934\uff0c\u4f7f\u7528\u7684\u662f\u5168\u5fd7\u5df2\u7ecf\u5185\u7f6e\u7684\u9a71\u52a8\u7a0b\u5e8f\uff0c\u8def\u5f84\u4e3a\uff1a"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"kernel/linux-4.9/drivers/media/platform/sunxi-vin/modules/sensor/gc2053_mipi.c\n"})}),"\n",(0,s.jsx)(e.h2,{id:"3\u8bbe\u5907\u6811\u914d\u7f6e",children:"3.\u8bbe\u5907\u6811\u914d\u7f6e"}),"\n",(0,s.jsx)(e.p,{children:"\u8bbe\u5907\u6811\u914d\u7f6e\u8def\u5f84\uff1a"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"device/config/chips/v853/configs/100ask/board.dts\n"})}),"\n",(0,s.jsx)(e.p,{children:"camera\u76f8\u5173\u914d\u7f6e\uff1a"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:'                vind0:vind@0 {\n                        vind0_clk = <300000000>;\n                        status = "okay";\n\n                        csi2:csi@2 {\n                                pinctrl-names = "default","sleep";\n                                pinctrl-0 = <&ncsi_pins_a>;\n                                pinctrl-1 = <&ncsi_pins_b>;\n                                status = "okay";\n                        };\n                        /*Online mode tp9953 uses online mode*/\n                        tdm0:tdm@0 {\n                                work_mode = <0>;\n                        };\n\n                        isp00:isp@0 {\n                                work_mode = <0>;\n                        };\n\n                        scaler00:scaler@0 {\n                                work_mode = <0>;\n                        };\n\n                        scaler10:scaler@4 {\n                                work_mode = <0>;\n                        };\n\n                        scaler20:scaler@8 {\n                                work_mode = <0>;\n                        };\n\n                        scaler30:scaler@12 {\n                                work_mode = <0>;\n                        };\n\n                        actuator0:actuator@0 {\n                                device_type = "actuator0";\n                                actuator0_name = "ad5820_act";\n                                actuator0_slave = <0x18>;\n                                actuator0_af_pwdn = <>;\n                                actuator0_afvdd = "afvcc-csi";\n                                actuator0_afvdd_vol = <2800000>;\n                                status = "disabled";\n                        };\n                        flash0:flash@0 {\n                                device_type = "flash0";\n                                flash0_type = <2>;\n                                flash0_en = <>;\n                                flash0_mode = <>;\n                                flash0_flvdd = "";\n                                flash0_flvdd_vol = <>;\n                                status = "disabled";\n                        };\n\n                        sensor0:sensor@0 {\n                                device_type = "sensor0";\n                                sensor0_mname = "gc2053_mipi";\n                                sensor0_twi_cci_id = <1>;\n                                sensor0_twi_addr = <0x6e>;\n                                sensor0_mclk_id = <0>;\n                                sensor0_pos = "rear";\n                                sensor0_isp_used = <1>;\n                                sensor0_fmt = <1>;\n                                sensor0_stby_mode = <0>;\n                                sensor0_vflip = <0>;\n                                sensor0_hflip = <0>;\n                                sensor0_iovdd-supply = <&reg_aldo2>;\n                                sensor0_iovdd_vol = <1800000>;\n                                sensor0_avdd-supply = <&reg_bldo2>;\n                                sensor0_avdd_vol = <2800000>;\n                                sensor0_dvdd-supply = <&reg_dldo2>;\n                                sensor0_dvdd_vol = <1200000>;\n                                sensor0_power_en = <>;\n                                sensor0_reset = <&pio PA 18 1 0 1 0>;\n                                sensor0_pwdn = <&pio PA 19 1 0 1 0>;\n                                sensor0_sm_hs = <>;\n                                sensor0_sm_vs = <>;\n                                flash_handle = <&flash0>;\n                                act_handle = <&actuator0>;\n                                status  = "okay";\n                        };\n                        sensor1:sensor@1 {\n                                device_type = "sensor1";\n                                sensor1_mname = "tp9953";\n                                sensor1_twi_cci_id = <0>;\n                                sensor1_twi_addr = <0x88>;\n                                sensor1_mclk_id = <2>;\n                                sensor1_pos = "front";\n                                sensor1_isp_used = <0>;\n                                sensor1_fmt = <0>;\n                                sensor1_stby_mode = <0>;\n                                sensor1_vflip = <0>;\n                                sensor1_hflip = <0>;\n                                sensor1_iovdd-supply = <&reg_aldo2>;\n                                sensor1_iovdd_vol = <1800000>;\n                                sensor1_avdd-supply = <>; /*<&reg_dcdc1>;*/\n                                sensor1_avdd_vol = <3300000>;\n                                sensor1_dvdd-supply = <>;//<&reg_dldo2>;\n                                sensor1_dvdd_vol = <1200000>;\n                                sensor1_power_en = <&pio PI 0 1 0 1 0>;\n                                sensor1_reset = <&pio PH 13 1 0 1 0>;\n                                sensor1_pwdn  = <>;\n                                /*sensor1_pwdn = <&pio PE 13 1 0 1 0>;*/\n                                sensor1_sm_hs = <>;\n                                sensor1_sm_vs = <>;\n                                flash_handle = <>;\n                                act_handle = <>;\n                                status  = "okay";\n                        };\n'})}),"\n",(0,s.jsx)(e.h2,{id:"4\u5185\u6838\u914d\u7f6e",children:"4.\u5185\u6838\u914d\u7f6e"}),"\n",(0,s.jsxs)(e.p,{children:["\u5728Tina\u6839\u76ee\u5f55\u4e0b\u6267\u884c",(0,s.jsx)(e.code,{children:"make kernel_menuconfig"})]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"book@100ask:~/workspaces/tina-v853-open$ make kernel_menuconfig\n"})}),"\n",(0,s.jsx)(e.p,{children:"\u6ce8\u610f:\u5728\u8fdb\u884c\u5185\u6838\u914d\u7f6e\u524d\u9700\u8981\u914d\u7f6e\u73af\u5883\u53d8\u91cf\u624d\u53ef\u4ee5\u8fdb\u5165\u5185\u6838\u8c03\u8bd5\uff0c\u5373\u5728\u914d\u7f6e\u524d\u8f93\u5165"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"book@100ask:~/workspaces/tina-v853-open$ source build/envsetup.sh\n...\nbook@100ask:~/workspaces/tina-v853-open$ lunch\n... \u8f93\u51651\uff0c\u9009\u62e9\u65b9\u68481\n"})}),"\n",(0,s.jsx)(e.p,{children:"\u5728\u5185\u6838\u914d\u7f6e\u754c\u9762\u4e2d\uff0c\u8fdb\u5165\u5982\u4e0b\u76ee\u5f55\uff0c\u8f93\u5165M\u9009\u4e2d\u4e0b\u9762\u4e24\u9879\u3002"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"\u2192 Device Drivers \n\t\u2192 Multimedia support \n\t\t\u2192 V4L platform devices\n\t\t\t<M>   sunxi video input (camera csi/mipi isp vipp)driver\n\t\t\t<M>     v4l2 new driver for SUNXI\n"})}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.img,{alt:"image-20230419174735087",src:i(96950).Z+"",width:"1100",height:"832"})}),"\n",(0,s.jsx)(e.p,{children:"\u53ef\u4ee5\u770b\u5230\u5168\u5fd7\u5df2\u7ecf\u652f\u6301\u4e86\u5f88\u591a\u6444\u50cf\u5934\uff0c\u627e\u5230\u6211\u4eec\u9700\u8981\u9002\u914d\u7684\u6444\u50cf\u5934\uff0c\u8f93\u5165M\u5c06gc2053\u9a71\u52a8\u7f16\u4e3a\u6a21\u5757\u3002"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"\u2192 Device Drivers \n\t\u2192 Multimedia support \n\t\t\u2192 V4L platform devices \n\t\t\t\u2192 sensor driver select\n\t\t\t\t<M> use gc2053_mipi driver\n"})}),"\n",(0,s.jsx)(e.p,{children:"\u6ce8\u610f\uff1a\u5982\u679c\u51fa\u73b0\u6ca1\u6709\u7684\u8def\u5f84\uff0c\u9700\u8981\u9009\u62e9\u4e0a\u4e00\u7ea7\u76ee\u5f55\u624d\u4f1a\u6253\u5f00\u3002"}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.img,{alt:"image-20230419170040385",src:i(18926).Z+"",width:"1104",height:"797"})}),"\n",(0,s.jsx)(e.h2,{id:"5tina\u914d\u7f6e",children:"5.Tina\u914d\u7f6e"}),"\n",(0,s.jsxs)(e.p,{children:["\u5728Tina\u6839\u76ee\u5f55\u4e0b\u8f93\u5165",(0,s.jsx)(e.code,{children:"make menuconfig"}),"\uff0c\u8fdb\u5165\u5982\u4e0b\u76ee\u5f55"]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:" > Kernel modules \n \t> Video Support\n \t\t<*> kmod-vin-v4l2.............................. Video input support (staging)\n"})}),"\n",(0,s.jsx)(e.p,{children:"\u5982\u4e0b\u56fe\u6240\u793a"}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.img,{alt:"image-20230419170855104",src:i(43728).Z+"",width:"1103",height:"847"})}),"\n",(0,s.jsx)(e.h2,{id:"6modulesmk\u914d\u7f6e",children:"6.modules.mk\u914d\u7f6e"}),"\n",(0,s.jsx)(e.p,{children:"modules.mk\u4e3b\u8981\u5b8c\u6210\u4e24\u4e2a\u65b9\u9762\uff1a"}),"\n",(0,s.jsxs)(e.ol,{children:["\n",(0,s.jsx)(e.li,{children:"\u62f7\u8d1d\u76f8\u5173\u7684ko\u6a21\u5757\u5230\u5c0f\u673arootfs\u4e2d"}),"\n",(0,s.jsx)(e.li,{children:"rootfs\u542f\u52a8\u65f6\uff0c\u6309\u987a\u5e8f\u81ea\u52a8\u52a0\u8f7d\u76f8\u5173\u7684ko\u6a21\u5757\u3002"}),"\n"]}),"\n",(0,s.jsx)(e.p,{children:"modules.mk\u6587\u4ef6\u8def\u5f84\uff1a"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-shell",children:"tina-v853-open/openwrt/target/v853/v853-100ask/modules.mk\n"})}),"\n",(0,s.jsx)(e.p,{children:"\u9a71\u52a8\u52a0\u8f7d\u987a\u5e8f\u914d\u7f6e"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-makefile",children:" define KernelPackage/vin-v4l2\n   SUBMENU:=$(VIDEO_MENU)\n   TITLE:=Video input support (staging)\n   DEPENDS:=\n   FILES:=$(LINUX_DIR)/drivers/media/v4l2-core/videobuf2-core.ko\n   FILES+=$(LINUX_DIR)/drivers/media/v4l2-core/videobuf2-dma-contig.ko\n   FILES+=$(LINUX_DIR)/drivers/media/v4l2-core/videobuf2-memops.ko\n   FILES+=$(LINUX_DIR)/drivers/media/v4l2-core/videobuf2-v4l2.ko\n   FILES+=$(LINUX_DIR)/drivers/media/platform/sunxi-vin/vin_io.ko\n   FILES+=$(LINUX_DIR)/drivers/media/platform/sunxi-vin/modules/sensor/gc2053_mipi.ko\n #  FILES+=$(LINUX_DIR)/drivers/media/platform/sunxi-vin/modules/sensor_power/sensor_power.ko\n   FILES+=$(LINUX_DIR)/drivers/media/platform/sunxi-vin/vin_v4l2.ko\n   FILES+=$(LINUX_DIR)/drivers/input/sensor/da380/da380.ko\n   AUTOLOAD:=$(call AutoProbe,videobuf2-core videobuf2-dma-contig videobuf2-memops videobuf2-v4l2 vin_io gc2053_mipi vin_v4l2 da380.ko)\n endef\n\n define KernelPackage/vin-v4l2/description\n  Kernel modules for video input support\n endef\n\n $(eval $(call KernelPackage,vin-v4l2))\n"})}),"\n",(0,s.jsx)(e.h2,{id:"7s00mpp\u914d\u7f6e",children:"7.S00mpp\u914d\u7f6e"}),"\n",(0,s.jsx)(e.p,{children:"V853\u5e73\u53f0\u5728\u5b8c\u6210modules.mk\u914d\u7f6e\u540e\uff0c\u8fd8\u9700\u8981\u5b8c\u6210.ko\u6302\u8f7d\u811a\u672cS00mpp\u7684\u914d\u7f6e\uff0c\u4ee5\u4fbf\u5f00\u673a\u5feb\u901f\u542f\u52a8\u6444\u50cf\u5934\u6a21\u5757\u3002"}),"\n",(0,s.jsx)(e.p,{children:"S00mpp\u914d\u7f6e\u8def\u5f84\uff1a"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"tina-v853-open/openwrt/target/v853/v853-100ask/busybox-init-base-files/etc/init.d/S00mpp\n"})}),"\n",(0,s.jsx)(e.p,{children:"\u811a\u672c\u5bf9\u6444\u50cf\u5934\u9a71\u52a8\u8fdb\u884c\u4e86\u63d0\u524d\u52a0\u8f7d\uff0c\u5e94\u7528\u9700\u8981\u4f7f\u7528\u7684\u65f6\u5019\u5373\u53ef\u5feb\u901f\u914d\u7f6e\u5e76\u542f\u52a8\u3002"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:'#!/bin/sh\n#\n# Load mpp modules....\n#\n\nMODULES_DIR="/lib/modules/`uname -r`"\n\nstart() {\n    printf "Load mpp modules\\n"\n    insmod $MODULES_DIR/videobuf2-core.ko\n    insmod $MODULES_DIR/videobuf2-memops.ko\n    insmod $MODULES_DIR/videobuf2-dma-contig.ko\n    insmod $MODULES_DIR/videobuf2-v4l2.ko\n    insmod $MODULES_DIR/vin_io.ko\n#   insmod $MODULES_DIR/sensor_power.ko\n    insmod $MODULES_DIR/gc4663_mipi.ko\n    insmod $MODULES_DIR/vin_v4l2.ko\n    insmod $MODULES_DIR/sunxi_aio.ko\n    insmod $MODULES_DIR/sunxi_eise.ko\n#   insmod $MODULES_DIR/vipcore.ko\n}\n\nstop() {\n    printf "Unload mpp modules\\n"\n#   rmmod $MODULES_DIR/vipcore.ko\n    rmmod $MODULES_DIR/sunxi_eise.ko\n    rmmod $MODULES_DIR/sunxi_aio.ko\n    rmmod $MODULES_DIR/vin_v4l2.ko\n    rmmod $MODULES_DIR/gc4663_mipi.ko\n#   rmmod $MODULES_DIR/sensor_power.ko\n    rmmod $MODULES_DIR/vin_io.ko\n    rmmod $MODULES_DIR/videobuf2-v4l2.ko\n    rmmod $MODULES_DIR/videobuf2-dma-contig.ko\n    rmmod $MODULES_DIR/videobuf2-memops.ko\n    rmmod $MODULES_DIR/videobuf2-core.ko\n}\n\ncase "$1" in\n    start)\n    start\n    ;;\n    stop)\n    stop\n    ;;\n    restart|reload)\n    stop\n    start\n    ;;\n  *)\n    echo "Usage: $0 {start|stop|restart}"\n    exit 1\nesac\n\nexit $?\n'})}),"\n",(0,s.jsx)(e.h2,{id:"8\u589e\u52a0\u6444\u50cf\u5934\u6d4b\u8bd5\u7a0b\u5e8f",children:"8.\u589e\u52a0\u6444\u50cf\u5934\u6d4b\u8bd5\u7a0b\u5e8f"}),"\n",(0,s.jsxs)(e.p,{children:["\u5728Tina\u6839\u76ee\u5f55\u4e0b\u6267\u884c",(0,s.jsx)(e.code,{children:"make menuconfig"}),"\uff0c\u8fdb\u5165Tina\u914d\u7f6e\u754c\u9762\u540e\uff0c\u8fdb\u5165\u5982\u4e0b\u76ee\u5f55\uff0c\u8f93\u5165Y\u9009\u4e2dcamerademo\u6d4b\u8bd5\u7a0b\u5e8f\u3002"]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"> Allwinner \n\t> Vision\n\t\t<*> camerademo........................................ camerademo test sensor  ---\x3e \n"})}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.img,{alt:"image-20230419174305027",src:i(66541).Z+"",width:"1090",height:"824"})}),"\n",(0,s.jsx)(e.h2,{id:"8\u7f16\u8bd1\u70e7\u5199\u955c\u50cf",children:"8.\u7f16\u8bd1\u70e7\u5199\u955c\u50cf"}),"\n",(0,s.jsxs)(e.p,{children:["\u5728Tina\u7684\u6839\u76ee\u5f55\u4e0b\uff0c\u8f93\u5165",(0,s.jsx)(e.code,{children:"make -j32 "})]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"book@100ask:~/workspaces/tina-v853-open$ make -j32\n...\nbook@100ask:~/workspaces/tina-v853-open$ pack\n...\n"})}),"\n",(0,s.jsx)(e.p,{children:"\u200b\t\u751f\u6210\u955c\u50cf\u540e\uff0c\u5c06tina-v853-open/out/v853/100ask/openwrt/\u76ee\u5f55\u4e0b\u7684v853_linux_100ask_uart0.img\u955c\u50cf\u62f7\u8d1d\u5230Windows\u7535\u8111\u4e3b\u673a\u4e2d\uff0c\u4f7f\u7528\u5168\u5fd7PhoenixSuit\u70e7\u5199\u5de5\u5177\u70e7\u5199\u5230\u5f00\u53d1\u677f\u4e0a\u3002"}),"\n",(0,s.jsxs)(e.p,{children:["\u200b\t\u4e0a\u7535\u524d\u9700\u8981\u8fde\u63a5\u63d2\u4e0a12V\u7684\u7535\u6e90\u7ebf\uff0c\u548c\u4e24\u6761Type-C\uff0c\u628a\u5f00\u5173\u62e8\u5411\u7535\u6e90\u63a5\u53e3\u65b9\u5411\u4e0a\u7535\uff0c\u70e7\u5199\u65b0\u955c\u50cf\u540e\u7b49\u5f85\u542f\u52a8\u7cfb\u7edf\uff0c\u5728\u547d\u4ee4\u884c\u4e2d\u8f93\u5165",(0,s.jsx)(e.code,{children:"lsmod"})]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"root@TinaLinux:/# lsmod \nModule                  Size  Used by\nvin_v4l2              181099  0 \ngc2053_mipi             8567  0 \nvin_io                 21106  3 vin_v4l2,gc2053_mipi\nvideobuf2_v4l2          9304  1 vin_v4l2\nvideobuf2_dma_contig     8632  1 vin_v4l2\nvideobuf2_memops         948  1 videobuf2_dma_contig\nvideobuf2_core         22168  2 vin_v4l2,videobuf2_v4l2\nxradio_wlan              598  0 \nxradio_core           431911  1 xradio_wlan\nxradio_mac            222724  1 xradio_core\n"})}),"\n",(0,s.jsx)(e.p,{children:"\u53ef\u4ee5\u770b\u5230\u6211\u4eec\u4e4b\u524d\u9009\u4e2d\u7684VIN\u9a71\u52a8\u548cGC2053\u9a71\u52a8\u5df2\u7ecf\u88c5\u8f7d\u8fdb\u53bb\u4e86"}),"\n",(0,s.jsx)(e.h2,{id:"9\u8fd0\u884ccamera\u6d4b\u8bd5\u7a0b\u5e8f",children:"9.\u8fd0\u884ccamera\u6d4b\u8bd5\u7a0b\u5e8f"}),"\n",(0,s.jsxs)(e.p,{children:["\u5728\u5f00\u53d1\u677f\u7684\u4e32\u53e3\u7ec8\u7aef\u754c\u9762\u8f93\u5165",(0,s.jsx)(e.code,{children:"camedemo -h"}),"\u53ef\u4ee5\u8f93\u51facamera\u6d4b\u8bd5\u7a0b\u5e8f\u7684\u4f7f\u7528\u6559\u7a0b"]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"root@TinaLinux:/# camerademo -h\n[CAMERA]**********************************************************\n[CAMERA]*                                                        *\n[CAMERA]*              this is camera test.                      *\n[CAMERA]*                                                        *\n[CAMERA]**********************************************************\n[CAMERA]******************** camerademo help *********************\n[CAMERA] This program is a test camera.\n[CAMERA] It will query the sensor to support the resolution, output format and test frame rate.\n[CAMERA] At the same time you can modify the data to save the path and get the number of photos.\n[CAMERA] When the last parameter is debug, the output will be more detailed information\n[CAMERA] There are eight ways to run:\n[CAMERA]    1.camerademo --- use the default parameters.\n[CAMERA]    2.camerademo debug --- use the default parameters and output debug information.\n[CAMERA]    3.camerademo setting --- can choose the resolution and data format.\n[CAMERA]    4.camerademo setting debug --- setting and output debug information.\n[CAMERA]    5.camerademo NV21 640 480 30 bmp /tmp 5 --- param input mode,can save bmp or yuv.\n[CAMERA]    6.camerademo NV21 640 480 30 bmp /tmp 5 debug --- output debug information.\n[CAMERA]    7.camerademo NV21 640 480 30 bmp /tmp 5 Num --- /dev/videoNum param input mode,can save bmp or yuv.\n[CAMERA]    8.camerademo NV21 640 480 30 bmp /tmp 5 Num debug --- /dev/videoNum output debug information.\n[CAMERA]    8.camerademo NV21 640 480 30 bmp /tmp 5 Num 1 --- 1/2: chose memory: V4L2_MEMORY_MMAP/USERPTR\n[CAMERA]**********************************************************\n"})}),"\n",(0,s.jsxs)(e.p,{children:["\u5728\u5f00\u53d1\u677f\u7684\u4e32\u53e3\u7ec8\u7aef\u754c\u9762\u8f93\u5165",(0,s.jsx)(e.code,{children:"camerademo NV21 640 480 30 bmp /tmp 5"}),"\uff0c\u5c06\u4f1a\u62cd\u64445\u5f20\u7167\u7247\u653e\u5728/tmp\u76ee\u5f55\u4e0b\uff0c\u5c06/tmp\u76ee\u5f55\u4e0b\u7684\u6587\u4ef6\u62f7\u8d1d\u5230\u7535\u8111\u7aef\u5373\u53ef\u67e5\u770b\u76f8\u5e94\u7684\u56fe\u7247\u3002"]}),"\n",(0,s.jsxs)(e.p,{children:["\u5177\u4f53\u6559\u7a0b\u53ef\u4ee5\u53c2\u8003\uff1a",(0,s.jsx)(e.a,{href:"https://tina.100ask.net/SdkModule/Linux_Camera_DevelopmentGuide-06/",children:"https://tina.100ask.net/SdkModule/Linux_Camera_DevelopmentGuide-06/"})]})]})}function p(n={}){const{wrapper:e}={...(0,o.a)(),...n.components};return e?(0,s.jsx)(e,{...n,children:(0,s.jsx)(l,{...n})}):l(n)}},51403:(n,e,i)=>{i.d(e,{Z:()=>s});const s=i.p+"assets/images/image-20230419160150480-5eb95374f621a6f6a6ce26578f27b758.png"},18926:(n,e,i)=>{i.d(e,{Z:()=>s});const s=i.p+"assets/images/image-20230419170040385-1fb1c1c7d4b01395491d5da1437903d6.png"},43728:(n,e,i)=>{i.d(e,{Z:()=>s});const s=i.p+"assets/images/image-20230419170855104-8d689d1af06fa5ea84ec431ad96f5380.png"},66541:(n,e,i)=>{i.d(e,{Z:()=>s});const s=i.p+"assets/images/image-20230419174305027-bce64417e875bd98c23926811bb3517e.png"},96950:(n,e,i)=>{i.d(e,{Z:()=>s});const s=i.p+"assets/images/image-20230419174735087-d933e5abf689d30cd3d2d00217804298.png"},11151:(n,e,i)=>{i.d(e,{Z:()=>a,a:()=>d});var s=i(67294);const o={},r=s.createContext(o);function d(n){const e=s.useContext(r);return s.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function a(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(o):n.components||o:d(n.components),s.createElement(r.Provider,{value:e},n.children)}}}]);