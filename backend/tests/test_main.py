import unittest

from app.main import app


class MainAppTests(unittest.TestCase):
    def test_app_imports_and_exposes_root_route(self):
        self.assertIsNotNone(app)
        self.assertTrue(any(getattr(route, "path", None) == "/" for route in app.routes))


if __name__ == "__main__":
    unittest.main()
