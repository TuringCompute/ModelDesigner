import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"
import {Format} from "../../../external/turingDiv.js/lib/format.js"
import {MouseState} from "../../../external/turingDiv.js/lib/mouse.js"
import {EventSrc} from "../../../external/turingDiv.js/lib/event.js"
import {TabSwitch} from "../../../external/turingDiv.js/component/tabSwitch/tabSwitch.js"
import {EditList, TableList} from "../../../external/turingDiv.js/component/tableList/tableList.js"
import {FormEditor} from "../../../external/turingDiv.js/component/formEditor/formEditor.js"
import {DataStore} from "../../../external/turingDiv.js/lib/dataStore.js"
import {Schema, Catalog} from "../../data/catalog.js"

class ModelPropEditor extends DivEle{
    static Keys = Object.freeze({
        "dataId": "editingModelDataId",
        "section": "modelPropertySection",
        "attrList": "modelPropertyList",
        "attrEditor": "modelPropertyEditor",
    })

    static Tabs = Object.freeze([
        { "input": "Inputs" }, 
        { "common": "Common"}, 
        { "instance": "Instance"}, 
        { "children": "Children"}
    ])

    static Events = Object.freeze({
        "sectionChanged": "ModelPropWindowSectionChanged",
        "hideProperty": "ModelPropWindow"
    });

    constructor(props){
        super(props)
        this.width = 300
        this.widthIncre = 0
        this.divHeight = 400
        this.divHeightIncre = 0
        this.store = DataStore.GetStore()
        this.dataBag = this.store.newData(this.id, DataStore.subscriber(this.id, this.handleEvent))
        this.initChildren()
    }

    static attrSchema(){
        return {
            "$$order": ["attrName", "type", "required", "other"],
            "attrName": {
                "type": "string"
            },
            "type": {
                "type": "string"
            },
            "required": {
                "type": "bool"
            },
            "other": {
                "type": "string"
            }
        }
    }

    static attrDisplayOrder(){
        return [["attrName", "Attribute"], ["type", "Data Type"], ["required", "Required"]]
    }

    initChildren(){
        let tabParam = {
            "parentId": this.id,
            "childId": ModelPropEditor.Keys.section,
        }
        tabParam[TabSwitch.Key.tabList] = ModelPropEditor.Tabs
        new TabSwitch(tabParam)
        let editor = new FormEditor({
            "parentId": this.id,
            "childId": ModelPropEditor.Keys.attrEditor,
            "schema": ModelPropEditor.attrSchema()
        })
        this.store.getData(editor.id, DataStore.subscriber(this.id, this.handleEvent))
        let list = new EditList({
            "parentId": this.id,
            "childId": ModelPropEditor.Keys.attrList,
            "displayOrder": ModelPropEditor.attrDisplayOrder(),
            "fieldSchema": ModelPropEditor.attrSchema()
        })
        this.store.getData(list.id, DataStore.subscriber(this.id, this.handleEvent))
    }

    childrenView(){
        let childHtml = []
        childHtml.push("<table>")
        childHtml.push("  <tr>")
        childHtml.push("    <td style='height:1px;'>")
        childHtml.push("        TODO: Add drop down for selected children here.")
        childHtml.push("    </td>")
        childHtml.push("  </tr>")
        childHtml.push("  <tr>")
        childHtml.push("    <td>")
        childHtml.push("        TODO: input definition for children.")
        childHtml.push("    </td>")
        childHtml.push("  </tr>")
        childHtml.push("</table>")
        return childHtml
    }

    propertyBody(htmlList){
        let propHtml = []
        propHtml.push("<tr><td>")
        let tab = this.children.getValue(ModelPropEditor.Keys.section).node
        let attrList = this.children.getValue(ModelPropEditor.Keys.attrList)
        let attrEditor = this.children.getValue(ModelPropEditor.Keys.attrEditor)
        let tabHtml = tab.outputHTML()
        Format.applyIndent(tabHtml)
        propHtml.push(...tabHtml)
        propHtml.push("</td></tr>")
        propHtml.push("<tr><td style='vertical-align: top; height:" + this.divHeight + "px;'>")
        let selectedTab = tab.selectedTabValue()
        if (selectedTab == "Children" ){
            let childViewHtml = []
            Format.applyIndent(childViewHtml)
            propHtml.push(...childViewHtml)
        } else {
            let attrListHtml = attrList.node.outputHTML()
            Format.applyIndent(attrListHtml)
            propHtml.push(...attrListHtml)
        }
        propHtml.push("</td></tr>")
        propHtml.push("<tr><td colspan=3 height='100%'>")
        let editorHtml = attrEditor.node.outputHTML()
        Format.applyIndent(editorHtml)
        propHtml.push(...editorHtml)
        propHtml.push("</td></tr>")
        Format.applyIndent(propHtml)
        propHtml.push("</table>")
        Format.applyIndent(propHtml)
        htmlList.push(...propHtml)
    }

