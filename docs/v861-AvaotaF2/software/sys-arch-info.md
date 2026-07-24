---
sidebar_position: 3
---

# SDK 芯片架构配置

## 概述

本文档详细介绍 V861 芯片支持的三种 RISC-V 架构模式，以及如何通过 `quick_config` 工具进行架构切换配置。

V861 基于 RISC-V 指令集架构，支持以下三种架构模式：

| 架构 | 内核指令集 | 内核内存模型 | 用户空间位数 | 指针大小 | Rootfs | 工具链 Quick Config |
| --- | --- | --- | --- | --- | --- | --- |
| rv32 | 32位 | 32 位 SV32 | 32位 | 4字节 | 32位 | musl\_toolchain / glibc\_toolchain |
| rv64 | 64位 | 64 位 SV39 | 64位 | 8字节 | 64位 | musl\_lp64d\_toolchain / glibc\_lp64d\_toolchain |
| rv64ilp32 | 64位 | 32 位 SV32XT | 32位 | 4字节 | 32位 | musl\_toolchain / glibc\_toolchain |

* * *

## RISC-V 架构基础

### RISC-V 指令集简介

RISC-V 是一个开放标准的指令集架构（ISA），具有以下特点：

-   **开源免费**：任何人都可以设计、制造和销售 RISC-V 芯片
-   **模块化设计**：基础指令集 + 可选扩展
-   **可扩展性强**：支持自定义扩展

**基础整数指令集：**

| 指令集 | 描述 | 寄存器宽度 |
| --- | --- | --- |
| RV32I | 32位基础整数指令集 | 32位 |
| RV64I | 64位基础整数指令集 | 64位 |

**常用扩展：**

| 扩展 | 名称 | 描述 |
| --- | --- | --- |
| M | 乘除法扩展 | 提供整数乘法和除法指令 |
| A | 原子操作扩展 | 提供原子内存操作指令 |
| F | 单精度浮点扩展 | 提供单精度浮点运算指令 |
| D | 双精度浮点扩展 | 提供双精度浮点运算指令 |
| C | 压缩指令扩展 | 提供 16位压缩指令，减少代码体积 |
| V | 向量扩展 | 提供向量运算指令 |

V861 支持 RV32IMAFDCV 或 RV64IMAFDCV 指令集。支持 SV32，SV39，SV32XT 三种 mmu 模式。

### ABI 概念

ABI（Application Binary Interface，应用程序二进制接口）定义了程序与系统之间的低级接口规范，包括：

-   **数据类型大小**：int、long、pointer 等类型的位宽
-   **对齐要求**：数据在内存中的对齐方式
-   **调用约定**：函数参数如何传递、返回值如何处理
-   **寄存器使用**：哪些寄存器用于特定目的

不同的 ABI 会影响程序的内存占用和性能表现。

### 数据模型

RISC-V 支持多种数据模型（ABI），主要区别在于 `long` 和 `pointer` 类型的大小：

| 数据类型 | ILP32 | LP64 | LP64D |
| --- | --- | --- | --- |
| int | 32位 | 32位 | 32位 |
| long | 32位 | 64位 | 64位 |
| pointer | 32位 | 64位 | 64位 |
| long long | 64位 | 64位 | 64位 |
| float | 32位 | 32位 | 32位 |
| double | 64位 | 64位 | 64位 |

**ABI 命名规则：**

-   **ILP32**：Int、Long、Pointer 都是 32位
-   **LP64**：Long、Pointer 是 64位，Int 是 32位
-   **LP64D**：在 LP64 基础上，double 参数通过浮点寄存器传递（性能更优）

* * *

## V861 支持的架构模式

### rv32 架构

#### 架构特点

rv32 是传统的 32位架构模式，内核和用户空间都是 32位。

