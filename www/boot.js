/* eslint-disable */
'use strict';

(function init() {
    var defaultConfig = {
        language: 'EN',
        theme: 'light',
        accounts: []
    };

    // window.addEventListener('message', function (event) {
    //     console.log(event);
    //     var origin = event.origin || event.originalEvent.origin;
    //     if (isMobile && origin === 'http://localhost') {
    //     // if (true) {
    //         window.BinaryBoot.accounts = event.data;
    //         window.location.reload();
    //     }
    // });

    function parseOAuthResponse(responseUrl) {
        var matcher = /acct\d=(\w+)&token\d=([\w-]+)/g;
        var urlParts = responseUrl.split('?');
        if (urlParts.length !== 2) {
            throw new Error('Not a valid url');
        }

        var params = urlParts[1].split(matcher);

        var accounts = [];

        for (var i = 1; i < params.length; i += 3) {
            accounts.push({
                account: params[i],
                token: params[i + 1]
            });
        }

        return accounts;
    }

    function readConfig() {
        try {
            window.BinaryBoot = JSON.parse(localStorage.getItem('boot')) || defaultConfig;
        } catch (e) {
            window.BinaryBoot = defaultConfig;
            window.console.log('Error while initializing', e);
        }
    }

    function parseUrl() {
        if (~window.location.href.indexOf('acct1')) {
            var accounts = parseOAuthResponse(window.location.href);
            window.BinaryBoot.accounts = accounts;
            try {
                localStorage.setItem('boot', JSON.stringify(window.BinaryBoot));
                localStorage.setItem('account', JSON.stringify({ token: accounts[0].token }));
            } catch (e) {
                window.console.log('Error while saving boot config', e);
            }

            if (window.opener) {
                window.opener.location.reload();
                window.close();
            }
        }
    }

    var apiUrl = 'wss://ws.binaryws.com/websockets/v3';

    readConfig();
    parseUrl();
    window.BinaryBoot.appId = window.cordova ? 1006 : 1001;
    var lang = window.BinaryBoot.language;
    var oauthUrl = 'https://oauth.binary.com/oauth2/authorize?app_id=' + window.BinaryBoot.appId + '&l=' + lang;

    // if (!window.BinaryBoot.accounts || window.BinaryBoot.accounts.length === 0) {
    //     window.location = oauthUrl;
    // }

    var redirectIndex = window.location.href.indexOf('?');
    if (~redirectIndex) {
        location.replace(window.location.href.substr(0, redirectIndex - 1));
    }

    window.BinaryBoot.connection = new WebSocket(apiUrl + '?app_id=' + window.BinaryBoot.appId + '&l=' + lang);
})();