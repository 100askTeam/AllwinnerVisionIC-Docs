---
sidebar_position: 8
---

# SDK 修改调试串口波特率

quick\_config 中内置了修改调试串口波特率的功能，可以配置使用 115200 还是 1500000。该配置支持常电和快起系统。

-   config\_debug\_baud\_115200: 配置串口使用 115200
-   config\_debug\_baud\_1500000: 配置串口使用 1500000

:::tip

:::note

提示

:::
:::note

-   SDK 1.2 版本默认使用 1500000 波特率
-   SDK 1.3 支持切换波特率，在 `lunch` 的时候可以选择 `115200` 或者 `1500000`

:::

:::

## 配置示例

### 配置串口使用 115200

1.  加载 SDK 环境变量 `source build/envsetup.sh && lunch` 选择需要开发的快起板级
2.  执行 `quick_config`，打开 `quick_config` 配置界面
3.  选择 `config_debug_baud_115200` 条目

### 配置串口使用 1500000

1.  加载 SDK 环境变量 `source build/envsetup.sh && lunch` 选择需要开发的快起板级
2.  执行 `quick_config`，打开 `quick_config` 配置界面
3.  选择 `config_debug_baud_1500000` 条目
