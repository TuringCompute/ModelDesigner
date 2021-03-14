import {ModelEditor} from "../app/components/modelEditor/modelEditor.js"
import { MenuReg } from "../external/turingDiv.js/component/menuReg/menuReg.js"

window.main = function main(){
    //Utilize the MouseState class from mouse library for mouse event
    new MenuReg({
        "divId": "menuModelDesignerView"
    })
    let modelEditor = new ModelEditor({
        "divId": "main"
    })
    modelEditor.render()
}

