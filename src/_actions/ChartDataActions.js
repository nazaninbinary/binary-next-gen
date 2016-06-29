import { api } from '../_data/LiveData';
import { UPDATE_CHART_DATA_BY_CONTRACT, UPDATE_CHART_DATA_BY_SYMBOL } from '../_constants/ActionTypes';
import { getOpenContract } from './PortfolioActions';

export const getDataForContract = (contractID, durationCount, durationType, style, subscribe) =>
    dispatch =>
        api.getDataForContract(
            () => dispatch(getOpenContract(contractID)),
            durationCount,
            durationType,
            style,
            subscribe
        ).then(r => {
                const { ticks, candles, symbol } = r;
                return dispatch({
                    type: UPDATE_CHART_DATA_BY_CONTRACT,
                    contractID,
                    data: ticks || candles,
                    dataType: style,
                    symbol,
                });
        });

export const getDataForSymbol = (symbol, durationCount, durationType, style, subscribe) =>
    dispatch =>
        api.getDataForSymbol(symbol, durationCount, durationType, style, subscribe)
            .then(r => {
                const { ticks, candles } = r;
                return dispatch({
                    type: UPDATE_CHART_DATA_BY_SYMBOL,
                    symbol,
                    data: ticks || candles,
                    dataType: style,
                });
            });