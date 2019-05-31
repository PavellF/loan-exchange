import React, {useState} from 'react';
import axios from "axios";
import {INotification} from "../model/notification.model";
import {parseHeaderForLinks} from "../util/url-utils";
import {NOTIFICATIONS_API} from "../../config/constants";

const initialState = {
  loading: false,
  notifications: [] as ReadonlyArray<INotification>,
  totalItems: 0,
  links: {next: 0},
  error: false,
  fetchNotifications: (page?: number, size?: number, sort?: string) => {
  },
  fetchNotificationsCount: () => {
  },
  deleteNotification: (id: number) => {
  },
};

export const Notifications = React.createContext(initialState);

const NotificationContext = (props) => {

  const [state, setState] = useState(initialState);

  const fetchNotifications = (page?: number, size?: number, sort?: string) => {
    const requestUrl = `${NOTIFICATIONS_API}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;

    setState(oldState => Object.assign({}, oldState, {loading: true, error: false}));

    axios.get<INotification[]>(requestUrl).then(payload => {
      const links = parseHeaderForLinks(payload.headers.link);
      setState(oldState => ({
        ...oldState,
        loading: false,
        links,
        totalItems: payload.headers['x-total-count'],
        notifications: payload.data,
        error: false
      }));
    }).catch(_ => {
      setState(oldState => ({
        ...oldState,
        loading: false,
        error: true
      }));
    });
  };

  const fetchNotificationsCount = () => {
    const requestUrl = `${NOTIFICATIONS_API}?page=0&size=1`;

    setState(oldState => ({...oldState, loading: true, error: false}));

    axios.get<INotification[]>(requestUrl).then(payload => {
      setState(oldState => ({
        ...oldState,
        loading: false,
        totalItems: payload.headers['x-total-count'],
        error: false
      }));
    }).catch(error => {
      setState(oldState => ({
        ...oldState,
        loading: false,
        errorMessage: error,
        error: true
      }));
    });
  };

  const deleteNotification = (id: number) => {
    setState({...state, loading: true, error: false});

    axios.delete(`${NOTIFICATIONS_API}/${id}`).then(_ => {

      setState(oldState => {
        const notifications = oldState.notifications.filter(n => n.id !== id);
        return {
          ...oldState,
          loading: false,
          error: false,
          notifications
        };
      });

    }).catch(_ => {
      setState(oldState => ({
        ...oldState,
        loading: false,
        error: true
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
