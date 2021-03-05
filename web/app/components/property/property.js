import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"
import {Format} from "../../../external/turingDiv.js/lib/format.js"
import {DataStore} from "../../../external/turingDiv.js/lib/dataStore.js"

class ModelPropEditor extends DivEle{
    constructor(props){
        super(props)
    }

    propertyHeader(htmlList){
        let propHeader = []
        propHeader.push("<td>Input</td><td>Attribute</td><td>Children</td>")
        Format.applyIndent(propHeader)
        propHeader.splice(0, 0, "<table border=1><tr>")
        propHeader.push("</tr></table>")
        Format.applyIndent(propHeader)
        htmlList.push(...propHeader)
    }

    headerAndBoarder(htmlList){
        let headerAndBoarder = []
        headerAndBoarder.push("<td>")
        this.propertyHeader(headerAndBoarder)
        headerAndBoarder.push("</td>")
        headerAndBoarder.push("<td rowspan=3 style='border-right: 2px solid #2a9df4;cursor:e-resize;' onmousedown='alert(\"boarder clicked\")'></td>")
        Format.applyIndent(headerAndBoarder)
        htmlList.push(...headerAndBoarder)
    }

    attrListHtml(){
        let htmlList = []
    }

    outputHTML(){
        let htmlList = []
        htmlList.push("<table cellpadding='0'>")
        htmlList.push("<tr>")
        this.headerAndBoarder(htmlList)
        htmlList.push("</tr>")
        htmlList.push("<tr><td>&nbsp</td></tr>")
        htmlList.push("<tr><td>&nbsp</td></tr>")
        htmlList.push("</table>")
        this.addDivEleFrame(htmlList)
        return htmlList
    }
}

export {ModelPropEditor}
