window.onload = function(){
    var canvas = document.getElementById('canvas')  //获取canvas元素
    var context = canvas.getContext('2d')  //获取画图环境，指明为2d
    var isRunPlayer = null;
    var isrun = false;
    var player = "bottom";
    var isRunBall = false;
    //获取双方玩家棋子
    var top_player_ball_collection = [getElement('top_ball_once'),getElement('top_ball_two'),getElement('top_ball_three'),getElement('top_ball_four')];
    var bottom_player_ball_collection = [getElement('bottom_ball_once'),getElement('bottom_ball_two'),getElement('bottom_ball_three'),getElement('bottom_ball_four')];
    //绘制游戏界面
    drawGameMap();
    //摆放玩家棋子
    PlayerBallPoint();
    //选中棋子
    bindingClickEvent();
    //移动棋子
    canvas.addEventListener('click',function(e){
        if(isRunPlayer != null){
            var x = Math.floor(e.offsetX / 80),
                y = Math.floor(e.offsetY / 80);
            //获取要移动棋子的left，top
            var isRunPlayer_X = isRunPlayer.style.left;
            var isRunPlayer_Y = isRunPlayer.style.top;
            //转换成数值好判断
            var moveTo_X = getXorYNumber(isRunPlayer_X)
            var moveTo_Y = getXorYNumber(isRunPlayer_Y);
            //获取要移动的棋子与要移动的位置的距离
            var canMoveNumber_X = Math.abs(x - moveTo_X);
            var canMoveNumber_Y = Math.abs(y - moveTo_Y);
            //判断是否可移动
            /* isrun = isExistPiece(x,y); */
            if((canMoveNumber_X == 0 && canMoveNumber_Y == 0)||(canMoveNumber_X >= 1 && canMoveNumber_Y >= 1) || canMoveNumber_X > 1 || canMoveNumber_Y > 1){
                return;
            }
            isRunPlayer.style.left = (x * 100) - 40 +'px';
            isRunPlayer.style.top = (y * 100) - 40 +'px';
            //轮流移动
            if(player == 'top'){
                isRunPlayer.style.backgroundColor = 'black';
                player = "bottom";
                //是否出现吃子的情况
                isEatPiece(top_player_ball_collection,bottom_player_ball_collection,x,y);
                isRunPlayer = null;
            }else{
                isRunPlayer.style.backgroundColor = 'white';
                player = "top";
                isEatPiece(bottom_player_ball_collection,top_player_ball_collection,x,y);
                isRunPlayer = null;
            }
        }
    })
    
    function isExistPiece(x,y){
        for(var i = 0;i<top_player_ball_collection.length;i++){
            var item_X = getXorYNumber(top_player_ball_collection[i].style.left);
            var item_Y = getXorYNumber(top_player_ball_collection[i].style.top);

            if(x == item_X && y == item_Y){
                return true;
            }
        }
        for(var i = 0;i<bottom_player_ball_collection.length;i++){
            var item_X = getXorYNumber(bottom_player_ball_collection[i].style.left);
            var item_Y = getXorYNumber(bottom_player_ball_collection[i].style.top);

            if(x == item_X && y == item_Y){
                return true;
            }
        }
        return false;
    }
    
    function getXorYNumber(str){
        return Math.round(parseInt(str) / 80) < 0 ? 0 :Math.round(parseInt(str) / 80) == -0 ? 0 :Math.round(parseInt(str) / 80);
    }

    //吃子
    function isEatPiece(topArr,bottomArr,x,y){
        for(var topIndex = 0 ;topIndex<topArr.length; topIndex++){
            for(var bottomIndex = 0;bottomIndex < bottomArr.length;bottomIndex++){
                var top_X = getXorYNumber(topArr[topIndex].style.left);
                var top_Y = getXorYNumber(topArr[topIndex].style.top);
                
                var bottom_X = getXorYNumber(bottomArr[bottomIndex].style.left);
                var bottom_Y = getXorYNumber(bottomArr[bottomIndex].style.top);

                //二打二不死子 return
                for(var topCopyIndex = 0;topCopyIndex < topArr.length;topCopyIndex++){
                    if(topIndex != topCopyIndex){
                        var topCopy_X = getXorYNumber(topArr[topCopyIndex].style.left)
                        for(var bottomCopyIndex = 0;bottomCopyIndex < bottomArr.length;bottomCopyIndex++){
                            if(bottomIndex != bottomCopyIndex){
                                var bottomCapy_X = getXorYNumber(bottomArr[bottomCopyIndex].style.left);
                                if(x == top_X &&  x == bottom_X && x == topCopy_X && x == bottomCapy_X){
                                    return;
                                }
                            }
                        }
                    }
                }
                
                /*有空格不死子(吃子匹配规则已包含) */

                //有尾巴，不死子 return

                //双杀 double kill


                //纵向
                if(x == bottom_X && x == top_X){
                    var x_0 = Math.abs(bottom_X - top_X);
                    var x_00 = Math.abs(bottom_X - x);

                    var y_1 = Math.abs(bottom_Y - top_Y);
                    var y_2 = Math.abs(bottom_Y - y);

                    var y_11 = Math.abs(bottom_Y - y);
                    var y_22 = Math.abs(bottom_Y - top_Y);

                    if((x_0 == 0 &&  x_00 == 0 && (y_1 == 1 && y_2 == 2) || (y_22 == 2 && y_11 == 1))){
                        bottomArr[bottomIndex].style.display = 'none';
                        bottomArr.splice(bottomIndex,1);
                    }
                }
                //横向
                if(y == bottom_Y && y == top_Y){
                    if( (Math.abs(bottom_Y - top_Y) == 0 && Math.abs(bottom_Y-y) == 0 
                        &&
                        (Math.abs(bottom_X - top_X) == 1 && Math.abs(bottom_X -x) == 2) ||
                        (Math.abs(bottom_X - top_X) == 2 && Math.abs(bottom_X -x) == 1))
                        ){
                            bottomArr[bottomIndex].style.display = 'none';
                            bottomArr.splice(bottomIndex,1);
                    }
                }
            }
        }
    }
    //二打二
    function twoPkTwo(topArr,bottomArr,x,y,top_X,top_Y,bottom_X,bottom_Y){
        /* for(var topIndex = 0 ;topIndex<topArr.length; topIndex++){
            for(var bottomIndex = 0;bottomIndex < bottomArr.length;bottomIndex++){
                //纵向
                for(var topCopyIndex = 0;topCopyIndex < topArr.length;topCopyIndex++){
                    if(topIndex != topCopyIndex){
                        var topCopy_X = getXorYNumber(topArr[topCopyIndex].style.left)
                        for(var bottomCopyIndex = 0;bottomCopyIndex < bottomArr.length;bottomCopyIndex++){
                            if(bottomIndex != bottomCopyIndex){
                                var bottomCapy_X = getXorYNumber(bottomArr[bottomCopyIndex].style.left);
                                if(x == top_X &&  x == bottom_X && x == topCopy_X && x == bottomCapy_X){
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        } */
        //横向
        /* for(var topCopyIndex = 0;topCopyIndex < topArr.length;topCopyIndex++){
            if(topIndex != topCopyIndex){
                var topCopy_Y = getXorYNumber(topArr[topCopyIndex].style.top)
                for(var bottomCopyIndex = 0;bottomCopyIndex < bottomArr.length;bottomCopyIndex++){
                    if(bottomIndex != bottomCopyIndex){
                        var bottomCapy_Y = getXorYNumber(bottomArr[bottomCopyIndex].style.top);
                        if(x == top_Y &&  x == bottom_Y && x == topCopy_Y && x == bottomCapy_Y){
                            return true;
                        }
                    }
                }
            }
        } */
        return false;
    }
    //棋子绑定事件
    function bindingClickEvent(){
        for(var index = 0;index<top_player_ball_collection.length;index++){
            top_player_ball_collection[index].onclick = function(){
                if(player == 'top'){
                    top_player_ball_collection.some(item =>{
                        item.style.backgroundColor = "black";
                    })
                    isRunPlayer = this;
                    this.style.backgroundColor = "red";
                }else{
                    return;
                }
            }
        }
        for(var index = 0;index<bottom_player_ball_collection.length;index++){
            bottom_player_ball_collection[index].onclick = function(){
                if(player == "bottom"){
                    bottom_player_ball_collection.some(item =>{
                        item.style.backgroundColor = "white";
                    })
                    isRunPlayer = this;
                    this.style.backgroundColor = "red";
                }else{
                    return;
                }
            }
        }
    }
    //玩家棋子起始位置
    function PlayerBallPoint(){
        for(var index = 0;index<top_player_ball_collection.length;index++){
            top_player_ball_collection[index].style.backgroundColor = "black";
            top_player_ball_collection[index].style.left = (-40 + (index * 100)) +"px";
            top_player_ball_collection[index].style.top = "-40px";
            //console.log(top_player_ball_collection[index].style.left+","+top_player_ball_collection[index].style.top)
        }

        for(var index = 0;index<bottom_player_ball_collection.length;index++){
            bottom_player_ball_collection[index].style.backgroundColor = "white";
            bottom_player_ball_collection[index].style.left = (-40 + (index * 100)) +"px";
            bottom_player_ball_collection[index].style.top = "260px";
            //console.log(bottom_player_ball_collection[index].style.left+","+bottom_player_ball_collection[index].style.top)
        }
    }
    
    function getElement(id){
        return document.getElementById(id);
    }
    //绘制游戏界面
    function drawGameMap() {

        context.strokeStyle = '#bfbfbf';
        context.lineWidth = 2;

        // 绘制棋盘
        for(var row = 0;row < 4;row++){
            context.moveTo(0, row*100);
            context.lineTo(300, row*100);
            context.stroke();
        }
        for(var col = 0;col < 4;col++){
            context.beginPath();
            context.moveTo(col*100, 0);
            context.lineTo(col*100, 300);
            context.closePath();
            context.stroke();
        }
    }
}