import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"
import {Format} from "../../../external/turingDiv.js/lib/format.js"
import {MouseState} from "../../../external/turingDiv.js/lib/mouse.js"
import {Event} from "../../../external/turingDiv.js/lib/event.js"

class ModelPropEditor extends DivEle{
    constructor(props){
        super(props)
        this.width = null
    }

    propertyHeader(htmlList){
        let propHeader = []
        propHeader.push("<td>Input</td><td>Attribute</td><td>Children</td>")
        Format.applyIndent(propHeader)
        if (this.width){
            propHeader.splice(0, 0, "<table border=1 width='" + this.width + "px'><tr>")
        } else {
            propHeader.splice(0, 0, "<table border=1><tr>")
        }        
        propHeader.push("</tr></table>")
        Format.applyIndent(propHeader)
        htmlList.push(...propHeader)
    }

    headerAndBoarder(htmlList){
        let headerAndBoarder = []
        headerAndBoarder.push("<td style='vertical-align: top;'>")
        this.propertyHeader(headerAndBoarder)
        headerAndBoarder.push("</td>")
        headerAndBoarder.push("<td rowspan=3 style='border-right: 4px solid #2a9df4;cursor:e-resize;' onmousedown='" + this.eventTriger(Event.new(MouseState.mouseDown, null, {})) + "'></td>")
        Format.applyIndent(headerAndBoarder)
        htmlList.push(...headerAndBoarder)
    }

    attrListHtml(){
        let htmlList = []
    }

    outputHTML(){
        let htmlList = []
        htmlList.push("<table style='border-collapse: collapse; height: 100%'>")
        htmlList.push("<tr>")
        this.headerAndBoarder(htmlList)
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
    processEvent(src, event, eventObj){
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
                this.width = event.x
                return true
            }
        }
        return false
    }
}

export {ModelPropEditor}
