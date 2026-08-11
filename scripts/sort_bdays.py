# Members with full birthdays and stats
members = [
  ('Lê Thanh Hà','Chủ tịch','Hậu vệ',7,187,8,22,3,'08/01/1975',2009,'Đội trưởng'),
  ('Trần Đình Thanh','Thanh','Tiền vệ',16,210,38,45,4,'15/10/1969',2018,'Đội phó'),
  ('Hoàng Trọng Nội','Nội','Hậu vệ',11,88,4,15,1,'23/05/1979',0,'Đội phó'),
  ('Huy Quang','Quang','Hậu vệ',3,95,6,18,2,'01/01/1970',0,'Đội phó'),
  ('Vũ Đăng Tuấn','Trâu Đồ Sơn','Tiền vệ',80,198,42,55,4,'02/08/1980',1994,'Đang thi đấu'),
  ('Phan Trần Phương','Thầy giáo Phương','Hậu vệ',5,142,15,27,2,'14/03/1976',2018,'Đang thi đấu'),
  ('Nguyễn Văn Mạnh','Mạnh','Hậu vệ',77,245,38,48,3,'28/08/1976',2015,'Đang thi đấu'),
  ('Phan Hồng Thái','Thái','Tiền vệ',38,220,78,28,5,'02/03/1995',2016,'Đang thi đấu'),
  ('Nguyễn Minh Quang','Quang','Tiền vệ',2,195,68,32,5,'26/09/2003',2017,'Đang thi đấu'),
  ('Nguyễn An','An','Thủ môn',1,155,22,42,3,'10/05/1984',2020,'Đang thi đấu'),
  ('Nguyễn Khắc Vĩnh','Vĩnh','Hậu vệ',6,145,16,28,2,'18/07/1980',2023,'Đang thi đấu'),
  ('Vũ Ngọc Sơn','Xuân Son','Tiền vệ',20,98,26,34,3,'20/01/1993',2025,'Đang thi đấu'),
  ('Đào Thanh Tùng','Tùng Lò Gạch','Thủ môn',8,168,3,8,2,'18/03/1984',2025,'Đang thi đấu'),
  ('Chu Triệu Thành','Thầy giáo','Tiền vệ',56,156,15,28,2,'25/02/1956',0,'Đang thi đấu'),
  ('Nguyễn Văn Bình','Bình','Tiền vệ',55,130,12,21,1,'19/04/1955',0,'Đang thi đấu'),
  ('Đinh Thái Bình','Bình','Tiền vệ',10,128,25,52,3,'18/10/1979',0,'Đang thi đấu'),
  ('Phạm Trung Thông','Thông','Hậu vệ',33,230,6,20,2,'08/07/1967',0,'Đang thi đấu'),
  ('Trần Nguyên Bá','Bá Nghệ','Tiền đạo',19,72,45,16,4,'09/04/1994',0,'Đang thi đấu'),
  ('Phạm Duy Thắng','Thành Toldo','Tiền đạo',13,82,55,18,4,'25/11/1972',0,'Đang thi đấu'),
  ('Vũ Thái Thịnh','Thịnh tỉnh táo','Tiền vệ',17,85,18,25,2,'17/02/1979',0,'Đang thi đấu'),
  ('Nguyễn Mạnh Tuấn','Tuấn','Hậu vệ',23,92,8,19,1,'21/05/1991',0,'Đang thi đấu'),
  ('Phùng Văn Lục','Lục Cờ Đỏ','Hậu vệ',16,88,10,20,2,'05/08/1988',0,'Đang thi đấu'),
  ('Trương Quang Huy','Huy','Hậu vệ',4,78,7,14,2,'21/06/1987',0,'Đang thi đấu'),
  ('Nguyễn Việt Dũng','Dũng','Hậu vệ',76,65,3,10,1,'27/06/1976',0,'Đang thi đấu'),
  ('Trần Tam Thịnh','Thịnh','Tiền vệ',22,68,14,22,1,'16/08/1970',0,'Đang thi đấu'),
  ('Trần Tiến Dũng','Tiến Dũng','Hậu vệ',100,52,2,8,1,'04/10/1985',0,'Đang thi đấu'),
  ('Nguyễn Tiến Dũng','Tiến Dũng','Hậu vệ',0,45,1,6,0,'25/06/1958',0,'Đang thi đấu'),
]

from datetime import datetime

def role_sort(s):
    if s == 'Đội trưởng': return 0
    if s == 'Đội phó': return 1
    return 2

def parse_date(d):
    try:
        return datetime.strptime(d, '%d/%m/%Y')
    except:
        return datetime(9999, 1, 1)

# Sort: role -> birth date (oldest first = earliest)
members.sort(key=lambda m: (role_sort(m[10]), parse_date(m[8])))

for i, m in enumerate(members):
    name,nick,pos,num,mat,gol,ast,mvp,bday,jy,st = m
    av = '""'
    if 'Sơn' in name and 'Ngọc' in name:
        av = '"https://drive.google.com/uc?export=view&id=1vAWvXyQxnNuTMbQHuJCuYHz4b2xXq0ak"'
    comment = ''
    if st == 'Đội trưởng': comment = ' // ── Đội trưởng ──'
    elif st == 'Đội phó': comment = ' // ── Đội phó ──'
    print(f'  {{ id: "m-{i+1:03d}", name: "{name}", nickname: "{nick}", position: "{pos}", number: {num}, avatarUrl: {av}, matches: {mat}, goals: {gol}, assists: {ast}, mvp: {mvp}, birthday: "{bday}", joinYear: {jy}, status: "{st}" }},{comment}')
