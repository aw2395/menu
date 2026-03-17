import { sys } from "cc";
import { eventManager } from "./EventManger";

export interface DishData {
    id: string;
    strUrl: string;
    name: string;
    strExplain?: string;
}

export class MenuManage {
    private static _ins: MenuManage;
    public static get ins(): MenuManage {
        if (!this._ins) {
            this._ins = new MenuManage();
        }
        return this._ins;
    }

    private readonly _vDishType: string[] = ["荤菜", "素菜", "汤类", "其他"];
    private readonly mapDishData: { [key: string]: DishData } = {
        ["0_1"]: {
            id: "0_1",
            strUrl: "",
            name: "牛腩炖萝卜",
        },
        ["0_2"]: {
            id: "0_2",
            strUrl: "",
            name: "香菜牛肉",
        },
        ["0_3"]: {
            id: "0_3",
            strUrl: "pjy",
            name: "啤酒鸭",
        },
        ["0_4"]: {
            id: "0_4",
            strUrl: "hsr",
            name: "红烧肉",
        },
        ["0_5"]: {
            id: "0_5",
            strUrl: "xqm",
            name: "虾球面",
        },
        ["0_6"]: {
            id: "0_6",
            strUrl: "qzx",
            name: "清蒸蟹",
        },
        ["0_7"]: {
            id: "0_7",
            strUrl: "xlx",
            name: "香辣蟹",
        },
        ["1_1"]: {
            id: "1_1",
            strUrl: "hswcy",
            name: "红烧武昌鱼",
        },
        ["1_2"]: {
            id: "1_2",
            strUrl: "jdht",
            name: "鸡蛋火腿",
        },
        ["1_3"]: {
            id: "1_3",
            strUrl: "jhjd",
            name: "韭黄鸡蛋",
        },
        ["1_4"]: {
            id: "1_4",
            strUrl: "kljc",
            name: "可乐鸡翅",
        },
        ["1_5"]: {
            id: "1_5",
            strUrl: "lc",
            name: "腊肠",
        },
        ["1_6"]: {
            id: "1_6",
            strUrl: "qjjd",
            name: "青椒鸡蛋",
        },
        ["1_7"]: {
            id: "1_7",
            strUrl: "qjrs",
            name: "青椒肉丝",
        },
        ["1_8"]: {
            id: "1_8",
            strUrl: "ssbc",
            name: "手撕包菜",
        },

        ["1_9"]: {
            id: "1_9",
            strUrl: "qzly",
            name: "清蒸鲈鱼",
        },
        ["1_10"]: {
            id: "1_10",
            strUrl: "shq",
            name: "上海青",
        },
        ["1_11"]: {
            id: "1_11",
            strUrl: "td",
            name: "土豆",
        },
        ["1_12"]: {
            id: "1_12",
            strUrl: "wdrm",
            name: "豌豆肉末",
        },
        ["1_13"]: {
            id: "1_13",
            strUrl: "",
            name: "蒜苔炒腊肉",
        },
        ["2_1"]: {
            id: "2_1",
            strUrl: "gbr",
            name: "锅包肉",
        },
        ["2_2"]: {
            id: "2_2",
            strUrl: "",
            name: "干煸藕丝",
        },
        ["3_1"]: {
            id: "3_1",
            strUrl: "glsj",
            name: "干捞水饺",
        },
        ["3_2"]: {
            id: "3_2",
            strUrl: "jj",
            name: "煎饺",
        },
        ["3_3"]: {
            id: "3_3",
            strUrl: "zbz",
            name: "蒸包子",
        },
        ["3_4"]: {
            id: "3_4",
            strUrl: "",
            name: "煮豆皮",
        },
        ["3_5"]: {
            id: "3_5",
            strUrl: "",
            name: "手抓饼",
        },
        ["4_1"]: {
            id: "4_1",
            strUrl: "ympgt",
            name: "玉米排骨汤",
        },
        ["4_2"]: {
            id: "4_2",
            strUrl: "",
            name: "海带排骨汤",
        },
        ["4_3"]: {
            id: "4_3",
            strUrl: "fqjdt",
            name: "番茄鸡蛋汤",
        },
        ["4_4"]: {
            id: "4_4",
            strUrl: "zcdht",
            name: "紫菜蛋花汤",
        },
        ["5_1"]: {
            id: "5_1",
            strUrl: "cpm",
            name: "炒泡面",
        },
        ["5_2"]: {
            id: "5_2",
            strUrl: "dcf",
            name: "蛋炒饭",
        },
    };
    private vSelectDish: DishData[] = [];
    private _nSelectIndex: number = 0;
    public get nSelectIndex(): number {
        return this._nSelectIndex;
    }
    public set nSelectIndex(value: number) {
        this._nSelectIndex = value;
    }

    public get vDishType(): string[] {
        return this._vDishType;
    }

    public getMapDishDataBySelect(nSelectId: number): DishData[] {
        let vDishData: DishData[] = [];
        for (let i in this.mapDishData) {
            if (i.indexOf(`${nSelectId}_`) >= 0) {
                vDishData.push(this.mapDishData[i]);
            } else {
                if (vDishData.length) {
                    break;
                }
            }
        }
        return vDishData;
    }

    public getSelectDish(): DishData[] {
        return this.vSelectDish;
    }

    public addSelectDish(data: DishData) {
        this.vSelectDish.push(data);
        eventManager.dispatch("dish_change");
    }

    public delSelectDish(id: string) {
        for (let i = 0; i < this.vSelectDish.length; i++) {
            if (this.vSelectDish[i].id == id) {
                this.vSelectDish.splice(i, 1);
                break;
            }
        }
        eventManager.dispatch("dish_change");
    }

    public clearSelectDish() {
        this.vSelectDish = [];
        eventManager.dispatch("dish_change");
    }

    public handleCopy(sDesc: string) {
        if (sys.os == sys.OS.WINDOWS || sys.isBrowser) {
            let input = document.createElement("input");
            input.value = sDesc;
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length);
            document.execCommand("Copy");
            document.body.removeChild(input);
        }
        eventManager.dispatch("tip_text", ["复制成功，去微信直接粘贴"]);
    }
}
