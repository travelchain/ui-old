import React from "react";
import {PropTypes} from "react";
import MarketsActions from "actions/MarketsActions";
import { MyOpenOrders } from "./MyOpenOrders";
import OrderBook from "./OrderBook";
import MarketHistory from "./MarketHistory";
import MyMarkets from "./MyMarkets";
import BuySell from "./BuySell";
import utils from "common/utils";
import PriceChartD3 from "./PriceChartD3";
import assetUtils from "common/asset_utils";
import DepthHighChart from "./DepthHighChart";
import { debounce, cloneDeep } from "lodash";
import BorrowModal from "../Modal/BorrowModal";
import notify from "actions/NotificationActions";
import AccountNotifications from "../Notifier/NotifierContainer";
import Ps from "perfect-scrollbar";
import { ChainStore, FetchChain } from "bitsharesjs/es";
import SettingsActions from "actions/SettingsActions";
import cnames from "classnames";
import market_utils from "common/market_utils";
import {Asset, Price, LimitOrderCreate} from "common/MarketClasses";
import ConfirmOrderModal from "./ConfirmOrderModal";
// import IndicatorModal from "./IndicatorModal";
import OpenSettleOrders from "./OpenSettleOrders";
import Highcharts from "highcharts/highstock";
import ExchangeHeader from "./ExchangeHeader";
import Translate from "react-translate-component";
import { Apis } from "bitsharesjs-ws";
import GatewayActions from "actions/GatewayActions";
import { checkFeeStatusAsync } from "common/trxHelper";
import HelpContent from "../Utility/HelpContent";
import BlockTradesGateway from "../DepositWithdraw/BlockTradesGateway";
import DataTables from 'material-ui-datatables';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const travelchainTheme = getMuiTheme();

Highcharts.setOptions({
  global: {
    useUTC: false
  }
});

class Exchange extends React.Component {
  static propTypes = {
    marketCallOrders: PropTypes.object.isRequired,
    activeMarketHistory: PropTypes.object.isRequired,
    viewSettings: PropTypes.object.isRequired,
    priceData: PropTypes.array.isRequired,
    volumeData: PropTypes.array.isRequired
  };

  static defaultProps = {
    marketCallOrders: [],
    activeMarketHistory: {},
    viewSettings: {},
    priceData: [],
    volumeData: []
  };

  constructor(props) {
    super();

    this.state = this._initialState(props);

    this._getWindowSize = debounce(this._getWindowSize.bind(this), 150);
    this._checkFeeStatus = this._checkFeeStatus.bind(this);
    this.psInit = true;
  }




  _initialState(props) {
    let ws = props.viewSettings;
    let bid = {
      forSaleText: "",
      toReceiveText: "",
      priceText: "",
      for_sale: new Asset({
        asset_id: props.baseAsset.get("id"),
        precision: props.baseAsset.get("precision")
      }),
      to_receive: new Asset({
        asset_id: props.quoteAsset.get("id"),
        precision: props.quoteAsset.get("precision")
      })
    };
    bid.price = new Price({base: bid.for_sale, quote: bid.to_receive});
    let ask = {
      forSaleText: "",
      toReceiveText: "",
      priceText: "",
      for_sale: new Asset({
        asset_id: props.quoteAsset.get("id"),
        precision: props.quoteAsset.get("precision")
      }),
      to_receive: new Asset({
        asset_id: props.baseAsset.get("id"),
        precision: props.baseAsset.get("precision")
      })
    };
    ask.price = new Price({base: ask.for_sale, quote: ask.to_receive});

    /* Make sure the indicators objects only contains the current indicators */
    let savedIndicators = ws.get("indicators", {});
    let indicators = {};
    [["sma", true], ["ema1", false], ["ema2", false], ["smaVolume", true], ["macd", false], ["bb", false]].forEach(i => {
      indicators[i[0]] = (i[0] in savedIndicators) ? savedIndicators[i[0]] : i[1];
    });

    let savedIndicatorsSettings = ws.get("indicatorSettings", {});
    let indicatorSettings = {};
    [["sma", 7], ["ema1", 20], ["ema2", 50], ["smaVolume", 30]].forEach(i => {
      indicatorSettings[i[0]] = (i[0] in savedIndicatorsSettings) ?  savedIndicatorsSettings[i[0]] : i[1];
    });




    return {
      history: [],
      buySellOpen: ws.get("buySellOpen", true),
      bid,
      ask,
      flipBuySell: ws.get("flipBuySell", false),
      favorite: false,
      showDepthChart: ws.get("showDepthChart", false),
      leftOrderBook: ws.get("leftOrderBook", false),
      buyDiff: false,
      sellDiff: false,
      indicators,
      buySellTop: ws.get("buySellTop", true),
      buyFeeAssetIdx: ws.get("buyFeeAssetIdx", 0),
      sellFeeAssetIdx: ws.get("sellFeeAssetIdx", 0),
      indicatorSettings,
      tools: {
        fib: false,
        trendline: false
      },
      height: window.innerHeight,
      width: window.innerWidth,
      chartHeight: ws.get("chartHeight", 425),
      currentPeriod: ws.get("currentPeriod", 3600* 24 * 30 * 3) // 3 months
    };
  }

