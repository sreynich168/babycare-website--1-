import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class BabyCareAPITester:
    def __init__(self):
        self.base_url = "https://mommy-doc-hub.preview.emergentagent.com/api"
        self.parent_token = None
        self.doctor_token = None
        self.parent_user = None
        self.doctor_user = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
    def log_test(self, name: str, success: bool, details: str = ""):
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")
        print()

    def make_request(self, method: str, endpoint: str, data: Dict = None, token: str = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)
            
            try:
                response_data = response.json()
            except:
                response_data = response.text
                
            return response.status_code in [200, 201], response_data, response.status_code
            
        except Exception as e:
            return False, str(e), 0

    def test_api_health(self):
        """Test if API is responsive"""
        success, data, status = self.make_request('GET', '/')
        expected_message = "BabyCare API is running"
        
        if success and isinstance(data, dict) and data.get('message') == expected_message:
            self.log_test("API Health Check", True, f"Status: {status}")
        else:
            self.log_test("API Health Check", False, f"Status: {status}, Response: {data}")

    def test_parent_signup(self):
        """Test parent user signup"""
        timestamp = datetime.now().strftime('%H%M%S')
        signup_data = {
            "email": f"parent_test_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Test Parent {timestamp}",
            "role": "parent",
            "age": 28,
            "weight": 65.5,
            "height": 165.0
        }
        
        success, data, status = self.make_request('POST', '/auth/signup', signup_data)
        
        if success and 'token' in data and 'user' in data:
            self.parent_token = data['token']
            self.parent_user = data['user']
            self.log_test("Parent Signup", True, f"User ID: {data['user']['id']}")
        else:
            self.log_test("Parent Signup", False, f"Status: {status}, Response: {data}")

    def test_doctor_signup(self):
        """Test doctor user signup"""
        timestamp = datetime.now().strftime('%H%M%S')
        signup_data = {
            "email": f"doctor_test_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Dr. Test {timestamp}",
            "role": "doctor",
            "age": 35,
            "experience": 8,
            "nationality": "USA"
        }
        
        success, data, status = self.make_request('POST', '/auth/signup', signup_data)
        
        if success and 'token' in data and 'user' in data:
            self.doctor_token = data['token']
            self.doctor_user = data['user']
            # Check if trial_start_date is set for doctor
            has_trial = data['user'].get('trial_start_date') is not None
            self.log_test("Doctor Signup", True, f"User ID: {data['user']['id']}, Trial: {has_trial}")
        else:
            self.log_test("Doctor Signup", False, f"Status: {status}, Response: {data}")

    def test_login_flows(self):
        """Test login for both user types"""
        if not self.parent_user or not self.doctor_user:
            self.log_test("Login Tests", False, "Cannot test - signup failed")
            return
        
        # Test parent login
        login_data = {"email": self.parent_user['email'], "password": "TestPass123!"}
        success, data, status = self.make_request('POST', '/auth/login', login_data)
        
        if success and 'token' in data:
            self.log_test("Parent Login", True, "Login successful")
        else:
            self.log_test("Parent Login", False, f"Status: {status}")
        
        # Test doctor login
        login_data = {"email": self.doctor_user['email'], "password": "TestPass123!"}
        success, data, status = self.make_request('POST', '/auth/login', login_data)
        
        if success and 'token' in data:
            self.log_test("Doctor Login", True, "Login successful")
        else:
            self.log_test("Doctor Login", False, f"Status: {status}")

    def test_profile_access(self):
        """Test profile retrieval for authenticated users"""
        if not self.parent_token:
            self.log_test("Profile Access", False, "No parent token available")
            return
        
        success, data, status = self.make_request('GET', '/users/profile', token=self.parent_token)
        
        if success and 'email' in data:
            self.log_test("Profile Access", True, f"Retrieved profile for {data['name']}")
        else:
            self.log_test("Profile Access", False, f"Status: {status}")

    def test_doctors_list(self):
        """Test doctors listing (public endpoint)"""
        success, data, status = self.make_request('GET', '/doctors')
        
        if success and 'doctors' in data:
            doctor_count = len(data['doctors'])
            self.log_test("Doctors List", True, f"Found {doctor_count} doctors")
        else:
            self.log_test("Doctors List", False, f"Status: {status}")

    def test_ai_chatbot(self):
        """Test AI chatbot functionality"""
        if not self.parent_token:
            self.log_test("AI Chatbot", False, "No parent token available")
            return
        
        # Test sending a message
        message_data = {"text": "What should I eat during pregnancy?"}
        success, data, status = self.make_request('POST', '/chat/message', message_data, self.parent_token)
        
        if success and 'response' in data:
            response_length = len(data['response'])
            self.log_test("AI Chatbot Message", True, f"Got response ({response_length} chars)")
            
            # Test chat history retrieval
            success, history_data, status = self.make_request('GET', '/chat/history', token=self.parent_token)
            if success and 'history' in history_data:
                history_count = len(history_data['history'])
                self.log_test("Chat History", True, f"Retrieved {history_count} messages")
            else:
                self.log_test("Chat History", False, f"Status: {status}")
        else:
            self.log_test("AI Chatbot Message", False, f"Status: {status}, Response: {data}")

    def test_risk_prediction(self):
        """Test pregnancy risk prediction"""
        if not self.parent_token:
            self.log_test("Risk Prediction", False, "No parent token available")
            return
        
        risk_data = {
            "age": 28,
            "weight": 65.5,
            "blood_pressure_systolic": 120,
            "blood_pressure_diastolic": 80,
            "glucose_level": 90.0,
            "previous_complications": False
        }
        
        success, data, status = self.make_request('POST', '/predict-risk', risk_data, self.parent_token)
        
        if success and 'risk_level' in data:
            risk_level = data['risk_level']
            risk_score = data.get('risk_score', 0)
            self.log_test("Risk Prediction", True, f"Risk: {risk_level}, Score: {risk_score}")
        else:
            self.log_test("Risk Prediction", False, f"Status: {status}, Response: {data}")

    def test_appointment_booking(self):
        """Test appointment booking flow"""
        if not self.parent_token or not self.doctor_user:
            self.log_test("Appointment Booking", False, "Missing tokens or doctor user")
            return
        
        appointment_data = {
            "doctor_id": self.doctor_user['id'],
            "appointment_date": "2026-08-15T10:00:00",
            "address": "123 Test Street, Test City",
            "notes": "Regular checkup test"
        }
        
        success, data, status = self.make_request('POST', '/appointments/book', appointment_data, self.parent_token)
        
        if success and 'id' in data:
            appointment_id = data['id']
            self.log_test("Appointment Booking", True, f"Booked appointment: {appointment_id}")
            
            # Test appointments retrieval for parent
            success, parent_apts, status = self.make_request('GET', '/appointments', token=self.parent_token)
            if success and 'appointments' in parent_apts:
                parent_count = len(parent_apts['appointments'])
                self.log_test("Parent Appointments List", True, f"Found {parent_count} appointments")
            else:
                self.log_test("Parent Appointments List", False, f"Status: {status}")
            
            # Test appointments retrieval for doctor
            if self.doctor_token:
                success, doctor_apts, status = self.make_request('GET', '/appointments', token=self.doctor_token)
                if success and 'appointments' in doctor_apts:
                    doctor_count = len(doctor_apts['appointments'])
                    self.log_test("Doctor Appointments List", True, f"Found {doctor_count} appointments")
                else:
                    self.log_test("Doctor Appointments List", False, f"Status: {status}")
        else:
            self.log_test("Appointment Booking", False, f"Status: {status}, Response: {data}")

    def test_document_management(self):
        """Test document upload and management"""
        if not self.parent_token:
            self.log_test("Document Management", False, "No parent token available")
            return
        
        # Test document listing (should be empty initially)
        success, data, status = self.make_request('GET', '/documents', token=self.parent_token)
        
        if success and 'documents' in data:
            doc_count = len(data['documents'])
            self.log_test("Document List", True, f"Found {doc_count} documents")
        else:
            self.log_test("Document List", False, f"Status: {status}")
        
        # Test document upload (mock data since Google Drive not configured)
        upload_data = {
            "file_name": "test_document.pdf",
            "file_url": "https://example.com/test.pdf",
            "file_type": "pdf"
        }
        
        success, data, status = self.make_request('POST', '/documents/upload', upload_data, self.parent_token)
        
        if success and 'id' in data:
            doc_id = data['id']
            self.log_test("Document Upload", True, f"Uploaded document: {doc_id}")
        else:
            self.log_test("Document Upload", False, f"Status: {status}")

    def test_payment_flow(self):
        """Test Stripe payment checkout creation"""
        if not self.doctor_token:
            self.log_test("Payment Flow", False, "No doctor token available")
            return
        
        checkout_data = {
            "package_id": "monthly",
            "origin_url": "https://test.example.com"
        }
        
        success, data, status = self.make_request('POST', '/payments/checkout', checkout_data, self.doctor_token)
        
        if success and 'url' in data and 'session_id' in data:
            session_id = data['session_id']
            self.log_test("Payment Checkout", True, f"Created session: {session_id}")
        else:
            self.log_test("Payment Checkout", False, f"Status: {status}, Response: {data}")

    def test_error_handling(self):
        """Test various error conditions"""
        # Test invalid login
        invalid_login = {"email": "invalid@test.com", "password": "wrong"}
        success, data, status = self.make_request('POST', '/auth/login', invalid_login)
        
        if not success or status == 401:
            self.log_test("Invalid Login Handling", True, "Correctly rejected invalid credentials")
        else:
            self.log_test("Invalid Login Handling", False, "Should have rejected invalid login")
        
        # Test unauthorized access
        success, data, status = self.make_request('GET', '/users/profile')
        
        if not success or status == 401:
            self.log_test("Unauthorized Access Handling", True, "Correctly rejected unauthorized request")
        else:
            self.log_test("Unauthorized Access Handling", False, "Should have rejected unauthorized access")

    def run_all_tests(self):
        """Run the complete test suite"""
        print("🔄 Starting BabyCare API Test Suite")
        print("=" * 50)
        
        # Basic API tests
        self.test_api_health()
        
        # Authentication tests
        self.test_parent_signup()
        self.test_doctor_signup()
        self.test_login_flows()
        
        # Core functionality tests
        self.test_profile_access()
        self.test_doctors_list()
        self.test_ai_chatbot()
        self.test_risk_prediction()
        self.test_appointment_booking()
        self.test_document_management()
        self.test_payment_flow()
        
        # Error handling tests
        self.test_error_handling()
        
        # Print summary
        print("=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"✅ Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            failed_tests = [t for t in self.test_results if not t['success']]
            print(f"\n❌ Failed Tests ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['details']}")
            return 1

def main():
    tester = BabyCareAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())