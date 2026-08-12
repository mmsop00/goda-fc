import openpyxl
from datetime import datetime

wb = openpyxl.load_workbook(r'C:\Users\mmsop\OneDrive\Desktop\GODA FC\GODA FC - Danh sách thành viên.xlsx', data_only=True)
ws = wb['Thông tin cầu thủ']

print(f"{'Name':<25s} {'Raw Value':<20s} {'Join Date':<20s} {'JoinYear'}")
print("-" * 80)

for r in ws.iter_rows(min_row=2, values_only=True):
    if not r[1]:
        continue
    name = str(r[1]).strip()
    
    jr = r[17]
    join_str = ''
    join_year = 0
    
    if jr is not None:
        raw = str(jr).strip()
        if isinstance(jr, datetime):
            join_str = jr.strftime('%d/%m/%Y')
            join_year = jr.year
        elif isinstance(jr, (int, float)):
            # Float like 1994.0 -> 1994
            if jr == int(jr):
                join_str = str(int(jr))
                join_year = int(jr)
            else:
                join_str = str(jr)
        else:
            jstr = str(jr).strip()
            try:
                if '/' in jstr:
                    parts = jstr.split('/')
                    if len(parts) == 3:
                        join_str = f"{parts[0].zfill(2)}/{parts[1].zfill(2)}/{parts[2]}"
                        join_year = int(parts[2]) if len(parts[2]) == 4 else 0
                elif '-' in jstr:
                    dt = datetime.strptime(jstr[:10], '%Y-%m-%d')
                    join_str = dt.strftime('%d/%m/%Y')
                    join_year = dt.year
                elif jstr.replace('.','').isdigit():
                    yr = int(float(jstr))
                    join_str = str(yr)
                    join_year = yr
                else:
                    join_str = jstr[:20]
            except:
                join_str = jstr[:20]
    
    display = join_str if join_str else 'EMPTY'
    print(f"{name:<25s} {str(jr):<20s} {display:<20s} {join_year}")
