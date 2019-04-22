# 手势库（Gesture JS） #

----------

## 0x00前言 ##
 Gesture JS是一款事件向的JS库，里面针对鼠标（手指）滑动后的痕迹提取成手势，为页面增加一些快速的操作，如手势（手指）滑动  下 ->右 我们可以提取为返回上一步，这样就可以让前端的交互更加新颖和舒适。顺便一说,**本版本为测试版，请勿在大型项目中应用，具体请等待稳定版。**
## 0x01Guesture开始 ##
开始很简单，将dom绑定进去就可以了。

    var config = {
        isPreventedDefault:true, // 是否阻止默认事件
        samplingSpeed:6 // 采样半径
    }
    var gestureObj = new Gesture(dom, config);

我们可以看到，在使用的时候需要传一个配置项config，这个参数是可选的，其中isPreventedDefault配置是否阻止默认事件，samplingSpeed则是采样半径（也是采样距离频率），这个值越小，采样越多，偏差的噪点越大，这个值越大，采样分辨率越低，适中就可以。
## 0x02GestureJS方法与属性 ##
**==========方法============**

- mergePath ： 路径合并方法
- break ： 销毁绑定方法
- $start ： 移动开始事件
- $move ： 移动中事件
- $end ： 移动结束事件

**==========属性============**

- dom ： 绑定的dom对象
- config ： 配置项
- ansicdata ：手势数据

## 0x03一个简单的Gesture实例 ##

    var gestureObj = new Gesture(dom);
	gestureObj.$end = function (e) {
		var gesPoint = gestureObj.ansicdata.dir8;
		var msg = "";
		gesPoint = gestureObj.mergePath(gesPoint);
		for(var i=0;i<gesPoint.length;i++){
			msg=msg+gesPoint[i]+"  ";
		}
		console.log("您的手势为："+msg);
	}
## 0x04下一代Gesture展望 ##
下一个版本，将会是全新的版本，请期待Gesture2.0吧！
（本版本有问题请告诉我，我们将会让他变得更加稳定，也欢迎大家加入开发行列）

1. 将增加多点触控手势（放大，缩小等）
2. 增加默认手势判别向量组
3. 让他变得更加稳定


----------
# 方法详解 #

----------
## mergePath(路径点合并) ##
该方法是Gesture原型上的方法，用于合并我们得到ansicdata中的dir4和dir8向量组，本身也能对数组中相同的量合并，并且忽略中间的奇点。

mergePath（arr， [freq]）

本身接受两个参数，其中必须传入一个arr数组，freq是奇点判别频率，默认为2，就是相同数少于2个就被列为奇点。

    var arr = [1,1,1,0,1,1,1,2,2,2,2,0,0,2,2];
	Gesture.prototype.mergePath(arr)  //返回[1,2]

## break(销毁创建) ##
该方法用于销毁已绑定的元素，将其解除绑定。请在不用时主动使用该函数解除绑定。

## $start,$move和$end事件 ##
由于该库绑定后代码本身也占用相应的dom事件，为了让用户能够加入相关的事件，提供了一个事件接口，每个函数都会传入两个参数（e, obj），e是代表事件对象，obj则是gesture对象。

    var gestureObj = new Gesture(dom);
	gestureObj.$start = function(e,g){
		console.log(e,g);
	}

## ansicdata手势数据 ##
ansicdata里面包含了point，dir4，dir8。

point是指你手指划过的所有点的集合。

dir4是手指划过的点的四方向数据集合，每个方向的判别都是相对于前一个点。

dir8是手指划过的点的八方向数据集合，每个方向的判别都是相对于前一个点。