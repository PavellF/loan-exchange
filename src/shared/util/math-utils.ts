/**
 * Computes difference in relative unit.
 * Example:
 * beforeChange = 500
 * afterChange = 400
 * After being changed value became 500 - 100 = 400; function returns percent representation of -100: -20%
 * 'Value became 20% lesser'
 * */
export const percentageDifference = (beforeChange: number, afterChange: number): number => {
  return ((afterChange - beforeChange) / beforeChange) * 100;
};
