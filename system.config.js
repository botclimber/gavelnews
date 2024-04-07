const ScrapperScheduler = {
    "HOUR": 10,
    "MIN":43
}

const NewsAndChatScheduler = {
    "HOUR": 10,
    "MIN": 44
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