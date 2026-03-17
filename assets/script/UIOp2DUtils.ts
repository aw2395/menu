import {
    Color,
    Component,
    EventHandler,
    EventTouch,
    Label,
    Material,
    Node,
    RichText,
    Sprite,
    UIOpacity,
    UIRenderer,
    UITransform,
    Vec2,
    Vec3,
    Widget,
    __private,
    color,
    math,
    sp,
    tween,
} from "cc";

export class UIOp2DUtils {
    public static convertNode(node: Node | Component | undefined): Node {
        return node instanceof Component ? node.node : node!;
    }
    public static getComponent<T extends Component>(node: Node | Component, classConstructor: __private.__types_globals__Constructor<T>) {
        node = UIOp2DUtils.convertNode(node);
        let comp = node.getComponent(classConstructor);
        if (!comp) {
            comp = node.addComponent(classConstructor);
            // comp = node.getComponent(classConstructor);
        }
        return comp as T;
    }
    public static getUITransform(node: Node | Component) {
        node = UIOp2DUtils.convertNode(node);
        return this.getComponent<UITransform>(node, UITransform);
    }

    public static setOpacity(node: Node | Component, alpha: number) {
        let uiOpacity = this.getComponent<UIOpacity>(node, UIOpacity);
        uiOpacity!.opacity = Math.floor(alpha * 255);
    }

    public static getOpacity(node: Node | Component) {
        let uiOpacity = this.getComponent<UIOpacity>(node, UIOpacity);
        return uiOpacity!.opacity;
    }

    /**设置坐标 */
    public static setPos(node: Node | Component, x: number, y: number) {
        node = UIOp2DUtils.convertNode(node);
        node.setPosition(x, y, 0);
    }
    public static setPosX(node: Node | Component, x: number) {
        node = UIOp2DUtils.convertNode(node);
        node.setPosition(x, node.getPosition().y, 0);
    }
    public static setPosY(node: Node | Component, y: number) {
        node = UIOp2DUtils.convertNode(node);
        node.setPosition(node.getPosition().x, y, 0);
    }
    /**根据左上角锚点和坐标 */
    public static setLTPos(node: Node | Component, x: number, y: number) {
        node = UIOp2DUtils.convertNode(node);
        node.setPosition(x, -y, 0);
    }
    public static setLTPosX(node: Node | Component, x: number) {
        node = UIOp2DUtils.convertNode(node);
        node.setPosition(x, node.getPosition().y, 0);
    }
    public static setLTPosY(node: Node | Component, y: number) {
        node = UIOp2DUtils.convertNode(node);
        node.setPosition(node.getPosition().x, -y, 0);
    }
    public static getLTPos(node: Node | Component) {
        node = UIOp2DUtils.convertNode(node);
        return { x: node.getPosition().x, y: -node.getPosition().y };
    }
    public static getLTPosX(node: Node | Component) {
        node = UIOp2DUtils.convertNode(node);
        return node.getPosition().x;
    }
    public static getLTPosY(node: Node | Component) {
        node = UIOp2DUtils.convertNode(node);
        return -node.getPosition().y;
    }

