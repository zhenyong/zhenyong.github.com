---
title: learning-every-error-report-lib
tags:
---

## [badjs-report](https://github.com/BetterJS/badjs-report)

- error.stack

	+ 错误栈有可能没包括最近的错误，所以检查 stack 有没当前的错误	（error.toString），如果没有就要把错误信息加到错误栈
	+ 把 at 换成 @
	+ 截取最多九层错误
	+ url中 去掉查询字符串

- 抽样

	简单通过比较 Math.random 随机数与给定值的大小，相当于按设置比例抽样，简单粗暴

- 重复

	把完整的发送信息作key，如果超过指定次数则不上报该信息

- 缓冲合并

	指定时间内的错误批量上传

- 可以指定上报的等级

......
> 有种看不下去的感觉

## Raven

- Script error

同源策略访问 外部 js 引发 "Script error."，且错误受保护不可读
	
	+ /^Script error\.?$/);
	+ (/^Javascript error: Script error\.? on line 0$/);


