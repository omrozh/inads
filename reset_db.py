from app import db, User, Ads, Domains

user = User.query.all()
domains = Domains.query.all()

db.drop_all()
db.create_all()


for i in user:
    db.session.add(i)

for i in domains:
    db.session.add(i)

db.session.commit()
