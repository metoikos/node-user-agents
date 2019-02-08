[![npm version](https://badge.fury.io/js/node-user-agents.svg)](https://badge.fury.io/js/node-user-agents) 
[![Build Status](https://travis-ci.org/metoikos/node-user-agents.svg?branch=master)](https://travis-ci.org/metoikos/node-user-agents)

# Node User Agents

Smart user-agent parser for Node.

Extends [useragents] module and provides [python-user-agents] like functionality. Exposes custom defined functions like isMobile(), isTablet(), isPc()

[python-user-agents]: https://github.com/selwin/python-user-agents
[useragents]: https://github.com/3rd-Eden/useragent

### Installation:

```no-highlight
npm install --save node-user-agents
```

```no-highlight
yarn add node-user-agents
```

### Usage:
```js
const UserAgent = require('node-user-agents');
const uaString = 'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19';

const useragent = new UserAgent(uaString);

// logs true
console.log(useragent.isMobile());
```

While using this module you can still access *useragent* module through ```useragent.userAgent``` property, for example ```console.log(useragent.userAgent.family);```.

Also you can access user agent string via ```useragent.uaString```

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
