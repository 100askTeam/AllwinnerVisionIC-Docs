---
sidebar_position: 1
---

# SDK 编译工具链

V821 是双核异构系统。一个是主核心RISC-V CPU，运行Tina Linux系统，为芯片主系统；一个是RISC-V MCU，运行FreeRTOS系统，主要功能是提供通用算力补充、辅助 Linux 实现休眠唤醒、低功耗管理以及WIFI相关功能。

虽然两个核心都属于 RISC-V 架构，但是由于核心具体配置不同，所以在使用过程中需要完全不同的两套工具链，SDK 中包括：

-   RISC-V CPU 使用的工具链压缩包
    -   BOOT0，U-Boot 使用的：`brandy/brandy-2.0/tools/toolchain/nds32le-linux-glibc-v5d.tar.xz`
    -   Linux 内核编译使用的：`prebuilt/kernelbuilt/riscv32/nds32le-linux-glibc-v5d.txz`
    -   ROOTFS 用户态应用程序使用的：
        -   GLIBC 工具链：`prebuilt/kernelbuilt/riscv32/nds32le-linux-glibc-v5d.txz`
        -   MUSL 工具链：`prebuilt/rootfsbuilt/riscv/nds32le-linux-musl-v5d.tar.xz`

:::tip

:::note

提示

:::
:::note

默认 SDK 配置 ROOTFS 使用 MUSL 工具链以减小固件大小，可以通过 `quick_config glibc_toolchain` 命令切换到 GLIBC 工具链

:::

:::

-   RISC-V MCU 使用的工具链压缩包
    -   BOOT0，U-Boot 使用的：`brandy/brandy-2.0/tools/toolchain/Xuantie-900-gcc-linux-5.10.4-glibc-x86_64-V2.8.1.tar.xz`
    -   RTOS 使用的：`rtos/lichee/rtos/tools/Xuantie-900-gcc-elf-newlib-x86_64-V2.10.1.tar.gz`

## RISC-V CPU 工具链

### 工具链编译参数

RISC-V CPU 工具链编译架构参数如下：

```bash
-mabi=ilp32d -march=rv32imafdcxandes -mcmodel=medlow
```

默认 SDK 用户态编译参数如下：

```bash
-mabi=ilp32d -march=rv32imafdcxandes -mcmodel=medlow -D_GNU_SOURCE \
    -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64 -funwind-tables \
    -Wno-unused-but-set-variable -Wno-unused-variable \
    -Wno-unused-function -Wno-unused-label -Wno-unused-const-variable \
    -Wno-comment -Wno-unused-value -std=c++11 -fno-rtti \
    -Wl,-rpath=/usr/lib -Os
```

#### 编译 c 文件为可执行文件

```bash
{toolchain}-gcc test.c -o test -mabi=ilp32d -march=rv32imafdcxandes -mcmodel=medlow
```

-   在命令中，添加了 `-mabi=ilp32d -march=rv32imafdcxandes -mcmodel=medlow` 选项，以指定编译时使用特定的处理器架构。

#### 编译 c 文件为动态库文件（使用 `gcc` 命令）

```bash
{toolchain}-gcc -shared -Wl,-soname,test.so test.c -o test.so -Wl,-melf32lriscv \
    -mabi=ilp32d -march=rv32imafdcxandes -mcmodel=medlow
```

-   命令中添加了 `-Wl,-melf32lriscv` 选项来指定目标文件格式为 `elf32` 格式。
-   同时添加了 `-mabi=ilp32d -march=rv32imafdcxandes -mcmodel=medlow` 选项来指定编译时使用特定的处理器架构。

#### 编译 c 文件为动态库文件（使用 `ld` 命令）

```bash
{toolchain}-ld -shared test.c -o test.so -melf32lriscv
```

-   命令中添加了 `-melf32lriscv` 选项来指定目标文件格式为 `elf32` 格式。

#### 编译 c 文件为静态库文件

```bash
{toolchain}-gcc test.c -o test.o -mabi=ilp32d -march=rv32imafdcxandes -mcmodel=medlow
{toolchain}-ar rv test.a test.o
```

-   在命令中，添加了 `-mabi=ilp32d -march=rv32imafdcxandes -mcmodel=medlow` 选项，以指定编译时使用特定的处理器架构。

## RISC-V MCU 工具链

### 工具链编译参数

RISC-V MCU 工具链编译架构参数如下：

```bash
-mtune=e907 -march=rv32imafcxthead -mabi=ilp32f -mcmodel=medlow
```

默认 SDK RTOS 编译参数如下：

```bash
-MMD -MP -g -Os -mtune=e907 -march=rv32imafcxthead -mabi=ilp32f -mcmodel=medlow \
    -fsingle-precision-constant -nostartfiles --specs=nano.specs -Wl,--gc-sections \
    -Wl,--whole-archive -Wl,--no-whole-archive
```
