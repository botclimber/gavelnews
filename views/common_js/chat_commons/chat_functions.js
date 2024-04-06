function isScrolledToBottom(element) {
    // Check if the scroll position is at the bottom within a threshold
    const errorMargin = element.clientHeight / 1.5

    return (element.scrollHeight - element.scrollTop) <= element.clientHeight + errorMargin
}

function scrollToBottom(element) {
    // Scroll to the bottom of the element
    element.scrollTop = element.scrollHeight * 2;
}