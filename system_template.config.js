const ScrapperScheduler = {
    "HOUR": 0,
    "MIN":0
}

const NewsEnv = {
    "HOUR": 0,
    "MIN": 0,
    "SERVER_PORT": 0,
    "USE_HTTPS": false,
    "CERT_PATH": undefined,
    "KEY_PATH": undefined,
    "CLIENT_ID": "",
    "CLIENT_SECRET": "",
    "SECRET": ""
}

module.exports = {
    apps : [
        {
            name   : "NewsService",
            cwd    : "./services/NewsService/",
            script : "npm",
            args   : "start",
            watch  : true,
            env    : NewsEnv
        },
        {
            name   : "SchedulerService",
            cwd    : "./services/SchedulerService/",
            script : "npm",
            args   : "start",
            watch  : true,
            env    : ScrapperScheduler
        },
    ]
}
