<?php
// contact.php

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'message' => 'Método no permitido']);
  exit;
}

// Leer JSON del body
$input = json_decode(file_get_contents('php://input'), true);

$email      = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
$alias      = trim($input['alias'] ?? '');
$comentario = trim($input['comentario'] ?? '');

// Validaciones básicas
if (!$email || !$alias || !$comentario) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'Faltan datos obligatorios']);
  exit;
}

// Datos del correo
$to      = 'contacto@delitiare.mx';
$subject = 'Nuevo mensaje desde el formulario de Delitiāre';

$body = "Tienes un nuevo mensaje desde delitiare.mx:\n\n";
$body .= "Correo: {$email}\n";
$body .= "Alias: {$alias}\n\n";
$body .= "Comentario:\n{$comentario}\n\n";
$body .= "Enviado el: " . date('Y-m-d H:i:s') . "\n";

// Cabeceras
$headers  = "From: Delitiāre <no-reply@delitiare.mx>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
  echo json_encode(['ok' => true, 'message' => 'Mensaje enviado correctamente']);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'message' => 'Error al enviar el correo']);
}