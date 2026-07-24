---
sidebar_position: 7
---

# FASTBOOT 快启时间测定

本系统通过一套简洁高效的配置机制，实现快启时间的精准测量。鉴于其为多核异构架构，启动时序被划分为以下四个独立阶段进行分段统计：

-   BROM 阶段
-   BOOT0 阶段
-   RTOS 阶段
-   Linux 内核阶段

为确保跨核时间基准的一致性与高精度，系统采用专用独立硬件定时器提供统一时钟源，彻底消除因各核心本地 TICK 差异带来的测量误差。

:::warning

:::note

注意

:::
:::note

1.  时间测量功能本身会引入额外开销，\*\*每个阶段开启耗时测定会影响到下一个阶段的入口时间，需要独立每块进行测定。\*\*例如 BOOT0 开启耗时测定一定会影响内核启动时间。
2.  量产版本请务必关闭该功能。
3.  **UART 日志输出将显著增加软件耗时**，115200 波特率下打印 100 个字符就需要 10ms，测量期间请全局关闭 UART 调试打印，将 LOGLEVEL 降低，仅保留耗时输出打印。
4.  时间测定需要考虑两方面，包括当前时间戳和执行操作的耗时，一般使用时间戳作为耗时数据的拉通，执行操作的耗时由时间戳相减得来。

:::

:::
:::danger

:::note

危险

:::
:::note

注：本文所列耗时数据为示例模拟值，仅用于说明测量方法，不具备横向对比意义。如需获取官方基准数据，请联系 FAE 获取对应版本的实测报告。

:::

:::

## BROM 时间测定

BROM 为芯片内固化的 ROM，主要用于初始化芯片，初始化存储读取 BOOT0 并运行，这部分时间基本是固定的，可以通过 BOOT0 的启动时间反推 BROM 阶段的耗时。

## BOOT0 时间测定

BOOT0 阶段负责完成系统基础环境初始化、RTOS 与内核固件解压缩及加载，并依次跳转至 RTOS 与 Linux 内核，实现多核异构系统的有序启动。

### BOOT0 时间测定配置

BOOT0 阶段提供有 quick\_config 配置以启用耗时，执行 quick\_config 项目 `enable_boot0_time_measure` 即可开启配置。

```
quick_config enable_boot0_time_measure
```

配置后需要重新编译 BOOT0，可以执行 `mboot0` 来单独编译 BOOT0，打包烧录启动。

### BOOT0 耗时分析

配置完成后，在 BOOT0 结束后将会打印出耗时数据，示例如下：

```
[02]   boot0: 1a0 tick
[03]   bootinit early: 1a1 tick
[04]   serial_init: 1a2 tick
[05]   commit_log: 1a3 tick
[06]   get_cpu_clock_type: 1a4 tick
[07]   load_rv0: 1a5 tick
[08]   load_and_run_riscv: 1a6 tick
[09]   load_kernel: 1a7 tick
[10]   mmu_disable: 1a8 tick
[11]   jump_opensbi: 1a9 tick
```

以 `[02] boot0: 1a0 tick` 为例说明日志格式：

-   `[02]`：日志序号，仅用于标识打印顺序，无时间参考意义。
-   `boot0`：当前操作名称；此处为 BOOT0 阶段首条日志，标记 BROM 移交控制权至 BOOT0 的入口时刻。
-   `1a0 tick`：硬件定时器累计值（十六进制），单位 Tick；转换为微秒的公式为  
    $T_{\mu s} = \frac{\text{Tick}}{24}$  
    示例 `1a0`（十进制 416 Tick）对应耗时约 17.3 μs，即 BROM 完成到 BOOT0 的跳转耗时。

以 `[07] load_rv0: 1a5 tick` 为例，字段含义如下：

-   `[07]`：日志序号，仅标识打印顺序，无时间参考意义。
-   `load_rv0`：当前操作名称，表示加载 RTOS 固件。
-   `1a5 tick`：硬件定时器累计值（十六进制），即该操作完成时刻对应的 Tick 值 `0x1a5`。

为便于后续数据分析，附 Python 脚本一份，可将 BOOT 日志中的十六进制 Tick 自动解析为十进制，并导出为 CSV 表格。使用方法：将完整日志保存为 `log.txt`，运行脚本后生成 `output.csv`。

:::tip

:::note

提示

:::
:::note

**Q：脚本为何直接导出 Tick 而非微秒？**  
**A：** 时间戳由 24 MHz 硬件定时器产生，1 Tick ≈ 41.67 ns。若立即换算为微秒，需执行“Tick ÷ 24”的定点除法，会引入舍入误差并丢失原始精度。保留 Tick 值可确保后续分析、校准及跨平台换算时拥有完整、无损的原始数据。

