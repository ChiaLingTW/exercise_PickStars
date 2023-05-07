import { _decorator, Component, Node, input, Input, CCInteger, CCFloat, tween, Vec3, EventKeyboard, macro, log, KeyCode, AudioClip, } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('Player')
export class Player extends Component {

    // 怪獸跳躍高度
    @property({ type: CCInteger })
    public jumpHeight: number = 0;

    // 怪獸跳躍持續時間
    @property({ type: CCFloat })
    public jumpDuration: number = 0;

    // 怪獸最大移動速度
    @property({ type: CCInteger })
    public maxMoveSpeed: number = 0;

    // 怪獸移動的加速度
    @property({ type: CCInteger })
    public accel: number = 0;

    // 怪獸跳躍音效
    @property({ type: AudioClip })
    public jumpAudio: AudioClip | null = null;

    private accLeft: boolean;                     // 按鍵往左
    private accRight: boolean;                    // 按鍵往右
    private xSpeed: number = 0;                   // 怪獸移動速度
    private yPositionCheck: boolean = true;       // 怪獸的位置
    private yPosition: number = 0;                // 怪獸移動的位置


    onLoad() {
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;

        // 監聽鍵盤事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        // 取消監聽鍵盤事件
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {

    }

    update(dt: number) {
        // 怪獸左右移動(讓他每幀都執行判斷)
        // 根据当前加速度方向每幀更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        // 限制怪獸的速度不能超過最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 怪獸上下跳躍(讓他每幀都執行判斷)
        // 利用布林值判斷怪獸跳的範圍區間要做什麼事
        this.yPosition = this.node.getPosition().y;
        if (this.yPositionCheck == true) {
            this.yPosition += 3;
            // 當怪獸往上跳到區間的上限，準備要往下落
            if (this.yPosition >= -22) {
                this.yPositionCheck = false;
            }
        } else if (this.yPositionCheck == false) {
            this.yPosition -= 3;
            // 當怪獸掉落到區間的下限，準備要往下落
            if (this.yPosition <= -122) {
                this.yPositionCheck = true;
                this.playJumpSound();           // 跳躍音效
            }
        }

        // 抓當前怪獸的位置
        this.node.setPosition(new Vec3(this.xSpeed, this.yPosition, 0))
        // log(this.yPosition);
    }

    // 播放怪獸跳躍音效
    playJumpSound() {
        this.jumpAudio.play();
    }

    // 使用鍵盤A、D鍵，讓怪獸左右移動的判斷
    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                log("KEY_A")
                this.accLeft = true;
                break;
            case KeyCode.KEY_D:
                log("KEY_D")
                this.accRight = true;
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.accLeft = false;
                break;
            case KeyCode.KEY_D:
                this.accRight = false;
                break;
        }
    }
}
