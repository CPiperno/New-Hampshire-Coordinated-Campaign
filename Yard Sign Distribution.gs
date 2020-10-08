//returns current date and time to be used as the run's timestamp
function getTime() {
  var today = new Date();
  
  var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  
  //formated to match form submission timestamp
  return (date + ' ' + time)
}


//filters through Belknap towns and adds new entries to (1) log and (2) new timestamped sheet to be mailed out to County Clerk
function findBelknapTowns() {
  var belknapTowns = ['laconia', 'gilford', 'belmont', 'gilmanton', 'meredith', 'tilton', 'sanbornton', 'new hampton', 'alton', 'alton bay', 'center harbor', 'barnstead']
  const time = getTime()
  
  var form = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("towns")
  var runs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("runs")
  
  //creates new timestamped sheet to be mailed out
  var ID = createSheet(time)
  var runsToSend = SpreadsheetApp.openById(ID)
  runsToSend.appendRow(['Timestamp', 'Email Address', 'First Name', 'Last Name', 'City/Town', 'Zip', 'What is your state? (This form is only for NH residents)', 'Do you want to volunteer with Biden for President and the Organize NH Coordinated Campaign'])
  
  var startRow = 2
  var startColumn = 1
  var lastRunTime = 0
  
  //retrieves timestamp of last entry of last run and parses into comparable format (milliseconds)
  var lastRun = runs.getLastRow()

  if (lastRun != 1) {
    var runsRange = runs.getRange(lastRun, startColumn, lastRun, runs.getLastColumn())
    var runsArray = runsRange.getValues()
    lastRunTime = Date.parse(runsArray[0][0])
  }
  
  //iterates through all form submissions
  var lastRow = form.getLastRow()
  var lastColumn = form.getLastColumn()

  var formRange = form.getRange(startRow, startColumn, lastRow, lastColumn)
  var formArray = formRange.getValues()
 
  for (var i in formArray) {
    var row = formArray[i]
    var timeStamp = Date.parse(row[0])
    var email = row[1]
    var firstName = row[2]
    var lastName = row[3]
    var town = row[4]
    var zip = row[5]
    var state = row[6]
    var volunteer = row[7]
    
    //compares timestamps and adds new submissions to 'runs' sheet
    if (timeStamp > lastRunTime) {
      if (belknapTowns.includes(town.toString().toLowerCase())) {
        
        //adds belknap entries in sheet 'runs'
        var entry = [time, email, firstName, lastName, town, zip, state, volunteer]
        runs.appendRow(entry)
        
        //adds belknap entries in sheet 'run_timestamp' to be emailed
        var entry2 = [row[0], email, firstName, lastName, town, zip, state, volunteer]
        runsToSend.appendRow(entry2)
      }
    }
  }
  
  //sends email to Belknap County Clerk
  sendEmailAttachment(ID)
}


//creates new spreadsheet and returns its ID
function createSheet(time) {
  var name = ("Run -- " + time)
  
  var newSheet = SpreadsheetApp.create(name)
  var ID = newSheet.getId()
  Logger.log(newSheet.getUrl())
 
  return ID
}


//saves new runs sheet as a pdf and emails it out to the County Clerk
function sendEmailAttachment(Id) {
  var file = DriveApp.getFileById(Id)
  
  var recipient = "piperno14@gmail.com"
  var subject = "Belknap County Yard Signs -- " + getTime()
  var body = "Run "
  
  MailApp.sendEmail(recipient, subject, body, {attachments: [file.getAs(MimeType.PDF)]})
}
