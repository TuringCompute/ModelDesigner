import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"
import {DataStore} from "../../../external/turingDiv.js/lib/dataStore.js"
import {Format} from "../../../external/turingDiv.js/lib/format.js"
import {ModelPropEditor} from "../property/property.js"
import {ModelViewer} from "../viewer/viewer.js"

class ModelEditor extends DivEle{
    static childProperty = "ModelEditorProperty"
    static childViewer = "ModelEditorViewer"


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
    }

    init_children(){
        new ModelPropEditor({
            "childId": ModelEditor.childProperty,
            "parentId": this.id
        })
        new ModelViewer({
            "childId": ModelEditor.childViewer,
            "parentId": this.id
        })
    }

    outputHTML(){
        let cProp = this.children.getValue(ModelEditor.childProperty)
        let cViewer = this.children.getValue(ModelEditor.childViewer)
        let htmlList = []
        htmlList.push("<table><tr>")
        if(this.layout.hidden.indexOf(ModelEditor.childProperty) == -1){
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

export {ModelEditor}
