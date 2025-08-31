<?php
header('Content-Type: text/csv');

// URL de tu hoja de cálculo publicada en Google Sheets
$googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTu5-zivnn-dNKJRuS3E3J2FE43fETSXFUbfej726soomXHHbTiIMYKSQrW_rkKOjwrsXENJZEwBP7_/pub?output=csv';

// Hacer la petición a Google Sheets
$csvData = file_get_contents($googleSheetsUrl);

// Enviar los datos al navegador
echo $csvData;

?>