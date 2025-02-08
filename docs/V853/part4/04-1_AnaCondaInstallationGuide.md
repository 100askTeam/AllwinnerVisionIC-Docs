---
sidebar_position: 1
---
# AnaConda安装指南

安装AnaConda，进入AnaConda的官网[https://www.anaconda.com/ 13](https://www.anaconda.com/)
下载AnaConda安装包，点击Download下载并进行开发。

![image](images/a9ec961914abe9781b459df92dee2f66d3dea2c7.png)

下载完成后双击打开安装包，点击Next进入下一步。
![image](images/d0a526e171ea16c1358a9d704612d72c9fae262f.png)

同意许可说明，选择I Agree。
![image](images/23d7f6a01613172fec59a04757557ed0c61cc4f9.png)

选择All Users，并Next。选择All Users防止后续安装环境出现权限不足的问题。

![image](images/3488c17fdc2518c743e102c981ba1d91dca4341a.png)

点击Browse选择安装位置，我这里选择默认位置，点击Next
![image](images/412cc24218b62f0a8f6ae7850b207827cb809ff4.png)

选择选项2，安装在其他项目中，不安装进系统中，防止后续出现问题。点击Install。
![image](images/efecd1131e63bae07a74576ec8b7ca9e9369f9c5.png)

等待安装完成。
![image](images/217f967d7c7499e37b0423088c603fe0a9bfb567.png)
![image](https://forums.100ask.net/uploads/default/original/2X/2/217f967d7c7499e37b0423088c603fe0a9bfb567.png)

安装完成后，点击Next
![image](images/1de9bd6d1f517b2c836d900fae3b48a3845f191d.png)

点击Next
![image](images/113a9568c123dc5b59359f089a213f4123a1c234.png)

取消勾选，点击Finish。
![image](images/d9f92de23be8ace35dbe48ef94e6fdcbf6c7226d.png)

配置环境变量，打开高级系统设置，点击环境变量
![image](images/de709e7883f24afe9f92b54793112f3986929cd3.png)

选择系统环境变量中的Path,点击编辑。
![image](images/3f18cc5539e29c75c26156138188e80ffd6ec1d2.png)

根据安装目录的路径，在Path环境变量中增加以下三条路径，点击确定。
![image](images/bc7d63c55cc1e50401959548db1c91a229ba6b7f.png)

点击确定
![image](images/70afeeb09a74ab0276e3c11563fb4b897fadecf0.png)

点击确定
![image](images/3d51f33e264ce80cd3dee16ca358317e53f07b86.png)

测试conda环境，按下win+R，输入cmd 回车，进入命令行模式。如下所示，测试conda环境配置。

```rust
C:\Users\100askTeam>conda --version
conda 22.9.0

C:\Users\100askTeam>conda info

     active environment : None
       user config file : C:\Users\100askTeam\.condarc
 populated config files : C:\Users\100askTeam\.condarc
          conda version : 22.9.0
    conda-build version : 3.22.0
         python version : 3.9.13.final.0
       virtual packages : __cuda=12.0=0
                          __win=0=0
                          __archspec=1=x86_64
       base environment : C:\ProgramData\Anaconda3  (read only)
      conda av data dir : C:\ProgramData\Anaconda3\etc\conda
  conda av metadata url : None
           channel URLs : https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/win-64
                          https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/noarch
                          https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/win-64
                          https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/noarch
                          https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/win-64
                          https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/noarch
                          https://repo.anaconda.com/pkgs/main/win-64
                          https://repo.anaconda.com/pkgs/main/noarch
```