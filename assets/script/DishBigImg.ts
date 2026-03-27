import { _decorator, clamp, Component, EventTouch, isValid, Node, resources, Sprite, SpriteFrame, v2, v3, Vec2, Vec3 } from "cc";
import { UIOp2DUtils } from "./UIOp2DUtils";
const { ccclass, property } = _decorator;

@ccclass("DishBigImg")
export class DishBigImg extends Component {
    @property(Sprite)
    private grpIcon: Sprite = null;

    private originalTouchDistance: number = -1;
    private originalNodeScale: Vec3;

    start() {
        this.onAddEventListener();
    }

    private onAddEventListener() {
        UIOp2DUtils.createScaleBtn(this.node, this.onClickClose, this, { bStatus: false });
        this.grpIcon.node.off(Node.EventType.TOUCH_MOVE, this.onMapTouchMoveEvent, this);
        this.grpIcon.node.off(Node.EventType.TOUCH_END, this.onMapTouchEndEvent, this);
        this.grpIcon.node.off(Node.EventType.TOUCH_CANCEL, this.onMapTouchEndEvent, this);
        this.grpIcon.node.on(Node.EventType.TOUCH_MOVE, this.onMapTouchMoveEvent, this);
        this.grpIcon.node.on(Node.EventType.TOUCH_END, this.onMapTouchEndEvent, this);
        this.grpIcon.node.on(Node.EventType.TOUCH_CANCEL, this.onMapTouchEndEvent, this);
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

    private onMapTouchMoveEvent(event: EventTouch) {
        let touchs = event.getTouches();
        if (touchs.length < 2) {
            return;
        }
        let temp = v2();
        Vec2.subtract(temp, touchs[0].getLocation(), touchs[1].getLocation());
        let distance = temp.length();
        if (this.originalTouchDistance == -1) {
            this.originalTouchDistance = distance;
            this.originalNodeScale = this.grpIcon.node.scale.clone();
        }
        let targetScale = v3();
        let scale = distance / this.originalTouchDistance;
        Vec3.multiplyScalar(targetScale, this.originalNodeScale, scale);
        scale = targetScale.x;
        scale = clamp(scale, 0.5, 2);
        UIOp2DUtils.setScale(this.grpIcon.node, scale, scale);
    }

    private onMapTouchEndEvent() {
        this.originalTouchDistance = -1;
    }
}
