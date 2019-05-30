import React, {useContext, useState} from 'react';
import {Card} from 'antd';
import Empty from 'antd/lib/empty';
import {Translation} from "../../../shared/contexts/translation";
import {IDeal} from "../../../shared/model/deal.model";
import {TextAlignProperty} from "csstype";
import {PaymentInterval} from "../../../shared/model/payment-interval";
import LoanEntry from "../loan-entry/loan-entry";
import InfiniteScroll from 'react-infinite-scroller';

export enum Tabs {
  SEARCH = 'SEARCH',
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  ALL = 'ALL'
}

const gridStyle = {
  width: '100%',
  textAlign: "left" as TextAlignProperty,
  cursor: 'pointer'
};

interface LoanListCardProps {
  deals: ReadonlyArray<IDeal>;
  tabChanged: (title: Tabs) => void;
  handleInfiniteOnLoad: () => void;
  dealClickHandler: (event: React.MouseEvent<HTMLElement>, dealId?: number) => void;
  active?: Tabs;
  showOnlyTabs?: Set<Tabs>;
  pageStart: number;
  hasMore: boolean;
}

const LoanListCard = (props: LoanListCardProps) => {

  const translation = useContext(Translation);
  const t = translation.translation.LoanListCard;

  let tabList = [
    {
      key: Tabs.SEARCH,
      tab: t.searchTab
    },
    {
      key: Tabs.ACTIVE,
      tab: t.activeTab
    },
    {
      key: Tabs.PENDING,
      tab: t.pending
    },
    {
      key: Tabs.ALL,
      tab: t.all
    }
  ];

  if (props.showOnlyTabs) {
    tabList = tabList.filter((tab: any) => {
      // @ts-ignore
      return props.showOnlyTabs.has(tab.key);
    });
  }

  const [activeTab, setActiveTab] = useState(props.active ? props.active : tabList[0].key);

  const onTabChange = (key: string) => {
    setActiveTab(key as Tabs);
    props.tabChanged(key as Tabs);
  };

  let tabBody;

  if (props.deals.length > 0) {
    tabBody = props.deals.map(deal => {
      return (
        <Card.Grid style={gridStyle} key={deal.id}>
          <LoanEntry clickHandler={(event) => props.dealClickHandler(event, deal.id)}
                     percent={deal.percent as number}
                     paymentEvery={deal.paymentEvery as PaymentInterval}
                     startBalance={deal.startBalance as number}
                     term={deal.term as number}/>

        </Card.Grid>
      );
    });
  } else {
    tabBody = <Empty description={translation.translation.noItems} image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
  }

  return (
    <Card tabList={tabList} activeTabKey={activeTab} onTabChange={onTabChange}>
      <InfiniteScroll
        pageStart={props.pageStart}
        loadMore={props.handleInfiniteOnLoad}
        hasMore={props.hasMore}
        threshold={0}
        initialLoad={false}
        useWindow={false}
      >
        {tabBody}
      </InfiniteScroll>
    </Card>
  );
};

export default LoanListCard;
