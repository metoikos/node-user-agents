'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const beforeEach = lab.beforeEach;
const expect = require('code').expect;
const UserAgent = require('../');

const agents = {
    'Chrome Mobile': 'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
    'Mobile Safari': 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3 like Mac OS X; fr-fr) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8F190 Safari/6533.18.5',
    Chrome: 'Mozilla/5.0 (Linux; GoogleTV 3.2; NSZ-GS7/GX70 Build/MASTER) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.77 Safari/534.24',
    'IE Mobile': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; LG; GW910)',
    IE: 'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.2; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0',
    Opera: 'Mozilla/5.0 (X11; U; Linux x86_64; de; rv:1.9.0.6) Gecko/2009020911 Ubuntu/8.10 (intrepid) Mozilla/4.0 (compatible; MSIE 6.0; MSIE 5.5; Windows NT 5.1) Opera 7.03 [de]',
    'Opera Mobile': 'Opera/9.80 (Android 2.3.3; Linux; Opera Mobi/ADR-1111101157; U; es-ES) Presto/2.9.201 Version/11.50',
    'Opera Mini': 'Opera/9.80 (J2ME/MIDP; Opera Mini/9.80 (S60; SymbOS; Opera Mobi/23.334; U; id) Presto/2.5.25 Version/10.54',
    Android: 'Mozilla/5.0 (Linux; U; Android 2.3; en-us) AppleWebKit/999+ (KHTML, like Gecko) Safari/999.9',
    Firefox: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:24.0) Gecko/20100101 Firefox/24.0',
    Googlebot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    Facebook: 'Mozilla/5.0 (iPad; CPU OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12H143 [FBAN/FBIOS;FBAV/40.0.0.42.290;FBBV/15252421;FBDV/iPad4,1;FBMD/iPad;FBSN/iPhone OS;FBSV/8.4;FBSS/2; FBCR/;FBID/tablet;FBLC/en_US;FBOP/1]',
    'BlackBerry WebKit': 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; fr) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.246 Mobile Safari/534.1+',
    Baiduspider: 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
    'Yandex Browser': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.12785 YaBrowser/13.12.1599.12785 Safari/537.36'
};

const browsers = {
    'Chrome Mobile': 'Chrome',
    'Mobile Safari': 'Safari',
    Chrome: 'Chrome',
    'IE Mobile': 'IE',
    IE: 'IE',
    Opera: 'Opera',
    'Opera Mobile': 'Opera',
    'Opera Mini': 'Opera',
    Android: 'Android',
    Firefox: 'Firefox',
    Googlebot: 'Other',
    Facebook: 'Other',
    'BlackBerry WebKit': 'Other',
    Baiduspider: 'Other',
    'Yandex Browser': 'Yandex'
};

describe('User Agents', () => {

    it('should throw an error', (done) => {

        const throws = function () {
            return new UserAgent();
        };
        expect(throws).to.throw(Error, 'Invalid useragent string!');

        done();
    });

    it('should expose user agent string', (done) => {

        const ua = new UserAgent(agents['Chrome Mobile']);
        expect(ua.agentStr).to.equal(agents['Chrome Mobile']);

        done();
    });

    it('should expose useragent module ', (done) => {

        const ua = new UserAgent(agents['Chrome Mobile']);
        expect(ua.userAgent).to.be.object();

        done();
    });

    it('should return browser', (done) => {

        const ua = new UserAgent(agents['Chrome Mobile']);
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
});