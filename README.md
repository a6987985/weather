# 天气APP

基于Vue的天气移动端网页

模仿自 安卓APP Pure天气

* 模仿自安卓APP*Pure*天气 的移动端网页
* 利用*Vue.js*的数据驱动概念配合*Element ui*进行构建
* 利用*Canvas*根据获取数据进行对日出日落过程进行绘制
* 城市列表在LocalStorage中保存，每次开启读取并添加本地数据，显示设定过默认的城市
* 利用*axios*从API获取天气数据并且对添加城市存在性的判断
* 输入框下拉菜单的候选城市的显示利用了*lodash*的延时功能，降低了不必要的Ajax请求频率，

>API：和风天气

[demo地址](http://a6987985.github.io/weather/weather.html)
