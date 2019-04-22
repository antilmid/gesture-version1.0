var Gesture = (function(){
    // ==============辅助函数================================

    //  ⚪取数组最后一位
    function final(arr){
        return arr[arr.length-1];
    }

    //  ⚪是否在半径圆内
    function isInCircle(x,y, dx,dy, r){
        return Math.pow(dx-x,2) + Math.pow(dy-y,2) <= r*r;
    }

    //  ⚪合并数据点并去除奇点
    function mergePath (arr, freq=2) {
        var ret = [];
        var times = 0;
        var len = arr.length;
        var temp = null;
        for(var i = 0;i < len; i++){
            if(temp == arr[i] && temp!=final(ret)){
                times++;
            }else{
                if(times > freq){
                    ret.push(temp);
                }
                times = 1;
            }
            temp = arr[i];
        }
        if(times > freq){
            ret.push(temp);
        }
        return ret;
    }
    // ==============事件函数================================

    //  ⚪移动开始
    var event_start = function (e) {
        var x = (e.targetTouches)?e.targetTouches[0].clientX:e.clientX;
        var y = (e.targetTouches)?e.targetTouches[0].clientY:e.clientY;
        if(this.__gesturedata__.config.isPreventedDefault){
            e.preventDefault();
        }
        this.__gesturedata__.__start__ = true;
        this.__gesturedata__.ansicdata.point = [{x:x, y:y, angle:null, sin:null}];
        this.__gesturedata__.ansicdata.dir4 = [];
        this.__gesturedata__.ansicdata.dir8 = [];
        this.__gesturedata__.$start(e,this.__gesturedata__);
    }

    //  ⚪移动中
    var event_move = function (e) {
        if(this.__gesturedata__.__start__){
            var msg = this.__gesturedata__.ansicdata;
            var x = (e.targetTouches)?e.targetTouches[0].clientX:e.clientX;
            var y = (e.targetTouches)?e.targetTouches[0].clientY:e.clientY;
            var dx = final(msg.point).x;
            var dy = final(msg.point).y;
            // 防抖设计
            if(!isInCircle(x,y,dx,dy,this.__gesturedata__.config.samplingSpeed)){
                var sin = (y-dy) / Math.sqrt( Math.pow(x-dx,2) + Math.pow(y-dy,2) );
                var angle = parseInt(Math.asin(sin)*180/3.14159);
                msg.point.push({x:x,y:y,sin:sin,angle:angle});

                // 八方向判断
                if(angle < 0 && angle >-22.5 || angle >= 0 && angle <22.5  && x - dx > 0){
                    msg.dir8.push("右");
                }
                if(angle <= -22.5 && angle >=-67.5 && x - dx > 0){
                    msg.dir8.push("右上");
                }
                if(angle < -67.5 && angle >=-90){
                    msg.dir8.push("上");
                }
                if(angle <= -22.5 && angle >=-67.5 && x - dx < 0){
                    msg.dir8.push("左上");
                }
                if(angle < 0 && angle >-22.5 || angle >= 0 && angle <22.5  && x - dx < 0){
                    msg.dir8.push("左");
                }
                if(angle <= 67.5 && angle >=22.5 && x - dx < 0){
                    msg.dir8.push("左下");
                }
                if(angle <= 67.5 && angle >=22.5 && x - dx > 0){
                    msg.dir8.push("右下");
                }
                if(angle <= 90 && angle >67.5){
                    msg.dir8.push("下");
                }

                // 四方向判断
                if(angle < -45 && angle >=-90){
                    msg.dir4.push("上");
                }
                if(angle <= 90 && angle >45){
                    msg.dir4.push("下");
                }
                if(angle < 0 && angle >=-45 || angle >= 0 && angle <=45  && x - dx < 0){
                    msg.dir4.push("左");
                }
                if(angle < 0 && angle >=-45 || angle >= 0 && angle <=45  && x - dx > 0){
                    msg.dir4.push("右");
                }
            }
        }
        this.__gesturedata__.$move(e,this.__gesturedata__);
    }

    //  ⚪移动结束
    var event_end = function (e) {
        if(this.__gesturedata__.config.isPreventedDefault){
            e.preventDefault();
        }
        this.__gesturedata__.__start__ = false;
        this.__gesturedata__.$end(e,this.__gesturedata__);
    }

    gesture.prototype.mergePath = mergePath; // 拼合路径
    
    //  ⚪销毁绑定
    gesture.prototype.break = function () {
        this.dom.removeEventListener('mousedown',event_move);
        delete this.dom.__gesturedata__;
        for(var name in that){
            delete that[name];
        }
    }

    //  ⚪手势主函数
    function gesture (dom, config = {
        isPreventedDefault:true, // 是否阻止默认事件
        samplingSpeed:6 // 采样半径
    }){
        this.dom = dom;  // 将被绑的dom放入此处
        this.dom.__gesturedata__ = this; // 将数据放入dom
        this.config = config;
        this.ansicdata = {  // 手势点集合
            point:[],  // 手势点集合
            dir4:[],  // 四方向手势点
            dir8:[] // 八方向手势点
        };
        this.__start__ = false; // 开始开关
        this.$start = function (e, thiss) {} // 移动开始附加函数
        this.$move = function (e, thiss) {} // 移动中附加函数
        this.$end = function (e, thiss) {} // 移动结束附加函数

        dom.addEventListener('mousedown',event_start);
        dom.addEventListener('mousemove',event_move);
        dom.addEventListener('mouseup',event_end);
        dom.addEventListener('touchstart',event_start);
        dom.addEventListener('touchmove',event_move);
        dom.addEventListener('touchend',event_end);
        
    }
    return gesture;


})();