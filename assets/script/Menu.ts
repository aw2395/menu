import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import { eventManager } from "./EventManger";
import TipsText from "./TipsText";
import { UIOp2DUtils } from "./UIOp2DUtils";
const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
    @property(Node)
    private btnEnter: Node = null;
    @property(Prefab)
    private MenuPrefab: Prefab = null;
    @property(Prefab)
    private tipsDialog: Prefab | null = null;

    start() {
        UIOp2DUtils.createScaleBtn(this.btnEnter, this.onClickBtnEnter, this);
        eventManager.addEvent("tip_text", this.tipsText.bind(this), this);
    }

    private onClickBtnEnter() {
        let item = instantiate(this.MenuPrefab);
        this.node.addChild(item);
    }

    private tipsText(arg: any[]) {
        let item = this.node.getChildByName("TipsText");
        if (!item) {
            item = instantiate(this.tipsDialog);
            this.node.addChild(item);
        }
        item.getComponent(TipsText).setText(arg[0]);
    }

    onDestroy() {
        eventManager.removeEvents(this);
    }
}
