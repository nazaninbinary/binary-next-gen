import React, { PureComponent } from 'react';
import { Button, InputGroup, ServerErrorMsg } from 'binary-components';
import { xMonthsAfter, dateToDateString, dateToEpoch } from 'binary-utils';
import FieldError from '../containers/FieldError';
import UpdateNotice from '../containers/UpdateNotice';
import { api } from '../_data/LiveData';

function validate(props, max_balance, max_turnover, max_losses, max_7day_turnover, max_7day_losses, max_30day_turnover, max_30day_losses, max_open_bets, session_duration_limit) {
  // true means invalid, so our conditions got reversed
  return {
    max_balance_required: max_balance.length === 0,
		max_balance: !(/^\d{0,20}$/).test(max_balance),
    max_balance_limit: max_balance > props.max_balance,
    max_turnover_required: max_turnover.length === 0,
    max_turnover: !(/^\d{0,20}$/).test(max_turnover),
    max_turnover_limit: max_turnover > props.max_turnover,
    max_losses_required: max_losses.length === 0,
    max_losses: !(/^\d{0,20}$/).test(max_losses),
    max_losses_limit: max_losses > props.max_losses,
    max_7day_turnover_required: max_7day_turnover.length === 0,
    max_7day_turnover: !(/^\d{0,20}$/).test(max_7day_turnover),
    max_7day_turnover_limit: max_7day_turnover > props.max_7day_turnover,
    max_7day_losses_required: max_7day_losses.length === 0,
    max_7day_losses: !(/^\d{0,20}$/).test(max_7day_losses),
    max_7day_losses_limit: max_7day_losses > props.max_7day_losses,
    max_30day_turnover_required: max_30day_turnover.length === 0,
    max_30day_turnover: !(/^\d{0,20}$/).test(max_30day_turnover),
    max_30day_turnover_limit: max_30day_turnover > props.max_30day_turnover,
    max_30day_losses_required: max_30day_losses.length === 0,
    max_30day_losses: !(/^\d{0,20}$/).test(max_30day_losses),
    max_30day_losses_limit: max_30day_losses > props.max_30day_losses,
    max_open_bets_required: max_open_bets.length === 0,
    max_open_bets: !(/^\d{0,4}$/).test(max_open_bets),
    max_open_bets_limit: max_open_bets > props.max_open_bets,
    session_duration_limit_required: session_duration_limit.length === 0,
    session_duration_limit: !(/^\d{0,5}$/).test(session_duration_limit),
  };
}

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
    const errors = validate(this.props, this.state.max_balance, this.state.max_turnover, this.state.max_losses, this.state.max_7day_turnover, this.state.max_7day_losses, this.state.max_30day_turnover, this.state.max_30day_losses, this.state.max_open_bets, this.state.session_duration_limit);

    return (
			<form className="settings-self-exclusion" onSubmit={this.onFormSubmit}>
			{serverError && <ServerErrorMsg text={serverError} />}
				<UpdateNotice text="Settings updated" show={success} />
				<InputGroup
					id="max_balance"
					label="Maximum account cash balance"
					// type="number"
					// hint="Once this limit is reached, you may no longer deposit."
					maxLength="20"
					defaultValue={max_balance}
					onChange={this.onEntryChange}
				/>
				<FieldError text="This field is required" show={errors.max_balance_required} />
				<FieldError text="Should be a valid number" show={errors.max_balance} />
				<FieldError text={`Should be between 0 and ${max_balance}`} show={errors.max_balance_limit} />
				<InputGroup
					id="max_turnover"
					label="Daily turnover limit"
					// type="number"
					// hint="Maximum aggregate contract purchases per day."
					maxLength="20"
					defaultValue={max_turnover}
					onChange={this.onEntryChange}
				/>
				<FieldError text="This field is required" show={errors.max_turnover_required} />
				<FieldError text="Should be a valid number" show={errors.max_turnover} />
				<FieldError text={`Should be between 0 and ${max_turnover}`} show={errors.max_turnover_limit} />
				<InputGroup
					id="max_losses"
					label="Daily limit on losses"
					// type="number"
					// hint="Maximum aggregate loss per day."
					maxLength="20"
					defaultValue={max_losses}
					onChange={this.onEntryChange}
				/>
				<FieldError text="This field is required" show={errors.max_losses_required} />
				<FieldError text="Should be a valid number" show={errors.max_losses} />
				<FieldError text={`Should be between 0 and ${max_losses}`} show={errors.max_losses_limit} />
				<InputGroup
					id="max_7day_turnover"
					label="7-day turnover limit"
					// type="number"
					// hint="Maximum aggregate contract purchases over a 7-day period."
					maxLength="20"
					defaultValue={max_7day_turnover}
					onChange={this.onEntryChange}
				/>
				<FieldError text="This field is required" show={errors.max_7day_turnover_required} />
				<FieldError text="Should be a valid number" show={errors.max_7day_turnover} />
				<FieldError text={`Should be between 0 and ${max_7day_turnover}`} show={errors.max_7day_turnover_limit} />
				<InputGroup
					id="max_7day_losses"
					label="7-day limit on losses"
					// type="number"
					// hint="Maximum aggregate loss over a 7-day period."
					maxLength="20"
					defaultValue={max_7day_losses}
					onChange={this.onEntryChange}
				/>
				<FieldError text="This field is required" show={errors.max_7day_losses_required} />
				<FieldError text="Should be a valid number" show={errors.max_7day_losses} />
				<FieldError text={`Should be between 0 and ${max_7day_losses}`} show={errors.max_7day_losses_limit} />
				<InputGroup
					id="max_30day_turnover"
					label="30-day turnover limit"
					// type="number"
					// hint="Maximum aggregate contract purchases over a 30-day period."
					maxLength="20"
					defaultValue={max_30day_turnover}
					onChange={this.onEntryChange}
				/>
				<FieldError text="This field is required" show={errors.max_30day_turnover_required} />
				<FieldError text="Should be a valid number" show={errors.max_30day_turnover} />
				<FieldError text={`Should be between 0 and ${max_30day_turnover}`} show={errors.max_30day_turnover_limit} />
				<InputGroup
					id="max_30day_losses"
					label="30-day limit on losses"
					// type="number"
					// hint="Maximum aggregate loss over a 30-day period."
					maxLength="20"
					defaultValue={max_30day_losses}
					onChange={this.onEntryChange}
				/>
				<FieldError text="This field is required" show={errors.max_30day_losses_required} />
				<FieldError text="Should be a valid number" show={errors.max_30day_losses} />
				<FieldError text={`Should be between 0 and ${max_30day_losses}`} show={errors.max_30day_losses_limit} />
				<InputGroup
					id="max_open_bets"
					label="Maximum number of open positions"
					// type="number"
					maxLength="4"
					defaultValue={max_open_bets}
					onChange={this.onEntryChange}
				/>
				<FieldError text="This field is required" show={errors.max_open_bets_required} />
				<FieldError text="Should be a valid number" show={errors.max_open_bets} />
				<FieldError text={`Should be between 0 and ${max_open_bets}`} show={errors.max_open_bets_limit} />
				<InputGroup
					id="session_duration_limit"
					label="Session duration limit, in minutes"
					// type="number"
					// hint="You will be automatically logged out after such time."
					maxLength="5"
					defaultValue={session_duration_limit}
					onChange={this.onEntryChange}
				/>
				<FieldError text="This field is required" show={errors.session_duration_limit_required} />
				<FieldError text="Should be a valid number" show={errors.session_duration_limit} />
				<FieldError text={`Should be between 0 and ${session_duration_limit}`} show={errors.session_duration_limit_limit} />
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
