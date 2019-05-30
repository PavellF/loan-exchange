import React, {useContext, useEffect, useState} from 'react';
import Card from 'antd/lib/card';
import NumericLogGraph from "../numeric-log-graph/numeric-log-graph";
import {Translation} from "../contexts/translation";
import {IBalanceLog} from "../model/balance-log.model";
import {getSortState} from "../util/pagination-utils";
import axios from "axios";
import {ITEMS_PER_PAGE, LOGS_API} from "../../config/constants";
import {message, Statistic} from "antd";
import Empty from "antd/lib/empty";
import {parseHeaderForLinks} from "../util/url-utils";
import {loadMoreDataWhenScrolled} from "../util/entity-utils";
import List from "antd/lib/list";
import InfiniteScroll from 'react-infinite-scroller';
import {percentageDifference} from "../util/math-utils";
import Icon from "antd/lib/icon";
import moment from "moment";

export enum LogsTab {
  LOGS = 'LOGS',
  GRAPH = 'GRAPH'
}

const getPercentageDifference = percent =>
  percent > 0 ? (
    <Statistic value={Math.abs(percent)} precision={2} valueStyle={{color: '#3f8600'}}
               prefix={<Icon type="arrow-up"/>} suffix="%"/>
  ) : (
    <Statistic value={Math.abs(percent)} precision={2} valueStyle={{color: '#cf1322'}}
               prefix={<Icon type="arrow-down"/>} suffix="%"/>
  );

const NumericLogCard = ({location, dealId = null as unknown as number, userId = null as unknown as number}) => {
  const t = useContext(Translation).translation;

  const tabList = [
    {
      key: LogsTab.LOGS,
      tab: t.LogsTab[LogsTab.LOGS]
    },
    {
      key: LogsTab.GRAPH,
      tab: t.LogsTab[LogsTab.GRAPH]
    }
  ];

  const NumericLog = (item: IBalanceLog) => {
    const newValue = item.amountChanged + item.oldValue;
    const percentageChange = percentageDifference(item.oldValue, newValue);

    return (
      <List.Item key={item.id} className="Row Between">
        <Statistic title={t.BalanceLogEvent[item.type]} value={moment(item.date).calendar()}/>
        <div className="Row Between">
          <Statistic title={t.balance} value={newValue} prefix={'¢'} suffix={getPercentageDifference(percentageChange)}/>
          <Statistic style={{marginLeft: '1rem'}} title={t.change} value={item.amountChanged} prefix={'¢'}
                     valueStyle={{color: item.amountChanged < 0 ? '#cf1322' : '#3f8600'}}
          />
        </div>
      </List.Item>
    );
  };

  const [state, setState] = useState({
    logs: [] as ReadonlyArray<IBalanceLog>,
    links: {next: 0},
    totalItems: 0,
    currentTab: LogsTab.LOGS,
    error: false,
    ...getSortState(location, ITEMS_PER_PAGE),
  });

  useEffect(() => {
    handleInfiniteOnLoad(0);
  }, []);

  const loadLogs = (urlParams: any) => {

    const params = Object.entries(urlParams).map(([key, value]) => {
      if (value) {
        return `${key}=${value}`;
      }
    });
    const url = `${LOGS_API}${params.length > 0 ? `?${params.join('&')}` : ''}`;
    const dismiss = message.loading(t.logsLoading, 0);

    axios.get<IBalanceLog[]>(url).then(payload => {
      const links = parseHeaderForLinks(payload.headers.link);
      const totalItems = payload.headers['x-total-count'];
      setState(old => ({
        ...old,
        error: false,
        links,
        totalItems,
        logs: loadMoreDataWhenScrolled(old.logs, payload.data, links)
      }));
      dismiss();
    }).catch(error => {
      setState(old => ({...old, error: true}));
      dismiss();
      message.error(t.logsLoadFail, 5);
    });

  };

  const handleTabChange = (key: string) => {
    setState(old => ({...old, currentTab: key as LogsTab}));
  };

  const handlePeriodChange = (startDaysAgo?: number) => {
    const params: any = {};
    params.startDaysAgo = startDaysAgo;
    loadLogs(params);
  };

  const handleInfiniteOnLoad = (page?: number) => {
    setState(old => {
      const newState = {...old, activePage: old.activePage + 1};
      const params: any = {};
      params.page = page !== undefined ? page : old.activePage;
      params.size = newState.itemsPerPage;
      params.sort = `${newState.sort},${newState.order}`;
      params.forDeal = dealId;
      params.forUser = userId;
      loadLogs(params);
      return newState;
    });
  };

  let content;

  if (state.currentTab === LogsTab.LOGS) {

    if (state.logs.length === 0 || state.error) {
      content = <Empty description={t.noItems} image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
    } else {
      content = (
        <InfiniteScroll
          pageStart={state.activePage}
          loadMore={handleInfiniteOnLoad}
          hasMore={state.activePage - 1 < state.links.next}
          threshold={0}
          initialLoad={false}
          useWindow={false}
        >
          <List size="large" bordered dataSource={[...state.logs]} renderItem={NumericLog}/>
        </InfiniteScroll>
      );
    }
  } else {
    content = <NumericLogGraph logs={state.logs} onPeriodChange={handlePeriodChange}/>;
  }

  return (
    <Card tabList={tabList} activeTabKey={state.currentTab} onTabChange={handleTabChange}>
      {content}
    </Card>
  );
};

export default NumericLogCard;
