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
    @property(Node)
    private btnShare: Node = null;

    start() {
        UIOp2DUtils.createScaleBtn(this.btnEnter, this.onClickBtnEnter, this);
        UIOp2DUtils.createScaleBtn(this.btnShare, this.onClickBtnShare, this);
        eventManager.addEvent("tip_text", this.tipsText.bind(this), this);
    }

    private onClickBtnEnter() {
        let item = instantiate(this.MenuPrefab);
        this.node.addChild(item);
    }

    private onClickBtnShare() {
        if (!navigator.share) {
            eventManager.dispatch("tip_text", ["你的浏览器不支持分享功能，请使用微信/QQ浏览器或升级版本"]);
            return;
        }
        try {
            // 仅传标题+链接（核心参数），无图片也能正常分享
            navigator
                .share({
                    title: "小艾菜单", // 分享标题
                    text: "小艾菜单，菜单选择",
                    url: "https://aw2395.github.io/menu/", // 游戏链接（自动获取当前页面）
                } as any)
                .then(() => {
                    eventManager.dispatch("tip_text", ["分享成功~"]);
                })
                .catch((err) => {
                    eventManager.dispatch("tip_text", ["分享已取消或失败"]);
                });
        } catch (e) {
            eventManager.dispatch("tip_text", ["分享出错，请稍后再试"]);
        }
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
