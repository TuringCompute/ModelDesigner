import {DataStore} from "../../external/turingDiv.js/lib/dataStore.js"


class Schema {
    static Key = Object.freeze({
        "id": "id",
        "attribute": "attribute",
        "catId": "catId",
        "children": "children",
        "definition": "definition",
        "name": "name",
        "properties": "properties",
        "propertySections": "propertySections",
        "version": "version"
    })

    // retrieve inner model from definition
    static getInnerModel(model, catId){
        if(!model.hasOwnProperty(Schema.Key.definition)){
            return null
        }
        if(!model[Schema.Key.definition].hasOwnProperty(catId)){
            return null
        }
        return model[Schema.Key.definition][catId]
    }

    static setInnerModel(model, catId, innerModel){
        if(!model.hasOwnProperty(Schema.Key.definition)){
            model[Schema.Key.definition] = {}
        }
        model[Schema.Key.definition][catId] = innerModel
    }


    // retrieve property list from model
    static getPropertySection(model, sectionName){
        for (let sectionKey of [Schema.Key.propertySections, Schema.Key.properties]){
            if(!model.hasOwnProperty(sectionKey)){
                return []
            }
        }
        if(!model[Schema.Key.propertySections].hasOwnProperty(sectionName)){
            return []
        }
        
        if(!Array.isArray(model[Schema.Key.propertySections][sectionName])){
            throw Error("invalid format, [" + Schema.Key.propertySections + "/" + sectionName + "] is not array in model")
        }
        let attrList = []
        for(let attrName of model[Schema.Key.propertySections][sectionName]){
            let attrInfo = {}
            if(!model[Schema.Key.properties].hasOwnProperty(attrName)){
                attrInfo[Schema.Key.name] = attrName
                Object.assign(attrInfo, model[Schema.Key.properties][attrName])
            }
        }
        return attrList
    }

    // update section
    static updatePropertySection(model, sectionName, attrList){
        for (let section of [Schema.Key.propertySections, Schema.Key.properties]){
            if(!model.hasOwnProperty(section)){
                model[section] = {}
            }
        }
        if(!model[Schema.Key.propertySections].hasOwnProperty(sectionName)){
            model[Schema.Key.propertySections][sectionName] = []
        }
        let attrOrder = model[Schema.Key.propertySections][sectionName]
        let properties = model[Schema.Key.properties]
        let newAttrOrder = []
        let newProperties = {}
        for(let attrInfo of attrList){
            if(attrInfo.hasOwnProperty(Schema.Key.name) && attrInfo[Schema.Key.name].length > 0){
                let attrName = attrInfo.name
                delete attrInfo.name
                if(!attrOrder.includes(attrName) && properties.hasOwnProperty(attrName)){
                    throw Error("invalid attr, [" + attrName + "] already exists")
                }
            }
        }
        model[Schema.Key.propertySections][sectionName] = newAttrOrder
        Object.assign(properties, newProperties)
        for(let attrName in attrOrder){
            if(!newAttrOrder.includes(attrName) && properties.hasOwnProperty(attrName)){
                delete properties[attrName]
            }
        }
    }
}


class Catalog{
    static Key = Object.freeze({
        "catalog": "catalog",
        "model": "model"
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
}