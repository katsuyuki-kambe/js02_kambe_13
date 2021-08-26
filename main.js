var PassSec;   // 秒数カウント用変数
 
// 繰り返し処理の中身
function showPassage() {
   PassSec++;   // カウントアップ
   var msg = "" + PassSec + "秒";   // 表示文作成
   document.getElementById("PassageArea").innerHTML = msg;   // 表示更新
}
 
// 繰り返し処理の開始
function startShowing() {
   PassSec = 0;   // カウンタのリセット
   PassageID = setInterval('showPassage()',1000);   // タイマーをセット(1000ms間隔)
   document.getElementById("startcount").disabled = true;   // 開始ボタンの無効化
}
 
// 繰り返し処理の中止
function stopShowing() {
   clearInterval( PassageID );   // タイマーのクリア
   document.getElementById("startcount").disabled = false;   // 開始ボタンの有効化
}

//canvasを作る
    var c =document.createElement("canvas");

//二次元で設定
//canvasの大きさを設定
    var ctx = c.getContext("2d");
    c.width = 1300;
    c.height = 450;

    var size = 30;

//htmlに追加
    document.body.appendChild(c);

//山の斜面を作成。ランダムに高さを作る
//perm.length =　高さ設定
//Math.floor =　小数点を除外
    var perm = [];

    while (perm.length < 130){
        while (perm.includes(val = Math.floor(Math.random() * 130)));
        perm.push(val);
    }
    var lerp = (a,b,t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;

//線形分離。数学をちゃんとやっていれば良かった。
//c.widthを255以上にしないために% 0.01をかけてギザギザを拡大し、滑らかに
    var noise = x => {
        x = x * 0.01 % 225;
        return lerp(perm[Math.floor(x)],
                    perm[Math.ceil(x)],
                    x - Math.floor(x));
        console.log(Math.ceil(95));//expected output:1
        console.log(Math.ceil(4));//expected output:4
        console.log(Math.ceil(7.044));//expected output:8
        console.log(Math.ceil(-7.044));//expected output:-7
        }

//アニメーションをパラパラ漫画化
//fillStyle = 背景に塗りつぶしの色をつける
//fillRect = 長方形を描画する(x軸,y軸,幅,高さ)
//requestAnimationFrame = アニメーションを繰り返す(更新させる)

//プレイヤーを真ん中に　回転の角度
var player = new function(){
    this.x = c.width / 2;
    this.y = 0;
    this.ySpeed = 0;
    this.rot = 0;
    this.rSpeed = 0;
//描画する
    this.img = new Image();
    this.img.src = "img/バイク.png";

    this.draw = function() {
        var p1 = c.height - noise(t + this.x) * 0.25;
        var p2 = c.height - noise(t + 5 + this.x) * 0.25;

        var grounded = 0;

//playerのスピード調整 playerを山を走るように固定
        if(p1 - size > this.y){
//飛び上がるようにする
            this.ySpeed += 0.1; 
        } else {
            this.ySpeed -= this.y - (p1 - size);
            this.y = p1 - size;

            grounded = 1;
        }

        if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
            playing = false;
            this.rSpeed = 5;
            k.ArrowUp =1;
            this.x -= speed * 5;
        }
//playerの角度
        var angle = Math.atan2((p2 - size) - this.y, (this.x + 5) - this.x);

        this.y += this.ySpeed;

//地面に触れた時のplayer角度
        if(grounded && playing){
            this.rot -= (this.rot - angle) * 0.5;
            this.rSpeed = this.rSpeed - (angle -this.rot);
        }

        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
        this.rot -= this.rSpeed * 0.1;

//playerを回転しすぎないようにする
        if(this.rot > Math.PI) this.rot = -Math.PI;
        if(this.rot < -Math.PI) this.rot = Math.PI;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -size, -size, 100, 100);

        ctx.restore();
    }
}
var t = 0;
var speed =0;
//ゲームオーバーの設定
var playing = true;
//十字キー設定
var k = {ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0};


    function loop(){
//↑でスピードアップ、↓でスピードダウン
        speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.1;
        t += 10 * speed;
        ctx.fillStyle = "#19f";
        ctx.fillRect(0,0,c.width,c.height);

        ctx.fillStyle = "black";

//山の斜面を左から右に描画する
//始点を一番下にする
        ctx.beginPath();
        ctx.moveTo(0,c.height)

//直前の座標と指定の座標を結ぶ直線を引く
//ランダムに山ができる 0.25倍で山の高さを低くする
        for (var i = 0; i < c.width; i++){
            ctx.lineTo(i, c.height - noise(t + i) * 0.25);
        }

//終点を定める
        ctx.lineTo(c.width, c.height);

        ctx.fill();

    player.draw();
    requestAnimationFrame(loop);
}
onkeydown = d => k[d.key] = 1;
onkeyup  = d => k[d.key] = 0;
loop();