  _getLastMarketKey() {
    const chainID = Apis.instance().chain_id;
    return `lastMarket${chainID ? ("_" + chainID.substr(0, 8)) : ""}`;
  }

  componentWillMount() {
    if (Apis.instance().chain_id.substr(0, 8)=== "5cfd61a0") {
      GatewayActions.fetchCoins.defer();
      GatewayActions.fetchBridgeCoins.defer();

    }

    this._checkFeeStatus();
  }

  componentDidMount() {
    SettingsActions.changeViewSetting.defer({
      [this._getLastMarketKey()]: this.props.quoteAsset.get("symbol") + "_" + this.props.baseAsset.get("symbol")
    });

    window.addEventListener("resize", this._getWindowSize, {capture: false, passive: true});

    fetch("https://wallet.travelchain.io/api/ladder/1/")
      .then(res => res.json())
      .then(
        (result) => {


          this.setState({
            ladders: result,
          });

        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            ladders: result,
          });
        }
      )

    fetch("https://wallet.travelchain.io/api/v.0.1/transactions/")
      .then(res => res.json())
      .then(
        (result) => {

          console.log(result.results);
          this.setState({
            trxs: result.results,
          });

        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          
        }
      )

    
  }

  

  shouldComponentUpdate(nextProps) {
    if (!nextProps.marketReady && !this.props.marketReady) {
      return false;
    }
    return true;
  };

  _checkFeeStatus(assets = [this.props.coreAsset, this.props.baseAsset, this.props.quoteAsset], account = this.props.currentAccount) {
    let feeStatus = {};
    let p = [];
    assets.forEach(a => {
      p.push(checkFeeStatusAsync({accountID: account.get("id"), feeID: a.get("id"), type: "limit_order_create"}));
    });
    Promise.all(p).then(status => {
      assets.forEach((a, idx) => {
        feeStatus[a.get("id")] = status[idx];
      });
      if (!utils.are_equal_shallow(this.state.feeStatus, feeStatus)) {
        this.setState({
          feeStatus
        });
      }
    });
  }

  _getWindowSize() {
    let { innerHeight, innerWidth } = window;
    if (innerHeight !== this.state.height || innerWidth !== this.state.width) {
      this.setState({
        height: innerHeight,
        width: innerWidth
      });
      let centerContainer = this.refs.center;
      if (centerContainer) {
        Ps.update(centerContainer);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.refs.center && this.psInit) {
      let centerContainer = this.refs.center;
      if (centerContainer) {
        Ps.initialize(centerContainer);
        this.psInit = false;
      }
    }
    if (
      nextProps.quoteAsset !== this.props.quoteAsset ||
      nextProps.baseAsset !== this.props.baseAsset ||
      nextProps.currentAccount !== this.props.currentAccount) {
      this._checkFeeStatus([nextProps.coreAsset, nextProps.baseAsset, nextProps.quoteAsset], nextProps.currentAccount);
    }
    if (nextProps.quoteAsset.get("symbol") !== this.props.quoteAsset.get("symbol") || nextProps.baseAsset.get("symbol") !== this.props.baseAsset.get("symbol")) {
      this.setState(this._initialState(nextProps));

      return SettingsActions.changeViewSetting({
        [this._getLastMarketKey()]: nextProps.quoteAsset.get("symbol") + "_" + nextProps.baseAsset.get("symbol")
      });
    }

    if (this.props.sub && nextProps.bucketSize !== this.props.bucketSize) {
      return this._changeBucketSize(nextProps.bucketSize);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._getWindowSize);
  }

  _getFeeAssets(quote, base, coreAsset) {
    let { currentAccount } = this.props;
    const { feeStatus } = this.state;

    function addMissingAsset(target, asset) {
      if (target.indexOf(asset) === -1) {
        target.push(asset);
      }
    }

    function hasFeePoolBalance(id) {
      return feeStatus[id] && feeStatus[id].hasPoolBalance;
    }

    function hasBalance(id) {
      return feeStatus[id] && feeStatus[id].hasBalance;
    }

    let sellAssets = [coreAsset, quote === coreAsset ? base : quote];
    addMissingAsset(sellAssets, quote);
    addMissingAsset(sellAssets, base);
    // let sellFeeAsset;

    let buyAssets = [coreAsset, base === coreAsset ? quote : base];
    addMissingAsset(buyAssets, quote);
    addMissingAsset(buyAssets, base);
    // let buyFeeAsset;

    let balances = {};

    currentAccount.get("balances", []).filter((balance, id) => {
      return (["1.3.0", quote.get("id"), base.get("id")].indexOf(id) >= 0);
    }).forEach((balance, id) => {
      let balanceObject = ChainStore.getObject(balance);
      balances[id] = {
        balance: balanceObject ? parseInt(balanceObject.get("balance"), 10) : 0,
        fee: this._getFee(ChainStore.getAsset(id))
      };
    });

    function filterAndDefault(assets, balances, idx) {
      let asset;
      /* Only keep assets for which the user has a balance larger than the fee, and for which the fee pool is valid */
      assets = assets.filter(a => {
        if (!balances[a.get("id")]) {
          return false;
        };
        return hasFeePoolBalance(a.get("id")) && hasBalance(a.get("id"));
      });

      /* If the user has no valid balances, default to core fee */
      if (!assets.length) {
        asset = coreAsset;
        assets.push(coreAsset);
        /* If the user has balances, use the stored idx value unless that asset is no longer available*/
      } else {
        asset = assets[Math.min(assets.length - 1, idx)];
      }

      return {assets, asset};
    }

    let {assets: sellFeeAssets, asset: sellFeeAsset} = filterAndDefault(sellAssets, balances, this.state.sellFeeAssetIdx);
    let {assets: buyFeeAssets, asset: buyFeeAsset} = filterAndDefault(buyAssets, balances, this.state.buyFeeAssetIdx);

    let sellFee = this._getFee(sellFeeAsset);
    let buyFee = this._getFee(buyFeeAsset);

    return {
      sellFeeAsset,
      sellFeeAssets,
      sellFee,
      buyFeeAsset,
      buyFeeAssets,
      buyFee
    };
  }

  _getFee(asset = this.props.coreAsset) {
    return this.state.feeStatus[asset.get("id")] && this.state.feeStatus[asset.get("id")].fee;
  }

  _verifyFee(fee, sellAmount, sellBalance, coreBalance) {
    let coreFee = this._getFee();

    let sellSum = fee.getAmount() + sellAmount;
    if (fee.asset_id === "1.3.0") {
      if (coreFee.getAmount() <= coreBalance) {
        return "1.3.0";
      } else {
        return null;
      }
    } else {
      if (sellSum <= sellBalance) { // Sufficient balance in asset to pay fee
        return fee.asset_id;
      } else if (coreFee.getAmount() <= coreBalance && fee.asset_id !== "1.3.0") { // Sufficient balance in core asset to pay fee
        return "1.3.0";
      } else {
        return null; // Unable to pay fee in either asset
      }
    }
  }

  _createLimitOrderConfirm(buyAsset, sellAsset, sellBalance, coreBalance, feeAsset, type, short = true, e) {
    e.preventDefault();
    let {highestBid, lowestAsk} = this.props.marketData;
    let current = this.state[type === "sell" ? "ask" : "bid"];

    sellBalance = current.for_sale.clone(sellBalance ? parseInt(ChainStore.getObject(sellBalance).toJS().balance, 10) : 0);
    coreBalance = new Asset({
      amount: coreBalance ? parseInt(ChainStore.getObject(coreBalance).toJS().balance, 10) : 0
    });

    let fee = this._getFee(feeAsset);

    let feeID = this._verifyFee(fee, current.for_sale.getAmount(), sellBalance.getAmount(), coreBalance.getAmount());
    if (!feeID) {
      return notify.addNotification({
        message: "Insufficient funds to pay fees",
        level: "error"
      });
    }

    if (type === "buy" && lowestAsk) {
      let diff = this.state.bid.price.toReal() / lowestAsk.getPrice();
      if (diff > 1.20) {
        this.refs.buy.show();
        return this.setState({
          buyDiff: diff
        });
      }
    } else if (type === "sell" && highestBid) {
      let diff = 1 / (this.state.ask.price.toReal() / highestBid.getPrice());
      if (diff > 1.20) {
        this.refs.sell.show();
        return this.setState({
          sellDiff: diff
        });
      }
    }

    let isPredictionMarket = sellAsset.getIn(["bitasset", "is_prediction_market"]);

    if (current.for_sale.gt(sellBalance) && !isPredictionMarket) {
      return notify.addNotification({
        message: "Insufficient funds to place order, you need at least " + current.for_sale.getAmount({real: true}) + " " + sellAsset.get("symbol"),
        level: "error"
      });
    }
    //
    if (!(current.for_sale.getAmount() > 0 && current.to_receive.getAmount() > 0)) {
      return notify.addNotification({
        message: "Please enter a valid amount and price",
        level: "error"
      });
    }
    //
    if (type === "sell" && isPredictionMarket && short) {
      return this._createPredictionShort(feeID);
    }



    this._createLimitOrder(type, feeID);
  }

  _createLimitOrder(type, feeID) {
    let current = this.state[type === "sell" ? "ask" : "bid"];
    const order = new LimitOrderCreate({
      for_sale: current.for_sale,
      to_receive: current.to_receive,
      seller: this.props.currentAccount.get("id"),
      fee: {
        asset_id: feeID,
        amount: 0
      }
    });
    const {marketID, first} = market_utils.getMarketID(this.props.baseAsset, this.props.quoteAsset);
    const inverted = this.props.marketDirections.get(marketID);
    const shouldFlip = inverted && first.get("id") !== this.props.baseAsset.get("id") ||
      !inverted && first.get("id") !== this.props.baseAsset.get("id");
    if (shouldFlip) {
      let setting = {};
      setting[marketID] = !inverted;
      SettingsActions.changeMarketDirection(setting);
    }
    console.log("order:", JSON.stringify(order.toObject()));
    return MarketsActions.createLimitOrder2(order).then((result) => {
      if (result.error) {
        if (result.error.message !== "wallet locked")
          notify.addNotification({
            message: "Unknown error. Failed to place order for " + current.to_receive.getAmount({real: true}) + " " + current.to_receive.asset_id,
            level: "error"
          });
      }
      // console.log("order success");
    }).catch(e => {
      console.log("order failed:", e);
    });
  }

  _createPredictionShort(feeID) {
    let current = this.state.ask;
    const order = new LimitOrderCreate({
      for_sale: current.for_sale,
      to_receive: current.to_receive,
      seller: this.props.currentAccount.get("id"),
      fee: {
        asset_id: feeID,
        amount: 0
      }
    });

    Promise.all([
      FetchChain("getAsset", this.props.quoteAsset.getIn(["bitasset", "options", "short_backing_asset"]))
    ]).then(assets => {
      let [backingAsset] = assets;
      let collateral = new Asset({
        amount: order.amount_for_sale.getAmount(),
        asset_id: backingAsset.get("id"),
        precision: backingAsset.get("precision")
      });

      MarketsActions.createPredictionShort(
        order,
        collateral
      ).then(result => {
        if (result.error) {
          if (result.error.message !== "wallet locked")
            notify.addNotification({
              message: "Unknown error. Failed to place order for " + buyAssetAmount + " " + buyAsset.symbol,
              level: "error"
            });
        }
      });
    });
  }


  _forceBuy(type, feeAsset, sellBalance, coreBalance) {
    let current = this.state[type === "sell" ? "ask" : "bid"];
    // Convert fee to relevant asset fee and check if user has sufficient balance
    sellBalance = current.for_sale.clone(sellBalance ? parseInt(ChainStore.getObject(sellBalance).get("balance"), 10) : 0);
    coreBalance = new Asset({
      amount: coreBalance ? parseInt(ChainStore.getObject(coreBalance).toJS().balance, 10) : 0
    });
    let fee = this._getFee(feeAsset);
    let feeID = this._verifyFee(fee, current.for_sale.getAmount(), sellBalance.getAmount(), coreBalance.getAmount());

    if (feeID) {
      this._createLimitOrder(type, feeID);
    } else {
      console.error("Unable to pay fees, aborting limit order creation");
    }
  }

  _forceSell(type, feeAsset, sellBalance, coreBalance) {
    let current = this.state[type === "sell" ? "ask" : "bid"];
    // Convert fee to relevant asset fee and check if user has sufficient balance
    sellBalance = current.for_sale.clone(sellBalance ? parseInt(ChainStore.getObject(sellBalance).get("balance"), 10) : 0);
    coreBalance = new Asset({
      amount: coreBalance ? parseInt(ChainStore.getObject(coreBalance).toJS().balance, 10) : 0
    });
    let fee = this._getFee(feeAsset);
    let feeID = this._verifyFee(fee, current.for_sale.getAmount(), sellBalance.getAmount(), coreBalance.getAmount());

    if (feeID) {
      this._createLimitOrder(type, feeID);
    } else {
      console.error("Unable to pay fees, aborting limit order creation");
    }
  }

  _cancelLimitOrder(orderID, e) {
    e.preventDefault();
    let { currentAccount } = this.props;
    MarketsActions.cancelLimitOrder(
      currentAccount.get("id"),
      orderID // order id to cancel
    );
  }

  _changeBucketSize(size, e) {
    if (e) e.preventDefault();
    if (size !== this.props.bucketSize) {
      MarketsActions.changeBucketSize.defer(size);
      let currentSub = this.props.sub.split("_");
      MarketsActions.unSubscribeMarket.defer(currentSub[0], currentSub[1]);
      this.props.subToMarket(this.props, size);
    }
  }

  _changeZoomPeriod(size, e) {
    e.preventDefault();
    if (size !== this.state.currentPeriod) {
      this.setState({
        currentPeriod: size
      });
      SettingsActions.changeViewSetting({
        currentPeriod: size
      });
    }
  }

  _depthChartClick(base, quote, power, e) {
    e.preventDefault();
    let {bid, ask} = this.state;

    bid.price = new Price({
      base: this.state.bid.for_sale,
      quote: this.state.bid.to_receive,
      real: e.xAxis[0].value / power
    });
    bid.priceText = bid.price.toReal();

    ask.price = new Price({
      base: this.state.ask.to_receive,
      quote: this.state.ask.for_sale,
      real: e.xAxis[0].value / power
    });
    ask.priceText = ask.price.toReal();
    let newState = {
      bid,
      ask,
      depthLine: bid.price.toReal()
    };

    this._setForSale(bid, true) || this._setReceive(bid, true);
    this._setReceive(ask) || this._setForSale(ask);

    this._setPriceText(bid, true);
    this._setPriceText(ask, false);
    // if (bid.for_sale.)
    this.setState(newState);
  }

  _flipBuySell() {
    SettingsActions.changeViewSetting({
      flipBuySell: !this.state.flipBuySell
    });

    this.setState({ flipBuySell: !this.state.flipBuySell });
  }

  _toggleOpenBuySell() {
    SettingsActions.changeViewSetting({
      buySellOpen: !this.state.buySellOpen
    });

    this.setState({ buySellOpen: !this.state.buySellOpen });
  }

  _toggleCharts() {
    SettingsActions.changeViewSetting({
      showDepthChart: !this.state.showDepthChart
    });

    this.setState({ showDepthChart: !this.state.showDepthChart });
  }

  _moveOrderBook() {
    SettingsActions.changeViewSetting({
      leftOrderBook: !this.state.leftOrderBook
    });

    this.setState({ leftOrderBook: !this.state.leftOrderBook });
  }


  get_next_price(ladders){
    let current_stage = ladders.current_stage;

    if (current_stage == "0-100k"){
      return 0.01596;
    } 
    if (current_stage == "100k-500k"){
      return 0.01672;
    } 
    if (current_stage == "500k-1kk"){
      return 0.01778;
    } 

  }

  get_current_price(ladders){
    let current_price = 1/ladders.current_price;
    return current_price.toFixed(4);
  }

  get_remain_amount(ladders){
    let current_stage = ladders.current_stage;
    let remain = 0;

    if (current_stage == "0-100k"){
      remain = 100000 - ladders.amount;

      return remain.toFixed(4);
    } 
    if (current_stage == "100k-500k"){
      remain = 500000 - ladders.amount;

      return remain.toFixed(4);
    } 
    if (current_stage == "500k-1kk"){
      remain = 500000 - ladders.amount;

      return remain.toFixed(4);
    }
    if (current_stage == "1kk-9.6kk"){
      remain = 9600000 - ladders.amount;

      return remain.toFixed(4);
    } 
  }

  get_total_raised(ladders){

    let total_amount = ladders.amount + 606000 + 598000;
    total_amount = total_amount.toFixed(4)
    return total_amount;
    
  }
  

  _currentPriceClick(type, price) {
    const isBid = type === "bid";
    let current = this.state[type];
    current.price = price[(isBid) ? "invert" : "clone"]();
    current.priceText = current.price.toReal();
    if (isBid) {
      this._setForSale(current, isBid) || this._setReceive(current, isBid);
    } else {
      this._setReceive(current, isBid) || this._setForSale(current, isBid);
    }
    this.forceUpdate();
  }

  _orderbookClick(order) {
    const isBid = order.isBid();
    /*
    * Because we are using a bid order to construct an ask and vice versa,
    * totalToReceive becomes forSale, and totalForSale becomes toReceive
    */
    let forSale = order.totalToReceive({noCache: true});
    // let toReceive = order.totalForSale({noCache: true});
    let toReceive = forSale.times(order.sellPrice());

    let newPrice = new Price({
      base: isBid ? toReceive : forSale,
      quote: isBid ? forSale : toReceive
    });

    let current = this.state[isBid ? "bid" : "ask"];
    current.price = newPrice;
    current.priceText = newPrice.toReal();

    let newState = { // If isBid is true, newState defines a new ask order and vice versa
      [isBid ? "ask" : "bid"]: {
        for_sale: forSale,
        forSaleText: forSale.getAmount({real: true}),
        to_receive: toReceive,
        toReceiveText: toReceive.getAmount({real: true}),
        price: newPrice,
        priceText: newPrice.toReal()
      }
    };

    if (isBid) {
      this._setForSale(current, isBid) || this._setReceive(current, isBid);
    } else {
      this._setReceive(current, isBid) || this._setForSale(current, isBid);
    }
    this.setState(newState);
  }

  _borrowQuote() {
    this.refs.borrowQuote.show();
  }

  _borrowBase() {
    this.refs.borrowBase.show();
  }

  _onSelectIndicators() {
    this.refs.indicators.show();
  }

  _getSettlementInfo() {
    let {lowestCallPrice, feedPrice, quoteAsset} = this.props;

    let showCallLimit = false;
    if (feedPrice) {
      if (feedPrice.inverted) {
        showCallLimit = lowestCallPrice <= feedPrice.toReal();
      } else {
        showCallLimit = lowestCallPrice >= feedPrice.toReal();
      }
    }
    return !!(showCallLimit && lowestCallPrice && !quoteAsset.getIn(["bitasset", "is_prediction_market"]));
  }

  _changeIndicator(key) {
    let indicators = cloneDeep(this.state.indicators);
    indicators[key] = !indicators[key];
    this.setState({
      indicators
    });

    SettingsActions.changeViewSetting({
      indicators
    });
  }

  _changeIndicatorSetting(key, e) {
    e.preventDefault();
    let indicatorSettings = cloneDeep(this.state.indicatorSettings);
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      value = 1;
    }
    indicatorSettings[key] = value;

    this.setState({
      indicatorSettings: indicatorSettings
    });

    SettingsActions.changeViewSetting({
      indicatorSettings: indicatorSettings
    });
  }

  onChangeFeeAsset(type, e) {
    e.preventDefault();
    if (type === "buy") {
      this.setState({
        buyFeeAssetIdx: e.target.value
      });

      SettingsActions.changeViewSetting({
        "buyFeeAssetIdx": e.target.value
      });
    } else {
      this.setState({
        sellFeeAssetIdx: e.target.value
      });

      SettingsActions.changeViewSetting({
        "sellFeeAssetIdx": e.target.value
      });
    }
  }

  onChangeChartHeight({value, increase}) {
    const newHeight = value ? value : this.state.chartHeight + (increase ? 20 : -20);
    console.log("newHeight", newHeight);
    this.setState({
      chartHeight: newHeight
    });

    SettingsActions.changeViewSetting({
      "chartHeight": newHeight
    });
  }

  _toggleBuySellPosition() {
    this.setState({
      buySellTop: !this.state.buySellTop
    });

    SettingsActions.changeViewSetting({
      buySellTop: !this.state.buySellTop
    });
  }

  _setReceive(state, isBid) {
    if (state.price.isValid() && state.for_sale.hasAmount()) {
      state.to_receive = state.for_sale.times(state.price);
      state.toReceiveText = state.to_receive.getAmount({real: true}).toString();
      return true;
    }
    return false;
  }

  _setForSale(state, isBid) {
    if (state.price.isValid() && state.to_receive.hasAmount()) {
      state.for_sale = state.to_receive.times(state.price, true);
      state.forSaleText = state.for_sale.getAmount({real: true}).toString();
      return true;
    }
    return false;
  }

  _setPrice(state) {
    if (state.for_sale.hasAmount() && state.to_receive.hasAmount()) {
      state.price = new Price({
        base: state.for_sale,
        quote: state.to_receive
      });
      state.priceText = state.price.toReal().toString();
      return true;
    }
    return false;
  }

  _setPriceText(state, isBid) {
    const currentBase = state[isBid ? "for_sale" : "to_receive"];
    const currentQuote = state[isBid ? "to_receive" : "for_sale"];
    if (currentBase.hasAmount() && currentQuote.hasAmount()) {
      state.priceText = new Price({
        base: currentBase,
        quote: currentQuote,
      }).toReal().toString();
    }
  }

  _onInputPrice(type, e) {
    let current = this.state[type];
    const isBid = type === "bid";
    current.price = new Price({
      base: current[isBid ? "for_sale" : "to_receive"],
      quote: current[isBid ? "to_receive" : "for_sale"],
      real: parseFloat(e.target.value) || 0
    });

    if (isBid) {
      this._setForSale(current, isBid) || this._setReceive(current, isBid);
    } else {
      this._setReceive(current, isBid) || this._setForSale(current, isBid);
    }

    current.priceText = e.target.value;
    this.forceUpdate();
  }

  _onInputSell(type, isBid, e) {
    let current = this.state[type];
    // const isBid = type === "bid";
    current.for_sale.setAmount({real: parseFloat(e.target.value) || 0});

    if (current.price.isValid()) {
      this._setReceive(current, isBid);
    } else {
      this._setPrice(current);
    }

    current.forSaleText = e.target.value;
    this._setPriceText(current, type === "bid");

    this.forceUpdate();
  }

  _onInputReceive(type, isBid, e) {
    let current = this.state[type];
    // const isBid = type === "bid";
    current.to_receive.setAmount({real: parseFloat(e.target.value) || 0});

    if (current.price.isValid()) {
      this._setForSale(current, isBid);
    } else {
      this._setPrice(current);
    }

    current.toReceiveText = e.target.value;
    this._setPriceText(current, type === "bid");
    this.forceUpdate();
  }

  isMarketFrozen() {
    let {baseAsset, quoteAsset} = this.props;

    let baseWhiteList = baseAsset.getIn(["options", "whitelist_markets"]).toJS();
    let quoteWhiteList = quoteAsset.getIn(["options", "whitelist_markets"]).toJS();
    let baseBlackList = baseAsset.getIn(["options", "blacklist_markets"]).toJS();
    let quoteBlackList = quoteAsset.getIn(["options", "blacklist_markets"]).toJS();

    if (quoteWhiteList.length && quoteWhiteList.indexOf(baseAsset.get("id")) === -1) {
      return {isFrozen: true, frozenAsset: quoteAsset.get("symbol")};
    }
    if (baseWhiteList.length && baseWhiteList.indexOf(quoteAsset.get("id")) === -1) {
      return {isFrozen: true, frozenAsset: baseAsset.get("symbol")};
    }

    if (quoteBlackList.length && quoteBlackList.indexOf(baseAsset.get("id")) !== -1) {
      return {isFrozen: true, frozenAsset: quoteAsset.get("symbol")};
    }
    if (baseBlackList.length && baseBlackList.indexOf(quoteAsset.get("id")) !== -1) {
      return {isFrozen: true, frozenAsset: baseAsset.get("symbol")};
    }

    return {isFrozen: false};
  }

  _toggleMiniChart() {
    SettingsActions.changeViewSetting({
      miniDepthChart: !this.props.miniDepthChart
    });
  }

  render() {
      
const TABLE_COLUMNS = [
  {
    key: 'processed_at',
    label: 'DateTime',
  }, {
    key: 'amount',
    label: 'Amount, D.USD',
  }];




    let { currentAccount, marketLimitOrders, marketCallOrders, marketData, activeMarketHistory,
      invertedCalls, starredMarkets, quoteAsset, baseAsset, lowestCallPrice,
      marketStats, marketReady, marketSettleOrders, bucketSize, totals,
      feedPrice, buckets, coreAsset } = this.props;

    const {combinedBids, combinedAsks, lowestAsk, highestBid,
      flatBids, flatAsks, flatCalls, flatSettles} = marketData;

    let {bid, ask, leftOrderBook, showDepthChart, tools, chartHeight,
      buyDiff, sellDiff, indicators, indicatorSettings, width, buySellTop, ladders, trxs} = this.state;
    const {isFrozen, frozenAsset} = this.isMarketFrozen();
    
    let base = null, quote = null, accountBalance = null, quoteBalance = null,
      baseBalance = null, coreBalance = null, quoteSymbol, baseSymbol,
      showCallLimit = false, latestPrice, changeClass;


    let isNullAccount = currentAccount.get("id") === "1.2.3";

    const showVolumeChart = this.props.viewSettings.get("showVolumeChart", true);
    const enableChartClamp = this.props.viewSettings.get("enableChartClamp", true);

    if (quoteAsset.size && baseAsset.size && currentAccount.size) {
      base = baseAsset;
      quote = quoteAsset;
      baseSymbol = base.get("symbol");
      quoteSymbol = quote.get("symbol");

      accountBalance = currentAccount.get("balances").toJS();

      if (accountBalance) {
        for (let id in accountBalance) {
          if (id === quote.get("id")) {
            quoteBalance = accountBalance[id];
          }
          if (id === base.get("id")) {
            baseBalance = accountBalance[id];
          }
          if (id === "1.3.0") {
            coreBalance = accountBalance[id];
          }
        }
      }

      showCallLimit = this._getSettlementInfo();
    }

    let quoteIsBitAsset = quoteAsset.get("bitasset_data_id") ? true : false;
    let baseIsBitAsset = baseAsset.get("bitasset_data_id") ? true : false;

    let spread = (lowestAsk && highestBid) ? lowestAsk.getPrice() - highestBid.getPrice() : 0;

    // Latest price
    if (activeMarketHistory.size) {
      // Orders come in pairs, first is driver. Third entry is first of second pair.
      let latest_two = activeMarketHistory.take(3);
      let latest = latest_two.first();
      let second_latest = latest_two.last();
      let paysAsset, receivesAsset, isAsk = false;
      if (latest.pays.asset_id === base.get("id")) {
        paysAsset = base;
        receivesAsset = quote;
        isAsk = true;
      } else {
        paysAsset = quote;
        receivesAsset = base;
      }
      let flipped = base.get("id").split(".")[2] > quote.get("id").split(".")[2];
      latestPrice = market_utils.parse_order_history(latest, paysAsset, receivesAsset, isAsk, flipped);

      isAsk = false;
      if (second_latest) {
        if (second_latest.pays.asset_id === base.get("id")) {
          paysAsset = base;
          receivesAsset = quote;
          isAsk = true;
        } else {
          paysAsset = quote;
          receivesAsset = base;
        }

        let oldPrice = market_utils.parse_order_history(second_latest, paysAsset, receivesAsset, isAsk, flipped);
        changeClass = latestPrice.full === oldPrice.full ? "" : latestPrice.full - oldPrice.full > 0 ? "change-up" : "change-down";
      }
    }

    // Fees
    if (!coreAsset || !this.state.feeStatus) {
      return null;
    }

    let {
      sellFeeAsset,
      sellFeeAssets,
      sellFee,
      buyFeeAsset,
      buyFeeAssets,
      buyFee
    } = this._getFeeAssets(quote, base, coreAsset);

    // Decimals
    let hasPrediction = base.getIn(["bitasset", "is_prediction_market"]) || quote.getIn(["bitasset", "is_prediction_market"]);

    let description = null;

    if (hasPrediction) {
      description = quoteAsset.getIn(["options", "description"]);
      description = assetUtils.parseDescription(description).main;
    }

    let smallScreen = false;
    if (width < 1000) {
      smallScreen = true;
      leftOrderBook = false;
    }

    let orderMultiplier = leftOrderBook ? 2 : 1;
    const minChartHeight = 300
    const height = Math.max(
      this.state.height > 1100 ? chartHeight : chartHeight - 125,
      minChartHeight
    );



    let orderBook = (
      <OrderBook
        latest={latestPrice}
        changeClass={changeClass}
        orders={marketLimitOrders}
        calls={marketCallOrders}
        invertedCalls={invertedCalls}
        combinedBids={combinedBids}
        combinedAsks={combinedAsks}
        highestBid={highestBid}
        lowestAsk={lowestAsk}
        totalBids={totals.bid}
        totalAsks={totals.ask}
        base={base}
        quote={quote}
        baseSymbol={baseSymbol}
        quoteSymbol={quoteSymbol}
        onClick={this._orderbookClick.bind(this)}
        horizontal={!leftOrderBook}
        moveOrderBook={this._moveOrderBook.bind(this)}
        flipOrderBook={this.props.viewSettings.get("flipOrderBook")}
        marketReady={marketReady}
        wrapperClass={`order-${buySellTop ? 3 : 1} xlarge-order-${buySellTop ? 4 : 1}`}
        currentAccount={this.props.currentAccount.get("id")}
      />
    );

    return (
      <div className="grid-block page-layout market-layout">
        <AccountNotifications/>
        {/* Main vertical block with content */}

        {/* Left Column - Open Orders */}
        {leftOrderBook ? (
          <div className="grid-block left-column shrink no-overflow">
            {orderBook}
          </div>) : null}

        {/* Center Column */}
        <div style={{paddingTop: 0}} className={cnames("grid-block main-content vertical no-overflow")} >

          {/* Top bar with info
                        <ExchangeHeader
                            quoteAsset={quoteAsset} baseAsset={baseAsset}
                            hasPrediction={hasPrediction} starredMarkets={starredMarkets}
                            lowestAsk={lowestAsk} highestBid={highestBid}
                            lowestCallPrice={lowestCallPrice}
                            showCallLimit={showCallLimit} feedPrice={feedPrice}
                            marketReady={marketReady} latestPrice={latestPrice}
                            showDepthChart={showDepthChart}
                            onSelectIndicators={this._onSelectIndicators.bind(this)}
                            marketStats={marketStats}
                            onToggleCharts={this._toggleCharts.bind(this)}
                            showVolumeChart={showVolumeChart}
                        />*/}

          <div className="grid-block vertical no-padding ps-container" id="CenterContent" ref="center">
            {!showDepthChart ? (
              <div className="grid-block shrink no-overflow" id="market-charts" style={{display:"none"}}>
       
                {this.props.miniDepthChart ? <DepthHighChart
                  marketReady={marketReady}
                  orders={marketLimitOrders}
                  showCallLimit={showCallLimit}
                  call_orders={marketCallOrders}
                  flat_asks={flatAsks}
                  flat_bids={flatBids}
                  flat_calls={ showCallLimit ? flatCalls : []}
                  flat_settles={this.props.settings.get("showSettles") && flatSettles}
                  settles={marketSettleOrders}
                  invertedCalls={invertedCalls}
                  totalBids={totals.bid}
                  totalAsks={totals.ask}
                  base={base}
                  quote={quote}
                  height={200}
                  onClick={this._depthChartClick.bind(this, base, quote)}
                  settlementPrice={(!hasPrediction && feedPrice) && feedPrice.toReal()}
                  spread={spread}
                  LCP={showCallLimit ? lowestCallPrice : null}
                  leftOrderBook={leftOrderBook}
                  hasPrediction={hasPrediction}
                  noText={true}
                  theme={this.props.settings.get("themes")}
                /> : null}




              </div>) : (
              <div className="grid-block vertical no-padding shrink" >
                <DepthHighChart
                  marketReady={marketReady}
                  orders={marketLimitOrders}
                  showCallLimit={showCallLimit}
                  call_orders={marketCallOrders}
                  flat_asks={flatAsks}
                  flat_bids={flatBids}
                  flat_calls={ showCallLimit ? flatCalls : []}
                  flat_settles={this.props.settings.get("showSettles") && flatSettles}
                  settles={marketSettleOrders}
                  invertedCalls={invertedCalls}
                  totalBids={totals.bid}
                  totalAsks={totals.ask}
                  base={base}
                  quote={quote}
                  height={height}
                  onClick={this._depthChartClick.bind(this, base, quote)}
                  settlementPrice={(!hasPrediction && feedPrice) && feedPrice.toReal()}
                  spread={spread}
                  LCP={showCallLimit ? lowestCallPrice : null}
                  leftOrderBook={leftOrderBook}
                  hasPrediction={hasPrediction}
                  noFrame={false}
                  verticalOrderbook={leftOrderBook}
                  theme={this.props.settings.get("themes")}
                  centerRef={this.refs.center}
                />
              </div>)}

            <div className="grid-block no-overflow wrap shrink" >
              
              <div className="small-12 medium-4 middle-content" style={{padding: 35, paddingBottom: 0}}>
                <HelpContent path="components/DepositWithdraw" section="deposit-short"/>
                <br></br>
                <p> Round Finish: <b> 14-00 UTC, 12 March, 2018 </b></p>
                <p> Total Raised: <b>{this.get_total_raised(ladders)} D.USD</b></p>
                <p> Current Price: <b> {this.get_current_price(ladders)} TT / D.USD </b></p>
                <p> Next Price: <b> {this.get_next_price(ladders)} TT / D.USD </b> </p>
                <p> Remain before a next price: <b>{this.get_remain_amount(ladders)} D.USD </b></p>
             
              </div>

  

              <div className="small-12 medium-4 middle-content" style={{padding: 35}}>
              <h3>Buy TravelTokens</h3>
                <BlockTradesGateway
                  wallets={this.props.wallets}
                />
              </div>
              
              <div className="small-12 medium-4 middle-content" style={{padding: 35}}>
                <h3>Last 100 purchases:</h3>
              <MuiThemeProvider muiTheme={travelchainTheme}>  
                <DataTables
                  height={'500'}
                  selectable={false}
                  showRowHover={true}
                  columns={TABLE_COLUMNS}
                  data={trxs}
                  showFooterToolbar = {false}
                  showCheckboxes={false}
                  onCellClick={this.handleCellClick}
                  onCellDoubleClick={this.handleCellDoubleClick}
                  onFilterValueChange={this.handleFilterValueChange}
                  onSortOrderChange={this.handleSortOrderChange}
                  page={1}
                  count={100}
                />
              </MuiThemeProvider>

              </div> 


            </div>
            

            {/* Settle Orders */}

            {(base.get("id") === "1.3.0" || quote.get("id") === "1.3.0") ? (
              <OpenSettleOrders
                key="settle_orders"
                className={cnames(!smallScreen && !leftOrderBook ? "medium-6 xlarge-4 order-12" : "",
                  `small-12 medium-6 no-padding align-spaced ps-container middle-content order-12`
                )}
                orders={marketSettleOrders}
                base={base}
                quote={quote}
                baseSymbol={baseSymbol}
                quoteSymbol={quoteSymbol}
              />) : null}
            <div style={{padding: !this.props.miniDepthChart ? 0 : "0 0 40px 0"}} className="grid-block no-margin vertical shrink">


            </div>


          </div>{ /* end CenterContent */}



        </div>{/* End of Main Content Column */}

        {/* Right Column - Market History */}
        


      </div>
    );
  }
}

export default Exchange;
