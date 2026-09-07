import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(url, method="GET", body=None, headers=None):
    if headers is None:
        headers = {}
    if body and not isinstance(body, bytes):
        body = json.dumps(body).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"[{method}] {url} -> Status {resp.status}")
            print(json.dumps(data, indent=2)[:300] + "...\n")
            return data
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        print(f"[{method}] {url} -> HTTP ERROR {e.code}: {err_body}\n")
        return None
    except Exception as e:
        print(f"[{method}] {url} -> ERROR: {e}\n")
        return None

print("=== TESTING OMNIFIT REST APIS ===\n")

# 1. Login
login_res = make_request(f"{BASE_URL}/auth/login/", "POST", {
    "email": "sarah.jenkins@omnifit.com",
    "password": "Member@123"
})

# 2. Trainer Overview
make_request(f"{BASE_URL}/trainer/overview/")

# 3. Member Overview
make_request(f"{BASE_URL}/member/overview/")

# 4. Member Today Workout
make_request(f"{BASE_URL}/member/today-workout/")

# 5. Notifications
make_request(f"{BASE_URL}/notifications/")

# 6. Trainer Assign Routine
make_request(f"{BASE_URL}/trainer/assign-routine/", "POST", {
    "email": "sarah.jenkins@omnifit.com",
    "title": "Leg & Core Destruction",
    "exercises": [
        {"name": "Barbell Back Squats", "sets_reps": "4 x 8-10", "target_load": "80 kg"},
        {"name": "Romanian Deadlifts", "sets_reps": "3 x 10", "target_load": "60 kg"}
    ]
})

# 7. Notifications Mark Read
make_request(f"{BASE_URL}/notifications/mark-read/", "POST", {
    "mark_all": True
})
