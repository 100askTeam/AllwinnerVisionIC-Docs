---
sidebar_position: 13
---

# SDK 编译工具链

本文档详细介绍 Tina Linux V861 SDK 中各类编译工具链的使用方法，包括工具链路径、编译参数设置以及应用程序、静态库、动态库的编译示例。

## 概述

### V861 架构特点

V861 采用双核异构设计：

| 核心类型 | 架构 | 用途 | 支持模式 |
| --- | --- | --- | --- |
| **C907** | RISC-V 64-bit | 主核，运行 Tina Linux | RV32I / RV64I / RV64ILP32 |
| **E907** | RISC-V 32-bit | 从核，运行 FreeRTOS | RV32IMA |

### 工具链分类

| 类别 | 位置 | 用途 | 目标 |
| --- | --- | --- | --- |
| **Linux 用户态** | `prebuilt/rootfsbuilt/riscv/` | 编译用户态应用和库 | 应用程序、库 |
| **SPL/U-Boot** | `brandy/brandy-2.0/tools/toolchain/` | 编译 bootloader | SPL、U-Boot |
| **RTOS** | `rtos/lichee/rtos/tools/` | 编译 FreeRTOS 固件 | RTOS 应用 |

### SDK 全局 CFLAGS

:::caution

:::note

注意事项

:::
:::note

V861 项目 GCC 为 GCC14，新版本编译器对 C/C++ 语法检查更加严格，对于一些较为重要的 warning 默认直接转化为 error 导致无法编译通过，例如：

-   `-Wimplicit-function-declaration`
-   `-Wint-conversion`
-   `-Wincompatible-pointer-type`

