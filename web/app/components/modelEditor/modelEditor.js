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
        this.dataStore = props.dataStore
        if(!this.dataStore || !(this.dataStore instanceof DataStore)){
            throw Error("Component Model Editor needs dataStore in props")
        }
        this.layoutDataId = this.id + "_menu_layout"
        this.layout = this.dataStore.newData(this.layoutDataId, DataStore.subscriber(this.layoutDataId, this.handleEvent))
        this.layout.hidden = []
        this.init_children()
        let menuReg = MenuReg.GetMenu()
        this.menuView = new MenuView({
            "parentId": menuReg.id,
            "childId": ModelEditor.Keys.menuView
        })
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
        let cProp = this.children.getValue(ModelEditor.Keys.childProperty)
        let cViewer = this.children.getValue(ModelEditor.Keys.childViewer)
        let htmlList = []
        htmlList.push("<table><tr>")
        if(this.layout.hidden.indexOf(ModelEditor.Keys.childProperty) == -1){
            htmlList.push("<td>")
            let propHtml = cProp.node.outputHTML()
            Format.applyIndent(propHtml)
            htmlList.push(...propHtml)
            htmlList.push("</td>")
        }
        let viewHtml = cViewer.node.outputHTML()
        htmlList.push("<td>")
        Format.applyIndent(viewHtml)
        htmlList.push(...viewHtml)
        htmlList.push("</td>")
        htmlList.push("</tr></table>")
        this.addDivEleFrame(htmlList)
        return htmlList
    }

}

class MenuView extends DivEle{
    constructor(props){
        super(props)
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
        return htmlList
    }

}


export {ModelEditor}
