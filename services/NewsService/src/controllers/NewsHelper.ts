import {fromRequestJsonFileFormat, new_object} from "../../../CommonStuff/src/types/types"

function calcPercentage (nr: number, total: number): number {

  return +((nr / total) * 100).toFixed(2);
}

// TODO: add param for ASC | DESC
export function sortBy(data: fromRequestJsonFileFormat, param: keyof new_object): fromRequestJsonFileFormat {

  const veracityValues = ["new_isTrue", "new_isFalse", "new_isUnclear", "new_noOpinion"]

  const getSortResult = (aValue: any, bValue: any) => {
    // Check if aValue or bValue is undefined
    if (aValue === undefined && bValue === undefined) return 0; // Both are undefined, consider them equal
    if (aValue === undefined) return -1; // aValue is undefined, consider it smaller
    if (bValue === undefined) return 1; // bValue is undefined, consider it smaller
    
    // Now, both aValue and bValue are defined, proceed with regular comparison
    if (aValue < bValue) return 1;
    if (aValue > bValue) return -1;
    return 0; // Values are equal
  }

  const sortedData = data.data.slice().sort((a, b) => {
    // Use optional chaining to access properties safely

    if (veracityValues.includes(param)){
      const aTotal = (a.new_isFalse + a.new_isTrue + a.new_isUnclear + a.new_noOpinion )
      const bTotal = (b.new_isFalse + b.new_isTrue + b.new_isUnclear + b.new_noOpinion )

      const aNr = a[param] ?? 0
      const bNr = b[param] ?? 0
      
      const aValue = calcPercentage(+aNr, aTotal);
      const bValue = calcPercentage(+bNr, bTotal);

      return getSortResult(aValue, bValue)
    
    }else{
      const aValue = a[param];
      const bValue = b[param];

      return getSortResult(aValue, bValue)
    }

  });

  return { data: sortedData };
}

export function filterBy(data: fromRequestJsonFileFormat, param: keyof new_object, value: any): fromRequestJsonFileFormat {
  const filteredData = data.data.filter(item => item[param] === value);
  return { data: filteredData };
}

export function sliceData (data: fromRequestJsonFileFormat, page: number, contentPerPage: number): fromRequestJsonFileFormat {

  const startIndex = (page - 1) * contentPerPage;
  const endIndex = startIndex + contentPerPage;
  const slicedData = data.data.slice(startIndex, endIndex);

  return { data: slicedData}; 
}

export function search(data: fromRequestJsonFileFormat, title: string): fromRequestJsonFileFormat {
  // Use filter to find objects with matching titles
  const filteredNews = data.data.filter(item => item.new_title.toLowerCase().includes(title.toLowerCase()))
  return {data: filteredNews}
}

/**
* this is used for replacement functions on client side
*/
export function getSingleNewData(data: fromRequestJsonFileFormat, newId: string): new_object | undefined {
  const newContent = data.data.find(row => row.new_id === newId)

  return newContent
}
