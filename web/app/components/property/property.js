import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"
import {Format} from "../../../external/turingDiv.js/lib/format.js"
import {MouseState} from "../../../external/turingDiv.js/lib/mouse.js"
import {EventSrc} from "../../../external/turingDiv.js/lib/event.js"
import {TabSwitch} from "../../../external/turingDiv.js/component/tabSwitch/tabSwitch.js"
import {TableList} from "../../../external/turingDiv.js/component/tableList/tableList.js"
import { DataStore } from "../../../external/turingDiv.js/lib/dataStore.js"

class ModelPropEditor extends DivEle{
    static Keys = Object.freeze({
        "dataId": "editingModelDataId",
        "section": "modelPropertySection",
        "attrList": "modelPropertyList",
        "attrEditor": "modelPropertyEditor"
    })

    static Tabs = Array.freeze([
        "Inputs", "Common", "Instance", "Children"
    ])

    static Events = Object.freeze({
        "sectionChanged": "ModelPropWindowSectionChanged"
    });

    constructor(props){
        super(props)
        this.width = null
        let modelDataId = this.props[ModelPropEditor.Keys.dataId];
        this.dataBag = DataStore.GetStore().getData(modelDataId, EventSrc.subscriber(this.id, this.handleEvent))
        this.initChildren()
    }

    initChildren(){
        let tab = new TabSwitch({
            "parentId": this.id,
            "childId": ModelPropEditor.Keys.section,
        })
        tab.bindData(ModelPropEditor.Tabs)
        this.displaySectionData = DataStore.GetStore().getData(tab.id, DataStore.subscriber(this.id, this.handleEvent))
        let attrSchema = {
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
        let attrEditor = new FormEditor({
            "parentId": this.id,
            "childId": ModelPropEditor.Keys.attrEditor,
            "schema": attrSchema
        })
        let attrList = new TableList({
            "parentId": this.id,
            "childId": ModelPropEditor.Keys.attrList,
            "displayOrder": [["attrName", "Attribute"], ["type", "Data Type"], ["required", "Required"]],
            "fieldSchema": attrSchema,
            "selectDataId": attrEditor.id
        })
    }

    propertyBody(htmlList){
        let propHtml = []
        if (this.width){
            propHtml.push("<table border=1 width='" + this.width + "px'>")
        } else {
            propHtml.push("<table border=1>")
        }
        propHtml.push("<tr><td>")
        let tab = this.children.getValue(ModelPropEditor.Keys.section).node
        let attrList = this.children.getValue(ModelPropEditor.Keys.attrList)
        let attrEditor = this.children.getValue(ModelPropEditor.Keys.attrEditor)
        let tabHtml = tab.outputHTML()
        Format.applyIndent(tabHtml)
        propHtml.push(...tabHtml)
        propHtml.push("</td></tr>")
        propHtml.push("<tr><td>")
        let selectedTab = tab.selectedTabValue()
        if (selectedTab == "Children" ){
            let childViewHtml = []
            Format.applyIndent(childViewHtml)
            propHtml.push(...childViewHtml)
        } else {
            let attrListHtml = attrList.outputHTML()
            Format.applyIndent(attrListHtml)
            propHtml.push(...attrListHtml)
        }
        propHtml.push("</td></tr>")
        propHtml.push("<tr><td colspan=3 height='100%'>")
        let editorHtml = attrEditor.outputHTML()
        Format.applyIndent(editorHtml)
        propHtml.push(...editorHtml)
        propHtml.push("</td></tr>")
        Format.applyIndent(propHtml)
        propHtml.push("</table>")
        Format.applyIndent(propHtml)
        htmlList.push(...propHtml)
    }

    bodyAndBoarder(htmlList){
        let headerAndBoarder = []
        headerAndBoarder.push("<td style='vertical-align: top;'>")
        this.propertyBody(headerAndBoarder)
        headerAndBoarder.push("</td>")
        headerAndBoarder.push("<td rowspan=3 style='border-right: 4px solid #2a9df4;cursor:e-resize;' onmousedown='" + this.eventTriger(EventSrc.new(MouseState.mouseDown, null, {})) + "'></td>")
        Format.applyIndent(headerAndBoarder)
        htmlList.push(...headerAndBoarder)
    }

    outputHTML(){
        let htmlList = []
        htmlList.push("<table style='border-collapse: collapse; height: 100%'>")
        htmlList.push("<tr>")
        this.bodyAndBoarder(htmlList)
        htmlList.push("</tr>")
        htmlList.push("<tr><td>&nbsp</td></tr>")
        htmlList.push("<tr><td>&nbsp</td></tr>")
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
        if(eventObj.type == MouseState.mouseDown){
            let thisDiv = document.getElementById(this.id)
            this.mouseData = {
                "width": thisDiv.offsetWidth
            }
            mouse.registerTarget(this)
        } else if(eventObj.type == MouseState.mouseUp){
            if(this.mouseData){
                delete this.mouseData
            }
            mouse.deregister()
         } else if(eventObj.type == MouseState.mouseMoved){
            if(this.mouseData){
                let event = eventObj[EventSrc.Key.rawEvent]
                if(event){
                    this.width = event.x
                    return true    
                }                
            }
        }
        return false
    }
}

export {ModelPropEditor}
