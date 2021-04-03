import {DataStore} from "../../external/turingDiv.js/lib/dataStore.js"


class Catalog{
    static Key = Object.freeze({
        "catalog": "model-"
    })

    static Event = Object.freeze({
        "dataSync": "catalogDataSynced",
        "updated": "catalogModelDataUpdated"
    })

    constructor(catalogDataId, catId){
        this.dataId = catalogDataId
        this.catId = catId
        this.dataId = Model.Key.model + catId
        this.dataBag = DataStore.GetStore().getData(this.dataId, DataStore.subscriber(this.dataId, this.dataChangedHandler))
        this.dataBag.catalog = {}
        this.dataBag.editingCatId = null
    }

    dataChangedHandler(){

    }
}