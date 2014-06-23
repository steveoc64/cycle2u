conn = new Mongo();
db = conn.getDB("cycle2u");


function addContact(name,bike,email,addr,tel,msg,datetime,ip) {
	//print(name,bike,email,addr,tel,msg,datetime,ip);

	// Find by email
	var myCursor = db.contacts.find({Email: email});
	var myDocument = myCursor.hasNext() ? myCursor.next() : null;

	if (myDocument) {
		print("Existing Contact", email)

	    db.contacts.update({_id: myDocument._id},
	   		{
		   		// Add the bike to the document if not already there
	   			$addToSet: { Bike: bike },

			    // Add new booking to the bookings array for this contact
	   			$push: {
	   				Booking: {
	   					Date: new Date(datetime),
	   					IP: ip,
	   					Message: msg
	   				}
	   			}
	   		}
	   	);

	} else {
		print("Entirely New Contact", email);
		
		db.contacts.insert({Name: name, 
			Bike: [bike],
			Email: email,
			Address: addr,
			Telephone: tel,
			Booking: [{
				Date: new Date(datetime),
				IP: ip,
				Message: msg
			}]
		});
	}

};

db.contacts.remove({});

addContact("David Malan", "Specialized Roubaix Elite SL2 Apex Compact Road Bike", "david.n.malan@gmail.com", "58 Cowra Street, Mile End, 5031","0410154295",
	"If possible I would like to book in a service for Saturday 28 December, am available all day.",
	"Dec 22, 2013, 17:43:24","219.90.212.196");

addContact("Ford Hansen","2009 Orbea Onix - Blue 60","ford_hansen@optusnet.com.au","West beach","0434 162 620",
	"was hoping to get a service done on the saturday 11th January and I can bring bike down to La Musette Siphon Coffee Bar. Can you let me if this possible and what time to bring down. If possible could you replace the big chain ring, i should be able to purchase before this date Thankyou Ford Hansen",
	"Dec 27, 2013, 09:21:28","203.6.146.28");

addContact("Mark Boettger","Pinarello FP6","botts@adam.com.au","24 Quinlivan Rd, Pooraka","0410650336",
	"Available between Tue 7 Jan and Fri 10 Jan at Pooraka address or between Mon 13 Jan and Wed 15 Jan in city (17-23 Carrington St Adelaide)",
	"Dec 30, 2013, 14:16:21","182.239.205.221");

addContact("Stuart Ward","Giant Defy Advanced","stunhel@hotmail.com","c/ 74 Marine Parade, Seacliff","0408146727",
	"How much would it cost for you to fit a new Ultegra 10 speed cassette and chain to the above bike. I have the new cassette cogs, new XT HG 95 chain (116 links) and Connex chain link? I am registered for the TDU Challenge ride but wish to have the bike ready by 19/1/14.",
	"Dec 31, 2013, 14:06:17","1.124.42.155");

addContact("adam swalling","2011 apollo arctec r, sram red","adam.swalling@gmail.com","13 fountain valley dr happy valley","0402341275",
	"hi, would love to get you round for a bike fit, been having a few back problems since getting a new bike 2 months ago. can do it at home (above) after hours or arrange to do it a lunch time at work, or weekends at home. cheers, adam",
	"31 Dec, 2013, 19:00:19","101.103.9.18");

addContact("Tris","Avanti Corsa","tris.curtis@gmail.com","Unit 4 of la musette building","0422549155",
	"Just bought it second-hand. General service and gears may need fixing too.",
	"1 Jan, 2014, 21:22:54","49.183.107.138");

addContact("Adrian Mitchell","Wilier Xp Izoard 2011","asmitchell1@hotmail.com","28 Grapevine Lane McLaren Vale 5171","",
	"Hi Paul , found your ad on facebook , just after a service on my bike , what is the waiting period like ? When are you down south etc .........Cheers Adrian Mitchell",
	"2 Jan 2014, 12:23:01","101.177.193.14");

