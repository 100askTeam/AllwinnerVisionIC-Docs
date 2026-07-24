---
sidebar_position: 1
---

# MallocMonitor 使用指南

## 概述

MallocMonitor 是一个运行时内存调试工具，用于检测 C/C++ 程序中的内存泄漏和缓冲区溢出问题。它无需修改源代码即可透明运行。

### 主要特性

| 特性 | 说明 |
| --- | --- |
| 内存泄漏检测 | 跟踪所有内存分配，识别未释放的内存 |
| 缓冲区溢出检测 | 检测内存写入越界违规 |
| 调用栈记录 | 在分配时捕获调用栈，便于调试定位 |
| 零代码修改 | 通过链接器符号包装实现，无需修改源码 |
| C/C++ 支持 | 完全兼容 C 和 C++ 程序 |

### 源码位置

```
platform/allwinner/eyesee-mpp/middleware/{chip}/MallocMonitor
```

* * *

## 技术原理

### GCC 符号包装机制

MallocMonitor 利用 GCC 的 `--wrap` 链接器特性来拦截内存分配函数。该机制在链接阶段将标准内存函数替换为包装版本：

```
+------------------+         +------------------+         +------------------+
|   Application    |         |    Linker        |         |   MallocMonitor  |
|                  |         |   --wrap flag    |         |                  |
|  malloc()  ----->|-------->|  Redirects to -->|-------->|  __wrap_malloc() |
|  free()    ----->|         |  __wrap_xxx() -->|-------->|  __wrap_free()   |
|  realloc() ----->|         |                  |         |  __wrap_realloc()|
|  calloc()  ----->|         +------------------+         +------------------+
+------------------+
```

### 整体架构图

```
                           MallocMonitor Architecture
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                          Application Layer                             │  │
│  │                                                                        │  │
│  │   malloc() ──┐                                                         │  │
│  │   free()   ──┼──► Standard Memory API Calls                            │  │
│  │   realloc() ─┤                                                         │  │
│  │   calloc() ──┘                                                         │  │
│  └────────────────────────────────┬───────────────────────────────────────┘  │
│                                   │                                          │
│                                   ▼                                          │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                         MallocMonitor Layer                            │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐ │  │
│  │  │  __wrap_malloc  │  │   __wrap_free   │  │  __wrap_realloc/calloc  │ │  │
│  │  └────────┬────────┘  └────────┬────────┘  └───────────┬─────────────┘ │  │
│  │           │                    │                       │               │  │
│  │           ▼                    ▼                       ▼               │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │  │                      Memory Tracking List                       │   │  │
│  │  │  ┌───────────┐    ┌───────────┐    ┌───────────┐                │   │  │
│  │  │  │ Node 1    │───►│ Node 2    │───►│ Node N    │                │   │  │
│  │  │  │ • address │    │ • address │    │ • address │                │   │  │
│  │  │  │ • size    │    │ • size    │    │ • size    │                │   │  │
│  │  │  │ • callstack│   │ • callstack│   │ • callstack│               │   │  │
│  │  │  └───────────┘    └───────────┘    └───────────┘                │   │  │
│  │  └─────────────────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                   │                                          │
│                                   ▼                                          │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                            System Layer                                │  │
│  │                    Real malloc/free Implementation                     │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 内存分配流程

```
                    Memory Allocation Flow
                           │
                           ▼
              ┌─────────────────────────┐
              │  Application calls      │
              │  malloc(size)           │
              └───────────┬─────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │  __wrap_malloc()        │
              │  intercepts the call    │
              └───────────┬─────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
   ┌────────────┐  ┌────────────┐  ┌────────────────┐
   │ Call real  │  │ Capture    │  │ Create tracking│
   │ malloc()   │  │ call stack │  │ node           │
   └────────────┘  └────────────┘  └───────┬────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │ Store in tracking list: │
                              │  • Memory address       │
                              │  • Allocation size      │
                              │  • Call stack trace     │
                              └───────────┬─────────────┘
                                          │
                                          ▼
                              ┌─────────────────────────┐
                              │ Return pointer to       │
                              │ application             │
                              └─────────────────────────┘