详情请参考：[https://gcc.gnu.org/gcc-14/porting\_to.html#warnings-as-errors](https://gcc.gnu.org/gcc-14/porting_to.html#warnings-as-errors)

:::

:::

Linux 用户态编译推荐使用以下全局编译参数：

```bash
# SDK 全局 CFLAGS
GLOBAL_CFLAGS="\
    -Wno-implicit-function-declaration \
    -Wno-int-conversion \
    -D_LARGEFILE64_SOURCE \
    -D__USE_TIME_BITS64 \
    -D_FILE_OFFSET_BITS=64 \
    -funwind-tables \
    -Wno-unused-but-set-variable \
    -Wno-unused-variable \
    -Wno-unused-function \
    -Wno-unused-label \
    -Wno-unused-const-variable \
    -Wno-comment \
    -Wno-unused-value \
    -pipe"
```

**参数说明**：

| 参数 | 说明 |
| --- | --- |
| `-Wno-implicit-function-declaration` | 禁止隐式函数声明警告 |
| `-Wno-int-conversion` | 禁止整数转换警告 |
| `-D_LARGEFILE64_SOURCE` | 启用大文件支持 (64-bit) |
| `-D__USE_TIME_BITS64` | 使用 64 位时间类型 |
| `-D_FILE_OFFSET_BITS=64` | 文件偏移量使用 64 位 |
| `-funwind-tables` | 生成异常展开表，便于调试 |
| `-Wno-unused-*` | 禁止各类未使用警告 |
| `-Wno-comment` | 禁止注释警告 |
| `-pipe` | 使用管道替代临时文件，加快编译速度 |

### ABI 与架构对应关系

| ABI | 数据模型 | 寄存器宽度 | 适用场景 | 备注 |
| --- | --- | --- | --- | --- |
| `ilp32` | 32-bit | x32 | 32位系统调用 |  |
| `ilp32d` | 32-bit | x32 + 硬浮点 | RV32 标准用户态 | （SDK默认） |
| `lp64` | 64-bit | x64 | 64位系统调用 |  |
| `lp64d` | 64-bit | x64 + 硬浮点 | RV64 标准用户态 |  |

* * *

## Linux 用户态工具链

### 工具链列表

| 名称 | 架构 | C库 | GCC版本 | 工具链前缀 | CPU 配置 | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| musl32 | RV32 ilp32d | musl | 14.3.0 | `riscv32-unknown-linux-musl-` | `-mcpu=c907fdv-rv32` | （SDK默认） |
| glibc32 | RV32 ilp32d | glibc | 14.3.0 | `riscv64-unknown-linux-gnu-` | `-mcpu=c907fdv-rv32` |  |
| musl64 | RV64 lp64d | musl | 14.3.0 | `riscv64-unknown-linux-musl-` | `-mcpu=c907fdv` |  |
| glibc64 | RV64 lp64d | glibc | 14.3.0 | `riscv64-unknown-linux-gnu-` | `-mcpu=c907fdv` |  |

:::tip

:::note

提示

:::
:::note

-   glibc32 模式下，虽然工具链前缀是 `riscv64-unknown-linux-gnu-`，但通过 `-mcpu=c907fdv-rv32` 参数编译出 32 位代码。
    
-   玄铁 GNU 编译器从 V2.6.0 版本开始，编译器支持 `-mcpu=<CPU 型号 >` 选择与 CPU 相关的所有特性。包括 `-mabi`，`-march`，`-mtune` 的指定，同时兼容分别指定 `-march`、`-mabi` 和 `-mtune` 的方式。推荐使用 `-mcpu` 选项。
    

:::

:::

**mcpu 与 mabi，march，mtune 对照表**

| mcpu | mabi | march | mtune |
| --- | --- | --- | --- |
| `-mcpu=c907fdv-rv32` | `ilp32d` | `rv32imafdcv_zicbom_zicbop_zicboz_zicntr_zicond_zicsr_zifencei_zihintntl_zihintpause_zihpm_zawrs_zfa_zfbfmin_zfh_zca_zcb_zcd_zcf_zba_zbb_zbc_zbs_zvfbfmin_zvfbfwma_zvfh_sscofpmf_sstc_svinval_svnapot_svpbmt_xtheadc_xtheadvdot` | `c907` |
| `-mcpu=c907fdv` | `lp64d` | `rv64imafdcv_zicbom_zicbop_zicboz_zicntr_zicond_zicsr_zifencei_zihintntl_zihintpause_zihpm_zawrs_zfa_zfbfmin_zfh_zca_zcb_zcd_zba_zbb_zbc_zbs_zvfbfmin_zvfbfwma_zvfh_sscofpmf_sstc_svinval_svnapot_svpbmt_xtheadc_xtheadvdot` | `c907` |

### musl32 工具链

**路径**: `prebuilt/rootfsbuilt/riscv/Xuantie-900-gcc-linux-6.6.36-musl32-x86_64-V3.3.0`

**特点**: 使用 musl C 库，生成更小的可执行文件，适合嵌入式场景。

#### 环境设置

```bash
# 设置工具链路径
TOOLCHAIN=prebuilt/rootfsbuilt/riscv/Xuantie-900-gcc-linux-6.6.36-musl32-x86_64-V3.3.0
export PATH=$TOOLCHAIN/bin:$PATH
CROSS=riscv32-unknown-linux-musl-
```

#### 编译应用程序

```bash
# 创建测试文件
cat > test.c << 'EOF'
#include <stdio.h>
int main() {
    printf("Hello V861 musl32!\n");
    return 0;
}
EOF

# 编译
${CROSS}gcc -o test test.c \
    -mcpu=c907fdv-rv32 \
    -Os

# 验证
${CROSS}readelf -h test | grep -E "Class|Machine"
# 输出: Class:                             ELF32
#       Machine:                           RISC-V
```

#### 编译静态库

```bash
# 创建库源文件
cat > libtest.c << 'EOF'
int add(int a, int b) {
    return a + b;
}
int multiply(int a, int b) {
    return a * b;
}
EOF

# 编译为目标文件
${CROSS}gcc -c libtest.c -o libtest.o \
    -mcpu=c907fdv-rv32 \
    -Os

# 创建静态库
${CROSS}ar rcs libtest.a libtest.o

# 验证
${CROSS}ar -t libtest.a
# 输出: libtest.o
```

#### 编译动态库

```bash
# 编译为动态库
${CROSS}gcc -shared libtest.c -o libtest.so \
    -mcpu=c907fdv-rv32 \
    -Os

# 验证
${CROSS}readelf -d libtest.so | grep NEEDED
${CROSS}file libtest.so
# 输出: libtest.so: ELF 32-bit LSB shared object, UCB RISC-V, RVC, double-float ABI
```

#### 静态链接应用

```bash
# 静态链接（适用于无动态库的极简环境）
${CROSS}gcc -o test_static test.c \
    -mcpu=c907fdv-rv32 \
    -static \
    -Os
```

### glibc32 工具链

**路径**: `prebuilt/rootfsbuilt/riscv/Xuantie-900-gcc-linux-6.6.36-glibc-x86_64-V3.3.0`

**特点**: 使用 RV64 工具链配合 `-march=rv32` 参数编译 32 位代码，使用 glibc C 库。

#### 环境设置

```bash
TOOLCHAIN=prebuilt/rootfsbuilt/riscv/Xuantie-900-gcc-linux-6.6.36-glibc-x86_64-V3.3.0
export PATH=$TOOLCHAIN/bin:$PATH
CROSS=riscv64-unknown-linux-gnu-
```

#### 编译应用程序（32位模式）

```bash
# 编译 RV32 应用
${CROSS}gcc -o test test.c \
    -mcpu=c907fdv-rv32 \
    -Os

# 注意：需要指定正确的库路径
# 库文件位于 sysroot/lib32xthead/ilp32d/
```

#### 编译静态库

```bash
${CROSS}gcc -c libtest.c -o libtest.o \
    -mcpu=c907fdv-rv32 \
    -Os

${CROSS}ar rcs libtest.a libtest.o
```

#### 编译动态库

```bash
${CROSS}gcc -shared libtest.c -o libtest.so \
    -mcpu=c907fdv-rv32 \
    -Os
```

#### 使用 sysroot

```bash
# 指定 sysroot 路径
SYSROOT=$TOOLCHAIN/sysroot

${CROSS}gcc -o test test.c \
    --sysroot=$SYSROOT \
    -mcpu=c907fdv-rv32 \
    -Os
```

### musl64 工具链

**路径**: `prebuilt/rootfsbuilt/riscv/Xuantie-900-gcc-linux-6.6.36-musl64-x86_64-V3.3.0`

**特点**: 64 位 musl 工具链，适合需要更大地址空间的场景。

#### 环境设置

```bash
TOOLCHAIN=prebuilt/rootfsbuilt/riscv/Xuantie-900-gcc-linux-6.6.36-musl64-x86_64-V3.3.0
export PATH=$TOOLCHAIN/bin:$PATH
CROSS=riscv64-unknown-linux-musl-
```

#### 编译应用程序

```bash
${CROSS}gcc -o test test.c \
    -mcpu=c907fdv \
    -Os

# 验证
${CROSS}readelf -h test | grep -E "Class|Machine"
# 输出: Class:                             ELF64
#       Machine:                           RISC-V
```

#### 编译静态库

```bash
${CROSS}gcc -c libtest.c -o libtest.o \
    -mcpu=c907fdv \
    -Os

${CROSS}ar rcs libtest.a libtest.o
```

#### 编译动态库

```bash
${CROSS}gcc -shared libtest.c -o libtest.so \
    -mcpu=c907fdv \
    -Os
```

### glibc64 工具链

**路径**: `prebuilt/rootfsbuilt/riscv/Xuantie-900-gcc-linux-6.6.36-glibc-x86_64-V3.3.0`

**特点**: 完整的 64 位 glibc 工具链，兼容性最好，适合需要标准 Linux 功能的场景。

#### 环境设置

```bash
TOOLCHAIN=prebuilt/rootfsbuilt/riscv/Xuantie-900-gcc-linux-6.6.36-glibc-x86_64-V3.3.0
export PATH=$TOOLCHAIN/bin:$PATH
CROSS=riscv64-unknown-linux-gnu-
```

#### 编译应用程序

```bash
${CROSS}gcc -o test test.c \
    -mcpu=c907fdv \
    -Os
```

#### 编译 C++ 应用

```bash
cat > test.cpp << 'EOF'
#include <iostream>
int main() {
    std::cout << "Hello V861 C++!" << std::endl;
    return 0;
}
EOF

${CROSS}g++ -o test_cpp test.cpp \
    -mcpu=c907fdv \
    -Os
```

#### 编译 OpenMP 并行程序

```bash
cat > parallel.c << 'EOF'
#include <stdio.h>
#include <omp.h>
int main() {
    #pragma omp parallel
    {
        printf("Thread %d\n", omp_get_thread_num());
    }
    return 0;
}
EOF

${CROSS}gcc -o parallel parallel.c \
    -mcpu=c907fdv \
    -fopenmp \
    -Os
```

## Linux 内核态工具链

### 工具链信息

| 属性 | RV64/RV32 | RV64ILP32（实验性） |
| --- | --- | --- |
| 压缩包路径 | `prebuilt/kernelbuilt/riscv32/Xuantie-900-gcc-linux-6.6.36-glibc-x86_64-V3.3.0-20260204.tar.gz` | `prebuilt/kernelbuilt/riscv64ilp32/riscv64-elf-ubuntu-20.04-gcc-nightly-2025.08.18-nightly.tar.gz` |
| 自解压路径 | `out/toolchain/Xuantie-900-gcc-linux-6.6.36-glibc-x86_64-V3.3.0-20260204` | `out/toolchain/riscv64-elf-ubuntu-20.04-gcc-nightly-2025.08.18-nightly` |
| GCC 版本 | 14.3.0 | 13.2.0 |
| 前缀 | `riscv64-unknown-elf-` | `riscv64-unknown-elf-` |
| 目标 | 内核（裸机） | 内核（裸机） |
| C 库 | 内核自提供，不使用工具链 C 库 | 内核自提供，不使用工具链 C 库，工具链不提供 C 库 |

## RTOS 工具链

### 工具链信息

| 属性 | 值 |
| --- | --- |
| 路径 | `rtos/lichee/rtos/tools/Xuantie-900-gcc-elf-newlib-x86_64-V2.10.1` |
| GCC 版本 | 10.4.0 |
| 前缀 | `riscv64-unknown-linux-gnu-` |
| 目标 | 裸机/RTOS (bare-metal) |
| C 库 | newlib (嵌入式 C 库) |

### 编译参数

RTOS 针对 E907 核心的编译参数：

```bash
-mcmodel=medany \
-mabi=ilp32 \
-march=rv32imafcxthead \
-mno-relax
```

### RTOS 编译示例

#### 环境设置

```bash
TOOLCHAIN=rtos/lichee/rtos/tools/Xuantie-900-gcc-elf-newlib-x86_64-V2.10.1
export PATH=$TOOLCHAIN/bin:$PATH
CROSS=riscv64-unknown-elf-
```

#### 编译裸机应用程序

```bash
# 创建测试文件
cat > rtos_app.c << 'EOF'
#include <stdio.h>

int main(void) {
    printf("Hello E907 RTOS!\n");
    return 0;
}
EOF

# 编译为 ELF
${CROSS}gcc -o rtos_app.elf rtos_app.c \
    -nostartfiles \
    --specs=nano.specs \
    -march=rv32imafcxthead \
    -mabi=ilp32 \
    -mtune=e907 \
    -mcmodel=medlow \
    -fsingle-precision-constant \
    -Os

# 生成二进制文件
${CROSS}objcopy -O binary rtos_app.elf rtos_app.bin
```

#### 编译静态库

```bash
cat > rtos_lib.c << 'EOF'
int rtos_add(int a, int b) {
    return a + b;
}

void rtos_delay(int cycles) {
    for (volatile int i = 0; i < cycles; i++);
}
EOF

# 编译
${CROSS}gcc -c rtos_lib.c -o rtos_lib.o \
    -march=rv32imafcxthead \
    -mabi=ilp32 \
    -mtune=e907 \
    -Os

# 创建库
${CROSS}ar rcs librtos.a rtos_lib.o
```

#### 编译可链接目标文件

```bash
${CROSS}gcc -c rtos_module.c -o rtos_module.o \
    -march=rv32imafcxthead \
    -mabi=ilp32 \
    -mtune=e907 \
    -ffunction-sections \
    -fdata-sections \
    -Os
```

#### 使用链接脚本

```bash
# 使用自定义链接脚本
${CROSS}gcc -o rtos_app.elf \
    start.o rtos_app.o \
    -T link.ld \
    -march=rv32imafcxthead \
    -mabi=ilp32 \
    -mtune=e907 \
    -nostartfiles \
    --specs=nano.specs \
    -Wl,--gc-sections \
    -Os
```

### 完整 RTOS 编译

```bash
# 编译 RTOS 固件
mrtos
```

* * *

## RV64ILP32 特殊模式

### 概述

RV64ILP32 是一种特殊的 ABI 模式：

-   **内核**: 64 位 (RV64)
-   **用户态**: 32 位数据模型 (ILP32)
-   **优点**: 更小的内存占用，同时保持 64 位地址空间

:::danger

:::note

危险

:::
:::note

RV64ILP32 目前并未正式量产支持，为实验性功能。

:::

:::

### 工具链配置

根据 `quick_config.json` 中的配置：

```json
{
    "LICHEE_ARCH": "riscv64ilp32",
    "LICHEE_COMPILER_TAR": "riscv64ilp32/riscv64-elf-ubuntu-20.04-gcc-nightly-2025.08.18-nightly.tar.gz"
}
```

### 编译参数

**内核参数**：

```bash
CONFIG_ARCH_RV64ILP32=y
CONFIG_32BIT=y
CONFIG_MMU_SV32=y
```

**用户态编译**：

```bash
# 使用 32 位 ABI 编译
-march=rv64imafdcv
-mabi=ilp32d  # 注意：使用 ilp32d 而非 lp64d
```

### 启用 RV64ILP32

```bash
# 使用 quick_config 切换
quick_config system_set_to_rv64ilp32_musl

# 或使用 glibc
quick_config system_set_to_rv64ilp32_glibc
```

* * *

## 工具链切换方法

### 使用 quick\_config 命令

SDK 提供 `quick_config` 工具快速切换工具链配置：

#### C 库切换

```bash
# 切换到 musl (32位)
quick_config musl_toolchain

# 切换到 glibc (32位)
quick_config glibc_toolchain

# 切换到 musl 64位
quick_config musl_lp64d_toolchain

# 切换到 glibc 64位
quick_config glibc_lp64d_toolchain
```

#### 架构切换

```bash
# 切换到 RV32I + musl
quick_config system_set_to_rv32i_musl

# 切换到 RV32I + glibc
quick_config system_set_to_rv32i_glibc

# 切换到 RV64I + musl
quick_config system_set_to_rv64i_musl

# 切换到 RV64I + glibc
quick_config system_set_to_rv64i_glibc

# 切换到 RV64ILP32 + musl
quick_config system_set_to_rv64ilp32_musl

# 切换到 RV64ILP32 + glibc
quick_config system_set_to_rv64ilp32_glibc
```

### 配置片段文件

工具链配置片段位于 `openwrt/target/v861/v861-common/configs/`：

| 文件 | 说明 |
| --- | --- |
| `musl_defconfig.fragment` | musl 32位工具链 |
| `glibc_defconfig.fragment` | glibc 32位工具链 |
| `musl_lp64d_defconfig.fragment` | musl 64位工具链 |
| `glibc_lp64d_defconfig.fragment` | glibc 64位工具链 |

### 手动配置

#### 修改 BoardConfig.mk

```bash
# 编辑板级配置
vim device/config/chips/v861/configs/<board>/BoardConfig.mk
```

关键配置项：

```makefile
# 架构
LICHEE_ARCH=riscv32

# 编译内核的工具链
LICHEE_COMPILER_TAR=riscv32/Xuantie-900-gcc-linux-6.6.36-glibc-x86_64-V3.3.0-20260204.tar.gz

# OpenSBI（仅 RV64I 需要）
LICHEE_OPENSBI_BIN_NAME=opensbi_sun252iw1p1_lp64d
```

### 切换后重新编译

```bash
# 清理包
quick_config musl_toolchain

# 重新初始化环境
source build/envsetup.sh
lunch

# 完整重新编译
make -j32
```

* * *

## 常见问题与调试

### 验证工具链

```bash
# 查看工具链版本
riscv32-unknown-linux-musl-gcc --version

# 查看默认编译选项
riscv32-unknown-linux-musl-gcc -v

# 查看支持的架构
riscv32-unknown-linux-musl-gcc --target-help
```

### 验证可执行文件

```bash
# 查看文件类型
file test
# ELF 32-bit LSB executable, UCB RISC-V, RVC, double-float ABI

# 查看架构信息
readelf -h test

# 查看依赖库
readelf -d test | grep NEEDED

# 查看符号表
nm test
```

### 常见错误

#### ABI 不匹配

```
error: incompatible ABI
```

**解决方案**: 确保 `-march` 和 `-mabi` 参数匹配：

| march | mabi |
| --- | --- |
| rv32imafdcv | ilp32d |
| rv64imafdcv | lp64d |
| rv32imac | ilp32 |

#### 找不到库文件

```
cannot find -lc
```

**解决方案**: 指定 sysroot 或库路径：

```bash
${CROSS}gcc --sysroot=$TOOLCHAIN/sysroot ...
# 或
-L$TOOLCHAIN/sysroot/lib32xthead/ilp32d
```

#### 硬件浮点不匹配

```
error: soft-float ABI
```

**解决方案**: 使用正确的浮点 ABI：

```bash
# 硬浮点 (推荐)
-mabi=ilp32d  # RV32
-mabi=lp64d   # RV64

# 软浮点
-mabi=ilp32   # RV32
-mabi=lp64    # RV64
```

### 性能优化

#### 优化等级

```bash
# 体积优化 (推荐嵌入式)
-Os

# 速度优化
-O2
-O3

# 调试
-O0 -g
```

#### CPU 特定优化

```bash
# C907 优化
-mcpu=c907fdv      # RV64
-mcpu=c907fdv-rv32 # RV32

# E907 优化
-mtune=e907
```

### 调试技巧

#### 生成调试信息

```bash
${CROSS}gcc -g -O0 -o test_debug test.c
${CROSS}gdb test_debug
```

#### 反汇编

```bash
${CROSS}objdump -d test
${CROSS}objdump -S test.c  # 混合源码
```

#### 查看段大小

```bash
${CROSS}size test
# 输出:
#    text    data     bss     dec     hex filename
#    1234     456      78    1768     6e8 test
```

* * *

## 附录 A: 工具链路径快速参考

### Linux 用户态工具链

```
prebuilt/rootfsbuilt/riscv/
├── Xuantie-900-gcc-linux-6.6.36-musl32-x86_64-V3.3.0/    # musl 32位
├── Xuantie-900-gcc-linux-6.6.36-musl64-x86_64-V3.3.0/    # musl 64位
└── Xuantie-900-gcc-linux-6.6.36-glibc-x86_64-V3.3.0/     # glibc (32/64位)
```

### SPL/U-Boot 工具链

```
brandy/brandy-2.0/tools/toolchain/
├── Xuantie-900-gcc-linux-5.10.4-glibc-x86_64-V2.8.1/      # E907 U-boot
└── Xuantie-900-gcc-linux-6.6.0-glibc-x86_64-V2.10.0-rc5-20240319/ # C907 U-Boot
```

### RTOS 工具链

```
rtos/lichee/rtos/tools/
└── Xuantie-900-gcc-elf-newlib-x86_64-V2.10.1/            # 主用
```

* * *

## 附录 B: march 参数详解

### 完整 march 字符串（RV32I/RV64I）

```
rv32imafdcv_zicbom_zicbop_zicboz_zicond_zihintntl_zihintpause_zawrs_zfa_zfbfmin_zfh_zba_zbb_zbc_zbs_zvfbfmin_zvfbfwma_svinval_svnapot_svpbmt_xtheadc_xtheadvdot
```

### 扩展说明

| 扩展 | 说明 |
| --- | --- |
| `i` | 基础整数指令集 |
| `m` | 乘除法扩展 |
| `a` | 原子操作扩展 |
| `f` | 单精度浮点 |
| `d` | 双精度浮点 |
| `c` | 压缩指令 |
| `v` | 向量扩展 |
| `zicbom` | Cache block management |
| `zicbop` | Cache block prefetch |
| `zicboz` | Cache block zero |
| `zicond` | Conditional operations |
| `zawrs` | Wait on reservation set |
| `zfa` | Float additional |
| `zfh` | Half-precision float |
| `zba/zbb/zbc/zbs` | Bit manipulation |
| `xtheadc` | T-Head condmov 扩展 |
| `xtheadvdot` | T-Head 向量点积扩展 |
