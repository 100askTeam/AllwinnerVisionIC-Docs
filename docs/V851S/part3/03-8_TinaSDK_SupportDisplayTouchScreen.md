---
sidebar_position: 7
---
# 测试屏幕
## 测试显示部分

终端下执行如下命令，可以看到屏幕花屏并显示色条
``` bash
cat /dev/urandom > /dev/fb0
echo 8 > /sys/class/disp/disp/attr/colorbar
```
终端输入 lv_g2d_test 可以看到屏幕显示lvgl默认的测试界面
``` bash
root@TinaLinux:/# lv_g2d_test
```

## 测试触摸屏
终端下执行 `cat /proc/bus/input/handlers` 可以看到当前支持的输入设备，找到 Name="fts_ts" 得到 Handlers=event0 之后执行 cat /dev/input/event0 手指触摸即可看到数据反馈
``` bash
root@TinaLinux:/# cat /proc/bus/input/handlers
N: Number=0 Name=kbd
N: Number=1 Name=evdev Minor=64
root@TinaLinux:/# cat /proc/bus/input/devices
I: Bus=0018 Vendor=0000 Product=0000 Version=0000
N: Name="fts_ts"
P: Phys=
S: Sysfs=/devices/platform/soc/twi2/i2c-2/2-0038/input/input0
U: Uniq=
H: Handlers=event0
B: PROP=2
B: EV=b
B: KEY=400 0 0 0 0 0 0 0 0 0 0
B: ABS=6618000 0

I: Bus=0019 Vendor=0001 Product=0001 Version=0100
N: Name="sunxi-gpadc0"
P: Phys=sunxigpadc0/input0
S: Sysfs=/devices/virtual/input/input1
U: Uniq=
H: Handlers=kbd event1
B: PROP=0
B: EV=100003
B: KEY=800 c0040 0 0 10000000

root@TinaLinux:/# cat /dev/input/event0

```