```

### 内存释放流程

```
                Memory Deallocation Flow
                           │
                           ▼
              ┌─────────────────────────┐
              │  Application calls      │
              │  free(ptr)              │
              └───────────┬─────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │  __wrap_free()          │
              │  intercepts the call    │
              └───────────┬─────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
   ┌────────────┐  ┌────────────────┐  ┌────────────┐
   │ Find node  │  │ Check for      │  │ Report     │
   │ in list    │  │ buffer overflow│  │ if overflow│
   └────────────┘  └────────────────┘  └────────────┘
          │
          ▼
   ┌────────────────────┐
   │ Remove tracking    │
   │ node from list     │
   └─────────┬──────────┘
             │
             ▼
   ┌────────────────────┐
   │ Call real free()   │
   └────────────────────┘
```

* * *

## API 参考

### 函数概览

| 函数 | 说明 |
| --- | --- |
| `ShowMallocStatistics()` | 打印内存总体统计信息 |
| `ShowUnreleasedMemoryInfo()` | 查看并打印当前未释放内存的信息，包括分配时的调用栈 |
| `CheckMemoryOverflow()` | 查看当前存在内存写越界的内存节点信息 |
| `StartOverflowReportThread()` | 启动检测线程，周期性检查溢出 |
| `StopOverflowReportThread()` | 关闭检测线程 |

### 详细 API 说明

#### 1\. ShowMallocStatistics()

```c
void ShowMallocStatistics(void);
```

**功能**：打印内存分配统计摘要，包括总分配次数、释放次数和当前内存使用情况。

**使用示例**：

```c
// 在程序任意位置检查内存统计
ShowMallocStatistics();
```

#### 2\. ShowUnreleasedMemoryInfo()

```c
void ShowUnreleasedMemoryInfo(void);
```

**功能**：列出所有已分配但未释放的内存块，显示每个内存块的地址、大小和分配时的完整调用栈。

**使用示例**：

```c
// 程序退出或检查点时调用
ShowUnreleasedMemoryInfo();
```

#### 3\. CheckMemoryOverflow()

```c
void CheckMemoryOverflow(void);
```

**功能**：扫描所有跟踪的内存块，检测缓冲区溢出违规。发现溢出时报告内存地址、大小和分配调用栈。

**使用示例**：

```c
// 周期性检查溢出
CheckMemoryOverflow();
```

#### 4\. StartOverflowReportThread()

```c
int StartOverflowReportThread(int nIntervalMs);
```

**功能**：启动后台线程，自动周期性检查内存溢出。

**参数**：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `nIntervalMs` | int | 检查间隔，单位毫秒 |

**返回值**：成功返回 `0`，失败返回非零值

**使用示例**：

```c
// 每 5 秒检查一次溢出
StartOverflowReportThread(5000);
```

#### 5\. StopOverflowReportThread()

```c
int StopOverflowReportThread(void);
```

**功能**：停止后台溢出检查线程。

**返回值**：成功返回 `0`，失败返回非零值

* * *

## 集成指南

### 集成流程图

```
                     Integration Workflow
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌───────────────┐                      ┌───────────────┐
│ Step 1        │                      │ Step 2        │
│ Compile       │                      │ Configure     │
│ MallocMonitor │                      │ App Linker    │
│ Module        │                      │ Flags         │
└───────┬───────┘                      └───────┬───────┘
        │                                      │
        ▼                                      ▼
┌───────────────────────────────────────────────────────┐
│ Step 3                                                │
│ Enable MallocMonitor in Application Code              │
└───────────────────────────┬───────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────┐
│ Step 4                                                │
│ Build and Run Application                             │
└───────────────────────────┬───────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────┐
│ Step 5                                                │
│ Analyze Memory Reports at Exit                        │
└───────────────────────────────────────────────────────┘
```

### 示例：tina-v821 sample\_demux2adec2ao

本节以 tina-v821 平台的 `sample_demux2adec2ao` 为例演示集成过程。

#### 步骤 1：编译 MallocMonitor 模块

编辑构建配置文件：

**文件**：`platform/allwinner/eyesee-mpp/middleware/sun300iw1/tina.mk`

**修改内容**：

```makefile
# 修改前（被注释）：
#   make -C MallocMonitor -f tina.mk all

