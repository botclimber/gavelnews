module.exports = {
    apps : [
        {
            name   : "NewsService",
            script : "./services/NewsService/dist/NewsService/src/index.js",
            watch: true
        },
        {
            name   : "SchedulerService",
            script : "./services/SchedulerService/dist/SchedulerService/src/index.js",
            watch: true
        }
    ]
}