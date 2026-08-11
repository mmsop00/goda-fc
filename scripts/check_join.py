import openpyxl
from datetime import datetime

wb = openpyxl.load_workbook(r'C:\Users\mmsop\OneDrive\Desktop\GODA FC\GODA FC - Danh sách thành viên.xlsx', data_only=True)
ws = wb['Thông tin cầu thủ']

for r in ws.iter_rows(min_row=2, values_only=True):
    if not r[1]: continue
    name = str(r[1]).strip()
    
    # Join date
    jr = r[17]
    if jr:
        if isinstance(jr, datetime):
            jy = jr.year
            join_str = jr.strftime('%d/%m/%Y')
        else:
            jstr = str(jr).strip()
            try:
                jy = int(jstr[:4])
                join_str = jstr[:10]
            except:
                jy = 0
                join_str = 'NONE'
    else:
        jy = 0
        join_str = 'NONE'
    
    # Birthday
    bday_raw = r[3]
    if bday_raw:
        if isinstance(bday_raw, datetime):
            bday = bday_raw.strftime('%d/%m/%Y')
        else:
            bday_str = str(bday_raw).strip()
            try:
                if '/' in bday_str and len(bday_str.split('/')) >= 3:
                    parts = bday_str.split('/')
                    bday = f"{parts[0].zfill(2)}/{parts[1].zfill(2)}/{parts[2]}"
                elif '-' in bday_str:
                    dt = datetime.strptime(bday_str[:10], '%Y-%m-%d')
                    bday = dt.strftime('%d/%m/%Y')
                else:
                    bday = bday_str
            except:
                bday = bday_str
    else:
        bday = 'NONE'
    
    num = int(r[7]) if r[7] else 0
    pos = str(r[12]).strip() if r[12] else ''
    role = str(r[10]).strip() if r[10] else ''
    
    print(f"{name:25s} | join={join_str:15s} (year={jy}) | bday={bday:15s} | #{num} | {pos} | {role}")
