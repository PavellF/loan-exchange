/**
 * Simply map a list of element to a list a object with the element as id.
 *
 * @param idList Elements to map.
 * @returns The list of objects with mapped ids.
 */
export const mapIdList = (idList: ReadonlyArray<any>) =>
  idList.filter((entityId: any) => entityId !== '').map((entityId: any) => ({ id: entityId }));

/**
 * In order to parse use the following coinParser(value: string)
 * */
export const coinFormatter = (value: number | string | undefined): string => {
  return `¢ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const coinParser = (value: string | undefined): number => {
  return Number(value ? value.replace(/\¢\s?|(,*)/g, '') : 0);
};

/**
* Retrieve new data when infinite scrolling
* @param currentData
* @param incomingData
* @param links
*/
export const loadMoreDataWhenScrolled = (currentData: any, incomingData: any, links: any): any => {
  if (links.first === links.last || !currentData.length) {
    return incomingData;
  }
  if (currentData.length >= incomingData.length) {
    return [...currentData, ...incomingData];
  }
  return null;
};
