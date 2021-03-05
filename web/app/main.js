import {MouseState} from "../external/turingDiv.js/lib/mouse.js"
import {ModelEditor} from "../app/components/layout/layout.js"
import { DataStore } from "../external/turingDiv.js/lib/dataStore.js"

window.main = function main(){
    //Utilize the MouseState class from mouse library for mouse event
    MouseState.start()
    let store = new DataStore()
    let modelEditor = new ModelEditor({
        "dataStore": store,
        "divId": "main"
    })
    modelEditor.render()
}

