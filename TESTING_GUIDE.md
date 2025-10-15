# PhonePe Payment Integration - Testing Guide

## ✅ Setup Complete!

Your PhonePe integration is now fully connected and ready to test.

---

## 🧪 How to Test the Payment Flow

### Step 1: Access the App

Since your user is older than 120 days, when you log in you'll see:

```
🔒 Subscription Required

Your account is more than 120 days old. Please subscribe to continue using Govvv.

[View Plans & Pay]  [Logout]
```

### Step 2: Click "View Plans & Pay"

This will take you to: `https://02d82b37d7c4.ngrok-free.app/payment`

You'll see three subscription plans:
- **Basic** - ₹99 (3 months)
- **Standard** - ₹179 (6 months) - Most Popular
- **Premium** - ₹299 (12 months)

### Step 3: Select a Plan

Click "Pay ₹99" (or any amount) button.

**What happens behind the scenes:**
1. Frontend calls `/api/payments/initiate` with your JWT token
2. Backend creates a pending transaction in database
3. Backend calls PhonePe API
4. Backend returns PhonePe redirect URL
5. You're redirected to PhonePe payment page

### Step 4: Complete Payment on PhonePe

On the PhonePe page, you can:
- **For Testing:** Use PhonePe sandbox test credentials (if in sandbox mode)
- **For Real:** Complete actual payment with UPI/Card/NetBanking

### Step 5: Return to Your App

After payment:
1. PhonePe redirects you to: `https://02d82b37d7c4.ngrok-free.app/payment/success?transactionId=TXN_...`
2. The success page automatically polls the payment status
3. You'll see one of:
   - ✅ **Success** - Payment completed, subscription activated
   - ❌ **Failed** - Payment declined/failed
   - ⏳ **Pending** - Still processing (rare)

### Step 6: Verify in Database

After successful payment, check Supabase:

```sql
-- Check transaction
SELECT * FROM payment_transactions 
ORDER BY created_at DESC LIMIT 1;

-- Check subscription
SELECT * FROM subscriptions 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC LIMIT 1;

-- Check callback log
SELECT * FROM payment_callbacks 
ORDER BY received_at DESC LIMIT 1;
```

---

## 🔍 Watch the Logs

Open your terminal where `npm run dev` is running. You'll see:

```bash
# When you click "Pay"
🚀 Payment initiation request received
✅ User authenticated: user-id
🆔 Transaction ID: TXN_1234567890_abc123
🔐 Signature generated
📡 Calling PhonePe API: https://api.phonepe.com/...
✅ Payment initiated successfully
🔗 Redirect URL: https://mercury.phonepe.com/...

# When PhonePe sends callback (after payment)
🔔 Payment callback received from PhonePe
🔐 Verifying signature...
✅ Signature verified successfully
📋 Callback payload decoded
   Transaction: TXN_1234567890_abc123
   Status: SUCCESS
   Amount: 9900 paisa
✅ Payment successful!
💰 Processing successful payment...
✅ Payment record created
✅ Subscription extended to 2025-01-10T...
✅ Callback processed successfully in 150ms
```

---

## 🐛 Troubleshooting

### Issue: "Authentication required"

**Cause:** Not logged in or JWT token expired

**Solution:**
1. Refresh the page
2. Log out and log back in
3. Check browser console for errors

### Issue: "Failed to initiate payment"

**Cause:** Backend error or PhonePe API issue

**Solution:**
1. Check terminal logs for error details
2. Verify ngrok URL is correct in config
3. Check Supabase connection

### Issue: "Callback not received"

**Cause:** PhonePe can't reach your callback URL

**Solution:**
1. Verify ngrok is still running
2. Check ngrok URL hasn't changed
3. Test callback URL manually:
   ```bash
   curl https://02d82b37d7c4.ngrok-free.app/api/payments/callback
   # Should return: "Method not allowed..."
   ```

### Issue: Payment success but status shows "pending"

**Cause:** Callback processing delay or error

**Solution:**
1. Wait 1-2 minutes
2. Click "Check Again" button
3. Manually check database:
   ```sql
   SELECT * FROM payment_transactions 
   WHERE merchant_transaction_id = 'TXN_...';
   ```

