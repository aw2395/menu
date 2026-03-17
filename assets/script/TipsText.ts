import { _decorator, Component, Label, Tween, tween, UIOpacity } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TipsText")
export default class TipsText extends Component {
    @property(Label)
    private text: Label | null = null;
    public setText(str: string, time: number = 2) {
        this.text.string = str;
        let ui_opacity = this.node.getComponent(UIOpacity);
        ui_opacity.opacity = 255;
        Tween.stopAllByTarget(ui_opacity);
        tween(ui_opacity)
            .to(time, { opacity: 0 })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}
