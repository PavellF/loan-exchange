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

export const Notifications = React.createContext(initialState);

const NotificationContext = (props) => {

  const [state, setState] = useState(initialState);

  const fetchNotifications = (page?: number, size?: number, sort?: string) => {
    const requestUrl = `api/notifications${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;

    setState(oldState => Object.assign({}, oldState, {loading: true, errorMessage: null}));

    axios.get<INotification[]>(requestUrl).then(payload => {
      setState(oldState => ({
        ...oldState,
        loading: false,
        totalItems: payload.headers['x-total-count'],
        notifications: payload.data
      }));
    }).catch(error => {
      setState(oldState => ({
        ...oldState,
        loading: false,
        errorMessage: error
      }));
    });
  };

  const fetchNotificationsCount = () => {
    const requestUrl = `api/notifications?page=0&size=1`;

    setState(oldState => ({...oldState, loading: true, errorMessage: null as unknown as string}));

    axios.get<INotification[]>(requestUrl).then(payload => {
      setState(oldState => ({
        ...oldState,
        loading: false,
        totalItems: payload.headers['x-total-count'],
      }));
    }).catch(error => {
      setState(oldState => ({
        ...oldState,
        loading: false,
        errorMessage: error
      }));
    });
  };

  const deleteNotification = (id: number) => {
    setState({...state, loading: true, errorMessage: null as unknown as string});

    axios.delete(`api/notifications/${id}`).then(_ => {
      setState(oldState => ({
        ...oldState,
        loading: false
      }));
    }).catch(error => {
      setState(oldState => ({
        ...oldState,
        loading: false,
        errorMessage: error
      }));
    });
  };

  const context = {
    ...state,
    fetchNotifications,
    fetchNotificationsCount,
    deleteNotification
  };

  return (
    <Notifications.Provider value={context}>
      {props.children}
    </Notifications.Provider>
  );

};

export default NotificationContext;
