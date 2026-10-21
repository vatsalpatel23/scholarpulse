import sys
import os
import unittest
import json

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app
from database import init_sqlite_db

class TestScholarPulseBackend(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        init_sqlite_db()

    def test_health(self):
        res = self.app.get('/health')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'online')
        self.assertIn('Vatsal Patel', data['author'])

    def test_student_login(self):
        res = self.app.post('/login', json={
            'email': 'vatsal@scholarpulse.com',
            'password': 'student123'
        })
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['role'], 'student')
        self.assertIn('access_token', data)

    def test_admin_login(self):
        res = self.app.post('/login', json={
            'email': 'admin@scholarpulse.com',
            'password': 'admin123'
        })
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['role'], 'admin')

    def test_recommendation_filtering(self):
        # First login as student to get token
        login_res = self.app.post('/login', json={
            'email': 'vatsal@scholarpulse.com',
            'password': 'student123'
        })
        token = json.loads(login_res.data)['access_token']

        # Query recommendations with student profile
        res = self.app.post(
            '/scholarships',
            headers={'Authorization': f'Bearer {token}'},
            json={
                'name': 'Test Student',
                'collegeName': 'MIT Pune',
                'marks': 78,
                'income': 180000,
                'education': 12,
                'caste': 'OBC',
                'gender': 'Female'
            }
        )
        self.assertEqual(res.status_code, 200)
        scholarships = json.loads(res.data)
        self.assertIsInstance(scholarships, list)
        self.assertGreater(len(scholarships), 0)
        # Verify first item has match_percentage and recommendation_score
        first = scholarships[0]
        self.assertIn('recommendation_score', first)
        self.assertIn('match_percentage', first)
        self.assertIn('dimension_breakdown', first)
        print(f"[Test Passed] Found {len(scholarships)} matching scholarships. Top match: {first['sclrname']} ({first['match_percentage']}%)")

if __name__ == '__main__':
    unittest.main()
