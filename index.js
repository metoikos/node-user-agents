'use strict';
const useragent = require('useragent');
const MOBILE_DEVICE_FAMILIES = [
    'iPhone',
    'iPod',
    'Generic Smartphone',
    'Generic Feature Phone',
    'PlayStation Vita',
    'iOS-Device'
];

const PC_OS_FAMILIES = [
    'Windows 95',
    'Windows 98',
    'Windows ME',
    'Solaris'
];

const MOBILE_OS_FAMILIES = [
    'Windows Phone',
    'Windows Phone OS',  // Earlier versions of ua-parser returns Windows Phone OS
    'Symbian OS',
    'Bada',
    'Windows CE',
    'Windows Mobile',
    'Maemo',
];

const MOBILE_BROWSER_FAMILIES = [
    'Opera Mobile',
    'Opera Mini'
];

const TABLET_DEVICE_FAMILIES = [
    'iPad',
    'BlackBerry Playbook',
    'Blackberry Playbook',  // Earlier versions of ua-parser returns 'Blackberry' instead of 'BlackBerry'
    'Kindle',
    'Kindle Fire',
    'Kindle Fire HD',
    'Galaxy Tab',
    'Xoom',
    'Dell Streak'
];

const TOUCH_CAPABLE_OS_FAMILIES = [
    'iOS',
    'Android',
    'Windows Phone',
    'Windows Phone OS',
    'Windows RT',
    'Windows CE',
    'Windows Mobile',
    'Firefox OS',
    'MeeGo',
];

const TOUCH_CAPABLE_DEVICE_FAMILIES = [
    'BlackBerry Playbook',
    'Blackberry Playbook',
    'Kindle Fire'
];

const EMAIL_PROGRAM_FAMILIES = [
    'Outlook',
    'Windows Live Mail',
    'AirMail',
    'Apple Mail',
    'Outlook',
    'Thunderbird',
    'Lightning',
    'ThunderBrowse',
    'Windows Live Mail',
    'The Bat!',
    'Lotus Notes',
    'IBM Notes',
    'Barca',
    'MailBar',
    'kmail2',
    'YahooMobileMail'
];

