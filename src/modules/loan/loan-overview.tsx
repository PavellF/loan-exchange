import React, {useContext, useState} from 'react';
import {message} from 'antd';
import {Translation} from "../../shared/contexts/translation";
import axios from "axios";
import {AUTHORITIES, DEALS_API, ITEMS_PER_PAGE} from "../../config/constants";
import {IDeal} from "../../shared/model/deal.model";
import {Authentication} from "../../shared/contexts/authentication";
import LoanSearchForm from "./loan-search-form/loan-search-form";
import Card from "antd/lib/card";
import LoanListCard, {Tabs} from "./loan-list-card/loan-list-card";
import {DealStatus} from "../../shared/model/deal-status";
import {parseHeaderForLinks} from "../../shared/util/url-utils";
import {loadMoreDataWhenScrolled} from "../../shared/util/entity-utils";
import {getSortState} from "../../shared/util/pagination-utils";
import {Moment} from "moment";
import Typography from "antd/lib/typography";
import Button from "antd/lib/button";
import LoanSuggestion from "./loan-suggestion/loan-suggestion";
import {PaymentInterval} from "../../shared/model/payment-interval";
import Icon from "antd/lib/icon";

const {Title} = Typography;

const dealState = {
  deals: [] as ReadonlyArray<IDeal>,
  links: {next: 0},
  totalItems: 0,
  currentTab: Tabs.ACTIVE,
  endDateIntervalStart: 0,
  withStartBalance: 0
};

const LoanOverview = (props) => {
  const translation = useContext(Translation);
  const auth = useContext(Authentication);
  const authorities = auth.account.authorities as string[];
  const t = translation.translation.LoanOverview;
  const isCreditor = authorities.find(a => a === AUTHORITIES.CREDITOR);
  const [deals, setDeals] = useState({
    ...dealState,
    ...getSortState(props.location, ITEMS_PER_PAGE),
    currentTab: isCreditor ? Tabs.ACTIVE : Tabs.SEARCH
  });

  const loadDeals = (url, append = true) => {
    const dismiss = message.loading(t.dealLoading, 0);

    axios.get<IDeal[]>(url).then(payload => {
      const links = parseHeaderForLinks(payload.headers.link);
      const totalItems = payload.headers['x-total-count'];
      setDeals(old => ({
        ...old,
        deals: append ? loadMoreDataWhenScrolled(old.deals, payload.data, links) : payload.data,
        links,
        totalItems
      }));
      dismiss();
    }).catch(_ => {
      dismiss();
      message.error(t.dealsFetchError);
    });
  };

  const searchDeals = (amount: number, minDays: Moment) => {
    setDeals(old => {
      const newState = {
        ...old,
        endDateIntervalStart: minDays.unix(),
        withStartBalance: amount,
        currentTab: Tabs.SEARCH,
        sort: 'successRate',
        order: 'DESC'
      };

      loadDeals(getUrl(newState), false);
      return newState;
    });
  };

  const handleTabChange = (currentTab: Tabs) => {
    setDeals(old => {
      const newState = {
        ...old,
        currentTab,
        sort: 'id',
        order: 'DESC'
      };
      loadDeals(getUrl(newState), false);
      return newState;
    });
  };

  const handleInfiniteOnLoad = () => {
    setDeals(old => {
      const newState = {...old, activePage: old.activePage + 1};
      loadDeals(getUrl(newState));
      return newState;
    });
  };

  const getUrl = (state): string => {
    const {activePage, itemsPerPage, sort, order, currentTab, endDateIntervalStart, withStartBalance} = state;
    const params: string[] = [];
    params.push(`page=${activePage - 1}`);
    params.push(`size=${itemsPerPage}`);
    params.push(`sort=${sort},${order}`);

    if (currentTab === Tabs.SEARCH || currentTab === Tabs.PENDING) {
      params.push(`withStatus=${DealStatus.PENDING}`);
    } else if (currentTab === Tabs.ACTIVE) {
      params.push(`withStatus=${DealStatus.ACTIVE}`);
    }

    if (currentTab === Tabs.SEARCH) {
      params.push(`endDateIntervalStart=${endDateIntervalStart}`);
      params.push(`withStartBalance=${withStartBalance}`);
    }

    const url = `${DEALS_API}?${params.join('&')}`;
    return url;
  };

  const dealClickHandler = (event: React.MouseEvent<HTMLElement>, dealId?: number) => {
    props.history.push(`/loan/${dealId}`);
  };

  const showOnlyTabs = new Set<Tabs>();
  let topCard;

  if (isCreditor) {

    const onSuccessfulCreate = (id: number) => {
      props.history.push(`/loan/${id}`);
    };

    const onNewDealClicked = () => {
      props.history.push('/loan/new');
    };

    topCard = (
      <div className="Margin-Bottom">
        <Card title={t.instantDeal}>
          <div className="Row Around">
            <Card type="inner">
              <LoanSuggestion title={<>{t.deal} 1 <Icon type="dollar" theme="twoTone" /></>}
                              term={3} paymentEvery={PaymentInterval.MONTH} percent={9} onSuccess={onSuccessfulCreate}/>
            </Card>
            <Card type="inner">
              <LoanSuggestion title={<>{t.deal} 2 <Icon type="dollar" theme="twoTone" /></>}
                              term={30} paymentEvery={PaymentInterval.DAY} percent={1} onSuccess={onSuccessfulCreate}/>
            </Card>
            <Card type="inner">
              <LoanSuggestion title={<>{t.deal} 3 <Icon type="dollar" theme="twoTone" /></>}
                              term={90} paymentEvery={PaymentInterval.ONE_TIME} percent={25} onSuccess={onSuccessfulCreate}/>
            </Card>
          </div>
          <div className="Line-Centered Margin-Top">
            <Button size="large" type="dashed" onClick={onNewDealClicked}>{t.newDeal}</Button>
          </div>
        </Card>
      </div>
    );
    showOnlyTabs.add(Tabs.ACTIVE);
    showOnlyTabs.add(Tabs.PENDING);
    showOnlyTabs.add(Tabs.ALL);
  } else {
    topCard = (
      <div className="Margin-Bottom">
        <Card title={t.dealSearch}>
          <div className="Line-Centered">
            <LoanSearchForm onSearchClicked={searchDeals}/>
          </div>
        </Card>
      </div>
    );
    showOnlyTabs.add(Tabs.ACTIVE);
    showOnlyTabs.add(Tabs.ALL);
    showOnlyTabs.add(Tabs.SEARCH)
  }

  return (
    <>
      {topCard}
      <LoanListCard handleInfiniteOnLoad={handleInfiniteOnLoad}
                    dealClickHandler={dealClickHandler}
                    hasMore={deals.activePage - 1 < deals.links.next}
                    pageStart={deals.activePage}
                    showOnlyTabs={showOnlyTabs}
                    active={deals.currentTab}
                    deals={deals.deals}
                    tabChanged={handleTabChange}/>
    </>
  );
};

export default LoanOverview;
