import openpyxl
from datetime import datetime

wb = openpyxl.load_workbook(r'C:\Users\mmsop\OneDrive\Desktop\GODA FC\GODA FC - Danh sách thành viên.xlsx', data_only=True)
ws = wb['Thông tin cầu thủ']

print(f"{'Name':<25s} {'XLSX Birthday':<22s} {'Formatted'}")
print("-" * 80)

for r in ws.iter_rows(min_row=2, values_only=True):
    if not r[1]:
        continue
    name = str(r[1]).strip()
    
    # Column 3 = birthday
    bday_raw = r[3]
    bday_str = 'EMPTY'
    
    if bday_raw:
        if isinstance(bday_raw, datetime):
            bday_str = bday_raw.strftime('%d/%m/%Y')
        else:
            raw = str(bday_raw).strip()
            try:
                if '/' in raw:
                    parts = raw.split('/')
                    bday_str = f"{parts[0].zfill(2)}/{parts[1].zfill(2)}/{parts[2]}"
                elif '-' in raw:
                    dt = datetime.strptime(raw[:10], '%Y-%m-%d')
                    bday_str = dt.strftime('%d/%m/%Y')
                else:
                    bday_str = raw[:10]
            except:
                bday_str = raw[:10]
    
    print(f"{name:<25s} {str(bday_raw):<22s} {bday_str}")