```
┌─────────────────────────────────────┐
│         User Space (32-bit)         │
│                                     │
│   ┌─────────────────────────────┐   │
│   │    Application (ILP32)      │   │
│   │  Pointer: 4B  Address: 32b  │   │
│   └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│        Kernel Space (32-bit)        │
│                                     │
│   ┌─────────────────────────────┐   │
│   │     Linux Kernel (RV32)     │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### 内存布局

-   **地址空间**：4GB（32位寻址）
-   **用户空间**：通常 0 ~ 2.4GB
-   **内核空间**：通常 2.4GB ~ 4GB
-   **指针大小**：4字节

#### 性能特点

| 特性 | 说明 |
| --- | --- |
| 内存占用 | 最低（指针和数据结构最小） |
| 运行速度 | 中等（32位运算） |
| 地址空间 | 有限（最大 4GB） |
| 功耗 | 较低 |

#### 工具链选择

| 工具链 | libc 类型 | 特点 |
| --- | --- | --- |
| musl\_toolchain | musl libc | 轻量级，适合嵌入式 |
| glibc\_toolchain | glibc | 功能完整，兼容性好 |

* * *

### rv64 架构

#### 架构特点

rv64 是完整的 64位架构模式，内核和用户空间都是 64位。

```
┌─────────────────────────────────────┐
│         User Space (64-bit)         │
│                                     │
│   ┌─────────────────────────────┐   │
│   │   Application (LP64/LP64D)  │   │
│   │  Pointer: 8B  Address: 64b  │   │
│   └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│        Kernel Space (64-bit)        │
│                                     │
│   ┌─────────────────────────────┐   │
│   │     Linux Kernel (RV64)     │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### 内存布局

-   **地址空间**：sv39 mmu 39位寻址
-   **用户空间**：通常 0 ~ 256GB
-   **内核空间**：256~512GB
-   **指针大小**：8字节

#### 性能特点

| 特性 | 说明 |
| --- | --- |
| 内存占用 | 较高（指针和数据结构更大） |
| 运行速度 | 高（64位运算，更多寄存器） |
| 地址空间 | 巨大（512GB） |
| 功耗 | 较高 |

#### 工具链选择

| 工具链 | libc 类型 | 特点 |
| --- | --- | --- |
| musl\_lp64d\_toolchain | musl libc | 轻量级 64位工具链 |
| glibc\_lp64d\_toolchain | glibc | 功能完整，默认推荐 |

* * *

### rv64ilp32 架构

#### 什么是 rv64ilp32

rv64ilp32 是一种混合架构模式，采用 **64 位内核 + 32位用户空间** 的设计：

-   **内核**：运行在 RV64ILP32 模式，地址空间2GB
-   **用户空间**：使用 ILP32 ABI，指针为 32位，数据结构紧凑