# 修改后（取消注释）：
    make -C MallocMonitor -f tina.mk all
```

#### 步骤 2：配置应用程序链接参数

**文件**：`platform/allwinner/eyesee-mpp/middleware/sun300iw1/sample/tina.mk`

**修改 1**：链接 MallocMonitor 库

```makefile
# 修改前（被注释）：
#LOCAL_STATIC_LIBS += libMallocMonitor

# 修改后（取消注释）：
LOCAL_STATIC_LIBS += libMallocMonitor
```

**修改 2**：启用符号包装

```makefile
# 修改前（被注释）：
#LOCAL_LDFLAGS += -Wl,--wrap=malloc -Wl,--wrap=free -Wl,--wrap=realloc \
#                 -Wl,--wrap=calloc -Wl,--wrap=reallocarray \
#                 -Wl,--wrap=strdup -Wl,--wrap=strndup

# 修改后（取消注释）：
LOCAL_LDFLAGS += -Wl,--wrap=malloc -Wl,--wrap=free -Wl,--wrap=realloc \
                 -Wl,--wrap=calloc -Wl,--wrap=reallocarray \
                 -Wl,--wrap=strdup -Wl,--wrap=strndup
```

#### 步骤 3：在源码中启用 MallocMonitor

**文件**：`sample_demux2adec2ao.c`

**修改内容**：

```c
// 修改前（被注释）：
//#define ENABLE_MALLOC_MONITOR

// 修改后（取消注释）：
#define ENABLE_MALLOC_MONITOR
```

#### 步骤 4：编译并运行

```bash
# 编译应用程序
mkmpp

# 在目标设备上运行
./sample_demux2adec2ao
```

#### 步骤 5：分析输出

应用程序退出时，MallocMonitor 会自动打印内存泄漏信息。

* * *

## 调用栈分析

### 理解输出格式

检测到内存泄漏时，MallocMonitor 输出详细的调用栈信息：

```
backtrace for unreleased mem[139](0xb7cae090,20)
[ 0]-> PC 0x001a1770: (+0x001a1770) from [./sample_demux2adec2ao]
[ 1]-> PC 0x001a0a42: (+0x001a0a42) from [./sample_demux2adec2ao]
[ 2]-> PC 0x00163d3e: (+0x00163d3e) from [./sample_demux2adec2ao]
[ 3]-> PC 0x00160b9c: (+0x00160b9c) from [./sample_demux2adec2ao]
[ 4]-> PC 0x00080802: (+0x00080802) from [./sample_demux2adec2ao]
[ 5]-> PC 0x00083216: (+0x00083216) from [./sample_demux2adec2ao]
[ 6]-> PC 0x0007f05c: (+0x0007f05c) from [./sample_demux2adec2ao]
[ 7]-> PC 0x0001c4ec: (+0x0001c4ec) from [./sample_demux2adec2ao]
[ 8]-> PC 0xb7f4958c: (+0x0001858c) from [/lib/ld-musl-riscv32.so.1]
```

### 输出解读

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  backtrace for unreleased mem[139](0xb7cae090,20)                           │
│                         │         │          │                              │
│                         │         │          └── Alloc size: 20 bytes       │
│                         │         └── Memory address: 0xb7cae090            │
│                         └── Memory block index: 139                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  [ 0]-> PC 0x001a1770: (+0x001a1770) from [./sample_demux2adec2ao]          │
│         │               │                   │                               │
│         │               │                   └── Source: executable/library  │
│         │               └── Offset address (use with addr2line)             │
│         └── Runtime address                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

| 字段 | 说明 | 用途 |
| --- | --- | --- |
| `mem[139]` | 跟踪链表中的内存块索引 | 供参考 |
| `0xb7cae090` | 运行时内存地址 | 用于调试 |
| `20` | 分配大小（字节） | 识别分配用途 |
| `PC 0x001a1770` | 运行时程序计数器 | 不能直接使用 |
| `(+0x001a1770)` | **相对于二进制基址的偏移** | **配合 addr2line 使用** |
| `[./sample_demux2adec2ao]` | 二进制文件/库名称 | addr2line 中指定 |

### 使用 addr2line 定位源码

`addr2line` 工具将地址转换为源文件位置：

```
       addr2line Workflow
                │
                ▼
