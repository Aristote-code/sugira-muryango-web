import io, re, collections
css = io.open("/Users/ariga/Documents/Sugira/sugira-web/style.css", encoding="utf-8").read()
OK_FS={"11px","12px","13px","13.3333px","14px","16px","18px","20px","24px","28px","40px"}
OK_R={"2px","4px","5px","6px","7px","8px","10px","12px","16px","20px","666px","50%","100%","0","0px"}
RAIL=re.compile(r"\.(rail|ni|si|navgrp|brandrow|railfoot|mark|wordmark|logomark|railtoggle|rlabel|subs)\b")
def rem(v):
    m=re.fullmatch(r"([\d.]+)rem",v); return "%gpx"%(float(m.group(1))*16) if m else v
bad=collections.defaultdict(list)
for sel,body in re.findall(r"([^{}]+)\{([^}]*)\}",css):
    sel=" ".join(sel.split())
    if sel.startswith("@") or ":root" in sel or RAIL.search(sel): continue
    for prop,ok in (("font-size",OK_FS),("border-radius",OK_R)):
        for m in re.finditer(prop+r":\s*([^;}]+)",body):
            raw=m.group(1).strip()
            if raw.startswith(("var(","calc","inherit")) or "cqw" in raw: continue
            v=rem(raw.split()[0])
            if v not in ok: bad[prop+" "+v].append(sel)
if not bad:
    print("  clean: every font-size and radius is on the ClickUp scale")
    print("  (the 16:9 wall board keeps container-relative cqw sizes by design; the rail is exempt)")
else:
    for k,v in sorted(bad.items(),key=lambda kv:-len(kv[1])):
        print("  %-26s x%-3d %s"%(k,len(v),"; ".join(v[:4])[:130]))
