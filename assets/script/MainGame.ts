import { _decorator, AudioClip, CCInteger, Component, director, instantiate, Label, Node, Prefab, UITransform, v3, Vec2, Vec3 } from 'cc';
import { Player } from './Player';
import { Star } from './Star';
const { ccclass, property } = _decorator;

@ccclass('MainGame')
export class MainGame extends Component {

    // 引入星星
    @property({ type: Prefab })
    public starPrefab: Prefab | null = null;

    // 地面節點
    @property({ type: Node })
    public ground: Node | null = null;

    // 怪獸節點
    @property({ type: Node })
    public player: Node | null = null;

    // score 得分
    @property({ type: CCInteger, tooltip: "The score of player" })          // tooltip 滑鼠移到參數名稱上方會出現的字
    public score: number = 0;

    // 計分板
    @property({ type: Label })
    public scoreDisplay: Label | null = null;

    // 星星產生後消失時間的隨機範圍
    // private minStarDuration: number = 3;
    // private maxStarDuration: number = 5;

    @property({ type: CCInteger })
    public minStarDuration: number = 0;

    @property({ type: CCInteger })
    public maxStarDuration: number = 0;

    // 怪獸得分音效
    @property({ type: AudioClip })
    public scoreAudio: AudioClip | null = null;

    private yGround: number = 0;
    private timer: number = 0;
    // 星星出現的時間
    private starDuration: number = 100;


    onLoad() {
        // 获取地平面的 y 轴坐标
        this.yGround = this.ground.getPosition().y + this.ground.getComponent(UITransform).height / 2;
        // 生成一个新的星星
        this.spawnNewStar();
        // 初始化星星出現計時器
        this.timer = 0;
        this.starDuration = 100;
        // 初始化计分
        this.score = 0;
    }

    start() {

    }

    update(dt: number) {
        // 每幀都更新，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    // 隨機生成星星
    spawnNewStar() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 在星星脚本组件上保存 Game 对象的引用
        newStar.getComponent(Star).game = this;

        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    // 星星座標
    getNewStarPosition() {
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var randX = 0;
        var maxX = this.node.getComponent(UITransform).width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星 y 坐标
        var randY = this.yGround + Math.random() * this.player.getComponent(Player).jumpHeight + 20;
        // 返回星星坐标
        return v3(randX, randY, 0);
    }

    // 播放得分音效
    playScoreSound() {
        this.scoreAudio.play();
    }

    // 得分
    gainScore() {
        this.score += 1;
        this.scoreDisplay.string = 'Score: ' + this.score;          // 更新 scoreDisplay Label 的分數
        this.playScoreSound();          // 得分音效
    }

    // 遊戲失敗，要重新開始，加載回最初的遊戲場景
    gameOver() {
        // 先停止怪獸節點的跳耀動作(也可以用 .destroy() )
        this.player.removeAllChildren();
        // 重新加載最初的遊戲場景(小括號() 裡面放的是要重載回哪個場景的 "檔案名稱")
        director.loadScene("game");
    }
}
