function getDay() {
  var today = new Date()
  var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()

 return date 
}


function createSheet(runName) {  
  var responses = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Responses")
  var newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet()
  newSheet.setName(runName)
  
  SpreadsheetApp.getActiveSpreadsheet().moveActiveSheet(3)
  
  var responsesRange = responses.getRange(1, 1, 2, responses.getLastColumn())
  var responsesValue = responsesRange.getValues()
  
  newSheet.appendRow(responsesValue[0])
}


function filterDays() {
  var responses = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Responses")
  
  var startRow = 2
  var startColumn = 1
  var lastRow =  responses.getLastRow() - 1
  var lastColumn = responses.getLastColumn()
  
  var responsesRange = responses.getRange(startRow, startColumn, lastRow, lastColumn)
  var responsesValues = responsesRange.getValues()
  
  //filters applied to selection
  var filter_law = ["Lawyer", "Law Student"]
  var filter_avail = ["By checking this box, you are letting us know that you are available all day on November 3 to volunteer as a poll observer."]
  
  
  //creates new sheet for each day of submissions and adds that day's target entries (if satisfies lawyer and availability filters)
  for (var i in responsesValues) {
    
    var row = responsesValues[i]
    var timestamp = new Date(Date.parse(row[0]))
    var lawyer = row[5]
    var availability = row[6]
    
    var month = timestamp.getMonth() + 1
    var day = timestamp.getDate()
    var year = timestamp.getFullYear()
    
    var dateUTC = new Date(Date.UTC(year, month, day))
    var date = month + '/' + day + '/' + year
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(date)
    
    if (!sheet) {
      //case 1 : no sheet exists -- creates sheet and adds entry if satisfies filters
      createSheet(date)
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(date)
      
      if (filter_law.includes(lawyer) && filter_avail.includes(availability)) {
        sheet.appendRow(row)
      }
      
    } else {
      
      //case 2 : sheet exists -- stores index of last row
      var lastRun = sheet.getLastRow()
      
      //case 2.A : sheet has prexisting data -- checks if current entry's timestamp has already been accounted for, adds entry if satisfies filters
      if (lastRun != 1) {
        SpreadsheetApp.setActiveSheet(sheet)
        SpreadsheetApp.getActiveSpreadsheet().moveActiveSheet(3)    //corrects cases in which data entry timestamp is misplaced
        
        var timeRange = sheet.getRange(startRow, startColumn, lastRun, startColumn)
        var timeValues = timeRange.getValues()
        var timestamps = ArrayLib.countif(timeValues, timestamp)

        if (timestamps == 0) {
          if (filter_law.includes(lawyer) && filter_avail.includes(availability)) {
            sheet.appendRow(row)
          }
        }
        
      } else {
        
        //case 2.B : sheet has no data -- adds entry if satisfies filters
        if (filter_law.includes(lawyer) && filter_avail.includes(availability)) {
            sheet.appendRow(row)
          }
        
      } //end of if / else checking sheet's prexisting data 
           
    } //end of if / else checking if sheet exists
      
  } //end of for loop iterating entries
  
}


function main() {
  var runName = getDay()
  
  filterDays()
}
