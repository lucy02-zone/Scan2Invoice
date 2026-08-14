import sys
from pathlib import Path

# Bootstrap backend directory into sys.path
backend_dir = str(Path(__file__).resolve().parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
