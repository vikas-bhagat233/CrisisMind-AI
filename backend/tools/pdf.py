"""
Generates a downloadable PDF export of a CrisisReport using reportlab.
Kept intentionally simple/plain-text so it renders reliably without extra
font/image dependencies.
"""
import io

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas


def render_report_pdf(report: dict) -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=LETTER)
    width, height = LETTER
    y = height - 50

    def line(text: str, size: int = 11, leading: int = 16, bold: bool = False):
        nonlocal y
        if y < 60:
            c.showPage()
            y = height - 50
        c.setFont("Helvetica-Bold" if bold else "Helvetica", size)
        c.drawString(50, y, text[:110])
        y -= leading

    line("CrisisMind AI - Incident Report", size=16, bold=True, leading=26)
    line(f"Crisis type: {report.get('crisis_type', 'n/a')}")
    line(f"Location: {report.get('location', 'n/a')}")
    line(f"Risk level: {report.get('risk', {}).get('level', 'n/a')}")
    y -= 6
    line("Situation Summary", size=13, bold=True, leading=20)
    for chunk in _wrap(report.get("situation_summary", ""), 95):
        line(chunk)
    y -= 6
    line("Immediate Actions", size=13, bold=True, leading=20)
    for item in report.get("action_plan", []):
        line(f"- {item}")
    y -= 6
    line("Emergency Checklist", size=13, bold=True, leading=20)
    for item in report.get("emergency_checklist", []):
        line(f"[ ] {item}")

    c.showPage()
    c.save()
    return buf.getvalue()


def _wrap(text: str, width: int) -> list[str]:
    words = text.split()
    lines, current = [], ""
    for w in words:
        if len(current) + len(w) + 1 > width:
            lines.append(current)
            current = w
        else:
            current = f"{current} {w}".strip()
    if current:
        lines.append(current)
    return lines or [""]
