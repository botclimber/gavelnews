module.exports = {
    apps : [
        {
            name   : "NewsService",
            cwd    : "./services/NewsService/",
            script : "npm",
            args   : "start",
            watch  : true
        },
        {
            name   : "SchedulerService",
            cwd    : "./services/SchedulerService/",
            script : "npm",
            args   : "start",
            watch  : true
        },
        {
            name   : "ChatService",
            cwd    : "./services/ChatService/",
            script : "npm",
            args   : "start",
            watch  : true
        }
    ]
}