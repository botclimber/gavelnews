import { spawn } from "child_process";
import * as fs from "fs";
import * as dateAndTime from "date-and-time";
import * as eva from "eva-functional-utils";
import {new_object, fromRequestJsonFileFormat, fromScrapyJsonFileFormat} from "../../../CommonStuff/src/types/types"
import {dateFormat} from "../../../CommonStuff/src/consts/consts"
import {getYesterdayDate} from "../../../CommonStuff/src/functions/functions"
import exp from "constants";

export async function triggerFullScrap(): Promise<void> {
    const scriptPath = "../WebScraperService/run.sh"
    const childProcess = spawn('sh', [scriptPath]);

    childProcess.stdout.on('data', (data) => {
        console.log(`Script output: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
        console.error(`Script error: ${data}`);
    });

    childProcess.on('close', (code) => {
        console.log(`Script execution finished with code ${code}`);
    });
}

// load data from all files, generate a file with the data cleaned and joined
async function readJSONFile<T>(filePath: string): Promise<T> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const jsonData = JSON.parse(data) as T;
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

async function flatScrayObject(dataToFlatten: fromScrapyJsonFileFormat): Promise<new_object[]> {
    const transformedData = dataToFlatten.flatMap( r => r.data)
    return transformedData
}

export async function transformExtractedData(): Promise<void>{

    const yesterdayDate = getYesterdayDate()

    const mergedDataFilePathName = `../Data/allData_${dateAndTime.format(yesterdayDate, dateFormat)}.json`

    const expressoFilePath = `../Data/expresso_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    const sicNoticiasFilePath = `../Data/sicNoticias_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    const publicoFilePath = `../Data/publico_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    const jornalNoticiasFilePath = `../Data/jornalNoticias_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    const observadorFilePath = `../Data/observador_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    const cnnFilePath = `../Data/cnnPortugal_${dateAndTime.format(yesterdayDate, dateFormat)}.json`

    const expressoData = await readJSONFile<fromRequestJsonFileFormat>(expressoFilePath)
    const sicNoticiasData = await readJSONFile<fromRequestJsonFileFormat>(sicNoticiasFilePath)
    const publicoData = await readJSONFile<fromRequestJsonFileFormat>(publicoFilePath)
    const jornalNoticiasData = await readJSONFile<fromRequestJsonFileFormat>(jornalNoticiasFilePath)

    const observadorData = await readJSONFile<fromScrapyJsonFileFormat>(observadorFilePath)
    const cnnData = await readJSONFile<fromScrapyJsonFileFormat>(cnnFilePath)

    const flattenObservadorData: new_object[] = await flatScrayObject(observadorData)
    const flattenCnnData: new_object[] = await flatScrayObject(cnnData)

    const mergedData: new_object[] = [...expressoData.data, ...sicNoticiasData.data, ...publicoData.data, ...jornalNoticiasData.data, ...flattenObservadorData, ...flattenCnnData]
    
    fs.writeFile(mergedDataFilePathName, JSON.stringify({"data": mergedData}), 'utf-8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
          } else {
            console.log('Data has been written to', mergedDataFilePathName);
          }
    });
}