#!/usr/bin/env python3
"""Check that every font size and radius lands on the ClickUp token scale.

Usage:  audit-tokens.py [style.css]

Exempt by design:
  - the 16:9 wall board, which sizes in container units so it scales with the display

The navigation rail used to be exempt too, "because it keeps its own values".
It kept 13.12px, 11.2px, 16.8px, 10.56px and a 9px radius — rem fractions that
no other part of the product used. An exemption is how a design system drifts
without anyone choosing to, so the rail is checked like everything else.

Exits 1 if anything has drifted.
"""
import io, re, sys, collections

PATH = sys.argv[1] if len(sys.argv) > 1 else "style.css"
OK_FS = {"11px", "12px", "13px", "13.3333px", "14px", "16px", "18px", "20px", "24px", "28px", "40px"}
OK_R = {"2px", "4px", "5px", "6px", "7px", "8px", "10px", "12px", "16px", "20px", "666px", "50%", "100%", "0", "0px"}
RAIL = re.compile(r"^\Z")  # nothing is exempt by selector any more


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
    if not bad:
        print("  tokens: every font-size and radius is on the ClickUp scale")
        return 0
    print("  tokens: %d declarations have drifted off the scale" % sum(len(v) for v in bad.values()))
    for k, sels in sorted(bad.items(), key=lambda kv: -len(kv[1])):
        print("    %-26s x%-3d %s" % (k, len(sels), "; ".join(sels[:4])[:120]))
    return 1


if __name__ == "__main__":
    sys.exit(main())
