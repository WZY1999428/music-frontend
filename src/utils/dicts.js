import useDictStore from '@/store/system/dict';
const dictStore = useDictStore();

export const getDictName = (dictKey, value) => {
    return dictStore.getDictName(dictKey, value);
};

