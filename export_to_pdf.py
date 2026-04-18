#!/usr/bin/env python3
"""
Simple PDF Export - Convert Markdown to PDF using Canvas
"""

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.units import cm, inch
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
from pathlib import Path
import textwrap

def create_pdf_from_markdown(md_filepath, pdf_filepath):
    """Create PDF from markdown file"""
    print(f"📄 Converting: {md_filepath.name}...")
    
    # Read markdown
    with open(md_filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Setup PDF
    c = canvas.Canvas(str(pdf_filepath), pagesize=A4)
    width, height = A4
    
    # Margins and dimensions
    left_margin = 0.5 * inch
    right_margin = 0.5 * inch
    top_margin = 0.75 * inch
    bottom_margin = 0.75 * inch
    
    y_position = height - top_margin
    line_height = 12
    max_width = width - left_margin - right_margin
    
    # Font setup
    c.setFont("Helvetica", 10)
    
    # Process lines
    lines = content.split('\n')
    page_num = 1
    
    for line in lines:
        # Skip empty lines
        if not line.strip():
            y_position -= line_height * 0.5
            continue
        
        # Handle titles
        if line.startswith('# '):
            text = line.replace('# ', '').strip()
            c.setFont("Helvetica-Bold", 16)
            c.drawString(left_margin, y_position, text)
            c.setFont("Helvetica", 10)
            y_position -= line_height * 2
            
        elif line.startswith('## '):
            text = line.replace('## ', '').strip()
            c.setFont("Helvetica-Bold", 13)
            c.drawString(left_margin, y_position, text)
            c.setFont("Helvetica", 10)
            y_position -= line_height * 1.5
            
        elif line.startswith('### '):
            text = line.replace('### ', '').strip()
            c.setFont("Helvetica-Bold", 11)
            c.drawString(left_margin, y_position, text)
            c.setFont("Helvetica", 10)
            y_position -= line_height * 1.2
            
        # Skip table lines for simple version
        elif '|' in line:
            continue
            
        # Regular text
        else:
            # Clean markdown syntax
            text = line.strip()
            text = text.replace('**', '').replace('__', '')
            text = text.replace('_', '').replace('`', '')
            text = text.replace('✅', '[OK]').replace('❌', '[NO]')
            text = text.replace('🚨', '[!]').replace('⚠️', '[!]')
            text = text.replace('📄', '[DOC]').replace('📊', '[DATA]')
            
            if text:
                # Wrap text if needed
                wrapped = textwrap.wrap(text, width=90)
                for wrapped_line in wrapped:
                    c.drawString(left_margin, y_position, wrapped_line)
                    y_position -= line_height
        
        # Check if we need a new page
        if y_position < bottom_margin:
            c.showPage()
            page_num += 1
            y_position = height - top_margin
            c.setFont("Helvetica", 9)
            c.drawString(left_margin, bottom_margin - 15, f"Page {page_num}")
            c.setFont("Helvetica", 10)
    
    # Finalize
    try:
        c.save()
        print(f"   ✅ PDF créé: {pdf_filepath.name}")
        return True
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    print("=" * 80)
    print("PDF EXPORT - Conversion Markdown → PDF")
    print("=" * 80)
    
    data_dir = Path("data")
    report_dir = Path("reports")
    report_dir.mkdir(exist_ok=True)
    
    today = datetime.now().strftime("%Y-%m-%d")
    
    files_to_convert = [
        (data_dir / "strategic_note_DZD_FINAL.md", report_dir / f"Strategic_Note_DZD_{today}.pdf"),
        (data_dir / "STRATEGY_COMPARISON_DZD.md", report_dir / f"Strategy_Comparison_DZD_{today}.pdf"),
    ]
    
    success_count = 0
    print()
    
    for md_file, pdf_file in files_to_convert:
        if md_file.exists():
            if create_pdf_from_markdown(md_file, pdf_file):
                success_count += 1
        else:
            print(f"⚠️  File not found: {md_file.name}")
    
    print("\n" + "=" * 80)
    print(f"✅ EXPORT COMPLETED: {success_count}/{len(files_to_convert)} files")
    print("=" * 80)
    print(f"\n📁 Location: {report_dir.absolute()}\n")
    
    # List generated PDFs
    print("📋 Generated PDFs:")
    for pdf_file in sorted(report_dir.glob("*.pdf")):
        size_kb = pdf_file.stat().st_size / 1024
        print(f"   ├─ {pdf_file.name:<50} ({size_kb:.1f} KB)")
