import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000/api"

def make_req(url, method="POST", body=None, headers=None):
    if headers is None:
        headers = {}
    if body and not isinstance(body, bytes):
        body = json.dumps(body).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"✅ [{method}] {url} -> Status {resp.status}")
            print(json.dumps(data, indent=2))
            return resp.status, data
    except urllib.error.HTTPError as e:
        err_body = json.loads(e.read().decode('utf-8'))
        print(f"❌ [{method}] {url} -> HTTP {e.code}")
        print(json.dumps(err_body, indent=2))
        return e.code, err_body

print("--- 1. Testing Registration Validation (Weak Password) ---")
make_req(f"{BASE_URL}/auth/register/", "POST", {
    "email": "testmember@omnifit.com",
    "password": "simple",
    "full_name": "Test User",
    "phone": "invalid_phone"
})

print("\n--- 2. Testing Registration Success ---")
make_req(f"{BASE_URL}/auth/register/", "POST", {
    "email": "valid.athlete@omnifit.com",
    "password": "StrongPassword@123",
    "full_name": "Valid Athlete",
    "phone": "+15554443333",
    "role": "member"
})

print("\n--- 3. Testing Registration Duplicate Email ---")
make_req(f"{BASE_URL}/auth/register/", "POST", {
    "email": "valid.athlete@omnifit.com",
    "password": "StrongPassword@123",
    "full_name": "Duplicate Athlete"
})