    public static setScaleX(node: Node | Component, x: number) {
        node = UIOp2DUtils.convertNode(node);
        node.setScale(x, this.getScale(node).y);
        this.resetBtnScale(node);
    }
    public static setScaleY(node: Node | Component, y: number) {
        node = UIOp2DUtils.convertNode(node);
        node.setScale(this.getScale(node).x, y);
        this.resetBtnScale(node);
    }
    public static setScale(node: Node | Component, x: number, y: number) {
        node = UIOp2DUtils.convertNode(node);
        node.setScale(x, y);
        this.resetBtnScale(node);
    }
    public static getScale(node: Node | Component) {
        node = UIOp2DUtils.convertNode(node);
        return node.scale;
    }
    public static getScaleX(node: Node | Component) {
        node = UIOp2DUtils.convertNode(node);
        return node.scale.x;
    }
    public static getScaleY(node: Node | Component) {
        node = UIOp2DUtils.convertNode(node);
        return node.scale.y;
    }
    public static setWidth(node: Node | Component, width: number) {
        this.getUITransform(node)!.width = width;
    }
    public static getWidth(node: Node | Component) {
        return this.getUITransform(node)!.width;
    }
    public static setHeight(node: Node | Component, height: number) {
        this.getUITransform(node)!.height = height;
    }
    public static getHeight(node: Node | Component) {
        return this.getUITransform(node)!.height;
    }
    public static getWidthAndHeight(node: Node | Component) {
        let uiTransform = this.getUITransform(node);
        return [uiTransform!.width, uiTransform!.height];
    }
    public static setWidthAndHeight(node: Node | Component, width: number, height: number) {
        let uiTransform = this.getUITransform(node);
        uiTransform!.width = width;
        uiTransform!.height = height;
    }

    public static setRotation(node: Node | Component, rotation: number) {
        node = UIOp2DUtils.convertNode(node);
        node.angle = rotation;
    }
    public static setZIndex(node: Node | Component, idx: number) {
        node = UIOp2DUtils.convertNode(node);
        node.setSiblingIndex(Math.floor(idx));
    }

    public static setAnchorXY(node: Node | Component, anchorX?: number, anchorY?: number) {
        node = UIOp2DUtils.convertNode(node);
        let uiTransform = this.getUITransform(node)!;
        if (anchorX != undefined) uiTransform.anchorX = anchorX;
        if (anchorY != undefined) uiTransform.anchorY = anchorY;
    }

    /**
     * 创建事件
     * @param {cc.Component} component 组件脚本
     * @param {string} handlerName 触发函数名称
     * @param {cc.Node} node 组件所在node（不传的情况下取component.node）
     * @returns cc.Component.EventHandler
     */
    public static createEvt(component: Component | any, handlerName: string, node: Node | null = null) {
        if (!component.isValid) return; //有些异步加载的，节点以及销毁了。
        component["comName"] =
            component["comName"] ||
            component.name
                .match(/\<(.*?)\>/g)
                .pop()
                .replace(/\<|>/g, "");
        let evt = new EventHandler();
        evt.target = node || component.node;
        evt.component = component["comName"];
        evt.handler = handlerName;
        return evt;
    }

