"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[3627],{28221:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>g,contentTitle:()=>o,default:()=>d,frontMatter:()=>r,metadata:()=>c,toc:()=>a});var t=n(85893),s=n(11151);const r={sidebar_position:3},o="Linux 5.15 \u5185\u6838\u9a71\u52a8\u79fb\u690d",c={id:"V851se-TinyVision/part9/Linux5.15KernelDriverPorting",title:"Linux 5.15 \u5185\u6838\u9a71\u52a8\u79fb\u690d",description:"Linux 5.15 \u5185\u6838\u9a71\u52a8",source:"@site/docs/V851se-TinyVision/part9/3-Linux5.15KernelDriverPorting.md",sourceDirName:"V851se-TinyVision/part9",slug:"/V851se-TinyVision/part9/Linux5.15KernelDriverPorting",permalink:"/docs/V851se-TinyVision/part9/Linux5.15KernelDriverPorting",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/AllwinnerVisionIC-Docs/tree/main/docs/V851se-TinyVision/part9/3-Linux5.15KernelDriverPorting.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"v851seSidebar",previous:{title:"Linux 4.9 \u5185\u6838\u9a71\u52a8\u79fb\u690d",permalink:"/docs/V851se-TinyVision/part9/Linux4.9KernelDriverPorting"},next:{title:"USB_OTG\u5207\u6362\u6a21\u5f0f",permalink:"/docs/category/usb_otg\u5207\u6362\u6a21\u5f0f"}},g={},a=[{value:"Linux 5.15 \u5185\u6838\u9a71\u52a8",id:"linux-515-\u5185\u6838\u9a71\u52a8",level:3},{value:"Linux 5.15 \u5185\u6838\u8bbe\u5907\u6811",id:"linux-515-\u5185\u6838\u8bbe\u5907\u6811",level:3},{value:"\u6d4b\u8bd5",id:"\u6d4b\u8bd5",level:3}];function l(e){const i={code:"code",h1:"h1",h3:"h3",img:"img",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.h1,{id:"linux-515-\u5185\u6838\u9a71\u52a8\u79fb\u690d",children:"Linux 5.15 \u5185\u6838\u9a71\u52a8\u79fb\u690d"}),"\n",(0,t.jsx)(i.h3,{id:"linux-515-\u5185\u6838\u9a71\u52a8",children:"Linux 5.15 \u5185\u6838\u9a71\u52a8"}),"\n",(0,t.jsxs)(i.p,{children:["\u4e0b\u8f7d\u9a71\u52a8\u540e\u83b7\u5f97\u9a71\u52a8\u7684 ",(0,t.jsx)(i.code,{children:"tar.gz"})," \u538b\u7f29\u5305"]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.img,{alt:"image-20240115145222134",src:n(15362).Z+"",width:"173",height:"33"})}),"\n",(0,t.jsx)(i.p,{children:"\u89e3\u538b\u540e\u627e\u5230\u5982\u4e0b\u9a71\u52a8\u4e0e\u6587\u4ef6\u5939"}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.img,{alt:"image-20240115145406939",src:n(24399).Z+"",width:"245",height:"166"})}),"\n",(0,t.jsxs)(i.p,{children:["\u7531\u4e8e Linux 5.15 \u9700\u8981\u4fdd\u8bc1\u5185\u6838\u7684\u4e3b\u7ebf\u5316\uff0c\u4e0d\u53ef\u5c06\u975e\u4e3b\u7ebf\u7684\u7b2c\u4e09\u65b9\u9a71\u52a8\u653e\u7f6e\u4e8e\u5185\u6838\u6587\u4ef6\u5939\u4e2d\uff0c\u6240\u4ee5\u5c06\u9a71\u52a8\u653e\u7f6e\u4e8e ",(0,t.jsx)(i.code,{children:"bsp"})," \u6587\u4ef6\u5939\u4e2d\u3002"]}),"\n",(0,t.jsxs)(i.p,{children:["\u8fdb\u5165",(0,t.jsx)(i.code,{children:"bsp"}),"\uff0c\u627e\u5230 ",(0,t.jsx)(i.code,{children:"bsp/drivers/net/wireless"})," \u6587\u4ef6\u5939\u4e2d\uff0c\u65b0\u5efa\u6587\u4ef6\u5939",(0,t.jsx)(i.code,{children:"aic8800"})," \u5e76\u4e14\u628a\u4e0a\u9762\u7684\u9a71\u52a8\u4e0e\u6587\u4ef6\u5939\u653e\u5165\u521a\u521a\u521b\u5efa\u597d\u7684 ",(0,t.jsx)(i.code,{children:"aic8800"})," \u4e2d\u3002"]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.img,{alt:"image-20240115161401833",src:n(7375).Z+"",width:"384",height:"334"})}),"\n",(0,t.jsxs)(i.p,{children:["\u4fee\u6539 ",(0,t.jsx)(i.code,{children:"bsp/drivers/net/wireless/Kconfig"})," \uff0c\u589e\u52a0\u4e00\u884c"]}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-c",children:'source "bsp/drivers/net/wireless/aic8800/Kconfig"\n'})}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.img,{alt:"image-20240115163522102",src:n(56904).Z+"",width:"472",height:"96"})}),"\n",(0,t.jsxs)(i.p,{children:["\u4fee\u6539 ",(0,t.jsx)(i.code,{children:"bsp/drivers/net/wireless/Makefile"})," \uff0c\u589e\u52a0\u4e00\u884c"]}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-c",children:"obj-$(CONFIG_AIC_WLAN_SUPPORT) += aic8800/\n"})}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.img,{alt:"image-20240115145650592",src:n(95327).Z+"",width:"482",height:"117"})}),"\n",(0,t.jsxs)(i.p,{children:["\u4fee\u6539 ",(0,t.jsx)(i.code,{children:"bsp/drivers/net/wireless/aic8800/Kconfig"}),"\uff0c\u4fee\u6539\u4e3a ",(0,t.jsx)(i.code,{children:"bsp"})," \u7684\u7d22\u5f15"]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.img,{alt:"image-20240115163428151",src:n(61722).Z+"",width:"621",height:"243"})}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{children:'if AIC_WLAN_SUPPORT\nsource "bsp/drivers/net/wireless/aic8800/aic8800_fdrv/Kconfig"\nsource "bsp/drivers/net/wireless/aic8800/aic8800_btlpm/Kconfig"\nendif\n\nif AIC_INTF_USB\nsource "bsp/drivers/net/wireless/aic8800/aic8800_btusb/Kconfig"\nendif\n'})}),"\n",(0,t.jsx)(i.p,{children:"\u8fdb\u5165\u5185\u6838\u914d\u7f6e\u9875\uff0c\u627e\u5230\u5e76\u52fe\u9009\u5982\u4e0b\u9009\u9879\u3002"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{children:"[*] Networking support  ---\x3e\n\t<*>   Bluetooth subsystem support  ---\x3e\n\t\t[*]   Bluetooth Classic (BR/EDR) features (NEW)\n\t\t<*>     RFCOMM protocol support\n\t\t[*]       RFCOMM TTY support\n\t\t[*]   Bluetooth Low Energy (LE) features\n\t\t[*]   Export Bluetooth internals in debugfs\n\t\t\t  Bluetooth device drivers  ---\x3e\n\t\t\t\t  <*> HCI UART driver\n\t\t\t\t  [*]   UART (H4) protocol support\n\t-*-   Wireless  ---\x3e\n\t\t<*>   cfg80211 - wireless configuration API\n\t\t[ ]     nl80211 testmode command\n\t\t[ ]     enable developer warnings\n\t\t[ ]     cfg80211 certification onus\n\t\t[*]     enable powersave by default\n\t\t[ ]     cfg80211 DebugFS entries\n\t\t[*]     support CRDA\n\t\t[*]     cfg80211 wireless extensions compatibility \n\t\t<*>   Generic IEEE 802.11 Networking Stack (mac80211)\n\t<*>   RF switch subsystem support  ---\x3e\n\t\t[*]   RF switch input support\n\t\t<*>   GPIO RFKILL driver\n\nDevice Drivers  ---\x3e\n\tNetwork device support  ---\x3e\n\t\t[*]   Wireless LAN  ---\x3e\n\t\t\t[*]   AIC wireless Support\n\t\t\t\t  Enable Chip Interface (SDIO interface support)  ---\x3e\n\t\t\t<M>   AIC8800 wlan Support\n\t\t\t<M>   AIC8800 bluetooth Support (UART)\n\tMisc Devices Drivers  ---\x3e\n\t\t<*> Allwinner rfkill driver\n\t\t<*> Allwinner Network MAC Addess Manager\n"})}),"\n",(0,t.jsx)(i.h3,{id:"linux-515-\u5185\u6838\u8bbe\u5907\u6811",children:"Linux 5.15 \u5185\u6838\u8bbe\u5907\u6811"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{children:'&rfkill {\n\tcompatible = "allwinner,sunxi-rfkill";\n\tchip_en;\n\tpower_en;\n\tpinctrl-0;\n\tpinctrl-names;\n\tstatus = "okay";\n\n\t/* wlan session */\n\twlan {\n\t\tcompatible    = "allwinner,sunxi-wlan";\n\t\twlan_busnum   = <0x1>;\n\t\twlan_regon    = <&pio PE 6 GPIO_ACTIVE_HIGH>;\n\t\twlan_hostwake = <&pio PE 7 GPIO_ACTIVE_HIGH>;\n\t\twakeup-source;\n\t};\n\n\t/* bt session */\n\tbt {\n\t\tcompatible    = "allwinner,sunxi-bt";\n\t\tbt_rst_n      = <&pio PE 8 GPIO_ACTIVE_LOW>;\n\t};\n};\n\n&addr_mgt {\n\tcompatible     = "allwinner,sunxi-addr_mgt";\n\ttype_addr_wifi = <0x0>;\n\ttype_addr_bt   = <0x0>;\n\ttype_addr_eth  = <0x0>;\n\tstatus         = "okay";\n};\n\n&btlpm {\n\tcompatible  = "allwinner,sunxi-btlpm";\n\tuart_index  = <0x2>;\n\tbt_wake     = <&pio PE 9 GPIO_ACTIVE_HIGH>;\n\tbt_hostwake = <&pio PE 10 GPIO_ACTIVE_HIGH>; /* unused */\n\twakeup-source;\n\tstatus      = "okay";\n};\n'})}),"\n",(0,t.jsx)(i.p,{children:"\u7f16\u8bd1\u65f6\u53ef\u4ee5\u770b\u5230\u751f\u6210\u7684\u5bf9\u5e94\u7684 ko \u6a21\u5757"}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.img,{alt:"image-20240115164630796",src:n(81353).Z+"",width:"614",height:"81"})}),"\n",(0,t.jsx)(i.h3,{id:"\u6d4b\u8bd5",children:"\u6d4b\u8bd5"}),"\n",(0,t.jsxs)(i.p,{children:["\u7531\u4e8e Linux 5.15 \u4e0d\u7ed1\u5b9a Tina\uff0c\u6240\u4ee5\u8fd9\u91cc\u76f4\u63a5\u4f7f\u7528\u73b0\u6210\u7684 ",(0,t.jsx)(i.code,{children:"debian rootfs"})," \u6765\u505a\u6d4b\u8bd5\u3002"]}),"\n",(0,t.jsxs)(i.p,{children:["\u4f7f\u7528\u4e0a\u9762\u7f16\u8bd1\u51fa\u6765\u7684\u5185\u6838\u4e0eko\u9a71\u52a8\uff0c\u5e76\u4e14\u5c06\u56fa\u4ef6\u653e\u7f6e\u4e8e rootfs \u5bf9\u5e94\u7684 ",(0,t.jsx)(i.code,{children:"/lib/firmware/"})," \u6587\u4ef6\u5939\u4e2d"]})]})}function d(e={}){const{wrapper:i}={...(0,s.a)(),...e.components};return i?(0,t.jsx)(i,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},15362:(e,i,n)=>{n.d(i,{Z:()=>t});const t="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAAAhCAYAAACr3SvgAAAFXUlEQVR4nO2cT2gTWRzHP7O4ePHcDbIVV6YHRXrpHIIRCsEKccvSzWGhgVyykB720GLppYiLRQJLiTTgHhywIIUEeoga1IALAcFKD8klSIXtrASzSNaLFy+yh9lDZpJJMv/SaJu47wNDMvm9/PJ7r9/5vd97k1TSdV3HgQ8fPvD27VvevXvHx48fnZoBcPz4ccbGxjh58iQnTpxwbSsQDILkJlqBYBj56qgDEAj6RYhWMHIcM5+o1aMMQyDwzzHrydQ3RxWGQOCfY95N2igB/23LjX5DEQj84SnaykPJcqbjZ69BkrzbCAQHxVW0lYcSly79xZkz7wFYWGi+bhWlrveeCwSfE8fdg8pDiampJO/f/0alolKpqB12qzh1fUCx1jIkAiFytQF8HBWlBZTZDHUn+yj3bUhx3fKamkp2HG5I0iFk2VqGREBCMY5UyaeNIqmWrVtAbjbBMOJjn7ZiOdpYS4KBBXt6kc3GDvOn3RoVSQWXkLM65YZOOZskH1tgx9OmkZu9gra2b9jOkw76sX0ifPVtEDRys90X6ZfNgW4u2JUDknQYC7Ak02HjaXiOKC95U/Ow1R7zRznJz0nZsK2wrKg8K3nYBEPLgUTbLVBTxJ7Z1mkKr2VIBKwZzjplSyRUDYgQX3vJXVVrNik9IB+/ZmQwF9vrParxOUIt3zKnzoKmae42RzpjU2LWWt/Mekab2Qz1Vt+atoTa9l1XQ5Z62K7PDj47YpkgXYZ8zGJzLJXcfNn1L0RObdfsdTXU7rd5rBRdxurzMFCm7a8k0Mj9DjcadlO4lSKpgGXKbuhsmpkQqF6faIllcmKi4512trr20jEiN5s9zdgwy5CGTibe2yofe8B0Q6f8aJHx1qsy81eTVAuPDaFoPC+8IHp1kXGKpAI3+W7X9LvPTGGiY8q39xlhtbHPsgLRrGnzHmd7X3b9uweF9kU5ntxp9bucTYKywf31SJ9jODh9i9bMsm6HPTLz64tgXq0x1b5Z6QF5ZYMbFqECUMvw63VYbv1hnyBfN/6wLrZx+bxjX9xstgs0I7Z4uN0qFOldoEazdyzZ20J4jmh5m+eWsmU6bPjlBemg+XnN7GnN+I4+e/AeZ0dfPf1rXmg91DIkYpDpEf3h0NcdMb2swhTNNVn3I1ChQjC4ye7f//a+uZYhEVyCtX3KDdk43/P92fWn21Tj19hsLWgiTMfhrqZR15xtyMCrP6kTMQZY480rkCPGReFok1lt6Kxag3jtO1wHIkzHr3D3qcZFtmHtXls8ygb3bUXgVqrYMOA4e1MkFdxmZnfH50X06fHOtBXLo4tgPXm9R9WSQetPt7H9jk54jmh5ia3W1Fgkp2qMX/6Jya2bli2pIs+2QJZlVxvhFZax+Cutk8bIJm42X7Fp5G45zBgOhH7ZgMI6WwWYuWwuALv9ws6Kyy6G296v33G28+XZv+ZuC9nPuRvijfsdMfOGglW4do9+CK+wfGuCHwNLAEzGk0zaNoywurtBIiihAJAk07gDLLKZ3UMJSqSNltGszmoYD5vM/O1uf2ZGc7M5xJZNosQk8gBcYHktCYU+xuH098ywRPrsE8qWmaGzz0b8vhzKXPzhAumYRF7Z4P4jv+NsR3ccnf3bWWmWLbT6D8SfUD7kurb1ywW12vstr+C3Xx/IqW15IBhNSgsot845lC5Hg2umFeL7v6GRm13n1CNzoVYkFVOZXNsfGsFCnwsxwZeOzPztcyQCEovGK5Nr+x1bjsOAa3kgEAwj4jdigpFDiFYwcnTUtJV/jioMgcA/4p91CEYOUR4IRg4hWsHIIUQrGDmEaAUjhxCtYOQQohWMHP8BcQngqYr+VbUAAAAASUVORK5CYII="},24399:(e,i,n)=>{n.d(i,{Z:()=>t});const t="data:image/png;base64,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"},95327:(e,i,n)=>{n.d(i,{Z:()=>t});const t=n.p+"assets/images/image-20240115145650592-172024603467020-3d42a57e99054c5690ff6d18f30ab9fd.png"},7375:(e,i,n)=>{n.d(i,{Z:()=>t});const t=n.p+"assets/images/image-20240115161401833-0b592ac5c16c30c680f706e02c4875e0.png"},61722:(e,i,n)=>{n.d(i,{Z:()=>t});const t=n.p+"assets/images/image-20240115163428151-88295904fafc982feac75cb9bd5f7cce.png"},56904:(e,i,n)=>{n.d(i,{Z:()=>t});const t="data:image/png;base64,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"},81353:(e,i,n)=>{n.d(i,{Z:()=>t});const t=n.p+"assets/images/image-20240115164630796-490c3beecc8bb1dac86fe15b81aaf80f.png"},11151:(e,i,n)=>{n.d(i,{Z:()=>c,a:()=>o});var t=n(67294);const s={},r=t.createContext(s);function o(e){const i=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function c(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),t.createElement(r.Provider,{value:i},e.children)}}}]);