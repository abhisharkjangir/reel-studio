"""Minimal client for the Vercel Blob REST API — enough for list / get / put / patch.

Vercel Blob stores files publicly if `access=public`. The read token in
`BLOB_READ_WRITE_TOKEN` is required for list/put/delete via the REST API.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

import requests

API_BASE = "https://blob.vercel-storage.com"


def _token() -> str:
    t = os.environ.get("BLOB_READ_WRITE_TOKEN")
    if not t:
        raise RuntimeError("BLOB_READ_WRITE_TOKEN env var is required.")
    return t


def _store_id() -> str:
    # Token format: vercel_blob_rw_<storeId>_<secret>
    t = _token()
    parts = t.split("_")
    if len(parts) < 5:
        raise RuntimeError("Unexpected BLOB_READ_WRITE_TOKEN shape.")
    return parts[3]


def list_(prefix: str) -> list[dict[str, Any]]:
    resp = requests.get(
        f"{API_BASE}/",
        params={"prefix": prefix, "limit": 1000},
        headers={"authorization": f"Bearer {_token()}"},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json().get("blobs", [])


def get_json(pathname: str) -> dict | None:
    blobs = list_(pathname)
    for b in blobs:
        if b.get("pathname") == pathname:
            r = requests.get(b["downloadUrl"], timeout=30)
            if r.status_code == 200:
                return r.json()
    return None


def put_json(pathname: str, data: dict) -> str:
    body = json.dumps(data, indent=2).encode("utf-8")
    return put_bytes(pathname, body, "application/json")


def put_bytes(pathname: str, body: bytes, content_type: str) -> str:
    resp = requests.put(
        f"{API_BASE}/{pathname}",
        data=body,
        headers={
            "authorization": f"Bearer {_token()}",
            "x-content-type": content_type,
            "x-api-version": "7",
            "x-add-random-suffix": "0",
            "x-allow-overwrite": "1",
            "access": "public",
        },
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json().get("url", "")


def put_file(pathname: str, path: Path, content_type: str) -> str:
    return put_bytes(pathname, path.read_bytes(), content_type)
