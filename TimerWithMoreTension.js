//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//
//                  Timer With More Tension      Ver 1.00
//                      2020.07.08. staticccast
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
/*
    All functions are based on rpg_scenes.js & rpg_sprites.js and overridden.
    (Except getImg(imgName) function)
    So, be careful if you're using another 3rd-party plugin which does the same.
    Collisions will occur.

    rpg_scenes.js와 rpg_sprites.js의 일부 함수를 덮어씁니다.
    (getImg(imgName) 함수를 제외하고는)
    따라서 비슷한 짓을 하는 외부 플러그인을 쓴다면 충돌 가능성이 있으니 조심하세요.


    Use your own img when needed, by replacing
    [
        TimerWindow.png
        TimerBar.png
        TimerBarWindow.png
    ]
    of img/pictures/
    Exactly same result, exactly same size images will bring.
    Then, no need to change any code.

    원하는 이미지를 사용하셔도 됩니다.
    img/pictures 폴더의
    [
        TimerWindow.png
        TimerBar.png
        TimerBarWindow.png
    ]
    를 변경하시면 됩니다.
    당연히! 같은 사이즈 이미지를 사용하면 같은 결과가 나옵니다.
    당연히! 그러면 코드를 수정하거나 할 필요가 없겠죠?

    20200708 staticccast
*/

//-----------------------------------------------------------------------------
// Sprite_Timer
//
// The sprite for displaying the timer.

/*  Definition in rpg_sprites.js 
function Sprite_Timer() {
    this.initialize.apply(this, arguments);
}

Sprite_Timer.prototype = Object.create(Sprite.prototype);
Sprite_Timer.prototype.constructor = Sprite_Timer;
*/

Sprite_Timer.prototype.getImg = function(imgName) {
    return ImageManager.loadBitmap('img/pictures/', imgName, 0, true);
}

Sprite_Timer.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._num = new Sprite();
    this._num.bitmap = new Bitmap(960, 200);
    this._num.bitmap.fontSize = 50;
    this._num.y = -5;

    this._numWin = new Sprite(this.getImg('TimerWindow'));
    this._numWin.x = 716;
    this._numWin.y = 55;

    this._bar = new Sprite(this.getImg('TimerBar'));
    this._bar.x = 41;
    this._bar.y = 103;

    this._barWin = new Sprite(this.getImg('TimerBarWindow'));
    this._barWin.x = 38;
    this._barWin.y = 100;

    this.addChild(this._barWin);
    this.addChild(this._bar);
    this.addChild(this._numWin);
    this.addChild(this._num);

    this._seconds = 0;
    this.createBitmap();
    this.update();

    this.x += Graphics.boxWidth - 960;
    this.y = Graphics.boxHeight - 440;
};

Sprite_Timer.prototype.createBitmap = function() {
    this.flowX = 0;
    this.flowRGB = 0;
};

Sprite_Timer.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    //this.updatePosition(); //Basically does nothing
    this.updateVisibility();
};

Sprite_Timer.prototype.updateBar = function() {
    if(this._seconds < $gameTimer._frames33percent)
    {
        this.flowRGB += (this.flowRGB <= 255 ? 1 : 0);
        this.flowX += 20;
        this._bar.setColorTone([this.flowRGB,0,0,0]);
    }
    else if(this._seconds < $gameTimer._frames66percent)
    {
        this.flowRGB += (this.flowRGB <= 255 ? 1 : 0);
        this.flowX += 10;
        this._bar.setColorTone([this.flowRGB,0,0,0]);
    }
    this.flowX += 10;
    this.flowX %= 441;
    this._bar.setFrame(this.flowX, 0, 680, 15);
    this._bar.x += ($gameTimer._barReducSpeed);
};

Sprite_Timer.prototype.updateBitmap = function() {
    if (this._seconds !== $gameTimer.seconds()) {
        this._seconds = $gameTimer.seconds();
        this.redraw();
    }
};

Sprite_Timer.prototype.redraw = function() {
    var text = this.timerText();
    var width = this._num.bitmap.width;
    var height = this._num.bitmap.height;

    var newX4wiggle = 350 + (this._seconds%7 - 3)*(this._seconds%7 - 3)/2;

    this._num.bitmap.clear();
    this._num.bitmap.fontSize *= 1.001;
    this._num.bitmap.drawText(text, newX4wiggle, 0, width, height, 'center');

    this.updateBar();
};

Sprite_Timer.prototype.timerText = function() {
    var min = Math.floor(this._seconds / 60) % 60;  //분 -> 초
    var sec = this._seconds % 100;                  //초 -> 1/100초 로 사용됩니다.
    return min.padZero(2) + ':' + sec.padZero(2);
};

Sprite_Timer.prototype.updatePosition = function() {
};

Sprite_Timer.prototype.updateVisibility = function() {
    this.visible = $gameTimer.isWorking();
};

/*
    Overrides Game_Timer of rpg_objects.js
    rpg_objects.js의 Game_Timer를 덮어쓰기 합니다
*/
Game_Timer.prototype.initialize = function() {
    this._frames = 0;
    this._working = false;

    this._framesIntended = 0;
    this._frames66percent = 0;
    this._frames33percent = 0;
    this._barReducSpeed = 0;
};

Game_Timer.prototype.start = function(count) {
    this._frames = count;
    this._framesIntended = count;
    this._frames66percent = Math.floor(count * 2 / 3);
    this._frames33percent = Math.floor(count / 3);
    this._barReducSpeed = Math.floor(680/count * 1000) / 1000;
    this._working = true;
};