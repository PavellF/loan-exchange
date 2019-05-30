export enum DealStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  SUCCESS = 'SUCCESS'
}

export const getStatusColor = (status?: DealStatus): string => {
  let color = 'red';

  if (status === DealStatus.PENDING) {
    color = 'orange';
  } else if (status === DealStatus.ACTIVE) {
    color = 'geekblue';
  } else if (status === DealStatus.SUCCESS) {
    color = 'green';
  }

  return color;
};
