import { _decorator, CCInteger, Component, game, log, Node, UIOpacity, v3, } from 'cc';
import { MainGame } from './MainGame';
const { ccclass, property } = _decorator;

@ccclass('Star')
export class Star extends Component {

    @property({ type: CCInteger })
    public pickRadius: number = 0;

    public game: MainGame;


    start() {

    }

    update(dt: number) {
        // 每帧判断星星和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }

        // 根據 dt 讓星星的透明度逐漸降低
        let starOpacity = this.node.getComponent(UIOpacity);
        if (dt <= 0) {
            starOpacity.opacity = 0;
        } else {
            starOpacity.opacity -= dt * 40;
        }
        
        // 官方文件：根据 Game 脚本中的計時器讓星星的透明度逐漸降低
        // var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        // var minOpacity = 50;
        // this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }

    getPlayerDistance() {
        // 根据 Player 节点位置判断距离
        var playerPosition = v3(this.game.player.getPosition().x, this.game.player.getPosition().y, 0);
        // 根据两点位置计算两点之间距离
        var dist = this.node.getPosition().subtract(playerPosition).length();
        return dist;
    }

    onPicked() {
        // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();
        // 调用 Game 脚本的得分方法
        this.game.gainScore();
        // 銷毀當前星星節點
        this.node.destroy();
    }
}