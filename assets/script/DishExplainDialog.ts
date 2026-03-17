import { _decorator, Component, EditBox, Label, Node } from "cc";
import { UIOp2DUtils } from "./UIOp2DUtils";
const { ccclass, property } = _decorator;

@ccclass("DishExplainDialog")
export class DishExplainDialog extends Component {
    @property(Label)
    private glbDesc: Label = null;
    @property(EditBox)
    private editBox: EditBox = null;
    @property(Node)
    private btnSure: Node = null;

    private callBack: Function = null;

    start() {
        this.onAddEventListener();
    }

    public updateData(strDesc: string, callBack: Function) {
        this.glbDesc.string = strDesc;
        this.callBack = callBack;
    }

    private onAddEventListener() {
        UIOp2DUtils.createScaleBtn(this.node, this.onClickClose, this, { bStatus: false });
        UIOp2DUtils.createScaleBtn(this.btnSure, this.onClickBtnSure, this);
    }

    private onClickClose() {
        this.node.destroy();
    }

    private onClickBtnSure() {
        if (this.callBack) {
            this.callBack(this.editBox.string);
        }
        this.onClickClose();
    }
}
