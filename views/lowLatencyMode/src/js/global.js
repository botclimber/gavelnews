const loadBtn = document.getElementById("loadMoreButton");

var currentChat = { chatCode: "/", general: true, newTitle: "" };
var allDataIsSet = false;

var next_page = 1;
var filterObject = { isActive: false, param: undefined, value: undefined };
var sortObject = { isActive: false, param: undefined };
var currentReqUrl;

var contentSize = 0;