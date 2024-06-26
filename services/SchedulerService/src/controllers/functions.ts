import { spawn } from "child_process";
import * as fs from "fs";
import * as dateAndTime from "date-and-time";
import { new_object, fromRequestJsonFileFormat, fromScrapyJsonFileFormat, NewObjectBase } from "../../../CommonStuff/src/types/types"
import { dateFormat } from "../../../CommonStuff/src/consts/consts"
import { getPreviousDate } from "../../../CommonStuff/src/functions/functions"
import { additionalFields } from "./dataFunctions";

export function backupCurrentFiles(): Promise<void> {
    return new Promise((resolve, reject) => {
        const scriptPath = "../WebScraperService/runBackup.sh"
        const childProcess = spawn('sh', [scriptPath]);

        childProcess.stdout.on('data', (data) => {
            console.log(`Script output: ${data}`);
        });

        childProcess.stderr.on('data', (data) => {
            console.error(`Script error: ${data}`);
        });

        childProcess.on('close', (code) => {
            console.log(`Script execution finished with code ${code}`);
            if (code === 0) {
                resolve(); // Resolve the promise when the script execution is successful
            } else {
                reject(`Script execution failed with code ${code}`);
            }
        });

        childProcess.on('error', (err) => {
            console.error(`Error executing script: ${err}`);
            reject(err);
        });
    });
}

/**
 * This may take some time, however is hard to exactly determine it
 */
export function triggerFullScrap(): Promise<void> {
    return new Promise((resolve, reject) => {
        const scriptPath = "../WebScraperService/runCollector.sh"
        const childProcess = spawn('sh', [scriptPath]);

        childProcess.stdout.on('data', (data) => {
            console.log(`Script output: ${data}`);
        });

        childProcess.stderr.on('data', (data) => {
            console.error(`Script error: ${data}`);
        });

        childProcess.on('close', (code) => {
            console.log(`Script execution finished with code ${code}`);
            if (code === 0) {
                resolve(); // Resolve the promise when the script execution is successful
            } else {
                reject(`Script execution failed with code ${code}`);
            }
        });

        childProcess.on('error', (err) => {
            console.error(`Error executing script: ${err}`);
            reject(err);
        });
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

async function flatScrayObject(dataToFlatten: fromScrapyJsonFileFormat): Promise<NewObjectBase[]> {
    const transformedData = dataToFlatten.flatMap(r => r.data)
    return transformedData
}

// TODO: dont abort in case of some file doesnt exist, just inform
export async function transformExtractedData(): Promise<void> {

    const yesterdayDate = getPreviousDate(1)

    // TODO: make path a constant
    const mergedDataFilePathName = `../Data/allData.json`

    const expressoFilePath = `../Data/expresso_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    const sicNoticiasFilePath = `../Data/sicNoticias_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    const publicoFilePath = `../Data/publico_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    const jornalNoticiasFilePath = `../Data/jornalNoticias_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    const observadorFilePath = `../Data/observador_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    const cnnFilePath = `../Data/cnnPortugal_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    const visaoFilePath = `../Data/visao_${dateAndTime.format(yesterdayDate, dateFormat)}.json`

    const expressoData = await readJSONFile<fromRequestJsonFileFormat>(expressoFilePath)
    const sicNoticiasData = await readJSONFile<fromRequestJsonFileFormat>(sicNoticiasFilePath)
    const publicoData = await readJSONFile<fromRequestJsonFileFormat>(publicoFilePath)
    const jornalNoticiasData = await readJSONFile<fromRequestJsonFileFormat>(jornalNoticiasFilePath)

    const observadorData = await readJSONFile<fromScrapyJsonFileFormat>(observadorFilePath)
    const cnnData = await readJSONFile<fromScrapyJsonFileFormat>(cnnFilePath)
    const visaoData = await readJSONFile<fromScrapyJsonFileFormat>(visaoFilePath)

    const flattenObservadorData: NewObjectBase[] = await flatScrayObject(observadorData)
    const flattenCnnData: NewObjectBase[] = await flatScrayObject(cnnData)
    const flattenVisaoData: NewObjectBase[] = await flatScrayObject(visaoData)

    const mergedData: NewObjectBase[] = [...expressoData.data, ...sicNoticiasData.data, ...publicoData.data, ...jornalNoticiasData.data, ...flattenObservadorData, ...flattenCnnData, ...flattenVisaoData]
    
    const dataWithAdditionalFields: new_object[] = await additionalFields(mergedData)

    fs.writeFile(mergedDataFilePathName, JSON.stringify({ "data": dataWithAdditionalFields }), 'utf-8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data has been written to', mergedDataFilePathName);
        }
    });
}