import requests
from utils import get_phonepe_access_token
import uuid


url = "https://api.phonepe.com/apis/pg/checkout/v2/pay"

merchantOrderId = str(uuid.uuid4())

payload = {
  "amount": 100,
  "expireAfter": 1200,
  "metaInfo": {
    "udf1": "additional-information-1",
    "udf2": "additional-information-2",
    "udf3": "additional-information-3",
    "udf4": "additional-information-4",
    "udf5": "additional-information-5"
  },
  "paymentFlow": {
    "type": "PG_CHECKOUT",
    "message": "Payment message used for collect requests",
    "merchantUrls": {
      "redirectUrl": "https://www.gov.nonexistential.dev/"
    }
  },
  "merchantOrderId": f"{merchantOrderId}"
};

headers = {
  "Content-Type": "application/json",
  "Authorization": f"O-Bearer {get_phonepe_access_token()}"}

response = requests.post(url, json=payload, headers=headers)

print(response.text)
print("Status:", response.status_code)
print("Headers:", response.headers)
print("Body:", response.text)
