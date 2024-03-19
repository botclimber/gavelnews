import { spawn } from 'child_process';

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
// export async function transformExtractedData(): Promise<void>{}