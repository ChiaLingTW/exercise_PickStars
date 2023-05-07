import { _decorator, Component, director, Node } from 'cc';
import { View } from '../View/View';
const { ccclass, property } = _decorator;

// 超過時間還沒有吃到星星，遊戲失敗 --- maingame
// 遊戲失敗，要重新開始，加載回最初的遊戲場景 --- maingame


@ccclass('Controller')
export class Controller extends Component {

    @property({ type: View })
    public View: View | null = null;

    // public gameView: View;

    // 星星出現的時間
    private timer: number = 0;
    private starDuration: number = 100;


    start() {
        
    }

    update(dt: number) {
        // 每幀都更新，超過時間還沒有吃到星星，遊戲失敗
        // 執行遊戲失敗邏輯
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    // 遊戲失敗邏輯，要重新開始，加載回最初的遊戲場景
    gameOver() {
        // 先停止怪獸節點的跳耀動作(也可以用 .destroy() )
        this.View.player.removeAllChildren();
        // 重新加載最初的遊戲場景(小括號() 裡面放的是要重載回哪個場景的 "檔案名稱")
        director.loadScene("game");
    }
}

