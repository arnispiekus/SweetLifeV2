"""Composio SDK helpers shared by all sweep scripts."""
import os
from composio import Composio

# Mapping of toolkit -> the user_id that owns the active connection
USERS = {
    "ruta_mum_drive":   ("googledrive",  "Ruta - Mum"),
    "sweetlife_drive":  ("googledrive",  "Sweet Life Work"),
    "ruta_photos":      ("googlephotos", "Ruta Personal"),
    "sweetlife_canva":  ("canva",        "Ruts - Sweet Life"),
    "sweetlife_ig":     ("instagram",    "Sweet Life"),
}

_composio = None
def client() -> Composio:
    global _composio
    if _composio is None:
        _composio = Composio(api_key=os.environ["COMPOSIO_API_KEY"])
    return _composio

def call(slug: str, user_id: str, **args) -> dict:
    r = client().tools.execute(
        slug, user_id=user_id, arguments=args, dangerously_skip_version_check=True,
    )
    if not isinstance(r, dict) or not r.get("successful", False):
        raise RuntimeError(f"{slug} failed: {str(r)[:300]}")
    return r.get("data", {})
