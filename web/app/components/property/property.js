import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"
import {Format} from "../../../external/turingDiv.js/lib/format.js"
import {MouseState} from "../../../external/turingDiv.js/lib/mouse.js"
import {EventSrc} from "../../../external/turingDiv.js/lib/event.js"
import {TabSwitch} from "../../../external/turingDiv.js/component/tabSwitch/tabSwitch.js"
import {EditList, TableList} from "../../../external/turingDiv.js/component/tableList/tableList.js"
import {DataStore} from "../../../external/turingDiv.js/lib/dataStore.js"
import {Schema, Catalog} from "../../data/catalog.js"
import {OrderedDict} from "../../../external/turingDiv.js/lib/orderedDict.js"
import {AttrEditor} from "../attrEditor/attrEditor.js"

class ModelPropEditor extends DivEle{
    static Keys = Object.freeze({
        "dataId": "editingModelDataId",
        "section": "modelPropertySection",
        "attrList": "modelPropertyList",
        "attrEditor": "modelPropertyEditor",
        "selectChild": "modelPropertySelectedChild"
    })

    static Tabs = Object.freeze([
        { 
            [TabSwitch.Key.tabKey]: Schema.Key.input,
            [TabSwitch.Key.tabDisplay]: "Inputs" 
        }, 
        { 
            [TabSwitch.Key.tabKey]: Schema.Key.common,
            [TabSwitch.Key.tabDisplay]: "Common"
        }, 
        { 
            [TabSwitch.Key.tabKey]: Schema.Key.instance, 
            [TabSwitch.Key.tabDisplay]: "Instance"
        }, 
        { 
            [TabSwitch.Key.tabKey]: Schema.Key.children,
            [TabSwitch.Key.tabDisplay]: "Children"
        }
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
        this.currentSection = null
        this.currentChild = null
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
        new TabSwitch({
            "parentId": this.id,
            "childId": ModelPropEditor.Keys.section,
            [TabSwitch.Key.tabList]: ModelPropEditor.Tabs
        })
        let editor = new AttrEditor({
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
        childHtml.push("        <b>Input Definition:</b><br>")
        if (this.dataBag.hasOwnProperty(ModelPropEditor.Keys.selectChild)){
            childHtml.push("        " + this.dataBag[ModelPropEditor.Keys.selectChild])
        }else{
            childHtml.push("        Please select a child")
        }
        
        childHtml.push("    </td>")
        childHtml.push("  </tr>")
        childHtml.push("</table>")
        return childHtml
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
        if (selectedTab == Schema.Key.children ){
            let childViewHtml = this.childrenView()
            Format.applyIndent(childViewHtml, "      ")
            htmlList.push(...childViewHtml)
        }
        let attrList = this.children.getValue(ModelPropEditor.Keys.attrList).node
        let attrListHtml = attrList.outputHTML()
        Format.applyIndent(attrListHtml, "      ")
        htmlList.push(...attrListHtml)
        htmlList.push("    </td>")
        htmlList.push("  </tr>")
        htmlList.push("  <tr>")
        htmlList.push("     <td height=1px style='cursor:n-resize; background: blue;'  onmousedown='" + this.eventTriger(EventSrc.new(MouseState.mouseDown, null, {"dir":"vertical"})) + "'></td>")
        htmlList.push("  </tr>")
        htmlList.push("  <tr>")
        htmlList.push("    <td style='vertical-align: top;'>")
        let attrEditor = this.children.getValue(ModelPropEditor.Keys.attrEditor).node
        let editorHtml = attrEditor.outputHTML()
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
            if(eventObj.src == attrEditor.id){
                this.refreshList(attrList, attrEditor)
            } else if(eventObj.src == attrList.id){
                this.refreshEditor(attrList, attrEditor)
            }
        } else if(eventObj.type == TabSwitch.Event.changed){
            let tab = this.children.getValue(ModelPropEditor.Keys.section).node
            let section = tab.selectedTabValue()
            let shouldRender = false
            if(section == Schema.Key.children ||this.currentSection == Schema.Key.children){
                shouldRender = true
            }
            this.currentSection = section
            if(this.dataBag.hasOwnProperty(Catalog.Key.model)){
                if(section == Schema.Key.children){
                    // display children section with drop down list of children
                    let children = new OrderedDict(this.dataBag[Catalog.Key.model][Schema.Key.children])
                } else {
                    // display selected attribute section in current model
                    let sectionAttrList = Schema.getPropertySection(this.dataBag[Catalog.Key.model], section)        
                    let attrList = this.children.getValue(ModelPropEditor.Keys.attrList).node
                    attrList.dataBag[TableList.Key.records] = sectionAttrList
                    attrList.dataBag[EditList.Key.newRecord] = {}
                    if(attrList.dataBag.hasOwnProperty(TableList.Key.selectedId)){
                        delete attrList.dataBag[TableList.Key.selectedId]
                        this.refreshEditor(attrList, attrEditor)
                    }
                }    
            }            
            return true
        }

        return false
    }

    refreshEditor(attrList, attrEditor){
        let currentId = attrEditor.dataBag.hasOwnProperty(AttrEditor.Key.dataId)? attrEditor.dataBag[AttrEditor.Key.dataId] : -1
        let editDataId = attrList.dataBag.hasOwnProperty(TableList.Key.selectedId)? attrList.dataBag[TableList.Key.selectedId] : -1
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
            AttrEditor.bindData(attrEditor.dataBag, editDataId, editData)
            attrEditor.render()
        }
    }

    refreshList(attrList, attrEditor){
        let currentId = attrEditor.dataBag.hasOwnProperty(AttrEditor.Key.dataId)? attrEditor.dataBag[AttrEditor.Key.dataId] : -1
        if(currentId == EditList.Key.new){
            let newRecord = attrList.dataBag[EditList.Key.newRecord]
            attrList.dataBag[EditList.Key.newRecord] = {}
            attrList.dataBag[TableList.Key.records].push(newRecord)
            attrEditor.dataBag[AttrEditor.Key.dataId] = attrList.dataBag[TableList.Key.selectedId] = (attrList.dataBag[TableList.Key.records].length - 1).toString()
            attrList.render()
        } else if(attrList.dataBag[TableList.Key.records][currentId]){
            attrList.render()
        }

    }

}

export {ModelPropEditor}
