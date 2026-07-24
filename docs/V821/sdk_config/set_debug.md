---
sidebar_position: 7
---

# SDK 配置调试功能

quick\_config 中内置了配置调试的功能，方便快速配置开启调试打印。该配置支持常电和快起系统。

-   debug\_linux：配置开启大核调试功能
-   debug\_rtos：配置小核 RTOS 调试功能

## 配置行为

### 常电 debug\_linux 配置行为

1.  BOOT0 开启调试打印
2.  配置内核加入符号表：`CONFIG_KALLSYMS`，`CONFIG_KALLSYMS_ALL`
3.  配置开启 DEBUG\_FS：`CONFIG_DEBUG_FS`
4.  配置开启 SLUB 调试：`CONFIG_SLUB_DEBUG`

### 常电 debug\_rtos 配置行为

1.  关闭大核 `SDC0` 控制器以解决引脚冲突问题
2.  配置小核关闭 `CONFIG_DISABLE_ALL_UART_LOG` 以显示日志
3.  配置小核开启 `CONFIG_UART_MULTI_CONSOLE` 以显示日志
4.  配置小核开启 `CONFIG_UART_MULTI_CONSOLE_AS_MAIN` 以显示日志

### 快起 debug\_linux 配置行为

1.  BOOT0 开启调试打印
2.  配置内核打印等级为 8
3.  配置内核加入符号表：`CONFIG_KALLSYMS`，`CONFIG_KALLSYMS_ALL`
4.  配置开启 DEBUG\_FS：`CONFIG_DEBUG_FS`
5.  配置开启 SLUB 调试：`CONFIG_SLUB_DEBUG`
6.  开启 `AW_SERIAL_EARLYCON` 调试`EARLYCON` 串口

### 快起 debug\_rtos 配置行为

1.  关闭大核 `SDC0` 控制器以解决引脚冲突问题
2.  配置小核关闭 `CONFIG_DISABLE_ALL_UART_LOG` 以显示日志
3.  配置小核开启 `CONFIG_UART_MULTI_CONSOLE` 以显示日志
4.  配置小核开启 `CONFIG_UART_MULTI_CONSOLE_AS_MAIN` 以显示日志

## 配置示例

### debug\_linux

1.  加载 SDK 环境变量 `source build/envsetup.sh && lunch` 选择需要开发的快起板级
2.  执行 `quick_config`，打开 `quick_config` 配置界面
3.  选择 `debug_linux` 条目

Loading asciinema cast...

### debug\_rtos

1.  加载 SDK 环境变量 `source build/envsetup.sh && lunch` 选择需要开发的快起板级
2.  执行 `quick_config`，打开 `quick_config` 配置界面
3.  选择 `debug_rtos` 条目

Loading asciinema cast...