┌─────────────────────────────────┐
│  1. Extract offset address      │
│     from MallocMonitor output   │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  2. Run addr2line command:      │
│     addr2line -e <binary> <addr>│
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  3. Get source file and line    │
│     number from output          │
└─────────────────────────────────┘
```

**交叉编译版 addr2line 位置**：

```
prebuilt/rootfsbuilt/riscv/nds32le-linux-musl-v5d/bin/riscv32-linux-musl-addr2line
```

**使用示例**：

```bash
riscv32-linux-musl-addr2line -e ./sample_demux2adec2ao 0x001a1770
```

* * *

## 调试符号配置

### 问题：缺少源码行号信息

如果没有调试符号（未加 `-g` 编译选项），addr2line 无法解析精确的源码位置：

```
无调试符号时的输出：
─────────────────────────────
CdxAllocFromUTF8
??:?
__stringSetTo8
StringContainer.c:?
__id3GetAlbumArt
Id3Base.c:?
```

`??:?` 或 `文件名:?` 表示缺少调试信息。

### 解决方法：启用调试符号

通过 menuconfig 启用调试符号：

```bash
m menuconfig
# 选择: CONFIG_DEBUG=y
```

这会添加 `-g3` 编译选项，包含完整的符号表。

### 结果：完整的源码信息

启用调试符号后，addr2line 提供完整信息：

```
有调试符号时的输出：
─────────────────────────────────────────────────────────────────────────────
CdxAllocFromUTF8
/platform/allwinner/eyesee-mpp/middleware/sun300iw1/media/LIBRARY/libdemuxer/libcore/parser/base/id3base/CdxUtfCode.c:159
__stringSetTo8
/platform/allwinner/eyesee-mpp/middleware/sun300iw1/media/LIBRARY/libdemuxer/libcore/parser/base/id3base/StringContainer.c:32
__id3GetAlbumArt
/platform/allwinner/eyesee-mpp/middleware/sun300iw1/media/LIBRARY/libdemuxer/libcore/parser/base/id3base/Id3Base.c:945
Id3BaseExtraAlbumPic
/platform/allwinner/eyesee-mpp/middleware/sun300iw1/media/LIBRARY/libdemuxer/libcore/parser/base/id3base/Id3Base.c:1129
__Id3v2ParserGetMediaInfo
/platform/allwinner/eyesee-mpp/middleware/sun300iw1/media/LIBRARY/libdemuxer/libcore/parser/id3v2/CdxId3v2Parser.c:199
_Z13aw_demux_openP16CedarXDemuxerAPIP13CdxMediaInfoSP14CdxDataSourceS
/platform/allwinner/eyesee-mpp/middleware/sun300iw1/media/LIBRARY/libdemux/../../../media/LIBRARY/libdemuxer/libcore/parser/include/CdxParser.h:656
DemuxOpenParserLib
/platform/allwinner/eyesee-mpp/middleware/sun300iw1/media/component/Demux_Component.c:647
DemuxPreparePorts
/platform/allwinner/eyesee-mpp/middleware/sun300iw1/media/component/Demux_Component.c:1097
AW_MPI_DEMUX_CreateChn
/platform/allwinner/eyesee-mpp/middleware/sun300iw1/media/mpi_demux.c:314 (discriminator 3)
createDemuxChn
/platform/allwinner/eyesee-mpp/middleware/sun300iw1/sample/sample_demux2adec2ao/sample_demux2adec2ao.c:349
```

* * *

## 内存泄漏排查实例

### 排查流程

```
Memory Leak Debugging Flow
              │
              ▼
