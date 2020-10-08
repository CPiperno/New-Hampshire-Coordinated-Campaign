**Reverse Phone Numbers_Milford.ipynb** <br />
The Reverse Phone Number Lookup uses Ekata's Reverse Phone API to find the people, age, gender, location, etc. associated with a given phone number. We are adding this information to current voter profiles in New Hampshire so it can then be used in text banks.

This particular project focused on pulling numbers from Milford, New Hampsire, but it can easily be modified to run using other input. The Jupyter Notebook is divided into various parts, depending on what one's goal is, and each section can be used in isolation. The project was built with Pandas dataframes and active Ekata keys. It is important to note that an Ekata Reverse Phone API account must be established prior to run (https://ekata.com/reverse-phone-api-trial/)!


**Voter Protection.gs** <br />
Built automated script in Google App Script to filter through responses from a New Hampshire volunteer form and save them in their respective sheet (classified by that day's responses).

The form is compiled by residents of New Hampshire and neighboring states who are interested in serving as Poll Workers during the 2020 Election cycle. 
The script favors volunteers who report being lawyers or current law students, as well as those indicating their full availability on Election day.


**Yard Sign Distribution.gs** <br />
Built automated script in Google App Script to filter through responses from a New Hampshire yard sign distribution form. Entries from Belknap County are filtered and added to a new spreadsheet which is later emailed to the Belknap County Clerk each night. 
