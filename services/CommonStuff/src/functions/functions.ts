import fs from "fs";
import * as dateAndTime from "date-and-time";

export function getPreviousDate(days: number): Date { return dateAndTime.addDays(new Date(new Date()), -(days))}

export function formatDate (date: Date, pattern: string) { return dateAndTime.format(date, pattern)}

export async function saveToFile(content: string, path: string, append: boolean = false): Promise<void>{

    try{
        if(append) await fs.promises.appendFile(path, `${content}\n`);
        else await fs.promises.writeFile(path, content);

    }catch(e){
        throw e
    }
}

export function loadFromFile(path: string): string {

    try{
        return fs.readFileSync(path, "utf-8")

    }catch(e){
        throw e
    }

}

export async function filesFromFolder(folderPath: string){
    try {
        // Read the filenames in the folder
        const files = await fs.promises.readdir(folderPath);
        
        return files;
    
    } catch (error) {
        console.error(error);
        throw error
    }

}