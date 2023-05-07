import { _decorator, CCFloat, CCInteger, Component, instantiate, Label, log, Node, Prefab, UITransform, v3 } from 'cc';
import { viewPlayer } from './viewPlayer';
import { viewStar } from './prefab/viewStar';
import { Model } from '../Model/Model';
const { ccclass, property } = _decorator;

// 怪獸的位置
// 星星生成計時器，生成範圍，生成座標 ---> 可 view 可 controller
// 星星生成，星星變透明 --- star
// 怪獸上下跳動(跳躍高度、持續時間、音效) --- player
// 使用鍵盤移動怪獸(左右移動、速度) --- maingame
// 怪獸蒐集星星的行為(吃到星星得分、音效) --- maingame
// 計分板得分顯示 --- maingame
// *** 音效統一放在 view ***


@ccclass('View')
export class View extends Component {

    // 引入星星
    @property({ type: Prefab })
    public starPrefab: Prefab | null = null;

    // 地面節點
    @property({ type: Node })
    public ground: Node | null = null;

    // 怪獸節點
    @property({ type: Node })
    public player: Node | null = null;

    @property({ type: Label })
    public score: Label | null = null;

    // @property({ type: Node })
    // public model: Node | null = null;
    public model: Model = null;

    // 星星產生後消失時間的隨機範圍
    // private minStarDuration: number = 3;
    // private maxStarDuration: number = 5;

    @property({ type: CCInteger })
    public minStarDuration: number = 0;

    @property({ type: CCInteger })
    public maxStarDuration: number = 0;


    private yGround: number = 0;
    // 星星出現的時間
    private timer: number = 0;
    private starDuration: number = 100;


    onLoad() {
        // 获取地平面的 y 轴坐标
        this.yGround = this.ground.getPosition().y + this.ground.getComponent(UITransform).height / 2;
        // 生成一个新的星星
        this.spawnNewStar();
    }

    start() {
        this.model = new Model();


    }

    update(deltaTime: number) {

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
        newStar.getComponent(viewStar).gameView = this;

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
        if (randX < 0) {
            randX + 50;
        } else {
            randX - 50;
        }
        // 根据地平面位置和主角跳跃高度，随机得到一个星星 y 坐标
        var randY = this.yGround + Math.random() * this.player.getComponent(viewPlayer).jumpHeight;
        // 返回星星坐标
        return v3(randX, randY, 0);
    }

    newScore() {
        this.model.gainScore();
        this.score.string = "Score: " + this.model.score.toString();
    }
}

