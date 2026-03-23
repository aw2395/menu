import { sys } from "cc";
import { eventManager } from "./EventManger";

export interface DishData {
    id: string;
    strUrl: string;
    name: string;
    nPrice: number;
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
            strUrl: "nnlb",
            name: "牛腩炖萝卜",
            nPrice: 19,
        },
        ["0_2"]: {
            id: "0_2",
            strUrl: "xcnr",
            name: "香菜牛肉",
            nPrice: 19,
        },
        ["0_3"]: {
            id: "0_3",
            strUrl: "pjy",
            name: "啤酒鸭",
            nPrice: 19,
        },
        ["0_4"]: {
            id: "0_4",
            strUrl: "hsr",
            name: "红烧肉",
            nPrice: 19,
        },
        ["0_5"]: {
            id: "0_5",
            strUrl: "xqm",
            name: "虾球面",
            nPrice: 19,
        },
        ["0_6"]: {
            id: "0_6",
            strUrl: "qzx",
            name: "清蒸蟹",
            nPrice: 29,
        },
        ["0_7"]: {
            id: "0_7",
            strUrl: "xlx",
            name: "香辣蟹",
            nPrice: 29,
        },
        ["0_8"]: {
            id: "0_8",
            strUrl: "hswcy",
            name: "红烧武昌鱼",
            nPrice: 19,
        },
        ["0_9"]: {
            id: "0_9",
            strUrl: "kljc",
            name: "可乐鸡翅",
            nPrice: 19,
        },
        ["0_10"]: {
            id: "0_10",
            strUrl: "lc",
            name: "腊肠",
            nPrice: 9,
        },
        ["0_11"]: {
            id: "0_11",
            strUrl: "qjrs",
            name: "青椒肉丝",
            nPrice: 9,
        },
        ["0_12"]: {
            id: "0_12",
            strUrl: "qzly",
            name: "清蒸鲈鱼",
            nPrice: 9,
        },
        ["0_13"]: {
            id: "0_13",
            strUrl: "wdrm",
            name: "豌豆肉末",
            nPrice: 9,
        },
        ["0_14"]: {
            id: "0_14",
            strUrl: "st",
            name: "蒜苔炒腊肉",
            nPrice: 9,
        },
        ["0_15"]: {
            id: "0_15",
            strUrl: "gbr",
            name: "锅包肉",
            nPrice: 19,
        },
        ["1_1"]: {
            id: "1_1",
            strUrl: "jdht",
            name: "鸡蛋火腿",
            nPrice: 1,
        },
        ["1_2"]: {
            id: "1_2",
            strUrl: "jhjd",
            name: "韭黄鸡蛋",
            nPrice: 1,
        },

        ["1_3"]: {
            id: "1_3",
            strUrl: "qjjd",
            name: "青椒鸡蛋",
            nPrice: 1,
        },
        ["1_4"]: {
            id: "1_4",
            strUrl: "ssbc",
            name: "手撕包菜",
            nPrice: 1,
        },
        ["1_5"]: {
            id: "1_5",
            strUrl: "shq",
            name: "上海青",
            nPrice: 1,
        },
        ["1_6"]: {
            id: "1_6",
            strUrl: "tds",
            name: "土豆丝",
            nPrice: 1,
        },
        ["1_7"]: {
            id: "1_7",
            strUrl: "gbos",
            name: "干煸藕丝",
            nPrice: 9,
        },
        ["1_8"]: {
            id: "1_8",
            strUrl: "fqjd",
            name: "番茄鸡蛋",
            nPrice: 1,
        },
        ["1_9"]: {
            id: "1_9",
            strUrl: "tdht",
            name: "土豆火腿",
            nPrice: 1,
        },
        ["1_10"]: {
            id: "1_10",
            strUrl: "hysc",
            name: "耗油生菜",
            nPrice: 1,
        },
        ["2_1"]: {
            id: "2_1",
            strUrl: "ympgt",
            name: "玉米排骨汤",
            nPrice: 19,
        },
        ["2_2"]: {
            id: "2_2",
            strUrl: "hdpgt",
            name: "海带排骨汤",
            nPrice: 19,
        },
        ["2_3"]: {
            id: "2_3",
            strUrl: "fqjdt",
            name: "番茄鸡蛋汤",
            nPrice: 1,
        },
        ["2_4"]: {
            id: "2_4",
            strUrl: "zcdht",
            name: "紫菜蛋花汤",
            nPrice: 1,
        },
        ["2_5"]: {
            id: "2_5",
            strUrl: "ot",
            name: "筒子骨藕汤",
            nPrice: 19,
        },
        ["3_1"]: {
            id: "3_1",
            strUrl: "glsj",
            name: "干捞水饺",
            nPrice: 1,
        },
        ["3_2"]: {
            id: "3_2",
            strUrl: "jj",
            name: "煎饺",
            nPrice: 1,
        },
        ["3_3"]: {
            id: "3_3",
            strUrl: "zbz",
            name: "蒸包子",
            nPrice: 1,
        },
        ["3_4"]: {
            id: "3_4",
            strUrl: "zdp",
            name: "煮豆皮",
            nPrice: 1,
        },
        ["3_5"]: {
            id: "3_5",
            strUrl: "szb",
            name: "手抓饼",
            nPrice: 1,
        },
        ["3_6"]: {
            id: "3_6",
            strUrl: "cpm",
            name: "炒泡面",
            nPrice: 1,
        },
        ["3_7"]: {
            id: "3_7",
            strUrl: "dcf",
            name: "蛋炒饭",
            nPrice: 1,
        },
        ["3_8"]: {
            id: "3_8",
            strUrl: "zjd",
            name: "蒸鸡蛋",
            nPrice: 1,
        },
        ["3_9"]: {
            id: "3_9",
            strUrl: "dt",
            name: "蛋挞",
            nPrice: 1,
        },
        ["3_10"]: {
            id: "3_10",
            strUrl: "kc",
            name: "烤肠",
            nPrice: 1,
        },
        ["3_11"]: {
            id: "3_11",
            strUrl: "rjmx",
            name: "肉酱米线",
            nPrice: 1,
        },
        ["3_12"]: {
            id: "3_12",
            strUrl: "hg",
            name: "火锅",
            nPrice: 1,
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
