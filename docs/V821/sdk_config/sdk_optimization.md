---
sidebar_position: 6
---

# SDK 内存优化

quick\_config 中内置了配置内存优化的功能，可以配置关闭不要的功能降低系统内存占用。

## 配置项目

### 1\. **内核设置**

-   **内核日志缓冲区大小** (`CONFIG_LOG_BUF_SHIFT=15`)：设置内核日志缓冲区的大小为32KB（2^15），减少内存占用。
    
-   **低内存支持** (`CONFIG_AW_BSP_LOWMEM=y`)：启用低内存支持，优化内存资源。
    
-   取消了一些不必要的内核功能，如：
    
    -   **虚拟内存事件计数器** (`CONFIG_VM_EVENT_COUNTERS`)。
    -   **控制组** (`CONFIG_CGROUPS`)。
    -   **符号表** (`CONFIG_KALLSYMS`)：不启用符号表，减少内存消耗。
    -   **SLUB调试** (`CONFIG_SLUB_DEBUG`)：禁用SLUB调试。
    -   **SCSI、ATA、以太网、USB等驱动程序**：禁用不必要的硬件支持。
    -   **加密算法和文件系统支持**：禁用一些不常用的加密算法和文件系统，如 `CONFIG_CRYPTO_DEFLATE`、`CONFIG_UBIFS_FS` 等。
    -   **无线网络供应商驱动**：禁用多个无线网络供应商驱动，如 `WLAN_VENDOR_INTEL`、`WLAN_VENDOR_REALTEK` 等。
    -   **调试功能**：禁用 `CONFIG_DEBUG_MISC`、`CONFIG_SCHED_DEBUG`、`CONFIG_FTRACE` 等调试相关的选项，以节省内存。
    -   **网络文件系统支持**：禁用不常用的网络文件系统，如 `CONFIG_NETWORK_FILESYSTEMS`。
-   **IPv6支持** (`CONFIG_IPV6`)：禁用IPv6支持，节省内存。
    
-   **动态调试** (`CONFIG_DYNAMIC_DEBUG`)：禁用动态调试选项。
    

### 2\. **OpenWRT配置**

-   **SQUASHFS块大小** (`CONFIG_TARGET_SQUASHFS_BLOCK_SIZE=32`)：将SQUASHFS的块大小设置为32字节，这有助于减少文件系统的内存占用。

### 3\. **设备树文件**

-   **SD卡配置** (`sdc0.req-page-count`)：将 `sdc0` 的页面计数设置为1，优化SD卡的内存使用。

### 4\. **总结优化细则**

-   **优化目标**：减少不必要的内核模块和硬件支持，优化内存占用，提升系统性能。
-   **内核配置**：通过禁用不常用的内核功能和驱动程序，减少内核的内存消耗。
-   **文件系统**：调整SQUASHFS块大小，优化存储系统的内存占用。
-   **板载硬件优化**：通过配置SD卡的页面计数，进一步优化内存使用。

## 配置示例

### 配置内存优化

1.  加载 SDK 环境变量 `source build/envsetup.sh && lunch` 选择需要开发的快起板级
2.  执行 `quick_config`，打开 `quick_config` 配置界面
3.  执行 `make distclean` 清除编译数据
4.  选择 `memory_optimization` 条目

Loading asciinema cast...
