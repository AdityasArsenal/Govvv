import requests
import json

def get_phonepe_access_token():
    API_URL = 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token'
    
    CLIENT_ID = 'SU2508041810254120514281'
    CLIENT_SECRET = 'c99221ef-7d77-4f9f-88da-33960804b858'
    
    payload = {
        'client_id': CLIENT_ID,
        'client_version': '1',
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials'
    }
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Python Token Fetcher'
    }
    
    try:
        print(f"Attempting to fetch token from {API_URL}...")
        response = requests.post(API_URL, data=payload, headers=headers, timeout=10)
        
        response.raise_for_status()
        
        data = response.json()
        
        access_token = data.get('access_token')
        
        if access_token:
            return access_token
        else:
            print("Error: 'access_token' field not found in the response.")
            print("Full response data:", data)
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"An error occurred during the API request: {e}")
        try:
            print("Server error response:", response.text)
        except NameError:
            pass
        return None

if __name__ == "__main__":
    token = get_phonepe_access_token()
    
    if token:
        print("\n✅ Successfully retrieved Access Token:")
        print(token[:50] + "...") 
    else:
        print("\n❌ Failed to retrieve Access Token.")

