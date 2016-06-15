'use strict';

const useragent = require('useragent');
const MOBILE_DEVICE_FAMILIES = [
    'iPhone',
    'iPod',
    'Generic Smartphone',
    'Generic Feature Phone',
    'PlayStation Vita'
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
    'Windows Mobile'
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
    'Firefox OS'
];

const TOUCH_CAPABLE_DEVICE_FAMILIES = [
    'BlackBerry Playbook',
    'Blackberry Playbook',
    'Kindle Fire'
];

module.exports = class UserAgentParser {
    /**
     * Takes user agent string and parses with useragent library
     * @param {String} uaString
     */
    constructor(uaString) {

        if (!uaString || typeof uaString !== 'string') {
            throw new Error('Invalid useragent string!');
        }
        this.agentStr = uaString;
        this.userAgent = useragent.parse(uaString);
    }


    /**
     * returns Browser main type
     * @returns {String}
     */
    getBrowser() {

        if (this.userAgent.family === 'IE' || this.userAgent.family === 'IE Mobile') return 'IE';
        else if (this.userAgent.family.indexOf('Chrome') > -1) return 'Chrome';
        else if (this.userAgent.family.indexOf('Opera') > -1) return 'Opera';
        else if (this.userAgent.family.indexOf('Safari') > -1) return 'Safari';
        else if (this.userAgent.family.indexOf('Firefox') > -1) return 'Firefox';
        else if (this.userAgent.family.indexOf('Android') > -1) return 'Android';
        else if (this.userAgent.family.indexOf('Yandex') > -1) return 'Yandex';

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
        if (this.agentStr.indexOf('Mobile Safari') === -1 && this.userAgent.family !== 'Firefox Mobile') return true;
        return false;
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
        //if (this.userAgent.device.family.indexOf('Blackberry 95') > -1) return true;

        return false;
    }

    /**
     * Returns given device is touch capable or not
     * @returns {boolean}
     */
    isTouchCapable() {

        if (TOUCH_CAPABLE_OS_FAMILIES.indexOf(this.userAgent.os.family) > -1) return true;
        if (TOUCH_CAPABLE_DEVICE_FAMILIES.indexOf(this.userAgent.device.family) > -1) return true;
        if (this.userAgent.os.family.startsWith('Windows 8') && this.agentStr.indexOf('Touch') > -1) return true;
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
        // TODO: remove after https://github.com/tobie/ua-parser/issues/126 is closed
        if (this.agentStr.indexOf('J2ME') > -1 || this.agentStr.indexOf('MIDP') > -1) return true;
        // his is here mainly to detect Google's Mobile Spider
        if (this.agentStr.indexOf('iPhone;') > -1) return true;
        if (this.agentStr.indexOf('Googlebot-Mobile') > -1) return true;
        // Mobile Spiders should be identified as mobile
        if (this.userAgent.device.family === 'Spider' && this.userAgent.family.indexOf('Mobile') > -1) return true;
        // Nokia mobile
        if (this.agentStr.indexOf('NokiaBrowser') > -1 && this.agentStr.indexOf('Mobile') > -1) return true;

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
        if (this.agentStr.indexOf('Windows NT') > -1 || PC_OS_FAMILIES.indexOf(this.userAgent.os.family) > -1) return true;
        if (this.userAgent.os.family === 'Mac OS X' && this.agentStr.indexOf('Silk') === -1) return true;
        // Maemo has 'Linux' and 'X11' in UA, but it is not for PC
        if (this.agentStr.indexOf('Maemo') > -1) return true;
        if (this.agentStr.indexOf('Linux') && this.agentStr.indexOf('X11') > -1) return true;

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

        var os = this.userAgent.os.family;
        if (os.indexOf('Windows') > -1 && os.indexOf('Phone') === -1) os = 'Windows';

        return os
    }

    /**
     * Returns true given device if smart tv
     * @returns {boolean}
     */
    isSmartTv() {

        if (this.userAgent.os.family === 'GoogleTV') return true;
        if (this.agentStr.indexOf('SmartTV') > -1 || this.agentStr.indexOf('SMART-TV') > -1) return true;

        return false;
    }

    /**
     * Returns device category based on assumptions
     * @returns {String}
     */
    getDevice() {

        if (this.isTablet()) return 'tablet';
        else if (this.isMobile()) return 'mobile';
        else if (this.isPc()) return 'pc';
        else if (this.isSmartTv()) return 'smarttv';
        else if (this.isBot()) return 'bot';

        return 'other';
    }
}
