const xlsx = require('xlsx');
const fs = require('fs');

const rows = [
  {
    identifier: 'bulkstu1',
    name: 'Bulk Student One',
    email: 'bulkstu1@example.com',
    defaultPassword: 'BulkPass123A',
    role: 'student',
  },
  {
    identifier: 'bulkalumni1',
    name: 'Bulk Alumni One',
    email: 'bulkalumni1@example.com',
    defaultPassword: 'BulkPass123A',
    role: 'alumni',
  },
];

const ws = xlsx.utils.json_to_sheet(rows);
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

const outPath = 'test_users.xlsx';
xlsx.writeFile(wb, outPath);
console.log('Wrote', outPath);
