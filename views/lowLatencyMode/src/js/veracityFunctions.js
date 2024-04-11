async function hideButtons(newId) {
    const btns = document.getElementById(`toVoteButtons-${newId}`)
    btns.style.display = "none"
}

async function setBarsContent(new_data) {

    const bar = document.getElementById(`bar-${new_data.new_id}`)

    const totalVotes = (new_data.new_isTrue) + (new_data.new_isFalse) + (new_data.new_isUnclear) + (new_data.new_noOpinion)

    const isTruePerc = computeAvg(new_data.new_isTrue, totalVotes)
    const isFalsePerc = computeAvg(new_data.new_isFalse, totalVotes)
    const noOpinionPerc = computeAvg(new_data.new_noOpinion, totalVotes)
    const isUnclearPerc = computeAvg(new_data.new_isUnclear, totalVotes)

    bar.innerHTML = `
    <div class="w-full h-4 bg-green-500 rounded-l-full relative" style="width: ${isTruePerc}%;">
                    <span class="tooltip-text">${isTruePerc}% (${new_data.new_isTrue})</span>
                  </div>
                  <div class="w-full h-4 bg-gray-500 relative" style="width: ${noOpinionPerc}%;">
                    <span class="tooltip-text">${noOpinionPerc}% (${new_data.new_noOpinion})</span>
                  </div>
                  <div class="w-full h-4 bg-orange-500 relative" style="width: ${isUnclearPerc}%;">
                    <span class="tooltip-text">${isUnclearPerc}% (${new_data.new_isUnclear})</span>
                  </div>
                  <div class="w-full h-4 bg-red-500 rounded-r-full relative" style="width: ${isFalsePerc}%;">
                    <span class="tooltip-text">${isFalsePerc}% (${new_data.new_isFalse})</span>
                  </div>
    `
}