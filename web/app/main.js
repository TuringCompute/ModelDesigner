import {ModelEditor} from "../app/components/modelEditor/modelEditor.js"
import { DataStore } from "../external/turingDiv.js/lib/dataStore.js"
import { MenuReg } from "../external/turingDiv.js/component/menuReg/menuReg.js"

window.main = function main(){
    //Utilize the MouseState class from mouse library for mouse event
    let store = new DataStore()
    new MenuReg({
        "divId": "menuModelDesignerView"
    })
    let modelEditor = new ModelEditor({
        "dataStore": store,
        "divId": "main"
    })
    modelEditor.render()
}

