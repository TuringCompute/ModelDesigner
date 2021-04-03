import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"
import {DataStore} from "../../../external/turingDiv.js/lib/dataStore.js"
import {Format} from "../../../external/turingDiv.js/lib/format.js"
import {ModelPropEditor} from "../property/property.js"
import {ModelViewer} from "../viewer/viewer.js"
import {MenuReg} from "../../../external/turingDiv.js/component/menuReg/menuReg.js"

class ModelEditor extends DivEle{
    static Keys = Object.freeze({
        "childProperty": "ModelEditorProperty",
        "childViewer": "ModelEditorViewer",
        "menuView": "menuModelDesignerView"
    })

    constructor(props){
        super(props)
        this.layoutDataId = this.id + "_menu_layout"
        this.layout = DataStore.GetStore().newData(this.layoutDataId, DataStore.subscriber(this.layoutDataId, this.handleEvent))
        this.init_children()
        let menuReg = MenuReg.GetMenu()
        this.menuView = new MenuView({
            "parentId": menuReg.id,
            "childId": ModelEditor.Keys.menuView,
            "options": [ModelEditor.Keys.childProperty, ModelEditor.Keys.childViewer]
        })
        this.menuView.selection[MenuView.selected] = this.children.listAttr()
    }

    init_children(){
        new ModelPropEditor({
            "childId": ModelEditor.Keys.childProperty,
            "parentId": this.id
        })
        new ModelViewer({
            "childId": ModelEditor.Keys.childViewer,
            "parentId": this.id
        })
    }

    outputHTML(){
        let htmlList = []
        htmlList.push("<table width=100% style='height:100%; border: 0px;border-collapse: collapse;'><tr>")
        let dispChildren = this.menuView.selection[MenuView.selected]
        if(dispChildren.length > 0){
            for(let idx = 0; idx<dispChildren.length; idx ++){
                if(idx == dispChildren.length - 1){
                    htmlList.push("<td style='vertical-align: top;width: 100%;'>")
                } else {
                    htmlList.push("<td style='vertical-align: top;'>")
                }
                let childRef = this.children.getValue(dispChildren[idx])
                let cHtml = childRef.node.outputHTML()
                Format.applyIndent(cHtml)
                htmlList.push(...cHtml)
                htmlList.push("</td>")
            }
        } else {
            htmlList.push("<td></td>")
        }
        htmlList.push("</tr></table>")
        this.addDivEleFrame(htmlList)
        return htmlList
    }
}

class MenuView extends DivEle{
    static selected = "menuViewSelected"

    constructor(props){
        super(props)
        this.dataId = this.id + "_selection"
        this.selection = DataStore.GetStore().newData(this.dataId, DataStore.subscriber(this.id, this.handleEvent))
        this.selection[MenuView.selected] = []
    }

    processEvent(eventObj){
        return false
    }

    outputHTML(){
        let htmlList = [
            "<table border=1>",
            "  <tr>",
            "    <td onClick='alert(1)'>line 1</td>",
            "  </tr>",
            "  <tr>",
            "    <td onClick='alert(2)'>line 2</td>",
            "  </tr>",
            "</table>"
        ]
        this.addDivEleFrame(htmlList)
        return htmlList
    }
}


export {ModelEditor}