module.exports = class UserAgentParser {
    /**
     * Takes user agent string and parses with useragent library
     * @param {String} uaString
     * @param {Object} [options]
     * @param {boolean} [options.update]
     * @param {boolean} [options.lookup]
     * @param {function} [useragentLib]
     */
    constructor(uaString, options, useragentLib) {
        this.lookup = false;

        if (uaString && typeof uaString === 'string') {
            this.uaString = uaString;

            if (options && typeof options === 'function') {
                this._setParser(options);
            } else {
                this._setParser(useragentLib);
                this._parseOptions(options);
            }
        } else if (uaString && typeof uaString === 'object') {
            this._setParser(useragentLib);
            this._parseOptions(uaString);
        } else {
            this._setParser(uaString);
        }
    }

    _parseOptions(options) {
        if (options) {
            if (options.update) {
                this.updateParser();
            }

            // set global lookup flag to true
            if (options.lookup) {
                this.lookup = true;
            }
        }

        // we only parse uaString if exists
        if (this.uaString) {
            this.parse(this.uaString);
        }
    }

    _setParser(useragentLib) {
        this.parser = useragentLib ? useragentLib : useragent;
    }

    get agentStr() {
        return this.uaString
    }

    updateParser() {
        this.parser(true);
    }

    parse(uaString, lookup) {
        if (!uaString || typeof uaString !== 'string') {
            throw new Error('Invalid useragent string!');
        }

        this.uaString = uaString;

        // if lookup property is true then we should use it
        // but we might want to disable per parse, for memory reasons
        if (lookup === false) {
            this.userAgent = this.parser.parse(uaString);
        } else if (this.lookup === true || lookup === true) {
            this.userAgent = this.parser.lookup(uaString);
        } else {
            // console.log("Last line");
            this.userAgent = this.parser.parse(uaString);
        }
    }

    /**
     * Returns short browser name for given ua-string
     * @returns {*}
     */
    getBrowser() {

        if (this.userAgent.family === 'IE' || this.userAgent.family === 'IE Mobile' || this.userAgent.family === 'Zune') return 'IE';
        else if (this.userAgent.family.indexOf('Chrome') > -1) return 'Chrome';
        else if (this.userAgent.family.indexOf('Opera') > -1) return 'Opera';
        else if (this.userAgent.family.indexOf('Safari') > -1) return 'Safari';
        else if (this.userAgent.family.indexOf('Firefox') > -1) return 'Firefox';
        else if (this.userAgent.family.indexOf('Android') > -1) return 'Android';
        else if (this.userAgent.family.indexOf('Yandex') > -1) return 'Yandex';
        else if (this.userAgent.family.indexOf('Edge') > -1) return 'Edge';

        return 'Other';
    }

    /**
     * Returns given device if android tablet or not
     * @returns {boolean}
     * @private
     */
    _isAndroidTablet() {

        // Newer Android tablets don't have 'Mobile' in their user agent string,
        // older ones like Galaxy Tab still have 'Mobile' though they're not
        return this.uaString.indexOf('Mobile Safari') === -1 && this.userAgent.family !== 'Firefox Mobile';

    }

    /**
     * Returns given device is blackberry touch capable device or not
     * @returns {boolean}
     * @private
     */
    _isBlackberryTouchCapableDevice() {

        // A helper to determine whether a BB phone has touch capabilities
        // Blackberry Bold Touch series begins with 99XX
        if (this.userAgent.device.family.indexOf('Blackberry 99') > -1) return true;
        if (this.userAgent.device.family.indexOf('Blackberry 95') > -1) return true;

        return false;
    }

    /**
     * Returns given device is touch capable or not
     * @returns {boolean}
     */
    isTouchCapable() {

        if (TOUCH_CAPABLE_OS_FAMILIES.indexOf(this.userAgent.os.family) > -1) return true;
        if (TOUCH_CAPABLE_DEVICE_FAMILIES.indexOf(this.userAgent.device.family) > -1) return true;
        if (this.userAgent.os.family.startsWith('Windows 8') && this.uaString.indexOf('Touch') > -1) return true;
        if (this.userAgent.os.family.indexOf('BlackBerry') && this._isBlackberryTouchCapableDevice()) return true;

        return false;
    }

    /**
     * Returns given device is mobile
     * @returns {boolean}
     */
    isMobile() {

        if (MOBILE_DEVICE_FAMILIES.indexOf(this.userAgent.device.family) > -1) return true;
        if (MOBILE_BROWSER_FAMILIES.indexOf(this.userAgent.family) > -1) return true;
        // Device is considered Mobile OS is Android and not tablet
        // This is not fool proof but would have to suffice for now
        if ((this.userAgent.os.family === 'Android' || this.userAgent.os.family === 'Firefox OS') && !this.isTablet()) return true;
        if (this.userAgent.os.family === 'BlackBerry OS' && this.userAgent.device.family !== 'Blackberry Playbook') return true;
        if (MOBILE_OS_FAMILIES.indexOf(this.userAgent.os.family) > -1) return true;
        if (this.agentStr.indexOf('J2ME') > -1 || this.agentStr.indexOf('MIDP') > -1) return true;
        // this is here mainly to detect Google's Mobile Spider
        if (this.uaString.indexOf('iPhone;') > -1) return true;
        if (this.uaString.indexOf('Googlebot-Mobile') > -1) return true;
        // Mobile Spiders should be identified as mobile
        if (this.userAgent.device.family === 'Spider' && this.userAgent.family.indexOf('Mobile') > -1) return true;
        // Nokia mobile
        if (this.uaString.indexOf('NokiaBrowser') > -1 && this.uaString.indexOf('Mobile') > -1) return true;

        return false;
    }

    /**
     * Returns given device if tablet
     * @returns {boolean}
     */
    isTablet() {

        if (TABLET_DEVICE_FAMILIES.indexOf(this.userAgent.device.family) > -1) return true;
        if (this.userAgent.os.family === 'Android' && this._isAndroidTablet()) return true;
        if (this.userAgent.os.family.startsWith('Windows RT')) return true;
        if (this.userAgent.os.family === 'Firefox OS' && this.userAgent.family.indexOf('Mobile') === -1) return true;
        /*
         * interesting agent string though
         * Mozilla/5.0 (iPad; CPU OS 9_0_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13A452 [FBAN/FBIOS;FBAV/40.0.0.42.290;FBBV/15252421;FBDV/iPad4,2;FBMD/iPad;FBSN/iPhone OS;FBSV/9.0.2;FBSS/2; FBCR/AVEA;FBID/tablet;FBLC/tr_TR;FBOP/1]
         */
        if (this.userAgent.device.family.indexOf('iPad') > -1) return true;

        return false;
    }

    /**
     * Returns given device if pc
     * @returns {boolean}
     */
    isPc() {

        // Returns True for 'PC' devices (Windows, Mac and Linux)
        if (this.uaString.indexOf('Windows NT') > -1 || PC_OS_FAMILIES.indexOf(this.userAgent.os.family) > -1) return true;
        // Maemo has 'Linux' and 'X11' in UA, but it is not for PC
        if (this.userAgent.os.family === 'Mac OS X' && this.agentStr.indexOf('Silk') === -1) return true;
        if (this.uaString.indexOf('Maemo') > -1) return false;
        if (this.userAgent.os.family.indexOf('Chrome OS') > -1) return true;
        if (this.uaString.indexOf('Linux') && this.uaString.indexOf('X11') > -1) return true;

        return false;
    }

    /**
     * Returns given device if bot
     * @returns {boolean}
     */
    isBot() {

        return this.userAgent.device.family === 'Spider';
    }

    /**
     * Returns OS String like Windows, Linux, Mac OS X, OpenBSD, Android, iOS
     * @returns {String}
     */
    getOs() {

        let os = this.userAgent.os.family;
        if (os.indexOf('Windows') > -1 && os.indexOf('Phone') === -1) os = 'Windows';

        return os
    }

    /**
     * Returns true given device if smart tv
     * @returns {boolean}
     */
    isSmartTv() {

        if (this.userAgent.os.family === 'GoogleTV') return true;
        return this.uaString.indexOf('SmartTV') > -1 || this.uaString.indexOf('SMART-TV') > -1;
    }

    /**
     * Detects if current device is email client or not
     */
    isEmailClient() {
        return EMAIL_PROGRAM_FAMILIES.indexOf(this.userAgent.os.family) > -1;
    }

    /**
     *
     * @returns {String}
     */
    getDevice() {

        if (this.isTablet()) return 'tablet';
        else if (this.isMobile()) return 'mobile';
        else if (this.isPc()) return 'pc';
        else if (this.isSmartTv()) return 'smarttv';
        else if (this.isBot()) return 'bot';
        else if (this.isEmailClient()) return 'email-client';

        return 'other';
    }
};
