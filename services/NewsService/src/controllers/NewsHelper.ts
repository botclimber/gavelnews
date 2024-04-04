import {fromRequestJsonFileFormat, new_object} from "../../../CommonStuff/src/types/types"

export function sortBy(data: fromRequestJsonFileFormat, param: keyof new_object): fromRequestJsonFileFormat {
  const sortedData = data.data.slice().sort((a, b) => {
    if (a[param] < b[param]) return -1;
    if (a[param] > b[param]) return 1;
    return 0;
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
  const slicedData = data.slice(startIndex, endIndex);

  return { data: slicedData};
  
}
