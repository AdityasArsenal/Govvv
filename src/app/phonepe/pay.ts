import { StandardCheckoutClient, Env, MetaInfo, StandardCheckoutPayRequest, StandardCheckoutPayResponse } from 'pg-sdk-node';
import { randomUUID } from 'crypto';

const clientId ="SU2508041810254120514281";
const clientSecret ="c99221ef-7d77-4f9f-88da-33960804b858";
const clientVersion = 100;
const env = Env.PRODUCTION;

const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

const merchantOrderId: string = randomUUID();
const amount: number = 10;
const redirectUrl: string = "https://c7f122017ed0.ngrok-free.app";

const metaInfo: MetaInfo = MetaInfo.builder()
    .udf1("udf1")
    .udf2("udf2")
    .build();

const request: StandardCheckoutPayRequest = StandardCheckoutPayRequest.builder()
    .merchantOrderId(merchantOrderId)
    .amount(amount)
    .redirectUrl(redirectUrl)
    .metaInfo(metaInfo)
    .build();

client.pay(request).then((response: StandardCheckoutPayResponse)=> {
    console.log("Raw Response:", response);
    console.log("Checkout URL:", response.redirectUrl);
}).catch((err) => {
    console.error("Payment Init Error:", err);
});
