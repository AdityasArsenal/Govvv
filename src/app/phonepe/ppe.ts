import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// --- YOUR PHONEPE CREDENTIALS ---
// These are the values you provided earlier
const MERCHANT_ID: string = 'SU2508041810254120514281';
const SALT_KEY: string = 'c99221ef-7d77-4f9f-88da-33960804b858';
const SALT_INDEX: number = 1;

// --- API ENDPOINTS AND PATHS ---
// Using UAT (sandbox) environment for testing
const API_URL: string = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';
const API_PATH: string = '/pg-sandbox/pg/v1/pay'; // Used for X-VERIFY hash

// --- PAYMENT PARAMETERS (CUSTOMIZE FOR YOUR TEST) ---
const PAYMENT_AMOUNT_PAISA: number = 100; // Rs 1.00 for testing
const REDIRECT_URL: string = 'https://yourwebsite.com/payment/success';
const CALLBACK_URL: string = 'https://yourwebsite.com/payment/webhook';

// --- ACCESS TOKEN ---
// Updated with the fresh token from your curl response
const FRESH_ACCESS_TOKEN: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJpZGVudGl0eU1hbmFnZXIiLCJ2ZXJzaW9uIjoiNC4wIiwidGlkIjoiNzRmMDliNDMtNjBiZi00MGExLTgxOTItZWQ2OWJkYjhiYWUzIiwic2lkIjoiZTUwZDE0ZjktYjI3OS00YzZhLWE3MzctZDc5ZDQ3YjAzZjNmIiwiaWF0IjoxNzU5MTc4NzMyLCJleHAiOjE3NTkxODIzMzJ9.DZBsNzSAvcBJHEzIpojypPx3Q3AtIq11kY0VsXeIHmw4mzOkJBLdozDYjEPD8eiIbmvn9Bvo4Js0q4vAi4djhQ';


/**
 * Core utility function to create the SHA256 checksum required by PhonePe.
 * Formula: SHA256(Base64EncodedPayload + EndpointPath + SaltKey) + "###" + SaltIndex
 * @param base64Payload The Base64 encoded JSON request string.
 * @returns The X-VERIFY hash string.
 */
function createXVerify(base64Payload: string): string {
    const checkString: string = base64Payload + API_PATH + SALT_KEY;
    const hash: string = crypto.createHash('sha256').update(checkString).digest('hex');
    return `${hash}###${SALT_INDEX}`;
}

/**
 * Initiates the payment request to PhonePe's server.
 */
async function createPayment(): Promise<void> {
    console.log('--- Starting PhonePe Payment Creation ---');

    // 1. Generate unique transaction IDs
    const merchantTransactionId: string = `TXN_${uuidv4()}`;

    // 2. Construct the Payment Payload (JSON)
    const payload = {
        merchantId: MERCHANT_ID,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: 'USER_123',
        amount: PAYMENT_AMOUNT_PAISA,
        redirectUrl: REDIRECT_URL,
        redirectMode: 'REDIRECT',
        callbackUrl: CALLBACK_URL,
        mobileNumber: '9999999999',
        paymentInstrument: {
            type: 'PAY_PAGE'
        }
    };

    console.log(`[1] Generated Merchant Transaction ID: ${merchantTransactionId}`);
    console.log(`[2] Transaction Amount (Paisa): ${PAYMENT_AMOUNT_PAISA}`);

    // 3. Base64 Encode the Payload
    const payloadJsonString: string = JSON.stringify(payload);
    const base64Payload: string = Buffer.from(payloadJsonString).toString('base64');
    console.log('[3] Payload successfully Base64 Encoded.');

    // 4. Calculate the X-VERIFY Header
    const xVerify: string = createXVerify(base64Payload);
    console.log(`[4] Calculated X-VERIFY Checksum: ${xVerify}`);

    // 5. Construct the final request body
    const finalRequestBody = {
        request: base64Payload,
    };

    // 6. Send the POST request
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // PhonePe requires BOTH Authorization and X-VERIFY headers
                'Authorization': `Bearer ${FRESH_ACCESS_TOKEN}`,
                'X-VERIFY': xVerify,
            },
            body: JSON.stringify(finalRequestBody),
        });

        // 7. Process the response
        const data = await response.json();

        if (response.ok && data.success === true && data.data && data.data.redirectUrl) {
            console.log('\n✅ SUCCESS: Payment initiated successfully!');
            console.log('------------------------------------------------');
            console.log(`[5] Redirect URL: ${data.data.redirectUrl}`);
            console.log('------------------------------------------------');
            console.log('ACTION REQUIRED: Copy the Redirect URL and open it in your browser to complete the payment.');
        } else {
            console.error('\n❌ ERROR: PhonePe API returned an error.');
            console.error(`Status Code: ${response.status}`);
            console.error('Response Data:', data);
        }

    } catch (error) {
        console.error('\n🚨 CRITICAL FAILURE: Could not connect to PhonePe API.', error);
    }
}

// Execute the main function
createPayment();
