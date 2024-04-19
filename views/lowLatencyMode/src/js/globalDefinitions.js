const api = "http://localhost"
const chatWebsocket = "ws://localhost:8002"

const loadBtn = document.getElementById("loadMoreButton");
const newsContentSize = document.getElementById("contentSize")
const news_div = document.getElementById("news")
const container = document.getElementById('dateContainer');

const chatTitleLimit = 15

var dateAsGlobal;
var readOnlyPage;

var currentChat = { chatCode: "/", general: true, newTitle: "" };
var allDataIsSet = false;

var next_page = 1;
var filterObject = { isActive: false, param: undefined, value: undefined };
var sortObject = { isActive: false, param: undefined };
var currentReqUrl;

var contentSize = 0;

const newVoteToVote = {
    "new_isTrue" : "true",
    "new_isUnclear" : "unclear",
    "new_isFalse" : "false"
}