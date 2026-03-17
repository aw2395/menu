import { _decorator, Component, instantiate, Label, Node, Prefab, ScrollView } from "cc";
import { DishBigImg } from "./DishBigImg";
import { DishExplainDialog } from "./DishExplainDialog";
import { eventManager } from "./EventManger";
import { DishData, MenuManage } from "./MenuManage";
import { UIOp2DUtils } from "./UIOp2DUtils";
import { DishTypeItem } from "./DishTypeItem";
import { DishItem } from "./DishItem";
const { ccclass, property } = _decorator;

@ccclass("MenuPrefab")
export class MenuPrefab extends Component {
    @property(Label)
    private glbDishNum: Label = null;
    @property(Node)
    private btnSure: Node = null;
    @property(Node)
    private btnAddDish: Node = null;
    @property(Prefab)
    private dishSelectPrefab: Prefab = null;
    @property(Prefab)
    private dishExplainDialog: Prefab = null;
    @property(Prefab)
    private dishBigImg: Prefab = null;
    @property(ScrollView)
    private scrollType: ScrollView = null;
    @property(Prefab)
    private dishTypeItem: Prefab = null;
    @property(ScrollView)
    private scrollDish: ScrollView = null;
    @property(Prefab)
    private dishItem: Prefab = null;

    start() {
        this.initView();
        this.onAddEventListener();
        this.updateView();
    }

    private initView() {
        let vDishType: string[] = MenuManage.ins.vDishType;
        for(let i=0;i<vDishType.length; i++){
            let item = this.scrollType.content.children[i];
            if(!item){
                item = instantiate(this.dishTypeItem);
                this.scrollType.content.addChild(item);
            }
            item.active = true;
            item.getComponent(DishTypeItem).updateView(i,vDishType[i])
        }
    }

    private onAddEventListener() {
        UIOp2DUtils.createScaleBtn(this.btnSure, this.onClickBtnSure, this);
        UIOp2DUtils.createScaleBtn(this.btnAddDish, this.onClickBtnAddDish, this);
        eventManager.addEvent("dish_change", this.dishChangeEvent.bind(this), this);
        eventManager.addEvent("add_dish", this.addDishEvent.bind(this), this);
        eventManager.addEvent("show_icon", this.showIconEvent.bind(this), this);
        eventManager.addEvent("type_select", this.typeSelectEvent.bind(this), this);
    }

    private updateView() {
        let vSelectDish: DishData[] = MenuManage.ins.getSelectDish();
        this.glbDishNum.string = `当前已点菜品数：${vSelectDish.length}`;
        let nSelectedId: number = MenuManage.ins.nSelectIndex;
        let vDishDataOfId: DishData[] = MenuManage.ins.getMapDishDataBySelect(nSelectedId);
        for(let i=0;i<vDishDataOfId.length; i++){
            let item = this.scrollDish.content.children[i];
            if(!item){
                item = instantiate(this.dishItem);
                this.scrollDish.content.addChild(item);
            }
            item.active = true;
            item.getComponent(DishItem).updateView(vDishDataOfId[i]);
        }
        for(let j=vDishDataOfId.length; j<this.scrollDish.content.children.length; j++){
            this.scrollDish.content.children[j].active = false;
        } 
    }

    private onClickBtnSure() {
        let item = instantiate(this.dishSelectPrefab);
        this.node.addChild(item);
    }

    private onClickBtnAddDish() {
        let item = instantiate(this.dishExplainDialog);
        this.node.addChild(item);
        item.getComponent(DishExplainDialog).updateData("选择想要新增的菜品，后续添加", (strDesc: string) => {
            MenuManage.ins.handleCopy(strDesc);
        });
    }

    private dishChangeEvent() {
        this.updateView();
    }

    private addDishEvent(arg: any[]) {
        let dishData: DishData = arg[0];
        let item = instantiate(this.dishExplainDialog);
        this.node.addChild(item);
        item.getComponent(DishExplainDialog).updateData("添加菜品备注，也可不备注", (strDesc: string) => {
            let newDishData: DishData = {
                id: dishData.id,
                name: dishData.name,
                strUrl: dishData.strUrl,
                strExplain: strDesc,
            };
            MenuManage.ins.addSelectDish(newDishData);
        });
    }

    private showIconEvent(arg: any[]) {
        let strUrl: string = arg[0];
        let item = instantiate(this.dishBigImg);
        this.node.addChild(item);
        item.getComponent(DishBigImg).updateView(strUrl);
    }

    private typeSelectEvent() {
        this.updateView();
        for(let i=0;i<this.scrollType.content.children.length; i++){
            this.scrollType.content.children[i].getComponent(DishTypeItem).changeSelect();
        }
    }

    onDestroy() {
        eventManager.removeEvents(this);
    }
}
