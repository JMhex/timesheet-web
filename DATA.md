# timesheet: What data we keep

##What we store : Client id, date per entry, task, hours, the timestamp at which the entry was created, additional notes and the user id.

##Who can see it: The data stored into the database cannot be viewed by anyone other than the user who has created the entry and those who have admin privelages. 

##Where it lives: The Data lives in Supabase Database. Logic is as follows Entries -> auth.user.id -> profiles. 

##How someone's data is deleted : Stored data can be deleted once a user signs in. Each individual entry has a delete button which, once clicked deletes the corresponding entry effectively removing it from the database permanently.

##Known gaps: The "Prevent use of leaked passwords" functionality could not be implemented due to the Supabase registration plan being the free version. If this feature is desired an upgrade to the Pro Version is recommended. 

##“Prevent use of leaked passwords” stops people from choosing a password that has already appeared in a data breach.1