:::

:::

```python
import csv

# 读取日志文件
log_file = 'log.txt'
parsed_data = []

with open(log_file, 'r') as file:
    for line in file:
        # 查找日志中的名称和tick值
        if 'tick' in line:
            parts = line.split(":")
            if len(parts) == 2:
                name = parts[0].strip().split("]")[1].strip()  # 提取名称
                tick_value = parts[1].strip().split(" ")[0]  # 提取tick值
                parsed_data.append([name, str(int(tick_value, 16))])

# 输出到CSV文件
output_file = 'output.csv'
with open(output_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Name', 'Tick Value'])  # 写入标题行
    writer.writerows(parsed_data)  # 写入数据行

print(f"CSV文件已生成，文件名为{output_file}")
```

### 关闭 BOOT0 耗时测量

时间测量功能会引入额外开销，影响系统性能。完成测量后，请务必在量产前关闭该功能。执行以下 quick\_config 命令可快速禁用 BOOT0 耗时测量：

```
quick_config disable_boot0_time_measure
```

## RTOS 时间测定

RTOS 负责关键外设的高速初始化、视觉算法的快速收敛以及辅助核心的数据加载，是多核异构架构中不可或缺的实时计算单元。其启动时序的任何异常都会直接放大为系统级耗时偏差，因此需对 RTOS 阶段进行独立、高精度的耗时测量。

### RTOS 时间测定配置

RTOS 阶段提供有 quick\_config 配置以启用耗时，执行 quick\_config 项目 `enable_rtos_time_measure` 即可开启配置。

```
quick_config enable_rtos_time_measure
```

### RTOS 耗时分析

#### 时间戳信息

RTOS 的打印默认会输出时间戳信息，所以想判断某一个操作的耗时，在入口和出口都加一条打印即可，RTOS 示例打印如下：

```
[0.028](a1be4)Date:Sep 17 2025, Time:14:33:22
[0.028](a1c5c)AMP timestamp device 0 probe success, count_freq: 24000000Hz
[0.028](a1fd2)Boot time: 26482 us
[0.028](a2187)SystemInit Done: cost 14 us
[0.028](a23ff)amp_hw_wdog_feed_thread enter, feed_interval: 100ms, feed_interval_tick: 100
[0.028](a27f6)AMP hardware watchdog's new timeout: 3s
[0.028](a2a5d)Begin to feed AMP hardware watchdog!
[0.028](a2df4)[VIN_LOG_MD]CSI start!
[0.028](a2ff1)[VIN_ERR]used0 is 0
```

以 `[0.028](a27f6)AMP hardware watchdog's new timeout: 3s` 为例。

-   `[0.028]`：代表此时的时间戳，单位是秒
-   `(a27f6)`：代表此时的硬件 TICK，单位是 TICK，这个 TICK 是延续 BOOT0 的TICK 时间，转换为微秒的公式为  
    $T_{\mu s} = \frac{\text{Tick}}{24}$  
    示例 `a27f6`（十进制 665590 Tick）对应耗时约 27732.91666 μs，也就是 27.73 ms
-   `AMP hardware watchdog's new timeout: 3s`：是此时打印的日志

#### BOOTTIME 记录项

RTOS 在启动过程中自动输出两条关键时间戳，用于量化“从入口到完成基础初始化”的耗时：

-   **Boot time** 记录 RTOS 第一条指令的绝对时间点，示例如下：
    
    -   `[0.028](a1fd2)Boot time: 26482 us` 表示 RTOS 于 26 482 µs 时刻开始执行。
-   **SystemInit Done** 记录 RTOS 基础初始化完成的绝对时间点，并同步给出本次初始化消耗的时长：
    
    -   `[0.028](a2187)SystemInit Done: cost 14 us` 表示初始化过程耗时 14 µs，于 28 ms 时刻结束。

#### 测试注意事项

测量前务必关闭 RTOS 的 UART 日志输出，避免打印开销引入额外抖动（在 115200 波特率下，输出 100 个字符约需 8.7 ms）。可以执行 quick\_config 配置项 `close_rtos_uart_console` 关闭 RTOS 打印

```
quick_config close_rtos_uart_console
```

关闭 RTOS 的 UART 输出后，需要从 Linux 中获取 RTOS 的日志，命令如下：

```
cat /sys/kernel/debug/remoteproc/remoteproc0/aw_trace_log
```

### 关闭 RTOS 耗时测量

