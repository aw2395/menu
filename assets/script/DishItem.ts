import { _decorator, Component, isValid, Label, Node, resources, Sprite, SpriteFrame } from "cc";
import { eventManager } from "./EventManger";
import { DishData, MenuManage } from "./MenuManage";
import { UIOp2DUtils } from "./UIOp2DUtils";
const { ccclass, property } = _decorator;

@ccclass("DishItem")
export class DishItem extends Component {
    @property(Sprite)
    private grpIcon: Sprite = null;
    @property(Label)
    private glbName: Label = null;
    @property(Node)
    private btnAdd: Node = null;
    @property(Label)
    private glbNotImg: Label = null;

    private dishData: DishData;

    protected start(): void {
        this.onAddEventListener();
    }

    private onAddEventListener() {
        UIOp2DUtils.createScaleBtn(this.grpIcon.node, this.onClickIcon, this);
        UIOp2DUtils.createScaleBtn(this.btnAdd, this.onClickAdd, this);
    }

    public updateView(data: DishData) {
        this.dishData = data;
        if (!this.dishData) {
            return;
        }
        this.glbName.string = this.dishData.name;
        let vSelectDish: DishData[] = MenuManage.ins.getSelectDish();
        let bSelect: boolean = false;
        for (let i = 0; i < vSelectDish.length; i++) {
            if (vSelectDish[i].id == this.dishData.id) {
                bSelect = true;
                break;
            }
        }
        this.btnAdd.active = !bSelect;
        if (this.dishData.strUrl) {
            this.grpIcon.node.active = true;
            this.glbNotImg.string = "";
            resources.load(`${this.dishData.strUrl}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
                if (isValid(this.grpIcon)) {
                    this.grpIcon.spriteFrame = spriteFrame;
                }
            });
        } else {
            this.grpIcon.node.active = false;
            this.glbNotImg.string = "暂无";
        }
    }

    private onClickIcon() {
        eventManager.dispatch("show_icon", [this.dishData.strUrl]);
    }

    private onClickAdd() {
        eventManager.dispatch("add_dish", [this.dishData]);
    }
}
