from locust import HttpLocust, TaskSet


teamname = "a"
houses = ["Rorschach", "Behn", "Tinbergan", "Meitner"]
num = 0

rooms = ["Main Hall", "Drama Studio", "Sports Hall"]
roomnum = 0

def getlogin(l):
    l.client.get("/login")
    response = l.client.get("/login")
    print "Response status code:", response.status_code
    print "Response content:", response.content
def login(l):
    l.client.post("/login", {"_csrf": "qCd2RqSd9g", "password":"quiz2014"})
    print "Response status code:", response.status_code
    print "Response content:", response.content
def index(l):
    l.client.get("/")
        response = l.client.get("/")
    print "Response status code:", response.status_code
    print "Response content:", response.content
def staff(l):
    l.client.get("/staff?token=TDFm8KFSaL5mVjSMV9dj")
    print "Response status code:", response.status_code
    print "Response content:", response.content
def staffinput(l):
    print "Response status code:", response.status_code
    print "Response content:", response.content
    teamname += "1"
    num += 1
    if num > 3:
        num = 0
    roomnum += 1
    
    if roomnum > 2:
        roomnum = 0
    

    house = houses[num]
    room = rooms[num]
    l.client.post("/staff", {"_csrf":"qCd2RqSd9g", "teamname":teamname,"score":14,"house":house,"round":"r1","room":room})


class UserBehavior(TaskSet):
    tasks = {index:1, getlogin:1, login:1, staff:1, staffinput:1}

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait=5000
    max_wait=9000
