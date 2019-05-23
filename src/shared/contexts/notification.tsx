import React, {useState} from 'react';
import axios from "axios";
import {INotification} from "../model/notification.model";

const initialState = {
  loading: false,
  notifications: [] as ReadonlyArray<INotification>,
  totalItems: 0,
  errorMessage: null as unknown as string,
  fetchNotifications: (page?: number, size?: number, sort?: string) => {},
  fetchNotificationsCount: () => {},
  deleteNotification: (id: number) => {},
};

export const Notification = React.createContext(initialState);

const NotificationContext = (props) => {

  const [state, setState] = useState(initialState);

  const fetchNotifications = (page?: number, size?: number, sort?: string) => {
    const requestUrl = `api/notifications${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;

    setState(Object.assign({}, state, {loading: true, errorMessage: null}));

    axios.get<INotification[]>(requestUrl).then(payload => {
      setState({
        ...state,
        loading: false,
        totalItems: payload.headers['x-total-count'],
        notifications: payload.data
      });
    }).catch(error => {
      setState({
        ...state,
        loading: false,
        errorMessage: error
      });
    });
  };

  const fetchNotificationsCount = () => {
    const requestUrl = `api/notifications?page=${1}&size=${1}`;

    setState({...state, loading: true, errorMessage: null as unknown as string});

    axios.get<INotification[]>(requestUrl).then(payload => {
      setState({
        ...state,
        loading: false,
        totalItems: payload.headers['x-total-count'],
      });
    }).catch(error => {
      setState({
        ...state,
        loading: false,
        errorMessage: error
      });
    });
  };

  const deleteNotification = (id: number) => {
    setState({...state, loading: true, errorMessage: null as unknown as string});

    axios.delete(`api/notifications/${id}`).then(_ => {
      setState({
        ...state,
        loading: false
      });
    }).catch(error => {
      setState({
        ...state,
        loading: false,
        errorMessage: error
      });
    });
  };

  const context = {
    ...state,
    fetchNotifications,
    fetchNotificationsCount,
    deleteNotification
  };

  return (
    <Notification.Provider value={context}>
      {props.children}
    </Notification.Provider>
  );

};

export default NotificationContext;
