let date = new Date();
let monthIndex = 0;
let monthNumber = 0;
let dayNumber = 0;
const FILE = 'YOUR_FILE_ID_GOES_HERE'; //File ID of the file to be copied
const FOLDER = 'YOUR_STARTING_FOLDER_ID_GOES_HERE'; //Folder ID of the base Daily Shift Router Logs folder
const TWO_DIGIT_YEAR = date.getFullYear().toString().substr(-2);

function doGet()
{
    const NEW_FILE = DriveApp.getFileById(FILE);
    // Call function to build the file name string
    buildFileName();

    //Checking the folder iterator looking for a folder Id of the folder that matches the string folder name
    let HTMLString = "<style> h1, p {font-family: 'Helvetica', 'Arial'} </style>" + "<h1>" + getPaddedMonthNumber() + "-" + getPaddedDayNumber() + "-" + TWO_DIGIT_YEAR;
    let files = DriveApp.getFolderById(getFolder()).getFilesByName('' + getPaddedMonthNumber() + '-' + getPaddedDayNumber() + '-' + date.getFullYear().toString().substr(-2));
    // Output to let the user know folder creation was (un)successful
    if (!files.hasNext())
    {
        NEW_FILE.makeCopy(getPaddedMonthNumber() + '-' + getPaddedDayNumber() + '-' + TWO_DIGIT_YEAR, folderId);
        HTMLString += " successfully created!</h1>";
        HTMLOutput = HtmlService.createHtmlOutput(HTMLString);
        return HTMLOutput;
    }
    else
    {
        HTMLString += " file already exists, no new file created.</h1>";
        HTMLOutput = HtmlService.createHtmlOutput(HTMLString);
      Logger.log("Good Boy");
      Logger.log(HTMLString);
        return HTMLOutput;
    }

}

// Check whether it is a leap year
function checkLeapYear(year)
{
    let leapYear = true;
    if (year % 4 != 0 || (year % 100 == 0 && year % 400 != 0))
    {
        leapYear = false;
    }
    return leapYear;
}

// Detects the proper current day and updates day and month if necessary
// TODO: Think of a better name for the function....
function buildFileName()
{
    setMonthIndex(date.getMonth());
    setMonthNumber((date.getMonth() + 1).toString());
    const year = date.getFullYear();
    const time = date.getUTCHours();
    leapYear = checkLeapYear(year);

    //Handling Mid shift date requirements
    if (time >= 4 && time < 7)
    {
        setDayNumber(date.getDate() + 1);
        day = '' + getPaddedDayNumber();
        if (monthIndex === 0 || monthIndex === 2 || monthIndex === 4 || monthIndex === 6 || monthIndex === 7 || monthIndex === 9 || monthIndex === 11)
        {
            // If the new day is the 32nd during a month that has 31 days, reset day to 01 and add one to month
            if (day === '32')
            {
                setMonthIndex(getMonthIndex() + 1);
                setMonthNumber((date.getMonth() + 2).toString());
                setDayNumber('01');
            }
        }
        if (monthIndex === 1)
        {
            // If the new day is the 29 during February on a non-leap-year, reset day to 01 and add one to month
            if (day === '29' && leapYear === false)
            {
                setMonthIndex(getMonthIndex() + 1);
                setMonthNumber((date.getMonth() + 2).toString());
                setDayNumber('01');
            }
            // If the new day is the 30 during February on a leap-year, reset day to 01 and add one to month
            else if (day === '30')
            {
                setMonthIndex(getMonthIndex() + 1);
                setMonthNumber((date.getMonth() + 2).toString());
                setDayNumber('01');
            }
        }
        if (monthIndex === 3 || monthIndex === 5 || monthIndex === 8 || monthIndex === 10)
        {
            // If the new day is the 31st during a month that has 30 days, reset day to 01 and add one to month
            if (day === '31')
            {
                setMonthIndex(getMonthIndex() + 1);
                setMonthNumber((date.getMonth() + 2).toString());
                setDayNumber('01');
            }
        }
    }
    // Otherwise just set the date (this is outside the time zone window established above)
    else
    {
        setDayNumber(date.getDate().toString());
    }
}

function setDayNumber(num)
{
    dayNumber = num;
}
function getDayNumber()
{
    return dayNumber;
}
function getPaddedDayNumber()
{
    let day = getDayNumber();
    if (day.length === 1)
    {
        day = '0' + day; // Padding single digit days with a 0
    }
    return day;
}
function setMonthNumber(num)
{
    monthNumber = num;
}
function getMonthNumber()
{
    return monthNumber;
}
function getPaddedMonthNumber()
{
    let monthNum = getMonthNumber();
    if (monthNum.length === 1)
    {
        monthNum = '0' + monthNum; // Padding single digit months with a 0
    }
    return monthNum;
}
function setMonthIndex(index)
{
    monthIndex = index;
}
function getMonthIndex()
{
    return monthIndex;
}
function getMonthName(index)
{
    // String array to convert numerical month to string
    const MONTHS = ['January', 'February',
        'March', 'April',
        'May', 'June',
        'July', 'August',
        'September', 'October',
        'November', 'December'];
    return MONTHS[index];
}

function getFolder()
{
    let checkMonth = '' + getPaddedMonthNumber() + ' - ' + getMonthName(getMonthIndex());
    let folder;
    let checkFolder;
    // Starting from the daily log folder, find the year, then month
    let folderYear = DriveApp.getFolderById(FOLDER).getFolders();
    while (folderYear.hasNext())
    {
        folder = folderYear.next();
        // When found, get the Id and load to folderID
        if (folder.getName() === '' + date.getFullYear())
        {
            checkFolder = folder.getId();
            folderId = DriveApp.getFolderById(folder.getId()).getFolders();
        }
    }
    let folderMonth = DriveApp.getFolderById(checkFolder).getFolders();
    while (folderMonth.hasNext())
    {
        folder = folderMonth.next();
        if (folder.getName() === checkMonth)
        {
            checkFolder = folder.getId();
            folderId = DriveApp.getFolderById(folder.getId());
        }
    }
    return checkFolder;
}
