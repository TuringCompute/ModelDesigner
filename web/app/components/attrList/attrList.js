import {TableList} from "../../../external/turingDiv.js/component/tableList/tableList.js"

class AttrList extends TableList{
    constructor(props){
        super(props)
    }

    itemHtml(){
        let itemLines = super.itemHtml()
        let lineStr = "<td>New</td>"
        for(let cI in this.displayOrder){
            lineStr = lineStr + "<td>&nbsp</td>"
        }
        lineStr = "<tr>" + lineStr + "</tr>"
        itemLines.push(lineStr)
        return itemLines
    }
}

export {AttrList}
