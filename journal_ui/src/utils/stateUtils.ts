export function deepClone(object: any): any {
    if(typeof object !== "object" || object == undefined) return object

    if(Array.isArray(object)) {
        const array = [];
        for(let i = 0; i < object.length ; i++) {
            array.push(deepClone(object[i]));
        }
        return array;
    }

    if(typeof object === "object") {
        const newObject:any = {};
        for(const key in object) {
           newObject[key] = deepClone(object[key]); 
        }
        return newObject
    }
}