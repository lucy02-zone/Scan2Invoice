import sys
from pathlib import Path

# Automatically ensure parent directory of 'app' is in sys.path
_backend_dir = str(Path(__file__).resolve().parent.parent)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)
