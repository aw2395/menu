import { _decorator, Component, Node } from "cc";
import { DishItem } from "./DishItem";
import { DishData, MenuManage } from "./MenuManage";
import { UIOp2DUtils } from "./UIOp2DUtils";
const { ccclass, property } = _decorator;

@ccclass("DishSelectItem")
export class DishSelectItem extends Component {
    @property(DishItem)
    private dishItem: DishItem = null;
    @property(Node)
    private btnDel: Node = null;

    private dishData: DishData;
    public updateView(data: DishData) {
        this.dishData = data;
        this.dishItem.updateView(data);
    }

    protected start(): void {
        this.onAddEventListener();
    }

    private onAddEventListener() {
        UIOp2DUtils.createScaleBtn(this.btnDel, this.onClickDel, this);
    }

    private onClickDel() {
        MenuManage.ins.delSelectDish(this.dishData.id);
    }
}
