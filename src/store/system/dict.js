import { defineStore } from "pinia"
import { getDicts } from "@/request/system/dict"

const useDictStore = defineStore('dictStore', () => {

    const dictionary = (getItem("dictionary") || []).map(it => [it.code, it.dictItems]);
    const dictMap = reactive(new Map(dictionary));

    const fetchDicts = () => {
        dictMap.clear();
        getDicts().then(list => {
            setItem("dictionary", list)
            list.forEach(item => dictMap.set(item.code, item.dictItems))
        })
    }

    const getDict = (key) => {
        return (dictMap.get(key) || []).sort((a, b) => a.sort - b.sort);
    }

    const getDictName = (key, value) => {
        const dicts = dictMap.get(key);
        if (dicts) {
            return dicts.find(item => item.value === value)?.title;
        }
        return null;
    }


    return {
        fetchDicts,
        getDictName,
        getDict,
    }
})

export default useDictStore