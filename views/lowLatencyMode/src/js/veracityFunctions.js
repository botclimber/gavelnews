async function setBarsContent(new_data) {

  const bar = document.getElementById(`bar-${new_data.new_id}`)

  const totalVotes = (new_data.new_isTrue) + (new_data.new_isFalse) + (new_data.new_isUnclear)

  const isTruePerc = computeAvg(new_data.new_isTrue, totalVotes)
  const isFalsePerc = computeAvg(new_data.new_isFalse, totalVotes)
  const isUnclearPerc = computeAvg(new_data.new_isUnclear, totalVotes)

  bar.innerHTML = /* html */`
      <div class="w-full h-3 bg-[#8CB369] rounded-l-full relative" style="width: ${isTruePerc}%;">
        <span class="tooltip-text">${isTruePerc}% (${new_data.new_isTrue})</span>
      </div>
      <div class="w-full h-3 bg-[#F4A259] relative" style="width: ${isUnclearPerc}%;">
        <span class="tooltip-text">${isUnclearPerc}% (${new_data.new_isUnclear})</span>
      </div>
      <div class="w-full h-3 bg-[#BC4B51] rounded-r-full relative" style="width: ${isFalsePerc}%;">
        <span class="tooltip-text">${isFalsePerc}% (${new_data.new_isFalse})</span>
      </div>
    `
}

async function setButtons(votedBtnElement, prevVoteBtnElement){

  if(prevVoteBtnElement) prevVoteBtnElement.classList.remove("votedBtn")
  votedBtnElement.classList.add("votedBtn")

}