┌────────────────────────────────┐
│  1. Enable MallocMonitor and   │
│     run application            │
└────────────────┬───────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│  2. Check exit report for      │
│     unreleased memory info     │
└────────────────┬───────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│  3. Extract offset addresses   │
│     from call stack output     │
└────────────────┬───────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│  4. Use addr2line to resolve   │
│     source code locations      │
└────────────────┬───────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│  5. Analyze source code to     │
│     find missing free() calls  │
└────────────────┬───────────────┘
                 │
                 ▼
┌────────────────────────────────┐
│  6. Add proper free() calls    │
│     to fix memory leak         │
└────────────────────────────────┘
```

### 实际案例

从调用栈分析中，我们定位到泄漏源：

**文件**：`Id3Base.c` 第 1129 行

**问题代码**：

```c
// 第 1129 行: 分配了内存但未释放
StringCtn* text = GenerateStringContainer();

// ... 处理代码 ...

// 缺少: EraseStringContainer(&text);
```

**修复后代码**：

```c
// 第 1129 行: 分配内存
StringCtn* text = GenerateStringContainer();

// ... 处理代码 ...

// 在函数末尾添加正确的清理代码
EraseStringContainer(&text);
```

### 注意事项

分析内存泄漏报告时：

1.  **全局单例**：有些内存块是故意永不释放的（如配置缓存、单例对象）。这些在进程退出时由系统释放，不属于真正的泄漏。
    
2.  **误报过滤**：在调查潜在泄漏前，先过滤掉已知的故意分配。
    
3.  **模式识别**：相似的调用栈通常指向同一泄漏源，有助于优先修复。
    

* * *

## 快速参考

### 集成检查清单

```
□ 步骤 1: 在 tina.mk 中取消注释 MallocMonitor 编译项
□ 步骤 2: 在 LOCAL_STATIC_LIBS 中添加 libMallocMonitor
□ 步骤 3: 在 LOCAL_LDFLAGS 中添加 --wrap 标志
□ 步骤 4: 在源码中定义 ENABLE_MALLOC_MONITOR
□ 步骤 5: 启用 CONFIG_DEBUG=y 获取符号信息
□ 步骤 6: 编译并运行应用程序
□ 步骤 7: 使用 addr2line 分析输出
```

### 常用链接器标志

| 标志 | 作用 |
| --- | --- |
| `-Wl,--wrap=malloc` | 包装 malloc 函数 |
| `-Wl,--wrap=free` | 包装 free 函数 |
| `-Wl,--wrap=realloc` | 包装 realloc 函数 |
| `-Wl,--wrap=calloc` | 包装 calloc 函数 |
| `-Wl,--wrap=reallocarray` | 包装 reallocarray 函数 |
| `-Wl,--wrap=strdup` | 包装 strdup 函数 |
| `-Wl,--wrap=strndup` | 包装 strndup 函数 |

### addr2line 常用命令

```bash
# 解析单个地址
riscv32-linux-musl-addr2line -e ./your_app 0x001a1770
# 解析并显示函数名
riscv32-linux-musl-addr2line -f -e ./your_app 0x001a1770
# 解析多个地址
riscv32-linux-musl-addr2line -e ./your_app 0x001a1770 0x001a0a42 0x00163d3e
```

* * *

## 常见问题

### 问题排查

| 问题 | 原因 | 解决方法 |
| --- | --- | --- |
| 无调用栈输出 | 缺少调试符号 | 启用 `CONFIG_DEBUG=y` |
| 输出显示 `??:?` | 编译时未加 `-g` 选项 | 使用调试符号重新编译 |
| 误报内存泄漏 | 全局单例分配 | 过滤已知的故意分配 |
| 地址解析失败 | 使用了错误的二进制文件 | 确保 addr2line 使用正确的二进制文件 |
| 符号缺失 | 二进制文件已被 strip | 使用未 strip 的版本进行调试 |
