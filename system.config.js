const NewsAndChatScheduler = {
    "HOUR": 23,
    "MIN": 4
}

const ScrapperScheduler = {
    "HOUR": 23,
    "MIN":3
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