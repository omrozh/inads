from app import db, Ads
import time

all_ad_ids = []
all_ads = []

for i in Ads.query.all():
    all_ads.append(i)
    all_ad_ids.append(i.id)

for i in all_ad_ids:
    db.session.delete(Ads.query.get(i))

db.session.commit()

time.sleep(5)

for i in all_ads:
    db.session.add(Ads(fileurl=i.fileurl,
                       keywords=i.keywords,
                       budget=i.budget,
                       advertiserwebsite=i.advertiserwebsite, publishing_sites=i.publishing_sites,
                       ad_type=i.ad_type, owner=i.owner, total_clicks=i.total_clicks,
                       total_views=i.total_views, website_clicks=i.website_clicks))

db.session.commit()
