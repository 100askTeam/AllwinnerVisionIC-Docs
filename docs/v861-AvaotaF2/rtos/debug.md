---
sidebar_position: 1
---

# RTOS 调试指南

此文档介绍 FreeRTOS 系统方案支持的常用软件调试方法，帮助相关开发人员快速高效地进行软件调试，提高解决软件问题的效率。

## 栈回溯

栈回溯是指获取程序的调用链信息，通过栈回溯信息，能帮助开发者快速理清程序执行流程，提高分析问题的效率。

### 用途

1.  获取程序调用关系，理清程序执行流程。
2.  在系统触发异常时，快速分析异常所在位置及其调用链。
3.  在分析某任务卡死原因时，可以通过对该任务进行栈回溯，快速分析卡死点。
4.  分析某些资源如 sem、mutex 的获取、释放信息。

### 配置

```
Kernel Options ‑‑‑>
    Backtrace Select (debug backtrace by machine code) ‑‑‑>
        (X) debug backtrace by machine code  // 通过解析机器码方式进行回溯
        ( ) debug backtrace by frame pointer // 通过解析frame pointer方式进行回溯
        ( ) no backtrace                     // 关闭栈回溯
```

### 接口介绍

```c
int backtrace(char *taskname, void *output[], int size, int offset, print_function print_func);
```

参数：

-   taskname : 任务名字；可为NULL，表示回溯当前任务
-   output : 栈回溯结果保存数组，可以为NULL
-   size : output数组大小，可为0
-   offset : 栈回溯保存结果的偏移，可为0
-   print\_func : 打印函数，可用printf

返回值：

-   level : 回溯层次

### 终端命令

在设备端的终端界面上支持使用 backtrace 命令对指定的任务进行回溯。

```
作用：查看指定任务堆栈回溯信息
用法：backtrace [taskname]
```

### 回溯信息解析

1.  在 PC 端开发环境中，在 FreeRTOS SDK 根目录下，执行 source envsetup.sh
2.  在 PC 端开发环境中，在 FreeRTOS SDK 的 lichee/rtos 目录下创建 backtrace.txt 文件，然后将回溯信息从终端中拷贝出来，并保存到 backtrace.txt 文件中。
3.  在 PC 端开发环境中，执行 callstack backtrace.txt 命令，会获取以下回溯信息。

```
mhd_start_scan at /xxx/mhd_apps_scan.c:334 #mhd_start_scan表示函数名，/xxx/mhd_apps_scan.c表示函数所在的文件路径，334表示函数调用处的行号。

mhd_softap_start at /xxx/mhd_apps_softap.c:263
wifi_recv_cb at /xxx/mhd_api_test.c:624
mhd_get_host_sleep at /xxx/mhd_apps_wifi.c:81
bswap_16 at /xxx/aw‑alsa‑lib/bswap.h:39
(inlined by) convert_from_s16 at ??:?
linear_init at /xxx/pcm_rate_linear.c:378
resampler_basic_interpolate_single at /xxx/resample_speexdsp.c:395
__fill_vb2_buffer at /xxx/videobuf2‑v4l2.c:392
cci_read at /xxx/cci_helper.c:728
ecdsa_signature_to_asn1 at /xxx/ecdsa.c:294
cmd_wifi_fwlog at /xxx/mhd_api_test.c:449
# 函数调用顺序为从下到上，即cmd_wifi_fwlog ‑> ecdsa_signature_to_asn1 ‑> cci_read ... ‑> mhd_start_scan
```

### 注意事项

请确保执行解析命令时所指定的 rt\_system.elf 为系统固件所对应的 rt\_system.elf 文件，否则解析后的栈回溯信息无法确保正确。

## addr2line 分析

发生异常时，如果栈回溯失败，可以通过 addr2line 工具，对打印出来的栈上数据进行分析，从而确定栈回溯信息。需要注意的是，使用该方法调试的开发人员，需要提前了解一些 ARM 体系架构和入栈出栈等相关知识。

### 用途

在栈回溯失败时，使用 addr2line 从栈上数据中分析栈回溯信息。

### 用法

发生异常时当前栈内容打印如下：

