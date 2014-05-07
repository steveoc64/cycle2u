A website for Cycle2U mobile bike mechanic.

This project takes a standard existing PHP website, and converts it into a GO application.

The old site is a standard brochureware website, with a contact form that generates
an email, with no persistent database. 

The new site maintains the old look and functionality for existing customers, but then
adds the following features :

- Uses an embedded database (statically linked into the GO executable), that needs
  no 3rd party wares
- Data entered into the form persists in a (NoSQL) database
- Site owner can access the "workshop", which allows CRUD on the database
- Site owner can create newsletters, and push these out to all subscribers
- Customers can login to the new site, and access their history
- Customer Realtime Chat via websockets, if the site owner is currently online

This is a (live-fire) exersize to see how easy/painful it is to take an existing, standard sort of site
and migrate it to GO without going completely overboard.
