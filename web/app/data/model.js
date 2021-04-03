import {DataStore} from "../../external/turingDiv.js/lib/dataStore.js"


class Model{
    static Keys = Object.freeze({
        "model": "model-"
    })

    constructor(catalogDataId, catId){
        this.dataId = catalogDataId
        this.catId = catId
        this.dataId = Model.Keys.model + catId
        this.catalog = DataStore.GetStore().getData(this.dataId, DataStore.subscriber(this.dataId, this.dataChangedHandler))
    }

    dataChangedHandler(){

    }

}