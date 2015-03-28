# sap-hcp-express-proxy

Express.js proxy for the SAP HANA Cloud Platform.

Use this proxy to access a service that is hosted in the SAP HANA Cloud Platform from a different computer. You will be asked to provide your HCP credentials via basic HTTP auth to get a session.

Thanks to [Gregor Wolf](https://github.com/gregorwolf) who provided the basis for this via his [hanatrial-auth-proxy](https://github.com/gregorwolf/hanatrial-auth-proxy) module.

## Install

```shell
$ npm install sap-hcp-express-proxy
```

## Example

```javascript
var express = require('express');
var hcpProxy = require('sap-hcp-express-proxy');

// This is a dummy host
// You might have something like
// 'https://s6hanaxs.hanatrial.ondemand.com'
var hcpHost = 'https://hanaxs.ns.ondemand.com';

var app = express();
app.use('/hcp', hcpProxy(hcpHost))

app.listen(8080);

// You can now call e.g.:
// http://localhost:8080/hcp/myTrialUser/pack/to/service.xsjs
// and this would be proxied to:
// https://hanaxs.ns.ondemand.com/myTrialUser/pack/to/service.xsjs
```