```
┌─────────────────────────────────────┐
│       User Space (32-bit ABI)       │
│                                     │
│   ┌─────────────────────────────┐   │
│   │    Application (ILP32)      │   │
│   │  Pointer: 4B  Address: 32b  │   │
│   │ Low Memory  High Efficiency │   │
│   └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│            Kernel Space             │
│ (64-bit Inst + 32-bit Memory Model) │
│   ┌─────────────────────────────┐   │
│   │  Linux Kernel (RV64ILP32 )  │   │
│   │   Low Memory    High Perf   │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### 架构原理

rv64ilp32 的核心思想是「分离关注点」：

1.  **内核层面**：
    
    -   运行在 RV64ILP32 模式，支持 RV64 指令集和访存指令
    -   使用 32 位内存模型，地址空间2GB
    -   支持现代内核特性（KASLR、大页、KASAN等）
    -   更好的性能优化能力
2.  **用户空间层面**：
    
    -   使用 ILP32 ABI
    -   指针和 long 类型为 32位
    -   数据结构紧凑，内存占用低
    -   与传统 32 位程序兼容

#### 内存节省原理

指针从 8 字节减少到 4 字节带来的内存节省：

**数据结构示例对比：**

```c
struct Node {
    int value;         // 4字节
    struct Node *next; // rv64: 8字节 | rv64ilp32: 4字节
    void *data;        // rv64: 8字节 | rv64ilp32: 4字节
};
// rv64:       24字节（含对齐填充）
// rv64ilp32:  12字节
// 节省: 50%
```

**内存占用对比：**

同一内核配置，选择不同内核 ABI 下的内核内存占用情况

| 类型 | Memory | kernel code | rwdata | rodata | init | bss | reserved | cma-reserved |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RV32 | 440532K/524288K available | 8733K | 1925K | 2839K | 246K | 316K | 75564K | 8192K |
| RV64 | 435812K/524288K available | 8818K | 2263K | 3304K | 289K | 439K | 80284K | 8192K |
| RV64ILP32 | 440404K/524288K available | 8738K | 1929K | 2951K | 253K | 317K | 75692K | 8192K |

**内存占用分析：**

从上表数据可以看出三种架构的内存占用差异：

1.  **可用内存**：RV32 可用内存最高（440532K），RV64ILP32 次之（440404K），RV64 最低（435812K）。RV64 比 RV32 少约 4.7MB 可用内存，这主要源于 64 位架构的指针和数据结构开销。
    
2.  **内核代码段**：RV64 内核代码最大（8818K），比 RV32（8733K）多约 85K。RV64ILP32（8738K）与 RV32 接近，仅多 5K，说明 RV64ILP32 在代码体积上继承了 32 位架构的紧凑优势。
    
3.  **数据段差异**：
    
    -   **rwdata**：RV64（2263K）比 RV32（1925K）多 338K，增幅约 17.6%。RV64ILP32（1929K）与 RV32 基本持平。
    -   **rodata**：RV64（3304K）比 RV32（2839K）多 465K，增幅约 16.4%。RV64ILP32（2951K）比 RV32 略多 112K。
    -   **bss**：RV64（439K）比 RV32（316K）多 123K，增幅约 39%。RV64ILP32（317K）与 RV32 几乎相同。
4.  **保留内存**：RV64 保留内存（80284K）最大，比 RV32（75564K）多约 4.7MB，主要用于页表等内核数据结构。RV64ILP32（75692K）与 RV32 接近，仅多 128K。
    

**结论**：RV64ILP32 在内存占用上与 RV32 非常接近，相比 RV64 可节省约 4.7MB 内存，同时保留了 64 位内核的性能优势。对于内存资源受限的嵌入式场景，RV64ILP32 是 RV64 的理想替代方案。

#### 与 rv32、rv64 的对比

| 特性 | rv32 | rv64 | rv64ilp32 |
| --- | --- | --- | --- |
| 内核位数 | 32位 | 64位 | 32位 |
| 用户空间位数 | 32位 | 64位 | 32位 ABI |
| 指针大小 | 4字节 | 8字节 | 4字节 |
| 用户空间地址空间 | 4GB | 256TB+ | 2GB |
| 内核地址空间 | 4GB | 256TB+ | 2GB |
| 用户空间内存占用 | 低 | 高 | 低 |
| 内核功能 | 基础 | 完整 | 完整 |
| 性能 | 中等 | 高 | 高（内存效率优） |
| 功耗 | 较低 | 较高 | 中等 |

#### 性能优势

执行 iPerf3 回环测试的性能数据

| 类型 | Iperf3 回环 |
| --- | --- |
| RV32 | 2.20 Gbits/sec |
| RV64 | 2.96 Gbits/sec |
| RV64ILP32 | 2.85 Gbits/sec |

**性能分析：**

从 iPerf3 回环测试数据可以观察到三种架构的网络吞吐性能差异：

1.  **性能排序**：RV64（2.96 Gbits/sec）> RV64ILP32（2.85 Gbits/sec）> RV32（2.20 Gbits/sec）。RV64 性能最优，RV64ILP32 紧随其后，RV32 相对较低。
    
2.  **性能差距**：
    
    -   RV64ILP32 比 RV64 低约 3.7%（0.11 Gbits/sec），差距很小
    -   RV64ILP32 比 RV32 高约 29.5%（0.65 Gbits/sec），优势明显
    -   RV64 比 RV32 高约 34.5%（0.76 Gbits/sec）
3.  **性能成因分析**：
    
    -   **RV64 性能最优**：64 位寄存器和运算单元可处理更大数据块，减少内存访问次数；更丰富的寄存器资源减少栈操作开销。
    -   **RV64ILP32 接近 RV64**：使用 RV64ILP32 内核，使用 64 位指令集但是，继承了 64 位指令集的性能优势；虽然指针为 32 位，但在网络协议处理等计算密集型场景中影响有限。
    -   **RV32 性能较低**：32 位运算宽度限制了数据处理效率，尤其在需要处理 64 位数据（如网络数据包头部、校验和计算）时需要更多指令周期。
4.  **性价比考量**：RV64ILP32 在获得接近 RV64 性能的同时，内存占用与 RV32 相当，实现了性能与资源的良好平衡。对于既需要较高网络吞吐又受限于内存资源的嵌入式应用，RV64ILP32 是最佳选择。
    

rv64ilp32 结合了 rv32 和 rv64 的优点：

1.  **内存效率**：
    
    -   用户空间内存占用与 rv32 相当
    -   更少的内存带宽占用
    -   更好的缓存利用率
2.  **内核性能**：
    
    -   64位内核支持更多优化
    -   更好的内存访存能力
    -   支持现代安全特性（KASLR、严格内存检查等）
3.  **运行效率**：
    
    -   减少内存访问次数
    -   提高缓存命中率
    -   降低 TLB 缺失率

#### 工具链选择

| 工具链 | libc 类型 | 特点 |
| --- | --- | --- |
| musl\_toolchain | musl libc | 轻量级，推荐嵌入式使用 |
| glibc\_toolchain | glibc | 功能完整，兼容性好 |

## 架构切换配置

### quick\_config 工具简介

`quick_config` 是 V861 SDK 提供的快速配置工具，用于切换系统架构和工具链。

**基本语法：**

```bash
quick_config <config_name>
```

**主要功能：**

-   自动处理配置依赖
-   自动设置工具链路径
-   自动同步环境变量
-   自动更新内核和 OpenWRT 配置

### rv32 架构切换

**配置名称：** `system_set_to_rv32i`

**使用方式：**

```bash
# 切换到 rv32 架构
quick_config system_set_to_rv32i
```

**配置详情：**

```json
"system_set_to_rv32i": {
    "desc": "Set system running on rv32i arch",
    "tag": "arch",
    "sync_env": true,
    "check_distclean": true,
    "depends": [
        "musl_toolchain"
    ],
    "configs": {
        "LICHEE_TOOLCHAIN_TAR": "riscv32/xxx.tar.gz"
    }
}
```

**切换流程：**

```
1. Check if cleanup needed (check_distclean)
       │
       ▼
