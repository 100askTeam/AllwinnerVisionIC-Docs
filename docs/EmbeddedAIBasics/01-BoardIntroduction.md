---
sidebar_position: 1
---
# 1. 嵌入式AI学习路线

## 1.1 嵌入式AI的组成

​	嵌入式AI由上层AI应用层和底层AI系统层组成，其实现AI任务的流程如下所示：

1. 嵌入式AI应用中的功能模块可以通过申请嵌入式EAI系统服务；
2. 嵌入式AI系统会基于模型文件对该功能模块相关的实时数据进行推理；
3. 将推理的结果返回给功能模块。

其中对数据的产生处理都在本地进行，可降低数据的传输成本、安全以及决策的实时性。

![image-20231109152938558](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231109152938558.png)

<center>图1.1 嵌入式AI的基本组成</center>

​	那么我们想要学习嵌入式AI就需要学习下面部分：

- 数据层：学习如何在嵌入式设备中采集数据，对数据进行预处理，管理设备中所有AI功能所需要的数据。
- 模型层：也称算法模块，我们需要学习多种智能算法，由于不同的功能模块，需要使用不同的模型文件，而不同的模型文件对应不同的智能算法，同时还需要学习如何管理嵌入式AI系统使用的智能算法。
- 算力层：学习如何使用模型模块的算法和数据模块的数据进行推理，并将推理后的结果返回给上层应用中的功能模块。
- 功能模块：学习对推理的结果进行分析处理，并实现对应的AI任务，如：图像检测任务、语音识别任务等。

## 1.2 教学内容

​	本教程目前有如图1.2所示内容：

![资料大纲.drawio](http://photos.100ask.net/eLinuxAI-TrainingDocs/资料大纲.drawio.png)

<center>图1.2 教程大纲 </center>
