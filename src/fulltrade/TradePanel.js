import React, { Component, PropTypes } from 'react';
import { SelectGroup, RadioGroup, ErrorMsg, Modal, PurchaseConfirmation } from '../_common';
import { contractCategoryDisplay } from '../_utils/TradeUtils';
import BarrierCard from './BarrierCard';
import ContractStatsCard from './ContractStatsCard';
import DigitBarrierCard from './DigitBarrierCard';
import DurationCard from './DurationCard';
import PayoutCard from './PayoutCard';
import SpreadBarrierCard from './SpreadBarrierCard';

export default class TradePanel extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        assets: PropTypes.array.isRequired,
        currency: PropTypes.string.isRequired,
        contract: PropTypes.object,
        id: PropTypes.string.isRequired,
        trade: PropTypes.object.isRequired,
        tick: PropTypes.array,
    };

    componentWillMount() {
        const { actions, id } = this.props;
        actions.updatePriceProposalSubscription(id);
    }

    updateHelper(name, value, update = true) {
        const { actions, id } = this.props;
        actions.updateTradeParams(id, name, value);
        if (update) {
            actions.updatePriceProposalSubscription(id);
        }
    }

    onAssetChange(e) {
        this.updateHelper('symbol', e.target.value);
        this.onCategoryChange({ target: { value: 'callput' } }, false);
    }

    // scary but necessary as all fields have dependency on category
    onCategoryChange(e, update = false) {
        const newCategory = e.target.value;
        this.updateHelper('tradeCategory', newCategory, update);

        const { contract, tick } = this.props;
        const defaultType = Object.keys(contract[newCategory])[0];
        const newBarriers = contract[newCategory][defaultType].barriers;
        const lastSpot = tick ? tick[tick.length - 1].quote : 0;

        // update type
        this.updateHelper('type', defaultType, false);

        // update duration
        const newDuration = contract[newCategory][defaultType].durations[0];
        this.updateHelper('durationUnit', newDuration ? newDuration.unit : undefined, false);

        // update barriers
        if (!newBarriers) {
            if (newCategory === 'spreads') {
                const spread = contract[newCategory][defaultType].spread;
                this.updateHelper('amountPerPoint', spread.amountPerPoint, false);
                this.updateHelper('stopType', spread.stopType, false);
                this.updateHelper('stopLoss', spread.stopLoss, false);
                this.updateHelper('stopProfit', spread.stopProfit, false);
            }
            this.updateHelper('barrier', undefined, false);
            this.updateHelper('barrier2', undefined, false);
        } else if (newBarriers.length === 1) {
            if (newCategory === 'digits') {
                this.updateHelper('barrier', newBarriers[0].value[0], false);
            } else {
                this.updateHelper('barrier', newBarriers[0].value + lastSpot, false);
            }
            this.updateHelper('barrier2', undefined, false);
        } else if (newBarriers.length === 2) {
            this.updateHelper('barrier', newBarriers[0].value + lastSpot, false);
            this.updateHelper('barrier2', newBarriers[1].value + lastSpot, false);
        }

        if (newCategory !== 'spreads') {
            this.updateHelper('amountPerPoint', undefined, false);
            this.updateHelper('stopType', undefined, false);
            this.updateHelper('stopLoss', undefined, false);
            this.updateHelper('stopProfit', undefined, false);
        }

        const { actions, id } = this.props;
        actions.updatePriceProposalSubscription(id);
    }

    onTypeChange(e) {
        this.updateHelper('type', e.target.value);
    }

    onDurationChange(e) {
        this.updateHelper('duration', e.target.value);
    }

    onDurationUnitChange(e) {
        this.updateHelper('durationUnit', e.target.value);
    }

    onBarrier1Change(e) {
        const { tick } = this.props;
        const lastSpot = tick ? tick[tick.length - 1].quote : 0;
        this.updateHelper('barrier', +e.target.value + lastSpot);
    }

    onBarrier2Change(e) {
        const { tick } = this.props;
        const lastSpot = tick ? tick[tick.length - 1].quote : 0;
        this.updateHelper('barrier2', +e.target.value + lastSpot);
    }

    onBasisChange(e) {
        this.updateHelper('basis', e.target.value);
    }

    onAmountChange(e) {
        this.updateHelper('amount', e.target.value);
    }

    onAmountPerPointChange(e) {
        this.updateHelper('amountPerPoint', e.target.value);
    }

    onStopTypeChange(e) {
        this.updateHelper('stopType', e.target.value);
    }

    onStopLossChange(e) {
        this.updateHelper('stopLoss', e.target.value);
    }

    onStopProfitChange(e) {
        this.updateHelper('stopProfit', e.target.value);
    }

    onPurchase() {
        const { actions, id } = this.props;
        actions.purchaseByTradeID(id);
    }

    render() {
        const { assets, contract, trade, currency } = this.props;
        const selectedSymbol = trade.symbol;
        const categories = Object.keys(contract).map(c => ({ value: c, text: contractCategoryDisplay(c) }));
        const selectedCategory = trade.tradeCategory;
        const types = Object.keys(contract[selectedCategory]).map(type => ({ text: type, value: type }));
        const selectedType = trade.type;
        const contractForType = contract[selectedCategory][selectedType];
        const barriers = contractForType && contractForType.barriers;
        const receipt = trade.receipt;

        return (
            <div>
                <div className="row">
                    <SelectGroup
                        options={assets}
                        value={selectedSymbol}
                        onChange={::this.onAssetChange}
                    />
                    <SelectGroup
                        options={categories}
                        value={selectedCategory}
                        onChange={::this.onCategoryChange}
                    />
                </div>
                <Modal shown={!!receipt} onClose={() => this.updateHelper('receipt', undefined)} >
                    <PurchaseConfirmation receipt={receipt} />
                </Modal>
                { contractForType &&
                    <div>
                        <RadioGroup
                            name="trading-types"
                            options={types}
                            value={selectedType}
                            onChange={::this.onTypeChange}
                        />
                        <DurationCard
                            duration={trade.duration}
                            durationUnit={trade.durationUnit}
                            options={contractForType.durations}
                            onDurationChange={::this.onDurationChange}
                            onUnitChange={::this.onDurationUnitChange}
                        />
                        {selectedCategory === 'digits' &&
                            <DigitBarrierCard
                                barrier={trade.barrier}
                                barrierInfo={barriers && barriers[0]}
                                onBarrierChange={::this.onBarrier1Change}
                            />}
                        {selectedCategory === 'spreads' &&
                        <SpreadBarrierCard
                            currency={currency}
                            spreadInfo={contractForType.spread}
                            amountPerPointChange={::this.onAmountPerPointChange}
                            stopTypeChange={::this.onStopTypeChange}
                            stopLossChange={::this.onStopLossChange}
                            stopProfitChange={::this.onStopProfitChange}
                        />}
                        {(selectedCategory !== 'spreads' && selectedCategory !== 'digits') &&
                            <BarrierCard
                                barrier={trade.barrier}
                                barrier2={trade.barrier2}
                                barrier1Info={barriers && barriers[0]}
                                barrier2Info={barriers && barriers[1]}
                                onBarrier1Change={::this.onBarrier1Change}
                                onBarrier2Change={::this.onBarrier2Change}
                                spot={trade.proposal && +trade.proposal.spot}
                            />}
                    </div>
                }
                <PayoutCard
                    basis={trade.basis}
                    amount={+trade.amount}
                    currency="USD"
                    onAmountChange={::this.onAmountChange}
                    onBasisChange={::this.onBasisChange}
                />
                {trade.proposal && <ContractStatsCard proposal={trade.proposal} spread={selectedCategory === 'spreads'} />}
                <ErrorMsg shown={!!trade.proposalError} text={trade.proposalError ? trade.proposalError.message : ''} />
                <button onClick={::this.onPurchase}>Purchase</button>
            </div>
        );
    }
}