时间测量功能会引入额外开销，影响系统性能。不过 RTOS 中的影响较少。完成测量后，可以选择在量产前关闭该功能。执行以下 quick\_config 命令可快速禁用 RTOS 耗时测量：

```
quick_config disable_rtos_time_measure
```

## Kernel 时间测定

Kernel 是 Linux Kernel 主系统，是多核异构架构中的核心。主要负责用户态与内核态的调度、文件系统、网络协议栈、驱动框架及各类子系统的初始化，其启动耗时直接影响整体开机体验。对 Kernel 阶段进行精确测量，可快速定位驱动或子系统初始化瓶颈，为系统级优化提供量化依据。

### Kernel 时间测定配置

Kernel 阶段提供 quick\_config 配置项以启用耗时统计，执行如下命令即可打开测量开关：

```
quick_config enable_kernel_time_measure
```

### KERNEL 耗时分析

#### 时间戳信息

Kernel 通过内核 dmesg（KMSG）机制输出耗时数据。启用 `enable_kernel_time_measure` 后，内核日志中的时间戳由专用硬件定时器统一驱动，与 BOOT0、RTOS 阶段共用同一 24 MHz 时钟源，保证跨核、跨阶段时间基准严格对齐，可直接用于绝对耗时与相对间隔的精确计算。

开启后可以看到这里 Linux 启动时间戳并非从 0 开始计数，而是包含了 BOOT0 阶段的耗时。

:::note

:::note

备注

:::
:::note

第一行的 `Linux version 6.6.0` 的 时间戳 `[ 0.000000]` 为系统 Tick 打印，此时并非从专用硬件定时器获取，第二行的 `[ 0.054240] Machine model: sun252iw1` 耗时则是系统从 BROM 阶段到这行打印打印时的时间戳。为专用硬件定时器提供的计时源。

:::

:::

```
[    0.000000] Linux version 6.6.0-g8f50966d9b63 (runner@runner) (riscv64-unknown-linux-gnu-gcc (Xuantie-900 linux-6.6.0 glibc gcc Toolchain V3.0.2 B-20250410) 14.1.1 20240710, GNU ld (GNU Binutils) 2.42.0.20240618) #7 SMP Fri Jan  9 10:23:58 HKT 2026
[    0.054240] Machine model: sun252iw1
[    0.054440] SBI specification v2.0 detected
[    0.054441] SBI implementation ID=0x1 Version=0x10004
[    0.054442] SBI TIME extension detected
[    0.054442] SBI IPI extension detected
[    0.054443] SBI RFENCE extension detected
[    0.054443] SBI SRST extension detected
......
```

### FASTBOOT 桩点日志

配置同时启用了 FASTBOOT 桩点，其日志示例如下：

```
[    0.052880] [FASTBOOT_STUB]: call sbi_init() cost: 43 (30) us (TS 0x135d8a)
[    0.053744] [FASTBOOT_STUB]: call setup_bootmem() cost: 576 (575) us (TS 0x13ae87)
[    0.053751] [FASTBOOT_STUB]: call paging_init() cost: 1236 (967) us (TS 0x13af31)
[    0.054160] [FASTBOOT_STUB]: call unflatten_device_tree() cost: 9636 (9629) us (TS 0x13d577)
[    0.066102] [FASTBOOT_STUB]: call setup_arch(&command_line) cost: 15392 (15374) us (TS 0x183518)
[    0.069597] [FASTBOOT_STUB]: call timekeeping_init() cost: 15 (8) us (TS 0x197cc0)
[    0.074874] [FASTBOOT_STUB]: call time_init() cost: 5503 (5495) us (TS 0x1b6b7b)
```

以 `[ 0.052880] [FASTBOOT_STUB]: call sbi_init() cost: 43 (30) us (TS 0x135d8a)` 为例：

-   `[ 0.052880]`：内核 dmesg 时间戳，单位秒，从 BROM 阶段起算
-   `[FASTBOOT_STUB]: call sbi_init() cost: 43 (30) us (TS 0x135d8a)`：FASTBOOT 桩点日志
    -   `call sbi_init()`：被测函数名
    -   `43`：函数实际耗时（`sched_clock` 差值，右移 10 位后近似 μs）
    -   `30`：同周期 CPU 运行耗时（`sched_get_runtime` 差值，右移 10 位后近似 μs）
    -   `(TS 0x135d8a)`：函数退出时刻的硬件 TICK 值（24 MHz，与 BOOT0/RTOS 同源）
        -   换算公式：$T_{\mu s} = \frac{\text{Tick}}{24}$
        -   例：`0x135d8a` = 1269130 Tick → 52 880.416 μs ≈ 52.88 ms

可以通过下列命令提取全部桩点日志

