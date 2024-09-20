import * as XLSX from 'xlsx';
import { join } from 'path';
import { promises as fs } from 'fs';

// Function to convert a date (like "21/09/2024") to an Excel serial number
function dateToExcelSerialNumber(dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day)); // Use UTC to avoid timezone issues
  
  // Excel's reference start date (December 30, 1899) in UTC
  const excelStartDate = new Date(Date.UTC(1899, 11, 30));

  const diffInTime = date.getTime() - excelStartDate.getTime(); // Difference in milliseconds
  
  const diffInDays = diffInTime / (1000 * 3600 * 24); // Convert milliseconds to days
  
  return Math.round(diffInDays); // Round to avoid floating-point issues
}

// Function to structure the data by users and chores
function getUserChoresByWeek(data, excelSerialWeek) {
  // Find the row for the specific Excel serial week
  const weekData = data.find(row => row['Week Starting'] === excelSerialWeek);
  
  if (!weekData) {
    return {};  // If no data for the requested week, return an empty object
  }

  // Initialize an empty object to hold the chores for each user
  const userChores = {};

  // Iterate through the columns, skipping the 'Week Starting' column
  Object.keys(weekData).forEach(col => {
    if (col !== 'Week Starting') {
      const user = weekData[col];
      if (user) {
        if (!userChores[user]) {
          userChores[user] = [];
        }
        userChores[user].push(col);
      }
    }
  });

  return userChores;
}

// Named export for handling GET requests
export async function GET(req) {
  const url = new URL(req.url);
  const user = url.searchParams.get('user');
  const week = url.searchParams.get('week');

  if (!week) {
    return new Response(JSON.stringify({ error: 'Missing week parameter' }), {
      status: 400,
    });
  }

  // Convert the week string (e.g., "21/09/2024") to Excel serial number
  const excelSerialWeek = dateToExcelSerialNumber(week);
  console.log("Excel Serial Week:", excelSerialWeek); // Debugging to verify the serial number

  try {
    // Path to the Excel file in the 'public' folder
    const filePath = join(process.cwd(), 'public', 'Household_Rota.xlsx');
    
    // Read the Excel file
    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    // Convert the Excel data to JSON
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Get the chores for the requested week (based on the Excel serial number)
    const userChores = getUserChoresByWeek(sheetData, excelSerialWeek);
    console.log("User Chores:", userChores); // Debugging

    if (user && userChores[user]) {
      return new Response(JSON.stringify({ tasks: userChores[user] }), {
        status: 200,
      });
    } else if (user && !userChores[user]) {
      return new Response(JSON.stringify({ error: 'No chores found for this user in the given week' }), {
        status: 404,
      });
    } else {
      // Return all chores for all users for the given week
      return new Response(JSON.stringify(userChores), {
        status: 200,
      });
    }
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return new Response(JSON.stringify({ error: 'Failed to load chores' }), {
      status: 500,
    });
  }
}
