window.onload = function(){
    var canvas = getElement('canvas')  //获取canvas元素
    var context = canvas.getContext('2d')  //获取画图环境，指明为2d
    var isRunPlayer = null;
    var isrun = false;
    var player = "top";
    var xyNumbers = [[1,1,1,1],[0,0,0,0],[0,0,0,0],[2,2,2,2]];
    var arr = [0,1,2,3];
    //获取双方玩家棋子
    var top_player_ball_collection = [getElement('top_ball_once'),getElement('top_ball_two'),getElement('top_ball_three'),getElement('top_ball_four')];
    var bottom_player_ball_collection = [getElement('bottom_ball_once'),getElement('bottom_ball_two'),getElement('bottom_ball_three'),getElement('bottom_ball_four')];
    var black_result_label = getElement('black_step_number');
    var white_result_label = getElement('white_step_number');
    //绘制游戏界面
    drawGameMap();
    //摆放玩家棋子
    PlayerBallPoint();
    //选中棋子
    bindingClickEvent();
    //移动棋子
    canvas.addEventListener('click',function(e){
        if(isRunPlayer != null){
            //棋子移动的位置
            var x = Math.floor(e.offsetX / 80),
                y = Math.floor(e.offsetY / 80);
            //被选中棋子原先位置
            var player_left_ConvertTo_int = parseInt(isRunPlayer.style.left);
            var player_top_ConvertTo_int = parseInt(isRunPlayer.style.top);
            var player_X = Math.round(player_left_ConvertTo_int / 100) < 0 ? 0 :Math.round(parseInt(player_left_ConvertTo_int) / 100) == -0 ? 0 :Math.round(parseInt(player_left_ConvertTo_int) / 100);
            var player_Y = Math.round(player_top_ConvertTo_int / 100) < 0 ? 0 :Math.round(parseInt(player_top_ConvertTo_int) / 100) == -0 ? 0 :Math.round(parseInt(player_top_ConvertTo_int) / 100);
            //是否可移动
            isrun = isCellEmpty(x,y);
            var canMoveNumber_X = Math.abs(x - player_X);
            var canMoveNumber_Y = Math.abs(y - player_Y);
            if(isrun || (canMoveNumber_X == 0 && canMoveNumber_Y == 0)||(canMoveNumber_X >= 1 && canMoveNumber_Y >= 1) || canMoveNumber_X > 1 || canMoveNumber_Y > 1){
                return;
            }
            //xyNumbers need to change(因为xyNumbers的布局与游戏中的布局方位不同需变动下x与y)
            xyNumbers[player_Y][player_X] = 0;
            if(player == "top")
                xyNumbers[y][x] = 1;
            else{
                xyNumbers[y][x] = 2;
            }
            //移动
            isRunPlayer.style.left = (x * 100) - 20 +'px';
            isRunPlayer.style.top = (y * 100) - 20 +'px';
            if(player == 'top'){
                isRunPlayer.style.backgroundColor = 'black';
                //是否出现击杀
                isPieceKilled(x,y);
                for(var n = 0;n<xyNumbers.length;n++){
                    console.log(xyNumbers[n]);
                }
                console.log('------------------');
                if(bottom_player_ball_collection.length == 1){
                    alert('黑方获胜');
                    for(var i = 0;i<top_player_ball_collection.length;i++){
                        top_player_ball_collection[i].onclick = null;
                    }
                    isRunPlayer = null;
                }else{
                    isRunPlayer = null;
                    player = "bottom";
                }
            }else{
                isRunPlayer.style.backgroundColor = 'white';
                //是否出现击杀
                isPieceKilled(x,y);
                for(var n = 0;n<xyNumbers.length;n++){
                    console.log(xyNumbers[n]);
                }
                console.log('------------------');
                if(top_player_ball_collection.length == 1){
                    alert('白方获胜');
                    for(var i = 0;i<bottom_player_ball_collection.length;i++){
                        bottom_player_ball_collection[i].onclick = null;
                    }
                    isRunPlayer = null;
                }else{
                    isRunPlayer = null;
                    player = "top";
                }
            }
        }else{
            if(bottom_player_ball_collection.length ==1 || top_player_ball_collection.length == 1)
            if(confirm("是否重新开始一局")){
                window.location.reload();
            }
        }
    });
    //移动的位置是否存在棋子
    function isCellEmpty(x,y){
        for(var n = 0;n<xyNumbers.length;n++){
            for(var m = 0;m < xyNumbers[n].length;m++){
                if(xyNumbers[y][x] != 0){
                    return true;
                }
            }
        }
        return false;
    }
    //击杀规则
    function isPieceKilled(x,y){
        //横向纵向(各可构成4中击杀包括双杀的话12种)
        for(var i = 0;i<arr.length;i++){
            //三打一不死子(4种)
            if(i == 0){
                if((xyNumbers[y][i] == 1  && xyNumbers[y][i+1] == 1 && xyNumbers[y][i+2] == 1 && xyNumbers[y][i+3] == 2) ||
                   (xyNumbers[y][i] == 1  && xyNumbers[y][i+1] == 2 && xyNumbers[y][i+2] == 2 && xyNumbers[y][i+3] == 2) ||
                   (xyNumbers[i][x] == 1 && xyNumbers[i+1][x] == 1 && xyNumbers[i+2][x] == 1 && xyNumbers[i+3][x] == 2) ||
                   (xyNumbers[i][x] == 1 && xyNumbers[i+1][x] == 2 && xyNumbers[i+2][x] == 2 && xyNumbers[i+3][x] == 2)){
                       return;
                   }
            }
            //二打二不死子(4种)
            if(i == 0){
                if((xyNumbers[y][i] == 1 && xyNumbers[y][i+1] == 1 && xyNumbers[y][i+2] == 2 && xyNumbers[y][i+3] == 2) ||
                   (xyNumbers[y][i] == 2 && xyNumbers[y][i+1] == 2 && xyNumbers[y][i+2] == 1 && xyNumbers[y][i+3] == 1) ||
                   (xyNumbers[i][x] == 1 && xyNumbers[i+1][x] == 1 && xyNumbers[i+2][x] == 2 && xyNumbers[i+3][x] == 2) ||
                   (xyNumbers[i][x] == 2 && xyNumbers[i+1][x] == 2 && xyNumbers[i+2][x] == 1 && xyNumbers[i+3][x] == 1)){
                        return;
                   }
            }
            //double kill(4种)
            if(i == 0){
                //(横向)
                if((xyNumbers[y][i] == 2  && xyNumbers[y][i+1] == 1 && xyNumbers[y][i+2] == 1 && xyNumbers[y][i+3] == 2) ||
                   (xyNumbers[y][i] == 1  && xyNumbers[y][i+1] == 2 && xyNumbers[y][i+2] == 2 && xyNumbers[y][i+3] == 1)){
                        xyNumbers[y][i] = xyNumbers[y][i+3] = 0;
                        successKill(i,y);
                        successKill(i+3,y);
                }
                //纵向
                if((xyNumbers[i][x] == 2  && xyNumbers[i+1][x] == 1 && xyNumbers[i+2][x] == 1 && xyNumbers[i+3][x] == 2) ||
                   (xyNumbers[i][x] == 1  && xyNumbers[i+1][x] == 2 && xyNumbers[i+2][x] == 2 && xyNumbers[i+3][x] == 1)){
                        xyNumbers[i][x] = xyNumbers[i+3][x] = 0;
                        successKill(x,i);
                        successKill(x,i+3);
                }
            }
            //有尾巴不死子(8种)
            if(i == 0){
                //横向
                if((xyNumbers[y][i] == 1 && xyNumbers[y][i+1] == 1 && xyNumbers[y][i+2] == 2 && xyNumbers[y][i+3] == 1) ||
                   (xyNumbers[y][i] == 1 && xyNumbers[y][i+1] == 2 && xyNumbers[y][i+2] == 1 && xyNumbers[y][i+3] == 1) ||
                   (xyNumbers[y][i] == 2 && xyNumbers[y][i+1] == 2 && xyNumbers[y][i+2] == 1 && xyNumbers[y][i+3] == 2) ||
                   (xyNumbers[y][i] == 2 && xyNumbers[y][i+1] == 1 && xyNumbers[y][i+2] == 2 && xyNumbers[y][i+3] == 2) ||
                   (xyNumbers[i][x] == 1 && xyNumbers[i+1][x] == 1 && xyNumbers[i+2][x] == 2 && xyNumbers[i+3][x] == 1) ||
                   (xyNumbers[i][x] == 1 && xyNumbers[i+1][x] == 2 && xyNumbers[i+2][x] == 1 && xyNumbers[i+3][x] == 1) ||
                   (xyNumbers[i][x] == 2 && xyNumbers[i+1][x] == 2 && xyNumbers[i+2][x] == 1 && xyNumbers[i+3][x] == 2) ||
                   (xyNumbers[i][x] == 2 && xyNumbers[i+1][x] == 1 && xyNumbers[i+2][x] == 2 && xyNumbers[i+3][x] == 2)){
                    return;
                }
            }
            //单个击杀(8种)
            if(i<2){
                //横向
                if((xyNumbers[y][i] == 1 && xyNumbers[y][i+1] == 1 && xyNumbers[y][i+2] == 2 && player == "top") ||
                   (xyNumbers[y][i] == 2 && xyNumbers[y][i+1] == 2 && xyNumbers[y][i+2] == 1 && player == "bottom")){
                        xyNumbers[y][i+2] = 0;
                        successKill(i+2,y);
                }
                //纵向
                if((xyNumbers[i][x] == 1 && xyNumbers[i+1][x] == 1 && xyNumbers[i+2][x] == 2 && player == 'top') ||
                   (xyNumbers[i][x] == 2 && xyNumbers[i+1][x] == 2 && xyNumbers[i+2][x] == 1 && player == 'bottom')){
                        xyNumbers[i+2][x] = 0;
                        successKill(x,i+2);
                   }

            }else{
                //横向
                if((xyNumbers[y][i] == 1 && xyNumbers[y][i-1] == 1 && xyNumbers[y][i-2] == 2 && player == "top") ||
                   (xyNumbers[y][i] == 2 && xyNumbers[y][i-1] == 2 && xyNumbers[y][i-2] == 1 && player == "bottom")){
                        xyNumbers[y][i-2] = 0;
                        successKill(i-2,y);
                }
                //纵向
                if((xyNumbers[i][x] == 1 && xyNumbers[i-1][x] == 1 && xyNumbers[i-2][x] == 2 && player == 'top') ||
                   (xyNumbers[i][x] == 2 && xyNumbers[i-1][x] == 2 && xyNumbers[i-2][x] == 1 && player == 'bottom')){
                        xyNumbers[i-2][x] = 0;
                        successKill(x,i-2);
                   }
            }
        }
    }
    //完成击杀
    function successKill(x,y){
        var elem = passXYGetElement(x,y);
        var index = getIndex(bottom_player_ball_collection,);
        if(player == 'top'){
            bottom_player_ball_collection.splice(index,1);
            elem.remove();
        }else{
            top_player_ball_collection.splice(index,1);
            elem.remove();
        }
    }
    //获取元素索引
    function getIndex(arr,elem){
        var index = arr.some((item,i) =>{
            if(item == elem){
                return i;
            }
        });
        return index;
    }
    //通过xyNumbers的索引值获取元素
    function passXYGetElement(x,y){
        var elem_X = (-20 + (x * 100)) +"px";
        var elem_Y = (-20 + (y * 100)) +"px";
        for(var i = 0; i<top_player_ball_collection.length;i++){
            var top_X = top_player_ball_collection[i].style.left;
            var top_Y = top_player_ball_collection[i].style.top;
            if( top_X == elem_X && top_Y == elem_Y){
                return top_player_ball_collection[i];
            }
        }
        for(var i = 0;i<bottom_player_ball_collection.length;i++){
            var bottom_X = bottom_player_ball_collection[i].style.left;
            var bottom_Y = bottom_player_ball_collection[i].style.top;
            if(bottom_X == elem_X && bottom_Y == elem_Y){
                return bottom_player_ball_collection[i];
            }
        }
    }
    //棋子绑定单击事件
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
    //摆放玩家棋子
    function PlayerBallPoint(){
        for(var x = 0;x<xyNumbers.length;x++){
            for(var y = 0;y<xyNumbers[x].length;y++){
                if(xyNumbers[x][y] == 1){
                    //黑方棋子
                    for(var topIndex = 0;topIndex<top_player_ball_collection.length;topIndex++){
                        top_player_ball_collection[topIndex].style.backgroundColor = "black";
                        top_player_ball_collection[topIndex].style.left = (-20 + (topIndex * 100)) + "px";
                        top_player_ball_collection[topIndex].style.top ="-20px";
                    }
                }else if(xyNumbers[x][y] == 2){
                    //白方棋子
                    for(var bottomIndex = 0;bottomIndex<top_player_ball_collection.length;bottomIndex++){
                        bottom_player_ball_collection[bottomIndex].style.backgroundColor = "white";
                        bottom_player_ball_collection[bottomIndex].style.left = (-20 + (bottomIndex * 100)) +"px";
                        bottom_player_ball_collection[bottomIndex].style.top = "280px";
                    }
                }
            }
        }
    }
    //获取Dom元素
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