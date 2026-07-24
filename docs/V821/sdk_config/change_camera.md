---
sidebar_position: 1
---

# SDK 更换摄像头

quick\_config 中内置了摄像头更换的功能，方便快速配置板级摄像头功能。该配置支持常电和快起系统。

:::tip

:::note

提示

:::
:::note

更换摄像头 quick\_config 支持 SDK 任意修改配置，可以任意修改摄像头配置与功能。

:::

:::

## 配置列表

### 常电通用配置

-   支持板级
    -   ipc
    -   perf2
    -   perf2b
    -   perf5
    -   ver
    -   其余第三方常电板级

| quick\_config 条目 | 功能 | 备注 |
| --- | --- | --- |
| one\_gc1084\_sensor | 配置单目 gc1084 摄像头外设 |  |
| one\_gc2083\_sensor | 配置单目 gc2083 摄像头外设 |  |
| one\_gc2083\_sensor(cdr) | 配置单目 gc2083 在线编 | CDR 场景 |
| one\_sc2336\_sensor | 配置单目 sc2336 摄像头外设 |  |
| one\_nvp6158c\_sensor | 配置 nvp6158c 2h 模式 |  |
| one\_sc3336\_sensor(2in1) | 配置单目 sc3336 2in1 模式 |  |
| one\_gc4663\_sensor(2in1) | 配置单目 gc4663 2in1 模式 |  |
| one\_sc530ai\_sensor(2in1) | 配置单目 sc530ai 2in1 模式 |  |
| one\_f37p\_sensor | 配置单目 f37p 摄像头外设 |  |
| one\_imx258(af)\_sensor | 配置单目 imx258(af) 摄像头外设 | 自动对焦 |
| one\_gc2083\_and\_one\_os02g10\_sensor | 配置双目 gc2083 和 os02g10 摄像头外设，mipi 和 dvp |  |
| dual\_gc1084\_sensor | 配置双目 gc1084 摄像头外设 |  |
| dual\_gc2083\_sensor | 配置双目 gc2083 摄像头外设 | sensora: 0x6e, sensorb: 0x7e |
| dual\_gc2083\_sensor(stitch\_mode) | 配置双目 gc2083 摄像头外设 | sensora: 0x6e, sensorb: 0x7e (stitch 模式) |
| three\_gc2083\_sensor(soft\_tdm\_mode) | 配置三目 gc2083 摄像头外设，仅720p | sensora: 0x1e, sensorb: 0x6e, sensorc: 0x7e |
| dual\_sc2336\_sensor | 配置双目 sc2336 摄像头外设 | sensora: 0x60, sensorb: 0x64 |
| one\_imx258\_sensor | 配置单目 imx258(af) 摄像头外设 | 自动对焦 |

### 快起通用配置

-   支持板级
    -   perf2\_fastboot
    -   perf2b\_fastboot

| quick\_config 条目 | 功能 | 备注 |
| --- | --- | --- |
| one\_gc1084\_sensor | 配置单目 gc1084 摄像头外设 |  |
| one\_sc2336\_sensor | 配置单目 sc2336 摄像头外设 |  |
| one\_gc2083\_sensor | 配置单目 gc2083 摄像头外设 |  |
| dual\_gc1084\_sensor | 配置双目 gc1084 摄像头外设 |  |
| dual\_gc2083\_sensor | 配置双目 gc2083 摄像头外设 |  |
| dual\_gc2083\_sensor\_smvs | 配置双目 gc2083 摄像头外设 (tdmonbuf tworx 模式) | 需要 smvs 功能 |
| one\_gc1084\_sensor\_(2in1) | 配置单目 gc1084 2in1 模式 |  |
| one\_gc05a2\_sensor\_(2in1) | 配置单目 gc05a2 2in1 模式 |  |
| one\_gc4663\_sensor(2in1) | 配置单目 gc4663 2in1 模式 |  |

### 快起 AI 眼镜配置

-   支持板级
    -   aiglass

| quick\_config 条目 | 功能 | 备注 |
| --- | --- | --- |
| one\_gc1084\_sensor | 配置单目 gc1084 摄像头外设 |  |
| one\_gc2083\_sensor | 配置单目 gc2083 摄像头外设 |  |
| one\_gc1084\_sensor\_(2in1) | 配置单目 gc1084 2in1 模式 |  |
| one\_gc05a2\_sensor\_(2in1) | 配置单目 gc05a2 2in1 模式 (离线模式) |  |
| one\_imx219\_sensor\_(2in1) | 配置单目 imx219 2in1 模式 (离线模式) | ai\_glasses 专用 |

## 使用示例

### 配置单目 gc2083 摄像头外设

1.  加载 SDK 环境变量 `source build/envsetup.sh && lunch` 选择需要开发的板级
2.  执行 `quick_config`，打开 `quick_config` 配置界面
3.  选择 `one_gc2083_sensor` 条目

Loading asciinema cast...

### 配置快起双目 gc2083 摄像头外设

1.  加载 SDK 环境变量 `source build/envsetup.sh && lunch` 选择需要开发的快起板级
2.  执行 `quick_config`，打开 `quick_config` 配置界面
3.  选择 `dual_gc2083_sensor` 条目

Loading asciinema cast...
