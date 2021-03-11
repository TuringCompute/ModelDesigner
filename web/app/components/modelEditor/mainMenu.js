import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"
import {MouseState} from "../../../external/turingDiv.js/lib/mouse.js"

class MainMenu extends DivEle{
    constructor(props){
        super(props)
        this.visible = false
    }

    showMenu(left, top){
        this.top = top
        this.left = left
        let mouse = MouseState.GetMouse()
        mouse.registerTarget(this)
        // then display menu div with top=y and left=x
        this.visible = true
    }

    processEvent(src, event, eventObj){
        if(eventObj.type == MouseState.mouseUp && this.visible == true){
            this.visible = false
            return true
        }
    }

    outputHTML(){
        let htmlList = []
        if(this.visible){
            htmlList.push("show menu content")
        }
        this.addDivEleFrame(htmlList)
        return htmlList
    }

    addDivEleFrame(htmlList){
        Format.applyIndent(htmlList)
        if(this.props.hasOwnProperty("zIdx")){
            htmlList.splice(0,0, "<div id='" + this.id + " style='z-index:" + this.props.zIdx + ";'>")
        } else {
            htmlList.splice(0,0, "<div id='" + this.id + "'>")
        }
        htmlList.push("</div>")
    }

}