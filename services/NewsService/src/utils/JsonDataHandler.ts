import { NewsManipulator } from '../controllers/NewsManipulator';
import { pathMainData, dateFormat } from '../../../CommonStuff/src/consts/consts'
import { fromRequestJsonFileFormat } from "../../../CommonStuff/src/types/types"
import { getPreviousDate, loadFromFile, formatDate } from "../../../CommonStuff/src/functions/functions"

export const CONTENT_PER_PAGE: number = 10
export let jsonData: NewsManipulator;

export function loadData(path: string, date: Date): fromRequestJsonFileFormat {

    try {
        const filePath = `${path}allData_${formatDate(date, dateFormat)}.json`

        return JSON.parse(loadFromFile(filePath))

    } catch (e) {
        console.log(e)
        return { "data": [] }
    }
}

export const transformData = () => {
    console.log(`Memory need from loading JSON data is ${jsonData.dataSize().toFixed(2)}Mb`);
    
    jsonData.sortByTitle(); //TODO: sortBy existing description instead
    jsonData.cleanData();
}

const initializeJsonData = () => {
    jsonData = new NewsManipulator(loadData(pathMainData, getPreviousDate(1)));
    transformData();
};

export const updateJsonData = (newData: NewsManipulator) => {
    jsonData = newData;
    transformData();
};



initializeJsonData()