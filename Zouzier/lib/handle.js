window.onload = function(){
    var canvas = getElement('canvas')  //获取canvas元素
    var context = canvas.getContext('2d')  //获取画图环境，指明为2d
    var isRunPlayer = '';
    var black_result_label = getElement('black_step_number');
    var white_result_label = getElement('white_step_number');
    var black_step_number = 0,white_step_number = 0;
    var isrun = false;
    var player = "top";
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
            isrun = isCellEmpty(x,y);
            if(isrun || (canMoveNumber_X == 0 && canMoveNumber_Y == 0)||(canMoveNumber_X >= 1 && canMoveNumber_Y >= 1) || canMoveNumber_X > 1 || canMoveNumber_Y > 1){
                return;
            }
            //移动到指定位置
            isRunPlayer.style.left = (x * 100) - 20 +'px';
            isRunPlayer.style.top = (y * 100) - 20 +'px';
            //轮流移动
            if(player == 'top'){
                black_result_label.innerText = "黑方步数："+(++black_step_number);
                isRunPlayer.style.backgroundColor = 'black';
                //是否出现吃子的情况
                isPieceKilled(top_player_ball_collection,bottom_player_ball_collection,x,y);
                if(bottom_player_ball_collection.length == 1){
                    alert('黑方获胜');
                    for(var i = 0;i<top_player_ball_collection.length;i++){
                        top_player_ball_collection[i].onclick = null;
                    }
                    isRunPlayer = null;
                }else{
                    isRunPlayer = '';
                    player = "bottom";
                }
            }else{
                white_result_label.innerText = "白方步数："+(++white_step_number);
                isRunPlayer.style.backgroundColor = 'white';
                isPieceKilled(bottom_player_ball_collection,top_player_ball_collection,x,y);
                if(top_player_ball_collection.length == 1){
                    alert('白方获胜');
                    for(var i = 0;i<bottom_player_ball_collection.length;i++){
                        bottom_player_ball_collection[i].onclick = null;
                    }
                    isRunPlayer = null;
                }else{
                    isRunPlayer = '';
                    player = "top";
                }
            }
        }else{
            if(confirm("是否重新开始一局")){
                window.location.reload();
            }
        }
    })

    function isCellEmpty(x,y){
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
        var result =  Math.round(parseInt(str) / 100) < 0 ? 0 :Math.round(parseInt(str) / 100) == -0 ? 0 :Math.round(parseInt(str) / 100);
        return result;
    }
    //吃子规则
    function isPieceKilled(attackArr,DefenseArr,x,y){ 
        var isEmpty = false;
        //攻击方
        for(var attackIndex = 0 ;attackIndex<attackArr.length; attackIndex++){
            var attack_X = getXorYNumber(attackArr[attackIndex].style.left);
            var attack_Y = getXorYNumber(attackArr[attackIndex].style.top);
            //防守方
            for(var DefenseIndex = 0;DefenseIndex < DefenseArr.length;DefenseIndex++){
                var Defense_X = getXorYNumber(DefenseArr[DefenseIndex].style.left);
                var Defense_Y = getXorYNumber(DefenseArr[DefenseIndex].style.top);
                //二打二不死子 return
                for(var attackCopyIndex = 0;attackCopyIndex < attackArr.length;attackCopyIndex++){
                    if(attackIndex != attackCopyIndex){
                        var attackCopy_X = getXorYNumber(attackArr[attackCopyIndex].style.left)
                        for(var DefenseCopyIndex = 0;DefenseCopyIndex < DefenseArr.length;DefenseCopyIndex++){
                            if(DefenseIndex != DefenseCopyIndex){
                                var DefenseCopy_X = getXorYNumber(DefenseArr[DefenseCopyIndex].style.left);
                                if(x == attack_X &&  x == Defense_X && x == attackCopy_X && x == DefenseCopy_X){
                                    return;
                                }
                            }
                        }
                    }
                }
                //双杀 double kill
                if((x == Defense_X && x == attack_X)||(y == Defense_Y && y == attack_Y)){
                    if( //纵向
                        ((Math.abs(Defense_X - attack_X) == 0 &&  Math.abs(Defense_X - x) == 0 && 
                        (Math.abs(Defense_Y - attack_Y) == 1 && Math.abs(Defense_Y - y) == 2) ||
                        (Math.abs(Defense_Y - attack_Y) == 2 && Math.abs(Defense_Y - y) == 1)) 
                        || //横向
                        (Math.abs(Defense_Y - attack_Y) == 0 && Math.abs(Defense_Y-y) == 0  &&
                        (Math.abs(Defense_X - attack_X) == 1 && Math.abs(Defense_X -x) == 2) ||
                        (Math.abs(Defense_X - attack_X) == 2 && Math.abs(Defense_X -x) == 1))
                        )){
                            //当出现不满足击杀条件却满足上述条件的各个值时
                            if(Math.abs(x - attack_X) == 3){
                                return;
                            }
                            //检查是否尾巴(只判断攻击的一方就行，有16种尾巴(其实就两种纵向及横向)
                            for(var i = 0;i < attackArr.length;i++){
                                var out_X = getXorYNumber(attackArr[i].style.left);
                                var out_Y = getXorYNumber(attackArr[i].style.top);
                                if(attackArr[attackIndex] != attackArr[i]){
                                    if((out_X ==x && out_X == attack_X) || (out_Y == y && out_Y == attack_Y)){
                                        if( //纵向
                                            ((Math.abs(out_Y - y) == 2 && Math.abs(out_Y - attack_Y) == 3) ||
                                            (Math.abs(out_Y - y) == 3 && Math.abs(out_Y - attack_Y) == 2)) 
                                            ||//横向
                                            ((Math.abs(out_X - x) == 2 && Math.abs(out_X - attack_X) == 3) ||
                                            (Math.abs(out_X - x) == 3 && Math.abs(out_X - attack_X) == 2))
                                            ){
                                                return;
                                            }
                                        //连续3个不构成击杀
                                        else if((Math.abs(out_X - attack_X) == 1 && Math.abs(out_X - x) == 2) ||
                                                (Math.abs(out_X - attack_X) == 2 && Math.abs(out_X - x) == 1)
                                                ||
                                                (Math.abs(out_Y - attack_Y) == 1 && Math.abs(out_Y - y) == 2) ||
                                                (Math.abs(out_Y - attack_Y) == 2 && Math.abs(out_Y - y) == 1)){
                                                    return;
                                                }
                                    }
                                }
                            }
                            //消除棋子
                            DefenseArr[DefenseIndex].remove();
                            //将消除的棋子从防守方的原数据也去除
                            if(player == 'top'){
                                bottom_player_ball_collection.splice(DefenseIndex,1);
                            }else{
                                top_player_ball_collection.splice(DefenseIndex,1);
                            }
                    }
                }
            }
        } 
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
            top_player_ball_collection[index].style.left = (-20 + (index * 100)) +"px";
            top_player_ball_collection[index].style.top = "-20px";
            //console.log(top_player_ball_collection[index].style.left+","+top_player_ball_collection[index].style.top)
        }

        for(var index = 0;index<bottom_player_ball_collection.length;index++){
            bottom_player_ball_collection[index].style.backgroundColor = "white";
            bottom_player_ball_collection[index].style.left = (-20 + (index * 100)) +"px";
            bottom_player_ball_collection[index].style.top = "280px";
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