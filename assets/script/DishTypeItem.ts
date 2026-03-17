import { _decorator, Component, isValid, Label, Node, resources, Sprite, SpriteFrame } from "cc";
import { eventManager } from "./EventManger";
import { MenuManage } from "./MenuManage";
import { UIOp2DUtils } from "./UIOp2DUtils";
const { ccclass, property } = _decorator;

@ccclass("DishTypeItem")
export class DishTypeItem extends Component {
    @property(Label)
    private glbTypeItem: Label = null;
    @property(Node)
    private grpSelect: Node = null;
    @property(Sprite)
    private grpTypeIcon: Sprite = null;

    private nIndex: number = 0;

    protected start(): void {
        this.onAddEventListener();
    }
    private onAddEventListener() {
        UIOp2DUtils.createScaleBtn(this.node, this.onClickNode, this, { bStatus: false });
    }

    public updateView(index: number, data: string) {
        this.nIndex = index;
        this.glbTypeItem.string = data;
        UIOp2DUtils.setHeight(this.grpTypeIcon.node, index == 1 ? 164 : 167);
        resources.load(`type${index + 1}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (isValid(this.grpTypeIcon)) {
                this.grpTypeIcon.spriteFrame = spriteFrame;
            }
        });
        this.changeSelect();
    }

    private onClickNode() {
        MenuManage.ins.nSelectIndex = this.nIndex;
        eventManager.dispatch("type_select");
    }

    public changeSelect() {
        this.grpSelect.active = this.nIndex == MenuManage.ins.nSelectIndex;
    }
}
