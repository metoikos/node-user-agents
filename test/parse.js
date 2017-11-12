'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = require('code').expect;
const UserAgent = require('../');
const devices = require('./devices.json');
const deviceKeys = Object.keys(devices);

const agents = {
    'Chrome Mobile0': 'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
    'Mobile Safari1': 'Mozilla/5.0 (iPad; CPU OS 8_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25',
    Chrome2: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.94 Safari/537.36',
    Chrome3: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    Chrome4: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2226.0 Safari/537.36',
    'IE Mobile5': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)',
    'IE Mobile6': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG; SGH-i917)',
    'IE Mobile7': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; LG; GW910)',
    IE8: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; Media Center PC 6.0; InfoPath.3; MS-RTC LM 8; Zune 4.7)',
    Opera9: 'Mozilla/5.0 (Windows NT 6.0; rv:2.0) Gecko/20100101 Firefox/4.0 Opera 12.14',
    Opera10: 'Mozilla/5.0 (X11; U; Linux x86_64; de; rv:1.9.0.6) Gecko/2009020911 Ubuntu/8.10 (intrepid) Mozilla/4.0 (compatible; MSIE 6.0; MSIE 5.5; Windows NT 5.1) Opera 7.03 [de]',
    'Opera Mobile11': 'Opera/9.80 (Android 2.3.3; Linux; Opera Mobi/ADR-1111101157; U; es-ES) Presto/2.9.201 Version/11.50',
    'Opera Mini12': 'Opera/9.80 (J2ME/MIDP; Opera Mini/9.80 (S60; SymbOS; Opera Mobi/23.334; U; id) Presto/2.5.25 Version/10.54',
    Android13: 'Mozilla/5.0 (Linux; U; Android 2.3; en-us) AppleWebKit/999+ (KHTML, like Gecko) Safari/999.9',
    Firefox14: 'Mozilla/5.0 (X11; OpenBSD amd64; rv:28.0) Gecko/20100101 Firefox/28.0',
    Googlebot15: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    Firefox16: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:24.0) Gecko/20100101 Firefox/24.0',
    IE17: 'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.2; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0',
    'Mobile Safari18': 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3 like Mac OS X; fr-fr) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8F190 Safari/6533.18.5',
    Chrome19: 'Mozilla/5.0 (Linux; GoogleTV 3.2; NSZ-GS7/GX70 Build/MASTER) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Safari/534.24',
    Facebook20: 'Mozilla/5.0 (iPad; CPU OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12H143 [FBAN/FBIOS;FBAV/40.0.0.42.290;FBBV/15252421;FBDV/iPad4,1;FBMD/iPad;FBSN/iPhone OS;FBSV/8.4;FBSS/2; FBCR/;FBID/tablet;FBLC/en_US;FBOP/1]',
    'BlackBerry WebKit21': 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+',
    'BlackBerry WebKit22': 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; fr) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.246 Mobile Safari/534.1+',
    Baiduspider23: 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
    'Yandex Browser24': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.12785 YaBrowser/13.12.1599.12785 Safari/537.36'
};

const browsers = {
    'Chrome Mobile0': 'Chrome',
    'Mobile Safari1': 'Safari',
    Chrome2: 'Chrome',
    Chrome3: 'Chrome',
    Chrome4: 'Chrome',
    'IE Mobile5': 'IE',
    'IE Mobile6': 'IE',
    'IE Mobile7': 'IE',
    IE8: 'IE',
    Opera9: 'Opera',
    Opera10: 'Opera',
    'Opera Mobile11': 'Opera',
    'Opera Mini12': 'Opera',
    Android13: 'Android',
    Firefox14: 'Firefox',
    Googlebot15: 'Other',
    Firefox16: 'Firefox',
    IE17: 'IE',
    'Mobile Safari18': 'Safari',
    Chrome19: 'Chrome',
    Facebook20: 'Other',
    'BlackBerry WebKit21': 'Other',
    'BlackBerry WebKit22': 'Other',
    Baiduspider23: 'Other',
    'Yandex Browser24': 'Yandex'
};

describe('User Agents', () => {

    it('should throw an error', (done) => {

        const throws = function () {
            return new UserAgent();
        };
        expect(throws).to.throw(Error, 'Invalid useragent string!');

        done();
    });

    it('should expose the user agent string', (done) => {

        const ua = new UserAgent(agents['Chrome Mobile0']);
        expect(ua.agentStr).to.equal(agents['Chrome Mobile0']);

        done();
    });

    it('should expose useragent module ', (done) => {

        const ua = new UserAgent(agents['Chrome Mobile0']);
        expect(ua.userAgent).to.be.object();

        done();
    });

    it('should return browser', (done) => {

        const ua = new UserAgent(agents['Chrome Mobile0']);
        expect(['IE', 'Chrome', 'Opera', 'Safari', 'Firefox', 'Android', 'Yandex', 'Other']).to.be.in.contain(ua.getBrowser());

        done();

    });

    it('should detect correct browser', (done) => {

        const keys = Object.keys(browsers);
        keys.forEach((browser) => {
            let ua = new UserAgent(agents[browser]);
            expect(ua.getBrowser()).to.equal(browsers[browser]);
        });

        done();
    });

    it('should detect tablet', (done) => {

        const tablets = ['Android13', 'Mobile Safari1'];
        tablets.forEach((tablet) => {
            let ua = new UserAgent(agents[tablet]);
            expect(ua.isTablet()).to.be.true();
        });

        done();
    });

    it('should detect smart tv', (done) => {

        const devices = ['Chrome19'];
        devices.forEach((device) => {
            let ua = new UserAgent(agents[device]);
            expect(ua.isSmartTv()).to.be.true();
        });

        done();
    });

    it('should detect pc', (done) => {

        const devices = ['Firefox14', 'Firefox16'];
        devices.forEach((device) => {
            let ua = new UserAgent(agents[device]);
            expect(ua.isPc()).to.be.true();
        });

        done();
    });

    it('should detect bots', (done) => {

        const devices = ['Baiduspider23', 'Googlebot15'];
        devices.forEach((device) => {
            let ua = new UserAgent(agents[device]);
            expect(ua.isBot()).to.be.true();
        });

        done();
    });


    it('should detect os and it should be string', (done) => {

        const keys = Object.keys(browsers);
        keys.forEach((browser) => {
            let ua = new UserAgent(agents[browser]);
            expect(ua.getOs()).to.be.a.string();
        });

        done();
    });

    // this part of the test case borrewd from: python-user-agents
    // ref: https://github.com/selwin/python-user-agents/blob/master/user_agents/tests.py
    for (let deviceKey of deviceKeys) {
        const device = devices[deviceKey];
        const checks = ['isBot', 'isMobile', 'isPc', 'isTablet', 'isTouchCapable'];
        const ua = new UserAgent(device.ua_string);

        for (let check of checks) {
            it('it should be valid: ' + check + ' === ' + device[check] + ' for device ' + deviceKey, (done) => {
                expect(ua[check]()).to.equal(device[check]);
                done();
            });
        }
    }
});