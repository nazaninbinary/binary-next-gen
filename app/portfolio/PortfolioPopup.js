import React from 'react';
import { Popup } from '../common';
import PortfolioContainer from './PortfolioContainer';

export default (props) => (
	<Popup>
		<PortfolioContainer {...props} />
	</Popup>
);
