"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_sdk_node_1 = require("pg-sdk-node");
var crypto_1 = require("crypto");
var clientId = "SU2508041810254120514281";
var clientSecret = "c99221ef-7d77-4f9f-88da-33960804b858";
var clientVersion = 100;
var env = pg_sdk_node_1.Env.PRODUCTION;
var client = pg_sdk_node_1.StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
var merchantOrderId = (0, crypto_1.randomUUID)();
var amount = 10;
var redirectUrl = "https://c7f122017ed0.ngrok-free.app";
var metaInfo = pg_sdk_node_1.MetaInfo.builder()
    .udf1("udf1")
    .udf2("udf2")
    .build();
var request = pg_sdk_node_1.StandardCheckoutPayRequest.builder()
    .merchantOrderId(merchantOrderId)
    .amount(amount)
    .redirectUrl(redirectUrl)
    .metaInfo(metaInfo)
    .build();
client.pay(request).then(function (response) {
    console.log("Raw Response:", response);
    console.log("Checkout URL:", response.redirectUrl);
}).catch(function (err) {
    console.error("Payment Init Error:", err);
});