addContact("Andrew Hilditch","Giant Mountain bike","ahilditch@whflegal.com.au","20 Farrell street , Glenelg","0425 321 164",
	"bike has been in shed for probably 5 years and i have just resumed riding from Glenelg to city about 4 times a week . Would like a full service .",
	"2 Jan 2014, 15:45:00","203.122.221.137");

addContact("Jim McLean","Specialized Rubaix-Comp. 105 gearset","jmclean@adam.com.au","28 Skylark Close Flagstaff Hill SA 5159","0478312504",
	"Would like to know when possible to book a service asap :O) left message on your voicemail",
	"3 Jan 2014, 12:13","122.49.172.133");

addContact("Craig McFarlane","2004 Giant ONCE Team edition bike","craigmcf12@yahoo.com.au","2 Warwick Ave, North Brighton 5048","0430859522",
	"Would like a service and bike fit please.",
	"3 Jan 2014, 13:24","58.179.239.104");

addContact("Chris Jones","Avanti Corsa with Shimano Ultegra gear","smott@tpg.com.au","25 Bartlett Dr NOVAR GARDENS. 5040","0414360238",
	"Needs service & probably new handle bars grips. Would like service at Glenelg.",
	"3 Jan 2014, 13:51","60.240.179.1");

addContact("Neil Tredwell","Giant Tcr 105 group set","neil@tredwell.com.au","13 Bransby Avenue North Plympton","0412174665",
	"Recommended by Elton Ulyett",
	"5 Jan 2014, 15:01","101.166.11.111");

addContact("Rick Hutchins","Azzurri Tigre road bike","r.hutchins@internode.on.net","14 Allchurch Ave, North Plympton","0419119021",
	"I left a phone message with you earlier. A friend of mine, Neil Tredwell, booked in a service with you for next Monday. If you have time available I can drop my bike at his office to service at the same place.",
	"7 Jan 2014, 13:19","118.210.169.110");


addContact("Gary Brooks","Brand new but a cheapie from Big W for my daughter","gary.brooks@bigpond.com","9A Siesta Ave, West Beach","0417018185",
	"Flat front tyre (24\"). May be more then a puncture I think. Are you available Fri, 10/1? What would be approx. $?",
	"7 Jan 2014, 21:10","49.191.19.38");

addContact("Ken Noll","Specialzed Cirrus","knoll@rbe.net.au","Work-622 Regency Road,Broadview -XtraCare Equipment","0400110181",
	"There will be 2 maybe 3 bikes to service -give me a days notice please",
	"8 Jan 2014, 17:18","203.31.11.31");

addContact("Dylan Owen","Malvern star oppy C5","dylan.owen2@sa.gov.au","Tram depot, corner Maxwell Terrace & Morphett Rd. Glengowrie (work)","0414372585",
	"There is a clicking noise when I climb, noise comes as my right foot is nearing the bottom. I also need a bike fit.",
	"8 Jan 2014, 17:40","1.123.63.122");

addContact("Fairuz Azli","Colnago CLX","fairuza@bartons.com.au","Work - 474A Anzac Highway, Camden Park, SA","0419202221",
	"Have not done service for more than 12 months so not in a rush. Whenever suits you as bike is kept mainly at work except for Wednesday.",
	"13 Jan 2014, 8:58","122.152.140.65");

addContact("Shane Sody","2013 Specialized S-Works Tarmac SL4","shane@sodyaudio.com","24 Halsbury Avenue Kingswood","0414 959 125",
	"Just got this bike but would like a bike fit from you please!",
	"14 Jan 2014, 23:15","122.49.135.158");

addContact("Robert Liebich","Fluid (Anaconda's own brand). Just a standard mountain bike.","midnightmoggie@bigpond.com","36 Rosetta Street WEST CROYDON 5008","0419 852 742",
	"I haven't used the bike for a couple years, it just needs a general service. Both tyres are flat, assume the inner tubes are perished.",
	"17 Jan 2014, 22:37", "58.174.176.253");

addContact("Jose Gonzalez","Merida reacto 904 2013 model","becool70@gmail.com","12 penno pde south Blackwood","0401293333",
	"Need a tune up and bike fit before bupa challenge if possible",
	"18 Jan 2014, 19:15","122.105.136.246");

