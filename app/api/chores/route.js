import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request) {
  const { user, week } = request.nextUrl.searchParams;  // Extract the user and week from query parameters

  // Construct the path to the Excel file in the public folder
  const workbookPath = path.join(process.cwd(), 'public', 'Household_Rota.xlsx');

  try {
    // Read the Excel file using promises
    const fileBuffer = await fs.readFile(workbookPath);  // This reads the file as a buffer
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });  // Parse the buffer into a workbook
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Debug: Log the full data
    console.log('Data from Excel:', data);
    console.log('Selected week:', week);

    // Find the row for the selected week
    const selectedWeekData = data.find(row => row['Week Starting'] === week);

    console.log('Selected week data:', selectedWeekData);

    if (!selectedWeekData) {
      return NextResponse.json({ error: 'Week not found' }, { status: 404 });
    }

    // Extract the tasks for the given user
    const userTasks = Object.entries(selectedWeekData)
      .filter(([task, person]) => person === user)  // Filter tasks where the user is assigned
      .map(([task]) => task);  // Extract only the task names

    console.log('User tasks:', userTasks);

    return NextResponse.json({ tasks: userTasks });
  } catch (error) {
    console.error('Error accessing file:', error);
    return NextResponse.json({ error: `Cannot access file ${workbookPath}` }, { status: 500 });
  }
}
