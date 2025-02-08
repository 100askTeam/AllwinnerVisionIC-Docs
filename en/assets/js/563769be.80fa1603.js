"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[9261],{55648:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>o,frontMatter:()=>t,metadata:()=>a,toc:()=>d});var r=i(85893),s=i(11151);const t={sidebar_position:10},c="\u4f7f\u7528 OpenCV \u6355\u83b7\u6444\u50cf\u5934\u5e76\u4e14\u8f93\u51fa\u5230\u5c4f\u5e55\u4e0a",a={id:"V851se-TinyVision/part3/UseOpenCVToCaptureTheCameraAndDisplayItOnTheScreen",title:"\u4f7f\u7528 OpenCV \u6355\u83b7\u6444\u50cf\u5934\u5e76\u4e14\u8f93\u51fa\u5230\u5c4f\u5e55\u4e0a",description:"\u5feb\u901f\u6d4b\u8bd5",source:"@site/docs/V851se-TinyVision/part3/10-UseOpenCVToCaptureTheCameraAndDisplayItOnTheScreen.md",sourceDirName:"V851se-TinyVision/part3",slug:"/V851se-TinyVision/part3/UseOpenCVToCaptureTheCameraAndDisplayItOnTheScreen",permalink:"/en/docs/V851se-TinyVision/part3/UseOpenCVToCaptureTheCameraAndDisplayItOnTheScreen",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/AllwinnerVisionIC-Docs/tree/main/docs/V851se-TinyVision/part3/10-UseOpenCVToCaptureTheCameraAndDisplayItOnTheScreen.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{sidebar_position:10},sidebar:"v851seSidebar",previous:{title:"\u9002\u914d OpenCV",permalink:"/en/docs/V851se-TinyVision/part3/AdaptOpenCV"},next:{title:"\u4f7f\u7528 Python3 \u64cd\u4f5c OpenCV",permalink:"/en/docs/V851se-TinyVision/part3/UsePython3ToOperateOpenCV"}},l={},d=[{value:"\u5feb\u901f\u6d4b\u8bd5",id:"\u5feb\u901f\u6d4b\u8bd5",level:3},{value:"\u6e90\u7801\u8be6\u89e3",id:"\u6e90\u7801\u8be6\u89e3",level:3}];function f(e){const n={code:"code",h1:"h1",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"\u4f7f\u7528-opencv-\u6355\u83b7\u6444\u50cf\u5934\u5e76\u4e14\u8f93\u51fa\u5230\u5c4f\u5e55\u4e0a",children:"\u4f7f\u7528 OpenCV \u6355\u83b7\u6444\u50cf\u5934\u5e76\u4e14\u8f93\u51fa\u5230\u5c4f\u5e55\u4e0a"}),"\n",(0,r.jsx)(n.h3,{id:"\u5feb\u901f\u6d4b\u8bd5",children:"\u5feb\u901f\u6d4b\u8bd5"}),"\n",(0,r.jsx)(n.p,{children:"\u8fd9\u4e2a DEMO \u4e5f\u5df2\u7ecf\u5305\u542b\u5728 tina-bsp-tinyvision.tar.gz \u4e2d\u4e86\uff0c\u53ef\u4ee5\u5feb\u901f\u6d4b\u8bd5\u8fd9\u4e2a DEMO"}),"\n",(0,r.jsxs)(n.p,{children:["\u8fd0\u884c ",(0,r.jsx)(n.code,{children:"m menuconfig"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"OpenCV  ---\x3e\n\t<*> opencv....................................................... opencv libs\n\t[*]   Enabel sunxi vin isp support\n\t<*> opencv_camera.............................opencv_camera and display image\n"})}),"\n",(0,r.jsx)(n.h3,{id:"\u6e90\u7801\u8be6\u89e3",children:"\u6e90\u7801\u8be6\u89e3"}),"\n",(0,r.jsx)(n.p,{children:"\u7f16\u5199\u4e00\u4e2a\u7a0b\u5e8f\uff0c\u4f7f\u7528 OpenCV \u6355\u83b7\u6444\u50cf\u5934\u8f93\u51fa\u5e76\u4e14\u663e\u793a\u5230\u5c4f\u5e55\u4e0a\uff0c\u7a0b\u5e8f\u5982\u4e0b\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-c++",children:'#include <fcntl.h>\n#include <fstream>\n#include <iostream>\n#include <linux/fb.h>\n#include <signal.h>\n#include <stdint.h>\n#include <sys/ioctl.h>\n\n#include <opencv2/opencv.hpp>\n\n#define DISPLAY_X 240\n#define DISPLAY_Y 240\n\nstatic cv::VideoCapture cap;\n\nstruct framebuffer_info {\n    uint32_t bits_per_pixel;\n    uint32_t xres_virtual;\n};\n\nstruct framebuffer_info get_framebuffer_info(const char* framebuffer_device_path)\n{\n    struct framebuffer_info info;\n    struct fb_var_screeninfo screen_info;\n    int fd = -1;\n    fd = open(framebuffer_device_path, O_RDWR);\n    if (fd >= 0) {\n        if (!ioctl(fd, FBIOGET_VSCREENINFO, &screen_info)) {\n            info.xres_virtual = screen_info.xres_virtual;\n            info.bits_per_pixel = screen_info.bits_per_pixel;\n        }\n    }\n    return info;\n};\n\n/* Signal handler */\nstatic void terminate(int sig_no)\n{\n    printf("Got signal %d, exiting ...\\n", sig_no);\n    cap.release();\n    exit(1);\n}\n\nstatic void install_sig_handler(void)\n{\n    signal(SIGBUS, terminate);\n    signal(SIGFPE, terminate);\n    signal(SIGHUP, terminate);\n    signal(SIGILL, terminate);\n    signal(SIGINT, terminate);\n    signal(SIGIOT, terminate);\n    signal(SIGPIPE, terminate);\n    signal(SIGQUIT, terminate);\n    signal(SIGSEGV, terminate);\n    signal(SIGSYS, terminate);\n    signal(SIGTERM, terminate);\n    signal(SIGTRAP, terminate);\n    signal(SIGUSR1, terminate);\n    signal(SIGUSR2, terminate);\n}\n\nint main(int, char**)\n{\n    const int frame_width = 480;\n    const int frame_height = 480;\n    const int frame_rate = 30;\n\n    install_sig_handler();\n\n    framebuffer_info fb_info = get_framebuffer_info("/dev/fb0");\n\n    cap.open(0);\n\n    if (!cap.isOpened()) {\n        std::cerr << "Could not open video device." << std::endl;\n        return 1;\n    }\n\n    std::cout << "Successfully opened video device." << std::endl;\n    cap.set(cv::CAP_PROP_FRAME_WIDTH, frame_width);\n    cap.set(cv::CAP_PROP_FRAME_HEIGHT, frame_height);\n    cap.set(cv::CAP_PROP_FPS, frame_rate);\n\n    std::ofstream ofs("/dev/fb0");\n\n    cv::Mat frame;\n    cv::Mat trams_temp_fream;\n    cv::Mat yuv_frame;\n\n    while (true) {\n        cap >> frame;\n        if (frame.depth() != CV_8U) {\n            std::cerr << "Not 8 bits per pixel and channel." << std::endl;\n        } else if (frame.channels() != 3) {\n            std::cerr << "Not 3 channels." << std::endl;\n        } else {\n            cv::transpose(frame, frame);\n            cv::flip(frame, frame, 0);\n            cv::resize(frame, frame, cv::Size(DISPLAY_X, DISPLAY_Y));\n            int framebuffer_width = fb_info.xres_virtual;\n            int framebuffer_depth = fb_info.bits_per_pixel;\n            cv::Size2f frame_size = frame.size();\n            cv::Mat framebuffer_compat;\n            switch (framebuffer_depth) {\n            case 16:\n                cv::cvtColor(frame, framebuffer_compat, cv::COLOR_BGR2BGR565);\n                for (int y = 0; y < frame_size.height; y++) {\n                    ofs.seekp(y * framebuffer_width * 2);\n                    ofs.write(reinterpret_cast<char*>(framebuffer_compat.ptr(y)), frame_size.width * 2);\n                }\n                break;\n            case 32: {\n                std::vector<cv::Mat> split_bgr;\n                cv::split(frame, split_bgr);\n                split_bgr.push_back(cv::Mat(frame_size, CV_8UC1, cv::Scalar(255)));\n                cv::merge(split_bgr, framebuffer_compat);\n                for (int y = 0; y < frame_size.height; y++) {\n                    ofs.seekp(y * framebuffer_width * 4);\n                    ofs.write(reinterpret_cast<char*>(framebuffer_compat.ptr(y)), frame_size.width * 4);\n                }\n            } break;\n            default:\n                std::cerr << "Unsupported depth of framebuffer." << std::endl;\n            }\n        }\n    }\n}\n'})}),"\n",(0,r.jsx)(n.p,{children:"\u7b2c\u4e00\u90e8\u5206\uff0c\u5904\u7406 frame_buffer \u4fe1\u606f\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-c++",children:"// \u5f15\u5165\u5934\u6587\u4ef6\n#include <fcntl.h>\n#include <fstream>\n#include <iostream>\n#include <linux/fb.h>\n#include <signal.h>\n#include <stdint.h>\n#include <sys/ioctl.h>\n\n#include <opencv2/opencv.hpp>\n\n// \u5b9a\u4e49\u663e\u793a\u5c4f\u5bbd\u5ea6\u548c\u9ad8\u5ea6\n#define DISPLAY_X 240\n#define DISPLAY_Y 240\n\nstatic cv::VideoCapture cap; // \u89c6\u9891\u6d41\u6355\u83b7\u5bf9\u8c61\n\n// \u5e27\u7f13\u51b2\u4fe1\u606f\u7ed3\u6784\u4f53\nstruct framebuffer_info {\n    uint32_t bits_per_pixel; // \u6bcf\u4e2a\u50cf\u7d20\u7684\u4f4d\u6570\n    uint32_t xres_virtual; // \u865a\u62df\u5c4f\u5e55\u7684\u5bbd\u5ea6\n};\n\n// \u83b7\u53d6\u5e27\u7f13\u51b2\u4fe1\u606f\u51fd\u6570\nstruct framebuffer_info get_framebuffer_info(const char* framebuffer_device_path)\n{\n    struct framebuffer_info info;\n    struct fb_var_screeninfo screen_info;\n    int fd = -1;\n\n    // \u6253\u5f00\u5e27\u7f13\u51b2\u8bbe\u5907\u6587\u4ef6\n    fd = open(framebuffer_device_path, O_RDWR);\n    if (fd >= 0) {\n        // \u901a\u8fc7 ioctl \u83b7\u53d6\u5c4f\u5e55\u4fe1\u606f\n        if (!ioctl(fd, FBIOGET_VSCREENINFO, &screen_info)) {\n            info.xres_virtual = screen_info.xres_virtual; // \u865a\u62df\u5c4f\u5e55\u7684\u5bbd\u5ea6\n            info.bits_per_pixel = screen_info.bits_per_pixel; // \u6bcf\u4e2a\u50cf\u7d20\u7684\u4f4d\u6570\n        }\n    }\n    return info;\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u8fd9\u6bb5\u4ee3\u7801\u5b9a\u4e49\u4e86\u4e00\u4e9b\u5e38\u91cf\u3001\u5168\u5c40\u53d8\u91cf\u4ee5\u53ca\u4e24\u4e2a\u51fd\u6570\uff0c\u5e76\u7ed9\u51fa\u4e86\u76f8\u5e94\u7684\u6ce8\u91ca\u8bf4\u660e\u3002\u5177\u4f53\u6ce8\u91ca\u5982\u4e0b\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"#define DISPLAY_X 240"}),"\uff1a\u5b9a\u4e49\u663e\u793a\u5c4f\u7684\u5bbd\u5ea6\u4e3a240\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"#define DISPLAY_Y 240"}),"\uff1a\u5b9a\u4e49\u663e\u793a\u5c4f\u7684\u9ad8\u5ea6\u4e3a240\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"static cv::VideoCapture cap;"}),"\uff1a\u5b9a\u4e49\u4e00\u4e2a\u9759\u6001\u7684OpenCV\u89c6\u9891\u6d41\u6355\u83b7\u5bf9\u8c61\uff0c\u7528\u4e8e\u6355\u83b7\u89c6\u9891\u6d41\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"struct framebuffer_info"}),"\uff1a\u5b9a\u4e49\u4e86\u4e00\u4e2a\u5e27\u7f13\u51b2\u4fe1\u606f\u7684\u7ed3\u6784\u4f53\u3002","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"uint32_t bits_per_pixel"}),"\uff1a\u6bcf\u4e2a\u50cf\u7d20\u7684\u4f4d\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"uint32_t xres_virtual"}),"\uff1a\u865a\u62df\u5c4f\u5e55\u7684\u5bbd\u5ea6\u3002"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"struct framebuffer_info get_framebuffer_info(const char* framebuffer_device_path)"}),"\uff1a\u83b7\u53d6\u5e27\u7f13\u51b2\u4fe1\u606f\u7684\u51fd\u6570\u3002","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"const char* framebuffer_device_path"}),"\uff1a\u5e27\u7f13\u51b2\u8bbe\u5907\u6587\u4ef6\u7684\u8def\u5f84\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"int fd = -1;"}),"\uff1a\u521d\u59cb\u5316\u6587\u4ef6\u63cf\u8ff0\u7b26\u4e3a-1\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"fd = open(framebuffer_device_path, O_RDWR);"}),"\uff1a\u6253\u5f00\u5e27\u7f13\u51b2\u8bbe\u5907\u6587\u4ef6\uff0c\u5e76\u5c06\u6587\u4ef6\u63cf\u8ff0\u7b26\u4fdd\u5b58\u5728\u53d8\u91cf",(0,r.jsx)(n.code,{children:"fd"}),"\u4e2d\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"if (fd >= 0)"}),"\uff1a\u68c0\u67e5\u6587\u4ef6\u662f\u5426\u6210\u529f\u6253\u5f00\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"if (!ioctl(fd, FBIOGET_VSCREENINFO, &screen_info))"}),"\uff1a\u901a\u8fc7ioctl\u83b7\u53d6\u5c4f\u5e55\u4fe1\u606f\uff0c\u5e76\u5c06\u4fe1\u606f\u4fdd\u5b58\u5728\u53d8\u91cf",(0,r.jsx)(n.code,{children:"screen_info"}),"\u4e2d\u3002","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"FBIOGET_VSCREENINFO"}),"\uff1a\u63a7\u5236\u547d\u4ee4\uff0c\u7528\u4e8e\u83b7\u53d6\u5c4f\u5e55\u4fe1\u606f\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"&screen_info"}),"\uff1a\u5c4f\u5e55\u4fe1\u606f\u7ed3\u6784\u4f53\u7684\u6307\u9488\u3002"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"info.xres_virtual = screen_info.xres_virtual;"}),"\uff1a\u5c06\u5c4f\u5e55\u7684\u865a\u62df\u5bbd\u5ea6\u4fdd\u5b58\u5728\u5e27\u7f13\u51b2\u4fe1\u606f\u7ed3\u6784\u4f53\u7684\u5b57\u6bb5",(0,r.jsx)(n.code,{children:"xres_virtual"}),"\u4e2d\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"info.bits_per_pixel = screen_info.bits_per_pixel;"}),"\uff1a\u5c06\u6bcf\u4e2a\u50cf\u7d20\u7684\u4f4d\u6570\u4fdd\u5b58\u5728\u5e27\u7f13\u51b2\u4fe1\u606f\u7ed3\u6784\u4f53\u7684\u5b57\u6bb5",(0,r.jsx)(n.code,{children:"bits_per_pixel"}),"\u4e2d\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"return info;"}),"\uff1a\u8fd4\u56de\u5e27\u7f13\u51b2\u4fe1\u606f\u7ed3\u6784\u4f53\u3002"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["\u7b2c\u4e8c\u90e8\u5206\uff0c\u6ce8\u518c\u4fe1\u53f7\u5904\u7406\u51fd\u6570\uff0c\u7528\u4e8e ",(0,r.jsx)(n.code,{children:"ctrl-c"})," \u4e4b\u540e\u5173\u95ed\u6444\u50cf\u5934\uff0c\u9632\u6b62\u4e0b\u4e00\u6b21\u4f7f\u7528\u6444\u50cf\u5934\u51fa\u73b0\u6444\u50cf\u5934\u4ecd\u88ab\u5360\u7528\u7684\u60c5\u51b5\u3002"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-c++",children:'/* Signal handler */\nstatic void terminate(int sig_no)\n{\n    printf("Got signal %d, exiting ...\\n", sig_no);\n    cap.release();\n    exit(1);\n}\n\nstatic void install_sig_handler(void)\n{\n    signal(SIGBUS, terminate); // \u5f53\u7a0b\u5e8f\u8bbf\u95ee\u4e00\u4e2a\u4e0d\u5408\u6cd5\u7684\u5185\u5b58\u5730\u5740\u65f6\u53d1\u9001\u7684\u4fe1\u53f7\n    signal(SIGFPE, terminate); // \u6d6e\u70b9\u5f02\u5e38\u4fe1\u53f7\n    signal(SIGHUP, terminate); // \u7ec8\u7aef\u65ad\u5f00\u8fde\u63a5\u4fe1\u53f7\n    signal(SIGILL, terminate); // \u975e\u6cd5\u6307\u4ee4\u4fe1\u53f7\n    signal(SIGINT, terminate); // \u4e2d\u65ad\u8fdb\u7a0b\u4fe1\u53f7\n    signal(SIGIOT, terminate); // IOT \u9677\u9631\u4fe1\u53f7\n    signal(SIGPIPE, terminate); // \u7ba1\u9053\u7834\u88c2\u4fe1\u53f7\n    signal(SIGQUIT, terminate); // \u505c\u6b62\u8fdb\u7a0b\u4fe1\u53f7\n    signal(SIGSEGV, terminate); // \u65e0\u6548\u7684\u5185\u5b58\u5f15\u7528\u4fe1\u53f7\n    signal(SIGSYS, terminate); // \u975e\u6cd5\u7cfb\u7edf\u8c03\u7528\u4fe1\u53f7\n    signal(SIGTERM, terminate); // \u7ec8\u6b62\u8fdb\u7a0b\u4fe1\u53f7\n    signal(SIGTRAP, terminate); // \u8ddf\u8e2a/\u65ad\u70b9\u9677\u9631\u4fe1\u53f7\n    signal(SIGUSR1, terminate); // \u7528\u6237\u5b9a\u4e49\u4fe1\u53f71\n    signal(SIGUSR2, terminate); // \u7528\u6237\u5b9a\u4e49\u4fe1\u53f72\n}\n'})}),"\n",(0,r.jsx)(n.p,{children:"\u8fd9\u6bb5\u4ee3\u7801\u5b9a\u4e49\u4e86\u4e24\u4e2a\u51fd\u6570\uff0c\u5e76\u7ed9\u51fa\u4e86\u76f8\u5e94\u7684\u6ce8\u91ca\u8bf4\u660e\u3002\u5177\u4f53\u6ce8\u91ca\u5982\u4e0b\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"static void terminate(int sig_no)"}),"\uff1a\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"int sig_no"}),"\uff1a\u63a5\u6536\u5230\u7684\u4fe1\u53f7\u7f16\u53f7\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:'printf("Got signal %d, exiting ...\\n", sig_no);'}),"\uff1a\u6253\u5370\u63a5\u6536\u5230\u7684\u4fe1\u53f7\u7f16\u53f7\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"cap.release();"}),"\uff1a\u91ca\u653e\u89c6\u9891\u6d41\u6355\u83b7\u5bf9\u8c61\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"exit(1);"}),"\uff1a\u9000\u51fa\u7a0b\u5e8f\u3002"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"static void install_sig_handler(void)"}),"\uff1a\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGBUS, terminate);"}),"\uff1a\u4e3aSIGBUS\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGFPE, terminate);"}),"\uff1a\u4e3aSIGFPE\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGHUP, terminate);"}),"\uff1a\u4e3aSIGHUP\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGILL, terminate);"}),"\uff1a\u4e3aSIGILL\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGINT, terminate);"}),"\uff1a\u4e3aSIGINT\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGIOT, terminate);"}),"\uff1a\u4e3aSIGIOT\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGPIPE, terminate);"}),"\uff1a\u4e3aSIGPIPE\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGQUIT, terminate);"}),"\uff1a\u4e3aSIGQUIT\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGSEGV, terminate);"}),"\uff1a\u4e3aSIGSEGV\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGSYS, terminate);"}),"\uff1a\u4e3aSIGSYS\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGTERM, terminate);"}),"\uff1a\u4e3aSIGTERM\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGTRAP, terminate);"}),"\uff1a\u4e3aSIGTRAP\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGUSR1, terminate);"}),"\uff1a\u4e3aSIGUSR1\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"signal(SIGUSR2, terminate);"}),"\uff1a\u4e3aSIGUSR2\u4fe1\u53f7\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["\u8fd9\u6bb5\u4ee3\u7801\u7684\u529f\u80fd\u662f\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\uff0c\u7528\u4e8e\u6355\u83b7\u548c\u5904\u7406\u4e0d\u540c\u7c7b\u578b\u7684\u4fe1\u53f7\u3002\u5f53\u7a0b\u5e8f\u63a5\u6536\u5230\u6307\u5b9a\u7684\u4fe1\u53f7\u65f6\uff0c\u4f1a\u8c03\u7528",(0,r.jsx)(n.code,{children:"terminate"}),"\u51fd\u6570\u8fdb\u884c\u5904\u7406\u3002"]}),"\n",(0,r.jsxs)(n.p,{children:["\u5177\u4f53\u800c\u8a00\uff0c",(0,r.jsx)(n.code,{children:"terminate"}),"\u51fd\u6570\u4f1a\u6253\u5370\u63a5\u6536\u5230\u7684\u4fe1\u53f7\u7f16\u53f7\uff0c\u5e76\u91ca\u653e\u89c6\u9891\u6d41\u6355\u83b7\u5bf9\u8c61",(0,r.jsx)(n.code,{children:"cap"}),"\uff0c\u7136\u540e\u8c03\u7528",(0,r.jsx)(n.code,{children:"exit(1)"}),"\u9000\u51fa\u7a0b\u5e8f\u3002"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"install_sig_handler"}),"\u51fd\u6570\u7528\u4e8e\u4e3a\u591a\u4e2a\u4fe1\u53f7\u6ce8\u518c\u540c\u4e00\u4e2a\u4fe1\u53f7\u5904\u7406\u51fd\u6570",(0,r.jsx)(n.code,{children:"terminate"}),"\uff0c\u4f7f\u5f97\u5f53\u8fd9\u4e9b\u4fe1\u53f7\u89e6\u53d1\u65f6\uff0c\u90fd\u4f1a\u6267\u884c\u76f8\u540c\u7684\u5904\u7406\u903b\u8f91\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u7b2c\u4e09\u90e8\u5206\uff0c\u4e3b\u51fd\u6570\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-c++",children:'int main(int, char**)\n{\n    const int frame_width = 480;\n    const int frame_height = 480;\n    const int frame_rate = 30;\n\n    install_sig_handler(); // \u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\n\n    framebuffer_info fb_info = get_framebuffer_info("/dev/fb0"); // \u83b7\u53d6\u5e27\u7f13\u51b2\u533a\u4fe1\u606f\n\n    cap.open(0); // \u6253\u5f00\u6444\u50cf\u5934\n\n    if (!cap.isOpened()) {\n        std::cerr << "Could not open video device." << std::endl;\n        return 1;\n    }\n\n    std::cout << "Successfully opened video device." << std::endl;\n    cap.set(cv::CAP_PROP_FRAME_WIDTH, frame_width);\n    cap.set(cv::CAP_PROP_FRAME_HEIGHT, frame_height);\n    cap.set(cv::CAP_PROP_FPS, frame_rate);\n\n    std::ofstream ofs("/dev/fb0"); // \u6253\u5f00\u5e27\u7f13\u51b2\u533a\n\n    cv::Mat frame;\n    cv::Mat trams_temp_fream;\n    cv::Mat yuv_frame;\n\n    while (true) {\n        cap >> frame; // \u8bfb\u53d6\u4e00\u5e27\u56fe\u50cf\n        if (frame.depth() != CV_8U) { // \u5224\u65ad\u662f\u5426\u4e3a8\u4f4d\u6bcf\u901a\u9053\u50cf\u7d20\n            std::cerr << "Not 8 bits per pixel and channel." << std::endl;\n        } else if (frame.channels() != 3) { // \u5224\u65ad\u662f\u5426\u4e3a3\u901a\u9053\n            std::cerr << "Not 3 channels." << std::endl;\n        } else {\n            cv::transpose(frame, frame); // \u56fe\u50cf\u8f6c\u7f6e\n            cv::flip(frame, frame, 0); // \u56fe\u50cf\u7ffb\u8f6c\n            cv::resize(frame, frame, cv::Size(DISPLAY_X, DISPLAY_Y)); // \u6539\u53d8\u56fe\u50cf\u5927\u5c0f\n            int framebuffer_width = fb_info.xres_virtual;\n            int framebuffer_depth = fb_info.bits_per_pixel;\n            cv::Size2f frame_size = frame.size();\n            cv::Mat framebuffer_compat;\n            switch (framebuffer_depth) {\n            case 16:\n                cv::cvtColor(frame, framebuffer_compat, cv::COLOR_BGR2BGR565);\n                for (int y = 0; y < frame_size.height; y++) {\n                    ofs.seekp(y * framebuffer_width * 2);\n                    ofs.write(reinterpret_cast<char*>(framebuffer_compat.ptr(y)), frame_size.width * 2);\n                }\n                break;\n            case 32: {\n                std::vector<cv::Mat> split_bgr;\n                cv::split(frame, split_bgr);\n                split_bgr.push_back(cv::Mat(frame_size, CV_8UC1, cv::Scalar(255)));\n                cv::merge(split_bgr, framebuffer_compat);\n                for (int y = 0; y < frame_size.height; y++) {\n                    ofs.seekp(y * framebuffer_width * 4);\n                    ofs.write(reinterpret_cast<char*>(framebuffer_compat.ptr(y)), frame_size.width * 4);\n                }\n            } break;\n            default:\n                std::cerr << "Unsupported depth of framebuffer." << std::endl;\n            }\n        }\n    }\n\n    return 0;\n}\n'})}),"\n",(0,r.jsx)(n.p,{children:"\u8fd9\u6bb5\u4ee3\u7801\u4e3b\u8981\u5b9e\u73b0\u4e86\u4ece\u6444\u50cf\u5934\u83b7\u53d6\u56fe\u50cf\u5e76\u5c06\u5176\u663e\u793a\u5728\u5e27\u7f13\u51b2\u533a\u4e2d\u3002\u5177\u4f53\u6d41\u7a0b\u5982\u4e0b\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\u5b9a\u4e49\u4e86\u5e38\u91cf",(0,r.jsx)(n.code,{children:"frame_width"}),"\u3001",(0,r.jsx)(n.code,{children:"frame_height"}),"\u548c",(0,r.jsx)(n.code,{children:"frame_rate"}),"\u8868\u793a\u56fe\u50cf\u7684\u5bbd\u5ea6\u3001\u9ad8\u5ea6\u548c\u5e27\u7387\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:["\u8c03\u7528",(0,r.jsx)(n.code,{children:"install_sig_handler()"}),"\u51fd\u6570\u5b89\u88c5\u4fe1\u53f7\u5904\u7406\u51fd\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:["\u8c03\u7528",(0,r.jsx)(n.code,{children:'get_framebuffer_info("/dev/fb0")'}),"\u51fd\u6570\u83b7\u53d6\u5e27\u7f13\u51b2\u533a\u4fe1\u606f\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:["\u8c03\u7528",(0,r.jsx)(n.code,{children:"cap.open(0)"}),"\u6253\u5f00\u6444\u50cf\u5934\uff0c\u5e76\u8fdb\u884c\u9519\u8bef\u68c0\u67e5\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:["\u8c03\u7528",(0,r.jsx)(n.code,{children:"cap.set()"}),"\u51fd\u6570\u8bbe\u7f6e\u6444\u50cf\u5934\u7684\u53c2\u6570\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:["\u8c03\u7528",(0,r.jsx)(n.code,{children:'std::ofstream ofs("/dev/fb0")'}),"\u6253\u5f00\u5e27\u7f13\u51b2\u533a\u3002"]}),"\n",(0,r.jsx)(n.li,{children:"\u5faa\u73af\u8bfb\u53d6\u6444\u50cf\u5934\u7684\u6bcf\u4e00\u5e27\u56fe\u50cf\uff0c\u5bf9\u5176\u8fdb\u884c\u8f6c\u7f6e\u3001\u7ffb\u8f6c\u3001\u7f29\u653e\u7b49\u64cd\u4f5c\uff0c\u7136\u540e\u5c06\u5176\u5199\u5165\u5e27\u7f13\u51b2\u533a\u4e2d\u3002"}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"\u5982\u679c\u8bfb\u53d6\u7684\u56fe\u50cf\u4e0d\u662f8\u4f4d\u6bcf\u901a\u9053\u50cf\u7d20\u6216\u8005\u4e0d\u662f3\u901a\u9053\uff0c\u5219\u4f1a\u8f93\u51fa\u9519\u8bef\u4fe1\u606f\u3002\u5982\u679c\u5e27\u7f13\u51b2\u533a\u7684\u6df1\u5ea6\u4e0d\u53d7\u652f\u6301\uff0c\u5219\u4e5f\u4f1a\u8f93\u51fa\u9519\u8bef\u4fe1\u606f\u3002"})]})}function o(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(f,{...e})}):f(e)}},11151:(e,n,i)=>{i.d(n,{Z:()=>a,a:()=>c});var r=i(67294);const s={},t=r.createContext(s);function c(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:c(e.components),r.createElement(t.Provider,{value:n},e.children)}}}]);