addContact("Paul Blood","2013 Focus Izalco Donna","Paul.blood@health.sa.gov.au","74 Dudley Ave Daw Park S.A 5041 or Repatriation General Hospital","0433249255",
	"Hi Paul, I would like to book a bike fit for new bike that i purchased for my wife. You mentioned that the 1st week in Feb would be the earliest, if you can let me know your first available date.",
	"19 Jan 2014, 20:01", "101.166.43.246");

addContact("Alyn Stevenson","We have Tandem Shwin 11 months old","alyn1@adam.com.au","12 Australia 11 avenue North Haven S.A. 5018","0400227562",
		"needs gears adjusted and service my wife has a Vito road bike and we have 2 mountain bikes. We would like to get all bikes serviced. My wife has some Tuesdays off and I have some Wednesdays off",
		"20 Jan 2014, 20:44","115.166.6.249");

addContact("Shane Jokela","","shanejokela@gmail.com","50 Hampton st south goodwood","0415088233",
	"I will take whatever the earliest date is you have. Looking for new pads, dura-ace chain and 28 cassette for three peaks. I will give you a call to discuss. Thanks",
	"21 Jan 2014, 20:22","101.119.24.253");

addContact("Warren Jones","2014 HASA R1 road bike with Carbon frame & wheels with Shimano 105 gearing.","warren@auspetandvet.com.au","Auspet & Vet office 48 Birralee Rd regency park SA 5010","0417 620 111",
	"I have just brought this bike from cycling express in Melbourne & it is still in the box in my office around 90% assembled & I was looking around to find someone that could set it up properly for me & fit the bike to me, it is my first bike & my entry into cycling.",
	"23 Jan 2014, 09:00","165.228.207.21");

