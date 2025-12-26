import requests

URL = "http://localhost:8000/api/message"

if __name__ == '__main__':
    payload = {"session_id": "smoke-1", "content": "Hello from smoke test"}
    r = requests.post(URL, json=payload)
    print(r.status_code)
    print(r.json())
