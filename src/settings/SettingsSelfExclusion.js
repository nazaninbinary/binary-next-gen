import React, { PureComponent } from 'react';
import { Button, InputGroup, ServerErrorMsg } from 'binary-components';
import { xMonthsAfter, dateToDateString, dateToEpoch } from 'binary-utils';
import UpdateNotice from '../containers/UpdateNotice';
import { api } from '../_data/LiveData';

export default class SettingsSelfExclusion extends PureComponent {

	props: {
		max_balance: number,
		max_turnover: number,
		max_losses: number,
		max_7day_turnover: number,
		max_7day_losses: number,
		max_30day_turnover: number,
		max_30day_losses: number,
		max_open_bets: number,
		session_duration_limit: number,
		timeout_until: number,
		exclude_until: string,
	};

	constructor(props) {
		super(props);
		this.state = {
			max_balance: props.max_balance,
			max_turnover: props.max_turnover,
			max_losses: props.max_losses,
			max_7day_turnover: props.max_7day_turnover,
			max_7day_losses: props.max_7day_losses,
			max_30day_turnover: props.max_30day_turnover,
			max_30day_losses: props.max_30day_losses,
			max_open_bets: props.max_open_bets,
			session_duration_limit: props.session_duration_limit,
			timeout_until_time: props.timeout_until,
			timeout_until_date: props.timeout_until,
			exclude_until: props.exclude_until,
		};
	}

	onEntryChange = (e: SyntheticEvent) =>
		this.setState({ [e.target.id]: e.target.value });


    onFormSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        this.setState({
            validatedOnce: true,
        });
        this.updateSelfExclusion();
    }

	updateSelfExclusion = async () => {
		const { max_balance, max_turnover, max_losses, max_7day_turnover, max_7day_losses,
			max_30day_turnover, max_30day_losses, max_open_bets, session_duration_limit,
			timeout_until_time, timeout_until_date, exclude_until } = this.state;
		const timeout_until = dateToEpoch(new Date(timeout_until_date + ' ' + timeout_until_time));
		const newSelfExclusionSettings = {
			max_balance,
			max_turnover,
			max_losses,
			max_7day_turnover,
			max_7day_losses,
			max_30day_turnover,
			max_30day_losses,
			max_open_bets,
			session_duration_limit,
			exclude_until,
			timeout_until,
		};
		try {
			await api.setSelfExclusion(newSelfExclusionSettings);
			this.setState({
				success: true,
				serverError: false,
			});
			setTimeout(() => {
				this.setState({ success: false });
        api.getSelfExclusion();
        api.getAccountLimits();
				if (exclude_until) {
					window.location.reload();
				}
			}, 3000);
		} catch (e) {
			this.setState({ serverError: e.error.error.message });
		}
	}

	render() {
		const { max_balance, max_turnover, max_losses, max_7day_turnover, max_7day_losses,
			max_30day_turnover, max_30day_losses, max_open_bets, session_duration_limit,
			exclude_until, timeout_until_date, timeout_until_time, success, serverError } = this.state;
		// const wrongExcludeUntillTime = isValidTime(timeout_until_time);

		return (
			<form className="settings-self-exclusion" onSubmit={this.onFormSubmit}>
			{serverError && <ServerErrorMsg text={serverError} />}
				<UpdateNotice text="Settings updated" show={success} />
				<InputGroup
					id="max_balance"
					label="Maximum account cash balance"
					type="number"
					// hint="Once this limit is reached, you may no longer deposit."
					defaultValue={max_balance}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="max_turnover"
					label="Daily turnover limit"
					type="number"
					// hint="Maximum aggregate contract purchases per day."
					defaultValue={max_turnover}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="max_losses"
					label="Daily limit on losses"
					type="number"
					// hint="Maximum aggregate loss per day."
					defaultValue={max_losses}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="max_7day_turnover"
					label="7-day turnover limit"
					type="number"
					// hint="Maximum aggregate contract purchases over a 7-day period."
					defaultValue={max_7day_turnover}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="max_7day_losses"
					label="7-day limit on losses"
					type="number"
					// hint="Maximum aggregate loss over a 7-day period."
					defaultValue={max_7day_losses}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="max_30day_turnover"
					label="30-day turnover limit"
					type="number"
					// hint="Maximum aggregate contract purchases over a 30-day period."
					defaultValue={max_30day_turnover}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="max_30day_losses"
					label="30-day limit on losses"
					type="number"
					// hint="Maximum aggregate loss over a 30-day period."
					defaultValue={max_30day_losses}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="max_open_bets"
					label="Maximum number of open positions"
					type="number"
					defaultValue={max_open_bets}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="session_duration_limit"
					label="Session duration limit, in minutes"
					type="number"
					// hint="You will be automatically logged out after such time."
					defaultValue={session_duration_limit}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="timeout_until_date"
					label="Time out until date"
					type="date"
					maxLength="10"
					defaultValue={timeout_until_date || 'yyyy-mm-dd'}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="timeout_until_time"
					label="Time out until time"
					type="time"
					maxLength="8"
					defaultValue={timeout_until_time || '--:--:--'}
					onChange={this.onEntryChange}
				/>
				<InputGroup
					id="exclude_until"
					label="Exclude me from the website until"
					type="date"
					maxLength="10"
					defaultValue={exclude_until || 'yyyy-mm-dd'}
					min={dateToDateString(xMonthsAfter(6))}
					onChange={this.onEntryChange}
				/>
				<Button text="Update" />
			</form>
		);
	}
}
