# Node User Agents

Extends [useragents] module and provides [python-user-agents] like functionality. Exposes custom defined functions like isMobile(), isTablet(), isPc()

[python-user-agents]: https://github.com/selwin/python-user-agents
[useragents]: https://github.com/3rd-Eden/useragent

### Usage:
```js
const UserAgent = require('node-user-agents');
const uaString = 'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19';

const useragent = new UserAgent(uaString);

// logs true
console.log(useragent.isMobile());
```

While using this module you can still access *useragent* module through ```useragent.userAgent``` property, for example ```console.log(useragent.userAgent.family);```.

Also you can access user agent string via ```useragent.agentStr```

### Api:
This module provides these additional methods.

- `getBrowser()` Returns generic browser name
- `isTouchCapable()` Returns true if given device is touch capable
- `isMobile()`
- `isTablet()`
- `isPc()`
- `isBot()`
- `getOs()` Returns OS String like Windows, Linux, Mac OS X, OpenBSD, Android, iOS
- `isSmartTv()`
- `getDevice()` Returns device category based on above methods like tablet, mobile, pc, bot
