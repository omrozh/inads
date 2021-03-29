from app import db, User, Ads, Domains, PausedAds

db.session.commit()

print("Process Started")

user = User.query.all()
print("Complete 1")
ads = Ads.query.all()
print("Complete 2")
domains = Domains.query.all()
print("Complete 3")

db.drop_all()
print("Complete 4")
db.create_all()
print("Complete 5")

for i in user:
    db.session.add(i)

print("Complete 6")

for i in ads:
    db.session.add(i)
print("Complete 7")

for i in domains:
    db.session.add(i)
print("Complete 8")

print(PausedAds.query.all())
print("Process Completed")

db.session.commit()
print("Process Exit")
