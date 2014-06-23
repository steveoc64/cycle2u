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
			}],
			Subscribe: ['Cycle2u','LaMusette']
		});
	}

};

function addNoContact(name,bike,email,addr,tel,msg,datetime,ip) {
	//print(name,bike,email,addr,tel,msg,datetime,ip);

	// Find by email
	var myCursor = db.contacts.find({Email: email});
	var myDocument = myCursor.hasNext() ? myCursor.next() : null;

	if (myDocument) {
		print("Existing Avoidable Contact", email)

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
		print("Entirely Avoidable Contact", email);
		
		db.contacts.insert({Name: name, 
			Bike: [bike],
			Email: email,
			Address: addr,
			Telephone: tel,
			Booking: [{
				Date: new Date(datetime),
				IP: ip,
				Message: msg
			}],
			Subscribe: []
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

addNoContact("Alyn Stevenson","We have Tandem Shwin 11 months old","alyn1@adam.com.au","12 Australia 11 avenue North Haven S.A. 5018","0400227562",
	"needs gears adjusted and service my wife has a Vito road bike and we have 2 mountain bikes. We would like to get all bikes serviced. My wife has some Tuesdays off and I have some Wednesdays off",
	"20 Jan 2014, 20:44","115.166.6.249");

addContact("Shane Jokela","","shanejokela@gmail.com","50 Hampton st south goodwood","0415088233",
	"I will take whatever the earliest date is you have. Looking for new pads, dura-ace chain and 28 cassette for three peaks. I will give you a call to discuss. Thanks",
	"21 Jan 2014, 20:22","101.119.24.253");

addContact("Warren Jones","2014 HASA R1 road bike with Carbon frame & wheels with Shimano 105 gearing.","warren@auspetandvet.com.au","Auspet & Vet office 48 Birralee Rd regency park SA 5010","0417 620 111",
	"I have just brought this bike from cycling express in Melbourne & it is still in the box in my office around 90% assembled & I was looking around to find someone that could set it up properly for me & fit the bike to me, it is my first bike & my entry into cycling.",
	"23 Jan 2014, 09:00","165.228.207.21");

addContact("Brett Hawkins","Fuji Nevada 29 1.3 2013","plamb7@hotmail.com","9 Newfield Drive Reynella","0423495188",
	"Hi there, I noticed in your synopsis that you specialise in road bikes, I am wondering if you still service mountain bikes at all please? thanks Brett",
	"23 Jan 2014, 09:18","165.228.207.21");

addContact("James Wade","Trek Madone 5.2","jamesdwade@gmail.com","400 King William Street, Adelaide SA 5000","0421846630",
	"Hey, just looking to get a service done on my Madone. It's about 3 months since the last minor service I had. Gears need a minor service and wouldn't mind if you checked out the shape of the wheel bearings.",
	"23 Jan 2014 10:03","120.146.246.106");

addContact("Stuart Ward","Giant Defy SL Advanced","stunhel@hotmail.com","74 Marine Parade, Seacliff, SA","82966352 or 0408146727",
	"We have booked you for 3/2/14 to service and install chains and cassettes on our 2 touring bikes and we still want you to do the job. I have the cassettes and chains. When you fitted a new cassette and chain to my Defy you suggested I replace the compact chain rings. I now have the rings. Can you do this on Monday 3rd or shall I bring the bike down to La Musette on the afternoon of Saturday next?",
	"28 Jan 2014 11:06","1.124.42.154");


// Feb 2014

addContact("mark smith and michael doyle","2 bikes: mark: giant TCR Advanced with Ultegra set mike: Merida","mark.t.smith@det.nsw.edu.au","24 Day Road, Glen Osmond","0414 623184",
	"*Both of us want the bike service and the personalised bike 'fitting'. We are riding in the SuperCycle this year and Ray recommended you. I live in NSW and will be over on 15-16 March (sat-sun). Can we arrange for this service to be done on Saturday 15 march in the early afternoon please? These address provided is Mike's place in Adelaide where i will be staying. thanks Mark",
	"2 Feb 2014 15:54","121.217.35.46");

addContact("Chris Rigg","Canondale Super 6","chris.rigg@kbr.com","27 Sassafras Drive Highbury","0437797310",
	"Also needs bar tape redone. I have the tape.",
	"3 Feb 2014 16:45","161.51.43.45");

addContact("Bernie Davies","roubix with durace","dandbdavies@bigpond.com","192 esplanade brighton","0419813961",
	"Gear adjustment issues",
	"6 Feb 2014 20:58","101.166.32.190");

addContact("Ben Taylor","Boardman team carbon","bentaylors@yahoo.co.uk","44 Lyons circuit,Trott park 5158","0411825358",
	"I bought a secondhand wheel set from you and on the first test ride a spoke snapped. Wondered if you did a service of replacing spokes? And how much it costs?",
	"8 Feb 2014 09:12","219.90.152.2");

addContact("Alex Karatassas","Specialized Roubaix 2010 Enquiry re service and fitting","akaratassas@gmail.com","0412844602",
	"Live at Seaford. Are you available on weekend?",
	"9 Feb 2014 09:22","49.183.178.72");

addContact("Chris Williams","Focus Izalco Pro 4.0 2012","cwilliams@statewide.com.au","146 Augusta St Glenelg East","0417826663",
	"Hi Paul, I've trade up from the Kojima! Chain broke on the weekend - no apparent reason (certainly not my power). I'd like a new chain fitted (just something pretty standard is fine - whatever you recommend) and a service (I'm doing another 1,000 km ride in April). Timing asap, I can deliver to your place out of hours or in-hours at my place can also work. Chris",
	"10 Feb 2014 12:38","203.176.104.70");

addContact("Justin Porter","ORBEA road bike with Campagnolo Centaur components","portsy@me.com","28 Gilbert St OVINGHAM 5082","0413010538",
	"Service, degrease, tune",
	"10 Feb 2014 15:56","1.125.170.145");

addContact("Christian Miles","Reid Falco Elite","christianmiles@hotmail.com","62 Floriedale Road, Greenacres SA 5086","0403200302",
	"Hi Paul I'm relatively new to riding and when in Sydney I bought a new bike from Reid Cycles (Falco Elite). Being a novice, I would like the bike put together properly and would also like to enquire about yearly servicing. Are you able and willing to put bikes together (the Falco comes 85%assembled) but requires the front wheel, turning handlebars and then adjusting the headset, brake and gears. I am currently waiting for it to be delivered, but if you could let me know your charges as well as any further info you need that would be great. I'm in the Greenacres area, just off North East Road. Thanks mate Christian",
	"11 Feb 2014 15:19","203.26.147.254");

addContact("Ashley Leahy","Specialized Tarmac with Full Ultegra 6700 G/S","Ashley.leahy@health.sa.gov.au","6/40 Gilbert St Adelaide (home) Repat General Hospital Daw Park (work)","0421215366",
	"No Mad rush but keen to get it serviced in the next couple of weeks",
	"11 Feb 2014 19:43","182.239.164.219");

addContact("Donny Walford","Orbea Ladies bike.","donny@dwbottomline.com","10 Watson Avenue Rose Park","0414844347",
	"Any chance you can come out today? I have had two punctures in two days of riding - back wheel - so something maybe wrong with my tyre. I am a woman cyclist and mending punctures isn't my forte.",
	"12 Feb 2014 07:39","110.142.52.12");

addContact("Mark Vincent","Orbea Orca, Ultegra 6800","mark.vincent@sapowernetworks.com.au","10B Woodleigh Road, Blackwood 5051","0427580119",
	"Hi Paul, have been referred to you by Ray Morris - I'm one of the Supercycle bunch. Have just upgraded my groupset to 11 speed Shimano, only to find that my Reynolds DV46 carbon clinchers aren't compatible with 11 speed :( Was wondering if you do wheel re-builds? Considering re-building with an 11 speed compatible hub. Do you re-build wheels and/or can recommend anyone good in Adelaide that does? Thanks, Mark",
		"16 Feb 2014 11:45","121.215.182.71");

addContact("Stephen Boyley","Time Fluidity","sboyley@hotmail.com","11 Miller Street Glenelg East","0447043004",
	"Paul - as mentioned need an ensemble swapped out from 10sp to 11sp - this is mechanical. SB",
	"17 Feb 2014 13:31","58.174.191.31");

addContact("Steve","cannondale saeco ( approx1998 )","stephen_68@bigpond.com","1/186 Trimmer Parade Seaton","0418443181",
	"Can you please phone me to discuss an appropriate time for my bike to be serviced.. Steve",
	"17 Feb 2014 13:56","60.242.67.156");

addContact("Alastair Dowler","FUJI Altamira 1.0 BB86","allyd02@bigpond.com","8 rugby St Pasadena","0407606130",
	"Hi Paul, after my prang two weeks ago I got back on my bike for the first time earlier this week. On Tuesday I noticed a strange and unnerving sound coming from the BB or down there somewhere. I just found a spare minute at work and yes the BB is crunchy and clicky. The crank assembly must have taken a hit unbeknown to me at the time. Will you be down at La-Musette tonight or over the weekend. Cheers",
	"20 Feb 2014 15:00","192.43.227.18");

addContact("Crist Constanti","Giant TCR1","con219@iprimus.com.au","45 Russ Ave Seaton SA 5023","0409115296",
	"Wondering when you will have time for a service",
	"24 Feb 2014 22:41","58.179.248.184");

addContact("Scott Ross","Fuji altamera ultegra di 2","scott.ross@bendigoadelaide.com.au","49 Hughes street Unley","0438791799",
	"Can you also assess me for a bike fit.",
	"28 Feb 2014 06:51","49.184.14.232");

// Mar 2014
addContact("Andreas Clark","Cannondale super six evo with SRAM red","andreas.clark@wineaustralia.com","4 Benacre close Glen Osmond","0407232400",
	"Need new bar tape as well",
	"1 Mar 2014 21:05","121.45.106.110");

addContact("Jess","Avanti hybrid","jessica.amy.pollard@gmail.com","","",
	"It is a commuter bike, just needs general service and was hoping I could get of the tyre tubes replaced as part of the service (I can provide the tube)",
	"3 Mar 2014 11:31","124.171.78.139");

addContact("Steve","2014 Focus Izalco Pro","stevereu@tpg.com.au","0412151131",
	"Hi Paul, Im looking at ugrading from Ultergra groupset (excluding cranks and bottom brkt) to Dura Ace. Can get all components online, just wondering what you would charge to fit it all. So, thats rear cassette,brakes,fr & rear derailleurs & cables if nec. I have Fulcrum Racing Zero wheels approx.18 mnths old. Cheers, Steve",
	"3 Mar 2014 14:22","14.203.32.209");

addContact("Michael Doyle","","mdoyle@mitchellchambers.com.au","24 Day Road Glen Osmond 5064","0409991811",
	"Hi Paul. I am riding in supercycle 2014. I have had a bike fit but I would like you to check it and also to do a bike fit for my wife and perhaps to service her bike as well. Could you please give me a ring? 0409991811",
	"6 Mar 2014 15:06","150.101.252.158");

addContact("Pamela Boyle","The bike is a women's avanti 7speed ( I think!)","pamelora@hotmail.com","41 Longview Avenue Belair","0430332273",
	"This bike has not been ridden very much but has been sitting in the garage for nearly a year! It needs tyres pumped and a general good looking over. Thanks",
	"7 Mar 2014 14:17","124.182.241.47");

addContact("Cerri Morgan","Scott CR1 Team 2009","cerri_morgan@yahoo.com","76A Marlborough Street, Henley Beach","0423926818",
	"Hi Paul, you serviced my bike last year and i'm looking to do the same again ready for autumn. Hopefully Wednesday's suit as i am currently working from home those days. Thanks, Cerri",
	"9 Mar 2014 16:16","219.90.214.241");

addContact("Michael","Giant TCR advanced, dura-ace, Reynolds Carbon wheel set","mikecyclesnow@gmail.com","Seaford","",
	"Hi Paul, I'm keen to get my bike serviced but also think it is probably worthwhile replacing the gear and brake cables, as they have seen a fair bit of work including a trip to the alpes last July. I race and train on this bike (different training wheels) and although it is still feeling good, the gears etc. are a bit less precise. How much would you charge to service my bike and replace the cables? Thanks Michael",
	"10 Mar 2014 10:52","219.90.208.136");

addContact("Sam Wellington","Hybrid","wello_1987@hotmail.com","Glynde SA 5070","",
	"Hi, I am looking for a bike service for my hybrid which I ride every day 15km to work. Gears are squeaking and making noise, plus sometimes they slip when I'm riding, am I right in thinking the derailleur may need an adjustment? Many thanks Sam wello_1987@hotmail.com",
	"12 Mar 2014 11:18","203.122.199.80");

addContact("Alycia Mead","Avanti vertali And Fluid men's bike","alycia@live.com.au","Unit 3/24 Gladstone road mile end","0403231908",
	"Just bought a second hand avanti amd want to get it seviced. My husband would also like his fluid hybrid bike to be serviced also. We are not super riders - we will soon be looking at commuting 12km a day however. Can you can do home visits? And how long does a service take? Cheers",
	"12 Mar 2014 15:58","49.183.233.210");

addContact("Anne-Marie Oates","Giant Suede","amo414@live.com.au","5 Cormorant Court, West Lakes Shore 5020","0431414732",
	"The back tyre tube needs replacing. I would like a service after the bike does not feel right after an interstate move",
	"13 Mar 2014 14:43","118.210.229.148");

addContact("James Martin","Norco Blast road bike.","james@insiderfoundry.com","Lvl 2, 14 Grenfell St, Adelaide, SA, 5000","0403680876",
	"Hi, I work in a co-working space called the Majoran Distillery, and a few of the guys here ride bikes. If I can get 3 bikes to be serviced, how much would it cost for you to come out and do the service?",
	"19 Mar 2014 09:41","58.96.111.149");

addContact("Daniel Bird","Bianchi Sempre Shimano 105","dmbird@gmail.com","310 Young Street Wayville","0412485108",
	"Hi Paul, Looking to have my bike serviced and gear tune. Needs full degrease and re-lube. Also I ant get my garmin GSC to read the cadence sensor? I think the margins are too large as my fsa cranks are concave?? You'll certainly be able to get it all working I'm sure. Dan",
	"19 Mar 2014 16:52","182.239.156.224");

addContact("Mark Elliott","Giant Defy 2012 Shimano 105 Groupset","mark@electricsuper.com.au","74A Gladstone Road, North Brighton SA 5048","0403169536",
	"Riding in 'Supercycle' charity ride in April",
	"20 Mar 2014 14:31","124.171.78.192");

addContact("Mark Britton","Studds 100","mark.britton@dtz.com","16 Gray Street Adelaide 5000","0428 461599",
	"Hi, I have ridden new bike to work this morning but it desperately needs derrailleurs setting up correctly ( front and rear). Could you confirm a price and how soon you would be able to get to it? Thanks Mark",
	"24 Mar 2014 09:06","1.124.170.162");

addContact("david donovan","Pinarello F4-15","donovan@internode.on.net","","0410124943",
	"rear hanger out of alignment and left brake hood",
	"24 Mar 2014 12:46","1.124.85.66");

addContact("Ray","Orbea CARPE 10. Has had rear spokes replaced with thicker spokes to deal with thicker rider otherwise stock bike.","piercingdragoneyes@hotmail.com","North Adelaide","0400272921",
	"Rear wheel out of true and likely broken spoke may be culprit (black fat spokes). Rear derailer is skipping all over shop. Rear tire needs replacing. Last service introduced screeching breaks and doesn't stop on dime anymore :( - previous mechanic not qualified for hydraulic setup (apparently). Otherwise a general service. Only available after hours. Bike not wanted on road until Friday 4th April. Can do?",
		"30 Mar 2014 15:43","58.174.177.5");


addContact("Crist Constanti","Giant TCR Advanced with Ultegra SL Group set","con219@iprimus.com.au","45 Russ Ave Seaton","0409115296",
	"My favorite bike man. I sold the Giant and bought another. Need you to do a service and assist in adjusting the foot pedal clip tension. :) Hope the holiday gave you that well deserved break.",
	"31 Mar 2014 10:43","58.179.233.234");

// April 2014

addContact("Brenton","Bianchi Sempre Pro DI2 Ultegra","brenton@pikeconstructions.com.au","49 Alison St, Glenelg North.","0418995179",
	"Hi Paul, I need a new chain on my bike. I have the new chain so just need the old one removed and the new one put on. Can you help me with this? If so when would be a good time to do it? I am close to La Musette cafe if that helps? Can meet you there?",
	"3 Apr 2014 16:42","150.101.19.58");

addContact("Paul Voivodich","Shogun Trail Breaker 3. Mountain Bike.","pvoivodich@bigpond.com","13. Botanic Ave. Flagstaff Hill. 5159.","0418853664",
	"Bike hasnt been ridden for a few years. I want to have it serviced and a punture repaired to start riding again.",
	"7 Apr 2014 10:41","101.103.141.101");

addContact("david donovan","Pinarello F4-15","donovan@internode.on.net","","0410124943",
	"Rear hanger alignment probably out-Campag 10 speed",
	"8 Apr 2014 09:45","118.210.227.5");


// May 2014

addContact("Billy Ip","Azzurri Fonza Road Bike","billy.mc.ip@gmail.com","15 Stanford Avenue Novar Gardens 5040","0478402697",
	"Would like to be fitted for the bike also",
	"2 May 2014 15:07","118.210.4.60");

addContact("John Markesinis","Orbea road bike About 3 years old","theshed091@bigpond.com.au","","84314172 home",
	"Any chance any afternoon this week?",
	"6 May 2014 13:52","101.166.69.111");

addContact("Celeste O'Reilly","My son needs his tire fixed - it has a puncture and he needs his breaks fixed. He wants to practice tomorrow for PedalPrix.","celeste@opinvest.com.au","199 Windebanks rd Aberfoyle Park","61449029927",
	"I can bring the bike in today if it can be fixed today or by tomorrow!",
	"31 May 2014 11:07","115.166.28.99");

// Jun 2014

addContact("Michael Simms","Trek Madone 5.9SL 2007 Durace running gear, SRAM Red cluster SRAM S40 front rim, SRAM S60 rear","simmsydos@gmail.com","21 Glen Rowan Road, Woodville South, 5011","0413905596",
	"Hello Paul, I met you this morning (7th) at the cafe. I had the broken spoke to the front rim. Could I book a service & fix of the front spoke please? Regards, Mike",
	"7 Jun 2014 19:01","182.239.197.135");

addContact("steve martin","focus cayo,sram force group set,the rear derailleur isn't shifting properly,moving down gears,keeps jumping back up","stevemartin25@y7mail.com","65 Cambridge st pt Noarlunga sth 5167","0416130348",
	"hope you can come this far south thankyou",
	"8 Jun 2014 10:05","49.184.86.205");

addContact("Darren McInnes","Specialized S Works Tarmac SL3 (SRAM Red)","darren@livingtothemax.com.au","253 The Parade, Beulah Park","0412932227",
	"In addition to service, I'd like to replace the handle bar tape and check some movement in front stem.",
	"11 Jun 2014 15:09","118.210.230.26");

addContact("Crist Constanti","Giant TCR","con219@iprimus.com.au","45 Russ Ave Seaton","0409115296",
	"Hi Paul Went for my first ride today on the new white tcr to Glenelg and back on the cycle track. I also had to ride on the road to get there. It did leave me rather anxious whilst on the road but I managed to overcome my fear and within 10 minutes all was good. I just love it and now realise how much I missed it. The noise from the crank seems to come and go as I was riding. It would be silent for a while and then start up again. It sounded like a crunching noise today. The beauty of the cycle track is the serenity and hence nuances are heard easier. Anyway will be monitoring it. I think it is bearings.",
	"20 Jun 2014 14:35","58.179.236.63");

