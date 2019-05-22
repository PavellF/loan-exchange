import React, {useState} from 'react';
import Card from 'antd/lib/card';
import {NumericLogList} from 'app/shared/numeric-log/numeric-log';
import NumericLogGraph from 'app/shared/numeric-log-graph/numeric-log-graph';

const tabList = [
  {
    key: 'logs',
    tab: 'Logs'
  },
  {
    key: 'graph',
    tab: 'Graph'
  }
];

const contentList = {
  logs: <NumericLogList />,
  graph: <NumericLogGraph />
};

const NumericLogCard = props => {
  const [activeTab, setActiveTab] = useState(tabList[0].key);

  return (
    <Card tabList={tabList} activeTabKey={activeTab} onTabChange={key => setActiveTab(key)}>
      {contentList[activeTab]}
    </Card>
  );
};

export default NumericLogCard;
