"""Standalone offline security, attribution, link, and syntax verification for euro2024app-demo."""

import re
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"

FORBIDDEN_PATTERNS = [
    ("local_user_path", re.compile(r"/Users/[A-Za-z0-9._-]+")),
    ("firebase_project_id", re.compile(r"79470|firebasestorage\.googleapis\.com|firebaseio\.com|appspot\.com")),
    ("private_key_or_api_key", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----|AIza[0-9A-Za-z_-]{30,}")),
    ("old_private_repo_link", re.compile(r"github\.com/erturkeryavuz/Euro2024App")),
    ("old_private_pages_link", re.compile(r"erturkeryavuz\.github\.io/Euro2024App")),
    ("legacy_asset_src_or_href", re.compile(r"""(?:src|href)\s*=\s*["'][^"']*(?:Assets\.xcassets|GoogleService-Info|serviceAccountKey|Euro2024App/)""", re.I)),
]


class Euro2024DemoTests(unittest.TestCase):
    def test_required_files_exist(self):
        for rel in ["README.md", "docs/.nojekyll", "docs/index.html", "docs/notices.html", "docs/styles.css", "docs/app.js", "docs/data.js", "docs/THIRD-PARTY-NOTICES.md"]:
            self.assertTrue((ROOT / rel).is_file(), f"Missing required file: {rel}")

    def test_exact_sanitized_asset_counts(self):
        assets = [
            p.relative_to(DOCS).as_posix()
            for p in (DOCS / "assets").rglob("*")
            if p.is_file() and p.name != ".DS_Store"
        ]
        svgs = [a for a in assets if a.endswith(".svg")]
        jpgs = [a for a in assets if a.endswith(".jpg")]
        self.assertEqual(len(svgs), 25, f"Expected 25 original SVGs, found {len(svgs)}")
        self.assertEqual(len(jpgs), 49, f"Expected 49 attributed Wikimedia JPEGs, found {len(jpgs)}")
        self.assertEqual(len(assets), 74, f"Unexpected non-SVG/JPG assets present: {len(assets)}")

    def test_all_49_photographs_attributed_in_notices(self):
        notices_md = (DOCS / "THIRD-PARTY-NOTICES.md").read_text(encoding="utf-8")
        notices_html = (DOCS / "notices.html").read_text(encoding="utf-8")
        jpgs = sorted(
            p.relative_to(DOCS).as_posix()
            for p in (DOCS / "assets").rglob("*.jpg")
        )
        for jpg in jpgs:
            self.assertIn(f"docs/{jpg}", notices_md, f"Missing in THIRD-PARTY-NOTICES.md: {jpg}")
            self.assertIn(jpg, notices_html, f"Missing in notices.html: {jpg}")

    def test_no_private_source_directories(self):
        for forbidden_dir in ["Euro2024App", "Euro2024App.xcodeproj", "euro2024_data"]:
            self.assertFalse((ROOT / forbidden_dir).exists(), f"Forbidden directory present: {forbidden_dir}")
        for p in ROOT.rglob("*"):
            if ".git" in p.parts:
                continue
            low = p.as_posix().lower()
            for bad in ("googleservice-info", "serviceaccountkey", "assets.xcassets"):
                self.assertNotIn(bad, low, f"Forbidden filename in repo: {p.relative_to(ROOT)}")

    def test_zero_secrets_paths_or_stale_private_links(self):
        for p in ROOT.rglob("*"):
            if not p.is_file() or ".git" in p.parts or p == Path(__file__).resolve():
                continue
            if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
                continue
            text = p.read_text(encoding="utf-8", errors="replace")
            for label, pat in FORBIDDEN_PATTERNS:
                self.assertIsNone(pat.search(text), f"Forbidden pattern '{label}' matched in {p.relative_to(ROOT)}")

    def test_no_external_runtime_scripts_or_cdns_in_html(self):
        for fn in ["index.html", "notices.html"]:
            html = (DOCS / fn).read_text(encoding="utf-8")
            self.assertNotIn("fonts.googleapis.com", html)
            self.assertNotRegex(html, r'<script[^>]+src="https?://')

    def test_relative_asset_references_resolve(self):
        for fn in ["index.html", "notices.html", "data.js", "app.js"]:
            txt = (DOCS / fn).read_text(encoding="utf-8")
            for ref in re.findall(r"(?:assets/[A-Za-z0-9_./-]+\.(?:svg|jpg|jpeg|png))", txt):
                self.assertTrue((DOCS / ref).is_file(), f"Broken asset ref '{ref}' in {fn}")

    def test_js_syntax_valid(self):
        node = subprocess.run(["which", "node"], capture_output=True, text=True).stdout.strip()
        if not node:
            self.skipTest("node not installed")
        for js in ["app.js", "data.js"]:
            r = subprocess.run([node, "--check", str(DOCS / js)], capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, f"JS syntax error in {js}: {r.stderr}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
