const ScrapperScheduler = {
    "HOUR": 11,
    "MIN":38
}

const NewsAndChatScheduler = {
    "HOUR": 11,
    "MIN": 39
}

module.exports = {
    apps : [
        {
            name   : "NewsService",
            cwd    : "./services/NewsService/",
            script : "npm",
            args   : "start",
            watch  : true,
            env    : NewsAndChatScheduler
        },
        {
            name   : "SchedulerService",
            cwd    : "./services/SchedulerService/",
            script : "npm",
            args   : "start",
            watch  : true,
            env    : ScrapperScheduler
        },
        {
            name   : "ChatService",
            cwd    : "./services/ChatService/",
            script : "npm",
            args   : "start",
            watch  : true,
            env    : NewsAndChatScheduler
        }
    ]
}