```
dmesg | grep -E 'FASTBOOT_STUB'
```

由于内核是线程化的，所以不止使用时间戳获取时间，而是提供接口去测量每个调用的实际耗时，内核默认提供这些接口以供调试使用：

内核提供了以下时间测量宏接口：

**aw\_printf**

**功能描述**：用于打印带有"\[FASTBOOT\_STUB\]:"前缀的内核日志，方便过滤和识别时间测量相关的日志信息。

**参数说明**：

-   `fmt`：格式化字符串，与printf的格式化字符串相同
-   `args...`：可变参数列表，与格式化字符串中的占位符对应

**使用示例**：

```c
aw_printf("Hello world!\n");
aw_printf("The value is %d\n", 42);
```

**输出示例**：

```
[FASTBOOT_STUB]: Hello world!
[FASTBOOT_STUB]: The value is 42
```

**aw\_measure\_time(fn)**

**功能描述**：测量表达式 `fn` 的执行时间，通过 `sched_clock` 获取墙钟时间，`sched_get_runtime` 获取 CPU 实际运行时间，并打印函数名、实际耗时、CPU运行耗时以及结束时刻的硬件 TICK 值。

**参数说明**：

-   `fn`：要测量执行时间的表达式或函数调用

**使用示例**：

```c
aw_measure_time(sbi_init());
aw_measure_time({
    int i;
    for (i = 0; i < 1000000; i++) {
        // 一些耗时操作
    }
});
```

**输出示例**：

```
[FASTBOOT_STUB]: call sbi_init() cost: 43 (30) us (TS 0x135d8a)
[FASTBOOT_STUB]: call { int i; for (i = 0; i < 1000000; i++) { // 一些耗时操作 } } cost: 1234 (1200) us (TS 0x14a3f2)
```

**aw\_measure\_time\_ret(fn, ret\_val)**

**功能描述**：功能与 `aw_measure_time` 类似，但会将表达式 `fn` 的执行结果保存到 `ret_val`变量中，适用于需要获取函数返回值的场景。

**参数说明**：

-   `fn`：要测量执行时间的表达式或函数调用
-   `ret_val`：用于保存表达式x执行结果的变量

**使用示例**：

```c
int ret;
aw_measure_time_ret(setup_bootmem(), ret);

void* ptr;
aw_measure_time_ret(kmalloc(1024, GFP_KERNEL), ptr);
```

**输出示例**：

```
[FASTBOOT_STUB]: call setup_bootmem() cost: 576 (575) us (TS 0x13ae87)
[FASTBOOT_STUB]: call kmalloc(1024, GFP_KERNEL) cost: 12 (8) us (TS 0x13b0c4)
```

**aw\_measure\_time\_name(fn, name)**

**功能描述**：在 `aw_measure_time` 的基础上增加了设备名称参数，用于区分不同设备上执行的相同操作的耗时情况，适用于需要测量多个相似设备的性能时使用。

**参数说明**：

-   `fn`：要测量执行时间的表达式或函数调用
-   `name`：设备名称字符串，用于标识不同的设备

**使用示例**：

```c
aw_measure_time_name(csi_init(), "csi0");
aw_measure_time_name(csi_init(), "csi1");
```

**输出示例**：

```
[FASTBOOT_STUB]: call csi_init() dev csi0 cost: 2345 (2300) us (TS 0x14f2a7)
[FASTBOOT_STUB]: call csi_init() dev csi1 cost: 2456 (2400) us (TS 0x156b3c)
```

**aw\_measure\_initcall\_time(x, fn)**

**功能描述**：专门用于测量初始化调用的执行时间，仅在定义了 `FASTBOOT_PRINT_INITCALL_TIME` 宏时可用。会打印初始化函数的地址、实际耗时、CPU运行耗时以及结束时刻的硬件 TICK 值。

**参数说明**：

-   `x`：要测量执行时间的初始化表达式或函数调用
-   `fn`：初始化函数的地址，用于在日志中显示函数名

**使用示例**：

```c
#ifdef FASTBOOT_PRINT_INITCALL_TIME
aw_measure_initcall_time(platform_driver_register(&my_driver), my_driver_init);
#endif
```

**输出示例**：

```
[FASTBOOT_STUB]: initcall my_driver_init cost: 678 (650) us (TS 0x16a3f2)
```

### 关闭 KERNEL 耗时测量

时间测量功能会引入额外开销，影响系统性能。不过 KERNEL 中的影响较少。完成测量后，如果需要在量产前关闭该功能。执行以下 quick\_config 命令可快速禁用 KERNEL 耗时测量：

```
quick_config disable_kernel_time_measure
```
