import * as XLSX from 'xlsx';

/**
 * Normalizes Excel column header names for flexible matching.
 */
const normalizeHeader = (header) => {
  if (!header) return '';
  return String(header).toLowerCase().replace(/[^a-z0-9]/g, '');
};

/**
 * Parses an Excel file (.xlsx, .xls, .csv) and returns formatted participant records.
 * Expected headers:
 * - Serial Number (S.No, Sr No, Serial No, SNo)
 * - Customer Name (Name, Participant Name, Customer)
 * - Phone Number (Phone, Mobile, Contact)
 * - Invoice Number (Invoice No, Invoice, Invoice#)
 */
export const parseParticipantsExcel = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          reject(new Error('Excel file contains no worksheets.'));
          return;
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert sheet to raw 2D array to identify headers accurately
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        if (!rows || rows.length < 2) {
          reject(new Error('Excel file must contain at least a header row and 1 data row.'));
          return;
        }

        // Row 0 is header
        const rawHeaders = rows[0].map(h => String(h || '').trim());

        // Header indexes
        let sNoIdx = -1;
        let nameIdx = -1;
        let phoneIdx = -1;
        let invoiceIdx = -1;

        rawHeaders.forEach((h, idx) => {
          const norm = normalizeHeader(h);
          if (['serialnumber', 'sno', 'srno', 'serialno', 'id', 'slno'].includes(norm)) {
            sNoIdx = idx;
          } else if (['customername', 'name', 'participantname', 'customer', 'clientname'].includes(norm)) {
            nameIdx = idx;
          } else if (['phonenumber', 'phone', 'mobile', 'mobilenumber', 'contact', 'contactno'].includes(norm)) {
            phoneIdx = idx;
          } else if (['invoicenumber', 'invoiceno', 'invoice', 'invoicenum', 'billno'].includes(norm)) {
            invoiceIdx = idx;
          }
        });

        // Fallback search if exact norm didn't match
        rawHeaders.forEach((h, idx) => {
          const norm = normalizeHeader(h);
          if (sNoIdx === -1 && norm.includes('serial')) sNoIdx = idx;
          if (nameIdx === -1 && (norm.includes('name') || norm.includes('customer'))) nameIdx = idx;
          if (phoneIdx === -1 && (norm.includes('phone') || norm.includes('mobile') || norm.includes('contact'))) phoneIdx = idx;
          if (invoiceIdx === -1 && (norm.includes('invoice') || norm.includes('bill'))) invoiceIdx = idx;
        });

        // If headers not found, default by position (0: Serial, 1: Name, 2: Phone, 3: Invoice)
        if (sNoIdx === -1) sNoIdx = 0;
        if (nameIdx === -1) nameIdx = 1;
        if (phoneIdx === -1) phoneIdx = 2;
        if (invoiceIdx === -1) invoiceIdx = 3;

        const parsedParticipants = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.every(cell => String(cell).trim() === '')) continue; // skip blank rows

          const rawSNo = row[sNoIdx] !== undefined ? String(row[sNoIdx]).trim() : String(i);
          const rawName = row[nameIdx] !== undefined ? String(row[nameIdx]).trim() : '';
          const rawPhone = row[phoneIdx] !== undefined ? String(row[phoneIdx]).trim() : '';
          const rawInvoice = row[invoiceIdx] !== undefined ? String(row[invoiceIdx]).trim() : '';

          if (!rawName && !rawInvoice && !rawPhone) continue; // skip empty data

          // Format invoice number to 3-digit minimum string if numeric
          let formattedInvoice = rawInvoice;
          if (/^\d+$/.test(rawInvoice)) {
            formattedInvoice = String(rawInvoice).padStart(3, '0');
          }

          parsedParticipants.push({
            id: `usr_xl_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`,
            sNo: rawSNo || String(i),
            name: rawName || 'Unnamed Client',
            phone: rawPhone || '---',
            invoiceNo: formattedInvoice || String(i).padStart(3, '0'),
            timestamp: new Date().toISOString(),
            status: 'REGISTERED'
          });
        }

        if (parsedParticipants.length === 0) {
          reject(new Error('No valid participant data rows found in the Excel file.'));
          return;
        }

        resolve({
          participants: parsedParticipants,
          totalCount: parsedParticipants.length,
          sheetName: firstSheetName
        });
      } catch (err) {
        reject(new Error(`Failed to parse Excel file: ${err.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file from disk.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Downloads a sample Excel template for participant imports.
 */
export const downloadSampleExcel = () => {
  const sampleData = [
    { "Serial Number": "1", "Customer Name": "Rahul Sharma", "Phone Number": "9876543210", "Invoice Number": "001" },
    { "Serial Number": "2", "Customer Name": "Priya Patel", "Phone Number": "9812345678", "Invoice Number": "002" },
    { "Serial Number": "3", "Customer Name": "Amit Kumar", "Phone Number": "9988776655", "Invoice Number": "003" },
    { "Serial Number": "4", "Customer Name": "Sneha Gupta", "Phone Number": "9765432109", "Invoice Number": "004" },
    { "Serial Number": "5", "Customer Name": "Vikram Singh", "Phone Number": "9654321098", "Invoice Number": "005" }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

  XLSX.writeFile(workbook, "Sample_Participant_Import_Template.xlsx");
};