---

## 🧪 Manual Testing with cURL

### Test Payment Initiation

```bash
# 1. Get your JWT token
# Go to browser dev tools → Application → Local Storage
# Find "sb-{project}-auth-token" → Copy access_token

# 2. Test payment initiation
curl -X POST https://02d82b37d7c4.ngrok-free.app/api/payments/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{"amount":1,"planId":"test"}'

# Expected response:
# {
#   "success": true,
#   "merchantTransactionId": "TXN_1234567890_abc123",
#   "redirectUrl": "https://mercury.phonepe.com/...",
#   "message": "Payment initiated successfully"
# }
```

### Test Status Check

```bash
# Replace TXN_... with your transaction ID
curl https://02d82b37d7c4.ngrok-free.app/api/payments/status/TXN_1234567890_abc123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Expected response:
# {
#   "success": true,
#   "status": "PENDING",
#   "merchantTransactionId": "TXN_1234567890_abc123",
#   "amount": 1
# }
```

---

## 📊 Test Scenarios

### Scenario 1: Successful Payment (Happy Path)

1. ✅ Login with 120+ day old account
2. ✅ See payment popup
3. ✅ Click "View Plans & Pay"
4. ✅ Select a plan and click "Pay"
5. ✅ Complete payment on PhonePe
6. ✅ See success message
7. ✅ Subscription activated in database
8. ✅ Can now access app normally

### Scenario 2: Failed Payment

1. ✅ Start payment
2. ✅ Cancel or decline on PhonePe
3. ✅ Return to app
4. ✅ See "Payment Failed" message
5. ✅ Click "Try Again"
6. ✅ Back to payment selection page

### Scenario 3: Duplicate Callback

1. ✅ Complete payment
2. ✅ PhonePe sends callback (status updated)
3. ✅ PhonePe retries callback (duplicate)
4. ✅ Backend detects duplicate
5. ✅ Returns 200 OK without reprocessing
6. ✅ Only one payment record in database

---

## 🎯 Success Criteria

After successful payment:

- ✅ Transaction status = "SUCCESS" in `payment_transactions`
- ✅ Record in `payments` table
- ✅ Record in `subscriptions` table (end_date extended)
- ✅ Callback logged in `payment_callbacks` (signature_valid = true)
- ✅ User can access app without payment popup

---

## 📍 URLs to Know

| URL | Purpose |
|-----|---------|
| `https://02d82b37d7c4.ngrok-free.app` | Your app (ngrok tunnel) |
| `/payment` | Payment plans page |
| `/payment/success` | Post-payment status page |
| `/api/payments/initiate` | Payment initiation API |
| `/api/payments/callback` | PhonePe webhook endpoint |
| `/api/payments/status/[id]` | Status check API |

---

## 🚀 Start Testing Now!

1. **Open your app:** https://02d82b37d7c4.ngrok-free.app
2. **Login** with your 120+ day old account
3. **Click** "View Plans & Pay"
4. **Select** any plan (₹99 recommended for testing)
5. **Complete** payment on PhonePe
6. **Watch** the logs in your terminal
7. **Verify** in Supabase database

---

## 📝 Notes

- **Ngrok URL:** Your current ngrok URL is already configured in the code
- **Callback URL:** PhonePe will send callbacks to `https://02d82b37d7c4.ngrok-free.app/api/payments/callback`
- **Environment:** Currently using PRODUCTION PhonePe (real payments!)
- **Test Amount:** Start with ₹1 or ₹99 for testing

---

## ⚠️ Important Reminders

1. **Keep ngrok running** while testing - if it stops, payments won't work
2. **Watch terminal logs** - they show every step of the payment process
3. **Check database** - verify data is being saved correctly
4. **Test both success and failure** - try canceling a payment too

---

## 🎉 Happy Testing!

Everything is connected and ready. Just click "View Plans & Pay" and complete a test payment!

If you encounter any issues, check:
1. Terminal logs (most informative)
2. Browser console (frontend errors)
3. Supabase logs (database issues)
4. This guide (troubleshooting section)

**Good luck! 🚀**

