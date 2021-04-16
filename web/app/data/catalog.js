import {DataStore} from "../../external/turingDiv.js/lib/dataStore.js"
import { EventSrc } from "../../external/turingDiv.js/lib/event.js"


class Catalog{
    static Key = Object.freeze({
        "catalog": "catalog"
    })

    constructor(){      
        if(!Catalog.instance){
            this.dataBag = DataStore.GetStore().getData(Catalog.Key.catalog, DataStore.subscriber(Catalog.Key.catalog, this.handleEvent))
            this.dataBag[Catalog.Key.catalog] = {}
            Catalog.instance = this
        }
        return Catalog.instance    
    }

    getModel(catId){
        let catalog = this.dataBag[Catalog.Key.catalog]
        if(catalog.hasOwnProperty(catId)){
            return catalog[catId]
        }
        return null
    }

    static propertySection(model, sectionName){
        



    }


}