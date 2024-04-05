import {fromRequestJsonFileFormat, new_object} from "../../../CommonStuff/src/types/types"

export function sortBy(data: fromRequestJsonFileFormat, param: keyof new_object): fromRequestJsonFileFormat {
  const sortedData = data.data.slice().sort((a, b) => {
    // Use optional chaining to access properties safely
    const aValue = a[param];
    const bValue = b[param];

    // Check if aValue or bValue is undefined
    if (aValue === undefined && bValue === undefined) return 0; // Both are undefined, consider them equal
    if (aValue === undefined) return -1; // aValue is undefined, consider it smaller
    if (bValue === undefined) return 1; // bValue is undefined, consider it smaller
    
    // Now, both aValue and bValue are defined, proceed with regular comparison
    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0; // Values are equal
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
