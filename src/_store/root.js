import React from 'react';
import { addLocaleData } from 'react-intl';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store, rehydratedStorePromise } from './configureStore';
import { Router } from 'react-router';
import routes from '../_routes';
import IntlProviderContainer from '../_routes/IntlProviderContainer';
import HashHistory from 'history/lib/createHashHistory';
import ThemeProvider from '../_common/ThemeProvider';
import * as LiveData from '../_data/LiveData';
import * as AllActions from '../_actions';

import config from 'json!../config.json';

console.log(config);

const history = new HashHistory();
rehydratedStorePromise.then(st => {
    LiveData.connect(st);
});

addLocaleData({
    locale: 'bg-bg',
    parentLocale: 'en',
});

export default class Root extends React.Component {
    createElementWithActions(Component, props) {
        return (
            <Component {...props} actions={bindActionCreators(AllActions, store.dispatch)}/>
        );
    }

    render() {
        return (
            <Provider store={store}>
                <IntlProviderContainer>
                    <ThemeProvider>
                        <Router history={history} children={routes} createElement={::this.createElementWithActions} />
                    </ThemeProvider>
                </IntlProviderContainer>
            </Provider>
        );
    }
}