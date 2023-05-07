import { _decorator, CCInteger, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

// 得分 +1 傳到計分板 --- maingame


@ccclass('Model')
export class Model extends Component {

    // score 得分
    public score: number = 0;

    // 吃到星星得分
    gainScore() {
        this.score += 1;
        // this.scoreDisplay.string = "Score: " + this.score.toString();
    }

    // setScore() {
    //     this.score += 1;
    // }

    // getScore() {
    //     return this.score;
    // }

    start() {

    }

    update(deltaTime: number) {

    }
}

