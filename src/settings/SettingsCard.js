import React, { PropTypes } from 'react';
import Tabs from '../_common/Tabs';
import SettingsGeneral from './SettingsGeneral';
import SettingsPersonalDetails from './SettingsPersonalDetails';
import SettingsSecurity from './SettingsSecurity';
import SettingsSelfExclusion from './SettingsSelfExclusion';
import SettingsLimits from './SettingsLimits';

export default class SettingsCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = { activeTab: 0 };
	}

    static propTypes = {
		actions: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
		loginid: PropTypes.string.isRequired,
		appConfig: PropTypes.object.isRequired,
    };

	render() {
		const { loginid } = this.props;
		const isVirtual = loginid.startsWith('VRTC');
		const virtualTabs = [
			{ text: 'General', component: <SettingsGeneral {...this.props}/> },
			{ text: 'Personal', component: <SettingsPersonalDetails {...this.props}/> },
		];
		const realTabs = [
			{ text: 'Security', component: <SettingsSecurity {...this.props}/> },
			{ text: 'Self Exclusion', component: <SettingsSelfExclusion {...this.props}/> },
			{ text: 'Limits', component: <SettingsLimits {...this.props}/> },
		];
		const tabs = isVirtual ? virtualTabs : virtualTabs.concat(realTabs);

		return (
			<Tabs
				id="settings"
				activeIndex={this.state.activeTab}
				onChange={idx => this.setState({ activeTab: idx })}
				tabs={tabs}
			/>
		);
	}
}
