const gulp = require('gulp');
const exec  = require('child_process').exec;

function installDependencies(path, serviceName){
    exec('npm install', {
        cwd: path
    }, (error, stdout, stderr) => {
        let logmessage = stdout + `\n ${serviceName} PACKAGES INSTALLED SUCCESSFULLY` + "\n\n---------------------------------\n";
        console.log(logmessage)
        if (stderr) console.log(`Error instaling packages for ${serviceName}`)
    });
}

function compile(path, serviceName){
    exec('npm run compile', {
        cwd: path
    }, (error, stdout, stderr) => {
        let logmessage = stdout + `\n ${serviceName} PROJECT COMPILED SUCCESSFULLY` + "\n\n---------------------------------\n";
        console.log(logmessage)
        if (stderr) console.log(`Error compiling project for ${serviceName}`)
    });

}

// Services
const services = {
    "NewsService": {"path": "./services/NewsService/"},
    "AdminService": {"path": "./services/AdminService/"},
    "SchedulerService": {"path": "./services/SchedulerService/"},
    "CommonStuff": {"path": "./services/CommonStuff/"},
    "ChatService": {"path": "./services/ChatService/"}
}

gulp.task('build', async function (done) {
    for(let service in services){
        installDependencies(services[service].path, service)
    }
})

gulp.task('compile', async function (done) {
    for(let service in services){
        compile(services[service].path, service)
    }
})