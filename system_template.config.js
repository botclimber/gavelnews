const ScrapperScheduler = {
    "HOUR": 0,
    "MIN":0
}

const NewsEnv = {
    "HOUR": 0,
    "MIN": 0,
    "SERVER_PORT": 0,
    "CHAT_PORT": 0,
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