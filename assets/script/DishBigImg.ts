import { _decorator, Component, isValid, resources, Sprite, SpriteFrame } from "cc";
import { UIOp2DUtils } from "./UIOp2DUtils";
const { ccclass, property } = _decorator;

@ccclass("DishBigImg")
export class DishBigImg extends Component {
    @property(Sprite)
    private grpIcon: Sprite = null;

    start() {
        this.onAddEventListener();
    }

    private onAddEventListener() {
        UIOp2DUtils.createScaleBtn(this.node, this.onClickClose, this, { bStatus: false });
    }

    public updateView(strUrl: string) {
        resources.load(`${strUrl}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (isValid(this.grpIcon)) {
                this.grpIcon.spriteFrame = spriteFrame;
            }
        });
    }

    private onClickClose() {
        this.node.destroy();
    }
}
