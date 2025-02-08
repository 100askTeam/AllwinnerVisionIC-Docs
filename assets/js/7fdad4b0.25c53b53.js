"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2343],{68799:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>t,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>c,toc:()=>l});var s=i(85893),r=i(11151);const o={sidebar_position:3},a="\u4e0b\u8f7d AWOL Tina Linux BSP",c={id:"V851se-TinyVision/part3/DownloadTheAWOLTinaLinuxBSP",title:"\u4e0b\u8f7d AWOL Tina Linux BSP",description:"\u6ce8\u518c\u4e00\u4e2a AWOL \u8d26\u53f7",source:"@site/docs/V851se-TinyVision/part3/3-DownloadTheAWOLTinaLinuxBSP.md",sourceDirName:"V851se-TinyVision/part3",slug:"/V851se-TinyVision/part3/DownloadTheAWOLTinaLinuxBSP",permalink:"/docs/V851se-TinyVision/part3/DownloadTheAWOLTinaLinuxBSP",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/AllwinnerVisionIC-Docs/tree/main/docs/V851se-TinyVision/part3/3-DownloadTheAWOLTinaLinuxBSP.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"v851seSidebar",previous:{title:"\u51c6\u5907\u5f00\u53d1\u73af\u5883",permalink:"/docs/V851se-TinyVision/part3/PrepareTheDevelopmentEnvironmentForTranslationOnly"},next:{title:"\u9002\u914d TinyVision \u677f\u5b50",permalink:"/docs/V851se-TinyVision/part3/AdaptTheTinyVisionBoard"}},t={},l=[{value:"\u6ce8\u518c\u4e00\u4e2a AWOL \u8d26\u53f7",id:"\u6ce8\u518c\u4e00\u4e2a-awol-\u8d26\u53f7",level:3},{value:"\u5b89\u88c5 repo \u7ba1\u7406\u5668",id:"\u5b89\u88c5-repo-\u7ba1\u7406\u5668",level:3},{value:"\u65b0\u5efa\u6587\u4ef6\u5939\u4fdd\u5b58 SDK",id:"\u65b0\u5efa\u6587\u4ef6\u5939\u4fdd\u5b58-sdk",level:3},{value:"\u521d\u59cb\u5316 repo \u4ed3\u5e93",id:"\u521d\u59cb\u5316-repo-\u4ed3\u5e93",level:3},{value:"\u62c9\u53d6 SDK",id:"\u62c9\u53d6-sdk",level:3},{value:"\u521b\u5efa\u5f00\u53d1\u73af\u5883",id:"\u521b\u5efa\u5f00\u53d1\u73af\u5883",level:3}];function d(e){const n={a:"a",code:"code",h1:"h1",h3:"h3",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"\u4e0b\u8f7d-awol-tina-linux-bsp",children:"\u4e0b\u8f7d AWOL Tina Linux BSP"}),"\n",(0,s.jsx)(n.h3,{id:"\u6ce8\u518c\u4e00\u4e2a-awol-\u8d26\u53f7",children:"\u6ce8\u518c\u4e00\u4e2a AWOL \u8d26\u53f7"}),"\n",(0,s.jsxs)(n.p,{children:["\u4e0b\u8f7d SDK \u9700\u8981\u4f7f\u7528 AWOL \u7684\u8d26\u53f7\uff0c\u524d\u5f80 ",(0,s.jsx)(n.code,{children:"https://bbs.aw-ol.com/"})," \u6ce8\u518c\u4e00\u4e2a\u5c31\u884c\u3002\u5176\u4e2d\u9700\u8981\u8d26\u53f7\u7b49\u7ea7\u4e3a LV2\uff0c\u53ef\u4ee5\u53bb\u8fd9\u4e2a\u5e16\u5b50\uff1a",(0,s.jsx)(n.a,{href:"https://bbs.aw-ol.com/topic/4158/share/1",children:"https://bbs.aw-ol.com/topic/4158/share/1"})," \u6c34\u56db\u6761\u56de\u590d\u5c31\u6709 LV2 \u7b49\u7ea7\u4e86\u3002"]}),"\n",(0,s.jsx)(n.h3,{id:"\u5b89\u88c5-repo-\u7ba1\u7406\u5668",children:"\u5b89\u88c5 repo \u7ba1\u7406\u5668"}),"\n",(0,s.jsxs)(n.p,{children:["BSP \u4f7f\u7528 ",(0,s.jsx)(n.code,{children:"repo"})," \u4e0b\u8f7d\uff0c\u9996\u5148\u5b89\u88c5 ",(0,s.jsx)(n.code,{children:"repo "}),"\uff0c\u8fd9\u91cc\u5efa\u8bae\u4f7f\u7528\u56fd\u5185\u955c\u50cf\u6e90\u5b89\u88c5"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:'mkdir -p ~/.bin\nPATH="${HOME}/.bin:${PATH}"\ncurl https://mirrors.bfsu.edu.cn/git/git-repo > ~/.bin/repo\nchmod a+rx ~/.bin/repo\n'})}),"\n",(0,s.jsx)(n.p,{children:"\u8bf7\u6ce8\u610f\u8fd9\u91cc\u4f7f\u7528\u7684\u662f\u4e34\u65f6\u5b89\u88c5\uff0c\u5b89\u88c5\u5b8c\u6210\u540e\u91cd\u542f\u7ec8\u7aef\u5c31\u6ca1\u6709\u4e86\uff0c\u9700\u8981\u518d\u6b21\u8fd0\u884c\u4e0b\u9762\u7684\u547d\u4ee4\u624d\u80fd\u4f7f\u7528\uff0c\u5982\u4f55\u6c38\u4e45\u5b89\u88c5\u8bf7\u81ea\u884c\u767e\u5ea6\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:'PATH="${HOME}/.bin:${PATH}"\n'})}),"\n",(0,s.jsxs)(n.p,{children:["\u5b89\u88c5\u4f7f\u7528 ",(0,s.jsx)(n.code,{children:"repo"})," \u7684\u8fc7\u7a0b\u4e2d\u4f1a\u9047\u5230\u5404\u79cd\u9519\u8bef\uff0c\u8bf7\u767e\u5ea6\u89e3\u51b3\u3002repo \u662f\u8c37\u6b4c\u5f00\u53d1\u7684\uff0crepo \u7684\u5b98\u65b9\u670d\u52a1\u5668\u662f\u8c37\u6b4c\u7684\u670d\u52a1\u5668\uff0crepo \u6bcf\u6b21\u8fd0\u884c\u65f6\u9700\u8981\u68c0\u67e5\u66f4\u65b0\u7136\u540e\u5361\u6b7b\uff0c\u8fd9\u662f\u5f88\u6b63\u5e38\u7684\u60c5\u51b5\uff0c\u6240\u4ee5\u5728\u56fd\u5185\u9700\u8981\u66f4\u6362\u955c\u50cf\u6e90\u63d0\u9ad8\u4e0b\u8f7d\u901f\u5ea6\u3002\u5c06\u5982\u4e0b\u5185\u5bb9\u590d\u5236\u5230\u4f60\u7684",(0,s.jsx)(n.code,{children:"~/.bashrc"})," \u91cc"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"echo export REPO_URL='https://mirrors.bfsu.edu.cn/git/git-repo' >> ~/.bashrc\nsource ~/.bashrc\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\u5982\u679c\u60a8\u4f7f\u7528\u7684\u662f dash\u3001hash\u3001 zsh \u7b49 shell\uff0c\u8bf7\u53c2\u7167 shell \u7684\u6587\u6863\u914d\u7f6e\u3002\u73af\u5883\u53d8\u91cf\u914d\u7f6e\u4e00\u4e2a ",(0,s.jsx)(n.code,{children:"REPO_URL"})," \u7684\u5730\u5740"]}),"\n",(0,s.jsx)(n.p,{children:"\u914d\u7f6e\u4e00\u4e0b git \u8eab\u4efd\u8ba4\u8bc1\uff0c\u8bbe\u7f6e\u4fdd\u5b58 git \u8d26\u53f7\u5bc6\u7801\u4e0d\u7528\u6bcf\u6b21\u90fd\u8f93\u5165\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"git config --global credential.helper store\n"})}),"\n",(0,s.jsx)(n.h3,{id:"\u65b0\u5efa\u6587\u4ef6\u5939\u4fdd\u5b58-sdk",children:"\u65b0\u5efa\u6587\u4ef6\u5939\u4fdd\u5b58 SDK"}),"\n",(0,s.jsxs)(n.p,{children:["\u4f7f\u7528 ",(0,s.jsx)(n.code,{children:"mkdir"})," \u547d\u4ee4\u65b0\u5efa\u6587\u4ef6\u5939\uff0c\u4fdd\u5b58\u4e4b\u540e\u9700\u8981\u62c9\u53d6\u7684 SDK\uff0c\u7136\u540e ",(0,s.jsx)(n.code,{children:"cd"})," \u8fdb\u5165\u5230\u521a\u624d\u65b0\u5efa\u7684\u6587\u4ef6\u5939\u4e2d\u3002"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"mkdir tina-v853-open\ncd tina-v853-open\n"})}),"\n",(0,s.jsx)(n.h3,{id:"\u521d\u59cb\u5316-repo-\u4ed3\u5e93",children:"\u521d\u59cb\u5316 repo \u4ed3\u5e93"}),"\n",(0,s.jsxs)(n.p,{children:["\u4f7f\u7528 ",(0,s.jsx)(n.code,{children:"repo init"})," \u547d\u4ee4\u521d\u59cb\u5316\u4ed3\u5e93\uff0c",(0,s.jsx)(n.code,{children:"tina-v853-open"})," \u7684\u4ed3\u5e93\u5730\u5740\u662f ",(0,s.jsx)(n.code,{children:"https://sdk.aw-ol.com/git_repo/V853Tina_Open/manifest.git"})," \u9700\u8981\u6267\u884c\u547d\u4ee4\uff1a"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"repo init -u https://sdk.aw-ol.com/git_repo/V853Tina_Open/manifest.git -b master -m tina-v853-open.xml\n"})}),"\n",(0,s.jsx)(n.h3,{id:"\u62c9\u53d6-sdk",children:"\u62c9\u53d6 SDK"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"repo sync\n"})}),"\n",(0,s.jsx)(n.h3,{id:"\u521b\u5efa\u5f00\u53d1\u73af\u5883",children:"\u521b\u5efa\u5f00\u53d1\u73af\u5883"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"repo start devboard-v853-tina-for-awol --all\n"})})]})}function h(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},11151:(e,n,i)=>{i.d(n,{Z:()=>c,a:()=>a});var s=i(67294);const r={},o=s.createContext(r);function a(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);