    /**
     * 给按钮添加点击事件和点击效果
     * 输入：按钮元素，touch_end点击事件，作用域，参数，是否缩放，touch_start点击事件，点击间隔时间
     * sOption->data: any = null,bStatus: boolean = true,playSound: boolean = true,onTouchBenginFun: Function = null,nNeedClickInterval: number = 500
     */
    public static createScaleBtn(displayObj: Node | Component, onTouchEndFun: Function | null = null, thisObject: any, sOption: any = null): Node {
        if (displayObj == null) {
            console.info("======displayObj is null======");
            return;
        }
        let scaleX: number = 0.9;
        let scaleY: number = 0.9;
        displayObj = UIOp2DUtils.convertNode(displayObj);
        UIOp2DUtils.removeBtnScaleEffect(displayObj, onTouchEndFun, thisObject);
        sOption = sOption || {};
        sOption.bStatus = sOption.bStatus == undefined ? true : sOption.bStatus;
        sOption.playSound = sOption.playSound == undefined ? true : sOption.playSound;
        sOption.nNeedClickInterval = sOption.nNeedClickInterval == undefined ? 500 : sOption.nNeedClickInterval;
        // 去掉间隔时间
        sOption.nNeedClickInterval = 0;
        let obj = displayObj as any;
        let oldScaleX = displayObj ? displayObj.scale.x : 1;
        let oldScaleY = displayObj ? displayObj.scale.y : 1;
        obj["enabled"] = true;
        //保存第一次调用时缩放值
        obj["$_firstScale"] = { x: oldScaleX, y: oldScaleY };
        let onBtnTouchBenginFun = function (e: EventTouch) {
            if (sOption) {
                e.propagationStopped = !sOption.bContinueEvent;
                e.preventSwallow = !!sOption.bContinueEvent;
            }
            if (!obj || !obj.enabled) {
                console.info("UIOp2DUtils ~ onBtnTouchBenginFun ~ obj:");
                return;
            }
            if (obj["$_firstScale"]) {
                (oldScaleX = obj["$_firstScale"].x), (oldScaleY = obj["$_firstScale"].y);
            }
            sOption.bStatus && displayObj && (<Node>displayObj).setScale(oldScaleX * scaleX, oldScaleY * scaleY, 1);
            if (sOption.onTouchBenginFun) {
                let uiOpacity = displayObj ? displayObj.getComponent(UIOpacity) : null;
                if (uiOpacity && !uiOpacity.opacity) {
                    console.info("UIOp2DUtils ~ onBtnTouchBenginFun ~ uiOpacity:", uiOpacity);
                    return;
                }
                sOption.onTouchBenginFun?.apply(thisObject, [e, sOption.data]);
            }
        };
        let onBtnTouchEndFun = function (e: EventTouch) {
            if (sOption) {
                e.propagationStopped = !sOption.bContinueEvent;
                e.preventSwallow = !!sOption.bContinueEvent;
            }
            if (!obj || !obj.enabled) {
                console.info("UIOp2DUtils ~ hitCallback ~ obj:");
                return;
            }
            if (obj["$_firstScale"]) {
                (oldScaleX = obj["$_firstScale"].x), (oldScaleY = obj["$_firstScale"].y);
            }
            sOption.bStatus && (<Node>displayObj).setScale(oldScaleX, oldScaleY, 1);
            if (onTouchEndFun) {
                let uiOpacity = displayObj.getComponent(UIOpacity);
                if (uiOpacity && !uiOpacity.opacity) {
                    console.info("UIOp2DUtils ~ hitCallback ~ uiOpacity:", uiOpacity);
                    return;
                }
                onTouchEndFun.apply(thisObject, [e, sOption.data]);
            }
        };
        let onBtnTouchCancelFun = function (e: EventTouch) {
            if (obj["$_firstScale"]) {
                (oldScaleX = obj["$_firstScale"].x), (oldScaleY = obj["$_firstScale"].y);
            }
            sOption.bStatus && (<Node>displayObj).setScale(oldScaleX, oldScaleY, 1);
            // 处理当在按钮的边界上，TOUCH_START时，按钮被缩小后，touchend计算时因为被缩小了，导致不在按钮的可点击区域内，
            // 所以需要重新计算是否在按钮的触摸区域内
            // let transformComp = displayObj ? (<Node>displayObj).getComponent(UITransform) : null;
            // if(transformComp) {
            //     let hit = transformComp.hitTest(e.getLocation());
            //     hit && hitCallback(e);
            // }
            if (sOption) e.preventSwallow = sOption.bContinueEvent;
        };
        let onBtnTouchMoveFun = function (e: EventTouch) {
            if (sOption) e.preventSwallow = sOption.bContinueEvent;
        };
        obj["onBtnTouchBenginFun"] = onBtnTouchBenginFun;
        obj["onBtnTouchEndFun"] = onBtnTouchEndFun;
        obj["onBtnTouchCancelFun"] = onBtnTouchCancelFun;
        obj["onBtnTouchMoveFun"] = onBtnTouchMoveFun;
        displayObj.on(Node.EventType.TOUCH_START, onBtnTouchBenginFun, this);
        displayObj.on(Node.EventType.TOUCH_END, onBtnTouchEndFun, this);
        displayObj.on(Node.EventType.TOUCH_CANCEL, onBtnTouchCancelFun, this);
        displayObj.on(Node.EventType.TOUCH_MOVE, onBtnTouchMoveFun, this);

        return displayObj;
    }

