from app import db, User, Ads, Domains, PausedAds

user = User.query.all()
ads = Ads.query.all()
domains = Domains.query.all()

db.drop_all()
db.create_all()


for i in user:
    db.session.add(i)

for i in ads:
    db.session.add(i)

for i in domains:
    db.session.add(i)

print(PausedAds.query.all())

db.session.commit()
