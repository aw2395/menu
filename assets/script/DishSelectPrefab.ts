import { _decorator, Component, instantiate, Node, Prefab, ScrollView } from "cc";
import { DishSelectItem } from "./DishSelectItem";
import { eventManager } from "./EventManger";
import { DishData, MenuManage } from "./MenuManage";
import { UIOp2DUtils } from "./UIOp2DUtils";
const { ccclass, property } = _decorator;

@ccclass("DishSelectPrefab")
export class DishSelectPrefab extends Component {
    @property(Node)
    private btnDel: Node = null;
    @property(Node)
    private btnSure: Node = null;
    @property(ScrollView)
    private scrollDish: ScrollView = null;
    @property(Prefab)
    private dishSelectItem: Prefab = null;

    start() {
        this.onAddEventListener();
        this.updateView();
    }

    private onAddEventListener() {
        UIOp2DUtils.createScaleBtn(this.node, this.onClickClose, this, { bStatus: false });
        UIOp2DUtils.createScaleBtn(this.btnDel, this.onClickBtnDel, this);
        UIOp2DUtils.createScaleBtn(this.btnSure, this.onClickBtnSure, this);
        eventManager.addEvent("dish_change", this.dishChangeEvent.bind(this), this);
    }

    public updateView() {
        let vSelectDish: DishData[] = MenuManage.ins.getSelectDish();
        for (let i = 0; i < vSelectDish.length; i++) {
            let item = this.scrollDish.content.children[i];
            if (!item) {
                item = instantiate(this.dishSelectItem);
                this.scrollDish.content.addChild(item);
            }
            item.active = true;
            item.getComponent(DishSelectItem).updateView(vSelectDish[i]);
        }
        for (let j = vSelectDish.length; j < this.scrollDish.content.children.length; j++) {
            this.scrollDish.content.children[j].active = false;
        }
    }

    private onClickClose() {
        this.node.destroy();
    }

    private onClickBtnDel() {
        MenuManage.ins.clearSelectDish();
        this.onClickClose();
    }

    private onClickBtnSure() {
        let vSelectDish: DishData[] = MenuManage.ins.getSelectDish();
        let strDesc: string = "";
        for (let i = 0; i < vSelectDish.length; i++) {
            strDesc += `菜品${i + 1}：`;
            strDesc += `名字：${vSelectDish[i].name},`;
            if (i < vSelectDish.length - 1) {
                strDesc += "&&";
            }
        }
        MenuManage.ins.handleCopy(strDesc);
    }

    private dishChangeEvent() {
        this.updateView();
    }

    onDestroy() {
        eventManager.removeEvents(this);
    }
}
