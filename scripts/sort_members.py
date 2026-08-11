import re
from datetime import datetime

data = [
  ('Lê Thanh Hà','Chủ tịch','Hậu vệ',7,187,8,22,3,'1975-01-08',2009,'Đội trưởng'),
  ('Trần Đình Thanh','Thanh','Tiền vệ',16,210,38,45,4,'1969-10-15',2018,'Đội phó'),
  ('Hoàng Trọng Nội','Nội','Hậu vệ',11,88,4,15,1,'1979-05-23',0,'Đội phó'),
  ('Huy Quang','Quang','Hậu vệ',3,95,6,18,2,'1970-01-01',0,'Đội phó'),
  ('Vũ Đăng Tuấn','Trâu Đồ Sơn','Tiền vệ',80,198,42,55,4,'1980-08-02',1994,'Đang thi đấu'),
  ('Phan Trần Phương','Thầy giáo Phương','Hậu vệ',5,142,15,27,2,'1976-03-14',2018,'Đang thi đấu'),
  ('Nguyễn Văn Mạnh','Mạnh','Hậu vệ',77,245,38,48,3,'1976-08-28',2015,'Đang thi đấu'),
  ('Phan Hồng Thái','Thái','Tiền vệ',38,220,78,28,5,'1995-03-02',2016,'Đang thi đấu'),
  ('Nguyễn Minh Quang','Quang','Tiền vệ',2,195,68,32,5,'2003-09-26',2017,'Đang thi đấu'),
  ('Nguyễn An','An','Thủ môn',1,155,22,42,3,'1984-05-10',2020,'Đang thi đấu'),
  ('Nguyễn Khắc Vĩnh','Vĩnh','Hậu vệ',6,145,16,28,2,'1980-07-18',2023,'Đang thi đấu'),
  ('Vũ Ngọc Sơn','Xuân Son','Tiền vệ',20,98,26,34,3,'1993-01-20',2025,'Đang thi đấu'),
  ('Đào Thanh Tùng','Tùng Lò Gạch','Thủ môn',8,168,3,8,2,'1984-03-18',2025,'Đang thi đấu'),
  ('Chu Triệu Thành','Thầy giáo','Tiền vệ',56,156,15,28,2,'1956-02-25',0,'Đang thi đấu'),
  ('Nguyễn Văn Bình','Bình','Tiền vệ',55,130,12,21,1,'1955-04-19',0,'Đang thi đấu'),
  ('Đinh Thái Bình','Bình','Tiền vệ',10,128,25,52,3,'1979-10-18',0,'Đang thi đấu'),
  ('Phạm Trung Thông','Thông','Hậu vệ',33,230,6,20,2,'1967-07-08',0,'Đang thi đấu'),
  ('Trần Nguyên Bá','Bá Nghệ','Tiền đạo',19,72,45,16,4,'1994-04-09',0,'Đang thi đấu'),
  ('Phạm Duy Thắng','Thành Toldo','Tiền đạo',13,82,55,18,4,'1972-11-25',0,'Đang thi đấu'),
  ('Vũ Thái Thịnh','Thịnh tỉnh táo','Tiền vệ',17,85,18,25,2,'1979-02-17',0,'Đang thi đấu'),
  ('Nguyễn Mạnh Tuấn','Tuấn','Hậu vệ',23,92,8,19,1,'1991-05-21',0,'Đang thi đấu'),
  ('Phùng Văn Lục','Lục Cờ Đỏ','Hậu vệ',16,88,10,20,2,'1988-08-05',0,'Đang thi đấu'),
  ('Trương Quang Huy','Huy','Hậu vệ',4,78,7,14,2,'1987-06-21',0,'Đang thi đấu'),
  ('Nguyễn Việt Dũng','Dũng','Hậu vệ',76,65,3,10,1,'1976-06-27',0,'Đang thi đấu'),
  ('Trần Tam Thịnh','Thịnh','Tiền vệ',22,68,14,22,1,'1970-08-16',0,'Đang thi đấu'),
  ('Trần Tiến Dũng','Tiến Dũng','Hậu vệ',100,52,2,8,1,'1985-10-04',0,'Đang thi đấu'),
  ('Nguyễn Tiến Dũng','Tiến Dũng','Hậu vệ',0,45,1,6,0,'1958-06-25',0,'Đang thi đấu'),
]

def role_sort(s):
    if s == 'Đội trưởng': return 0
    if s == 'Đội phó': return 1
    return 2

data.sort(key=lambda m: (role_sort(m[10]), m[8]))

for i, m in enumerate(data):
    name,nick,pos,num,mat,gol,ast,mvp,bday,jy,st = m
    bday_ddmm = datetime.strptime(bday, '%Y-%m-%d').strftime('%d/%m')
    comment = ''
    if st == 'Đội trưởng': comment = ' // Đội trưởng'
    elif st == 'Đội phó': comment = ' // Đội phó'
    av = '""'
    if 'Sơn' in name and 'Ngọc' in name:
        av = '"https://drive.google.com/uc?export=view&id=1vAWvXyQxnNuTMbQHuJCuYHz4b2xXq0ak"'
    print(f'  {{ id: "m-{i+1:03d}", name: "{name}", nickname: "{nick}", position: "{pos}", number: {num}, avatarUrl: {av}, matches: {mat}, goals: {gol}, assists: {ast}, mvp: {mvp}, birthday: "{bday_ddmm}", joinYear: {jy}, status: "{st}" }}, // {bday} {comment}')
