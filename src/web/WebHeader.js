import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import config from '../config';
import M from '../_common/M';
import Clock from '../_common/Clock';
import LanguagePicker from '../_common/LanguagePicker';
import WebSidebar from '../sidebar/WebSidebar';
import ToggleButtons from './ToggleButtons';
import Balance from '../balance/BalanceContainer';

export default class WebHeader extends React.Component {

	static propTypes = {
		actions: PropTypes.object.isRequired,
	};

    createTrade() {
        const { actions } = this.props;
        // const maxId = tradesIds.reduce((a, b) => Math.max(a, b), -1);
        actions.initTrade('123');
    }


	render() {
		return (
			<div id="header" className="inverse">
				<input id="hamburger-closer" type="radio" name="hamburger" defaultChecked />
				<label id="hamburger-overlay" htmlFor="hamburger-closer"></label>
				<input id="hamburger-opener" className="hamburger" type="radio" name="hamburger" />
				<label id="hamburger-btn" htmlFor="hamburger-opener" className="toolbar-btn">
					<img src="img/menu.svg" />
					<WebSidebar />
				</label>
				<div id="logo">
					<img src={config.logo} />
					<img src={config.logo2} />
				</div>
				<div id="clock">
					<Clock />
				</div>
				<ToggleButtons actions={this.props.actions} />
				<button id="new-trade-btn" className="btn-secondary" onClick={::this.createTrade}>New Trade</button>
				<LanguagePicker className="language-picker" />
				<Balance />
				<Link to="/deposit" id="deposit-btn" className="btn-secondary">
					<M m="Deposit" />
				</Link>
			</div>
		);
	}
}