2. Execute dependency config (depends: musl_toolchain)
       │
       ▼
3. Set toolchain path (LICHEE_TOOLCHAIN_TAR)
       │
       ▼
4. Sync environment variables (sync_env)
       │
       ▼
5. Update U-Boot, Kernel, OpenWRT configs
       │
       ▼
6. Done
```

**切换前检查清单：**

-   [ ]  确认已备份重要配置
-   [ ]  确认 SDK 根目录有足够磁盘空间
-   [ ]  如果之前编译过，执行 `make distclean`

### rv64 架构切换

**配置名称：** `system_set_to_rv64i`

**使用方式：**

```bash
# 切换到 rv64 架构
quick_config system_set_to_rv64i
```

**配置详情：**

```json
"system_set_to_rv64i": {
    "desc": "Set system running on rv64i arch",
    "tag": "arch",
    "sync_env": true,
    "check_distclean": true,
    "depends": [
        "glibc_lp64d_toolchain"
    ],
    "configs": {
        "LICHEE_TOOLCHAIN_TAR": "riscv64/xxx.tar.gz"
    }
}
```

**切换流程：** 与 rv32 类似，但使用 64位工具链。

### rv64ilp32 架构切换

**配置名称：** `system_set_to_rv64ilp32`

**使用方式：**

```bash
# 切换到 rv64ilp32 架构
quick_config system_set_to_rv64ilp32
```

**配置详情：**

```json
"system_set_to_rv64ilp32": {
    "desc": "Set system running on rv64ilp32 arch (kernel 64bit, rootfs 32bit)",
    "tag": "arch",
    "sync_env": true,
    "check_distclean": true,
    "depends": [
        "musl_toolchain"
    ],
    "configs": {
        "LICHEE_TOOLCHAIN_TAR": "riscv64ilp32/xxx.tar.gz"
    }
}
```

* * *

## 工具链配置详解

### musl 工具链

**配置名称：** `musl_toolchain`

**特点：**

-   使用 musl libc，轻量级
-   适用于 rv32 和 rv64ilp32 架构
-   占用空间小，启动速度快
-   适合嵌入式和资源受限场景

**适用架构：**

-   rv32（32位用户空间）
-   rv64ilp32（32位用户空间）

### glibc 工具链

**配置名称：** `glibc_toolchain`

**特点：**

-   使用 glibc，功能完整
-   适用于 rv32 架构
-   兼容性最好，支持更多软件
-   占用空间较大

**适用架构：**

-   rv32（32位用户空间）

### musl\_lp64d 工具链

**配置名称：** `musl_lp64d_toolchain`

**特点：**

-   使用 musl libc，64位
-   适用于 rv64 架构
-   LP64D ABI，浮点参数通过浮点寄存器传递
-   性能较好

**适用架构：**

-   rv64（64位用户空间）

### glibc\_lp64d 工具链

**配置名称：** `glibc_lp64d_toolchain`

**特点：**

-   使用 glibc，64位
-   适用于 rv64 架构
-   LP64D ABI，功能完整
-   默认推荐用于 rv64 架构

**适用架构：**

-   rv64（64位用户空间）

### 工具链选择建议

| 架构 | 推荐工具链 | 备选工具链 |
| --- | --- | --- |
| rv32 | musl\_toolchain | glibc\_toolchain |
| rv64 | glibc\_lp64d\_toolchain | musl\_lp64d\_toolchain |
| rv64ilp32 | musl\_toolchain | glibc\_toolchain |

* * *

## 配置联动机制

### 依赖关系 (depends)

`depends` 字段定义了配置之间的依赖关系。执行配置时，会自动先执行依赖的配置。

**示例：**

```json
"system_set_to_rv32i": {
    "depends": [
        "musl_toolchain"
    ]
}
```

**执行顺序：**

```
Execute system_set_to_rv32i
    │
    ├── 1. Check depends
    │       │
    │       └── Found musl_toolchain dependency
    │               │
    │               └── Execute musl_toolchain config
    │
    ├── 2. Execute system_set_to_rv32i main config
    │
    └── 3. Done