```
dump stack memory:
0x40940f18: 0x40639028 0x4099ba68 0x00000000 0x00000000
0x40940f28: 0x00000000 0x00000000 0x00000000 0x00000000
0x40940f38: 0x00000000 0x00000000 0x00000000 0x00000000
0x40940f48: 0x00000000 0x00000000 0x00000000 0x00000000
0x40940f58: 0x00000000 0x00000000 0x00000000 0x00000000
0x40940f68: 0x00000000 0x00000000 0x00000000 0x00000000
0x40940f78: 0x00000000 0x00000000 0x00000000 0x00000000
0x40940f88: 0x00000000 0x00000000 0x00000000 0x00000000
0x40940f98: 0x00000000 0x404f3680 0x00000001 0x4099ba68
0x40940fa8: 0x4099ba68 0x00000001 0x4099b628 0x00000542
0x40940fb8: 0x4099bb68 0x40141388 0x4099ba68 0x404f3680
0x40940fc8: 0x4099a628 0x4099ba68 0x4099bb6a 0x40142214
0x40940fd8: 0x40141e2c 0x00000000 0x40141e2c 0xdeadbeef
0x40940fe8: 0xdeadbeef 0xdeadbeef 0xdeadbeef 0xdeadbeef
0x40940ff8: 0xdeadbeef 0x400d88b4 0x00000000 0x0001b63d
```

### 分析

对于无法解析的内存数据予以丢弃后，可得到以下有效的分析信息。

```
0x40141388
msh_exec
/xxx/finsh_cli/msh.c:415

0x40142214
finsh_thread_entry
/xxx/finsh_cli/shell_entry.c:746
# 函数调用关系　finsh_thread_entry ‑> msh_exec
```

## 内存泄露分析

FreeRTOS 系统提供轻量级的内存泄露分析功能，启动内存泄露分析后，每当申请内存时，将该内存块挂入链表中，释放时将其从链表中摘除。最终还存在于链表之中的，便是可疑的内存泄露点。

### 用途

可用于分析、定位 FreeRTOS 系统的内存泄露问题。

### 配置

```
System components ‑‑‑>
    aw components ‑‑‑>
        Memleak Components Support ‑‑‑>
            [*] Tina RTOS Memleak #使能内存泄露分析工具
            (16) Tina RTOS Memleak Backtrace Level @ 内存泄露分析栈回溯层数
```

### 终端命令

#### memleak

```
作用：内存泄露分析
用法：
	memleak 1 使能内存泄露分析，记录所有内存块申请信息
    memleak 0 关闭内存泄露分析，删除所有内存块的申请信息
    memleak 1 thread_name1 thread_name2 使能内存泄露分析，记录指定任务的内存块申请信息
    memleak show 不关闭内存泄露分析，打印出所有内存块申请信息
```

#### memallocate

```
作用：查看指定任务的内存泄露分析信息
用法：memallocate thread_name
```

### 内存泄露 log 分析

关闭内存泄露检测时，会打印可疑的内存泄露点及其回溯信息，开发者可根据回溯信息，参考栈回溯章节进行分析。

```
001: ptr = 0x404c7800, size = 0x00000400.
    backtrace : 0x401da778
    backtrace : 0x4013cd78
    backtrace : 0x4013b190
    backtrace : 0x401b7c44
    backtrace : 0x401e1854
    
# ptr : 存留在链表中的内存块地址
# size : 存留在链表中的内存块大小
# backtrace : 申请该内存块时的栈回溯信息
```

## 内存重复释放检查

FreeRTOS 系统提供轻量级的内存重复释放分析功能，在内存堆管理器初始化完成之后，使能内存重复释放检测功能，每当申请内存时，将该内存块挂入链表中，释放时将其从链表中摘除。如果释放一个不存在于该链表中的内存块时，说明之前已经释放过该块内存，则本次释放即为内存重复释放。

### 用途

分析是否存在内存重复释放，以及找到第 2 次释放同一个内存块的调用链信息

### 配置

```
System components ‑‑‑>
    aw components ‑‑‑>
        Memleak Components Support ‑‑‑>
            [*] Tina RTOS Memleak #使能内存泄露分析工具
            [*] Tina RTOS Double Free Check #使能内存重复释放检查
```

### 内存重复释放 log 分析

```
double free checked!!!
backtrace : 0x401da778
backtrace : 0x4013cd78
backtrace : 0x4013b190
backtrace : 0x401b7c44
backtrace : 0x401e1854
```

出现 double free checked!!! 即表示存在内存重复释放现象，打印出来的栈回溯信息是第二次释放该内存块时的调用链信息。
