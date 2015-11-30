import React from 'react';
import ProfitTable from './ProfitTable';

const ProfitTableCard = (props) => {
	const { compact, profitTable } = props;
	return (
		<ProfitTable
			compact={compact}
			transactions={profitTable}
		/>
	);
};

ProfitTableCard.propTypes = {
	compact: React.PropTypes.bool,
	profitTable: React.PropTypes.object,
	dispatch: React.PropTypes.func,
};

export default ProfitTableCard;