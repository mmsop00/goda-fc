import openpyxl
from datetime import datetime

wb = openpyxl.load_workbook(r'C:\Users\mmsop\OneDrive\Desktop\GODA FC\GODA FC - Danh sách thành viên.xlsx', data_only=True)
ws = wb['Thông tin cầu thủ']

for r in ws.iter_rows(min_row=2, values_only=True):
    if not r[1]: continue
    name = str(r[1]).strip()
    
    # Parse birthday to DD/MM/YYYY
    bday_raw = r[3]
    if bday_raw:
        if isinstance(bday_raw, datetime):
            bday = bday_raw.strftime('%d/%m/%Y')
        else:
            bday_str = str(bday_raw).strip()
            # Try various formats
            try:
                if '/' in bday_str:
                    parts = bday_str.split('/')
                    if len(parts) == 3 and len(parts[2]) == 4:
                        bday = f"{parts[0].zfill(2)}/{parts[1].zfill(2)}/{parts[2]}"
                    elif len(parts) == 2:
                        bday = f"{parts[0].zfill(2)}/{parts[1].zfill(2)}/????"
                    else:
                        bday = bday_str
                elif '-' in bday_str:
                    dt = datetime.strptime(bday_str[:10], '%Y-%m-%d')
                    bday = dt.strftime('%d/%m/%Y')
                else:
                    bday = bday_str
            except:
                bday = bday_str
    else:
        bday = '??/??/????'
    
    num = int(r[7]) if r[7] else 0
    pos = str(r[12]).strip() if r[12] else ''
    role = str(r[10]).strip() if r[10] else ''
    
    print(f"{name:25s} | bday={bday:15s} | #{num} | {pos:10s} | {role}")
