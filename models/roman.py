a = 1564

d = {
    1:'I',
    4:'IV',
    5:'V',
    9:'IX',
    10:'X',
    40:'XL',
    50:'L',
    90:'XC',
    100:'C',
    400:'CD',
    500:'D',
    900:'CM',
    1000:'M'
}
if a in range(1, 5000):
    ans = ""
    if a in range(1000, 5000):
        ans += d[1000] * (a // 1000)
        a%=1000
    if a in range(900,1000):
        ans += d[900]
        a-=900
    if a in range(500, 900):
        ans += d[500]
        a-=500
    if a in range(400, 500):
        ans += d[400]
        a-=400
    if a in range(100, 400):
        ans += d[100] * (a // 100)
        a%=100
    if a in range(90, 100):
        ans += d[90]
        a-=90
    if a in range(50, 90):
        ans += d[50]
        a-=50
    if a in range(40, 50):
        ans += d[40]
        a-=40
    if a in range(10, 40):
        ans += d[10] * (a // 10)
        a%=10
    if a in range(9, 10):
        ans += d[9]
        a-=9
    if a in range(5, 9):
        ans += d[5]
        a-=5
    if a in range(4, 5):
        ans += d[4] 
        a-=4
    if a in range(1, 4):
        ans += d[1] * (a // 1)
    print(ans)
else:
    print('Not in range')