/*
-----------------------------------------------------------------------
Name: Brett Hawkins

Bike: Fuji Nevada 29 1.3 2013

Email Address: plamb7@hotmail.com

Home Address: 9 Newfield Drive Reynella

Click for MAP

Telephone: 0423495188

Message:

Hi there, I noticed in your synopsis that you specialise in road bikes, I am wondering if you still service mountain bikes at all please? thanks Brett

This message was sent from the IP Address: 165.228.207.21 on 23/01/2014 at 09:18:23

-----------------------------------------------------------------------
Name: James Wade

Bike: Trek Madone 5.2

Email Address: jamesdwade@gmail.com

Home Address: 400 King William Street, Adelaide SA 5000

Click for MAP

Telephone: 0421846630

Message:

Hey, just looking to get a service done on my Madone. It's about 3 months since the last minor service I had. Gears need a minor service and wouldn't mind if you checked out the shape of the wheel bearings.

This message was sent from the IP Address: 120.146.246.106 on 23/01/2014 at 10:03:21
-----------------------------------------------------------------------

Name: Stuart Ward

Bike: Giant Defy SL Advanced

Email Address: stunhel@hotmail.com

Home Address: 74 Marine Parade, Seacliff, SA

Click for MAP

Telephone: 82966352 or 0408146727

Message:

We have booked you for 3/2/14 to service and install chains and cassettes on our 2 touring bikes and we still want you to do the job. I have the cassettes and chains. When you fitted a new cassette and chain to my Defy you suggested I replace the compact chain rings. I now have the rings. Can you do this on Monday 3rd or shall I bring the bike down to La Musette on the afternoon of Saturday next?

This message was sent from the IP Address: 1.124.42.154 on 28/01/2014 at 11:06:03
-----------------------------------------------------------------------
Name: mark smith and michael doyle

Bike: 2 bikes: mark: giant TCR Advanced with Ultegra set mike: Merida

Email Address: mark.t.smith@det.nsw.edu.au

Home Address: 24 Day Road, Glen Osmond

Click for MAP

Telephone: 0414 623184

Message:

*Both of us want the bike service and the personalised bike 'fitting'. We are riding in the SuperCycle this year and Ray recommended you. I live in NSW and will be over on 15-16 March (sat-sun). Can we arrange for this service to be done on Saturday 15 march in the early afternoon please? These address provided is Mike's place in Adelaide where i will be staying. thanks Mark

This message was sent from the IP Address: 121.217.35.46 on 02/02/2014 at 15:54:04

-----------------------------------------------------------------------
Name: Chris Rigg

Bike: Canondale Super 6

Email Address: chris.rigg@kbr.com

Home Address: 27 Sassafras Drive Highbury

Click for MAP

Telephone: 0437797310

Message:

Also needs bar tape redone. I have the tape.

This message was sent from the IP Address: 161.51.43.45 on 03/02/2014 at 16:46:19

-----------------------------------------------------------------------
Name: Bernie Davies

Bike: roubix with durace

Email Address: dandbdavies@bigpond.com

Home Address: 192 esplanade brighton

Click for MAP

Telephone: 0419813961

Message:

Gear adjustment issues

This message was sent from the IP Address: 101.166.32.190 on 06/02/2014 at 20:57:39
-----------------------------------------------------------------------
Name: Ben Taylor

Bike: Boardman team carbon

Email Address: bentaylors@yahoo.co.uk

Home Address: 44 Lyons circuit,Trott park 5158

Click for MAP

Telephone: 0411825358

Message:

I bought a secondhand wheel set from you and on the first test ride a spoke snapped. Wondered if you did a service of replacing spokes? And how much it costs?

This message was sent from the IP Address: 219.90.152.2 on 08/02/2014 at 09:12:18
-----------------------------------------------------------------------
Name: Alex Karatassas

Bike: Specialized Roubaix 2010 Enquiry re service and fitting

Email Address: akaratassas@gmail.com

Home Address:

Click for MAP

Telephone: 0412844602

Message:

Live at Seaford. Are you available on weekend?

This message was sent from the IP Address: 49.183.178.72 on 09/02/2014 at 09:22:08
-----------------------------------------------------------------------
Name: Chris Williams

Bike: Focus Izalco Pro 4.0 2012

Email Address: cwilliams@statewide.com.au

Home Address: 146 Augusta St Glenelg East

Click for MAP

Telephone: 0417826663

Message:

Hi Paul, I've trade up from the Kojima! Chain broke on the weekend - no apparent reason (certainly not my power). I'd like a new chain fitted (just something pretty standard is fine - whatever you recommend) and a service (I'm doing another 1,000 km ride in April). Timing asap, I can deliver to your place out of hours or in-hours at my place can also work. Chris

This message was sent from the IP Address: 203.176.104.70 on 10/02/2014 at 12:39:18
-----------------------------------------------------------------------
Name: Justin Porter

Bike: ORBEA road bike with Campagnolo Centaur components

Email Address: portsy@me.com

Home Address: 28 Gilbert St OVINGHAM 5082

Click for MAP

Telephone: 0413010538

Message:

Service, degrease, tune

This message was sent from the IP Address: 1.125.170.145 on 10/02/2014 at 15:56:12
-----------------------------------------------------------------------
Name: Christian Miles

Bike: Reid Falco Elite

Email Address: christianmiles@hotmail.com

Home Address: 62 Floriedale Road, Greenacres SA 5086

Click for MAP

Telephone: 0403200302

Message:

Hi Paul I'm relatively new to riding and when in Sydney I bought a new bike from Reid Cycles (Falco Elite). Being a novice, I would like the bike put together properly and would also like to enquire about yearly servicing. Are you able and willing to put bikes together (the Falco comes 85%assembled) but requires the front wheel, turning handlebars and then adjusting the headset, brake and gears. I am currently waiting for it to be delivered, but if you could let me know your charges as well as any further info you need that would be great. I'm in the Greenacres area, just off North East Road. Thanks mate Christian

This message was sent from the IP Address: 203.26.147.254 on 11/02/2014 at 15:19:54
-----------------------------------------------------------------------
Name: Ashley Leahy

Bike: Specialized Tarmac with Full Ultegra 6700 G/S

Email Address: Ashley.leahy@health.sa.gov.au

Home Address: 6/40 Gilbert St Adelaide (home) Repat General Hospital Daw Park (work)

Click for MAP

Telephone: 0421215366

Message:

No Mad rush but keen to get it serviced in the next couple of weeks

This message was sent from the IP Address: 182.239.164.219 on 11/02/2014 at 19:42:52
-----------------------------------------------------------------------

Name: Donny Walford

Bike: Orbea Ladies bike.

Email Address: donny@dwbottomline.com

Home Address: 10 Watson Avenue Rose Park

Click for MAP

Telephone: 0414844347

Message:

Any chance you can come out today? I have had two punctures in two days of riding - back wheel - so something maybe wrong with my tyre. I am a woman cyclist and mending punctures isn't my forte.

This message was sent from the IP Address: 110.142.52.12 on 12/02/2014 at 07:39:10
-----------------------------------------------------------------------
Name: Mark Vincent

Bike: Orbea Orca, Ultegra 6800

Email Address: mark.vincent@sapowernetworks.com.au

Home Address: 10B Woodleigh Road, Blackwood 5051

Click for MAP

Telephone: 0427580119

Message:

Hi Paul, have been referred to you by Ray Morris - I'm one of the Supercycle bunch. Have just upgraded my groupset to 11 speed Shimano, only to find that my Reynolds DV46 carbon clinchers aren't compatible with 11 speed :( Was wondering if you do wheel re-builds? Considering re-building with an 11 speed compatible hub. Do you re-build wheels and/or can recommend anyone good in Adelaide that does? Thanks, Mark

This message was sent from the IP Address: 121.215.182.71 on 16/02/2014 at 11:46:51
-----------------------------------------------------------------------
Name: Stephen Boyley

Bike: Time Fluidity

Email Address: sboyley@hotmail.com

Home Address: 11 Miller Street Glenelg East

Click for MAP

Telephone: 0447043004

Message:

Paul - as mentioned need an ensemble swapped out from 10sp to 11sp - this is mechanical. SB

This message was sent from the IP Address: 58.174.191.31 on 17/02/2014 at 13:31:31
-----------------------------------------------------------------------

Name: Steve

Bike: cannondale saeco ( approx1998 )

Email Address: stephen_68@bigpond.com

Home Address: 1/186 Trimmer Parade Seaton

Click for MAP

Telephone: 0418443181

Message:

Can you please phone me to discuss an appropriate time for my bike to be serviced.. Steve

This message was sent from the IP Address: 60.242.67.156 on 17/02/2014 at 13:56:45
-----------------------------------------------------------------------
Name: Alastair Dowler

Bike: FUJI Altamira 1.0 BB86

Email Address: allyd02@bigpond.com

Home Address: 8 rugby St Pasadena

Click for MAP

Telephone: 0407606130

Message:

Hi Paul, after my prang two weeks ago I got back on my bike for the first time earlier this week. On Tuesday I noticed a strange and unnerving sound coming from the BB or "down there somewhere". I just found a spare minute at work and yes the BB is crunchy and clicky. The crank assembly must have taken a hit unbeknown to me at the time. Will you be down at La-Musette tonight or over the weekend. Cheers

This message was sent from the IP Address: 192.43.227.18 on 20/02/2014 at 15:00:18

-----------------------------------------------------------------------
Name: Crist Constanti

Bike: Giant TCR1

Email Address: con219@iprimus.com.au

Home Address: 45 Russ Ave Seaton SA 5023

Click for MAP

Telephone: 0409115296

Message:

Wondering when you will have time for a service

This message was sent from the IP Address: 58.179.248.184 on 24/02/2014 at 22:41:46
-----------------------------------------------------------------------

Name: Scott Ross

Bike: Fuji altamera ultegra di 2

Email Address: scott.ross@bendigoadelaide.com.au

Home Address: 49 Hughes street Unley

Click for MAP

Telephone: 0438791799

Message:

Can you also assess me for a bike fit.

This message was sent from the IP Address: 49.184.14.232 on 28/02/2014 at 06:51:04
-----------------------------------------------------------------------
Name: Andreas Clark

Bike: Cannondale super six evo with SRAM red

Email Address: andreas.clark@wineaustralia.com

Home Address: 4 Benacre close Glen Osmond

Click for MAP

Telephone: 0407232400

Message:

Need new bar tape as well

This message was sent from the IP Address: 121.45.106.110 on 01/03/2014 at 21:05:54
-----------------------------------------------------------------------

Name: Jess

Bike: Avanti hybrid

Email Address: jessica.amy.pollard@gmail.com

Home Address:

Click for MAP

Telephone:

Message:

It is a commuter bike, just needs general service and was hoping I could get of the tyre tubes replaced as part of the service (I can provide the tube)

This message was sent from the IP Address: 124.171.78.139 on 03/03/2014 at 11:31:33
-----------------------------------------------------------------------
Name: Steve

Bike: 2014 Focus Izalco Pro

Email Address: stevereu@tpg.com.au

Home Address:

Click for MAP

Telephone: 0412151131

Message:

Hi Paul, Im looking at ugrading from Ultergra groupset (excluding cranks and bottom brkt) to Dura Ace. Can get all components online, just wondering what you would charge to fit it all. So, thats rear cassette,brakes,fr & rear derailleurs & cables if nec. I have Fulcrum Racing Zero wheels approx.18 mnths old. Cheers, Steve

This message was sent from the IP Address: 14.203.32.209 on 03/03/2014 at 14:22:39

-----------------------------------------------------------------------
Name: Michael Doyle

Bike:

Email Address: mdoyle@mitchellchambers.com.au

Home Address: 24 Day Road Glen Osmond 5064

Click for MAP

Telephone: 0409991811

Message:

Hi Paul. I am riding in supercycle 2014. I have had a bike fit but I would like you to check it and also to do a bike fit for my wife and perhaps to service her bike as well. Could you please give me a ring? 0409991811

This message was sent from the IP Address: 150.101.252.158 on 06/03/2014 at 15:06:27

-----------------------------------------------------------------------
Name: Pamela Boyle

Bike: The bike is a women's avanti 7speed ( I think!)

Email Address: pamelora@hotmail.com

Home Address: 41 Longview Avenue Belair

Click for MAP

Telephone: 0430332273

Message:

This bike has not been ridden very much but has been sitting in the garage for nearly a year! It needs tyres pumped and a general good looking over. Thanks

This message was sent from the IP Address: 124.182.241.47 on 07/03/2014 at 14:18:19


-----------------------------------------------------------------------
Name: Poennynamy

Bike:

Email Address: matta38641@fat-milf.com

Home Address: http://foxyjackyexposed.com

Click for MAP

Telephone: 123456

Message:

46kjjblw3 what are binary options binary options demo 91fx http://foxyjackyexposed.com zmj45mw

This message was sent from the IP Address: 213.238.175.16 on 08/03/2014 at 20:07:21

-----------------------------------------------------------------------
Name: Cerri Morgan

Bike: Scott CR1 Team 2009

Email Address: cerri_morgan@yahoo.com

Home Address: 76A Marlborough Street, Henley Beach

Click for MAP

Telephone: 0423926818

Message:

Hi Paul, you serviced my bike last year and i'm looking to do the same again ready for autumn. Hopefully Wednesday's suit as i am currently working from home those days. Thanks, Cerri

This message was sent from the IP Address: 219.90.214.241 on 09/03/2014 at 16:16:50
-----------------------------------------------------------------------
Name: Michael

Bike: Giant TCR advanced, dura-ace, Reynolds Carbon wheel set

Email Address: mikecyclesnow@gmail.com

Home Address: Seaford

Click for MAP

Telephone:

Message:

Hi Paul, I'm keen to get my bike serviced but also think it is probably worthwhile replacing the gear and brake cables, as they have seen a fair bit of work including a trip to the alpes last July. I race and train on this bike (different training wheels) and although it is still feeling good, the gears etc. are a bit less precise. How much would you charge to service my bike and replace the cables? Thanks Michael

This message was sent from the IP Address: 219.90.208.136 on 10/03/2014 at 10:52:53
-----------------------------------------------------------------------
Name: Sam Wellington

Bike: Hybrid

Email Address: wello_1987@hotmail.com

Home Address: Glynde SA 5070

Click for MAP

Telephone:

Message:

Hi, I am looking for a bike service for my hybrid which I ride every day 15km to work. Gears are squeaking and making noise, plus sometimes they "slip" when I'm riding, am I right in thinking the derailleur may need an adjustment? Many thanks Sam wello_1987@hotmail.com

This message was sent from the IP Address: 203.122.199.80 on 12/03/2014 at 11:18:22
-----------------------------------------------------------------------

Name: Alycia Mead

Bike: Avanti vertali And Fluid men's bike

Email Address: alycia@live.com.au

Home Address: Unit 3/24 Gladstone road mile end

Click for MAP

Telephone: 0403231908

Message:

Just bought a second hand avanti amd want to get it seviced. My husband would also like his fluid hybrid bike to be serviced also. We are not super riders - we will soon be looking at commuting 12km a day however. Can you can do home visits? And how long does a service take? Cheers

This message was sent from the IP Address: 49.183.233.210 on 12/03/2014 at 15:58:52

-----------------------------------------------------------------------
Name: Anne-Marie Oates

Bike: Giant Suede

Email Address: amo414@live.com.au

Home Address: 5 Cormorant Court, West Lakes Shore 5020

Click for MAP

Telephone: 0431414732

Message:

The back tyre tube needs replacing. I would like a service after the bike does not feel right after an interstate move

This message was sent from the IP Address: 118.210.229.148 on 13/03/2014 at 14:42:39
-----------------------------------------------------------------------

Name: James Martin

Bike: Norco Blast road bike.

Email Address: james@insiderfoundry.com

Home Address: Lvl 2, 14 Grenfell St, Adelaide, SA, 5000

Click for MAP

Telephone: 0403680876

Message:

Hi, I work in a co-working space called the Majoran Distillery, and a few of the guys here ride bikes. If I can get 3 bikes to be serviced, how much would it cost for you to come out and do the service?

This message was sent from the IP Address: 58.96.111.149 on 19/03/2014 at 09:41:01
-----------------------------------------------------------------------
Name: Daniel Bird

Bike: Bianchi Sempre Shimano 105

Email Address: dmbird@gmail.com

Home Address: 310 Young Street Wayville

Click for MAP

Telephone: 0412485108

Message:

Hi Paul, Looking to have my bike serviced and gear tune. Needs full degrease and re-lube. Also I ant get my garmin GSC to read the cadence sensor? I think the margins are too large as my fsa cranks are concave?? You'll certainly be able to get it all working I'm sure. Dan

This message was sent from the IP Address: 182.239.156.224 on 19/03/2014 at 16:52:52


-----------------------------------------------------------------------
Name: Mark Elliott

Bike: Giant Defy 2012 Shimano 105 Groupset

Email Address: mark@electricsuper.com.au

Home Address: 74A Gladstone Road, North Brighton SA 5048

Click for MAP

Telephone: 0403169536

Message:

Riding in 'Supercycle' charity ride in April

This message was sent from the IP Address: 124.171.78.192 on 20/03/2014 at 14:31:01
-----------------------------------------------------------------------
Name: Mark Britton

Bike: Studds 100

Email Address: mark.britton@dtz.com

Home Address: 16 Gray Street Adelaide 5000

Click for MAP

Telephone: 0428 461599

Message:

Hi, I have ridden new bike to work this morning but it desperately needs derrailleurs setting up correctly ( front and rear). Could you confirm a price and how soon you would be able to get to it? Thanks Mark

This message was sent from the IP Address: 1.124.170.162 on 24/03/2014 at 09:07:28
-----------------------------------------------------------------------

Name: david donovan

Bike: Pinarello F4-15

Email Address: donovan@internode.on.net

Home Address:

Click for MAP

Telephone: 0410124943

Message:

rear hanger out of alignment and left brake hood

This message was sent from the IP Address: 1.124.85.66 on 24/03/2014 at 12:46:35
-----------------------------------------------------------------------
Name: Ray

Bike: Orbea CARPE 10. Has had rear spokes replaced with thicker spokes to deal with "thicker" rider otherwise stock bike.

Email Address: piercingdragoneyes@hotmail.com

Home Address: North Adelaide

Click for MAP

Telephone: 0400272921

Message:

Rear wheel out of true and likely broken spoke may be culprit (black "fat" spokes). Rear derailer is skipping all over shop. Rear tire needs replacing. Last service introduced screeching breaks and doesn't stop on dime anymore :( - previous "mechanic" not qualified for hydraulic setup (apparently). Otherwise a general service. Only available after hours. Bike not wanted on road until Friday 4th April. Can do?

This message was sent from the IP Address: 58.174.177.5 on 30/03/2014 at 15:43:29
-----------------------------------------------------------------------
Name: Crist Constanti

Bike: Giant TCR Advanced with Ultegra SL Group set

Email Address: con219@iprimus.com.au

Home Address: 45 Russ Ave Seaton

Click for MAP

Telephone: 0409115296

Message:

My favorite bike man. I sold the Giant and bought another. Need you to do a service and assist in adjusting the foot pedal clip tension. :) Hope the holiday gave you that well deserved break.

This message was sent from the IP Address: 58.179.233.234 on 31/03/2014 at 10:43:00
-----------------------------------------------------------------------
Name: Brenton

Bike: Bianchi Sempre Pro DI2 Ultegra

Email Address: brenton@pikeconstructions.com.au

Home Address: 49 Alison St, Glenelg North.

Click for MAP

Telephone: 0418995179

Message:

Hi Paul, I need a new chain on my bike. I have the new chain so just need the old one removed and the new one put on. Can you help me with this? If so when would be a good time to do it? I am close to La Musette cafe if that helps? Can meet you there?

This message was sent from the IP Address: 150.101.19.58 on 03/04/2014 at 16:42:38
-----------------------------------------------------------------------

Name: Paul Voivodich

Bike: Shogun Trail Breaker 3. Mountain Bike.

Email Address: pvoivodich@bigpond.com

Home Address: 13. Botanic aaaAve. Flagstaff Hill. 5159.

Click for MAP

Telephone: 0418853664.

Message:

Bike hasnt been ridden for a few years. I want to have it serviced and a punture repaired to start riding again.

This message was sent from the IP Address: 101.103.141.101 on 07/04/2014 at 10:41:29
-----------------------------------------------------------------------
Name: david donovan

Bike: Pinarello F4-15

Email Address: donovan@internode.on.net

Home Address:

Click for MAP

Telephone: 0410124943

Message:

Rear hanger alignment probably out-Campag 10 speed

This message was sent from the IP Address: 118.210.227.5 on 08/04/2014 at 09:45:39
-----------------------------------------------------------------------
Name: Billy Ip

Bike: Azzurri Fonza Road Bike

Email Address: billy.mc.ip@gmail.com

Home Address: 15 Stanford Avenue Novar Gardens 5040

Click for MAP

Telephone: 0478402697

Message:

Would like to be fitted for the bike also

This message was sent from the IP Address: 118.210.4.60 on 02/05/2014 at 15:07:24
-----------------------------------------------------------------------
Name: John Markesinis

Bike: Orbea road bike About 3 years old

Email Address: theshed091@bigpond.com.au

Home Address:

Click for MAP

Telephone: 84314172 home

Message:

Any chance any afternoon this week?

This message was sent from the IP Address: 101.166.69.111 on 06/05/2014 at 13:53:38
-----------------------------------------------------------------------
Name: Celeste O'Reilly

Bike: My son needs his tire fixed - it has a puncture and he needs his breaks fixed. He wants to practice tomorrow for PedalPrix.

Email Address: celeste@opinvest.com.au

Home Address: 199 Windebanks rd Aberfoyle Park

Click for MAP

Telephone: 61449029927

Message:

I can bring the bike in today if it can be fixed today or by tomorrow!

This message was sent from the IP Address: 115.166.28.99 on 31/05/2014 at 11:08:54
-----------------------------------------------------------------------

-----------------------------------------------------------------------
-----------------------------------------------------------------------
-----------------------------------------------------------------------
-----------------------------------------------------------------------
-----------------------------------------------------------------------
-----------------------------------------------------------------------
*/