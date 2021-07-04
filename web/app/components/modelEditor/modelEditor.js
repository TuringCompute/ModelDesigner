import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"
import {DataStore} from "../../../external/turingDiv.js/lib/dataStore.js"
import {Format} from "../../../external/turingDiv.js/lib/format.js"
import {ModelPropEditor} from "../property/property.js"
import {ModelViewer} from "../ModelViewer/modelViewer.js"
import {ModelList} from "../modelList/modelList.js"
import {MenuReg} from "../../../external/turingDiv.js/component/menuReg/menuReg.js"
import {EventSrc} from "../../../external/turingDiv.js/lib/event.js"
import {WinEle} from "../../../external/turingDiv.js/component/window/window.js"


class ModelEditor extends DivEle{
    static Keys = Object.freeze({
        "catDataId": "ModelEditorCatalogDataId",
        "childProperty": "ModelEditorProperty",
        "childIconList": "ModelEditorIconList",
        "childViewer": "ModelEditorViewer",
        "menuView": "menuModelDesignerView"
    })

    constructor(props){
        super(props)
        let data = DataStore.GetStore()
        this.dataBag = data.newData(this.id, DataStore.subscriber(this.id, this.handleEvent))
        this.init_children()
        let menuReg = MenuReg.GetMenu()
        let menuView = this.children.getValue(ModelEditor.Keys.menuView).node
        menuReg.registerMenu(menuView)
        this.displayOptions = menuView.options
    }

    init_children(){
        let propWin = new WinEle({
            "childId": ModelEditor.Keys.childProperty,
            "parentId": this.id,
            "title": "Properties",
            "enableMove": false,
            "enableResize": false,
            "enableResizeRight": true            
        })
        new ModelPropEditor({
            "childId": ModelEditor.Keys.childProperty,
            "parentId": propWin.id
        })
        let viewWin = new WinEle({
            "childId": ModelEditor.Keys.childViewer,
            "title": "Model Viewer",
            "parentId": this.id,
            "enableMove": false,
            "enableResize": false
        })
        new ModelViewer({
            "childId": ModelEditor.Keys.childViewer,
            "parentId": viewWin.id
        })
        new MenuView({
            "childId": ModelEditor.Keys.menuView,
            "parentId": this.id,
            "options": [
                {
                    "menuDisplay": "Property Window",
                    "childId": ModelEditor.Keys.childProperty,
                    "selected" : true
                },
                {
                    "menuDisplay": "Viewer Window",
                    "childId": ModelEditor.Keys.childViewer,
                    "selected" : true
                }
            ]
        })
    }

    outputHTML(){
        let htmlList = []
        htmlList.push("<table style='width:100%; height:100%; border: 0px;border-collapse: collapse;'><tr>")
        if(this.displayOptions[0].selected){
            htmlList.push("<td style='vertical-align: top;'>")
            let editor = this.children.getValue(ModelEditor.Keys.childProperty).node
            let propertyHtml = editor.outputHTML()
            Format.applyIndent(propertyHtml)
            htmlList.push(...propertyHtml)
            htmlList.push("</td>")
        }
        htmlList.push("<td style='vertical-align: top;width: 100%;'>")
        let modelViewerHtml = this.children.getValue(ModelEditor.Keys.childViewer).node.outputHTML()
        Format.applyIndent(modelViewerHtml)
        htmlList.push(...modelViewerHtml)        
        htmlList.push("</td>")
        htmlList.push("</tr></table>")
        this.addDivEleFrame(htmlList)
        return htmlList
    }

    processEvent(eventObj){
        if(eventObj.type == DataStore.dataChanged){
            return true
        } else if(eventObj.type == WinEle.Event.closed || eventObj.type == MenuView.Event.optSwitch){
            for(let dispOpt of this.displayOptions){
                let childNode = this.children.getValue(dispOpt.childId).node
                if(eventObj.type == WinEle.Event.closed){
                    dispOpt.selected = !childNode.closed
                } else {
                    childNode.closed = !dispOpt.selected
                }
            }
            return true
        }
        return false
    }
}

class MenuView extends DivEle{
    static Event = Object.freeze({
        "optSwitch": "ModelEditorDisplayMenuOptSwitch"
    })

    static Key = Object.freeze({
        "optionDataId": "MenuViewOptionDataId"        
    })

    constructor(props){
        super(props)
        this.validateOptions()
        this.menuId = ModelEditor.Keys.menuView
        this.menuReg = MenuReg.GetMenu()
    }

    validateOptions(){
        if(!this.options || !Array.isArray(this.options) || this.options.length == 0){
            throw Error("Invalid options, null, not array or zero length")
        }
        let optItem = null;
        for(let idx=0; idx<this.options.length; idx++){
            optItem = this.options[idx]
            for(let attr of ["menuDisplay", "childId", "selected"]){
                if(!optItem.hasOwnProperty(attr)){
                    throw Error("missing attr [" + attr + "] @options[" + idx + "]")
                }
                if(typeof optItem.selected != "boolean"){
                    throw Error("selected attr @options[" + idx + "] should be boolean")
                }
            }
        }
    }

    processEvent(eventObj){
        if(eventObj.type == MenuView.Event.optSwitch){
            if(eventObj.data.hasOwnProperty("idx") && this.options[eventObj.data.idx]){
                if(this.options[eventObj.data.idx].selected){
                    this.options[eventObj.data.idx].selected = false
                } else {
                    this.options[eventObj.data.idx].selected = true
                }
            }
            this.menuReg.handleEvent(EventSrc.new(MenuReg.Events.hide, null, null))            
            return true
        }
        return false
    }

    outputHTML(){
        let htmlList = ["<table border=1>"]
        let selected = ""
        for(let idx=0; idx<this.options.length; idx ++){
            if(this.options[idx].selected){
                selected = "&#10004;"
            } else {
                selected = "&nbsp;"
            }
            htmlList.push("  <tr style='cursor: pointer;' onClick='" + this.eventTriger(EventSrc.new(MenuView.Event.optSwitch, null, {"idx": idx})) + "'>")
            htmlList.push("    <td>" + this.options[idx].menuDisplay + " " + selected + "</td>")
            htmlList.push("  </tr>")
        }
        htmlList.push("</table>")
        this.addDivEleFrame(htmlList)
        return htmlList
    }
}


export {ModelEditor}
