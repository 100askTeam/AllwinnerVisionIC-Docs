"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[4295],{42382:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>l,default:()=>p,frontMatter:()=>r,metadata:()=>o,toc:()=>a});var t=i(85893),s=i(11151);const r={sidebar_position:1},l="Tina_NPU\u5f00\u53d1\u90e8\u7f72\u8bf4\u660e",o={id:"V853/part3/03-1_TinaNPUDevelopmentDeploymentInstructions",title:"Tina_NPU\u5f00\u53d1\u90e8\u7f72\u8bf4\u660e",description:"1 \u524d\u8a00",source:"@site/docs/V853/part3/03-1_TinaNPUDevelopmentDeploymentInstructions.md",sourceDirName:"V853/part3",slug:"/V853/part3/03-1_TinaNPUDevelopmentDeploymentInstructions",permalink:"/en/docs/V853/part3/03-1_TinaNPUDevelopmentDeploymentInstructions",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/AllwinnerVisionIC-Docs/tree/main/docs/V853/part3/03-1_TinaNPUDevelopmentDeploymentInstructions.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"v853Sidebar",previous:{title:"AI\u5e94\u7528\u5f00\u53d1",permalink:"/en/docs/category/ai\u5e94\u7528\u5f00\u53d1"},next:{title:"\u4eba\u5f62\u68c0\u6d4b\u4e0e\u4eba\u8138\u68c0\u6d4b\u5e94\u7528",permalink:"/en/docs/V853/part3/03-2_HumanoidDAndFaceDApplications"}},c={},a=[{value:"1 \u524d\u8a00",id:"1-\u524d\u8a00",level:2},{value:"1.1 \u8bfb\u8005\u5bf9\u8c61",id:"11-\u8bfb\u8005\u5bf9\u8c61",level:3},{value:"2 \u6b63\u6587",id:"2-\u6b63\u6587",level:2},{value:"2.1 NPU \u5f00\u53d1\u7b80\u4ecb",id:"21-npu-\u5f00\u53d1\u7b80\u4ecb",level:3},{value:"2.2 \u5f00\u53d1\u6d41\u7a0b",id:"22-\u5f00\u53d1\u6d41\u7a0b",level:3},{value:"2.3 \u6a21\u578b\u8bad\u7ec3",id:"23-\u6a21\u578b\u8bad\u7ec3",level:3},{value:"2.4 \u6a21\u578b\u8f6c\u6362",id:"24-\u6a21\u578b\u8f6c\u6362",level:3},{value:"2.5 \u7a0b\u5e8f\u5f00\u53d1",id:"25-\u7a0b\u5e8f\u5f00\u53d1",level:3},{value:"2.6 acuity Toolkit",id:"26-acuity-toolkit",level:3}];function d(e){const n={h1:"h1",h2:"h2",h3:"h3",img:"img",p:"p",...(0,s.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"tina_npu\u5f00\u53d1\u90e8\u7f72\u8bf4\u660e",children:"Tina_NPU\u5f00\u53d1\u90e8\u7f72\u8bf4\u660e"}),"\n",(0,t.jsx)(n.h2,{id:"1-\u524d\u8a00",children:"1 \u524d\u8a00"}),"\n",(0,t.jsx)(n.h3,{id:"11-\u8bfb\u8005\u5bf9\u8c61",children:"1.1 \u8bfb\u8005\u5bf9\u8c61"}),"\n",(0,t.jsx)(n.p,{children:"\u672c\u6587\u6863\uff08\u672c\u6307\u5357\uff09\u4e3b\u8981\u9002\u7528\u4e8e\u4ee5\u4e0b\u4eba\u5458\uff1a"}),"\n",(0,t.jsx)(n.p,{children:"\u2022 \u6280\u672f\u652f\u6301\u5de5\u7a0b\u5e08"}),"\n",(0,t.jsx)(n.p,{children:"\u2022 \u8f6f\u4ef6\u5f00\u53d1\u5de5\u7a0b\u5e08"}),"\n",(0,t.jsx)(n.p,{children:"\u2022 AI \u5e94\u7528\u6848\u5ba2\u6237"}),"\n",(0,t.jsx)(n.h2,{id:"2-\u6b63\u6587",children:"2 \u6b63\u6587"}),"\n",(0,t.jsx)(n.h3,{id:"21-npu-\u5f00\u53d1\u7b80\u4ecb",children:"2.1 NPU \u5f00\u53d1\u7b80\u4ecb"}),"\n",(0,t.jsx)(n.p,{children:"\u2022 \u652f\u6301int8/uint8/int16 \u91cf\u5316\u7cbe\u5ea6\uff0c\u8fd0\u7b97\u6027\u80fd\u53ef\u8fbe1TOPS."}),"\n",(0,t.jsx)(n.p,{children:"\u2022 \u76f8\u8f83\u4e8eGPU \u4f5c\u4e3aAI \u8fd0\u7b97\u5355\u5143\u7684\u5927\u578b\u82af\u7247\u65b9\u6848\uff0c\u529f\u8017\u4e0d\u5230GPU \u6240\u9700\u8981\u76841%."}),"\n",(0,t.jsx)(n.p,{children:"\u2022 \u53ef\u76f4\u63a5\u5bfc\u5165Caffe, TensorFlow, Onnx, TFLite\uff0cKeras, Darknet, pyTorch \u7b49\u6a21\u578b\u683c\u5f0f."}),"\n",(0,t.jsx)(n.p,{children:"\u2022 \u63d0\u4f9bAI \u5f00\u53d1\u5de5\u5177\uff1a\u652f\u6301\u6a21\u578b\u5feb\u901f\u8f6c\u6362\u3001\u652f\u6301\u5f00\u53d1\u677f\u7aef\u4fa7\u8f6c\u6362API\u3001\u652f\u6301TensorFlow, TFLite, Caffe, ONNX, Darknet, pyTorch \u7b49\u6a21\u578b."}),"\n",(0,t.jsx)(n.p,{children:"\u2022 \u63d0\u4f9bAI \u5e94\u7528\u5f00\u53d1\u63a5\u53e3\uff1a\u63d0\u4f9bNPU \u8de8\u5e73\u53f0API."}),"\n",(0,t.jsx)(n.h3,{id:"22-\u5f00\u53d1\u6d41\u7a0b",children:"2.2 \u5f00\u53d1\u6d41\u7a0b"}),"\n",(0,t.jsx)(n.p,{children:"NPU \u5f00\u53d1\u5b8c\u6574\u7684\u6d41\u7a0b\u5982\u4e0b\u56fe\u6240\u793a\uff1a"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"image-20221208111346439",src:i(24899).Z+"",width:"1377",height:"462"})}),"\n",(0,t.jsx)(n.h3,{id:"23-\u6a21\u578b\u8bad\u7ec3",children:"2.3 \u6a21\u578b\u8bad\u7ec3"}),"\n",(0,t.jsx)(n.p,{children:"\u5728\u6a21\u578b\u8bad\u7ec3\u9636\u6bb5\uff0c\u7528\u6237\u6839\u636e\u9700\u6c42\u548c\u5b9e\u9645\u60c5\u51b5\u9009\u62e9\u5408\u9002\u7684\u6846\u67b6\uff08\u5982Caffe\u3001TensorFlow \u7b49\uff09\u8fdb\u884c\u8bad\u7ec3\u5f97\u5230\u7b26\u5408\u9700\u6c42\u7684\u6a21\u578b\u3002\u4e5f\u53ef\u76f4\u63a5\u4f7f\u7528\u5df2\u7ecf\u8bad\u7ec3\u597d\u7684\u6a21\u578b, \u5bf9\u4e8e\u57fa"}),"\n",(0,t.jsx)(n.p,{children:"\u4e8e\u5df2\u6709\u7684\u7b97\u6cd5\u6a21\u578b\u90e8\u7f72\u6765\u8bb2\uff0c\u53ef\u4ee5\u4e0d\u7528\u7ecf\u8fc7\u6a21\u578b\u8bad\u7ec3\u9636\u6bb5."}),"\n",(0,t.jsx)(n.h3,{id:"24-\u6a21\u578b\u8f6c\u6362",children:"2.4 \u6a21\u578b\u8f6c\u6362"}),"\n",(0,t.jsx)(n.p,{children:"\u6b64\u9636\u6bb5\u4e3a\u901a\u8fc7Acuity Toolkit \u628a\u6a21\u578b\u8bad\u7ec3\u4e2d\u5f97\u5230\u7684\u6a21\u578b\u8f6c\u6362\u4e3aNPU \u53ef\u7528\u7684\u6a21\u578bNBG \u6587\u4ef6\u3002"}),"\n",(0,t.jsx)(n.h3,{id:"25-\u7a0b\u5e8f\u5f00\u53d1",children:"2.5 \u7a0b\u5e8f\u5f00\u53d1"}),"\n",(0,t.jsx)(n.p,{children:"\u6700\u540e\u9636\u6bb5\u4e3a\u57fa\u4e8eVIPLite API \u5f00\u53d1\u7a0b\u5e8f\u5b9e\u73b0\u4e1a\u52a1\u903b\u8f91\u3002"}),"\n",(0,t.jsx)(n.h3,{id:"26-acuity-toolkit",children:"2.6 acuity Toolkit"}),"\n",(0,t.jsx)(n.p,{children:"Allwinner \u63d0\u4f9bacuity toolkit \u5f00\u53d1\u5957\u4ef6\u8fdb\u884c\u6a21\u578b\u8f6c\u6362\u3001\u63a8\u7406\u8fd0\u884c\u548c\u6027\u80fd\u8bc4\u4f30\u3002"}),"\n",(0,t.jsx)(n.p,{children:"\u7528\u6237\u901a\u8fc7\u63d0\u4f9b\u7684python \u63a5\u53e3\u53ef\u4ee5\u4fbf\u6377\u5730\u5b8c\u6210\u4ee5\u4e0b\u529f\u80fd\uff1a"}),"\n",(0,t.jsx)(n.p,{children:"1\uff09\u6a21\u578b\u8f6c\u6362\uff1a\u652f\u6301Caffe,TensorFlow Lite, Tensorflow, ONNXDarknet NBG \u6a21\u578b\u5bfc\u5165\u5bfc\u51fa\uff0c\u540e\u7eed\u80fd\u591f\u5728\u786c\u4ef6\u5e73\u53f0\u4e0a\u52a0\u8f7d\u4f7f\u7528\u3002"}),"\n",(0,t.jsx)(n.p,{children:"2\uff09\u6a21\u578b\u63a8\u7406\uff1a\u80fd\u591f\u5728PC \u4e0a\u6a21\u62df\u8fd0\u884c\u6a21\u578b\u5e76\u83b7\u53d6\u63a8\u7406\u7ed3\u679c\uff0c\u4e5f\u53ef\u4ee5\u5728\u6307\u5b9a\u786c\u4ef6\u5e73\u53f0\u4e0a\u8fd0\u884c\u6a21\u578b\u5e76\u83b7\u53d6\u63a8\u7406\u7ed3\u679c\u3002"}),"\n",(0,t.jsx)(n.p,{children:"3\uff09\u6027\u80fd\u8bc4\u4f30\uff1a\u80fd\u591f\u5728PC \u4e0a\u6a21\u62df\u8fd0\u884c\u5e76\u83b7\u53d6\u6a21\u578b\u603b\u8017\u65f6\u53ca\u6bcf\u4e00\u5c42\u7684\u8017\u65f6\u4fe1\u606f\uff0c\u4e5f\u53ef\u4ee5\u901a\u8fc7\u8054\u673a"}),"\n",(0,t.jsx)(n.p,{children:"\u8c03\u8bd5\u7684\u65b9\u5f0f\u5728\u6307\u5b9a\u786c\u4ef6\u5e73\u53f0\u4e0a\u8fd0\u884c\u6a21\u578b\uff0c\u5e76\u83b7\u53d6\u6a21\u578b\u5728\u786c\u4ef6\u4e0a\u8fd0\u884c\u65f6\u7684\u603b\u65f6\u95f4\u548c\u6bcf\u4e00\u5c42\u7684\u8017\u65f6\u4fe1\u606f\u3002"}),"\n",(0,t.jsx)(n.p,{children:"\u6b64\u6587\u6863\u4e3b\u8981\u4ecb\u7ecd\u6a21\u578b\u8f6c\u6362\u548c\u57fa\u4e8eNPU \u7a0b\u5e8f\u5f00\u53d1\uff0c\u4e0d\u6d89\u53ca\u6a21\u578b\u8bad\u7ec3\u7684\u5185\u5bb9\u3002"})]})}function p(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},24899:(e,n,i)=>{i.d(n,{Z:()=>t});const t=i.p+"assets/images/image-20221208111346439-0bb53489295fbdbe466c0f8e893ea938.png"},11151:(e,n,i)=>{i.d(n,{Z:()=>o,a:()=>l});var t=i(67294);const s={},r=t.createContext(s);function l(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);