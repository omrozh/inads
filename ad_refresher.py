from app import db, Ads

all_ad_ids = []
all_ads = []

for i in Ads.query.all():
    all_ads.append(i)
    all_ad_ids.append(i.id)

for i in all_ad_ids:
    db.session.delete(Ads.query.get(i))

for i in all_ads:
    db.session.add(i)

db.session.commit()
