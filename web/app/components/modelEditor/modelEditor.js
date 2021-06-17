import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"
import {DataStore} from "../../../external/turingDiv.js/lib/dataStore.js"
import {Format} from "../../../external/turingDiv.js/lib/format.js"
import {ModelPropEditor} from "../property/property.js"
import {ModelViewer} from "../ModelViewer/modelViewer.js"
import {MenuReg} from "../../../external/turingDiv.js/component/menuReg/menuReg.js"
import {EventSrc} from "../../../external/turingDiv.js/lib/event.js"

class ModelEditor extends DivEle{
    static Keys = Object.freeze({
        "catDataId": "ModelEditorCatalogDataId",
        "childProperty": "ModelEditorProperty",
        "childViewer": "ModelEditorViewer",
        "menuView": "menuModelDesignerView"
    })

    constructor(props){
        super(props)
        let data = DataStore.GetStore()
        this.dataBag = data.newData(this.id, DataStore.subscriber(this.id, this.handleEvent))
        this.init_children()
        let menuReg = MenuReg.GetMenu()
        let menuView = new MenuView({
            "parentId": menuReg.id,
            "childId": ModelEditor.Keys.menuView,
            "options": [
                {
                    "menuDisplay": "Property Window",
                    "childId": ModelEditor.Keys.childProperty,
                    "selected" : true
                },
                {
                    "menuDisplay": "Model Viewer",
                    "childId": ModelEditor.Keys.childViewer,
                    "selected" : true
                }
            ]
        })
        let menuData = data.getData(menuView.id, DataStore.subscriber(this.id, this.handleEvent))
        this.displayOptions = menuData.options
        if(!this.displayOptions){
            throw Error("MenuView failed to be initilized.")
        }
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
        htmlList.push("<table style='width:100%; height:100%; border: 0px;border-collapse: collapse;'><tr>")
        let dispChildren = []
        for(let optItem of this.displayOptions){
            if(optItem.selected){
                let childRef = this.children.getValue(optItem.childId)
                dispChildren.push(childRef.node)
            }
        }
        if(dispChildren.length > 0){
            for(let idx = 0; idx<dispChildren.length; idx ++){
                if(idx == dispChildren.length - 1){
                    htmlList.push("<td style='vertical-align: top;width: 100%;'>")
                } else {
                    htmlList.push("<td style='vertical-align: top;'>")
                }
                let cHtml = dispChildren[idx].outputHTML()
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

    processEvent(eventObj){
        if(eventObj.type == DataStore.dataChanged){
            return true
        } else if(eventObj.type == ModelPropEditor.Events.hideProperty){
            for(let dispOpt of this.displayOptions){
                if(dispOpt.childId == ModelEditor.Keys.childProperty){
                    dispOpt.selected = false
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
        this.store = DataStore.GetStore()
        let data = this.store.newData(this.id, DataStore.subscriber(this.id, this.handleEvent))
        this.options = data.options = []        
        this.validateOptions()
        
    }

    validateOptions(){
        if(!this.props || !this.props.options || !Array.isArray(this.props.options) || this.props.options.length == 0){
            throw Error("Invalid options, null, not array or zero length")
        }
        let optItem = null;
        for(let idx=0; idx<this.props.options.length; idx++){
            optItem = this.props.options[idx]
            for(let attr of ["menuDisplay", "childId", "selected"]){
                if(!optItem.hasOwnProperty(attr)){
                    throw Error("missing attr [" + attr + "] @options[" + idx + "]")
                }
                if(typeof optItem.selected != "boolean"){
                    throw Error("selected attr @options[" + idx + "] should be boolean")
                }
            }
            this.options.push(optItem)
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
                this.store.notify(this.id)
            }
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
