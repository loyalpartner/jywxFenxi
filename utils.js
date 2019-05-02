export const removeTail = s => s.replace("人物大全", "")
export const getChinese = s => s.match(/[\u4e00-\u9fa5]/g).join("");
export const print = console.info;
export const nameUsedCount = (name, content) => Math.max(content.split(name).length,1)-1;
export const getFileName = s => s.replace(".txt", "")
