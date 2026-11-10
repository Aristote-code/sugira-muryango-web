#!/usr/bin/env python3
"""Check that every measurement lands on a ClickUp token.

Usage:  audit-tokens.py [style.css]

Exempt by design:
  - the 16:9 wall board, which sizes in container units so it scales with the display

The navigation rail used to be exempt too, "because it keeps its own values".
It kept 13.12px, 11.2px, 16.8px, 10.56px and a 9px radius — rem fractions that
no other part of the product used. An exemption is how a design system drifts
without anyone choosing to, so the rail is checked like everything else.

Exits 1 if anything has drifted.
"""
import io, os, re, sys, collections

PATH = sys.argv[1] if len(sys.argv) > 1 else "style.css"
OK_FS = {"11px", "12px", "13px", "13.3333px", "14px", "16px", "18px", "20px", "24px", "28px", "40px"}
OK_R = {"2px", "4px", "5px", "6px", "7px", "8px", "10px", "12px", "16px", "20px", "666px", "50%", "100%", "0", "0px"}
RAIL = re.compile(r"^\Z")  # nothing is exempt by selector any more

# Padding, margin and gap answer to two scales ClickUp publishes and tokens.css
# imports: --space-1..12 on the 4px grid, and --dimension-N for the measured
# half-steps its own components use (Button's 7, IconButton's 3, TaskRow's 10).
# Every one of the app's 556 spacing values landed on one of them already; they
# were written as numbers, which is how a scale stops being a scale. The check
# is on the spelling, because the numbers were never the problem.
SPACING = re.compile(r"^(?:margin|padding|gap|row-gap|column-gap|inset)"
                     r"(?:-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?)?$")
PX = re.compile(r"(?<![\w.-])-?\d*\.?\d+px\b")


def as_px(v):
    m = re.fullmatch(r"([\d.]+)rem", v)
    return "%gpx" % (float(m.group(1)) * 16) if m else v


def main():
    css = io.open(PATH, encoding="utf-8").read()
    bad = collections.defaultdict(list)
    for sel, body in re.findall(r"([^{}]+)\{([^}]*)\}", css):
        sel = " ".join(sel.split())
        if sel.startswith("@") or ":root" in sel or RAIL.search(sel):
            continue
        for decl in body.split(";"):
            if ":" not in decl:
                continue
            prop, _, raw = decl.partition(":")
            if not SPACING.fullmatch(prop.strip().lower()):
                continue
            outside = re.sub(r"var\([^()]*\)", "", raw)
            for lit in PX.findall(outside):
                bad["spacing " + prop.strip() + ":" + raw.strip()[:40]].append(sel)
                break

        for prop, ok in (("font-size", OK_FS), ("border-radius", OK_R)):
            for m in re.finditer(prop + r":\s*([^;}]+)", body):
                raw = m.group(1).strip()
                if raw.startswith(("var(", "inherit")) or "cqw" in raw:
                    continue
                # calc() on a token is how a 9px radius got past this: the value
                # resolved off the scale but never looked like a literal.
                if raw.startswith("calc"):
                    bad[prop + " " + raw].append(sel)
                    continue
                # every value, not just the first — "0 0 9px 9px" read as "0".
                for part in raw.split():
                    if as_px(part) not in ok:
                        bad[prop + " " + raw].append(sel)
                        break
    here = os.path.dirname(os.path.abspath(PATH))
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    rc = resolves(PATH, [os.path.join(here, "tokens.css"),
                         os.path.join(root, "tokens.css")])
    if not bad:
        print("  tokens: every size, radius and measurement is a token")
        return rc
    print("  tokens: %d declarations are written as numbers, not tokens"
          % sum(len(v) for v in bad.values()))
    for k, sels in sorted(bad.items(), key=lambda kv: -len(kv[1])):
        print("    %-26s x%-3d %s" % (k, len(sels), "; ".join(sels[:4])[:120]))
    return 1



def resolves(css_path, token_paths):
    """Every var() in the stylesheet names a custom property that exists.

    var() with no fallback resolves to nothing when the name is wrong, so the
    declaration is dropped and the rule looks like it was never written. The
    size audit above would pass a --space-13 that does not exist for exactly
    the same reason this missed a colour."""
    used = set()
    css = io.open(css_path, encoding="utf-8").read()
    # a fallback always resolves, so the name is allowed to be absent
    for m in re.finditer(r"var\(\s*(--[A-Za-z0-9_-]+)\s*([,)])", css):
        if m.group(2) == ")":
            used.add(m.group(1))
    have = set()
    found = False
    for p in [css_path] + list(token_paths):
        try:
            txt = io.open(p, encoding="utf-8").read()
        except IOError:
            continue
        if p != css_path:
            found = True
        for m in re.finditer(r"(--[A-Za-z0-9_-]+)\s*:", txt):
            have.add(m.group(1))
    if not found:
        print("  tokens: no tokens.css to check var() names against")
        return 0
    missing = sorted(used - have)
    if not missing:
        print("  tokens: every var() names a token that exists")
        return 0
    print("  tokens: %d var() names do not resolve" % len(missing))
    for name in missing[:12]:
        print("    %s" % name)
    return 1

if __name__ == "__main__":
    sys.exit(main())
