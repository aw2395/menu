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
        if (!navigator.share) {
            eventManager.dispatch("tip_text", ["你的浏览器不支持分享功能，请使用微信/QQ浏览器或升级版本"]);
            return;
        }
        try {
            // 仅传标题+链接（核心参数），无图片也能正常分享
            navigator
                .share({
                    title: "小艾菜单", // 分享标题
                    url: "https://aw2395.github.io/menu/", // 游戏链接（自动获取当前页面）
                } as any)
                .then(() => {
                    MenuManage.ins.handleCopy(strDesc);
                })
                .catch((err) => {
                    eventManager.dispatch("tip_text", ["分享已取消或失败"]);
                });
        } catch (e) {
            eventManager.dispatch("tip_text", ["分享出错，请稍后再试"]);
        }
    }

    private dishChangeEvent() {
        this.updateView();
    }

    onDestroy() {
        eventManager.removeEvents(this);
    }
}
