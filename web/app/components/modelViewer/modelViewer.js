import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"
import {Format} from "../../../external/turingDiv.js/lib/format.js"

class ModelViewer extends DivEle{
    constructor(props){
        super(props)
    }

    outputHTML(){
        // calculate size of the model viewer
        // base on the size of the model viewer
        // the model viewer should 
        let htmlList = [
            "<svg width='100%' heght='100%' border=1>",
            "</svg>"
        ]
        this.addDivEleFrame(htmlList)
        return htmlList
    }

    addDivEleFrame(htmlList){
        Format.applyIndent(htmlList)
        let zIdx = ""
        if (this.props.hasOwnProperty("zIdx")){
            zIdx = "z-index:" + this.props.zIdx + ";"
        }
        htmlList.splice(0,0, "<div id='" + this.id + "' style='position:absolute;left:" + this.props.left + "px;top:" + this.props.top + "px;" + 
                            "width:" + this.props.width + "px;height:" + this.props.height + "px;" + zIdx + "'>")
        htmlList.push("</div>")
    }
}

export {ModelViewer}