    /**移除按钮监听 */
    public static removeBtnScaleEffect(displayObj: Node, onTouchTapFun?: Function, thisObject?: any): void {
        if (displayObj) {
            let nodeany = displayObj as any;
            displayObj.off(Node.EventType.TOUCH_START, nodeany.onBtnTouchBenginFun, this);
            displayObj.off(Node.EventType.TOUCH_END, nodeany.onBtnTouchEndFun, this);
            displayObj.off(Node.EventType.TOUCH_CANCEL, nodeany.onBtnTouchCancelFun, this);
            displayObj.off(Node.EventType.TOUCH_MOVE, nodeany.onBtnTouchMoveFun, this);
            nodeany["onBtnTouchBenginFun"] = null;
            nodeany["onBtnTouchEndFun"] = null;
            nodeany["onBtnTouchCancelFun"] = null;
            nodeany["onBtnTouchMoveFun"] = null;
            if (nodeany["$_firstScale"]) displayObj.setScale(nodeany["$_firstScale"].x, nodeany["$_firstScale"].y, 1); //用于无法触发TouchEnd异常时的还原处理
        }
    }

    /**按钮缩放变化后执行此方法重置初始缩放,只针对注册过点击事件的 */
    public static resetBtnScale(displayObj: Node): void {
        if (displayObj == null) {
            console.info("======displayObj is null======");
            return;
        }
        displayObj = UIOp2DUtils.convertNode(displayObj);
        if (displayObj["$_firstScale"]) {
            let oldScaleX = displayObj ? displayObj.scale.x : 1;
            let oldScaleY = displayObj ? displayObj.scale.y : 1;
            displayObj["$_firstScale"] = { x: oldScaleX, y: oldScaleY };
        }
    }

    /**默认文字描边置灰颜色*/
    public static gray_labelOutline = "#8e8e8e";
    /**遍历节点  置灰图片 文字描边颜色  不改变置灰状态的节点名*/
    public static setGray(node: Node | Component, bGray: boolean, grayColor: string = this.gray_labelOutline, strNotChange: string[] = []) {
        node = UIOp2DUtils.convertNode(node);
        if (strNotChange.length && strNotChange.indexOf(node.name) >= 0) {
            return;
        }
        let sprite = node.getComponent(Sprite);
        //  图片置灰
        if (sprite) {
            sprite.grayscale = bGray;
        }
        //spine动画关闭
        let spine = node.getComponent(sp.Skeleton);
        if (spine) {
            spine.node.active = !bGray;
        }
        //文字描边置灰
        if (grayColor || !bGray) {
            let glb = node.getComponent(Label);
            if (glb) {
                this.setLabelOutGray(glb, bGray, grayColor);
            }
        }
        let children = node.children;
        if (children.length > 0) {
            for (let i: number = 0; i < children.length; i++) {
                this.setGray(children[i], bGray, grayColor, strNotChange);
            }
        }
    }

    /**label描边置灰 */
    public static setLabelOutGray(comp: GrayOutLabel, bGray: boolean, grayColor = this.gray_labelOutline) {
        let hasGray = !!comp.$hasGray;
        if (hasGray == bGray) {
            return;
        }
        //  已经是灰 还原
        if (hasGray) {
            comp.$hasGray = false;
            comp.outlineColor = comp.$saveData ?? Color.WHITE;
        } else {
            if (grayColor) {
                //  置灰
                comp.$hasGray = true;
                comp.$saveData = comp.outlineColor ? comp.outlineColor.clone() : Color.WHITE;
                comp.outlineColor = this.getColor(grayColor);
            }
        }
    }

