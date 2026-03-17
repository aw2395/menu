import { _decorator, Component, Label } from "cc";
import { DishItem } from "./DishItem";
import { DishData } from "./MenuManage";
const { ccclass, property } = _decorator;

@ccclass("DishSelectItem")
export class DishSelectItem extends Component {
    @property(DishItem)
    private dishItem: DishItem = null;
    @property(Label)
    private glbExplain: Label = null;
    public updateView(data: DishData){
        this.dishItem.updateView(data);
        this.glbExplain.string = data.strExplain || "";
    }
}