    outputHTML(){
        let htmlList = []
        let width = this.width + this.widthIncre        
        htmlList.push("<table width='" + width + "px' style='border-collapse: collapse; height: 100%'>")
        htmlList.push("  <tr>")
        htmlList.push("    <td style='vertical-align: top; height: 1px; background: blue;'>")
        htmlList.push("      <table width=100%>")
        htmlList.push("        <tr>")
        htmlList.push("          <td style='color: white;'>Property</td>")
        htmlList.push("          <td style='width: 1px;'><button type='button' onclick='" + this.eventTriger(EventSrc.new(ModelPropEditor.Events.hideProperty, null, {})) + "'>X</button></td>")
        htmlList.push("        </tr>")
        htmlList.push("      </table>")
        htmlList.push("    </td>")
        htmlList.push("    <td rowspan=5 width=1px style='cursor:e-resize; background: blue;' onmousedown='" + this.eventTriger(EventSrc.new(MouseState.mouseDown, null, {"dir":"horizon"})) + "'></td>")
        htmlList.push("  </tr>")
        htmlList.push("  <tr>")
        htmlList.push("    <td style='height:1px;border-bottom: 2px solid rgba(204,31,48,1);'>")
        let tab = this.children.getValue(ModelPropEditor.Keys.section).node
        let tabHtml = tab.outputHTML()
        Format.applyIndent(tabHtml, "      ")
        htmlList.push(...tabHtml)
        htmlList.push("    </td>")
        htmlList.push("  </tr>")
        htmlList.push("  <tr>")
        let divHeight = this.divHeight + this.divHeightIncre
        htmlList.push("    <td style='vertical-align: top; height:" + divHeight + "px;'>")
        let selectedTab = tab.selectedTabValue()
        if (selectedTab == "Children" ){
            let childViewHtml = this.childrenView()
            Format.applyIndent(childViewHtml, "      ")
            htmlList.push(...childViewHtml)
        } else {
            let attrList = this.children.getValue(ModelPropEditor.Keys.attrList)
            let attrListHtml = attrList.node.outputHTML()
            Format.applyIndent(attrListHtml, "      ")
            htmlList.push(...attrListHtml)
        }
        htmlList.push("    </td>")
        htmlList.push("  </tr>")
        htmlList.push("  <tr>")
        htmlList.push("     <td height=1px style='cursor:n-resize; background: blue;'  onmousedown='" + this.eventTriger(EventSrc.new(MouseState.mouseDown, null, {"dir":"vertical"})) + "'></td>")
        htmlList.push("  </tr>")
        htmlList.push("  <tr>")
        htmlList.push("    <td style='vertical-align: top;'>")
        let attrEditor = this.children.getValue(ModelPropEditor.Keys.attrEditor)
        let editorHtml = attrEditor.node.outputHTML()
        Format.applyIndent(editorHtml, "      ")
        htmlList.push(...editorHtml)
        htmlList.push("    </td>")
        htmlList.push("  </tr>")
        htmlList.push("</table>")
        this.addDivEleFrame(htmlList)
        return htmlList
    }

    addDivEleFrame(htmlList){
        Format.applyIndent(htmlList)
        if(this.props.hasOwnProperty("zIdx")){
            htmlList.splice(0,0, "<div id='" + this.id + " style='z-index:" + this.props.zIdx + ";height: 100%;'>")
        } else {
            htmlList.splice(0,0, "<div id='" + this.id + "' style='height: 100%;'>")
        }
        htmlList.push("</div>")
    }
    processEvent(eventObj){
        let mouse = new MouseState()
        let event = eventObj[EventSrc.Key.rawEvent]
        if(eventObj.type == MouseState.mouseDown && eventObj.data.dir){
            if(this.mouseData){
                delete this.mouseData
            }
            this.mouseData = {}
            if(eventObj.data.dir == "horizon"){
                this.mouseData.x = event.x
            } else {
                this.mouseData.y = event.y
            }
            mouse.registerTarget(this)
        } else if(eventObj.type == MouseState.mouseUp){
            if(this.widthIncre != 0){
                this.width = this.width + this.widthIncre
            }
            if(this.divHeightIncre !=0 ){
                this.divHeight = this.divHeight + this.divHeightIncre
            }
            if(this.mouseData){
                delete this.mouseData
            }
            mouse.deregister()
        } else if(eventObj.type == MouseState.mouseMoved){
            if(this.mouseData){
                if(event){
                    if(this.mouseData.hasOwnProperty("x")){
                        this.widthIncre = event.x - this.mouseData.x
                        return true
                    } else if(this.mouseData.hasOwnProperty("y")){
                        this.divHeightIncre = event.y - this.mouseData.y
                        return true
                    }
                }                
            }
        } else if(eventObj.type == DataStore.dataChanged && eventObj.data[EventSrc.Key.src] != this.id){
            let attrList = this.children.getValue(ModelPropEditor.Keys.attrList).node
            let attrEditor = this.children.getValue(ModelPropEditor.Keys.attrEditor).node
            let currentId = attrEditor.dataBag[FormEditor.Key.dataId]
            if(eventObj.src == attrEditor.id){
                if(currentId == EditList.Key.new){
                    let newRecord = attrList.dataBag[EditList.Key.newRecord]
                    attrList.dataBag[EditList.Key.newRecord] = {}
                    attrList.dataBag[TableList.Key.records].push(newRecord)
                    attrEditor.dataBag[FormEditor.Key.dataId] = attrList.dataBag[TableList.Key.selectedId] = (attrList.dataBag[TableList.Key.records].length - 1).toString()
                    attrList.render()
                } else if(attrList.dataBag[TableList.Key.records][currentId]){
                    attrList.render()
                }
            } else if(eventObj.src == attrList.id){
                let editDataId = attrList.dataBag[TableList.Key.selectedId]
                if(editDataId != currentId){
                    let editData = {}
                    if(editDataId == EditList.Key.new){
                        editData = attrList.dataBag[EditList.Key.newRecord]
                    } else if (attrList.dataBag[TableList.Key.records][editDataId]) {
                        editData = attrList.dataBag[TableList.Key.records][editDataId]
                    } else {
                        editDataId = null
                        editData = {}
                    }
                    FormEditor.bindData(attrEditor.dataBag, editDataId, editData)
                    attrEditor.render()
                }
            }
        } else if(eventObj.type == TabSwitch.Event.changed){
            let tab = this.children.getValue(ModelPropEditor.Keys.section).node
            let section = tab.tabList[tab.selectedTab]
            

        }

        return false
    }
}

export {ModelPropEditor}