    /**根据颜色string获取color对象 */
    public static defaultColor: string = "#FFFFFF";
    private static _colorMap: Map<string, math.Color> = new Map();
    public static getColor(colorStr: string): math.Color {
        if (!colorStr) colorStr = this.defaultColor;
        colorStr = colorStr.toUpperCase();
        let colorObj = this._colorMap.get(colorStr);
        if (!colorObj) this._colorMap.set(colorStr, (colorObj = color(colorStr)));
        return colorObj;
    }

    /** 判断对象是否空 true不为空 */
    public static ifObjNull(obj: any): boolean {
        return obj && Object.keys(obj).length > 0;
    }

    /**拆分字符串1&1_2&2 */
    public static spiltStringToArray(str: string, strSplit: string[] = ["_", "&"]): string[][] {
        let arr1: string[] = str.toString().split(strSplit[0]);
        let arr2: string[][] = [];
        for (let i = 0; i < arr1.length; i++) {
            arr2.push(arr1[i].split(strSplit[1]));
        }
        return arr2;
    }

    /**节点下所有label做scale变化, 第一次变化后走callback */
    public static setLabelScale(
        node: Node | Component,
        scale: number | number[],
        oldScale: number | number[],
        time: number = 0.2,
        bRichLabel: boolean = true,
        callBack?: Function
    ) {
        node = UIOp2DUtils.convertNode(node);
        let label = node.getComponent(Label);
        let newCallBack: Function = callBack;
        if (label) {
            let richText = node.getComponent(RichText);
            if (!richText || bRichLabel) {
                newCallBack = null;
                let scaleX: number = scale[0] || scale;
                let scaleY: number = scale[1] || scale;
                let oldScaleX: number = oldScale[0] || oldScale;
                let oldScaleY: number = oldScale[1] || oldScale;
                tween(node)
                    .to(time, { scale: new Vec3(scaleX, scaleY, 1) })
                    .to(time, { scale: new Vec3(oldScaleX, oldScaleY, 1) })
                    .call(() => {
                        if (callBack) {
                            callBack();
                        }
                    })
                    .start();
            }
        }
        let children = node.children;
        if (children.length > 0) {
            for (let i: number = 0; i < children.length; i++) {
                this.setLabelScale(children[i], scale, oldScale, time, bRichLabel, newCallBack);
            }
        }
    }

    /**高斯模糊通用模糊度 */
    public static getDefaultBlur() {
        return 0.4;
    }

    /**设置图片模糊大小 */
    public static setBlurTexSize(grpSprite: Node, width: number, height: number) {
        let meterial: Material = grpSprite.getComponent(UIRenderer).getSharedMaterial(0);
        if (!meterial) {
            return;
        }
        meterial.setProperty("textureSize", new Vec2(width, height));
    }

    /**更新节点及其子节点的widget */
    public static updateWidget(node: Node | Component) {
        node = UIOp2DUtils.convertNode(node);
        let widget = node.getComponent(Widget);
        if (widget) {
            widget.updateAlignment();
        }
        let children = node.children;
        if (children.length > 0) {
            for (let i: number = 0; i < children.length; i++) {
                this.updateWidget(children[i]);
            }
        }
    }

    /**执行节点方法缩放动效 */
    public static setScaleAni(node: Node | Component, scaleStart: number = 1.2, scaleEnd: number = 1, time: number = 0.1) {
        node = UIOp2DUtils.convertNode(node);
        tween(node)
            .to(time, { scale: new Vec3(scaleStart, scaleStart, scaleStart) })
            .to(time, { scale: new Vec3(scaleEnd, scaleEnd, scaleEnd) })
            .start();
    }

    /**节点呼吸循环缩放动效 */
    public static setBreatheScaleAni(node: Node | Component, scaleStart: Vec3, scaleEnd: Vec3, time: number = 0.4) {
        node = UIOp2DUtils.convertNode(node);
        tween(node).to(time, { scale: scaleStart }).to(time, { scale: scaleEnd }).union().repeatForever().start();
    }
}

export class GrayOutLabel extends Label {
    $hasGray?: boolean;
    $saveData?: Color;
}
