import flask
from werkzeug.utils import secure_filename
import os
from firebase_admin import initialize_app, storage, credentials
import urllib.parse
import flask_sqlalchemy
import requests
import stripe
import random
from flask_cors import CORS, cross_origin
from flask_login import LoginManager, UserMixin, current_user, logout_user, login_required, login_user

app = flask.Flask(__name__)
app.config["UPLOAD_FOLDER"] = ""
app.config["SECRET_KEY"] = "MAKEMEBILLIONAIRE"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ['DATABASE_URL']

CORS(app, support_credentials=True)

login_manager = LoginManager(app)

db = flask_sqlalchemy.SQLAlchemy(app)

cred = credentials.Certificate("inads-dccd5-firebase-adminsdk-jra7j-95b2ea76a3.json")

initialize_app(cred, {'storageBucket': 'inads-dccd5.appspot.com'})


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    purpose = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    account_balance = db.Column(db.Float)
    customer_id = db.Column(db.String)
    subscriber_id = db.Column(db.String)


class Payouts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    information = db.Column(db.String)

    def __repr__(self):
        return self.information


class Domains(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    domain = db.Column(db.String, unique=True)
    owner = db.Column(db.String)
    keywords = db.Column(db.String)
    total_revenue = db.Column(db.Float)
    total_clicks = db.Column(db.Integer)
    total_views = db.Column(db.Integer)

    def __repr__(self):
        return self.domain


class Ads(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fileurl = db.Column(db.String)
    keywords = db.Column(db.String)
    budget = db.Column(db.Float)
    advertiserwebsite = db.Column(db.String)
    owner = db.Column(db.String)
    publishing_sites = db.Column(db.String)
    ad_type = db.Column(db.String)
    total_clicks = db.Column(db.Integer)
    total_views = db.Column(db.Integer)

    def __repr__(self):
        return self.id


def makePayment(credit, month, year, cvc, create_subscription):
    stripe.api_key = "sk_test_51HZAtZHjukLYcqc9JUrifnqu7SZiifNT4FbJHQnTXQo" \
                     "hTrHXdLp3EQQaNeZVHi4JaQYfMwvCRC7UPFi1IggTS6uJ00DvcuSZ19"
    payment = stripe.PaymentMethod.create(
        type="card",
        card={
            "number": credit,
            "exp_month": int(month),
            "exp_year": int(year),
            "cvc": cvc,
        },
    )

    customer = stripe.Customer.create()

    paymentmethod = stripe.PaymentMethod.attach(
        payment.stripe_id,
        customer=customer.stripe_id,
    )

    if credit[0] == "3":
        token = "tok_amex"
    elif credit[0] == "4":
        token = "tok_visa"
    elif credit[0] == "5":
        token = "tok_mastercard"
    else:
        token = None

    stripe.Customer.create_source(
        customer.stripe_id,
        source=token
    )

    subscribeid = "advertiser"

    if create_subscription:
        subscription = stripe.Subscription.create(
            customer=customer.stripe_id,
            items=[
                {"price": 'price_1ILMYzHjukLYcqc9ZAdTXfl8'},
            ],
        )

        subscribeid = subscription.stripe_id

    return customer.stripe_id, subscribeid


@app.route("/website_performance", methods=["GET", "POST"])
@login_required
def websitePerformance():
    domainslist = Domains.query.filter_by(owner=current_user.email)
    if flask.request.method == "POST":
        Domains.query.get(flask.request.values["domainid"]).keywords = flask.request.values["keywords"]
        db.session.commit()
    return flask.render_template("website_performance.html", domainslist=domainslist, user=current_user)


@app.route("/cancel_subscription", methods=["POST", "GET"])
@login_required
def cancelSubscription():
    if not current_user.purpose == "Content Creator":
        return flask.redirect("/")

    if flask.request.method == "POST":
        db.session.delete(User.query.get(current_user.id))
        db.session.commit()
        stripe.api_key = "sk_test_51HZAtZHjukLYcqc9JUrifnqu7SZiifNT4FbJHQnTXQo" \
                         "hTrHXdLp3EQQaNeZVHi4JaQYfMwvCRC7UPFi1IggTS6uJ00DvcuSZ19"

        stripe.Subscription.modify(
            current_user.subscriber_id,
            metadata={"cancel_at_period_end": True},
        )

        logout_user()
        return '''<script> localStorage.clear()
                            document.location = "/" </script>
                        Your subscription is cancelled!'''

    return flask.render_template("cancel_subscription.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return flask.redirect("/")


@app.route("/confirmationfile")
@login_required
def confirmationFile():
    return flask.render_template("downloadconfirmation.html", user=current_user)


@app.route("/add_domain", methods=["POST", "GET"])
@login_required
def addDomain():
    domains = Domains.query.filter_by(owner=current_user.email)
    if flask.request.method == "POST":

        try:
            requestinfo = requests.get("http://" + flask.request.values["domain"] + "/inadsconfirm.txt").content
        except Exception as e:
            print(e)
            return '''
                <script>
                    alert("Domain Unconfirmed")
                    document.location = "/dashboard"
                </script>
            '''

        if requestinfo.decode("utf-8") != current_user.email:
            print(requestinfo)
            return '''
                <script>
                    alert("Domain Unconfirmed")
                    document.location = "/dashboard"
                </script>
            '''
        domainname = Domains(domain=flask.request.values["domain"], owner=current_user.email,
                             keywords=flask.request.values["keywords"], total_revenue=0, total_clicks=0, total_views=0)
        db.session.add(domainname)
        db.session.commit()
    return flask.render_template("domainadd.html", domains=domains, user=current_user)


@app.route("/dashboard")
@login_required
def dashboard():
    user = current_user
    ads = Ads.query.filter_by(owner=current_user.email)
    numberofads = 0
    for i in ads:
        numberofads += 1
    return flask.render_template("dashboard.html", user=user, ads=ads, numberofads=numberofads)


@app.route("/payout", methods=["POST", "GET"])
@login_required
def payoutSystem():
    if flask.request.method == "POST" and current_user.account_balance > 50:
        values = flask.request.values
        information = Payouts(information=values["name"] + ", Address Personal:" + values["paddress"] +
                                          ", Name Bank: " + values["namebank"] + ", Address Bank: " +
                                          values["baddress"] + ", Account Number: " +
                                          values["anumber"] + ", Account Type" + values["atype"]
                                          + ", Routing Number" + values["rnumber"] + "Account Mail: " +
                                          current_user.email)
        db.session.add(information)
        db.session.commit()
    return flask.render_template("payout.html", user=current_user)


@app.route("/")
def main_page():
    return flask.render_template("index.html")


@app.route("/plans")
def plans():
    return flask.render_template("plans.html")


@app.route("/estimated_earnings")
def estimateEarnings():
    return flask.render_template("estimated_earnings.html")


@app.route("/account")
@login_required
def account():
    domains = Domains.query.filter_by(owner=current_user.email)
    return flask.render_template("account.html", user=current_user, domains=domains)


@app.route("/register", methods=["GET", "POST"])
def register():
    user = ""
    if flask.request.method == "POST":
        if flask.request.values["purpose"] == "Advertiser":
            client, subs = makePayment(flask.request.values["credit"], flask.request.values["month"],
                                       flask.request.values["year"],
                                       flask.request.values["cvc"], False)
            user = User(email=flask.request.values["email"], password=flask.request.values["password"],
                        purpose=flask.request.values["purpose"], account_balance=0, customer_id=client,
                        subscriber_id=subs)
        if flask.request.values["purpose"] == "Content Creator":
            client, subs = makePayment(flask.request.values["credit"], flask.request.values["month"],
                                       flask.request.values["year"],
                                       flask.request.values["cvc"], False)
            user = User(email=flask.request.values["email"], password=flask.request.values["password"],
                        purpose=flask.request.values["purpose"], account_balance=0, customer_id=client,
                        subscriber_id=subs)

        db.session.add(user)
        db.session.commit()
        return '''
            <script>
                alert("Registered")
                document.location = "/"
            </script>
        '''
    return flask.render_template("register.html")


@app.route("/login", methods=["POST", "GET"])
def loginUser():
    if current_user.is_authenticated:
        return flask.redirect("/dashboard")
    if flask.request.method == "POST":
        user = User.query.filter_by(email=flask.request.values['email']).first()
        if user:
            if user.password == flask.request.values["password"]:
                login_user(user, remember=True)
                return flask.redirect("/dashboard")

    return flask.render_template("login.html")


@app.route("/load_money", methods=["POST", "GET"])
def loadMoney():
    user = current_user
    if flask.request.method == "POST":
        if not current_user.password == flask.request.values["password"]:
            return "<script> alert('Password invalid') </script>"

        stripe.api_key = "sk_test_51HZAtZHjukLYcqc9JUrifnqu7SZiifNT4FbJHQnTXQo" \
                         "hTrHXdLp3EQQaNeZVHi4JaQYfMwvCRC7UPFi1IggTS6uJ00DvcuSZ19"

        charge = stripe.Charge.create(
            customer=current_user.customer_id,
            amount=int(flask.request.values["amount"]) * 100,
            currency="usd"
        )

        User.query.get(current_user.id).account_balance += float(flask.request.values["amount"])
        db.session.commit()
        return flask.redirect("/dashboard")
    return flask.render_template("loadmoney.html", user=user)


@app.route("/advertise", methods=["POST", "GET"])
@login_required
def advertise():
    user = current_user
    if flask.request.method == 'POST':
        if float(flask.request.values["budget"]) > float(current_user.account_balance):
            return '''
            <script>
                alert("Inadequate Account Balance");
                window.location.reload()
            </script>
            '''
        if 'file' not in flask.request.files:
            return flask.redirect(flask.request.url)
        file = flask.request.files['file']
        if file.filename == '':
            return flask.redirect(flask.request.url)

        filename = secure_filename(file.filename)

        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        bucket = storage.bucket()
        blob = bucket.blob(filename)
        blob.upload_from_filename(filename)
        blob.make_public()

        db.session.add(Ads(fileurl=blob.public_url, keywords=flask.request.values["keywords"],
                           budget=flask.request.values["budget"],
                           advertiserwebsite=flask.request.values['website'], publishing_sites="",
                           ad_type=flask.request.values['typeAd'], owner=current_user.email, total_clicks=0,
                           total_views=0))

        User.query.get(current_user.id).account_balance = int(User.query.get(current_user.id).account_balance) - \
                                                          int(flask.request.values["budget"])

        db.session.commit()

        return flask.redirect("/dashboard")

    return flask.render_template("uploads.html", user=user)


@app.route("/view/<adtype>")
@cross_origin(supports_credentials=True)
def return_file(adtype):
    domain = urllib.parse.urlparse(flask.request.environ.get('HTTP_REFERER', 'default value')).netloc
    domainList = []

    for i in Domains.query.all():
        domainList.append(str(i.domain))
    if domain not in domainList:
        print(domain)
        print(domainList)
        return "Unauthorized request"

    suitablead = None
    suitableads = []

    keywords = Domains.query.filter_by(domain=domain).first().keywords.split("/")
    for i in Ads.query.all():
        if i.ad_type == adtype and i.budget > 0.25:
            for c in i.keywords.split("/"):
                if c in keywords:
                    suitableads.append(i)

    try:
        if len(suitableads) == 1:
            suitablead = suitableads[0]

        else:
            suitablead = suitableads[random.randint(0, len(suitableads) - 1)]
    except Exception as e:
        print(e)
        pass

    if suitablead is None:
        print("Suitable ad randomizer")
        suitablead = Ads.query.get(random.randint(1, Ads.query.count()))
        while float(suitablead.budget) < 0.25 or suitablead.ad_type != adtype:
            suitablead = Ads.query.get(random.randint(1, Ads.query.count()))

    if suitablead:
        return flask.redirect("/ads" + "/" + str(int(suitablead.id) - 1))
    else:
        return "No ads are suitable to your query."


@app.route("/ads/<fileindex>")
@cross_origin(supports_credentials=True)
def returnActual(fileindex):
    domainList = []
    domain = urllib.parse.urlparse(flask.request.environ.get('HTTP_REFERER', 'default value')).netloc
    for i in Domains.query.all():
        domainList.append(str(i.domain))
    if domain not in domainList:
        return "Unauthorized request"
    file = Ads.query.get(int(fileindex) + 1)
    file.total_views += 1
    file.publishing_sites += \
        urllib.parse.urlparse(flask.request.environ.get('HTTP_REFERER', 'default value')).netloc + ","
    db.session.commit()
    domainobject = Domains.query.filter_by(domain=domain).first()
    domainobject.total_views += 1
    domainobject.total_revenue += 0.002
    domainowner = \
        Domains.query.filter_by(domain=urllib.parse.urlparse(
            flask.request.environ.get('HTTP_REFERER', 'default value')).netloc).first().owner
    userowner = User.query.filter_by(email=domainowner).first().account_balance
    Ads.query.get(int(fileindex) + 1).budget -= 0.002
    User.query.filter_by(email=domainowner).first().account_balance = float(userowner) + 0.002
    db.session.commit()
    if len(file.fileurl) > 4:
        response = flask.Response(requests.get(file.fileurl).content)
        return response


@app.route("/adclick/<adname>")
@cross_origin(supports_credentials=True)
def adclick(adname):
    domain = urllib.parse.urlparse(flask.request.environ.get('HTTP_REFERER', 'default value')).netloc
    domainList = []

    for i in Domains.query.all():
        domainList.append(str(i.domain))

    if domain not in domainList:
        return "Unauthorized request"
    website = urllib.parse.urlparse(flask.request.environ.get('HTTP_REFERER', 'default value')).netloc
    if website in Ads.query.get(int(adname) + 1).publishing_sites.split(","):
        Ads.query.get(int(adname) + 1).budget -= 0.20
        Ads.query.get(int(adname) + 1).total_clicks += 1

        domainobject = Domains.query.filter_by(domain=domain).first()
        domainobject.total_views += 1
        domainobject.total_revenue += 0.20

        domainowner = \
            Domains.query.filter_by(
                domain=urllib.parse.urlparse(
                    flask.request.environ.get('HTTP_REFERER', 'default value')).netloc).first().owner
        userowner = User.query.filter_by(email=domainowner).first().account_balance
        User.query.filter_by(email=domainowner).first().account_balance = float(userowner) + 0.20

        db.session.commit()
        return f"<script> document.location = '{Ads.query.get(int(adname) + 1).advertiserwebsite}' </script>"


@app.route("/inads/<adblockcanceller>")
@cross_origin(supports_credentials=True)
def addscript(adblockcanceller):
    return flask.send_file("ads.js")


@app.route("/styles")
@cross_origin(supports_credentials=True)
def styles():
    return flask.send_file("styles.css")


@app.route("/docs")
def docs():
    return flask.render_template("docs.html")


@app.route('/favicon.ico')
def favicon():
    return flask.send_file("favicon.ico")
