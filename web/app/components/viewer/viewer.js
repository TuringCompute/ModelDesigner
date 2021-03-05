import {DivEle} from "../../../external/turingDiv.js/lib/divEle.js"

class ModelViewer extends DivEle{
    constructor(props){
        super(props)
    }

    outputHTML(){
        let htmlList = []
        this.addDivEleFrame(htmlList)
        return htmlList
    }

}

export {ModelViewer}

