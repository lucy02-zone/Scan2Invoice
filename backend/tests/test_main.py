import unittest

from app.main import app
from app.services.auth_service import AuthService


class MainAppTests(unittest.TestCase):
    def test_app_imports_and_exposes_root_route(self):
        self.assertIsNotNone(app)
        self.assertTrue(any(getattr(route, "path", None) == "/" for route in app.routes))

    def test_long_passwords_are_hashed_without_error(self):
        service = AuthService(user_repository=None)  # type: ignore[arg-type]
        hashed_password = service.get_password_hash("a" * 73)

        self.assertTrue(hashed_password.startswith("$2"))


if __name__ == "__main__":
    unittest.main()