```

这会自动设置编译时使用的工具链路径。

### 自动同步环境 (sync\_env)

`sync_env: true` 会自动执行以下操作：

1.  调用 `build.sh autoconfig` 重新配置 OpenWRT 环境
2.  更新环境变量
3.  同步内核配置

* * *

## 使用示例

### 场景 1：从 rv64 切换到 rv32

```bash
# 当前配置：rv64 + glibc_lp64d_toolchain
# 目标配置：rv32 + musl_toolchain

# 步骤 1：清理（如果之前编译过）
make distclean

# 步骤 2：执行切换
quick_config system_set_to_rv32i
```

### 场景 2：从 rv32 切换到 rv64

```bash
# 当前配置：rv32 + musl_toolchain
# 目标配置：rv64 + glibc_lp64d_toolchain

# 步骤 1：清理
make distclean

# 步骤 2：执行切换
quick_config system_set_to_rv64i
```

### 场景 3：切换到 rv64ilp32

```bash
# 当前配置：rv64 + glibc_lp64d_toolchain
# 目标配置：rv64ilp32 + musl_toolchain

# 步骤 1：清理
make distclean

# 步骤 2：执行切换
quick_config system_set_to_rv64ilp32
```

### 场景 4：仅切换工具链

```bash
# 当前配置：rv32 + musl_toolchain
# 目标配置：rv32 + glibc_toolchain（不改变架构）

# 执行切换
quick_config glibc_toolchain

# 输出：
# Set glibc toolchain successful.

# 注意：切换工具链后通常需要重新编译
make distclean
```

* * *

## 常见问题排查

### 切换失败

**问题：执行 quick\_config 时报错**

| 错误信息 | 可能原因 | 解决方案 |
| --- | --- | --- |
| `distclean required` | 之前的编译文件未清理 | 执行 `make distclean` 后重试 |
| `config not found` | 配置名称错误 | 检查配置名称拼写 |
| `dependency failed` | 依赖的配置执行失败 | 检查依赖配置是否正确定义 |

**解决步骤：**

```bash
# 1. 完整清理
make distclean

# 2. 重新执行切换
quick_config <config_name>
```

### 编译错误

**问题：架构切换后编译失败**

| 错误信息 | 可能原因 | 解决方案 |
| --- | --- | --- |
| `toolchain not found` | 工具链路径错误 | 检查 `LICHEE_TOOLCHAIN_TAR` 配置 |
| `ABI mismatch` | 程序与架构不匹配 | 重新编译所有程序 |
| `undefined reference` | 库文件不兼容 | 清理后重新编译 |

**解决步骤：**

```bash
# 1. 检查工具链
source build/envsetup.sh
echo $GCC_PREBUILT

# 2. 完整清理重新编译
make distclean
quick_config <config_name>
mp
```

### 运行时错误

**问题：程序运行异常**

| 错误现象 | 可能原因 | 解决方案 |
| --- | --- | --- |
| 程序崩溃 | ABI 不兼容 | 确保程序使用正确 ABI 编译 |
| 内存不足 | 架构内存布局不同 | 检查内存配置 |
| 性能异常 | 缓存/TLB 配置问题 | 检查内核配置 |

**调试方法：**

```bash
# 检查程序 ABI
file <executable>
# rv32:   ELF 32-bit LSB executable, UCB RISC-V
# rv64:   ELF 64-bit LSB executable, UCB RISC-V
# rv64ilp32: ELF 32-bit LSB executable, UCB RISC-V, RVC, double-float ABI

# 检查动态库
ldd <executable>
```

### 相关资源

-   [RISC-V 官方规范](https://riscv.org/technical/specifications/)
-   [RISC-V ABI 规范](https://github.com/riscv-non-isa/riscv-elf-psabi-doc)
-   [Linux RISC-V 支持](https://wiki.linuxfoundation.org/architecture/riscv)
